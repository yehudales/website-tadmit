import React, { useState, useEffect, useRef } from 'react';
import { Settings, Home } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language, NavSectionId } from '../types';
import { Logo } from './Logo';
import { ExpandableContentSection } from './ExpandableContentSection';
import { KashrutTabContent } from './KashrutBanner';
import { InteractiveDisclosureTrigger } from './InteractiveDisclosureTrigger';
import { hasToolbarShimmerPlayed, markToolbarShimmerAsPlayed } from '../utils/sessionShimmer';
import { getDrawerAnimationConfig } from '../utils/drawerAnimation';

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
  isKashrutOpen?: boolean;
  onCloseKashrut?: () => void;
  onToggleKashrut?: () => void;
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
  isKashrutOpen = false,
  onCloseKashrut,
  onToggleKashrut,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const drawerAnim = getDrawerAnimationConfig(shouldReduceMotion);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const baseHeaderRef = useRef<HTMLDivElement>(null);
  // Entrance text glint state for top navigation labels (runs once on initial page load)
  const [isShimmerActive, setIsShimmerActive] = useState(false);

  useEffect(() => {
    if (hasToolbarShimmerPlayed()) return;

    markToolbarShimmerAsPlayed();

    // 250ms initial pause after mount so the page layout and fonts settle before the light sweep begins
    const startTimer = setTimeout(() => {
      setIsShimmerActive(true);
    }, 250);

    // 1.4s animation + 280ms stagger = ~1.68s. After 2.1s from mount, return cleanly to standard text state
    const endTimer = setTimeout(() => {
      setIsShimmerActive(false);
    }, 2100);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, []);

  // Measure base header height (row 1 + row 2) and keep --header-height CSS variable synchronized
  useEffect(() => {
    let ticking = false;
    const updateHeaderHeight = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (baseHeaderRef.current) {
            const height = baseHeaderRef.current.offsetHeight;
            document.documentElement.style.setProperty('--header-height', `${height}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    if (baseHeaderRef.current) {
      resizeObserver.observe(baseHeaderRef.current);
    }

    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  // Instantly re-synchronize header height when Kashrut drawer state toggles
  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (baseHeaderRef.current) {
        const height = baseHeaderRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    });
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
        className={`relative w-full z-40 transition-colors duration-300 bg-[#0B0C0E] border-b ${
          scrolled
            ? 'shadow-2xl border-[#252A32]'
            : 'shadow-md border-[#252A32]/80'
        }`}
      >
        {/* Base Locked Header Container (Row 1 + Row 2 measured for page clearance) */}
        <div ref={baseHeaderRef} className="w-full shrink-0 relative z-50 bg-[#0B0C0E]">
          {/* ROW 1: Top Header Area (Brand Title, "כשר למהדרין" & Settings Action) */}
          <div className="border-b border-[#252A32]/60 py-2 sm:py-2.5 bg-[#0B0C0E]/95 flex flex-col justify-center min-h-[104px]">
            <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 grid grid-cols-3 items-center shrink-0">
              {/* Left / Home shortcut (Left Col) */}
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => {
                    if (onGoHome) {
                      onGoHome();
                    } else {
                      if (onCloseSection) onCloseSection();
                      if (onCloseKashrut) onCloseKashrut();
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#16191E] border border-[#252A32] hover:border-[#FF7B1C]/40 text-[#FAF9F6]/80 hover:text-[#FF7B1C] transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
                  aria-label={`${BUSINESS_CONFIG.name[lang]} - דף הבית`}
                >
                  <Home className="w-4 h-4" />
                </button>
              </div>

              {/* Center: Brand Logo & "כשר למהדרין" directly below (Center Col) */}
              <div className="flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (onGoHome) {
                      onGoHome();
                    } else {
                      if (onCloseSection) onCloseSection();
                      if (onCloseKashrut) onCloseKashrut();
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }
                  }}
                  className="flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] rounded-lg transition-transform duration-300 hover:scale-105"
                  aria-label={`${BUSINESS_CONFIG.name[lang]} - דף הבית`}
                >
                  <Logo className="h-[89.6px] sm:h-8 md:h-9 w-auto" />
                </button>

                {/* "כשר למהדרין" - precisely aligned directly below the logo */}
                <div className="mt-0.5 sm:mt-1 flex items-center justify-center">
                  <InteractiveDisclosureTrigger
                    variant="kashrut-arrow"
                    isOpen={!!isKashrutOpen}
                    onToggle={onToggleKashrut || (() => {})}
                    label={lang === 'he' ? 'כשר למהדרין' : 'Strict Mehadrin Kosher'}
                    ariaControls="kashrut-drawer-container"
                    ariaLabelOpen={lang === 'he' ? 'סגור פירוט כשרות למהדרין' : 'Close strict kosher details'}
                    ariaLabelClosed={lang === 'he' ? 'פתח פירוט כשר למהדרין' : 'Open strict kosher details'}
                  />
                </div>
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

            {/* When "כשר למהדרין" is opened: Drawer expands directly from existing banner area, pushing all content below DOWN */}
            <AnimatePresence>
              {isKashrutOpen && (
                <motion.div
                  id="kashrut-drawer-container"
                  initial={{ opacity: 0, height: 0 }}
                  animate={drawerAnim.open}
                  exit={drawerAnim.closed}
                  style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'height' }}
                  className="w-full overflow-hidden"
                >
                  <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-1">
                    <KashrutTabContent lang={lang} onClose={onCloseKashrut} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                  const showShimmer = isShimmerActive && !isActive;

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
                          <span
                            className={`inline-block ${
                              showShimmer
                                ? lang === 'he'
                                  ? 'toolbar-nav-text-glint-rtl'
                                  : 'toolbar-nav-text-glint-ltr'
                                : ''
                            }`}
                            style={
                              showShimmer
                                ? {
                                    animationDelay: `${index * 70}ms`,
                                  }
                                : undefined
                            }
                          >
                            {item.label[lang]}
                          </span>
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

        {/* ROW 3: EXPANDABLE PANELS — PHYSICAL DRAWER IN SAME PAGE FLOW (Pushes content below downward) */}
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
