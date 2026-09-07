import React from 'react';
import { Clock } from 'lucide-react';
import { useStoreStatus } from '../hooks/useStoreStatus';
import { Language } from '../types';

interface StoreStatusWidgetProps {
  lang: Language;
  variant?: 'hero' | 'header' | 'compact' | 'drawer';
  className?: string;
}

export const StoreStatusWidget: React.FC<StoreStatusWidgetProps> = ({
  lang,
  variant = 'hero',
  className = '',
}) => {
  const status = useStoreStatus();
  const pad = (n: number) => n.toString().padStart(2, '0');

  // Time components
  const hoursStr = pad(status.hours);
  const minutesStr = pad(status.minutes);
  const secondsStr = pad(status.seconds);

  // When CLOSED: Orange visual treatment, tabular numbers, subtle glow
  // When OPEN: Glowing green "פתוח", below it in white "נסגר בעוד HH:MM:SS"

  if (variant === 'header') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
          status.isOpen
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
            : 'bg-[#1A1D22] border-[#FF7A00]/40 text-[#FF7A00]'
        } ${className}`}
        aria-live="polite"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            status.isOpen
              ? 'bg-[#22C55E] shadow-[0_0_8px_#22C55E] animate-pulse'
              : 'bg-[#FF7A00] shadow-[0_0_8px_#FF7A00]'
          }`}
        />
        {status.isOpen ? (
          <div className="flex items-center gap-1.5 text-xs font-bold leading-none">
            <span className="text-[#22C55E] font-black">{lang === 'he' ? 'פתוח' : 'Open'}</span>
            <span className="text-white/60">•</span>
            <span className="text-white font-medium text-[11px]">
              {lang === 'he' ? 'נסגר בעוד' : 'Closes in'}{' '}
              <span className="font-mono font-bold text-white tabular-nums">
                {hoursStr}:{minutesStr}:{secondsStr}
              </span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-bold leading-none">
            <span className="text-[#FF7A00] font-semibold text-[11px]">
              {lang === 'he' ? 'נפתח בעוד' : 'Opens in'}
            </span>
            <span className="font-mono font-bold tracking-tight text-[#FF7A00] tabular-nums text-xs">
              {status.days > 0 ? (
                <span>
                  {status.days}
                  <span className="text-[10px] font-sans font-medium px-0.5">
                    {lang === 'he' ? 'ימ׳' : 'd'}
                  </span>{' '}
                </span>
              ) : null}
              {hoursStr}:{minutesStr}:{secondsStr}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact' || variant === 'drawer') {
    return (
      <div
        className={`w-full p-3 rounded-xl border transition-all ${
          status.isOpen
            ? 'bg-emerald-950/30 border-emerald-500/30 text-[#FAF9F6]'
            : 'bg-[#1A1D22]/90 border-[#FF7A00]/30 text-[#FAF9F6]'
        } ${className}`}
        aria-live="polite"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                status.isOpen
                  ? 'bg-[#22C55E] shadow-[0_0_10px_#22C55E] animate-pulse'
                  : 'bg-[#FF7A00] shadow-[0_0_10px_#FF7A00]'
              }`}
            />
            <span className="text-xs font-bold text-[#94A3B8]">
              {lang === 'he' ? 'שעות פתיחה: חמישי 17:00–01:00' : 'Hours: Thu 17:00–01:00'}
            </span>
          </div>

          {status.isOpen ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-[#22C55E] text-xs font-black">
              {lang === 'he' ? 'פתוח עכשיו' : 'Open Now'}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-[#FF7A00]/20 text-[#FF7A00] text-xs font-bold">
              {lang === 'he' ? 'סגור כעת' : 'Closed'}
            </span>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-[#94A3B8] flex items-center gap-1">
            {status.isOpen ? (
              <>
                <span className="font-bold text-[#22C55E] drop-shadow-[0_0_8px_rgba(34,197,94,0.55)]">
                  {lang === 'he' ? 'פתוח' : 'Open'}
                </span>
                <span>{lang === 'he' ? 'החנות נסגרת בעוד:' : 'Store closes in:'}</span>
              </>
            ) : (
              <>
                <span className="font-bold text-[#EF4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.55)]">
                  {lang === 'he' ? 'סגור' : 'Closed'}
                </span>
                <span>{lang === 'he' ? 'החנות נפתחת בעוד:' : 'Store opens in:'}</span>
              </>
            )}
          </span>
          <span
            className={`font-mono font-bold tracking-wider tabular-nums ${
              status.isOpen ? 'text-white' : 'text-[#FF7A00]'
            }`}
          >
            {status.days > 0 && !status.isOpen ? `${status.days} ימים ` : ''}
            {hoursStr}:{minutesStr}:{secondsStr}
          </span>
        </div>
      </div>
    );
  }

  // variant === 'hero' (Full visual treatment as requested in instructions)
  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl backdrop-blur-md transition-all duration-300 ${
        status.isOpen
          ? 'bg-[#0B0C0E]/85 border border-emerald-500/50 shadow-[0_8px_32px_rgba(34,197,94,0.15)]'
          : 'bg-[#0B0C0E]/85 border border-[#FF7A00]/40 shadow-[0_8px_32px_rgba(255,107,0,0.15)]'
      } ${className}`}
      aria-live="polite"
    >
      {/* Schedule Info Header */}
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#94A3B8] mb-2 font-medium tracking-wide">
        <Clock className="w-3.5 h-3.5 text-[#FF7B1C]" />
        <span>
          {lang === 'he'
            ? 'פעילות: ימי חמישי 17:00 עד 01:00 (ליל שישי)'
            : 'Open: Thursdays 17:00 → 01:00 (Friday early morning)'}
        </span>
      </div>

      {status.isOpen ? (
        /* WHEN OPEN */
        <div className="flex flex-col items-center text-center">
          {/* Dynamic Status Header */}
          <div className="text-sm sm:text-base font-medium text-[#94A3B8] mb-1 flex items-center justify-center gap-1.5">
            <span className="font-bold text-[#22C55E] drop-shadow-[0_0_8px_rgba(34,197,94,0.55)]">
              {lang === 'he' ? 'פתוח' : 'Open'}
            </span>
            <span>{lang === 'he' ? 'החנות נסגרת בעוד:' : 'Store closes in:'}</span>
          </div>

          <div className="font-mono text-2xl sm:text-3xl font-black tracking-wider text-white tabular-nums bg-white/10 px-3 py-1 rounded-xl mt-1">
            {hoursStr}:{minutesStr}:{secondsStr}
          </div>
        </div>
      ) : (
        /* WHEN CLOSED */
        <div className="flex flex-col items-center text-center">
          {/* Dynamic Status Header */}
          <div className="text-sm sm:text-base font-medium text-[#94A3B8] mb-1 flex items-center justify-center gap-1.5">
            <span className="font-bold text-[#EF4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.55)]">
              {lang === 'he' ? 'סגור' : 'Closed'}
            </span>
            <span>{lang === 'he' ? 'החנות נפתחת בעוד:' : 'Store opens in:'}</span>
          </div>

          {/* Orange Visual Treatment: Bright premium orange, high contrast, clean typography, tabular numbers, subtle glow */}
          <div className="font-mono text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-[#FF7A00] drop-shadow-[0_0_16px_rgba(255,122,0,0.5)] tabular-nums flex items-baseline gap-1.5 sm:gap-2">
            {status.days > 0 ? (
              <span className="flex items-baseline">
                <span>{status.days}</span>
                <span className="text-xs sm:text-sm font-sans font-bold text-[#FF7A00]/80 px-1">
                  {lang === 'he' ? 'ימים' : 'days'}
                </span>
                <span className="text-[#FF7A00]/50 mx-0.5">•</span>
              </span>
            ) : null}
            <span>{hoursStr}</span>
            <span className="animate-pulse">:</span>
            <span>{minutesStr}</span>
            <span className="animate-pulse">:</span>
            <span>{secondsStr}</span>
          </div>

          <span className="text-[11px] sm:text-xs text-[#94A3B8] mt-1.5">
            {lang === 'he'
              ? 'ליל שישי הקרוב • מ-17:00 בערב'
              : 'Next Friday night feast • From 17:00'}
          </span>
        </div>
      )}
    </div>
  );
};
