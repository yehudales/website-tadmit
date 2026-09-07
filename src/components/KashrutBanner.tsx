import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface KashrutBannerProps {
  lang: Language;
}

export const KashrutBanner: React.FC<KashrutBannerProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-[#0B0C0E] pt-6 sm:pt-8 pb-2 border-b border-[#252A32]/40 relative z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Compact Disclosure Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="kashrut-expandable-content"
          className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#14171C] hover:bg-[#1C2026] border border-[#252A32] hover:border-[#FF7B1C]/50 text-[#FAF9F6] text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
          aria-label={
            isOpen
              ? (lang === 'he' ? 'סגור פירוט כשרות למהדרין' : 'Close strict kosher details')
              : (lang === 'he' ? 'פתח פירוט כשר למהדרין' : 'Open strict kosher details')
          }
        >
          {/* Animated Touch / Pointer Finger Icon with Soft Tap Glow */}
          <div className="relative flex items-center justify-center w-4 h-4 text-[#FFFFFF] shrink-0">
            {/* Soft Subtle Glow Ring */}
            <span className="absolute inset-0 rounded-full bg-white/20 finger-tap-glow motion-reduce:hidden" />
            {/* Touch Index Finger Icon */}
            <svg
              className="w-3.5 h-3.5 text-[#FFFFFF] relative z-10 finger-tap-motion"
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

          <span className="text-[#FAF9F6] group-hover:text-[#FF7B1C] transition-colors">
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
        </button>

        {/* Expandable Kashrut Banner */}
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

      {/* Lightweight CSS Keyframes for Touch Finger Tap Motion and Soft Glow */}
      <style>{`
        @keyframes finger-tap-anim {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-1.2px) scale(0.96);
          }
        }
        @keyframes finger-glow-anim {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.25;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.75;
          }
        }
        .finger-tap-motion {
          animation: finger-tap-anim 1.8s ease-in-out infinite;
        }
        .finger-tap-glow {
          animation: finger-glow-anim 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
