import React from 'react';
import { MessageCircle, Clock, Calendar, Sparkles } from 'lucide-react';
import { useStoreStatus } from '../hooks/useStoreStatus';
import { Language } from '../types';
import { getWhatsAppOrderUrl, BUSINESS_CONFIG } from '../config/businessConfig';

interface LiveStoreStatusSectionProps {
  lang: Language;
  onOpenWhatsApp: () => void;
}

export const LiveStoreStatusSection: React.FC<LiveStoreStatusSectionProps> = ({
  lang,
  onOpenWhatsApp,
}) => {
  const status = useStoreStatus();
  const whatsappUrl = getWhatsAppOrderUrl();

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Format hours, minutes, seconds
  // When closed and days > 0, totalHours gives the exact running hours
  const hoursDisplay = pad(status.totalHours);
  const minutesDisplay = pad(status.minutes);
  const secondsDisplay = pad(status.seconds);

  return (
    <section
      id="store-status"
      aria-labelledby="store-status-heading"
      className="relative py-12 sm:py-16 md:py-20 bg-[#0B0C0E] border-b border-[#252A32] overflow-hidden"
    >
      {/* Subtle background ambient radial light */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-1000 ${
          status.isOpen
            ? 'bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(34,197,94,0.25),transparent_70%)]'
            : 'bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(249,115,22,0.25),transparent_70%)]'
        }`}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Status Header Block */}
        {status.isOpen ? (
          /* OPEN STATE */
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-black tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{lang === 'he' ? 'שירות פעיל עכשיו' : 'Active Service Now'}</span>
            </div>

            {/* Glowing Big "פתוח" text */}
            <h2
              id="store-status-heading"
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_28px_rgba(34,197,94,0.45)] mb-3"
            >
              {lang === 'he' ? 'פתוח' : 'OPEN'}
            </h2>

            {/* "נסגר בעוד" label */}
            <p className="text-base sm:text-xl md:text-2xl font-bold text-[#FAF9F6]/90 tracking-wide uppercase">
              {lang === 'he' ? 'נסגר בעוד' : 'Closes in'}
            </p>
          </div>
        ) : (
          /* CLOSED STATE */
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D22] border border-[#F97316]/40 text-[#F97316] text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
              <Clock className="w-4 h-4 text-[#F97316]" />
              <span>{lang === 'he' ? 'ליל שישי הקרוב' : 'Upcoming Thursday Night'}</span>
            </div>

            {/* Prominent "נפתח בעוד" headline */}
            <h2
              id="store-status-heading"
              className="text-2xl sm:text-4xl md:text-5xl font-black text-[#F97316] tracking-tight drop-shadow-[0_0_24px_rgba(249,115,22,0.35)] mb-2"
            >
              {lang === 'he' ? 'נפתח בעוד' : 'Opens in'}
            </h2>

            {status.days > 0 && (
              <p className="text-xs sm:text-sm md:text-base text-[#94A3B8] font-medium mt-1">
                {lang === 'he'
                  ? `יום חמישי הקרוב בשעה 17:00 (עוד ${status.days} ימים)`
                  : `Next Thursday at 17:00 (${status.days} days remaining)`}
              </p>
            )}
          </div>
        )}

        {/* Large Modern Digital Countdown Display (Tabular, Breathing Glow) */}
        <div
          className={`w-full max-w-3xl rounded-3xl p-5 sm:p-8 md:p-10 bg-[#121417] border shadow-2xl transition-all duration-700 ${
            status.isOpen ? 'timer-card-green border-emerald-500/40' : 'timer-card-orange border-[#F97316]/40'
          }`}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 font-mono font-black select-none">
            {/* Hours Block */}
            <div className="flex flex-col items-center flex-1 min-w-[75px] sm:min-w-[110px] md:min-w-[140px]">
              <span
                className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight ${
                  status.isOpen ? 'text-emerald-400' : 'text-[#F97316]'
                }`}
              >
                {hoursDisplay}
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm font-sans font-bold text-[#94A3B8] uppercase mt-2 tracking-wider">
                {lang === 'he' ? 'שעות' : 'Hours'}
              </span>
            </div>

            {/* Colon Separator */}
            <span
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl pb-6 font-bold ${
                status.isOpen ? 'text-emerald-400/60' : 'text-[#F97316]/60'
              }`}
            >
              :
            </span>

            {/* Minutes Block */}
            <div className="flex flex-col items-center flex-1 min-w-[75px] sm:min-w-[110px] md:min-w-[140px]">
              <span
                className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight ${
                  status.isOpen ? 'text-emerald-400' : 'text-[#F97316]'
                }`}
              >
                {minutesDisplay}
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm font-sans font-bold text-[#94A3B8] uppercase mt-2 tracking-wider">
                {lang === 'he' ? 'דקות' : 'Minutes'}
              </span>
            </div>

            {/* Colon Separator */}
            <span
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl pb-6 font-bold ${
                status.isOpen ? 'text-emerald-400/60' : 'text-[#F97316]/60'
              }`}
            >
              :
            </span>

            {/* Seconds Block */}
            <div className="flex flex-col items-center flex-1 min-w-[75px] sm:min-w-[110px] md:min-w-[140px]">
              <span
                className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight ${
                  status.isOpen ? 'text-emerald-400' : 'text-[#F97316]'
                }`}
              >
                {secondsDisplay}
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm font-sans font-bold text-[#94A3B8] uppercase mt-2 tracking-wider">
                {lang === 'he' ? 'שניות' : 'Seconds'}
              </span>
            </div>
          </div>

          {/* Schedule Footer Note */}
          <div className="mt-6 sm:mt-8 pt-5 border-t border-[#252A32] flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-[#94A3B8]">
            <span className="flex items-center gap-1.5 text-[#FAF9F6] font-semibold">
              <Calendar className="w-4 h-4 text-[#E0BE55]" />
              {lang === 'he' ? 'לוח זמנים קבוע:' : 'Regular Schedule:'}
            </span>
            <span>
              {lang === 'he'
                ? 'כל יום חמישי 17:00 → שישי 01:00 לפנות בוקר'
                : 'Every Thursday 17:00 → Friday 01:00 AM'}
            </span>
          </div>
        </div>

        {/* Primary Action Button under Timer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto flex-1 min-h-[52px] sm:min-h-[56px] inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-black text-base sm:text-lg transition-all active:scale-95 shadow-xl ${
              status.isOpen
                ? 'bg-emerald-500 hover:bg-emerald-400 text-[#0B0C0E] shadow-[0_8px_30px_rgba(16,185,129,0.35)]'
                : 'bg-emerald-600 hover:bg-emerald-500 text-[#FAF9F6] shadow-[0_8px_30px_rgba(16,185,129,0.25)]'
            }`}
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>
              {status.isOpen
                ? (lang === 'he' ? 'הזמנה מהירה בוואטסאפ' : 'Order Now on WhatsApp')
                : (lang === 'he' ? 'הזמנה דרך WhatsApp' : 'Order via WhatsApp')}
            </span>
          </a>
        </div>

      </div>
    </section>
  );
};
