import React, { useEffect, useRef } from 'react';
import { X, MessageCircle, HelpCircle, UtensilsCrossed, PhoneCall, ExternalLink } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { options, internationalNumber } = BUSINESS_CONFIG.whatsapp;

  const createWhatsAppLink = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    return `https://wa.me/${internationalNumber}?text=${encoded}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-[#1A1D22] border border-[#252A32] p-5 sm:p-7 md:p-8 shadow-2xl text-[#FAF9F6]"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label={lang === 'he' ? 'סגור חלון' : 'Close modal'}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-auto ltr:right-4 rtl:left-4 min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-[#94A3B8] hover:text-[#FAF9F6] hover:bg-[#0B0C0E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#0B0C0E] text-emerald-400 border border-[#252A32] flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 id="whatsapp-modal-title" className="text-xl md:text-2xl font-bold tracking-tight text-[#FAF9F6]">
              {lang === 'he' ? 'יצירת קשר ב-WhatsApp' : 'Contact via WhatsApp'}
            </h2>
            <p className="text-xs md:text-sm text-[#94A3B8]">
              {BUSINESS_CONFIG.name[lang]} • {BUSINESS_CONFIG.contact.phoneFormatted}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#94A3B8] mb-5 sm:mb-6 leading-relaxed font-normal">
          {lang === 'he'
            ? 'אנא בחרו את סוג הפנייה כדי שנוכל לחבר אתכם למענה המתאים ביותר:'
            : 'Please select the type of inquiry so we can route you to the appropriate team:'}
        </p>

        {/* 2 Clear Options */}
        <div className="space-y-3 sm:space-y-4">
          {/* Option 1: General Inquiries */}
          <a
            href={createWhatsAppLink(options.general.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-xl bg-[#0B0C0E] hover:bg-[#15171C] border border-[#252A32] hover:border-emerald-500/50 transition-all duration-200 min-h-[44px]"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#1A1D22] text-[#FAF9F6] border border-[#252A32] group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-[#FAF9F6] group-hover:text-[#E0BE55] transition-colors">
                    {options.general.title[lang]}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-[#94A3B8] group-hover:text-[#FAF9F6] transition-colors" />
                </div>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 font-normal">
                  {options.general.desc[lang]}
                </p>
                <span className="inline-block mt-2 text-xs font-semibold text-emerald-400">
                  {lang === 'he' ? 'מעבר לצ\'אט WhatsApp ←' : 'Open WhatsApp chat →'}
                </span>
              </div>
            </div>
          </a>

          {/* Option 2: Catering / Large Orders */}
          <a
            href={createWhatsAppLink(options.catering.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-xl bg-[#0B0C0E] hover:bg-[#15171C] border border-[#252A32] hover:border-emerald-500/50 transition-all duration-200 min-h-[44px]"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#1A1D22] text-[#FAF9F6] border border-[#252A32] group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-[#FAF9F6] group-hover:text-[#E0BE55] transition-colors">
                    {options.catering.title[lang]}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-[#94A3B8] group-hover:text-emerald-300 transition-colors" />
                </div>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 font-normal">
                  {options.catering.desc[lang]}
                </p>
                <span className="inline-block mt-2 text-xs font-semibold text-emerald-400">
                  {lang === 'he' ? 'מעבר לצ\'אט WhatsApp ←' : 'Open WhatsApp chat →'}
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Direct Call Fallback */}
        <div className="mt-5 sm:mt-6 pt-4 border-t border-[#252A32] flex items-center justify-between text-xs text-[#94A3B8]">
          <span>{lang === 'he' ? 'מעדיפים לחייג טלפונית?' : 'Prefer to call directly?'}</span>
          <a
            href={`tel:${BUSINESS_CONFIG.contact.phone}`}
            className="inline-flex items-center gap-1.5 font-bold text-[#FAF9F6] hover:text-[#E0BE55] underline focus:outline-none min-h-[44px]"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#E0BE55]" />
            {BUSINESS_CONFIG.contact.phoneFormatted}
          </a>
        </div>
      </div>
    </div>
  );
};
