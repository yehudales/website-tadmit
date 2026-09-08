import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { triggerMobileHaptic } from '../utils/haptics';

interface KashrutBannerProps {
  lang: Language;
}

export const KashrutBanner: React.FC<KashrutBannerProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    triggerMobileHaptic(15);
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full bg-[#0B0C0E] pt-5 sm:pt-6 pb-2 relative z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Frameless Interactive Disclosure Trigger (No banner box, no card frame, no borders) */}
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls="kashrut-expandable-content"
          className="group inline-flex flex-col items-center justify-center gap-1.5 py-1 text-[#FAF9F6] text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] rounded-lg"
          aria-label={
            isOpen
              ? (lang === 'he' ? 'סגור פירוט כשרות למהדרין' : 'Close strict kosher details')
              : (lang === 'he' ? 'פתח פירוט כשר למהדרין' : 'Open strict kosher details')
          }
        >
          {/* Animated Touch / Pointer Finger Indicator (ABOVE text, pointing from right toward text) */}
          <div className="relative flex items-center justify-center w-6 h-6 text-[#FF7B1C] shrink-0">
            {/* Circle Element: Scales gently up & down ONLY (isolated transform) */}
            <span className="absolute inset-0 rounded-full bg-[#FF7B1C]/25 finger-circle-pulse motion-reduce:hidden pointer-events-none" />

            {/* Finger Element: Fixed size, moves strictly horizontally LEFT <-> RIGHT, pointing from right */}
            <div className="relative z-10 flex items-center justify-center finger-horizontal-motion">
              <svg
                className="w-4 h-4 text-[#FF7B1C] rotate-[-90deg]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2a2 2 0 0 0-2 2v9.5l-1.5-1.5a2.12 2.12 0 0 0-3 3L10 19.5a6 6 0 0 0 6 2.5h1a6 6 0 0 0 6-6V13a2 2 0 0 0-2-2 2 2 0 0 0-2 2v-1a2 2 0 0 0-2-2 2 2 0 0 0-2 2V4a2 2 0 0 0-2-2z" />
              </svg>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5">
            <span className="text-[#FAF9F6] group-hover:text-[#FF7B1C] transition-colors underline-offset-4 group-hover:underline">
              {lang === 'he' ? 'כשר למהדרין' : 'Strict Mehadrin Kosher'}
            </span>

            {/* Reverse / Close Upward Arrow (Appears ONLY in open state, tailless chevron) */}
            {isOpen && (
              <ChevronUp
                className="w-3.5 h-3.5 text-[#FAF9F6] group-hover:text-[#FF7B1C] transition-colors shrink-0"
                strokeWidth={2.4}
                aria-hidden="true"
              />
            )}
          </div>
        </button>

        {/* Expandable Kashrut Information */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="kashrut-expandable-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="w-full overflow-hidden"
            >
              <div className="pt-5 pb-3">
                <div className="p-5 sm:p-7 md:p-8 rounded-2xl bg-[#14171C] border border-[#252A32] shadow-2xl text-center space-y-5">
                  {/* Top Badge & Headings */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#FF7B1C] px-3 py-1 rounded-md bg-[#0B0C0E] border border-[#252A32] inline-block">
                      {lang === 'he' ? 'פיקוח וכשרות מהודרת' : 'Strict Kosher Supervision'}
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#FAF9F6] pt-1">
                      {lang === 'he' ? 'כשרות מהודרת למהדרין' : 'Strict Mehadrin Kosher'}
                    </h3>
                  </div>

                  {/* Introductory paragraph */}
                  <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl mx-auto leading-relaxed font-normal">
                    {lang === 'he'
                      ? 'אנו ביהודלס מקפידים על סטנדרט כשרות למהדרין מן המהדרין, עם הפרדה ובהירות מלאה לשמירה על שקט נפשי וביטחון מושלם של לקוחותינו:'
                      : 'At Yehudales, we uphold rigorous kosher standards with strict clarity and full transparency for our customers:'}
                  </p>

                  {/* Dual Certification Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto text-start">
                    {/* Badge 1: בשרים ועופות */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center gap-3.5">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#14171C] border border-[#252A32] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-[#FF7B1C]" />
                      </div>
                      <div>
                        <span className="text-[11px] sm:text-xs text-[#94A3B8] uppercase tracking-wider block font-medium">
                          {lang === 'he' ? 'בשרים ועופות' : 'Meat & Poultry'}
                        </span>
                        <div className="text-sm sm:text-base font-bold text-[#FAF9F6]">
                          {lang === 'he' ? 'בשר: נווה ציון' : 'Meat: Neve Zion'}
                        </div>
                        <span className="text-[11px] sm:text-xs text-[#FF7B1C] font-semibold block mt-0.5">
                          {lang === 'he' ? 'בשר חלק למהדרין' : 'Strict Mehadrin Glatt'}
                        </span>
                      </div>
                    </div>

                    {/* Badge 2: שאר חומרי הגלם והמוצרים */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center gap-3.5">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#14171C] border border-[#252A32] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-[#FAF9F6]" />
                      </div>
                      <div>
                        <span className="text-[11px] sm:text-xs text-[#94A3B8] uppercase tracking-wider block font-medium">
                          {lang === 'he' ? 'שאר חומרי הגלם והמוצרים' : 'Other Ingredients & Products'}
                        </span>
                        <div className="text-sm sm:text-base font-bold text-[#FAF9F6]">
                          {lang === 'he' ? 'בד״ץ העדה החרדית' : 'Badatz Edah HaChareidis'}
                        </div>
                        <span className="text-[11px] sm:text-xs text-[#FAF9F6] font-semibold block mt-0.5">
                          {lang === 'he' ? 'השגחה קפדנית ומובחרת' : 'Prestigious Kosher Supervision'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightweight CSS Keyframes: Separate Circle Scaling & Strictly Horizontal-Only Finger Movement */}
      <style>{`
        @keyframes finger-horizontal-anim {
          0%, 100% {
            transform: translateX(3px);
          }
          50% {
            transform: translateX(-3px);
          }
        }
        @keyframes finger-circle-pulse-anim {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.7;
          }
        }
        .finger-horizontal-motion {
          animation: finger-horizontal-anim 1.8s ease-in-out infinite;
        }
        .finger-circle-pulse {
          animation: finger-circle-pulse-anim 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
