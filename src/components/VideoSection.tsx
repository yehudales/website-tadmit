import React, { useState } from 'react';
import { Play, Film, Volume2, ShieldCheck, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppOrderUrl } from '../config/businessConfig';
import { Language } from '../types';

interface VideoSectionProps {
  lang: Language;
  onOpenWhatsApp: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  lang,
  onOpenWhatsApp,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoUrl = BUSINESS_CONFIG.media.heroVideoUrl;
  const whatsappUrl = getWhatsAppOrderUrl();

  // If no user video is provided, leave section empty
  if (!videoUrl) {
    return null;
  }

  return (
    <section
      id="video"
      aria-labelledby="video-heading"
      className="py-14 sm:py-20 md:py-28 bg-[#0B0C0E] relative overflow-hidden border-b border-[#252A32]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E0BE55] mb-2 inline-block px-3 py-1 rounded-lg bg-[#1A1D22] border border-[#252A32]">
            {lang === 'he' ? 'סרטון תדמית' : 'Brand Experience'}
          </span>
          <h2
            id="video-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FAF9F6] tracking-tight"
          >
            <span className="gold-gradient-text">
              {lang === 'he' ? 'הטעם והאווירה של יהודלס' : 'The Taste & Spirit of Yehudales'}
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed">
            {lang === 'he'
              ? 'הרגישו את החום, הניחוחות והתשוקה הקולינרית המושקעת בכל סיר ומנה'
              : 'Feel the authentic warmth, rich aroma, and culinary passion in every pot'}
          </p>
        </div>

        {/* Video Player Frame Container */}
        <div className="relative rounded-2xl overflow-hidden bg-[#1A1D22] border border-[#252A32] shadow-2xl max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] w-full bg-[#0B0C0E] flex items-center justify-center overflow-hidden">
            {isPlaying && !hasError ? (
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster={BUSINESS_CONFIG.media.heroPoster || undefined}
                onError={() => setHasError(true)}
              >
                {BUSINESS_CONFIG.media.heroVideoMobileUrl && (
                  <source src={BUSINESS_CONFIG.media.heroVideoMobileUrl} type="video/webm" />
                )}
                <source src={videoUrl} type="video/mp4" />
                {lang === 'he' ? 'הדפדפן שלך אינו תומך בהפעלת וידאו.' : 'Your browser does not support video playback.'}
              </video>
            ) : (
              /* Video Poster & Interactive Play Button */
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-[#0B0C0E]">
                <div className="relative z-10 flex flex-col items-center max-w-lg">
                  <button
                    onClick={() => setIsPlaying(true)}
                    type="button"
                    aria-label={lang === 'he' ? 'נגן סרטון תדמית' : 'Play brand video'}
                    className="group mb-4 sm:mb-6 relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#C9A227] to-[#E0BE55] text-[#0B0C0E] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E0BE55] cursor-pointer"
                  >
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
                  </button>

                  <h3 className="text-lg sm:text-2xl font-bold text-[#FAF9F6] mb-1.5 sm:mb-2">
                    {lang === 'he' ? 'יהודלס — חווית ליל שישי טעם ברמה גבוהה' : 'Yehudales — Friday Night High-End Experience'}
                  </h3>

                  <p className="text-[11px] sm:text-sm text-[#94A3B8] mb-3 sm:mb-4">
                    {lang === 'he' ? 'לחצו להפעלת הווידאו' : 'Click to play video'}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[#FAF9F6] font-medium bg-[#1A1D22] px-3 py-1.5 rounded-xl border border-[#252A32]">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{BUSINESS_CONFIG.kashrut.fullBadge[lang]}</span>
                  </div>
                </div>

                {/* Bottom Bar Details */}
                <div className="absolute bottom-2.5 sm:bottom-4 inset-x-4 sm:inset-x-6 flex items-center justify-between text-[11px] sm:text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#E0BE55]" />
                    <span>{BUSINESS_CONFIG.name[lang]} • {BUSINESS_CONFIG.location.city[lang]}</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{lang === 'he' ? 'איכות שמע גבוהה' : 'High Quality Audio'}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp CTA beneath video */}
        <div className="mt-6 sm:mt-8 flex justify-center px-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0C0E] font-black text-sm shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-[#0B0C0E]" />
            <span>{BUSINESS_CONFIG.whatsapp.ctaText[lang]}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
