import React from 'react';
import { Language } from '../../types';
import { useStoreStatus } from '../../hooks/useStoreStatus';
import { Clock } from 'lucide-react';

interface ShopBannerProps {
  lang: Language;
  isLocked?: boolean;
}

export const ShopBanner: React.FC<ShopBannerProps> = ({ lang, isLocked = false }) => {
  const status = useStoreStatus();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timerStr = `${pad(status.days)}:${pad(status.hours)}:${pad(status.minutes)}:${pad(status.seconds)}`;

  return (
    <div
      id="shop-banner"
      className="relative w-full overflow-hidden bg-[#0B0C0E] border-b border-[#1E232B] select-none py-3.5 sm:py-4.5 transition-all duration-300 font-shop"
    >
      {/* Subtle Storefront with Sun Umbrella / Awning Silhouette in Background */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-25"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 800 160"
          className="w-full h-full max-w-4xl object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="bannerAmbientGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#71D2F6" stopOpacity="0.2" />
              <stop offset="60%" stopColor="#FF7B1C" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0B0C0E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Glow */}
          <circle cx="400" cy="80" r="140" fill="url(#bannerAmbientGlow)" />

          {/* Awning structure */}
          <rect x="250" y="10" width="300" height="4" rx="2" fill="#252A32" />
          <path d="M 260,14 L 300,14 L 295,45 L 255,45 Z" fill="#1A1E24" />
          <path d="M 300,14 L 340,14 L 335,45 L 295,45 Z" fill="#71D2F6" fillOpacity="0.4" />
          <path d="M 340,14 L 380,14 L 375,45 L 335,45 Z" fill="#1A1E24" />
          <path d="M 380,14 L 420,14 L 415,45 L 375,45 Z" fill="#71D2F6" fillOpacity="0.4" />
          <path d="M 420,14 L 460,14 L 465,45 L 425,45 Z" fill="#1A1E24" />
          <path d="M 460,14 L 500,14 L 505,45 L 465,45 Z" fill="#71D2F6" fillOpacity="0.4" />
          <path d="M 500,14 L 540,14 L 545,45 L 505,45 Z" fill="#1A1E24" />
        </svg>
      </div>

      {/* Centered Brand Title & Countdown Badge matching Screenshot */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center flex flex-col items-center justify-center">
        {/* Brand Display Title: YEHUDAL'ES .NET */}
        <h2
          id="shop-main-title"
          className="text-lg sm:text-xl md:text-2xl font-black text-[#FAF9F6] tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          {lang === 'he' ? "YEHUDAL'ES .NET" : "YEHUDAL'ES .NET"}
        </h2>

        {/* Dynamic Status Text & Sleek Countdown Pill */}
        <div className="mt-1 flex flex-col items-center gap-1">
          <span className="text-[11px] sm:text-xs font-medium text-[#94A3B8]">
            {status.isOpen
              ? (lang === 'he' ? 'האתר נסגר בעוד:' : 'Store closes in:')
              : (lang === 'he' ? 'האתר נפתח בעוד:' : 'Store opens in:')}
          </span>

          <div
            dir="ltr"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13161B]/90 border border-[#252A32] shadow-sm backdrop-blur-sm text-xs sm:text-sm font-bold text-white tracking-widest tabular-nums"
          >
            <Clock className="w-3.5 h-3.5 text-[#71D2F6] shrink-0" />
            <span>{timerStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

