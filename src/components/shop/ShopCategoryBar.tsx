import React, { useRef, useEffect } from 'react';
import { MenuCategory, Language } from '../../types';
import { Search, SlidersHorizontal, Sun, X } from 'lucide-react';

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
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* ROW 1: Horizontal Category Tabs (active: cyan text + underline) */}
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
                className={`group pb-2 font-shop-body text-[0.875rem] leading-[1.42857] whitespace-nowrap transition-all shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#71D2F6] relative ${
                  isActive
                    ? 'text-[#71D2F6] font-semibold'
                    : 'text-white/70 hover:text-white font-medium'
                }`}
              >
                <span>{cat.name[lang]}</span>

                {/* Active Underline Indicator */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#71D2F6] rounded-full shadow-[0_0_8px_rgba(113,210,246,0.6)]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ROW 2: Search & Filter Controls */}
        <div
          dir={lang === 'he' ? 'rtl' : 'ltr'}
          className="py-2 flex items-center gap-2 border-t border-white/[0.08]"
        >
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={lang === 'he' ? '...חיפוש בתפריט' : 'Search menu...'}
              className="w-full h-9 bg-[#13161B] hover:bg-[#181C22] focus:bg-[#181C22] border border-[#252A32] focus:border-[#71D2F6]/60 rounded-xl py-1.5 pl-8 pr-8 font-shop-body text-[0.875rem] leading-[1.42857] text-[#FAF9F6] placeholder-white/40 focus:outline-none transition-colors"
            />
            <Search className={`w-3.5 h-3.5 text-white/40 absolute top-1/2 -translate-y-1/2 ${lang === 'he' ? 'left-2.5' : 'right-2.5'}`} />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange && onSearchChange('')}
                className={`p-1 text-white/50 hover:text-white absolute top-1/2 -translate-y-1/2 ${lang === 'he' ? 'right-2' : 'left-2'}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Button (מסנן ☰) */}
          <button
            type="button"
            onClick={onToggleFilter}
            className={`h-9 inline-flex items-center gap-1.5 px-3 rounded-xl border font-shop-body text-[0.8125rem] font-medium transition-all cursor-pointer ${
              selectedFilter
                ? 'bg-[#71D2F6]/10 text-[#71D2F6] border-[#71D2F6]/40 font-semibold'
                : 'bg-[#13161B] text-white/70 hover:text-white border-[#252A32] hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{lang === 'he' ? 'מסנן' : 'Filter'}</span>
          </button>

          {/* Sun / Theme Button */}
          <button
            type="button"
            className="h-9 w-9 rounded-xl bg-[#13161B] hover:bg-[#181C22] text-white/70 hover:text-[#71D2F6] border border-[#252A32] transition-colors cursor-pointer flex items-center justify-center"
            aria-label={lang === 'he' ? 'שנה ערכת נושא' : 'Toggle theme'}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

