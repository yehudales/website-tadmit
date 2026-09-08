import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Clock,
  MapPin,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { useStoreStatus } from '../hooks/useStoreStatus';
import { Language } from '../types';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { InteractiveDisclosureTrigger } from './InteractiveDisclosureTrigger';
import { getDrawerAnimationConfig } from '../utils/drawerAnimation';

interface LiveStoreStatusSectionProps {
  lang: Language;
  onOpenWhatsApp?: () => void;
}

export const LiveStoreStatusSection: React.FC<LiveStoreStatusSectionProps> = ({
  lang,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const drawerAnim = getDrawerAnimationConfig(shouldReduceMotion);
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
        <div className="text-[16.1px] sm:text-[18.4px] font-medium text-[#94A3B8] tracking-wide mb-1 sm:mb-2 flex items-center justify-center gap-1.5 flex-wrap">
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

        {/* Interactive "שעות פתיחה" Trigger (Frameless, Direct on Page) */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center w-full max-w-2xl">
          <InteractiveDisclosureTrigger
            isOpen={isHoursOpen}
            onToggle={() => setIsHoursOpen((prev) => !prev)}
            label={lang === 'he' ? 'שעות פתיחה' : 'Opening Hours'}
            ariaControls="opening-hours-expandable-content"
            ariaLabelOpen={lang === 'he' ? 'סגור פירוט שעות פתיחה' : 'Close opening hours details'}
            ariaLabelClosed={lang === 'he' ? 'פתח פירוט שעות פתיחה' : 'Open opening hours details'}
          />

          {/* Expandable Opening Hours Information */}
          <AnimatePresence>
            {isHoursOpen && (
              <motion.div
                id="opening-hours-expandable-content"
                initial={{ opacity: 0, height: 0 }}
                animate={drawerAnim.open}
                exit={drawerAnim.closed}
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
                        <span className="text-[12.65px] sm:text-[13.8px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                          {lang === 'he' ? 'שעות פעילות' : 'Operating Schedule'}
                        </span>
                        <p className="text-[13.8px] sm:text-[16.1px] font-bold text-[#FF7B1C] mt-0.5">
                          {BUSINESS_CONFIG.hours.summary[lang]}
                        </p>
                        <p className="text-[13.8px] text-[#94A3B8] mt-0.5">
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
                          <span className="text-[12.65px] text-[#94A3B8] uppercase tracking-wider block font-semibold">
                            {lang === 'he' ? 'כתובת לאיסוף' : 'Pickup Address'}
                          </span>
                          <p className="text-[13.8px] sm:text-[16.1px] font-bold text-[#FAF9F6] mt-0.5">
                            {BUSINESS_CONFIG.location.fullAddress[lang]}
                          </p>
                          <span className="text-[12.65px] text-[#94A3B8]">
                            {lang === 'he' ? "רובע ג', אשדוד" : 'Rova Gimmel, Ashdod'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0B0C0E] border border-[#252A32] flex items-center justify-center shrink-0 mt-0.5">
                          <Phone className="w-4 h-4 text-[#FF7B1C]" />
                        </div>
                        <div>
                          <span className="text-[12.65px] text-[#94A3B8] uppercase tracking-wider block font-semibold">
                            {lang === 'he' ? 'טלפון ישיר' : 'Direct Phone'}
                          </span>
                          <a
                            href={`tel:${BUSINESS_CONFIG.contact.phone}`}
                            className="text-[13.8px] sm:text-[16.1px] font-bold text-[#FAF9F6] hover:text-[#FF7B1C] mt-0.5 block transition-colors underline"
                          >
                            {BUSINESS_CONFIG.contact.phoneFormatted}
                          </a>
                          <span className="text-[12.65px] text-[#94A3B8]">
                            {lang === 'he' ? 'מענה בשעות הפעילות' : 'Available during open hours'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Takeaway Model Note */}
                    <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-[13.8px] flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-[#FF7B1C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#FAF9F6] block">
                          {lang === 'he' ? 'איסוף עצמי וטייק אווי' : 'Takeaway & Self-Pickup'}
                        </span>
                        <p className="text-[#94A3B8] mt-0.5 leading-relaxed text-[12.65px] sm:text-[13.8px]">
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
    </section>
  );
};

