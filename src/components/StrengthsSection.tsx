import React from 'react';
import { Flame, Award, Sparkles, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BUSINESS_STRENGTHS } from '../config/businessConfig';
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
      className="py-14 sm:py-20 md:py-28 bg-[#0B0C0E] relative border-b border-[#252A32]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E0BE55] mb-2 inline-block px-3 py-1 rounded-lg bg-[#1A1D22] border border-[#252A32]">
            {lang === 'he' ? 'ערכי המותג' : 'Our Core Values'}
          </span>
          <h2
            id="strengths-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FAF9F6] tracking-tight"
          >
            <span className="gold-gradient-text">
              {lang === 'he' ? 'למה לבחור ביהודלס?' : 'Why Choose Yehudales?'}
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed">
            {lang === 'he'
              ? 'הסטנדרטים הקולינריים והעקרונות המובילים אותנו לאורך כ-6 שנות עשייה קולינרית באשדוד'
              : 'The culinary standards and principles that define our craft throughout ~6 years in Ashdod'}
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {BUSINESS_STRENGTHS.map((strength) => {
            const IconComponent = iconMap[strength.iconName as keyof typeof iconMap] || Award;
            return (
              <div
                key={strength.id}
                className="group relative rounded-2xl bg-[#1A1D22] border border-[#252A32] hover:border-[#94A3B8]/40 p-5 sm:p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-[#E0BE55] flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-105 transition-all duration-200">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#E0BE55]" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#FAF9F6] transition-colors mb-2">
                    {strength.title[lang]}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-normal">
                    {strength.description[lang]}
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#252A32] flex items-center justify-between text-[11px] sm:text-xs text-[#94A3B8]">
                  <span>יהודלס • אשדוד</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
