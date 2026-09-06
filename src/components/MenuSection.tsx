import React, { useState } from 'react';
import { MessageCircle, Soup, Utensils, Salad, Coffee, Sparkles, ShieldCheck } from 'lucide-react';
import { MENU_CATEGORIES, SAMPLE_MENU_ITEMS, BUSINESS_CONFIG, getWhatsAppOrderUrl } from '../config/businessConfig';
import { Language } from '../types';

interface MenuSectionProps {
  lang: Language;
  onOpenWhatsApp: () => void;
}

const iconMap = {
  Soup,
  Utensils,
  Salad,
  Coffee,
};

export const MenuSection: React.FC<MenuSectionProps> = ({
  lang,
  onOpenWhatsApp,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredItems =
    activeCategory === 'all'
      ? SAMPLE_MENU_ITEMS
      : SAMPLE_MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="py-14 sm:py-20 md:py-28 bg-[#0B0C0E] relative border-b border-[#252A32]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E0BE55] mb-2 inline-block px-3 py-1 rounded-lg bg-[#1A1D22] border border-[#252A32]">
            {lang === 'he' ? 'תפריט ליל שישי' : 'Friday Night Menu'}
          </span>
          <h2
            id="menu-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FAF9F6] tracking-tight"
          >
            <span className="gold-gradient-text">
              {lang === 'he' ? 'מטעמי יהודלס' : 'Yehudales Specialties'}
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed">
            {lang === 'he'
              ? 'צ\'ולנט עשיר בבישול מסורתי, בשרים מובחרים (נווה ציון) ותוספות שבת ביתיות בכשרות מהודרת.'
              : 'Slow-simmered artisanal cholent, choice meats (Neve Zion), and traditional Shabbat sides.'}
          </p>

          {/* WhatsApp Direct Ordering Callout */}
          <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#1A1D22] border border-[#252A32] text-[11px] sm:text-xs md:text-sm text-[#94A3B8]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {lang === 'he'
                ? 'הזמנות מנות ובירורי זמינות מתבצעים ישירות דרך WhatsApp'
                : 'Direct orders & real-time menu availability via WhatsApp'}
            </span>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div
          role="tablist"
          aria-label={lang === 'he' ? 'קטגוריות תפריט' : 'Menu Categories'}
          className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center no-scrollbar -mx-4 px-4 sm:mx-0 mb-8 sm:mb-12"
        >
          <button
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            className={`min-h-[44px] shrink-0 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] ${
              activeCategory === 'all'
                ? 'bg-[#E0BE55] text-[#0B0C0E] shadow-sm'
                : 'bg-[#1A1D22] text-[#94A3B8] hover:text-[#FAF9F6] border border-[#252A32] hover:border-[#94A3B8]/40'
            }`}
          >
            {lang === 'he' ? 'כל המנות' : 'All Items'}
          </button>

          {MENU_CATEGORIES.map((category) => {
            const Icon = iconMap[category.iconName as keyof typeof iconMap] || Utensils;
            const isSelected = activeCategory === category.id;
            return (
              <button
                key={category.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(category.id)}
                className={`min-h-[44px] shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55] ${
                  isSelected
                    ? 'bg-[#E0BE55] text-[#0B0C0E] shadow-sm'
                    : 'bg-[#1A1D22] text-[#94A3B8] hover:text-[#FAF9F6] border border-[#252A32] hover:border-[#94A3B8]/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name[lang]}</span>
              </button>
            );
          })}
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          {filteredItems.map((item) => {
            const itemOrderUrl = getWhatsAppOrderUrl(
              lang === 'he'
                ? `שלום יהודלס, ברצוני להזמין לליל שישי: ${item.name.he}`
                : `Hello Yehudales, I would like to order: ${item.name.en}`
            );

            return (
              <article
                key={item.id}
                className="relative group rounded-2xl bg-[#1A1D22] border border-[#252A32] hover:border-[#94A3B8]/40 p-4 sm:p-6 md:p-7 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2 sm:mb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FAF9F6] group-hover:text-[#E0BE55] transition-colors">
                        {item.name[lang]}
                      </h3>
                      {item.isSpecialty && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-[#E0BE55] bg-[#0B0C0E] border border-[#E0BE55]/30 px-2 py-0.5 rounded-md">
                          <Sparkles className="w-3 h-3" />
                          {lang === 'he' ? 'מנת דגל מבוקשת' : 'Signature Specialty'}
                        </span>
                      )}
                    </div>

                    {item.price ? (
                      <span className="text-lg sm:text-xl font-bold text-[#FAF9F6] whitespace-nowrap tabular-nums">
                        ₪{item.price}
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-[#0B0C0E] border border-[#252A32] text-emerald-400 font-semibold">
                        {lang === 'he' ? 'הזמנה ב-WhatsApp' : 'Order on WhatsApp'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-4 font-normal">
                    {item.description[lang]}
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 border-t border-[#252A32] flex items-center justify-between gap-3">
                  {item.kashrutNote ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[#94A3B8] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item.kashrutNote[lang]}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] sm:text-xs text-[#94A3B8]">
                      {BUSINESS_CONFIG.kashrut.fullBadge[lang]}
                    </span>
                  )}

                  <a
                    href={itemOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FAF9F6] bg-[#0B0C0E] hover:bg-emerald-950/50 hover:text-emerald-400 px-3.5 sm:px-4 py-2 rounded-xl border border-[#252A32] hover:border-emerald-500/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'he' ? 'הזמן ב-WhatsApp' : 'Order on WhatsApp'}</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Big WhatsApp CTA Box underneath Menu */}
        <div className="rounded-2xl bg-[#1A1D22] border border-[#252A32] p-6 sm:p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#FAF9F6] mb-2 sm:mb-3">
            {lang === 'he'
              ? 'רוצים ליהנות מחווית ליל שישי של יהודלס?'
              : 'Ready to Experience Yehudales Shabbat Flavors?'}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-[#94A3B8] max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            {lang === 'he'
              ? 'פנו אלינו ישירות בוואטסאפ, שריינו את המנות האהובות עליכם וההזמנה תמתין לכם חמה, טרייה ומוקפדת.'
              : 'Message us on WhatsApp to reserve your favorite slow-simmered Shabbat specialties hot, fresh and ready.'}
          </p>
          <div className="flex justify-center">
            <a
              href={getWhatsAppOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B0C0E] font-black text-base shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 text-[#0B0C0E]" />
              <span>{BUSINESS_CONFIG.whatsapp.ctaText[lang]}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
