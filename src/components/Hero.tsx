import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const isHeroVisibleRef = useRef<boolean>(true);
  const desiredGainRef = useRef<number>(1.0);
  const hasUnlockedAudioRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [heroHeight, setHeroHeight] = useState<number>(0);
  const [isScrolledPast, setIsScrolledPast] = useState<boolean>(false);

  // Default user audio preference is unmuted unless explicitly saved as 'muted'
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(AUDIO_PREF_KEY) === 'muted';
  });

  const isMutedRef = useRef<boolean>(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Lazy Web Audio API Graph Initialization — called ONLY as part of a genuine user activation
  // Architecture: HTMLVideoElement -> MediaElementAudioSourceNode -> GainNode -> AudioContext.destination
  const ensureAudioGraph = useCallback(() => {
    const video = videoRef.current;
    if (!video) return null;

    if (gainNodeRef.current && audioCtxRef.current) {
      return { ctx: audioCtxRef.current, gainNode: gainNodeRef.current };
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
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        sourceNodeRef.current.connect(gainNode);
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;
      }

      return { ctx, gainNode: gainNodeRef.current };
    } catch (err) {
      console.warn('Web Audio initialization:', err);
      return null;
    }
  }, []);

  // Smooth Web Audio GainNode transition (1.0 when Hero is visible, 0.08 when not visible, 0 when paused or muted)
  const applyGain = useCallback((targetGain: number, durationMs = 350) => {
    if (!hasUnlockedAudioRef.current) return;
    const ctx = audioCtxRef.current;
    const gainNode = gainNodeRef.current;
    if (!ctx || !gainNode) return;

    try {
      const now = ctx.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      if (durationMs <= 0) {
        gainNode.gain.setValueAtTime(targetGain, now);
      } else {
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(targetGain, now + durationMs / 1000);
      }
    } catch {}
  }, []);

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

  // Callback ref to configure native DOM properties on mount
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node) {
      if (!hasUnlockedAudioRef.current) {
        node.muted = true;
        node.defaultMuted = true;
      }
      node.volume = 1.0;
      node.playsInline = true;
      node.autoplay = true;
      node.loop = true;
      node.setAttribute('playsinline', '');
      node.setAttribute('webkit-playsinline', '');
      node.setAttribute('x5-playsinline', '');
      if (!hasUnlockedAudioRef.current) {
        node.setAttribute('muted', '');
      }
      node.removeAttribute('controls');
    }
  }, []);

  // Minimal playback attempt without persistent playPending deadlock or timers
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      setIsPlaying(true);
      return;
    }

    if (video.readyState < 2) {
      // Media not ready yet, wait for loadeddata / canplay events
      return;
    }

    const p = video.play();
    if (p !== undefined) {
      p.then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Allow later native events or user interaction to retry
      });
    }
  }, []);

  // Safe autoplay and native media readiness events
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

    if (video.readyState >= 2) {
      attemptPlay();
    }

    const handleMediaReady = () => {
      attemptPlay();
    };

    video.addEventListener('loadedmetadata', handleMediaReady);
    video.addEventListener('loadeddata', handleMediaReady);
    video.addEventListener('canplay', handleMediaReady);
    video.addEventListener('canplaythrough', handleMediaReady);

    return () => {
      video.removeEventListener('loadedmetadata', handleMediaReady);
      video.removeEventListener('loadeddata', handleMediaReady);
      video.removeEventListener('canplay', handleMediaReady);
      video.removeEventListener('canplaythrough', handleMediaReady);
    };
  }, [attemptPlay]);

  // Measure 16:9 hero container height and track scroll position for the shutter curtain effect
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        if (height > 0) {
          setHeroHeight((prev) => (Math.abs(prev - height) > 1 ? height : prev));
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

  // Viewport Visibility Observer — updates ONLY isHeroVisibleRef and desiredGainRef
  // Never creates AudioContext or calls resume()
  useEffect(() => {
    const heroEl = containerRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        isHeroVisibleRef.current = isVisible;
        desiredGainRef.current = isVisible ? 1.0 : 0.08;

        // If audio is already unlocked and running, smoothly ramp GainNode over 350ms
        const video = videoRef.current;
        if (hasUnlockedAudioRef.current && !isMutedRef.current && video && !video.paused) {
          applyGain(desiredGainRef.current, 350);
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
  }, [applyGain]);

  // First Touch Audio Unlock (Primary event: window touchstart passive, fallback: touchend, pointerup, click, keydown)
  useEffect(() => {
    if (hasUnlockedAudioRef.current) return;

    const userPref = sessionStorage.getItem(AUDIO_PREF_KEY);
    if (userPref === 'muted') {
      hasUnlockedAudioRef.current = true;
      return;
    }

    let isActivating = false;
    let listenersAttached = true;

    const events = ['touchstart', 'touchend', 'pointerup', 'click', 'keydown'] as const;

    const removeListeners = () => {
      if (!listenersAttached) return;
      listenersAttached = false;
      events.forEach((evt) => {
        window.removeEventListener(evt, handleActivation, { capture: true } as EventListenerOptions);
      });
    };

    const finalizeActivation = (ctx: AudioContext, gainNode: GainNode, video: HTMLVideoElement) => {
      hasUnlockedAudioRef.current = true;
      isActivating = false;
      removeListeners();

      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
      isMutedRef.current = false;
      sessionStorage.setItem(AUDIO_PREF_KEY, 'unmuted');

      const now = ctx.currentTime;
      const targetGain = desiredGainRef.current;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(targetGain, now);

      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    const handleActivation = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest && target.closest('#hero-video-controls')) {
        return;
      }

      if (hasUnlockedAudioRef.current) {
        removeListeners();
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      if (isActivating) return;
      isActivating = true;

      const graph = ensureAudioGraph();
      if (!graph) {
        isActivating = false;
        return;
      }

      const { ctx, gainNode } = graph;

      if (ctx.state === 'running') {
        finalizeActivation(ctx, gainNode, video);
        return;
      }

      const resumePromise = ctx.resume();
      if (ctx.state === 'running') {
        finalizeActivation(ctx, gainNode, video);
        return;
      }

      if (resumePromise && typeof resumePromise.then === 'function') {
        resumePromise
          .then(() => {
            if (ctx.state === 'running') {
              finalizeActivation(ctx, gainNode, video);
            } else {
              // Keep listeners active so subsequent gesture can retry!
              isActivating = false;
            }
          })
          .catch(() => {
            isActivating = false;
          });
      } else {
        isActivating = false;
      }
    };

    events.forEach((evt) => {
      window.addEventListener(evt, handleActivation, { capture: true, passive: true });
    });

    return () => {
      removeListeners();
    };
  }, [ensureAudioGraph]);

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
      video.play().then(() => {
        setIsPlaying(true);
        if (hasUnlockedAudioRef.current && !isMutedRef.current) {
          applyGain(desiredGainRef.current, 200);
        }
      }).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
      stopAudioImmediately();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted || video.muted) {
      // Manual Unmute
      const graph = ensureAudioGraph();
      if (graph) {
        const { ctx, gainNode } = graph;
        const onRunning = () => {
          hasUnlockedAudioRef.current = true;
          video.muted = false;
          video.volume = 1.0;
          setIsMuted(false);
          isMutedRef.current = false;
          sessionStorage.setItem(AUDIO_PREF_KEY, 'unmuted');

          const now = ctx.currentTime;
          const targetGain = !video.paused ? desiredGainRef.current : 0;
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(targetGain, now);

          if (video.paused) {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        };

        if (ctx.state === 'running') {
          onRunning();
        } else {
          ctx.resume().then(() => {
            if (ctx.state === 'running') {
              onRunning();
            }
          }).catch(() => {});
        }
      }
    } else {
      // Manual Mute
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
        className={`fixed inset-x-0 z-10 w-full aspect-video max-h-[70vh] overflow-hidden bg-[#0B0C0E] select-none flex items-center justify-center transition-opacity duration-200 ${
          isScrolledPast ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        style={{
          top: 'var(--header-height)',
        }}
      >
        <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center overflow-hidden">
          <video
            ref={setVideoRef}
            src="/assets/videos/hero.mp4"
            autoPlay={true}
            playsInline={true}
            loop={true}
            preload="auto"
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
            aria-label={lang === 'he' ? 'סרטון אווירה של יהודלס' : 'Yehudales atmosphere video'}
            onPlay={() => {
              setIsPlaying(true);
              if (hasUnlockedAudioRef.current && !isMutedRef.current) {
                applyGain(desiredGainRef.current, 200);
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

