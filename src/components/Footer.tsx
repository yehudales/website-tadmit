import React from 'react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  lang: Language;
  onOpenAccessibility: () => void;
  onOpenPrivacy: () => void;
  onOpenWhatsApp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenAccessibility,
  onOpenPrivacy,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="links"
      role="contentinfo"
      aria-label={lang === 'he' ? 'מידע משפטי וזכויות יוצרים' : 'Legal information and copyright'}
      className="bg-[#0B0C0E] border-t border-[#252A32] text-[#94A3B8] py-3.5 sm:py-4 pb-20 sm:pb-22 lg:pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
          {/* Brand Logo & Copyright (Positioned toward the right in RTL) */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-start">
            <a href="#" className="inline-block" aria-label={BUSINESS_CONFIG.name[lang]}>
              <Logo className="h-10 sm:h-11.5 w-auto" />
            </a>
            <div className="text-xs text-[#94A3B8] leading-tight">
              © {currentYear} {BUSINESS_CONFIG.name[lang]}. {lang === 'he' ? 'כל הזכויות שמורות.' : 'All rights reserved.'}
            </div>
          </div>

          {/* Legal and Accessibility Links */}
          <div className="flex items-center gap-3 text-xs leading-tight">
            <button
              type="button"
              onClick={onOpenAccessibility}
              className="hover:text-[#FAF9F6] transition-colors underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] px-1 py-1 rounded min-h-[36px] flex items-center cursor-pointer"
            >
              {lang === 'he' ? 'הצהרת נגישות' : 'Accessibility Statement'}
            </button>
            <span aria-hidden="true" className="text-[#252A32]">•</span>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-[#FAF9F6] transition-colors underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] px-1 py-1 rounded min-h-[36px] flex items-center cursor-pointer"
            >
              {lang === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

