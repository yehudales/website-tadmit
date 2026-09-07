import React from 'react';
import { Flame, Award, Sparkles, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BUSINESS_STRENGTHS, BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';

interface StrengthsSectionProps {
  lang: Language;
}

const iconMap = {
  Flame,
  Award,
  Sparkles,
  Clock,
  ShieldCheck,
  HeartHandshake,
};

export const StrengthsSection: React.FC<StrengthsSectionProps> = ({ lang }) => {
  return (
    <section
      id="strengths"
      aria-labelledby="strengths-heading"
      className="py-12 sm:py-16 md:py-24 bg-[#0B0C0E] relative border-b border-[#252A32]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single Unified Premium Brand Banner */}
        <div className="relative rounded-3xl bg-[#121417] border border-[#252A32] shadow-2xl p-6 sm:p-10 md:p-14 overflow-hidden">
          {/* Subtle ambient decorative accents */}
          <div
            className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#FF7B1C]/5 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#FF7B1C]/5 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Banner Header */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF7B1C] mb-2.5 inline-block px-3.5 py-1 rounded-lg bg-[#0B0C0E]/80 border border-[#252A32]">
              {lang === 'he' ? 'ערכי היסוד ומסורת המותג' : 'Our Brand Pillars & Heritage'}
            </span>
            <h2
              id="strengths-heading"
              className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FAF9F6] tracking-tight"
            >
              <span className="text-[#FF7B1C]">
                {lang === 'he' ? 'למה לבחור ביהודלס?' : 'Why Choose Yehudales?'}
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed">
              {lang === 'he'
                ? 'הסטנדרטים הקולינריים והעקרונות המובילים אותנו לאורך כ-6 שנות עשייה קולינרית באשדוד'
                : 'The culinary standards and principles that define our craft throughout ~6 years in Ashdod'}
            </p>
          </div>

          {/* Elegant Horizontal Divider */}
          <div className="relative z-10 my-8 sm:my-10 border-t border-[#252A32]/80" />

          {/* 6 Core Brand Values in Unified Cohesive Layout (No separate nested cards) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {BUSINESS_STRENGTHS.map((strength, index) => {
              const IconComponent = iconMap[strength.iconName as keyof typeof iconMap] || Award;
              return (
                <div key={strength.id} className="flex items-start gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-[#FF7B1C] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7B1C]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-mono font-bold text-[#FF7B1C]/70">
                        0{index + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#FAF9F6] leading-tight">
                        {strength.title[lang]}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-normal">
                      {strength.description[lang]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Unified Brand Signature Strip */}
          <div className="relative z-10 mt-10 sm:mt-12 pt-5 sm:pt-6 border-t border-[#252A32]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start text-xs text-[#94A3B8]">
            <span className="font-medium text-[#FAF9F6]">
              {BUSINESS_CONFIG.name[lang]} — {BUSINESS_CONFIG.tagline[lang]}
            </span>
            <span className="text-[11px] text-[#FF7B1C] font-semibold">
              {lang === 'he'
                ? 'בשר נווה ציון • מוצרים בהשגחת בד״ץ העדה החרדית • כ-6 שנות ניסיון באשדוד'
                : 'Neve Zion Meats • Badatz Edah HaChareidis Products • ~6 Years Experience in Ashdod'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
