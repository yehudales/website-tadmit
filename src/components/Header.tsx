import React, { useState, useEffect, useRef } from 'react';
import { Settings, Home } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language, NavSectionId } from '../types';
import { Logo } from './Logo';
import { ExpandableContentSection } from './ExpandableContentSection';

interface HeaderProps {
  lang: Language;
  activeSection: NavSectionId | null;
  onSelectSection: (sectionId: NavSectionId) => void;
  onOpenSettings: () => void;
  onOpenWhatsApp: () => void;
  onOpenAccessibility: () => void;
  onOpenPrivacy: () => void;
  onCloseSection?: () => void;
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
}) => {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const baseHeaderRef = useRef<HTMLDivElement>(null);

  // Measure base header height (row 1 + row 2) and keep --header-height CSS variable synchronized
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
  }, []);

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
        <div ref={baseHeaderRef} className="w-full">
          {/* ROW 1: Top Header Area (Brand Title & Settings Action) */}
          <div className="border-b border-[#252A32]/60 py-2 sm:py-2.5 bg-[#0B0C0E]/95">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
              {/* Left / Home shortcut */}
              <a
                href="#"
                className="flex items-center gap-2 text-[#FAF9F6] hover:text-[#FF7B1C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] rounded-full p-1"
                aria-label={`${BUSINESS_CONFIG.name[lang]} - דף הבית`}
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#16191E] border border-[#252A32] flex items-center justify-center text-[#FAF9F6]/80 hover:text-[#FF7B1C] hover:border-[#FF7B1C]/40 transition-all">
                  <Home className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline font-bold tracking-tight text-xs sm:text-sm text-[#FAF9F6]/90">
                  {BUSINESS_CONFIG.name[lang]}
                </span>
              </a>

              {/* Center: Brand Logo / Wordmark */}
              <a
                href="#"
                className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] rounded-lg transition-transform duration-300 hover:scale-105"
                aria-label={`${BUSINESS_CONFIG.name[lang]} - דף הבית`}
              >
                <Logo className="h-7 sm:h-8 md:h-9 w-auto" />
              </a>

              {/* Right / Settings Action */}
              <div className="flex items-center gap-2">
                {/* Settings Button: Displays ONLY the gear icon ⚙ in WHITE */}
                <button
                  onClick={onOpenSettings}
                  type="button"
                  className="min-h-[38px] min-w-[38px] p-2 rounded-full bg-[#16191E] hover:bg-[#20242B] border border-[#252A32] hover:border-white/40 text-white transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={lang === 'he' ? 'הגדרות' : 'Settings'}
                  title={lang === 'he' ? 'הגדרות' : 'Settings'}
                >
                  <Settings className="w-4 h-4 text-white" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

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
