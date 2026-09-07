import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  ChevronUp,
} from 'lucide-react';
import { useStoreStatus } from '../hooks/useStoreStatus';
import { Language } from '../types';
import { BUSINESS_CONFIG } from '../config/businessConfig';

interface LiveStoreStatusSectionProps {
  lang: Language;
  onOpenWhatsApp?: () => void;
}

export const LiveStoreStatusSection: React.FC<LiveStoreStatusSectionProps> = ({
  lang,
}) => {
  const status = useStoreStatus();
  const [isHoursOpen, setIsHoursOpen] = useState(false);

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Format 4 units: Days : Hours : Minutes : Seconds
  const daysDisplay = pad(status.days);
  const hoursDisplay = pad(status.hours);
  const minutesDisplay = pad(status.minutes);
  const secondsDisplay = pad(status.seconds);

  return (
    <section
      id="store-status"
      aria-label={lang === 'he' ? 'סטטוס החנות וספירה לאחור' : 'Store status and countdown'}
      className="relative pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 md:pb-20 bg-[#0B0C0E] overflow-hidden select-none"
    >
      {/* Free-Standing Typographic Timer Composition */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Dynamic Store Status Header Line — Text-Only with subtle timer glow */}
        <div className="text-sm sm:text-base font-medium text-[#94A3B8] tracking-wide mb-1 sm:mb-2 flex items-center justify-center gap-1.5 flex-wrap">
          {status.isOpen ? (
            <>
              <span className="font-bold text-[#22C55E] drop-shadow-[0_0_8px_rgba(34,197,94,0.55)]">
                {lang === 'he' ? 'פתוח' : 'Open'}
              </span>
              <span>
                {lang === 'he' ? 'החנות נסגרת בעוד:' : 'Store closes in:'}
              </span>
            </>
          ) : (
            <>
              <span className="font-bold text-[#EF4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.55)]">
                {lang === 'he' ? 'סגור' : 'Closed'}
              </span>
              <span>
                {lang === 'he' ? 'החנות נפתחת בעוד:' : 'Store opens in:'}
              </span>
            </>
          )}
        </div>

        {/* The 4-Column Large Bold Free-Standing Timer — STRICTLY UNTOUCHED */}
        <div
          dir="ltr"
          className="flex items-baseline justify-center text-white font-black tabular-nums tracking-tight my-2"
        >
          {/* Days */}
          <div className="flex flex-col items-center">
            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.18)]">
              {daysDisplay}
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#94A3B8] uppercase mt-2 sm:mt-4 tracking-widest">
              {lang === 'he' ? 'ימים' : 'Days'}
            </span>
          </div>

          {/* Colon Separator */}
          <span className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl px-1 sm:px-2 md:px-4 pb-3 sm:pb-6 text-[#FF7B1C] font-bold select-none drop-shadow-[0_0_12px_rgba(255,123,28,0.6)]">
            :
          </span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.18)]">
              {hoursDisplay}
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#94A3B8] uppercase mt-2 sm:mt-4 tracking-widest">
              {lang === 'he' ? 'שעות' : 'Hours'}
            </span>
          </div>

          {/* Colon Separator */}
          <span className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl px-1 sm:px-2 md:px-4 pb-3 sm:pb-6 text-[#FF7B1C] font-bold select-none drop-shadow-[0_0_12px_rgba(255,123,28,0.6)]">
            :
          </span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.18)]">
              {minutesDisplay}
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#94A3B8] uppercase mt-2 sm:mt-4 tracking-widest">
              {lang === 'he' ? 'דקות' : 'Minutes'}
            </span>
          </div>

          {/* Colon Separator */}
          <span className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl px-1 sm:px-2 md:px-4 pb-3 sm:pb-6 text-[#FF7B1C] font-bold select-none drop-shadow-[0_0_12px_rgba(255,123,28,0.6)]">
            :
          </span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.18)]">
              {secondsDisplay}
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#94A3B8] uppercase mt-2 sm:mt-4 tracking-widest">
              {lang === 'he' ? 'שניות' : 'Seconds'}
            </span>
          </div>
        </div>

        {/* Interactive "שעות פתיחה" Trigger with Animated Tap / Finger Icon */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center w-full max-w-2xl">
          <button
            type="button"
            onClick={() => setIsHoursOpen((prev) => !prev)}
            aria-expanded={isHoursOpen}
            aria-controls="opening-hours-expandable-content"
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#14171C] hover:bg-[#1C2026] border border-[#252A32] hover:border-[#FF7B1C]/50 text-[#FAF9F6] text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
            aria-label={
              isHoursOpen
                ? (lang === 'he' ? 'סגור פירוט שעות פתיחה' : 'Close opening hours details')
                : (lang === 'he' ? 'פתח פירוט שעות פתיחה' : 'Open opening hours details')
            }
          >
            {/* Animated Touch / Pointer Finger Icon with Soft Tap Glow */}
            <div className="relative flex items-center justify-center w-4 h-4 text-[#FF7B1C] shrink-0">
              {/* Soft Subtle Glow Ring */}
              <span className="absolute inset-0 rounded-full bg-[#FF7B1C]/25 finger-tap-glow motion-reduce:hidden" />
              {/* Touch Index Finger Icon */}
              <svg
                className="w-3.5 h-3.5 text-[#FF7B1C] relative z-10 finger-tap-motion"
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
              {lang === 'he' ? 'שעות פתיחה' : 'Opening Hours'}
            </span>

            {/* Reverse / Close Upward Arrow (Appears ONLY in open state, tailless chevron) */}
            {isHoursOpen && (
              <ChevronUp
                className="w-3.5 h-3.5 text-[#FAF9F6] group-hover:text-[#FF7B1C] transition-colors shrink-0"
                strokeWidth={2.4}
                aria-hidden="true"
              />
            )}
          </button>

          {/* Expandable Opening Hours Information Banner */}
          <AnimatePresence>
            {isHoursOpen && (
              <motion.div
                id="opening-hours-expandable-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="w-full overflow-hidden"
              >
                <div className="pt-4 pb-2 text-start">
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#14171C] border border-[#252A32] shadow-2xl space-y-4">
                    {/* Schedule Card */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7B1C]" />
                      </div>
                      <div>
                        <span className="text-[11px] sm:text-xs font-bold text-[#94A3B8] uppercase tracking-wider block">
                          {lang === 'he' ? 'שעות פעילות' : 'Operating Schedule'}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-[#FF7B1C] mt-0.5">
                          {BUSINESS_CONFIG.hours.summary[lang]}
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">
                          {BUSINESS_CONFIG.hours.note[lang]}
                        </p>
                      </div>
                    </div>

                    {/* Address & Direct Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#252A32]">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0B0C0E] border border-[#252A32] flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-[#FF7B1C]" />
                        </div>
                        <div>
                          <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider block font-semibold">
                            {lang === 'he' ? 'כתובת לאיסוף' : 'Pickup Address'}
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-[#FAF9F6] mt-0.5">
                            {BUSINESS_CONFIG.location.fullAddress[lang]}
                          </p>
                          <span className="text-[11px] text-[#94A3B8]">
                            {lang === 'he' ? "רובע ג', אשדוד" : 'Rova Gimmel, Ashdod'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0B0C0E] border border-[#252A32] flex items-center justify-center shrink-0 mt-0.5">
                          <Phone className="w-4 h-4 text-[#FF7B1C]" />
                        </div>
                        <div>
                          <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider block font-semibold">
                            {lang === 'he' ? 'טלפון ישיר' : 'Direct Phone'}
                          </span>
                          <a
                            href={`tel:${BUSINESS_CONFIG.contact.phone}`}
                            className="text-xs sm:text-sm font-bold text-[#FAF9F6] hover:text-[#FF7B1C] mt-0.5 block transition-colors underline"
                          >
                            {BUSINESS_CONFIG.contact.phoneFormatted}
                          </a>
                          <span className="text-[11px] text-[#94A3B8]">
                            {lang === 'he' ? 'מענה בשעות הפעילות' : 'Available during open hours'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Takeaway Model Note */}
                    <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-[#FF7B1C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#FAF9F6] block">
                          {lang === 'he' ? 'איסוף עצמי וטייק אווי' : 'Takeaway & Self-Pickup'}
                        </span>
                        <p className="text-[#94A3B8] mt-0.5 leading-relaxed text-[11px] sm:text-xs">
                          {BUSINESS_CONFIG.location.takeawayNote[lang]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

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
    </section>
  );
};

