import React, { useState, useEffect, useRef } from 'react';
import { Settings, Home, CheckCircle2, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language, NavSectionId } from '../types';
import { Logo } from './Logo';
import { ExpandableContentSection } from './ExpandableContentSection';
import { InteractiveDisclosureTrigger } from './InteractiveDisclosureTrigger';

interface HeaderProps {
  lang: Language;
  activeSection: NavSectionId | null;
  onSelectSection: (sectionId: NavSectionId) => void;
  onOpenSettings: () => void;
  onOpenWhatsApp: () => void;
  onOpenAccessibility: () => void;
  onOpenPrivacy: () => void;
  onCloseSection?: () => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  activeSection,
  onSelectSection,
  onOpenSettings,
  onOpenWhatsApp,
  onOpenAccessibility,
  onOpenPrivacy,
  onCloseSection,
  onGoHome,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isKashrutOpen, setIsKashrutOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const baseHeaderRef = useRef<HTMLDivElement>(null);

  // Measure base header height (row 1 + row 2 + kashrut panel) and keep --header-height CSS variable synchronized
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (baseHeaderRef.current) {
        const height = baseHeaderRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [isKashrutOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // The 5 toolbar navigation items (RTL order: אודות | עדכונים | הזמנות עסקיות | סניף | ביקורות)
  const navItems: { id: NavSectionId; label: { he: string; en: string } }[] = [
    { id: 'about', label: { he: 'אודות', en: 'About' } },
    { id: 'updates', label: { he: 'עדכונים', en: 'Updates' } },
    { id: 'business-orders', label: { he: 'הזמנות עסקיות', en: 'Business Orders' } },
    { id: 'location', label: { he: 'סניף', en: 'Branch' } },
    { id: 'reviews', label: { he: 'ביקורות', en: 'Reviews' } },
  ];

  const handleNavItemClick = (sectionId: NavSectionId) => {
    onSelectSection(sectionId);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 bg-[#0B0C0E] border-b ${
          scrolled
            ? 'shadow-2xl border-[#252A32]'
            : 'shadow-md border-[#252A32]/80'
        }`}
      >
        {/* Base Locked Header Container (Row 1 + Row 2 measured for page clearance) */}
        <div ref={baseHeaderRef} className="w-full shrink-0 relative z-50 bg-[#0B0C0E]">
          {/* Minimal Solid Black Top Banner / Layer (Mobile-Only: frames initial viewport without extra scrolling) */}
          <div
            id="mobile-top-black-banner"
            className="block sm:hidden w-full bg-[#000000] border-b border-[#1A1D22]/60 shrink-0"
            style={{ height: 'max(env(safe-area-inset-top, 0px), 12px)' }}
            aria-hidden="true"
          />

          {/* ROW 1: Top Header Area (Brand Title & Settings Action) */}
          <div
            className="border-b border-[#252A32]/60 py-2 sm:py-2.5 bg-[#0B0C0E]/95 flex items-center"
            style={{ height: '104.8889px' }}
          >
            <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 grid grid-cols-3 items-center">
              {/* Left / Home shortcut (Left Col) */}
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => {
                    if (onGoHome) {
                      onGoHome();
                    } else {
                      if (onCloseSection) onCloseSection();
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#16191E] border border-[#252A32] hover:border-[#FF7B1C]/40 text-[#FAF9F6]/80 hover:text-[#FF7B1C] transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
                  aria-label={`${BUSINESS_CONFIG.name[lang]} - דף הבית`}
                >
                  <Home className="w-4 h-4" />
                </button>
              </div>

              {/* Center: Kashrut trigger (TOP) + Brand Logo (BELOW) */}
              <div className="relative flex flex-col items-center justify-center -space-y-0.5 sm:space-y-0">
                <InteractiveDisclosureTrigger
                  isOpen={isKashrutOpen}
                  onToggle={() => setIsKashrutOpen((prev) => !prev)}
                  label={lang === 'he' ? 'כשר למהדרין' : 'Strict Mehadrin Kosher'}
                  emojiColor="#E6BB6E"
                  circleColor="#E6BB6E"
                  accentColor="#E6BB6E"
                  textClassName="font-['Frank_Ruhl_Libre',serif] text-[11px] sm:text-xs md:text-sm font-bold tracking-wide"
                  ariaControls="kashrut-expandable-content"
                  ariaLabelOpen={lang === 'he' ? 'סגור פירוט כשרות למהדרין' : 'Close strict kosher details'}
                  ariaLabelClosed={lang === 'he' ? 'פתח פירוט כשר למהדרין' : 'Open strict kosher details'}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (onGoHome) {
                      onGoHome();
                    } else {
                      if (onCloseSection) onCloseSection();
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }
                  }}
                  className="flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] rounded-lg transition-transform duration-300 hover:scale-105"
                  aria-label={`${BUSINESS_CONFIG.name[lang]} - דף הבית`}
                >
                  <Logo className="h-[64px] sm:h-7 md:h-8 w-auto" />
                </button>

                {/* Expandable Kashrut Details Panel rendered as topmost layer above all page contents */}
                <AnimatePresence>
                  {isKashrutOpen && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsKashrutOpen(false)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99998]"
                        aria-hidden="true"
                      />

                      {/* Topmost Dialog Box */}
                      <motion.div
                        id="kashrut-expandable-content"
                        initial={{ opacity: 0, y: -16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.95 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 w-[92vw] max-w-lg z-[99999] bg-[#14171C] border border-[#252A32] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-5 sm:p-7 text-start"
                      >
                        <div className="flex items-center justify-between pb-3.5 border-b border-[#252A32]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#E6BB6E] px-2.5 py-1 rounded-md bg-[#0B0C0E] border border-[#252A32]">
                              {lang === 'he' ? 'פיקוח וכשרות מהודרת' : 'Strict Kosher Supervision'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsKashrutOpen(false)}
                            className="p-1.5 rounded-lg bg-[#0B0C0E] border border-[#252A32] text-[#94A3B8] hover:text-white cursor-pointer transition-colors"
                            aria-label={lang === 'he' ? 'סגור' : 'Close'}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="pt-4 space-y-3.5">
                          <h3 className="text-lg sm:text-xl font-black text-[#FAF9F6] font-['Frank_Ruhl_Libre',serif]">
                            {lang === 'he' ? 'כשרות מהודרת למהדרין' : 'Strict Mehadrin Kosher'}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                            {lang === 'he'
                              ? 'אנו ביהודלס מקפידים על סטנדרט כשרות למהדרין מן המהדרין, עם הפרדה ובהירות מלאה לשמירה על שקט נפשי וביטחון מושלם של לקוחותינו:'
                              : 'At Yehudales, we uphold rigorous kosher standards with strict clarity and full transparency for our customers:'}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {/* Badge 1: בשרים ועופות */}
                            <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center gap-3.5">
                              <div className="w-9 h-9 rounded-lg bg-[#14171C] border border-[#252A32] flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-[#E6BB6E]" />
                              </div>
                              <div>
                                <span className="text-[10px] text-[#94A3B8] uppercase block font-medium">
                                  {lang === 'he' ? 'בשרים ועופות' : 'Meat & Poultry'}
                                </span>
                                <div className="text-xs sm:text-sm font-bold text-[#FAF9F6]">
                                  {lang === 'he' ? 'בשר: נווה ציון' : 'Meat: Neve Zion'}
                                </div>
                                <span className="text-[10px] text-[#E6BB6E] font-semibold block">
                                  {lang === 'he' ? 'בשר חלק למהדרין' : 'Strict Mehadrin Glatt'}
                                </span>
                              </div>
                            </div>

                            {/* Badge 2: שאר חומרי הגלם והמוצרים */}
                            <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center gap-3.5">
                              <div className="w-9 h-9 rounded-lg bg-[#14171C] border border-[#252A32] flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-[#FAF9F6]" />
                              </div>
                              <div>
                                <span className="text-[10px] text-[#94A3B8] uppercase block font-medium">
                                  {lang === 'he' ? 'שאר חומרי הגלם והמוצרים' : 'Other Ingredients'}
                                </span>
                                <div className="text-xs sm:text-sm font-bold text-[#FAF9F6]">
                                  {lang === 'he' ? 'בד״ץ העדה החרדית' : 'Badatz Edah HaChareidis'}
                                </div>
                                <span className="text-[10px] text-[#FAF9F6] font-semibold block">
                                  {lang === 'he' ? 'השגחה קפדנית' : 'Prestigious Supervision'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Right / Settings Action (Right Col) */}
              <div className="flex items-center justify-end">
                <button
                  onClick={onOpenSettings}
                  type="button"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#16191E] hover:bg-[#20242B] border border-[#252A32] hover:border-white/40 text-white transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={lang === 'he' ? 'הגדרות' : 'Settings'}
                  title={lang === 'he' ? 'הגדרות' : 'Settings'}
                >
                  <Settings className="w-4 h-4 text-white" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Kashrut Information Panel (Master reference animation matching שעות פתיחה) */}
          <AnimatePresence>
            {isKashrutOpen && (
              <motion.div
                id="kashrut-expandable-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="w-full overflow-hidden bg-[#0B0C0E]/98 border-b border-[#252A32] shadow-2xl relative z-50"
              >
                <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 text-start">
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#14171C] border border-[#252A32] shadow-2xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#252A32]">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#E6BB6E] px-2.5 py-1 rounded-md bg-[#0B0C0E] border border-[#252A32]">
                        {lang === 'he' ? 'פיקוח וכשרות מהודרת' : 'Strict Kosher Supervision'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsKashrutOpen(false)}
                        className="p-1.5 rounded-lg bg-[#0B0C0E] border border-[#252A32] text-[#94A3B8] hover:text-white cursor-pointer transition-colors"
                        aria-label={lang === 'he' ? 'סגור' : 'Close'}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-base sm:text-lg font-black text-[#FAF9F6] font-['Frank_Ruhl_Libre',serif]">
                        {lang === 'he' ? 'כשרות מהודרת למהדרין' : 'Strict Mehadrin Kosher'}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                        {lang === 'he'
                          ? 'אנו ביהודלס מקפידים על סטנדרט כשרות למהדרין מן המהדרין, עם הפרדה ובהירות מלאה לשמירה על שקט נפשי וביטחון מושלם של לקוחותינו:'
                          : 'At Yehudales, we uphold rigorous kosher standards with strict clarity and full transparency for our customers:'}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Badge 1: בשרים ועופות */}
                        <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-lg bg-[#14171C] border border-[#252A32] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-[#E6BB6E]" />
                          </div>
                          <div>
                            <span className="text-[10px] text-[#94A3B8] uppercase block font-medium">
                              {lang === 'he' ? 'בשרים ועופות' : 'Meat & Poultry'}
                            </span>
                            <div className="text-xs sm:text-sm font-bold text-[#FAF9F6]">
                              {lang === 'he' ? 'בשר: נווה ציון' : 'Meat: Neve Zion'}
                            </div>
                            <span className="text-[10px] text-[#E6BB6E] font-semibold block">
                              {lang === 'he' ? 'בשר חלק למהדרין' : 'Strict Mehadrin Glatt'}
                            </span>
                          </div>
                        </div>

                        {/* Badge 2: שאר חומרי הגלם והמוצרים */}
                        <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-lg bg-[#14171C] border border-[#252A32] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-[#FAF9F6]" />
                          </div>
                          <div>
                            <span className="text-[10px] text-[#94A3B8] uppercase block font-medium">
                              {lang === 'he' ? 'שאר חומרי הגלם והמוצרים' : 'Other Ingredients'}
                            </span>
                            <div className="text-xs sm:text-sm font-bold text-[#FAF9F6]">
                              {lang === 'he' ? 'בד״ץ העדה החרדית' : 'Badatz Edah HaChareidis'}
                            </div>
                            <span className="text-[10px] text-[#FAF9F6] font-semibold block">
                              {lang === 'he' ? 'השגחה קפדנית' : 'Prestigious Supervision'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ROW 2: VISIBLE LONG TOOLBAR (Directly above Hero Video along dividing line) */}
          <nav
            aria-label={lang === 'he' ? 'סרגל ניווט עליון' : 'Top Navigation Toolbar'}
            className="w-full bg-[#0E1116] border-b border-[#252A32] shadow-inner"
          >
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar scroll-smooth py-1.5 sm:py-2 gap-1 sm:gap-2 md:gap-4 lg:gap-7">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleNavItemClick(item.id)}
                        className={`min-h-[38px] px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] relative ${
                          isActive
                            ? 'text-[#FF7B1C]'
                            : 'text-[#FAF9F6]/85 hover:text-white hover:bg-white/5'
                        }`}
                        aria-expanded={isActive}
                        aria-controls="expandable-content-area"
                      >
                        <span className="relative pb-1">
                          {item.label[lang]}
                          {isActive && (
                            <span
                              className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FF7B1C] rounded-full shadow-[0_0_8px_rgba(255,123,28,0.5)]"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </button>
                      {index < navItems.length - 1 && (
                        <span className="hidden md:inline-block text-[#252A32] select-none text-xs" aria-hidden="true">
                          |
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* ROW 3: EXPANDABLE PANELS — LOCKED TO TOP TOOLBAR (Physically attached, covers Hero Video below) */}
        <ExpandableContentSection
          lang={lang}
          activeSection={activeSection}
          onClose={() => {
            if (onCloseSection) {
              onCloseSection();
            } else if (activeSection) {
              onSelectSection(activeSection);
            }
          }}
          onOpenWhatsApp={onOpenWhatsApp}
          onOpenAccessibility={onOpenAccessibility}
          onOpenPrivacy={onOpenPrivacy}
        />
      </header>
    </>
  );
};
