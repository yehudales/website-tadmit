import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';

interface HeroProps {
  lang?: Language;
}

const AUDIO_PREF_KEY = 'yehudales_hero_sound_pref';

export const Hero: React.FC<HeroProps> = ({ lang = 'he' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHeroVisibleRef = useRef<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isAudioConnectedRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const [hasVideoStarted, setHasVideoStarted] = useState<boolean>(false);
  const [heroHeight, setHeroHeight] = useState<number>(0);
  const [isScrolledPast, setIsScrolledPast] = useState<boolean>(false);
  const isPlayPendingRef = useRef<boolean>(false);
  const hasUnlockedAudioRef = useRef<boolean>(false);

  const videoSrc = BUSINESS_CONFIG.media.heroVideoUrl || '/assets/videos/hero.mp4';

  // Default user audio preference is ACTIVE (unmuted / isMuted=false) unless explicitly saved as 'muted'
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const pref = sessionStorage.getItem(AUDIO_PREF_KEY);
    return pref === 'muted';
  });

  const isMutedRef = useRef<boolean>(isMuted);
  // Synchronize native video.muted attribute directly with isMuted state only when unlocked or manually muted
  useEffect(() => {
    isMutedRef.current = isMuted;
    const video = videoRef.current;
    if (video) {
      if (hasUnlockedAudioRef.current) {
        video.muted = isMuted;
      } else if (isMuted) {
        video.muted = true;
      }
    }
  }, [isMuted]);

  // Immediate audio stop helper: cancels all scheduled values and zeros GainNode instantly
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
        const isPaused = video.paused;
        const initialGain = (isMutedRef.current || isPaused) ? 0 : (isHeroVisibleRef.current ? 1.0 : 0.08);
        gainNode.gain.setValueAtTime(initialGain, ctx.currentTime);
        sourceNodeRef.current.connect(gainNode);
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;
      }

      isAudioConnectedRef.current = true;

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      return gainNodeRef.current;
    } catch (err) {
      console.warn('Web Audio initialization:', err);
      return gainNodeRef.current;
    }
  }, []);

  // Smooth Web Audio GainNode transition (1.0 when Hero is visible, 0.08 when not visible, 0 when paused or muted)
  const fadeGainTo = useCallback(
    (targetGain: number, durationMs = 350) => {
      const video = videoRef.current;
      const isPaused = !video || video.paused;

      // Priority 1: Paused -> Gain = 0 immediately
      // Priority 2: Manual Mute -> Gain = 0 immediately
      if (isMutedRef.current || isPaused) {
        stopAudioImmediately();
        return;
      }

      // Do not prematurely initialize the Web Audio graph before audio has been unlocked
      if (!hasUnlockedAudioRef.current && !gainNodeRef.current) {
        return;
      }

      const ctx = audioCtxRef.current;
      const gainNode = gainNodeRef.current || initAudioGraph();

      if (gainNode && ctx) {
        const now = ctx.currentTime;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const durationSec = durationMs / 1000;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(targetGain, now + durationSec);
      }
    },
    [initAudioGraph, stopAudioImmediately]
  );

  // Callback ref to configure synchronous native DOM attributes on mount (no duplicate play calls)
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node;
    if (node) {
      node.muted = true;
      node.defaultMuted = true;
      node.volume = 1.0;
      node.playsInline = true;
      node.autoplay = true;
      node.loop = true;
      node.setAttribute('playsinline', '');
      node.setAttribute('webkit-playsinline', '');
      node.setAttribute('x5-playsinline', '');
      node.setAttribute('muted', '');
      node.removeAttribute('controls');
    }
  }, []);

  // Measure 16:9 hero container height and track scroll position for the shutter curtain effect
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        setHeroHeight(height);
        document.documentElement.style.setProperty('--hero-height', `${height}px`);
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

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = containerRef.current?.offsetHeight || 350;
      setIsScrolledPast(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dynamic Viewport Visibility-Based Audio Volume Control (100% Gain when Hero is visible, 8% Gain when not visible)
  useEffect(() => {
    const heroEl = containerRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Hero is considered visible if it intersects with the viewport
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        isHeroVisibleRef.current = isVisible;

        const video = videoRef.current;
        const isPaused = !video || video.paused;

        // Smoothly adjust audio GainNode according to viewport presence only if not manually muted and not paused
        if (!isMutedRef.current && !isPaused) {
          const targetGain = isVisible ? 1.0 : 0.08;
          fadeGainTo(targetGain, 350);
        } else {
          stopAudioImmediately();
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

  // Resilient, media-readiness-driven safe autoplay function (no permanent playPending deadlock)
  const safeAutoplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Confirm video element has valid src
    if (!video.currentSrc && !video.src) return;

    // Ensure native muted startup configuration until genuine user unlock
    if (!hasUnlockedAudioRef.current) {
      video.muted = true;
      video.defaultMuted = true;
    }
    video.playsInline = true;

    // If already playing, update state and exit safely
    if (!video.paused) {
      setIsPlaying(true);
      return;
    }

    // If media is not yet sufficiently buffered (readyState < 2), wait for browser readiness events
    if (video.readyState < 2) {
      return;
    }

    // Guard against overlapping concurrent calls
    if (isPlayPendingRef.current) return;
    isPlayPendingRef.current = true;

    try {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlayPendingRef.current = false;
            setIsPlaying(true);
          })
          .catch(() => {
            // Immediate clearance on rejection allows subsequent media-ready events or retries to succeed
            isPlayPendingRef.current = false;
          });
      } else {
        isPlayPendingRef.current = false;
        setIsPlaying(true);
      }
    } catch {
      isPlayPendingRef.current = false;
    }
  }, []);

  // Autoplay setup with media readiness events and first-touch audio unlock
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;
    if (!hasUnlockedAudioRef.current) {
      video.muted = true;
      video.defaultMuted = true;
    }

    // Attempt autoplay if media is already ready
    if (video.readyState >= 2) {
      safeAutoplay();
    }

    // Re-attempt safe autoplay on native media-readiness events (safe and event-driven, no infinite loops)
    const handleMediaReady = () => {
      safeAutoplay();
    };

    video.addEventListener('loadedmetadata', handleMediaReady);
    video.addEventListener('loadeddata', handleMediaReady);
    video.addEventListener('canplay', handleMediaReady);
    video.addEventListener('canplaythrough', handleMediaReady);
    video.addEventListener('playing', handleMediaReady);

    // Clean first-touch audio activation system (touchstart, touchend, pointerup, click)
    // Synchronously attempts unlock from touchstart (even if it initiates a scroll)
    const activationEvents = [
      'touchstart',
      'touchend',
      'pointerup',
      'click',
      'keydown',
    ] as const;

    let isListenerActive = true;
    let isActivating = false;

    const removeActivationListeners = () => {
      if (!isListenerActive) return;
      isListenerActive = false;
      activationEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivation, { capture: true } as EventListenerOptions);
      });
    };

    const handleUserActivation = (e: Event) => {
      // If user interacted specifically with the video controls, let their dedicated handlers take precedence
      const target = e.target as HTMLElement | null;
      if (target && target.closest && target.closest('#hero-video-controls')) {
        return;
      }

      if (hasUnlockedAudioRef.current) {
        removeActivationListeners();
        return;
      }

      const userPref = sessionStorage.getItem(AUDIO_PREF_KEY);
      if (userPref === 'muted') {
        hasUnlockedAudioRef.current = true;
        removeActivationListeners();
        return; // Preserve explicit manual mute preference
      }

      if (isActivating) return;
      isActivating = true;

      const currentVideo = videoRef.current;
      if (!currentVideo) {
        isActivating = false;
        return;
      }

      // Initialize audio graph lazily on real user interaction
      const gainNode = initAudioGraph();
      const ctx = audioCtxRef.current;

      const onAudioRunning = (audioContext: AudioContext, gain: GainNode) => {
        hasUnlockedAudioRef.current = true;
        isActivating = false;
        removeActivationListeners();

        // Synchronize native video audio state: native video is the single source of truth
        currentVideo.muted = false;
        currentVideo.volume = 1.0;
        setIsMuted(false);
        isMutedRef.current = false;
        sessionStorage.setItem(AUDIO_PREF_KEY, 'unmuted');

        const now = audioContext.currentTime;
        const isPaused = currentVideo.paused;
        const targetGain = !isPaused ? (isHeroVisibleRef.current ? 1.0 : 0.08) : 0;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(targetGain, now);

        if (currentVideo.paused) {
          currentVideo.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      };

      if (gainNode && ctx) {
        if (ctx.state === 'running') {
          onAudioRunning(ctx, gainNode);
        } else {
          // Attempt synchronous resume inside user activation context
          const resumePromise = ctx.resume();
          if (ctx.state === 'running') {
            onAudioRunning(ctx, gainNode);
          } else if (resumePromise && typeof resumePromise.then === 'function') {
            resumePromise
              .then(() => {
                if (ctx.state === 'running') {
                  onAudioRunning(ctx, gainNode);
                } else {
                  // If browser rejected activation because the touch was recognized as scroll/pan,
                  // keep listeners active so the next touchend/click can unlock cleanly!
                  isActivating = false;
                }
              })
              .catch(() => {
                isActivating = false;
              });
          } else {
            isActivating = false;
          }
        }
      } else {
        isActivating = false;
      }
    };

    // Attach single clean listener mechanism to window in capture phase
    activationEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivation, { capture: true, passive: true });
    });

    return () => {
      video.removeEventListener('loadedmetadata', handleMediaReady);
      video.removeEventListener('loadeddata', handleMediaReady);
      video.removeEventListener('canplay', handleMediaReady);
      video.removeEventListener('canplaythrough', handleMediaReady);
      video.removeEventListener('playing', handleMediaReady);
      removeActivationListeners();
    };
  }, [videoSrc, initAudioGraph, safeAutoplay]);

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

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            if (!isMutedRef.current) {
              const targetGain = isHeroVisibleRef.current ? 1.0 : 0.08;
              fadeGainTo(targetGain, 200);
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

    // Mark audio unlocked to prevent any competing global gesture overrides
    hasUnlockedAudioRef.current = true;

    if (isMuted || video.muted) {
      // Immediate unmute with immediate target gain
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
        const isPaused = video.paused;
        const targetGain = !isPaused ? (isHeroVisibleRef.current ? 1.0 : 0.08) : 0;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(targetGain, now);
      }

      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    } else {
      // Immediate manual mute: cancel any pending ramps and instantly zero out GainNode
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
        Locks directly below the locked top banner.
        Does NOT move when user scrolls.
        The scrolling content slides over this layer like a curtain/shutter.
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
            muted={isMuted}
            autoPlay={true}
            playsInline={true}
            loop={true}
            preload="auto"
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
            aria-label={lang === 'he' ? 'סרטון אווירה של יהודלס' : 'Yehudales atmosphere video'}
            onLoadedMetadata={safeAutoplay}
            onLoadedData={safeAutoplay}
            onCanPlay={safeAutoplay}
            onPlaying={() => {
              setHasVideoStarted(true);
              setIsPlaying(true);
              if (!isMutedRef.current) {
                const targetGain = isHeroVisibleRef.current ? 1.0 : 0.08;
                fadeGainTo(targetGain, 200);
              }
            }}
            onPlay={() => {
              setHasVideoStarted(true);
              setIsPlaying(true);
              if (!isMutedRef.current) {
                const targetGain = isHeroVisibleRef.current ? 1.0 : 0.08;
                fadeGainTo(targetGain, 200);
              }
            }}
            onPause={() => {
              setIsPlaying(false);
              stopAudioImmediately();
            }}
            className="w-full h-full object-cover object-center block pointer-events-none select-none"
          />

          {/* Subtle top vignette gradient for header readability */}
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Two independent small circular glass video controls (no shared banner/container) */}
          <div
            id="hero-video-controls"
            className="absolute z-20 start-4 sm:start-6 bottom-4 sm:bottom-6 flex items-center gap-3"
          >
            {/* Independent Play / Pause Glass Bubble */}
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

            {/* Independent Mute / Unmute Glass Bubble */}
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

