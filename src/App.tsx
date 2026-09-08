import React, { useState, useEffect } from 'react';
import { Language, NavSectionId } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LiveStoreStatusSection } from './components/LiveStoreStatusSection';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { WeeklyEnergyTimeline } from './components/WeeklyEnergyTimeline';
import { WhatsAppModal } from './components/WhatsAppModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { PrivacyModal } from './components/PrivacyModal';
import { SettingsModal } from './components/SettingsModal';
import { BUSINESS_CONFIG } from './config/businessConfig';

const pathToSection = (pathOrHash: string): NavSectionId | null => {
  if (typeof window === 'undefined') return null;
  const clean = decodeURIComponent(pathOrHash)
    .replace(/^#\/?/, '')
    .replace(/^\//, '')
    .trim()
    .toLowerCase();

  if (clean === 'reviews' || clean === 'ביקורות') return 'reviews';
  if (clean === 'about' || clean === 'אודות') return 'about';
  if (clean === 'updates' || clean === 'עדכונים') return 'updates';
  if (clean === 'business-orders' || clean === 'catering' || clean === 'הזמנות-עסקיות' || clean === 'הזמנות עסקיות') return 'business-orders';
  if (clean === 'location' || clean === 'branch' || clean === 'סניף') return 'location';
  return null;
};

export default function App() {
  const [lang, setLang] = useState<Language>('he');
  const [activeSection, setActiveSection] = useState<NavSectionId | null>(null);
  const [isKashrutOpen, setIsKashrutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // ALWAYS open Home at the top (scrollY 0) upon fresh load / refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      try {
        window.history.replaceState(null, '', '/');
      } catch {}
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  // Listen to in-session back/forward navigation only
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.section) {
        setActiveSection(e.state.section);
      } else {
        setActiveSection(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Synchronize document direction and lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.title = lang === 'he'
      ? `${BUSINESS_CONFIG.name.he} — ${BUSINESS_CONFIG.tagline.he} | ${BUSINESS_CONFIG.location.city.he}`
      : `${BUSINESS_CONFIG.name.en} — ${BUSINESS_CONFIG.tagline.en} | ${BUSINESS_CONFIG.location.city.en}`;
  }, [lang]);

  const handleSelectSection = (sectionId: NavSectionId) => {
    setActiveSection((prev) => {
      const next = prev === sectionId ? null : sectionId;
      if (typeof window !== 'undefined') {
        const nextUrl = next ? `/${next}` : '/';
        window.history.pushState({ section: next }, '', nextUrl);
      }
      return next;
    });
  };

  const handleCloseSection = () => {
    setActiveSection(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({ section: null }, '', '/');
    }
  };

  const handleGoHome = () => {
    setActiveSection(null);
    setIsKashrutOpen(false);
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', '/');
      } catch {}
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <div
      dir={lang === 'he' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#0B0C0E] text-[#FAF9F6] font-sans antialiased selection:bg-[#FF7B1C] selection:text-[#0B0C0E]"
    >
      {/* Temporary Debug Version Marker (Fixed top-left, circular, high z-index, pointer-events none) */}
      <div
        id="debug-version-marker"
        className="fixed top-2 left-2 z-[9999] pointer-events-none w-6 h-6 rounded-full bg-[#1A1D22]/80 border border-white/20 text-[#FAF9F6]/80 text-[10px] font-mono font-bold flex items-center justify-center select-none shadow-sm"
        aria-hidden="true"
      >
        40
      </div>

      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#FF7B1C] focus:text-[#0B0C0E] focus:font-bold focus:rounded-lg focus:outline-none focus:ring-4 focus:ring-[#FF7B1C]/50"
      >
        {lang === 'he' ? 'דלג לתוכן המרכזי' : 'Skip to main content'}
      </a>

      {/* Sticky Top Navigation Bar with directly attached Expandable Panels */}
      <Header
        lang={lang}
        activeSection={activeSection}
        onSelectSection={(sectionId) => {
          setIsKashrutOpen(false);
          handleSelectSection(sectionId);
        }}
        onCloseSection={handleCloseSection}
        onGoHome={handleGoHome}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        isKashrutOpen={isKashrutOpen}
        onCloseKashrut={() => setIsKashrutOpen(false)}
        onToggleKashrut={() => {
          if (!isKashrutOpen && activeSection) {
            handleCloseSection();
          }
          setIsKashrutOpen((prev) => !prev);
        }}
      />

      {/* Main Content Landmark */}
      <main
        id="main-content"
        tabIndex={-1}
        className="focus:outline-none"
      >
        {/* Stationary Fixed Cinematic 16:9 Hero Video */}
        <Hero lang={lang} />

        {/* Scrolling Foreground Layer (Slides upward over the stationary fixed video like a curtain/shutter) */}
        <div className="relative z-20 bg-[#0B0C0E] shadow-[0_-20px_40px_rgba(0,0,0,0.85)] border-t border-[#252A32]/60">
          {/* Live Store Status & Modern Large Countdown Timer */}
          <LiveStoreStatusSection
            lang={lang}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />

          {/* Visual Gallery */}
          <GallerySection lang={lang} />

          {/* Legal and Brand Footer */}
          <Footer
            lang={lang}
            onOpenAccessibility={() => setIsAccessibilityOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        </div>
      </main>

      {/* Weekly Energy Timeline & Live Status Bar */}
      <WeeklyEnergyTimeline lang={lang} />

      {/* WhatsApp Multi-Option Contact Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        lang={lang}
      />

      {/* Accessibility Policy Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        lang={lang}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        lang={lang}
      />

      {/* Settings Modal (Language + Accessibility Controls) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        onLanguageChange={setLang}
        onOpenAccessibilityStatement={() => setIsAccessibilityOpen(true)}
      />
    </div>
  );
}
