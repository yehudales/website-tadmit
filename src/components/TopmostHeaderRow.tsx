import React from 'react';
import { Settings, Home } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';
import { Logo } from './Logo';
import { TraditionalShopEmblem } from './shop/TraditionalShopEmblem';

interface TopmostHeaderRowProps {
  lang: Language;
  isShopMode?: boolean;
  onGoHome?: () => void;
  onCloseSection?: () => void;
  onOpenSettings: () => void;
}

export const TopmostHeaderRow: React.FC<TopmostHeaderRowProps> = ({
  lang,
  isShopMode = false,
  onGoHome,
  onCloseSection,
  onOpenSettings,
}) => {
  return (
    <div
      id="topmost-header-row"
      className="sticky top-0 z-50 border-b border-[#252A32]/60 py-2 sm:py-2.5 bg-[#0B0C0E]/98 backdrop-blur-md flex flex-col justify-center min-h-[96px] w-full shrink-0 shadow-lg"
    >
      <div
        id="header-row1-grid"
        className={`max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 grid grid-cols-3 items-center shrink-0 ${isShopMode ? 'py-1' : '-mt-4'} pl-3 ml-0 pt-0`}
      >
        {/* Left / Home shortcut (Left Col) */}
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={() => {
              if (onGoHome) {
                onGoHome();
              } else {
                if (onCloseSection) onCloseSection();
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#16191E] border border-[#252A32] hover:border-[#FF7B1C]/40 text-[#FAF9F6]/80 hover:text-[#FF7B1C] transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
            aria-label={`${BUSINESS_CONFIG.name[lang]} - דף הבית`}
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Brand Logo or Animated Traditional Shop Emblem in Shop Mode (Center Col) */}
        <div className="flex flex-col items-center justify-center select-none">
          <div
            className="flex items-center justify-center select-none pointer-events-auto"
            aria-label={isShopMode ? (lang === 'he' ? "יהודל'ס חנות" : "Yehudales Shop") : `${BUSINESS_CONFIG.name[lang]}`}
          >
            {isShopMode ? (
              <TraditionalShopEmblem lang={lang} />
            ) : (
              <Logo className="h-[89.6px] sm:h-8 md:h-9 w-auto select-none" />
            )}
          </div>
        </div>

        {/* Right / Settings Action (Right Col) */}
        <div className="flex items-center justify-end">
          <button
            onClick={onOpenSettings}
            type="button"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#16191E] hover:bg-[#20242B] border border-[#252A32] hover:border-white/40 text-white transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={lang === 'he' ? 'הגדרות' : 'Settings'}
            title={lang === 'he' ? 'הגדרות' : 'Settings'}
          >
            <Settings className="w-4 h-4 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
