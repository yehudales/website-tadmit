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
  const [heroHeight, setHeroHeight] = useState<number>(0);
  const [isScrolledPast, setIsScrolledPast] = useState<boolean>(false);

  const videoSrc = BUSINESS_CONFIG.media.heroVideoUrl || '/assets/videos/hero.mp4';

  // Default audio is ON unless the user explicitly chose 'muted' in session
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
        const initialGain = isHeroVisibleRef.current ? 1.0 : 0.08;
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
      const gainNode = gainNodeRef.current || initAudioGraph();
      const ctx = audioCtxRef.current;

      if (gainNode && ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const now = ctx.currentTime;
        const durationSec = durationMs / 1000;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(targetGain, now + durationSec);
      } else {
        // Fallback for environments without Web Audio API support
        const video = videoRef.current;
        if (video && !video.muted && !isMutedRef.current) {
          video.volume = targetGain;
        }
      }
    },
    [initAudioGraph]
  );

  // Callback ref to configure synchronous DOM properties on mount
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node;
    if (node) {
      const pref = sessionStorage.getItem(AUDIO_PREF_KEY);
      const shouldMute = pref === 'muted';
      node.muted = shouldMute;
      node.defaultMuted = shouldMute;
      node.volume = 1.0;
      node.playsInline = true;
      node.autoplay = true;
      node.loop = true;
      node.setAttribute('playsinline', '');
      node.setAttribute('webkit-playsinline', '');
      node.setAttribute('x5-playsinline', '');
      if (shouldMute) {
        node.setAttribute('muted', '');
      } else {
        node.removeAttribute('muted');
      }
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

        // Smoothly adjust audio GainNode according to viewport presence
        const targetGain = isVisible ? 1.0 : 0.08;
        fadeGainTo(targetGain, 350);
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

  // Autoplay with Audio ON by default, graceful fallback if restricted by browser policy
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const pref = sessionStorage.getItem(AUDIO_PREF_KEY);
    const explicitlyMuted = pref === 'muted';

    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;
    video.volume = 1.0;
    video.muted = explicitlyMuted;

    const tryAutoplay = async () => {
      try {
        // Attempt unmuted autoplay when not explicitly muted by user
        await video.play();
        setIsPlaying(true);
        if (!explicitlyMuted) {
          video.muted = false;
          setIsMuted(false);
          initAudioGraph();
        }
      } catch {
        // If unmuted autoplay is blocked by browser policy, fallback to muted autoplay
        if (!explicitlyMuted) {
          video.muted = true;
          setIsMuted(true);
          try {
            await video.play();
            setIsPlaying(true);
          } catch {
            setIsPlaying(false);
          }
        } else {
          setIsPlaying(false);
        }
      }
    };

    tryAutoplay();

    // On user's first document gesture, restore audio ON if it was suppressed by autoplay policy
    const handleFirstGesture = () => {
      if (video) {
        const userPref = sessionStorage.getItem(AUDIO_PREF_KEY);
        if (userPref !== 'muted' && video.muted) {
          video.muted = false;
          setIsMuted(false);
        }
        if (video.paused) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }

      // Initialize Web Audio pipeline and resume AudioContext on gesture
      const gainNode = initAudioGraph();
      if (gainNode && audioCtxRef.current) {
        const targetGain = isHeroVisibleRef.current ? 1.0 : 0.08;
        gainNode.gain.setValueAtTime(targetGain, audioCtxRef.current.currentTime);
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
      }
    };

    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
    };
  }, [videoSrc, initAudioGraph]);

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

    if (isMuted || video.muted) {
      video.muted = false;
      setIsMuted(false);
      sessionStorage.setItem(AUDIO_PREF_KEY, 'unmuted');

      const gainNode = initAudioGraph();
      if (gainNode && audioCtxRef.current) {
        const targetGain = isHeroVisibleRef.current ? 1.0 : 0.08;
        gainNode.gain.setValueAtTime(targetGain, audioCtxRef.current.currentTime);
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      video.muted = true;
      setIsMuted(true);
      sessionStorage.setItem(AUDIO_PREF_KEY, 'muted');
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
            playsInline
            muted={isMuted}
            autoPlay
            loop
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-label={lang === 'he' ? 'סרטון אווירה של יהודלס' : 'Yehudales atmosphere video'}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={() => {
              if (videoRef.current) {
                setIsMuted(videoRef.current.muted);
              }
            }}
            className="w-full h-full object-cover object-center block"
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

