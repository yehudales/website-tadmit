import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, ShieldCheck } from 'lucide-react';
import { GALLERY_ITEMS, BUSINESS_CONFIG } from '../config/businessConfig';
import { Language, GalleryItem } from '../types';

interface GallerySectionProps {
  lang: Language;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ lang }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  if (!GALLERY_ITEMS || GALLERY_ITEMS.length === 0) {
    return null;
  }

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  const nextImage = () => {
    const nextIdx = (currentIndex + 1) % GALLERY_ITEMS.length;
    setCurrentIndex(nextIdx);
    setSelectedItem(GALLERY_ITEMS[nextIdx]);
  };

  const prevImage = () => {
    const prevIdx = (currentIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    setCurrentIndex(prevIdx);
    setSelectedItem(GALLERY_ITEMS[prevIdx]);
  };

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') {
          lang === 'he' ? prevImage() : nextImage();
        }
        if (e.key === 'ArrowLeft') {
          lang === 'he' ? nextImage() : prevImage();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedItem, currentIndex, lang]);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="py-14 sm:py-20 md:py-28 bg-[#0B0C0E] border-t border-b border-[#252A32]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E0BE55] mb-2 inline-block px-3 py-1 rounded-lg bg-[#1A1D22] border border-[#252A32]">
            {lang === 'he' ? 'גלריית תמונות' : 'Visual Gallery'}
          </span>
          <h2
            id="gallery-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FAF9F6] tracking-tight"
          >
            <span className="gold-gradient-text">
              {lang === 'he' ? 'חוויה לעיניים ולחיך' : 'Flavors & Atmosphere'}
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed">
            {lang === 'he'
              ? 'הצצה לתבשילי הצ\'ולנט המהבילים, הבשרים המובחרים והאריזות המוקפדות של יהודלס'
              : 'A glimpse into slow-simmered cholent pots, prime meats, and meticulous packaging'}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item, index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(item, index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${item.title[lang]} - ${lang === 'he' ? 'הגדל תמונה' : 'Enlarge image'}`}
              className="group relative rounded-2xl overflow-hidden bg-[#1A1D22] border border-[#252A32] hover:border-[#94A3B8]/40 transition-all duration-300 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55]"
            >
              {/* Image / Graphic Display Container */}
              <div className="relative aspect-[4/3] bg-[#0B0C0E] overflow-hidden flex items-center justify-center p-4 sm:p-6 text-center">
                <div className="relative z-10 flex flex-col items-center gap-2.5 sm:gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#1A1D22] border border-[#252A32] text-[#FAF9F6] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-[#E0BE55]" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-[#FAF9F6] group-hover:text-[#E0BE55] transition-colors">
                    {item.title[lang]}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#94A3B8] max-w-xs line-clamp-2">
                    {item.caption[lang]}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#0B0C0E]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#E0BE55] text-[#0B0C0E] font-bold text-xs shadow-xl">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{lang === 'he' ? 'צפייה בתמונה' : 'View Full Image'}</span>
                  </span>
                </div>
              </div>

              {/* Bottom label */}
              <div className="p-3 sm:p-4 bg-[#1A1D22] border-t border-[#252A32] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#FAF9F6] truncate">
                  {item.title[lang]}
                </span>
                <span className="text-[#94A3B8] font-medium shrink-0 text-[11px]">
                  {BUSINESS_CONFIG.name[lang]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title[lang]}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 transition-opacity"
          onClick={closeLightbox}
        >
          {/* Top Bar Controls */}
          <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-8 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <span className="text-xs sm:text-sm font-semibold text-[#FAF9F6]">
                {currentIndex + 1} / {GALLERY_ITEMS.length}
              </span>
              <span className="hidden sm:inline-block text-xs text-[#94A3B8]">
                • {selectedItem.title[lang]}
              </span>
            </div>

            <button
              ref={closeButtonRef}
              onClick={closeLightbox}
              aria-label={lang === 'he' ? 'סגור תמונה' : 'Close image view'}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#1A1D22] text-[#FAF9F6] hover:bg-[#22262D] border border-[#252A32] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Arrows (min 44x44px touch targets) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label={lang === 'he' ? 'תמונה קודמת' : 'Previous image'}
            className="min-h-[44px] min-w-[44px] absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-xl bg-[#1A1D22] hover:bg-[#22262D] text-[#FAF9F6] border border-[#252A32] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label={lang === 'he' ? 'תמונה הבאה' : 'Next image'}
            className="min-h-[44px] min-w-[44px] absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-xl bg-[#1A1D22] hover:bg-[#22262D] text-[#FAF9F6] border border-[#252A32] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Lightbox Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-[#1A1D22] border border-[#252A32] p-4 sm:p-6 md:p-8 flex flex-col items-center shadow-2xl mx-auto"
          >
            <div className="w-full aspect-[4/3] sm:aspect-[16/10] rounded-xl bg-[#0B0C0E] border border-[#252A32] flex flex-col items-center justify-center p-4 sm:p-8 text-center relative overflow-hidden">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-[#1A1D22] border border-[#252A32] text-[#E0BE55] flex items-center justify-center mb-3 sm:mb-4">
                <Camera className="w-7 h-7 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FAF9F6] mb-1.5 sm:mb-2">
                {selectedItem.title[lang]}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-[#94A3B8] max-w-md">
                {selectedItem.caption[lang]}
              </p>
              <div className="mt-4 sm:mt-6 flex items-center gap-2 text-[11px] sm:text-xs text-emerald-400 font-semibold bg-[#1A1D22] px-3.5 py-1.5 rounded-xl border border-[#252A32]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{BUSINESS_CONFIG.kashrut.fullBadge[lang]}</span>
              </div>
            </div>

            <div className="w-full mt-3 sm:mt-4 flex items-center justify-between text-[11px] sm:text-xs text-[#94A3B8]">
              <span>{BUSINESS_CONFIG.location.address[lang]}</span>
              <span className="hidden sm:inline-block text-[#94A3B8]/60">
                {lang === 'he' ? 'ניווט במקלדת: חצים ימינה/שמאלה, ESC לסגירה' : 'Keyboard: Left/Right arrows, ESC to close'}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
