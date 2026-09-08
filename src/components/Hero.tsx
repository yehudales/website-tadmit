import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../types';

interface HeroProps {
  lang?: Language;
}

const AUDIO_PREF_KEY = 'yehudales_hero_sound_pref';

type MediaState = 'NOT_READY' | 'READY' | 'PLAYING' | 'PAUSED' | 'ERROR';

/**
 * ARCHITECTURAL HERO MEDIA SYSTEM
 * Separated into four decoupled domains:
 * 1. VIDEO ENGINE: Native video element, direct src, autoplay, loop, play/pause controls.
 * 2. AUDIO ENGINE: Lazy AudioContext, single MediaElementAudioSourceNode, single GainNode,
 *    first-touch activation (touchstart passive), 350ms visibility gain transition (1.0 vs 0.08).
 * 3. GEOMETRY ENGINE: Fixed video at top: var(--header-height), matching flow spacer, shutter scroll.
 * 4. WATERMARK LAYER: Clean presentation with no application-generated overlays.
 */
export const Hero: React.FC<HeroProps> = ({ lang = 'he' }) => {
  // --- DOM & Graph References (Single Responsibility, No Duplication) ---
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // Web Audio Graph (Instantiated strictly on user gesture, connected once)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioUnlockedRef = useRef<boolean>(false);
  const desiredGainRef = useRef<number>(1.0);

  // Video Playback In-Flight Guard
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // --- Minimal React UI State ---
  const [mediaState, setMediaState] = useState<MediaState>('NOT_READY');
  const isPlaying = mediaState === 'PLAYING';

  const [isScrolledPast, setIsScrolledPast] = useState<boolean>(false);

  // Speaker control UI state (defaults to unmuted unless explicitly saved as muted)
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(AUDIO_PREF_KEY) === 'muted';
  });

  const isMutedRef = useRef<boolean>(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // =========================================================================
  // DOMAIN 1: VIDEO ENGINE
  // =========================================================================

  // Controlled play attempt with in-flight Promise tracking to avoid deadlocks
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.paused) return;

    if (playPromiseRef.current) return;
    if (video.readyState < 2) return;

    try {
      const promise = video.play();
      if (promise !== undefined && typeof promise.then === 'function') {
        playPromiseRef.current = promise;
        promise
          .then(() => {
            playPromiseRef.current = null;
            setMediaState('PLAYING');
          })
          .catch(() => {
            // Clear tracking immediately so subsequent touch or media events can retry
            playPromiseRef.current = null;
          });
      } else {
        setMediaState('PLAYING');
      }
    } catch {
      playPromiseRef.current = null;
    }
  }, []);

  // Configure native video DOM attributes on mount
  const setVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node) {
        // Native media must initially be muted to satisfy browser autoplay policy
        node.muted = true;
        node.defaultMuted = true;
        node.volume = 1.0;
        node.playsInline = true;
        node.autoplay = true;
        node.loop = true;
        node.preload = 'auto';

        node.setAttribute('playsinline', '');
        node.setAttribute('webkit-playsinline', '');
        node.setAttribute('x5-playsinline', '');
        node.setAttribute('muted', '');
        node.removeAttribute('controls');

        if (node.readyState >= 2) {
          setMediaState('READY');
          attemptPlay();
        }
      }
    },
    [attemptPlay]
  );

  // Toggle Play/Pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      attemptPlay();
      // If audio is active and unmuted, resume gain
      if (audioUnlockedRef.current && !isMutedRef.current && audioCtxRef.current && gainNodeRef.current) {
        const ctx = audioCtxRef.current;
        const gainNode = gainNodeRef.current;
        const now = ctx.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(desiredGainRef.current, now + 0.2);
      }
    } else {
      video.pause();
      setMediaState('PAUSED');
      // Silence GainNode immediately on pause
      if (gainNodeRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
        gainNodeRef.current.gain.setValueAtTime(0, ctx.currentTime);
      }
    }
  }, [attemptPlay]);

  // =========================================================================
  // DOMAIN 2: AUDIO ENGINE
  // =========================================================================

  // Lazy Web Audio API graph instantiation (HTMLVideoElement -> MediaElementAudioSourceNode -> GainNode -> AudioContext.destination)
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

  // Smooth GainNode ramp (1.0 visible, 0.08 scrolled past, 0 muted/paused)
  const applyGain = useCallback((targetGain: number, durationMs = 350) => {
    if (!audioUnlockedRef.current || isMutedRef.current) return;
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

  // First-Touch Mobile & Desktop Audio Unlock
  // Primary trigger: touchstart (window capture, passive). Also listens to touchend, click, keydown.
  useEffect(() => {
    if (audioUnlockedRef.current) return;

    const userPref = sessionStorage.getItem(AUDIO_PREF_KEY);
    if (userPref === 'muted') {
      audioUnlockedRef.current = true;
      return;
    }

    let isActivating = false;
    let listenersAttached = true;
    const events = ['touchstart', 'touchend', 'click', 'keydown'] as const;

    const removeListeners = () => {
      if (!listenersAttached) return;
      listenersAttached = false;
      events.forEach((evt) => {
        window.removeEventListener(evt, handleActivation, { capture: true } as EventListenerOptions);
      });
    };

    const finalizeUnlock = (ctx: AudioContext, gainNode: GainNode, video: HTMLVideoElement) => {
      if (ctx.state !== 'running' || video.muted) return;

      audioUnlockedRef.current = true;
      isActivating = false;
      removeListeners();

      video.volume = 1.0;
      setIsMuted(false);
      isMutedRef.current = false;
      sessionStorage.setItem(AUDIO_PREF_KEY, 'unmuted');

      const now = ctx.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(desiredGainRef.current, now);

      if (video.paused) {
        attemptPlay();
      }
    };

    const handleActivation = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('#hero-video-controls')) {
        return;
      }

      if (audioUnlockedRef.current) {
        removeListeners();
        return;
      }

      const video = videoRef.current;
      if (!video || isActivating) return;
      isActivating = true;

      const graph = ensureAudioGraph();
      if (!graph) {
        isActivating = false;
        return;
      }

      const { ctx, gainNode } = graph;

      // Imperatively unmute native media element synchronously inside the user gesture
      video.muted = false;
      video.volume = 1.0;

      if (ctx.state === 'running') {
        finalizeUnlock(ctx, gainNode, video);
        return;
      }

      const resumePromise = ctx.resume();
      if (ctx.state === 'running') {
        finalizeUnlock(ctx, gainNode, video);
        return;
      }

      if (resumePromise && typeof resumePromise.then === 'function') {
        resumePromise
          .then(() => {
            if (ctx.state === 'running') {
              finalizeUnlock(ctx, gainNode, video);
            } else {
              // State not running yet; keep listeners attached for subsequent touch
              if (!audioUnlockedRef.current) video.muted = true;
              isActivating = false;
            }
          })
          .catch(() => {
            if (!audioUnlockedRef.current) video.muted = true;
            isActivating = false;
          });
      } else {
        if (ctx.state !== 'running' && !audioUnlockedRef.current) {
          video.muted = true;
        }
        isActivating = false;
      }
    };

    events.forEach((evt) => {
      window.addEventListener(evt, handleActivation, { capture: true, passive: true });
    });

    return () => {
      removeListeners();
    };
  }, [attemptPlay, ensureAudioGraph]);

  // Viewport Visibility Audio Engine (IntersectionObserver ONLY sets desired gain, NEVER unlocks AudioContext)
  useEffect(() => {
    const heroEl = containerRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        // Hero visible = 1.0, not visible = 0.08
        desiredGainRef.current = isVisible ? 1.0 : 0.08;

        const video = videoRef.current;
        if (audioUnlockedRef.current && !isMutedRef.current && video && !video.paused) {
          applyGain(desiredGainRef.current, 350);
        }
      },
      {
        threshold: [0, 0.05, 0.15],
        rootMargin: '0px',
      }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [applyGain]);

  // Toggle Mute / Unmute manually via speaker control
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted || video.muted) {
      // Manual Unmute
      const graph = ensureAudioGraph();
      if (graph) {
        const { ctx, gainNode } = graph;
        const doUnmute = () => {
          audioUnlockedRef.current = true;
          video.muted = false;
          video.volume = 1.0;
          setIsMuted(false);
          isMutedRef.current = false;
          sessionStorage.setItem(AUDIO_PREF_KEY, 'unmuted');

          const now = ctx.currentTime;
          const targetGain = !video.paused ? desiredGainRef.current : 0;
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(targetGain, now);

          if (video.paused) attemptPlay();
        };

        if (ctx.state === 'running') {
          doUnmute();
        } else {
          ctx.resume().then(() => {
            if (ctx.state === 'running') doUnmute();
          }).catch(() => {});
        }
      }
    } else {
      // Manual Mute
      video.muted = true;
      setIsMuted(true);
      isMutedRef.current = true;
      sessionStorage.setItem(AUDIO_PREF_KEY, 'muted');

      if (gainNodeRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
        gainNodeRef.current.gain.setValueAtTime(0, ctx.currentTime);
      }
    }
  }, [attemptPlay, ensureAudioGraph, isMuted]);

  // Clean up AudioContext gain on unmount
  useEffect(() => {
    return () => {
      if (gainNodeRef.current && audioCtxRef.current) {
        try {
          gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        } catch {}
      }
    };
  }, []);

  // =========================================================================
  // DOMAIN 3: HERO GEOMETRY & SHUTTER ENGINE
  // =========================================================================

  // Track window scroll to toggle pointer-events on the stationary video once scrolled past
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = containerRef.current?.offsetHeight || 350;
      setIsScrolledPast(scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // =========================================================================
  // DOMAIN 4: PRESENTATION LAYER
  // =========================================================================

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-label={lang === 'he' ? 'וידאו פתיחה יהודלס' : 'Yehudales Brand Cinematic Video'}
      className="relative w-full aspect-video max-h-[70vh] select-none"
    >
      {/* 
        Stationary Fixed Cinematic 16:9 Video Layer
        Locks directly below the fixed header at top: var(--header-height).
        Does NOT move when user scrolls.
        The scrolling content slides over this layer like a curtain/shutter.
      */}
      <div
        className={`fixed inset-x-0 z-10 w-full aspect-video max-h-[70vh] overflow-hidden bg-[#0B0C0E] select-none flex items-center justify-center ${
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
            onLoadedMetadata={() => {
              setMediaState('READY');
              attemptPlay();
            }}
            onLoadedData={() => {
              setMediaState('READY');
              attemptPlay();
            }}
            onCanPlay={() => {
              attemptPlay();
            }}
            onPlay={() => {
              setMediaState('PLAYING');
              if (audioUnlockedRef.current && !isMutedRef.current) {
                applyGain(desiredGainRef.current, 200);
              }
            }}
            onPause={() => {
              setMediaState('PAUSED');
              if (gainNodeRef.current && audioCtxRef.current) {
                const ctx = audioCtxRef.current;
                gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
                gainNodeRef.current.gain.setValueAtTime(0, ctx.currentTime);
              }
            }}
            onError={() => {
              setMediaState('ERROR');
            }}
            className="w-full h-full object-cover object-center block pointer-events-none select-none"
          />

          {/* Subtle top vignette gradient for header readability */}
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Independent circular glass video controls */}
          <div
            id="hero-video-controls"
            className="absolute z-20 start-4 sm:start-6 bottom-4 sm:bottom-6 flex items-center gap-3"
          >
            {/* Play / Pause Glass Bubble */}
            <button
              onClick={togglePlay}
              type="button"
              className="group w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-sm flex items-center justify-center transition-all active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
              aria-label={
                isPlaying
                  ? lang === 'he'
                    ? 'השהה סרטון'
                    : 'Pause video'
                  : lang === 'he'
                  ? 'נגן סרטון'
                  : 'Play video'
              }
              title={
                isPlaying
                  ? lang === 'he'
                    ? 'השהה סרטון'
                    : 'Pause'
                  : lang === 'he'
                  ? 'נגן סרטון'
                  : 'Play'
              }
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-slate-300 text-slate-300 group-hover:fill-white group-hover:text-white transition-colors" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-slate-300 text-slate-300 group-hover:fill-white group-hover:text-white translate-x-0.5 rtl:-translate-x-0.5 transition-colors" />
              )}
            </button>

            {/* Mute / Unmute Glass Bubble (Inactive = slate-400, Active = white. Never orange!) */}
            <button
              onClick={toggleMute}
              type="button"
              className="group w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-sm flex items-center justify-center transition-all active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
              aria-label={
                isMuted
                  ? lang === 'he'
                    ? 'הפעל קול בסרטון'
                    : 'Unmute audio'
                  : lang === 'he'
                  ? 'השתק סרטון'
                  : 'Mute audio'
              }
              title={
                isMuted
                  ? lang === 'he'
                    ? 'הפעל קול בסרטון'
                    : 'Unmute'
                  : lang === 'he'
                    ? 'השתק סרטון'
                    : 'Mute'
              }
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-white group-hover:text-white transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
