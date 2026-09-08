import React, { useState, useEffect, useRef } from 'react';
import { Language, NavSectionId } from './types';
import { TopmostHeaderRow } from './components/TopmostHeaderRow';
import { KashrutSection } from './components/KashrutSection';
import { HeaderToolbar } from './components/HeaderToolbar';
import { Hero } from './components/Hero';
import { LiveStoreStatusSection } from './components/LiveStoreStatusSection';
import { GallerySection } from './components/GallerySection';
import { ShopSection } from './components/shop/ShopSection';
import { Footer } from './components/Footer';
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
  const [isShopMode, setIsShopMode] = useState<boolean>(false);
  const [isKashrutOpen, setIsKashrutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const isShopModeRef = useRef<boolean>(false);
  isShopModeRef.current = isShopMode;
  const lockScrollYRef = useRef<number | null>(null);

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

  // Deterministic Pre-Scroll Interception & Exact Shop Lock Boundary
  // PREVENTS default scroll BEFORE the browser can ever paint an overshot frame
  useEffect(() => {
    const getExactLockScrollY = (): number => {
      const headerEl = document.getElementById('topmost-header-row');
      const shopEl = document.getElementById('shop-experience') || document.getElementById('shop-category-bar');
      if (!headerEl || !shopEl) return 0;

      const headerHeight = headerEl.getBoundingClientRect().height;
      const shopRect = shopEl.getBoundingClientRect();
      const shopDocTop = shopRect.top + window.scrollY;

      return Math.max(0, shopDocTop - headerHeight);
    };

    let cachedLock = 0;
    const updateLockBoundary = () => {
      const computed = getExactLockScrollY();
      if (computed > 0) {
        cachedLock = computed;
      }
    };

    // Calculate on mount and window resize
    updateLockBoundary();
    window.addEventListener('resize', updateLockBoundary, { passive: true });

    const getAuthoritativeLock = (): number => {
      if (cachedLock > 0) return cachedLock;
      const computed = getExactLockScrollY();
      if (computed > 0) cachedLock = computed;
      return computed;
    };

    const activateShopMode = (exactLock: number) => {
      if (!isShopModeRef.current) {
        isShopModeRef.current = true;
        lockScrollYRef.current = exactLock;
        setIsShopMode(true);
      }
    };

    // 1. PRE-SCROLL WHEEL / TRACKPAD INTERCEPTION (non-passive)
    const handleWheel = (e: WheelEvent) => {
      const exactLock = getAuthoritativeLock();
      if (exactLock <= 0) return;

      const currentScrollY = window.scrollY;
      const projectedScrollY = currentScrollY + e.deltaY;

      if (!isShopModeRef.current) {
        // Moving DOWN and projected to reach or cross exact Shop boundary
        if (e.deltaY > 0 && projectedScrollY >= exactLock) {
          e.preventDefault();
          window.scrollTo({ top: exactLock, left: 0, behavior: 'instant' });
          activateShopMode(exactLock);
        }
      } else {
        // In Shop Mode:
        // Downward wheel (deltaY > 0) is completely FREE.
        // Upward wheel (deltaY < 0) that would move above exact boundary is PREVENTED.
        if (e.deltaY < 0) {
          if (projectedScrollY <= exactLock || currentScrollY <= exactLock + 0.5) {
            e.preventDefault();
            window.scrollTo({ top: exactLock, left: 0, behavior: 'instant' });
          }
        }
      }
    };

    // 2. PRE-SCROLL TOUCH / SWIPE INTERCEPTION (non-passive)
    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        lastTouchY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const exactLock = getAuthoritativeLock();
      if (exactLock <= 0) return;

      const currentTouchY = e.touches[0].clientY;
      const touchDelta = lastTouchY - currentTouchY; // positive = user swipes up -> page moves down
      lastTouchY = currentTouchY;

      const currentScrollY = window.scrollY;
      const projectedScrollY = currentScrollY + touchDelta;

      if (!isShopModeRef.current) {
        // Swiping UP (page moving DOWN) that crosses or reaches exact Shop boundary
        if (touchDelta > 0 && projectedScrollY >= exactLock) {
          if (e.cancelable) e.preventDefault();
          window.scrollTo({ top: exactLock, left: 0, behavior: 'instant' });
          activateShopMode(exactLock);
        }
      } else {
        // In Shop Mode:
        // Swiping UP (page moving DOWN) is completely FREE.
        // Swiping DOWN (page moving UP) is PREVENTED when near or above exact boundary.
        if (touchDelta < 0) {
          if (projectedScrollY <= exactLock || currentScrollY <= exactLock + 0.5) {
            if (e.cancelable) e.preventDefault();
            window.scrollTo({ top: exactLock, left: 0, behavior: 'instant' });
          }
        }
      }
    };

    // 3. PRE-SCROLL KEYBOARD INTERCEPTION (non-passive)
    const handleKeyDown = (e: KeyboardEvent) => {
      const exactLock = getAuthoritativeLock();
      if (exactLock <= 0) return;

      const currentScrollY = window.scrollY;

      if (!isShopModeRef.current) {
        let step = 0;
        if (e.key === 'ArrowDown') step = 40;
        else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) step = window.innerHeight * 0.8;

        if (step > 0 && currentScrollY + step >= exactLock) {
          e.preventDefault();
          window.scrollTo({ top: exactLock, left: 0, behavior: 'instant' });
          activateShopMode(exactLock);
        }
      } else {
        if (e.key === 'Home') {
          e.preventDefault();
          window.scrollTo({ top: exactLock, left: 0, behavior: 'instant' });
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
          const step = e.key === 'ArrowUp' ? 40 : window.innerHeight * 0.8;
          if (currentScrollY - step <= exactLock || currentScrollY <= exactLock + 2) {
            e.preventDefault();
            window.scrollTo({ top: exactLock, left: 0, behavior: 'instant' });
          }
        }
      }
    };

    // 4. SECONDARY SCROLL OBSERVATION
    const handleScroll = () => {
      const exactLock = getAuthoritativeLock();
      if (exactLock <= 0) return;

      const currentScrollY = window.scrollY;

      if (!isShopModeRef.current) {
        if (currentScrollY >= exactLock - 0.5) {
          activateShopMode(exactLock);
        }
      } else {
        if (currentScrollY < exactLock) {
          window.scrollTo({ top: exactLock, left: 0, behavior: 'instant' });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('resize', updateLockBoundary);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
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

  // Exit Shop Mode, close drawers/modals, restore normal scrolling and return smoothly/instantly to Home/Hero
  const handleGoHome = () => {
    lockScrollYRef.current = null;
    setIsShopMode(false);
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
        81
      </div>

      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#FF7B1C] focus:text-[#0B0C0E] focus:font-bold focus:rounded-lg focus:outline-none focus:ring-4 focus:ring-[#FF7B1C]/50"
      >
        {lang === 'he' ? 'דלג לתוכן המרכזי' : 'Skip to main content'}
      </a>

      {/* 1. TOPMOST EXISTING COMPONENT (Logo, Home shortcut, Settings) */}
      <TopmostHeaderRow
        lang={lang}
        isShopMode={isShopMode}
        onGoHome={handleGoHome}
        onCloseSection={handleCloseSection}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. "כשר למהדרין" — COMPLETE COMPONENT DIRECTLY BETWEEN TOPMOST & TOOLBAR */}
      <KashrutSection
        lang={lang}
        isOpen={isKashrutOpen}
        onToggle={() => setIsKashrutOpen((prev) => !prev)}
        onClose={() => setIsKashrutOpen(false)}
      />

      {/* 3. TOOLBAR / סרגל הכלים (5 Tabs and Expandable Panels) */}
      <HeaderToolbar
        lang={lang}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onCloseSection={handleCloseSection}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
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

          {/* Complete YEHUDALES Shop Experience */}
          <ShopSection
            lang={lang}
            isShopMode={isShopMode}
            onShopModeChange={setIsShopMode}
          />

          {/* Legal and Brand Footer */}
          <Footer
            lang={lang}
            onOpenAccessibility={() => setIsAccessibilityOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        </div>
      </main>

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
