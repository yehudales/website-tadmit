import React from 'react';
import { Bell, Calendar, Sparkles, MessageCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { BUSINESS_CONFIG, getWhatsAppOrderUrl } from '../config/businessConfig';

interface UpdatesSectionProps {
  lang: Language;
  onOpenWhatsApp: () => void;
}

export const UpdatesSection: React.FC<UpdatesSectionProps> = ({ lang, onOpenWhatsApp }) => {
  const updates = [
    {
      id: 'update-1',
      date: {
        he: 'יום חמישי הקרוב • מ-17:00',
        en: 'This Thursday • From 17:00'
      },
      badge: {
        he: 'טרי מהסיר',
        en: 'Fresh & Hot'
      },
      title: {
        he: 'הסירים מבעבעים: צ\'ולנט בקר עשיר, קישקע וקוגלים ירושלמיים',
        en: 'Pots Simmering: Prime Beef Cholent, Kishke & Yerushalmi Kugels'
      },
      description: {
        he: 'הצטרפו לחוויית ליל שישי המסורתית של יהודלס. מומלץ להזמין מראש בוואטסאפ להבטחת המנות האהובות עליכם.',
        en: 'Join the authentic Yehudales Thursday night feast. Pre-ordering via WhatsApp is recommended to secure your favorite dishes.'
      },
      tag: {
        he: 'הזמנות פתוחות',
        en: 'Orders Open'
      }
    },
    {
      id: 'update-2',
      date: {
        he: 'עדכון קבוע',
        en: 'Notice'
      },
      badge: {
        he: 'כשרות מהודרת',
        en: 'Strict Kosher'
      },
      title: {
        he: 'בשר חלק מהדרין: בקר נווה ציון ומוצרי בד״ץ העדה החרדית',
        en: 'Mehadrin Glatt Meat: Neve Zion Beef & Badatz Edah HaChareidis'
      },
      description: {
        he: 'בכל שבוע אנו מקפידים על חומרי הגלם המובחרים והאיכותיים ביותר לשמירה על שקט נפשי וביטחון מושלם.',
        en: 'Every week we select only the finest certified kosher ingredients for absolute quality and customer peace of mind.'
      },
      tag: {
        he: 'ללא פשרות',
        en: 'Uncompromised'
      }
    },
    {
      id: 'update-3',
      date: {
        he: 'הזמנות מראש',
        en: 'Advance Inquiries'
      },
      badge: {
        he: 'אריזות חמות',
        en: 'Thermal Care'
      },
      title: {
        he: 'איסוף עצמי מסודר וחם באדמו"ר מבעלזא 7, אשדוד',
        en: 'Organized Warm Pickup at Admor MiBelz 7, Ashdod'
      },
      description: {
        he: 'כל המנות נארזות באריזות תרמיות מוקפדות השומרות על חום וטריות מקסימלית עד השולחן שלכם.',
        en: 'All orders are packed in premium thermal containers preserving optimal heat and freshness to your home.'
      },
      tag: {
        he: 'טייק אווי מהיר',
        en: 'Fast Pickup'
      }
    }
  ];

  return (
    <section
      id="updates"
      aria-labelledby="updates-heading"
      className="py-14 sm:py-20 md:py-28 bg-[#0B0C0E] border-t border-b border-[#252A32] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E0BE55] mb-2 inline-block px-3 py-1 rounded-lg bg-[#1A1D22] border border-[#252A32]">
            {lang === 'he' ? 'עדכונים ולוח פעילות' : 'Updates & Announcements'}
          </span>
          <h2
            id="updates-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FAF9F6] tracking-tight"
          >
            <span className="gold-gradient-text">
              {lang === 'he' ? 'מה חדש בסירים של יהודלס' : 'Latest From Yehudales Kitchen'}
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed">
            {lang === 'he'
              ? 'הודעות שבועיות, זמני בישול, מנות מיוחדות ומידע עדכני להזמנות ליל שישי'
              : 'Weekly updates, cooking schedules, special dishes, and Shabbat ordering news'}
          </p>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 mb-10">
          {updates.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#1A1D22] border border-[#252A32] hover:border-[#E0BE55]/40 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B0C0E] border border-[#252A32] text-xs font-bold text-[#E0BE55]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{item.badge[lang]}</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#94A3B8]">
                    {item.date[lang]}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#FAF9F6] mb-3 group-hover:text-[#E0BE55] transition-colors leading-snug">
                  {item.title[lang]}
                </h3>

                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6 font-normal">
                  {item.description[lang]}
                </p>
              </div>

              <div className="pt-4 border-t border-[#252A32] flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#FAF9F6] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{item.tag[lang]}</span>
                </span>
                <button
                  onClick={onOpenWhatsApp}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E0BE55] hover:text-[#FAF9F6] transition-colors min-h-[44px] px-2"
                >
                  <span>{lang === 'he' ? 'לפרטים' : 'Details'}</span>
                  <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'en' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
