import React from 'react';
import { Briefcase, Utensils, Users, Sparkles, MessageCircle, Check, Phone } from 'lucide-react';
import { Language } from '../types';
import { BUSINESS_CONFIG, getWhatsAppOrderUrl } from '../config/businessConfig';

interface BusinessOrdersSectionProps {
  lang: Language;
  onOpenWhatsApp: () => void;
}

export const BusinessOrdersSection: React.FC<BusinessOrdersSectionProps> = ({
  lang,
  onOpenWhatsApp,
}) => {
  const businessPoints = [
    {
      title: {
        he: 'שבתות חתן ואירועים משפחתיים',
        en: 'Shabbat Chatan & Celebrations'
      },
      desc: {
        he: 'סירי צ\'ולנט ענקיים, מבחר בשרים מובחרים, קוגלים, חלות ומטבלים בכמויות מותאמות אישית.',
        en: 'Generous pots of signature cholent, premium meats, kugels, and dips customized for your guests.'
      }
    },
    {
      title: {
        he: 'אירועים עסקיים והרמות כוסית',
        en: 'Corporate Feasts & Gatherings'
      },
      desc: {
        he: 'חוויית אוכל חם וטרי במשרד או באירוע חברה, עם אריזות תרמיות מוקפדות והגשה נוחה.',
        en: 'Hot, fresh food experience for your office or company event, packed in insulated containers.'
      }
    },
    {
      title: {
        he: 'קידושים ואירועי קהילה',
        en: 'Synagogue Kiddushim & Community'
      },
      desc: {
        he: 'כשרות מהודרת ללא פשרות (נווה ציון ובד״ץ העדה החרדית) המאפשרת לכל האורחים ליהנות בביטחון מלא.',
        en: 'Strict Kosher certification (Neve Zion & Badatz Edah HaChareidis) ensuring every guest dines with peace of mind.'
      }
    }
  ];

  const cateringWhatsAppUrl = getWhatsAppOrderUrl(BUSINESS_CONFIG.whatsapp.options.catering.message);

  return (
    <section
      id="business-orders"
      aria-labelledby="business-orders-heading"
      className="py-14 sm:py-20 md:py-28 bg-[#0B0C0E] border-b border-[#252A32] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E0BE55] mb-2 inline-block px-3 py-1 rounded-lg bg-[#1A1D22] border border-[#252A32]">
            {lang === 'he' ? 'אירועים וקייטרינג מיוחד' : 'Events & Catering'}
          </span>
          <h2
            id="business-orders-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FAF9F6] tracking-tight"
          >
            <span className="gold-gradient-text">
              {lang === 'he' ? 'הזמנות עסקיות ואירועים לשבת' : 'Business & Event Shabbat Orders'}
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed">
            {lang === 'he'
              ? 'תבשילי שבת מובחרים בכמויות גדולות, שירות מותאם אישית וכשרות מהודרת לאירוע בלתי נשכח'
              : 'Premium Shabbat cuisine for large groups, customized catering and strict kosher standards'}
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              {businessPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-[#1A1D22] border border-[#252A32] flex items-start gap-4"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-[#E0BE55] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-5 h-5 text-[#E0BE55]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#FAF9F6] mb-1">
                      {pt.title[lang]}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                      {pt.desc[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card / CTA */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#1A1D22] border border-[#E0BE55]/30 shadow-2xl space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0B0C0E] border border-[#252A32] text-[#E0BE55] flex items-center justify-center mx-auto">
                <Briefcase className="w-7 h-7 text-[#E0BE55]" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#FAF9F6] mb-2">
                  {lang === 'he' ? 'תיאום הזמנה עסקית / קייטרינג' : 'Coordinate Corporate / Event Order'}
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {lang === 'he'
                    ? 'ספרו לנו על האירוע שלכם, מספר האורחים והתאריך הרצוי, וצוות יהודלס יבנה עבורכם תפריט מושלם.'
                    : 'Tell us about your event, headcount, and preferred date, and we will tailor the perfect Shabbat menu.'}
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <a
                  href={cateringWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0C0E] font-black text-sm shadow-xl transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 text-[#0B0C0E]" />
                  <span>{lang === 'he' ? 'הזמנה עסקית דרך WhatsApp' : 'Order via WhatsApp'}</span>
                </a>

                <a
                  href={`tel:${BUSINESS_CONFIG.contact.phone}`}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0B0C0E] hover:bg-[#22262D] text-[#FAF9F6] border border-[#252A32] text-xs font-bold transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 text-[#E0BE55]" />
                  <span>{BUSINESS_CONFIG.contact.phoneFormatted}</span>
                </a>
              </div>

              <div className="pt-3 border-t border-[#252A32] text-[11px] text-[#94A3B8]">
                <span>{lang === 'he' ? 'מומלץ לתאם אירועים לפחות 48 שעות מראש' : 'Recommended booking at least 48h in advance'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
