import React from 'react';
import { MapPin, Phone, Clock, ShieldCheck, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppOrderUrl } from '../config/businessConfig';
import { Language } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  lang: Language;
  onOpenAccessibility: () => void;
  onOpenPrivacy: () => void;
  onOpenWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenAccessibility,
  onOpenPrivacy,
  onOpenWhatsApp,
}) => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = getWhatsAppOrderUrl();

  const navLinks = [
    { href: '#about', label: { he: 'אודות', en: 'About' } },
    { href: '#updates', label: { he: 'עדכונים', en: 'Updates' } },
    { href: '#business-orders', label: { he: 'הזמנות עסקיות', en: 'Business Orders' } },
    { href: '#location', label: { he: 'סניף', en: 'Branch' } },
    { href: '#contact', label: { he: 'יצירת קשר', en: 'Contact' } },
    { href: '#menu', label: { he: 'תפריט מובחר', en: 'Specialty Menu' } },
    { href: '#kashrut', label: { he: 'פיקוח וכשרות', en: 'Kashrut Supervision' } },
    { href: '#gallery', label: { he: 'גלריית תמונות', en: 'Photo Gallery' } },
    { href: '#links', label: { he: 'קישורים שימושיים', en: 'Useful Links' } },
  ];

  return (
    <footer
      id="links"
      role="contentinfo"
      aria-label={lang === 'he' ? 'קישורים ומידע תחתון' : 'Footer and Links'}
      className="bg-[#0B0C0E] border-t border-[#252A32] text-[#94A3B8] pt-12 sm:pt-16 pb-28 lg:pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-10 sm:pb-12 border-b border-[#252A32]">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#" className="inline-block">
              <Logo className="h-12 sm:h-14 w-auto" />
            </a>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-sm font-normal">
              {BUSINESS_CONFIG.description[lang]}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-[#1A1D22] border border-[#252A32] text-[#FAF9F6]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{BUSINESS_CONFIG.kashrut.fullBadge[lang]}</span>
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E0BE55]">
              {lang === 'he' ? 'ניווט מהיר' : 'Quick Navigation'}
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-[#FAF9F6] transition-colors inline-block py-1 min-h-[36px] flex items-center"
                  >
                    {link.label[lang]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E0BE55]">
              {lang === 'he' ? 'פרטי סניף והזמנות' : 'Branch Details & Orders'}
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E0BE55] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#FAF9F6] block">
                    {BUSINESS_CONFIG.location.address[lang]}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#94A3B8]">
                    {BUSINESS_CONFIG.location.takeawayNote[lang]}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#E0BE55] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#FAF9F6] block font-medium">
                    {BUSINESS_CONFIG.hours.summary[lang]}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#94A3B8]">
                    {BUSINESS_CONFIG.hours.note[lang]}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E0BE55] shrink-0" />
                <a
                  href={`tel:${BUSINESS_CONFIG.contact.phone}`}
                  className="text-[#FAF9F6] hover:text-[#E0BE55] font-bold transition-colors underline min-h-[44px] flex items-center"
                >
                  {BUSINESS_CONFIG.contact.phoneFormatted}
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0C0E] text-xs sm:text-sm font-black transition-all active:scale-95 shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-[#0B0C0E]" />
                <span>{BUSINESS_CONFIG.whatsapp.ctaText[lang]}</span>
              </a>

              <button
                onClick={onOpenWhatsApp}
                className="inline-flex items-center min-h-[44px] gap-2 px-4 py-2 rounded-xl bg-[#1A1D22] hover:bg-[#22262D] border border-[#252A32] text-[#FAF9F6] text-xs font-semibold transition-colors active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'he' ? 'אפשרויות פנייה' : 'Inquiry Options'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal, Accessibility & Copyright */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div>
            © {currentYear} {BUSINESS_CONFIG.name[lang]}. {lang === 'he' ? 'כל הזכויות שמורות.' : 'All rights reserved.'}
            <span className="mx-2">•</span>
            <span>{BUSINESS_CONFIG.location.city[lang]}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAccessibility}
              className="hover:text-[#FAF9F6] transition-colors underline focus:outline-none min-h-[44px] flex items-center"
            >
              {lang === 'he' ? 'הצהרת נגישות (WCAG 2.2)' : 'Accessibility Statement'}
            </button>
            <span>•</span>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#FAF9F6] transition-colors underline focus:outline-none min-h-[44px] flex items-center"
            >
              {lang === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
