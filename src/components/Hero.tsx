import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';

interface HeroProps {
  lang?: Language;
}

const AUDIO_PREF_KEY = 'yehudales_hero_sound_pref';

export const Hero: React.FC<HeroProps> = ({ lang = 'he' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Audio Engine State & Refs
  const isHeroVisibleRef = useRef<boolean>(true);
  const desiredGainRef = useRef<number>(1.0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isAudioConnectedRef = useRef<boolean>(false);
  const hasUnlockedAudioRef = useRef<boolean>(false);

  // Playback & Geometry State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [heroHeight, setHeroHeight] = useState<number>(0);
  const [isScrolledPast, setIsScrolledPast] = useState<boolean>(false);
  const isPlayPendingRef = useRef<boolean>(false);

  // User manual audio preference state (defaults to active sound unless explicitly set to muted)
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const pref = sessionStorage.getItem(AUDIO_PREF_KEY);
    return pref === 'muted';
  });
  const isMutedRef = useRef<boolean>(isMuted);

  // Synchronize ref with state without touching JSX video props
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // --------------------------------------------------------------------------
  // PART 1 — VIDEO ENGINE (Muted Startup, Autonomous Lifecycle)
  // --------------------------------------------------------------------------

  // Race-safe playback initiator: tracks promise lifecycle without permanent lock
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      setIsPlaying(true);
      return;
    }

    if (isPlayPendingRef.current) return;

    // Enforce native muted & playsInline configuration before audio unlock
    if (!hasUnlockedAudioRef.current) {
      video.muted = true;
      video.defaultMuted = true;
    }
    video.playsInline = true;

    isPlayPendingRef.current = true;
    const playPromise = video.play();
    if (playPromise !== undefined && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          isPlayPendingRef.current = false;
          setIsPlaying(true);
        })
        .catch(() => {
          // Playback blocked or interrupted; release flag immediately to permit subsequent gesture attempt
          isPlayPendingRef.current = false;
        });
    } else {
      isPlayPendingRef.current = false;
      setIsPlaying(true);
    }
  }, []);

  // Callback ref: configures synchronous native DOM attributes on mount and starts playback
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node) {
      // 1. Immediately set native media attributes required for mobile autoplay compliance
      if (!hasUnlockedAudioRef.current) {
        node.muted = true;
        node.defaultMuted = true;
        node.setAttribute('muted', '');
      }
      node.volume = 1.0;
      node.playsInline = true;
      node.autoplay = true;
      node.loop = true;
      node.preload = 'auto';
      node.setAttribute('playsinline', '');
      node.setAttribute('webkit-playsinline', '');
      node.setAttribute('x5-playsinline', '');
      node.setAttribute('autoplay', '');
      node.setAttribute('loop', '');
      node.removeAttribute('controls');

      // 2. Playback startup:
      // If browser already has current data (readyState >= 2), start immediately.
      // Otherwise, wait strictly for earliest native readiness event without artificial delay.
      if (node.readyState >= 2) {
        attemptPlay();
      } else {
        const onMediaReady = () => {
          node.removeEventListener('canplay', onMediaReady);
          node.removeEventListener('loadeddata', onMediaReady);
          attemptPlay();
        };
        node.addEventListener('canplay', onMediaReady, { once: true });
        node.addEventListener('loadeddata', onMediaReady, { once: true });
      }
    }
  }, [attemptPlay]);

  // --------------------------------------------------------------------------
  // PART 2 — AUDIO ENGINE (Lazy Graph, Authoritative Touchstart Unlock, Gain Control)
  // --------------------------------------------------------------------------

  // Immediate audio stop helper: cancels all scheduled ramps and zeroes GainNode instantly
  const stopAudioImmediately = useCallback(() => {
    const ctx = audioCtxRef.current;
    const gainNode = gainNodeRef.current;
    if (gainNode && ctx) {
      try {
        const now = ctx.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(0, now);
      } catch {}
    }
  }, []);

  // Safe lazy Web Audio API Graph Initialization (connected only once per video element)
  const initAudioGraph = useCallback(() => {
    const video = videoRef.current;
    if (!video) return null;

    if (gainNodeRef.current && isAudioConnectedRef.current) {
      return gainNodeRef.current;
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return null;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;

      if (!sourceNodeRef.current) {
        sourceNodeRef.current = ctx.createMediaElementSource(video);
      }

      if (!gainNodeRef.current) {
        const gainNode = ctx.createGain();
        const initialGain = isMutedRef.current || video.paused ? 0 : desiredGainRef.current;
        gainNode.gain.setValueAtTime(initialGain, ctx.currentTime);
        sourceNodeRef.current.connect(gainNode);
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;
      }

      isAudioConnectedRef.current = true;
      return gainNodeRef.current;
    } catch (err) {
      console.warn('Web Audio initialization:', err);
      return gainNodeRef.current;
    }
  }, []);

  // Smooth Web Audio GainNode transition (1.0 when Hero is visible, 0.08 when not visible, 350ms duration)
  const fadeGainTo = useCallback(
    (targetGain: number, durationMs = 350) => {
      const video = videoRef.current;
      const isPaused = !video || video.paused;

      if (isMutedRef.current || isPaused) {
        stopAudioImmediately();
        return;
      }

      if (!hasUnlockedAudioRef.current || !gainNodeRef.current || !audioCtxRef.current) {
        return;
      }

      const ctx = audioCtxRef.current;
      const gainNode = gainNodeRef.current;
      const now = ctx.currentTime;
      const durationSec = durationMs / 1000;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(targetGain, now + durationSec);
    },
    [stopAudioImmediately]
  );

  // Authoritative first-touch mobile audio activation
  // Primary trigger: touchstart (non-blocking, passive, does NOT prevent scrolling)
  // Secondary fallback: click (for desktop interactions)
  useEffect(() => {
    let isListenerActive = true;

    const removeListeners = () => {
      if (!isListenerActive) return;
      isListenerActive = false;
      window.removeEventListener('touchstart', handleTouchActivation, { passive: true } as EventListenerOptions);
      window.removeEventListener('click', handleClickActivation, { passive: true } as EventListenerOptions);
    };

    const performAudioUnlock = () => {
      if (hasUnlockedAudioRef.current) {
        removeListeners();
        return;
      }

      // Check if user previously saved manual mute
      const userPref = sessionStorage.getItem(AUDIO_PREF_KEY);
      if (userPref === 'muted') {
        hasUnlockedAudioRef.current = true;
        removeListeners();
        return;
      }

      const currentVideo = videoRef.current;
      if (!currentVideo) return;

      const gainNode = initAudioGraph();
      const ctx = audioCtxRef.current;
      if (!ctx || !gainNode) return;

      const completeUnlock = () => {
        if (ctx.state === 'running') {
          hasUnlockedAudioRef.current = true;
          currentVideo.muted = false;
          setIsMuted(false);
          isMutedRef.current = false;
          sessionStorage.setItem(AUDIO_PREF_KEY, 'unmuted');

          const now = ctx.currentTime;
          const targetGain = !currentVideo.paused ? desiredGainRef.current : 0;
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(targetGain, now);

          if (currentVideo.paused) {
            currentVideo.play().then(() => setIsPlaying(true)).catch(() => {});
          }

          removeListeners();
        }
      };

      if (ctx.state === 'running') {
        completeUnlock();
      } else {
        ctx.resume()
          .then(() => {
            completeUnlock();
          })
          .catch(() => {
            // If resume failed, leave listeners active for subsequent interaction
          });
      }
    };

    const handleTouchActivation = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('#hero-video-controls')) {
        return; // Handled directly by control buttons
      }
      performAudioUnlock();
    };

    const handleClickActivation = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('#hero-video-controls')) {
        return;
      }
      performAudioUnlock();
    };

    window.addEventListener('touchstart', handleTouchActivation, { passive: true });
    window.addEventListener('click', handleClickActivation, { passive: true });

    return () => {
      removeListeners();
    };
  }, [initAudioGraph]);

  // Viewport-based gain calculation: stores desiredGain only when locked; applies fade when unlocked
  useEffect(() => {
    const heroEl = containerRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        isHeroVisibleRef.current = isVisible;
        const targetGain = isVisible ? 1.0 : 0.08;
        desiredGainRef.current = targetGain;

        // Strictly do NOT initialize or resume AudioContext here
        if (!hasUnlockedAudioRef.current) {
          return;
        }

        const video = videoRef.current;
        const isPaused = !video || video.paused;

        if (isMutedRef.current || isPaused) {
          stopAudioImmediately();
        } else {
          fadeGainTo(targetGain, 350);
        }
      },
      {
        threshold: [0, 0.05, 0.15],
        rootMargin: '0px',
      }
    );

    observer.observe(heroEl);
    return () => {
      observer.disconnect();
    };
  }, [fadeGainTo, stopAudioImmediately]);

  // Clean up Web Audio graph on unmount
  useEffect(() => {
    return () => {
      if (gainNodeRef.current && audioCtxRef.current) {
        try {
          gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        } catch {}
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // PART 3 — HERO GEOMETRY & SCROLL POSITION
  // --------------------------------------------------------------------------

  // Pre-paint measurement of Hero container height using useLayoutEffect and ResizeObserver
  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        if (height > 0) {
          setHeroHeight(height);
          document.documentElement.style.setProperty('--hero-height', `${height}px`);
        }
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Scroll listener for shutter curtain transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = containerRef.current?.offsetHeight || 350;
      setIsScrolledPast(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --------------------------------------------------------------------------
  // CONTROL HANDLERS
  // --------------------------------------------------------------------------

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            setIsPlaying(true);
            if (!isMutedRef.current && hasUnlockedAudioRef.current) {
              fadeGainTo(desiredGainRef.current, 200);
            }
          })
          .catch(() => {});
      }
    } else {
      video.pause();
      setIsPlaying(false);
      stopAudioImmediately();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    // Mark audio unlocked to prevent global gesture listeners from overriding explicit choice
    hasUnlockedAudioRef.current = true;

    if (isMuted || video.muted) {
      // Immediate unmute
      video.muted = false;
      setIsMuted(false);
      isMutedRef.current = false;
      sessionStorage.setItem(AUDIO_PREF_KEY, 'unmuted');

      const gainNode = initAudioGraph();
      const ctx = audioCtxRef.current;
      if (gainNode && ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const now = ctx.currentTime;
        const targetGain = !video.paused ? desiredGainRef.current : 0;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(targetGain, now);
      }

      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      // Immediate manual mute
      video.muted = true;
      setIsMuted(true);
      isMutedRef.current = true;
      sessionStorage.setItem(AUDIO_PREF_KEY, 'muted');
      stopAudioImmediately();
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-label={lang === 'he' ? 'וידאו פתיחה יהודלס' : 'Yehudales Brand Cinematic Video'}
      className="relative w-full aspect-video max-h-[70vh] select-none"
    >
      {/* 
        Stationary Fixed Cinematic 16:9 Video Layer
        Locks directly below the locked top navigation bar.
        Does NOT move when user scrolls.
        The scrolling foreground slides over this layer like a curtain/shutter.
      */}
      <div
        className={`fixed inset-x-0 z-10 overflow-hidden bg-[#0B0C0E] select-none flex items-center justify-center transition-opacity duration-200 ${
          isScrolledPast ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        style={{
          top: 'var(--header-height, 98px)',
          height: heroHeight > 0 ? `${heroHeight}px` : 'calc(min(56.25vw, 70vh))',
        }}
      >
        <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center overflow-hidden">
          <video
            ref={setVideoRef}
            src="/assets/videos/hero.mp4"
            autoPlay
            playsInline
            loop
            preload="auto"
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
            aria-label={lang === 'he' ? 'סרטון אווירה של יהודלס' : 'Yehudales atmosphere video'}
            onCanPlay={() => attemptPlay()}
            onPlaying={() => {
              setIsPlaying(true);
              if (!isMutedRef.current && hasUnlockedAudioRef.current) {
                fadeGainTo(desiredGainRef.current, 200);
              }
            }}
            onPlay={() => {
              setIsPlaying(true);
              if (!isMutedRef.current && hasUnlockedAudioRef.current) {
                fadeGainTo(desiredGainRef.current, 200);
              }
            }}
            onPause={() => {
              setIsPlaying(false);
              stopAudioImmediately();
            }}
            className="w-full h-full object-cover object-center block pointer-events-none select-none opacity-100"
          />

          {/* Subtle top vignette gradient for header readability */}
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Two independent small circular glass video controls */}
          <div
            id="hero-video-controls"
            className="absolute z-20 start-4 sm:start-6 bottom-4 sm:bottom-6 flex items-center gap-3"
          >
            {/* Play / Pause Glass Bubble */}
            <button
              onClick={togglePlay}
              type="button"
              className="group w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-sm flex items-center justify-center transition-all active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
              aria-label={isPlaying ? (lang === 'he' ? 'השהה סרטון' : 'Pause video') : (lang === 'he' ? 'נגן סרטון' : 'Play video')}
              title={isPlaying ? (lang === 'he' ? 'השהה סרטון' : 'Pause') : (lang === 'he' ? 'נגן סרטון' : 'Play')}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-slate-300 text-slate-300 group-hover:fill-white group-hover:text-white transition-colors" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-slate-300 text-slate-300 group-hover:fill-white group-hover:text-white translate-x-0.5 rtl:-translate-x-0.5 transition-colors" />
              )}
            </button>

            {/* Mute / Unmute Glass Bubble (Colors: inactive = gray, active = white. Never orange) */}
            <button
              onClick={toggleMute}
              type="button"
              className="group w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-sm flex items-center justify-center transition-all active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
              aria-label={isMuted ? (lang === 'he' ? 'הפעל קול בסרטון' : 'Unmute audio') : (lang === 'he' ? 'השתק סרטון' : 'Mute audio')}
              title={isMuted ? (lang === 'he' ? 'הפעל קול בסרטון' : 'Unmute') : (lang === 'he' ? 'השתק סרטון' : 'Mute')}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
