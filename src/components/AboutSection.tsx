import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative py-14 sm:py-20 md:py-28 bg-[#0B0C0E] border-t border-b border-[#252A32] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Story & Identity */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#1A1D22] border border-[#252A32] text-[#E0BE55] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#E0BE55]" />
              <span>{lang === 'he' ? 'על מותג יהודלס' : 'About Yehudales'}</span>
            </div>

            <h2
              id="about-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FAF9F6] tracking-tight leading-tight"
            >
              <span className="block text-[#94A3B8] font-medium text-base sm:text-lg md:text-xl mb-1">
                {lang === 'he' ? 'כ-6 שנות מומחיות ואיכות קולינרית' : '~6 Years of Culinary Craft in Ashdod'}
              </span>
              <span className="gold-gradient-text">
                {lang === 'he' ? 'חווית ליל שישי ברמה הגבוהה ביותר' : 'The Ultimate Friday Night Feast'}
              </span>
            </h2>

            <div className="space-y-3 sm:space-y-4 text-[#94A3B8] text-xs sm:text-base md:text-lg leading-relaxed font-normal">
              <p>
                {lang === 'he'
                  ? 'מותג האוכל "יהודלס" פועל בעיר אשדוד כ-6 שנים, מתוך מחויבות עמוקה להביא אל שולחנכם את הטעם העמוק, העשיר והאותנטי של ליל שישי. אנו מתמחים בתבשילי צ\'ולנט מובחרים ובשרים מיוחדים המבושלים בבישול מסורתי ארוך, המעניק לכל ביס עומק טעמים שאין שני לו.'
                  : 'Yehudales has operated in Ashdod for approximately 6 years, driven by a pure commitment to bringing the deep, authentic warmth of Friday night cuisine to your home. We specialize in signature slow-simmered cholent and prime meats, prepared with traditional care.'}
              </p>
              <p>
                {lang === 'he'
                  ? 'העסק פועל במודל Takeaway והזמנות ישירות דרך WhatsApp בלבד (ללא ישיבה במקום), מתוך דגש בלתי מתפשר על שלושת עקרונות הברזל שלנו: איכות חומרי הגלם, שירות אישי ומהיר, ורמת ניקיון והיגיינה מופתית בכל שלב.'
                  : 'Operating strictly as a takeaway and direct WhatsApp order service (no dine-in seating), we focus relentlessly on our three core tenets: premium ingredients, rapid courteous service, and pristine hygiene throughout.'}
              </p>
            </div>

            {/* Strict factual highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#1A1D22] border border-[#252A32] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E0BE55] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#FAF9F6]">
                    {lang === 'he' ? 'כ-6 שנות פעילות באשדוד' : '~6 Years in Ashdod'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">
                    {lang === 'he' ? 'מותג אוכל רציני ומבוסס' : 'Established and trusted food brand'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#1A1D22] border border-[#252A32] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#FAF9F6]">
                    {lang === 'he' ? 'כשרות מהודרת למהדרין' : 'Strict Kosher Standards'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">
                    {BUSINESS_CONFIG.kashrut.fullBadge[lang]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Box */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#1A1D22] border border-[#252A32] p-5 sm:p-8 shadow-2xl overflow-hidden group">
              <div className="relative z-10 space-y-4 sm:space-y-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center justify-center text-[#E0BE55]">
                  <Flame className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <blockquote className="text-lg sm:text-xl md:text-2xl font-light text-[#FAF9F6] tracking-tight leading-snug">
                  "{BUSINESS_CONFIG.tagline[lang]}"
                </blockquote>

                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {lang === 'he'
                    ? 'סיר הצ\'ולנט המסורתי שלנו מבעבע שעות ארוכות בתבלינים מדויקים, בשר בקר מובחר ותפוחי אדמה נימוחים. זו לא סתם מנה – זו חוויה שלמה של קדושת השבת והטעם המושלם.'
                    : 'Our signature cholent slow-cooks for countless hours with precise spices, choice beef cuts, and tender potatoes. It is not just a dish — it is an authentic Friday celebration.'}
                </p>

                <div className="pt-3.5 sm:pt-4 border-t border-[#252A32] flex items-center justify-between text-[11px] sm:text-xs text-[#94A3B8]">
                  <span>{BUSINESS_CONFIG.location.address[lang]}</span>
                  <span className="text-[#FAF9F6] font-mono">{BUSINESS_CONFIG.contact.phoneFormatted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
