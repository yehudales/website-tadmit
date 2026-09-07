import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  X,
  Languages,
  Check,
  Type,
  Sun,
  Palette,
  Link2,
  Eye,
  Sparkles,
  RotateCcw,
  FileText,
  Accessibility,
} from 'lucide-react';
import { Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onOpenAccessibilityStatement: () => void;
}

interface AccessibilitySettings {
  fontSize: number; // 0 = 100%, 1 = 115%, 2 = 130%
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  reducedMotion: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 0,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  readableFont: false,
  reducedMotion: false,
};

const STORAGE_KEY = 'yehudales_a11y_settings';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageChange,
  onOpenAccessibilityStatement,
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Apply accessibility settings to documentElement
  useEffect(() => {
    const root = document.documentElement;

    // Font size scaling
    if (settings.fontSize === 1) {
      root.style.fontSize = '112.5%';
    } else if (settings.fontSize === 2) {
      root.style.fontSize = '125%';
    } else {
      root.style.fontSize = '';
    }

    // High Contrast
    if (settings.highContrast) {
      root.classList.add('a11y-high-contrast');
    } else {
      root.classList.remove('a11y-high-contrast');
    }

    // Grayscale
    if (settings.grayscale) {
      root.classList.add('a11y-grayscale');
    } else {
      root.classList.remove('a11y-grayscale');
    }

    // Highlight Links
    if (settings.highlightLinks) {
      root.classList.add('a11y-highlight-links');
    } else {
      root.classList.remove('a11y-highlight-links');
    }

    // Readable Font
    if (settings.readableFont) {
      root.classList.add('a11y-readable-font');
    } else {
      root.classList.remove('a11y-readable-font');
    }

    // Reduced Motion
    if (settings.reducedMotion) {
      root.classList.add('a11y-reduced-motion');
    } else {
      root.classList.remove('a11y-reduced-motion');
    }

    // Save in sessionStorage
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Handle modal keyboard accessibility & body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  const toggleFontSize = () => {
    setSettings((prev) => ({
      ...prev,
      fontSize: (prev.fontSize + 1) % 3,
    }));
  };

  const toggleSetting = (key: keyof Omit<AccessibilitySettings, 'fontSize'>) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetAll = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md my-8 rounded-2xl bg-[#1A1D22] border border-[#252A32] p-5 sm:p-6 shadow-2xl text-[#FAF9F6] max-h-[90vh] overflow-y-auto animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#252A32]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B0C0E] text-[#FF7B1C] border border-[#252A32] flex items-center justify-center">
              <Settings className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="settings-dialog-title" className="text-lg font-bold text-[#FAF9F6]">
                {lang === 'he' ? 'הגדרות' : 'Settings'}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                {lang === 'he' ? 'שפה והתאמות נגישות' : 'Language & Accessibility options'}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={lang === 'he' ? 'סגור תפריט הגדרות' : 'Close settings menu'}
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-[#94A3B8] hover:text-[#FAF9F6] hover:bg-[#0B0C0E] transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Section A: שפה (Language) */}
          <section aria-labelledby="settings-language-title">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />
              <h3 id="settings-language-title" className="text-sm font-bold text-[#FAF9F6]">
                {lang === 'he' ? 'שפה' : 'Language'}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onLanguageChange('he')}
                aria-pressed={lang === 'he'}
                className={`min-h-[48px] px-4 py-2.5 rounded-xl border flex items-center justify-between transition-all font-semibold text-sm ${
                  lang === 'he'
                    ? 'bg-[#0B0C0E] border-[#FF7B1C] text-[#FF7B1C] shadow-sm'
                    : 'bg-[#121417] border-[#252A32] text-[#FAF9F6] hover:bg-[#1A1D22]'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]`}
              >
                <span>עברית</span>
                {lang === 'he' && <Check className="w-4 h-4 text-[#FF7B1C]" />}
              </button>

              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                aria-pressed={lang === 'en'}
                className={`min-h-[48px] px-4 py-2.5 rounded-xl border flex items-center justify-between transition-all font-semibold text-sm ${
                  lang === 'en'
                    ? 'bg-[#0B0C0E] border-[#FF7B1C] text-[#FF7B1C] shadow-sm'
                    : 'bg-[#121417] border-[#252A32] text-[#FAF9F6] hover:bg-[#1A1D22]'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]`}
              >
                <span>English</span>
                {lang === 'en' && <Check className="w-4 h-4 text-[#FF7B1C]" />}
              </button>
            </div>
          </section>

          {/* Section B: נגישות (Accessibility) */}
          <section aria-labelledby="settings-a11y-title" className="pt-2 border-t border-[#252A32]">
            <div className="flex items-center justify-between mb-3 pt-2">
              <div className="flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />
                <h3 id="settings-a11y-title" className="text-sm font-bold text-[#FAF9F6]">
                  {lang === 'he' ? 'נגישות' : 'Accessibility'}
                </h3>
              </div>
              <button
                type="button"
                onClick={resetAll}
                className="min-h-[36px] inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[#94A3B8] hover:text-[#FAF9F6] hover:bg-[#0B0C0E] border border-transparent hover:border-[#252A32] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'he' ? 'איפוס' : 'Reset'}</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {/* Text Size */}
              <button
                type="button"
                onClick={toggleFontSize}
                aria-pressed={settings.fontSize > 0}
                className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl flex items-center justify-between transition-colors border ${
                  settings.fontSize > 0
                    ? 'bg-[#0B0C0E] border-[#FF7B1C] text-[#FF7B1C] font-bold'
                    : 'bg-[#121417] border-[#252A32] text-[#FAF9F6] hover:bg-[#1A1D22]'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]`}
              >
                <span className="flex items-center gap-2.5">
                  <Type className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />
                  <span className="text-xs sm:text-sm">{lang === 'he' ? 'גודל טקסט' : 'Text Size'}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1A1D22] border border-[#252A32]">
                  {settings.fontSize === 0
                    ? (lang === 'he' ? 'רגיל' : 'Normal')
                    : settings.fontSize === 1
                    ? '+15%'
                    : '+30%'}
                </span>
              </button>

              {/* High Contrast */}
              <button
                type="button"
                onClick={() => toggleSetting('highContrast')}
                aria-pressed={settings.highContrast}
                className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl flex items-center justify-between transition-colors border ${
                  settings.highContrast
                    ? 'bg-[#0B0C0E] border-[#FF7B1C] text-[#FF7B1C] font-bold'
                    : 'bg-[#121417] border-[#252A32] text-[#FAF9F6] hover:bg-[#1A1D22]'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]`}
              >
                <span className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />
                  <span className="text-xs sm:text-sm">{lang === 'he' ? 'ניגודיות מוגברת' : 'High Contrast'}</span>
                </span>
                <span className="text-xs text-[#94A3B8]">
                  {settings.highContrast ? (lang === 'he' ? 'פעיל' : 'On') : (lang === 'he' ? 'כבוי' : 'Off')}
                </span>
              </button>

              {/* Monochrome / Grayscale */}
              <button
                type="button"
                onClick={() => toggleSetting('grayscale')}
                aria-pressed={settings.grayscale}
                className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl flex items-center justify-between transition-colors border ${
                  settings.grayscale
                    ? 'bg-[#0B0C0E] border-[#FF7B1C] text-[#FF7B1C] font-bold'
                    : 'bg-[#121417] border-[#252A32] text-[#FAF9F6] hover:bg-[#1A1D22]'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]`}
              >
                <span className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />
                  <span className="text-xs sm:text-sm">{lang === 'he' ? 'גווני אפור' : 'Monochrome'}</span>
                </span>
                <span className="text-xs text-[#94A3B8]">
                  {settings.grayscale ? (lang === 'he' ? 'פעיל' : 'On') : (lang === 'he' ? 'כבוי' : 'Off')}
                </span>
              </button>

              {/* Highlight Links */}
              <button
                type="button"
                onClick={() => toggleSetting('highlightLinks')}
                aria-pressed={settings.highlightLinks}
                className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl flex items-center justify-between transition-colors border ${
                  settings.highlightLinks
                    ? 'bg-[#0B0C0E] border-[#FF7B1C] text-[#FF7B1C] font-bold'
                    : 'bg-[#121417] border-[#252A32] text-[#FAF9F6] hover:bg-[#1A1D22]'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]`}
              >
                <span className="flex items-center gap-2.5">
                  <Link2 className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />
                  <span className="text-xs sm:text-sm">{lang === 'he' ? 'הדגשת קישורים' : 'Highlight Links'}</span>
                </span>
                <span className="text-xs text-[#94A3B8]">
                  {settings.highlightLinks ? (lang === 'he' ? 'פעיל' : 'On') : (lang === 'he' ? 'כבוי' : 'Off')}
                </span>
              </button>

              {/* Readable Font */}
              <button
                type="button"
                onClick={() => toggleSetting('readableFont')}
                aria-pressed={settings.readableFont}
                className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl flex items-center justify-between transition-colors border ${
                  settings.readableFont
                    ? 'bg-[#0B0C0E] border-[#FF7B1C] text-[#FF7B1C] font-bold'
                    : 'bg-[#121417] border-[#252A32] text-[#FAF9F6] hover:bg-[#1A1D22]'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]`}
              >
                <span className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />
                  <span className="text-xs sm:text-sm">{lang === 'he' ? 'גופן קריא' : 'Readable Font'}</span>
                </span>
                <span className="text-xs text-[#94A3B8]">
                  {settings.readableFont ? (lang === 'he' ? 'פעיל' : 'On') : (lang === 'he' ? 'כבוי' : 'Off')}
                </span>
              </button>

              {/* Reduced Motion */}
              <button
                type="button"
                onClick={() => toggleSetting('reducedMotion')}
                aria-pressed={settings.reducedMotion}
                className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl flex items-center justify-between transition-colors border ${
                  settings.reducedMotion
                    ? 'bg-[#0B0C0E] border-[#FF7B1C] text-[#FF7B1C] font-bold'
                    : 'bg-[#121417] border-[#252A32] text-[#FAF9F6] hover:bg-[#1A1D22]'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]`}
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />
                  <span className="text-xs sm:text-sm">{lang === 'he' ? 'הפחתת תנועה' : 'Stop Animations'}</span>
                </span>
                <span className="text-xs text-[#94A3B8]">
                  {settings.reducedMotion ? (lang === 'he' ? 'פעיל' : 'On') : (lang === 'he' ? 'כבוי' : 'Off')}
                </span>
              </button>
            </div>

            {/* Link to Accessibility Statement */}
            <div className="pt-3 mt-3 border-t border-[#252A32]">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAccessibilityStatement();
                }}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0B0C0E] hover:bg-[#22262D] text-[#FF7B1C] text-xs sm:text-sm font-semibold border border-[#252A32] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
              >
                <FileText className="w-4 h-4" />
                <span>{lang === 'he' ? 'הצהרת נגישות מלאה' : 'Accessibility Statement'}</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
