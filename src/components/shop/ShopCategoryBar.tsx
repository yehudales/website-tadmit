import React, { useRef, useEffect } from 'react';
import { MenuCategory, Language } from '../../types';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface ShopCategoryBarProps {
  lang: Language;
  categories: MenuCategory[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  selectedFilter?: string;
  onToggleFilter?: () => void;
}

export const ShopCategoryBar: React.FC<ShopCategoryBarProps> = ({
  lang,
  categories,
  activeCategory,
  onSelectCategory,
  searchTerm = '',
  onSearchChange,
  selectedFilter,
  onToggleFilter,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Auto scroll the active button into visible range inside the horizontal scroll bar without whole page shifts
  useEffect(() => {
    if (activeBtnRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = activeBtnRef.current;
      
      const containerLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const buttonOffset = button.offsetLeft;
      const buttonWidth = button.clientWidth;

      if (
        buttonOffset < containerLeft ||
        buttonOffset + buttonWidth > containerLeft + containerWidth
      ) {
        button.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [activeCategory]);

  return (
    <nav
      id="shop-category-bar"
      aria-label={lang === 'he' ? 'ניווט קטגוריות חנות' : 'Shop category navigation'}
      className="w-full bg-[#0B0C0E]/98 backdrop-blur-md border-b border-[#1E232B] select-none shadow-md"
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* ROW 1: Horizontal Category Tabs matching screenshot (active: cyan text + underline) */}
        <div
          ref={scrollContainerRef}
          dir={lang === 'he' ? 'rtl' : 'ltr'}
          className="flex items-center gap-4 sm:gap-6 pt-2 overflow-x-auto no-scrollbar scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory;

            return (
              <button
                key={cat.id}
                ref={isActive ? (el) => { activeBtnRef.current = el; } : undefined}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`group pb-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2FF] relative ${
                  isActive
                    ? 'text-[#00D2FF] font-black'
                    : 'text-[#94A3B8] hover:text-[#FAF9F6]'
                }`}
              >
                <span>{cat.name[lang]}</span>

                {/* Active Underline Indicator matching screenshot */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00D2FF] rounded-full shadow-[0_0_8px_rgba(0,210,255,0.6)]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ROW 2: Search & Filter Controls matching screenshot */}
        <div
          dir={lang === 'he' ? 'rtl' : 'ltr'}
          className="py-2 flex items-center gap-2 border-t border-[#1E232B]/60"
        >
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={lang === 'he' ? '...חיפוש בתפריט' : 'Search menu...'}
              className="w-full bg-[#13161B] hover:bg-[#181C22] focus:bg-[#181C22] border border-[#252A32] focus:border-[#00D2FF]/60 rounded-xl py-1.5 pl-8 pr-8 text-xs text-[#FAF9F6] placeholder-[#64748B] focus:outline-none transition-colors"
            />
            <Search className={`w-3.5 h-3.5 text-[#64748B] absolute top-1/2 -translate-y-1/2 ${lang === 'he' ? 'left-2.5' : 'right-2.5'}`} />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange && onSearchChange('')}
                className={`p-1 text-[#64748B] hover:text-white absolute top-1/2 -translate-y-1/2 ${lang === 'he' ? 'right-2' : 'left-2'}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Button matching screenshot (מסנן ☰) */}
          <button
            type="button"
            onClick={onToggleFilter}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              selectedFilter
                ? 'bg-[#00D2FF]/10 text-[#00D2FF] border-[#00D2FF]/40'
                : 'bg-[#13161B] text-[#94A3B8] hover:text-[#FAF9F6] border-[#252A32] hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{lang === 'he' ? 'מסנן' : 'Filter'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

