import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';

interface KashrutSectionProps {
  lang: Language;
}

export const KashrutSection: React.FC<KashrutSectionProps> = ({ lang }) => {
  return (
    <section
      id="kashrut"
      aria-labelledby="kashrut-heading"
      className="py-14 sm:py-20 bg-[#0B0C0E] border-t border-b border-[#252A32]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-[#1A1D22] border border-[#252A32] p-5 sm:p-8 md:p-12 shadow-2xl overflow-hidden text-center">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0B0C0E] border border-[#252A32] text-white flex items-center justify-center mb-4 sm:mb-6">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#E0BE55] mb-2 px-3 py-1 rounded-lg bg-[#0B0C0E] border border-[#252A32]">
              {lang === 'he' ? 'פיקוח וכשרות מהודרת' : 'Strict Kosher Supervision'}
            </span>

            <h2
              id="kashrut-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FAF9F6] tracking-tight mb-3 sm:mb-4"
            >
              {BUSINESS_CONFIG.kashrut.title[lang]}
            </h2>

            <p className="text-[#94A3B8] text-xs sm:text-base max-w-2xl mb-6 sm:mb-8 leading-relaxed font-normal">
              {lang === 'he'
                ? 'אנו ביהודלס מקפידים על סטנדרט כשרות למהדרין מן המהדרין, עם הפרדה ובהירות מלאה לשמירה על שקט נפשי וביטחון מושלם של לקוחותינו:'
                : 'At Yehudales, we uphold rigorous kosher standards with strict clarity and full transparency for our customers:'}
            </p>

            {/* Strict Dual Certification Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 w-full max-w-2xl">
              {/* Meat: Neve Zion */}
              <div className="p-4 sm:p-6 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-start flex items-center gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#1A1D22] border border-[#252A32] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#E0BE55]" />
                </div>
                <div>
                  <span className="text-[11px] sm:text-xs text-[#94A3B8] uppercase tracking-wider font-medium">
                    {lang === 'he' ? 'בשרים ועופות' : 'Meat & Poultry'}
                  </span>
                  <div className="text-base sm:text-xl font-bold text-[#FAF9F6]">
                    {lang === 'he' ? 'בשר: נווה ציון' : 'Meat: Neve Zion'}
                  </div>
                  <span className="text-[11px] sm:text-xs text-[#E0BE55] font-medium">
                    {lang === 'he' ? 'בשר חלק למהדרין' : 'Strict Mehadrin Standard'}
                  </span>
                </div>
              </div>

              {/* Other products: Badatz Edah HaChareidis */}
              <div className="p-4 sm:p-6 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-start flex items-center gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#1A1D22] border border-[#252A32] text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[11px] sm:text-xs text-[#94A3B8] uppercase tracking-wider font-medium">
                    {lang === 'he' ? 'שאר חומרי הגלם והמוצרים' : 'All Other Products'}
                  </span>
                  <div className="text-base sm:text-xl font-bold text-[#FAF9F6]">
                    {lang === 'he' ? 'בד״ץ העדה החרדית' : 'Badatz Edah HaChareidis'}
                  </div>
                  <span className="text-[11px] sm:text-xs text-emerald-400 font-medium">
                    {lang === 'he' ? 'השגחה קפדנית ומובחרת' : 'Prestigious Kosher Seal'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-[11px] sm:text-xs text-[#94A3B8] max-w-xl">
              {lang === 'he'
                ? 'לבירורים נוספים ושאלות הלכתיות הנוגעות לכשרות, ניתן לפנות אלינו ישירות בוואטסאפ או בטלפון.'
                : 'For any specific halachic or kosher inquiries, feel free to contact us via WhatsApp or phone.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
