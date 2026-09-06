import React from 'react';
import { MapPin, Clock, Phone, ExternalLink, AlertCircle, MessageCircle, Navigation } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppOrderUrl } from '../config/businessConfig';
import { Language } from '../types';

interface LocationSectionProps {
  lang: Language;
  onOpenWhatsApp: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  lang,
  onOpenWhatsApp,
}) => {
  const isMapsPlaceholder = BUSINESS_CONFIG.location.googleMapsUrl === '[GOOGLE_MAPS_URL]';
  const fallbackMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('אדמור מבעלזא 7 אשדוד')}`;
  const mapsTargetUrl = isMapsPlaceholder ? fallbackMapsUrl : BUSINESS_CONFIG.location.googleMapsUrl;
  const whatsappUrl = getWhatsAppOrderUrl();

  return (
    <section
      id="location"
      aria-labelledby="location-heading"
      className="py-14 sm:py-20 md:py-28 bg-[#0B0C0E] border-t border-b border-[#252A32] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E0BE55] mb-2 inline-block px-3 py-1 rounded-lg bg-[#1A1D22] border border-[#252A32]">
            {lang === 'he' ? 'סניף ושעות פעילות' : 'Branch & Hours'}
          </span>
          <h2
            id="location-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FAF9F6] tracking-tight"
          >
            <span className="gold-gradient-text">
              {lang === 'he' ? 'סניף יהודלס אשדוד' : 'Yehudales Ashdod Branch'}
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed">
            {lang === 'he'
              ? 'טייק אווי והזמנות WhatsApp ישירות • ללא מקומות ישיבה • איסוף עצמי בתיאום'
              : 'Takeaway & direct WhatsApp orders • No dine-in seating • Coordinated pickup'}
          </p>
        </div>

        {/* 2-Column Info & Map Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Details Column */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 bg-[#1A1D22] border border-[#252A32] rounded-2xl p-5 sm:p-7 md:p-8 shadow-xl">
            <div className="space-y-5 sm:space-y-6">
              {/* Address card */}
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-[#E0BE55] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#E0BE55]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#FAF9F6]">
                    {lang === 'he' ? 'כתובת הסניף' : 'Branch Address'}
                  </h3>
                  <p className="text-sm sm:text-base text-[#FAF9F6] mt-1 font-semibold">
                    {BUSINESS_CONFIG.location.address[lang]}
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {lang === 'he' ? 'רובע ג\', אשדוד' : 'Rova Gimmel, Ashdod'}
                  </p>
                </div>
              </div>

              {/* Operating Hours card */}
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-[#E0BE55] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#E0BE55]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#FAF9F6]">
                    {lang === 'he' ? 'שעות פעילות' : 'Operating Hours'}
                  </h3>
                  <p className="text-sm sm:text-base text-[#E0BE55] mt-1 font-bold">
                    {BUSINESS_CONFIG.hours.summary[lang]}
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    {BUSINESS_CONFIG.hours.note[lang]}
                  </p>
                </div>
              </div>

              {/* Phone card */}
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-[#E0BE55] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#E0BE55]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#FAF9F6]">
                    {lang === 'he' ? 'טלפון ישיר' : 'Direct Phone'}
                  </h3>
                  <a
                    href={`tel:${BUSINESS_CONFIG.contact.phone}`}
                    className="inline-flex items-center min-h-[44px] text-base text-[#FAF9F6] hover:text-[#E0BE55] font-bold mt-0.5 transition-colors underline"
                  >
                    {BUSINESS_CONFIG.contact.phoneFormatted}
                  </a>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {lang === 'he' ? 'מענה בשעות הפעילות ולתיאומים' : 'Available during hours and for pickups'}
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Model Note */}
            <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-[#94A3B8] text-xs sm:text-sm flex items-start gap-3 mt-4">
              <AlertCircle className="w-5 h-5 text-[#E0BE55] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#FAF9F6]">
                  {lang === 'he' ? 'מודל טייק אווי ואיסוף עצמי' : 'Takeaway & Pickup Model'}
                </span>
                <span className="text-[#94A3B8] mt-0.5 block leading-relaxed text-xs">
                  {BUSINESS_CONFIG.location.takeawayNote[lang]}
                </span>
              </div>
            </div>
          </div>

          {/* Map / Directions & Quick Action Column */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#1A1D22] border border-[#252A32] rounded-2xl p-5 sm:p-7 md:p-8 shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                  {lang === 'he' ? 'ניווט והגעה' : 'Navigation & Maps'}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#0B0C0E] text-[#FAF9F6] border border-[#252A32]">
                  {BUSINESS_CONFIG.location.city[lang]}
                </span>
              </div>

              <div className="aspect-[16/9] w-full rounded-xl bg-[#0B0C0E] border border-[#252A32] relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#1A1D22] border border-[#252A32] text-[#E0BE55] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-[#E0BE55]" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#FAF9F6] mb-1">
                  {BUSINESS_CONFIG.location.address[lang]}
                </h4>
                <p className="text-xs text-[#94A3B8] max-w-sm mb-4">
                  {lang === 'he'
                    ? 'לחצו לפתיחת מפות Google לצפייה במיקום או לניווט לאיסוף עצמי'
                    : 'Click to open Google Maps for directions or location view'}
                </p>

                <a
                  href={mapsTargetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[44px] gap-2 px-5 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-neutral-200 text-[#0B0C0E] font-bold text-xs shadow transition-all active:scale-95"
                >
                  <span>{lang === 'he' ? 'פתיחה ב-Google Maps' : 'Open in Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Direct WhatsApp Action in Location Box */}
            <div className="mt-6 pt-5 sm:pt-6 border-t border-[#252A32] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-start">
                <span className="text-sm font-bold text-[#FAF9F6] block">
                  {lang === 'he' ? 'מתכננים להגיע לאסוף?' : 'Planning to pick up?'}
                </span>
                <span className="text-xs text-[#94A3B8]">
                  {lang === 'he' ? 'מומלץ לתאם מראש בוואטסאפ לחיסכון בזמן' : 'Pre-order on WhatsApp for seamless pickup'}
                </span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0C0E] font-bold text-xs shadow transition-all active:scale-95 shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-[#0B0C0E]" />
                <span>{BUSINESS_CONFIG.whatsapp.ctaText[lang]}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
