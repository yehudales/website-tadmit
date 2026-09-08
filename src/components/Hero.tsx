import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../types';

interface HeroProps {
  lang?: Language;
}

export const Hero: React.FC<HeroProps> = ({ lang = 'he' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Audio Graph Refs (Instantiated strictly once upon genuine user activation)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const hasUnlockedAudioRef = useRef<boolean>(false);
  const desiredGainRef = useRef<number>(1.0);
  const isMutedRef = useRef<boolean>(false);

  // Playback & Layout State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [heroHeight, setHeroHeight] = useState<number>(0);

  // --------------------------------------------------------------------------
  // 1. VIDEO STARTUP (Minimal native muted autoplay, zero delays, zero gates)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure native muted autoplay flags are configured imperatively on mount
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Single deterministic play attempt to satisfy browser policies
    video.play().catch(() => {
      // If browser policy defers playback until interaction, touchstart will resume
    });
  }, []);

  // --------------------------------------------------------------------------
  // 2. FIRST-TOUCH AUDIO UNLOCK (Authoritative touchstart listener, lazy graph)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const unlockAudio = () => {
      if (hasUnlockedAudioRef.current) return;
      const video = videoRef.current;
      if (!video) return;

      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

        if (!AudioContextClass) return;

        // 1. Create AudioContext once
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;

        // 2. Create source node once
        if (!sourceNodeRef.current) {
          sourceNodeRef.current = ctx.createMediaElementSource(video);
        }

        // 3. Create gain node once and connect graph
        if (!gainNodeRef.current) {
          gainNodeRef.current = ctx.createGain();
          sourceNodeRef.current.connect(gainNodeRef.current);
          gainNodeRef.current.connect(ctx.destination);
        }

        const gainNode = gainNodeRef.current;

        // 4. Native unmute & volume
        video.muted = false;
        video.volume = 1.0;

        // 5. Apply gain once AudioContext is running
        const activateGain = () => {
          hasUnlockedAudioRef.current = true;
          isMutedRef.current = false;
          setIsMuted(false);

          const now = ctx.currentTime;
          const targetGain = isMutedRef.current ? 0 : desiredGainRef.current;
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(targetGain, now);

          if (video.paused) {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          }

          cleanup();
        };

        if (ctx.state === 'running') {
          activateGain();
        } else {
          ctx.resume().then(() => {
            if (ctx.state === 'running') {
              activateGain();
            }
          }).catch(() => {});
        }
      } catch (err) {
        console.warn('Audio unlock:', err);
      }
    };

    const handleTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('#hero-video-controls')) return;
      unlockAudio();
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('#hero-video-controls')) return;
      unlockAudio();
    };

    const cleanup = () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleClick);
    };

    // Primary mobile activation: touchstart (passive, non-blocking, scroll remains untouched)
    window.addEventListener('touchstart', handleTouch, { passive: true });
    // Fallback for desktop clicks
    window.addEventListener('click', handleClick, { passive: true });

    return cleanup;
  }, []);

  // --------------------------------------------------------------------------
  // 3. VISIBILITY-BASED GAIN (IntersectionObserver sets desired gain, 350ms fade)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const heroEl = containerRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        const targetGain = isVisible ? 1.0 : 0.08;
        desiredGainRef.current = targetGain;

        // IntersectionObserver must NOT create or resume AudioContext
        if (!hasUnlockedAudioRef.current) return;
        if (isMutedRef.current) return;

        const ctx = audioCtxRef.current;
        const gainNode = gainNodeRef.current;
        const video = videoRef.current;
        if (!ctx || !gainNode || !video || video.paused) return;

        const now = ctx.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(targetGain, now + 0.35);
      },
      { threshold: [0, 0.05, 0.15] }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  // --------------------------------------------------------------------------
  // 4. HERO GEOMETRY (Pre-paint measurement for stable shutter alignment)
  // --------------------------------------------------------------------------
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

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // --------------------------------------------------------------------------
  // 5. MANUAL PLAY/PAUSE & MUTE CONTROLS
  // --------------------------------------------------------------------------
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        if (hasUnlockedAudioRef.current && !isMutedRef.current && gainNodeRef.current && audioCtxRef.current) {
          const now = audioCtxRef.current.currentTime;
          gainNodeRef.current.gain.cancelScheduledValues(now);
          gainNodeRef.current.gain.setValueAtTime(desiredGainRef.current, now);
        }
      }).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
      if (gainNodeRef.current && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.setValueAtTime(0, now);
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      // Manual Unmute
      isMutedRef.current = false;
      setIsMuted(false);
      video.muted = false;

      if (!hasUnlockedAudioRef.current) {
        hasUnlockedAudioRef.current = true;
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          if (!audioCtxRef.current) audioCtxRef.current = new AudioContextClass();
          const ctx = audioCtxRef.current;
          if (!sourceNodeRef.current) sourceNodeRef.current = ctx.createMediaElementSource(video);
          if (!gainNodeRef.current) {
            gainNodeRef.current = ctx.createGain();
            sourceNodeRef.current.connect(gainNodeRef.current);
            gainNodeRef.current.connect(ctx.destination);
          }
          if (ctx.state === 'suspended') ctx.resume().catch(() => {});
          const now = ctx.currentTime;
          gainNodeRef.current.gain.cancelScheduledValues(now);
          gainNodeRef.current.gain.setValueAtTime(desiredGainRef.current, now);
        }
      } else if (gainNodeRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        const now = ctx.currentTime;
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.setValueAtTime(desiredGainRef.current, now);
      }

      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      // Manual Mute
      isMutedRef.current = true;
      setIsMuted(true);
      video.muted = true;
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
        Stationary Fixed Cinematic 16:9 Video Layer
        Positioned directly underneath the fixed Header.
        Foreground content slides upward covering this stationary video.
      */}
      <div
        className="fixed inset-x-0 z-10 overflow-hidden bg-[#0B0C0E] select-none flex items-center justify-center pointer-events-none"
        style={{
          top: 'var(--header-height, 98px)',
          height: heroHeight > 0 ? `${heroHeight}px` : 'calc(min(56.25vw, 70vh))',
        }}
      >
        <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src="/assets/videos/hero.mp4"
            autoPlay
            playsInline
            loop
            muted
            preload="auto"
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
            aria-label={lang === 'he' ? 'סרטון אווירה של יהודלס' : 'Yehudales atmosphere video'}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover object-center block pointer-events-none select-none"
          />

          {/* Subtle top vignette gradient for header readability */}
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Independent circular glass video controls */}
          <div
            id="hero-video-controls"
            className="absolute z-20 start-4 sm:start-6 bottom-4 sm:bottom-6 flex items-center gap-3 pointer-events-auto"
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

            {/* Mute / Unmute Glass Bubble (Inactive = gray, Active = white, never orange) */}
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
                <Volume2 className="w-3.5 h-3.5 text-white transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
