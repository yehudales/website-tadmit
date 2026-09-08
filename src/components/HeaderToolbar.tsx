import React, { useState, useEffect, useRef } from 'react';
import { Language, NavSectionId } from '../types';
import { ExpandableContentSection } from './ExpandableContentSection';
import { hasToolbarShimmerPlayed, markToolbarShimmerAsPlayed } from '../utils/sessionShimmer';

interface HeaderToolbarProps {
  lang: Language;
  activeSection: NavSectionId | null;
  onSelectSection: (sectionId: NavSectionId) => void;
  onOpenWhatsApp: () => void;
  onOpenAccessibility: () => void;
  onOpenPrivacy: () => void;
  onCloseSection?: () => void;
}

export const HeaderToolbar: React.FC<HeaderToolbarProps> = ({
  lang,
  activeSection,
  onSelectSection,
  onOpenWhatsApp,
  onOpenAccessibility,
  onOpenPrivacy,
  onCloseSection,
}) => {
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

  // Measure base toolbar height and keep --header-height CSS variable synchronized
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
    <header
      ref={headerRef}
      className={`relative w-full z-40 transition-colors duration-300 bg-[#0B0C0E] border-b ${
        scrolled
          ? 'shadow-2xl border-[#252A32]'
          : 'shadow-md border-[#252A32]/80'
      }`}
    >
      {/* Base Locked Toolbar Container measured for page clearance */}
      <div ref={baseHeaderRef} className="w-full shrink-0 relative z-50 bg-[#0B0C0E]">
        {/* VISIBLE LONG TOOLBAR (Directly above Hero Video along dividing line) */}
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

      {/* EXPANDABLE PANELS — PHYSICAL DRAWER IN SAME PAGE FLOW (Pushes content below downward) */}
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
  );
};
