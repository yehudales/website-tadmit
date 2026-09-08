import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Language, MenuCategory, MenuItem } from '../../types';
import { MENU_CATEGORIES, SAMPLE_MENU_ITEMS } from '../../config/businessConfig';
import { ShopBanner } from './ShopBanner';
import { ShopCategoryBar } from './ShopCategoryBar';
import { ShopProductItem } from './ShopProductItem';
import { CartFloatingBar } from './CartFloatingBar';
import { CartDrawer } from './CartDrawer';
import { useCart } from '../../hooks/useCart';

interface ShopSectionProps {
  lang: Language;
  isShopMode: boolean;
  onShopModeChange: (active: boolean) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  lang,
  isShopMode,
  onShopModeChange,
}) => {
  const shopContainerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>(MENU_CATEGORIES[0]?.id || 'cholent');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [specialtyOnly, setSpecialtyOnly] = useState<boolean>(false);

  // Cart Management
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  // Filtered menu items based on search and specialty filter
  const filteredItems = useMemo(() => {
    return SAMPLE_MENU_ITEMS.filter((item) => {
      // Hide if availability is 'hidden'
      if (item.availability === 'hidden') return false;

      // Filter by specialty if toggled
      if (specialtyOnly && !item.isSpecialty) return false;

      // Filter by search query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const nameMatch =
          item.name.he.toLowerCase().includes(query) ||
          item.name.en.toLowerCase().includes(query);
        const descMatch =
          item.description?.he.toLowerCase().includes(query) ||
          item.description?.en.toLowerCase().includes(query);
        return nameMatch || descMatch;
      }

      return true;
    });
  }, [searchTerm, specialtyOnly]);

  // Group filtered items by category
  const categoryProducts = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    MENU_CATEGORIES.forEach((cat) => {
      map[cat.id] = filteredItems.filter((item) => item.category === cat.id);
    });
    return map;
  }, [filteredItems]);

  // Detect when shop section enters viewport for header/navbar sync without scroll blocking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onShopModeChange(true);
        } else if (entry.boundingClientRect.top > 100) {
          onShopModeChange(false);
        }
      },
      { threshold: 0.05 }
    );

    if (shopContainerRef.current) {
      observer.observe(shopContainerRef.current);
    }

    return () => observer.disconnect();
  }, [onShopModeChange]);

  // Smooth scroll to category without screen jumps
  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const targetEl = document.getElementById(`shop-category-${categoryId}`);
    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section
      id="shop-experience"
      ref={shopContainerRef}
      aria-label={lang === 'he' ? "חנות יהודל'ס" : "Yehudales Shop"}
      className="relative z-20 bg-[#0B0C0E] border-t border-[#1E232B]"
    >
      {/* 
        Sticky Shop Header (Banner + Horizontal Category Nav)
        Uses pure CSS sticky without any synthetic scroll interception for jitter-free performance
      */}
      <div className="sticky top-0 z-30 bg-[#0B0C0E]/98 backdrop-blur-md shadow-xl border-b border-[#1E232B]">
        <ShopBanner lang={lang} isLocked={isShopMode} />
        <ShopCategoryBar
          lang={lang}
          categories={MENU_CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={specialtyOnly ? 'specialty' : undefined}
          onToggleFilter={() => setSpecialtyOnly((prev) => !prev)}
        />
      </div>

      {/* Filter notification bar if active */}
      {specialtyOnly && (
        <div
          dir={lang === 'he' ? 'rtl' : 'ltr'}
          className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between text-xs bg-[#00D2FF]/10 text-[#00D2FF] border-b border-[#00D2FF]/20"
        >
          <span>{lang === 'he' ? 'מוצגות מנות דגל וספיישלים בלבד' : 'Showing specialty dishes only'}</span>
          <button
            type="button"
            onClick={() => setSpecialtyOnly(false)}
            className="underline font-bold hover:text-white cursor-pointer"
          >
            {lang === 'he' ? 'הצג הכל' : 'Show all'}
          </button>
        </div>
      )}

      {/* Vertical Continuous Category & Product Flow */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {MENU_CATEGORIES.map((category) => {
          const products = categoryProducts[category.id] || [];
          if (products.length === 0 && searchTerm) return null;

          return (
            <div
              key={category.id}
              id={`shop-category-${category.id}`}
              data-category-id={category.id}
              className="scroll-mt-36 sm:scroll-mt-40"
            >
              {/* Category Header matching screenshot */}
              <div
                dir={lang === 'he' ? 'rtl' : 'ltr'}
                className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-[#1E232B]"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#FAF9F6] tracking-tight">
                    {category.name[lang]}
                  </h3>
                  {category.description && category.description[lang] && (
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {category.description[lang]}
                    </p>
                  )}
                </div>

                <span className="text-xs font-bold text-[#00D2FF] bg-[#00D2FF]/10 border border-[#00D2FF]/25 px-2.5 py-0.5 rounded-full shrink-0">
                  {products.length} {lang === 'he' ? 'מנות' : 'items'}
                </span>
              </div>

              {/* Vertical Products List */}
              {products.length > 0 ? (
                <div className="space-y-2.5 sm:space-y-3">
                  {products.map((product) => (
                    <ShopProductItem
                      key={product.id}
                      product={product}
                      lang={lang}
                      quantityInCart={getItemQuantity(product.id)}
                      onAddToCart={addItem}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#13161B] border border-[#1E232B] text-center text-xs text-[#64748B]">
                  {lang === 'he'
                    ? 'לא נמצאו מנות התואמות את החיפוש'
                    : 'No items match your search'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      <CartFloatingBar
        lang={lang}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Slide-in Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        totalPrice={totalPrice}
        totalItems={totalItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        lang={lang}
      />
    </section>
  );
};

