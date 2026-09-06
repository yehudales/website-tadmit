import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppOrderUrl } from '../config/businessConfig';
import { Language } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onOpenWhatsApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onOpenWhatsApp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Major sections mandated by project instructions
  const navItems = [
    { href: '#about', label: { he: 'אודות', en: 'About' } },
    { href: '#updates', label: { he: 'עדכונים', en: 'Updates' } },
    { href: '#business-orders', label: { he: 'הזמנות עסקיות', en: 'Business Orders' } },
    { href: '#location', label: { he: 'סניף', en: 'Branch' } },
    { href: '#contact', label: { he: 'יצירת קשר', en: 'Contact' } },
    { href: '#links', label: { he: 'קישורים', en: 'Links' } },
  ];

  const toggleLanguage = () => {
    onLanguageChange(lang === 'he' ? 'en' : 'he');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0B0C0E]/95 backdrop-blur-md shadow-2xl border-b border-[#252A32] py-2.5 sm:py-3'
            : 'bg-gradient-to-b from-[#0B0C0E]/90 via-[#0B0C0E]/60 to-transparent backdrop-blur-[2px] border-b border-white/5 py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo / Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] rounded-lg transition-transform duration-300 hover:scale-105"
            aria-label={`${BUSINESS_CONFIG.name[lang]} - דף הבית`}
          >
            <Logo className="h-8 sm:h-9 md:h-10 w-auto" />
          </a>

          {/* Desktop Horizontal Navigation */}
          <nav
            aria-label={lang === 'he' ? 'ניווט ראשי' : 'Main Navigation'}
            className="hidden lg:flex items-center gap-6 xl:gap-8"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-semibold text-[#FAF9F6]/85 hover:text-[#E0BE55] transition-colors py-1 relative after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#E0BE55] after:origin-right after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {item.label[lang]}
              </a>
            ))}
          </nav>

          {/* Header Right Actions: Language Switch & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 text-xs font-bold text-[#FAF9F6]/90 hover:text-white backdrop-blur-md transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55]"
              aria-label={lang === 'he' ? 'Switch to English' : 'החלף לעברית'}
            >
              <Globe className="w-3.5 h-3.5 text-[#E0BE55]" aria-hidden="true" />
              <span>{lang === 'he' ? 'EN' : 'עב'}</span>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden min-h-[40px] min-w-[40px] p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 text-[#FAF9F6] backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] flex items-center justify-center"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? (lang === 'he' ? 'סגור תפריט' : 'Close menu') : (lang === 'he' ? 'פתח תפריט' : 'Open menu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#FAF9F6]" /> : <Menu className="w-5 h-5 text-[#FAF9F6]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'he' ? 'תפריט ניווט במכשיר נייד' : 'Mobile Navigation Menu'}
          className="fixed inset-0 z-50 lg:hidden bg-[#0B0C0E]/98 backdrop-blur-2xl flex flex-col"
        >
          {/* Drawer Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-[#252A32] min-h-[64px]">
            <a href="#" onClick={() => setMobileMenuOpen(false)}>
              <Logo className="h-8 w-auto" />
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-[#1A1D22] border border-[#252A32] text-xs font-semibold text-[#94A3B8] hover:text-[#FAF9F6] flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55]"
              >
                <Globe className="w-4 h-4 text-[#E0BE55]" />
                <span>{lang === 'he' ? 'English' : 'עברית'}</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label={lang === 'he' ? 'סגור תפריט ניווט' : 'Close navigation menu'}
                className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#1A1D22] border border-[#252A32] text-[#94A3B8] hover:text-[#FAF9F6] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55]"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Drawer Navigation Links */}
          <nav
            aria-label={lang === 'he' ? 'קישורי תפריט נייד' : 'Mobile menu links'}
            className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-2"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="flex items-center justify-between min-h-[52px] px-4 rounded-xl text-base font-bold text-[#FAF9F6] hover:bg-[#1A1D22] hover:text-[#E0BE55] transition-colors border border-transparent hover:border-[#252A32]"
              >
                <span>{item.label[lang]}</span>
                <span className="text-[#94A3B8] text-xs opacity-60">←</span>
              </a>
            ))}
          </nav>

          {/* Drawer Bottom CTA */}
          <div className="p-5 border-t border-[#252A32] bg-[#121417]/80">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWhatsApp();
              }}
              className="w-full min-h-[50px] inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0C0E] font-black text-sm shadow-lg transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{BUSINESS_CONFIG.whatsapp.ctaText[lang]}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
