import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LiveStoreStatusSection } from './components/LiveStoreStatusSection';
import { AboutSection } from './components/AboutSection';
import { UpdatesSection } from './components/UpdatesSection';
import { BusinessOrdersSection } from './components/BusinessOrdersSection';
import { StrengthsSection } from './components/StrengthsSection';
import { KashrutSection } from './components/KashrutSection';
import { MenuSection } from './components/MenuSection';
import { GallerySection } from './components/GallerySection';
import { VideoSection } from './components/VideoSection';
import { LocationSection } from './components/LocationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { WhatsAppModal } from './components/WhatsAppModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { PrivacyModal } from './components/PrivacyModal';
import { BUSINESS_CONFIG } from './config/businessConfig';

export default function App() {
  const [lang, setLang] = useState<Language>('he');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Synchronize document direction and lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.title = lang === 'he'
      ? `${BUSINESS_CONFIG.name.he} — ${BUSINESS_CONFIG.tagline.he} | ${BUSINESS_CONFIG.location.city.he}`
      : `${BUSINESS_CONFIG.name.en} — ${BUSINESS_CONFIG.tagline.en} | ${BUSINESS_CONFIG.location.city.en}`;
  }, [lang]);

  return (
    <div
      dir={lang === 'he' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#0B0C0E] text-[#FAF9F6] font-sans antialiased selection:bg-[#E0BE55] selection:text-[#0B0C0E]"
    >
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#E0BE55] focus:text-[#0B0C0E] focus:font-bold focus:rounded-lg focus:outline-none focus:ring-4 focus:ring-[#E0BE55]/50"
      >
        {lang === 'he' ? 'דלג לתוכן המרכזי' : 'Skip to main content'}
      </a>

      {/* Sticky Top Navigation Bar */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* Main Content Landmark */}
      <main id="main-content">
        {/* Full Screen Cinematic Hero Video (Video & minimal controls only) */}
        <Hero lang={lang} />

        {/* Live Store Status & Modern Large Countdown Timer (First section below video) */}
        <LiveStoreStatusSection
          lang={lang}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        />

        {/* Section 1: אודות (About) */}
        <AboutSection lang={lang} />

        {/* Section 2: עדכונים (Live Updates & Announcements) */}
        <UpdatesSection lang={lang} />

        {/* Section 3: הזמנות עסקיות (Business & Corporate Orders) */}
        <BusinessOrdersSection
          lang={lang}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        />

        {/* Core Brand Pillars / Strengths */}
        <StrengthsSection lang={lang} />

        {/* Kashrut Supervision */}
        <KashrutSection lang={lang} />

        {/* Featured Shabbat Menu */}
        <MenuSection
          lang={lang}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        />

        {/* Visual Gallery */}
        <GallerySection lang={lang} />

        {/* Cinematic Video Spotlight */}
        <VideoSection
          lang={lang}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        />

        {/* Section 4: סניף (Branch & Operating Hours) */}
        <LocationSection
          lang={lang}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        />

        {/* Section 5: יצירת קשר (Contact & Inquiries) */}
        <ContactSection
          lang={lang}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        />
      </main>

      {/* Section 6: קישורים (Footer & Useful Links) */}
      <Footer
        lang={lang}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* Mobile Sticky Action Bar */}
      <MobileStickyBar
        lang={lang}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

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
    </div>
  );
}
