import React from 'react';
import { MessageCircle, Phone, Instagram, Facebook, HelpCircle, UtensilsCrossed, Calendar } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppOrderUrl } from '../config/businessConfig';
import { Language } from '../types';

interface ContactSectionProps {
  lang: Language;
  onOpenWhatsApp: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  onOpenWhatsApp,
}) => {
  const whatsappUrl = getWhatsAppOrderUrl();
  const cateringWhatsAppUrl = getWhatsAppOrderUrl(BUSINESS_CONFIG.whatsapp.options.catering.message);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-14 sm:py-20 md:py-28 bg-[#0B0C0E] border-b border-[#252A32] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E0BE55] mb-2 inline-block px-3 py-1 rounded-lg bg-[#1A1D22] border border-[#252A32]">
            {lang === 'he' ? 'יצירת קשר והזמנות' : 'Orders & Inquiries'}
          </span>
          <h2
            id="contact-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FAF9F6] tracking-tight"
          >
            <span className="gold-gradient-text">
              {lang === 'he' ? 'איך תרצו לפנות אלינו היום?' : 'How Would You Like to Connect?'}
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed">
            {lang === 'he'
              ? 'הזמנה ישירה בוואטסאפ לליל שישי, תיאום אירועים או שיחה ישירה עם צוות יהודלס'
              : 'Direct WhatsApp order for Thursday night, event catering or direct phone call'}
          </p>
        </div>

        {/* 3 Tier Hierarchy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 items-stretch mb-8 sm:mb-12">
          {/* Card 1: Primary - WhatsApp Ordering */}
          <div className="relative rounded-2xl bg-[#1A1D22] border-2 border-emerald-500/50 hover:border-emerald-400 p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all">
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-lg bg-emerald-500 text-[#0B0C0E] text-xs font-black uppercase tracking-wider shadow">
              {lang === 'he' ? 'ערוץ הזמנה ראשי' : 'Primary Channel'}
            </span>

            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0B0C0E] text-emerald-400 border border-[#252A32] flex items-center justify-center mb-5 sm:mb-6">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FAF9F6] mb-2">
                {lang === 'he' ? 'הזמנה ב-WhatsApp' : 'Order via WhatsApp'}
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6 font-normal">
                {lang === 'he'
                  ? 'הדרך המהירה והישירה ביותר לשריין צ\'ולנט חם, בשרים מובחרים ומטעמי שבת לאיסוף עצמי באשדוד.'
                  : 'The fastest way to reserve hot cholent, prime beef and Shabbat delicacies for pickup.'}
              </p>
            </div>

            <div className="space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0C0E] font-black text-sm shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-[#0B0C0E]" />
                <span>{BUSINESS_CONFIG.whatsapp.ctaText[lang]}</span>
              </a>
              <span className="block text-center text-[11px] text-[#94A3B8]">
                {lang === 'he' ? 'זמין לשאלות והזמנות מהירות' : 'Available for rapid orders & questions'}
              </span>
            </div>
          </div>

          {/* Card 2: Secondary - Catering & Business */}
          <div className="rounded-2xl bg-[#1A1D22] border border-[#252A32] hover:border-[#E0BE55]/40 p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0B0C0E] text-[#E0BE55] border border-[#252A32] flex items-center justify-center mb-5 sm:mb-6">
                <UtensilsCrossed className="w-6 h-6 text-[#E0BE55]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FAF9F6] mb-2">
                {lang === 'he' ? 'אירועים וקייטרינג' : 'Events & Catering'}
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6 font-normal">
                {lang === 'he'
                  ? 'לשבתות חתן, אירועים מיוחדים, קידושים והזמנות עסקיות בכמויות מותאמות אישית.'
                  : 'For Shabbat Chatan, corporate gatherings, kiddushim and tailored catering portions.'}
              </p>
            </div>

            <div>
              <a
                href={cateringWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B0C0E] hover:bg-[#22262D] text-[#FAF9F6] border border-[#252A32] font-semibold text-xs sm:text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] active:scale-95"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#E0BE55]" />
                <span>{lang === 'he' ? 'פנייה בנושא קייטרינג' : 'Inquire for Catering'}</span>
              </a>
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#94A3B8] mt-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#E0BE55]" />
                  {lang === 'he' ? 'תיאום מראש 48 שעות' : '48h advance booking'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Direct Phone Call */}
          <div className="rounded-2xl bg-[#1A1D22] border border-[#252A32] hover:border-[#FAF9F6]/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0B0C0E] text-[#FAF9F6] border border-[#252A32] flex items-center justify-center mb-5 sm:mb-6">
                <Phone className="w-6 h-6 text-[#E0BE55]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FAF9F6] mb-2">
                {lang === 'he' ? 'חיוג טלפוני ישיר' : 'Direct Phone Call'}
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6 font-normal">
                {lang === 'he'
                  ? 'צוות יהודלס זמין עבורכם בשעות הפעילות למענה אנושי, תיאום איסוף ובירורים.'
                  : 'Yehudales staff is available during operating hours for direct phone assistance.'}
              </p>
            </div>

            <div>
              <a
                href={`tel:${BUSINESS_CONFIG.contact.phone}`}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B0C0E] hover:bg-[#22262D] text-[#FAF9F6] border border-[#252A32] font-semibold text-xs sm:text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] active:scale-95"
              >
                <Phone className="w-4 h-4 text-[#E0BE55]" />
                <span>{BUSINESS_CONFIG.contact.phoneFormatted}</span>
              </a>
              <span className="block text-center text-[11px] text-[#94A3B8] mt-3">
                {BUSINESS_CONFIG.hours.rawSchedule}
              </span>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-5 sm:pt-6 border-t border-[#252A32] text-xs sm:text-sm text-[#94A3B8]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            {lang === 'he' ? 'עקבו אחרינו ברשתות:' : 'Follow Us:'}
          </span>
          <a
            href={BUSINESS_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#FAF9F6] transition-colors min-h-[44px] px-2"
          >
            <Instagram className="w-4 h-4 text-[#E0BE55]" />
            <span>Instagram</span>
          </a>
          <a
            href={BUSINESS_CONFIG.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#FAF9F6] transition-colors min-h-[44px] px-2"
          >
            <Facebook className="w-4 h-4 text-[#E0BE55]" />
            <span>Facebook</span>
          </a>
        </div>
      </div>
    </section>
  );
};
