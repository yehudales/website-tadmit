import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';

interface HeroProps {
  lang?: Language;
}

const AUDIO_PREF_KEY = 'yehudales_hero_sound_pref';

export const Hero: React.FC<HeroProps> = ({ lang = 'he' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const videoSrc = BUSINESS_CONFIG.media.heroVideoUrl;
  const videoMobileSrc = BUSINESS_CONFIG.media.heroVideoMobileUrl;

  // Default intent is sound enabled unless user explicitly chose muted in session
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(AUDIO_PREF_KEY) === 'muted';
  });

  // Attempt autoplay with audio enabled (sound on by default).
  // If the browser autoplay policy restricts unmuted playback, gracefully fallback to muted autoplay.
  useEffect(() => {
    if (!videoSrc) return;

    const video = videoRef.current;
    if (!video) return;

    const savedPref = sessionStorage.getItem(AUDIO_PREF_KEY);

    if (savedPref === 'muted') {
      video.muted = true;
      setIsMuted(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
      return;
    }

    // Default intent: SOUND ON
    video.muted = false;
    setIsMuted(false);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          sessionStorage.setItem(AUDIO_PREF_KEY, 'unmuted');
        })
        .catch(() => {
          // Browser prevented autoplay with sound (Media Engagement Index policy)
          // Gracefully fall back to muted autoplay without breaking video playback
          video.muted = true;
          setIsMuted(true);
          video.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        });
    }
  }, [videoSrc]);

  // ABSOLUTE EMPTY-STATE RULE:
  // If no user video is available or error loading user video, leave the Hero area empty
  if (!videoSrc || videoError) {
    return null;
  }

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

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    // Preserve user preference for the current session
    sessionStorage.setItem(AUDIO_PREF_KEY, nextMuted ? 'muted' : 'unmuted');

    // If unmuting while video is paused, resume playback
    if (!nextMuted && video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <section
      id="hero"
      aria-label={lang === 'he' ? 'וידאו פתיחה יהודלס' : 'Yehudales Brand Cinematic Video'}
      className="relative w-full overflow-hidden bg-[#0B0C0E] select-none h-[54vh] sm:h-[65vh] md:h-[80vh] lg:h-[86vh] flex items-center justify-center"
    >
      {/* Cinematic Background Video Element */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {!videoError && (
          <video
            ref={videoRef}
            playsInline
            loop
            autoPlay
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover object-center"
          >
            <source src="/assets/videos/hero.mp4" type="video/mp4" />
          </video>
        )}

        {/* Subtle top vignette gradient for header readability */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Minimal circular glass video controls only */}
      {!videoError && (
        <div className="absolute z-20 start-4 sm:start-8 bottom-4 sm:bottom-6 flex items-center gap-2 p-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 shadow-xl">
          <button
            onClick={togglePlay}
            type="button"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] cursor-pointer"
            aria-label={isPlaying ? (lang === 'he' ? 'עצירה' : 'Pause') : (lang === 'he' ? 'נגן' : 'Play')}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white translate-x-0.5 rtl:-translate-x-0.5" />
            )}
          </button>

          <button
            onClick={toggleMute}
            type="button"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] cursor-pointer"
            aria-label={isMuted ? (lang === 'he' ? 'הפעלת סאונד' : 'Unmute audio') : (lang === 'he' ? 'השתקת קול' : 'Mute audio')}
            title={isMuted ? (lang === 'he' ? 'הפעלת סאונד' : 'Unmute') : (lang === 'he' ? 'השתקה' : 'Mute')}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/70" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#E0BE55]" />
            )}
          </button>
        </div>
      )}
    </section>
  );
};
