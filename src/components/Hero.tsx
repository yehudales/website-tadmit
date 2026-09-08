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
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

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
        const initialGain = isMutedRef.current ? 0 : (isHeroVisibleRef.current ? 1.0 : 0.08);
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

  // Smooth Web Audio GainNode transition (1.0 when Hero is visible, 0.08 when not visible)
  const fadeGainTo = useCallback(
    (targetGain: number, durationMs = 350) => {
      const ctx = audioCtxRef.current;
      const gainNode = gainNodeRef.current || (isMutedRef.current ? null : initAudioGraph());

      if (gainNode && ctx) {
        const now = ctx.currentTime;
        if (isMutedRef.current) {
          // Explicitly keep Gain at 0 when manually muted; do not restore volume on scroll
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(0, now);
          return;
        }

        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const durationSec = durationMs / 1000;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(targetGain, now + durationSec);
      }
    },
    [initAudioGraph]
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

    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const el = containerRef.current;
          const threshold = el ? el.offsetTop + el.offsetHeight : 350;
          setIsScrolledPast((prev) => {
            const next = scrollY > threshold;
            return prev === next ? prev : next;
          });
          scrollTicking = false;
        });
        scrollTicking = true;
      }
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

        // Smoothly adjust audio GainNode according to viewport presence if not manually muted
        if (!isMutedRef.current) {
          const targetGain = isVisible ? 1.0 : 0.08;
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
  }, [fadeGainTo]);

  // Single authoritative guarded autoplay function
  const safeAutoplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure native muted & playsInline configuration for full mobile policy acceptance
    video.muted = true;
    video.playsInline = true;

    if (isPlayPendingRef.current) return;
    if (!video.paused) {
      setIsPlaying(true);
      return;
    }

    isPlayPendingRef.current = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlayPendingRef.current = false;
          setIsPlaying(true);
        })
        .catch(() => {
          isPlayPendingRef.current = false;
        });
    } else {
      isPlayPendingRef.current = false;
    }
  }, []);

  // Autoplay with native muted configuration and cached-readiness check
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;

    // If media is already cached / ready (readyState >= 2), attempt playback immediately
    if (video.readyState >= 2) {
      safeAutoplay();
    } else {
      safeAutoplay();
    }

    // On user's first document activation gesture, seamlessly unlock AudioContext and enable sound if active
    const handleFirstGesture = (e: Event) => {
      // If the interaction happened directly on video controls, speaker button handler takes absolute priority
      const target = e.target as HTMLElement | null;
      if (target && target.closest('#hero-video-controls')) {
        return;
      }

      if (hasUnlockedAudioRef.current) {
        return;
      }
      hasUnlockedAudioRef.current = true;

      const userPref = sessionStorage.getItem(AUDIO_PREF_KEY);
      if (userPref === 'muted') {
        return; // Explicit manual mute preference is preserved
      }

      if (video) {
        video.muted = false;
        setIsMuted(false);
        isMutedRef.current = false;
        sessionStorage.setItem(AUDIO_PREF_KEY, 'unmuted');

        const gainNode = initAudioGraph();
        if (gainNode && audioCtxRef.current) {
          const now = audioCtxRef.current.currentTime;
          const targetGain = isHeroVisibleRef.current ? 1.0 : 0.08;
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(targetGain, now);
          if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume().catch(() => {});
          }
        }

        if (video.paused) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
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
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
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
      if (gainNode && audioCtxRef.current) {
        const targetGain = isHeroVisibleRef.current ? 1.0 : 0.08;
        const now = audioCtxRef.current.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(targetGain, now);
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      // Immediate manual mute: cancel any pending ramps and instantly zero out GainNode
      video.muted = true;
      setIsMuted(true);
      isMutedRef.current = true;
      sessionStorage.setItem(AUDIO_PREF_KEY, 'muted');

      if (gainNodeRef.current && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.setValueAtTime(0, now);
      }
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
        Cinematic 16:9 Video Layer
        Participates naturally in document scroll flow with sticky top-0 shutter curtain effect.
        Content below slides upward over this layer.
      */}
      <div
        className={`sticky top-0 inset-x-0 z-10 w-full h-full overflow-hidden bg-[#0B0C0E] select-none flex items-center justify-center transition-opacity duration-200 ${
          isScrolledPast ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center overflow-hidden">
          <video
            ref={setVideoRef}
            src="/assets/videos/hero.mp4"
            muted={true}
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
            }}
            onPause={() => setIsPlaying(false)}
            className={`w-full h-full object-cover object-center block pointer-events-none select-none transition-opacity duration-300 ${
              hasVideoStarted ? 'opacity-100' : 'opacity-0'
            }`}
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

