import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppOrderUrl } from '../config/businessConfig';
import { Language } from '../types';
import { useStoreStatus } from '../hooks/useStoreStatus';

interface MobileStickyBarProps {
  lang: Language;
  onOpenWhatsApp: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  lang,
  onOpenWhatsApp,
}) => {
  const status = useStoreStatus();
  const whatsappUrl = getWhatsAppOrderUrl();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timerStr = `${pad(status.hours)}:${pad(status.minutes)}:${pad(status.seconds)}`;

  return (
    <div
      role="region"
      aria-label={lang === 'he' ? 'סרגל הזמנה מהיר למכשיר נייד' : 'Mobile Quick Order Bar'}
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0B0C0E]/95 backdrop-blur-md border-t border-[#252A32] p-2.5 sm:p-3 shadow-2xl safe-area-pb"
    >
      <div className="max-w-md mx-auto flex items-center gap-2">
        {/* Main WhatsApp Ordering CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0C0E] font-black text-sm sm:text-base shadow-[0_4px_15px_rgba(16,185,129,0.35)] active:scale-95 transition-transform"
        >
          <MessageCircle className="w-5 h-5 text-[#0B0C0E] stroke-[2.5]" />
          <span>{BUSINESS_CONFIG.whatsapp.ctaText[lang]}</span>
        </a>

        {/* Live Status Badge / Timer Pill */}
        <div
          className={`min-h-[48px] px-3 rounded-xl border flex flex-col items-center justify-center text-[10px] font-bold ${
            status.isOpen
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
              : 'bg-[#1A1D22] border-[#FF7A00]/30 text-[#FF7A00]'
          }`}
          title={status.isOpen ? 'Open Now' : 'Opens in'}
        >
          <span className="flex items-center gap-1 leading-none">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status.isOpen ? 'bg-[#22C55E] animate-pulse' : 'bg-[#FF7A00]'
              }`}
            />
            <span>{status.isOpen ? (lang === 'he' ? 'פתוח' : 'Open') : (lang === 'he' ? 'נפתח ב-' : 'In')}</span>
          </span>
          <span className="font-mono text-[11px] font-bold tabular-nums mt-0.5">
            {status.days > 0 && !status.isOpen ? `${status.days}d ` : ''}
            {timerStr}
          </span>
        </div>

        {/* Direct Call Button */}
        <a
          href={`tel:${BUSINESS_CONFIG.contact.phone}`}
          aria-label={lang === 'he' ? 'חיוג טלפוני מהיר' : 'Call store'}
          className="min-h-[48px] min-w-[48px] h-12 w-12 rounded-xl bg-[#1A1D22] border border-[#252A32] text-[#E0BE55] flex items-center justify-center active:scale-95 transition-transform shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55]"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};
