import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Language, MenuCategory, MenuItem } from '../../types';
import { MENU_CATEGORIES, SAMPLE_MENU_ITEMS } from '../../config/businessConfig';
import { ShopCategoryBar } from './ShopCategoryBar';
import { ShopProductItem } from './ShopProductItem';
import { CartFloatingBar } from './CartFloatingBar';
import { CartDrawer } from './CartDrawer';
import { ProductSheetModal } from './ProductSheetModal';
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
  const [selectedSheetProduct, setSelectedSheetProduct] = useState<MenuItem | null>(null);

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

  // Smooth scroll to category inside the appropriate scroll container
  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const targetEl = document.getElementById(`shop-category-${categoryId}`);
    if (targetEl) {
      if (isShopMode && shopContainerRef.current) {
        const container = shopContainerRef.current;
        const categoryBarEl = document.getElementById('shop-category-bar');
        const barHeight = categoryBarEl?.offsetHeight || 60;
        const targetTop = targetEl.offsetTop - barHeight;
        container.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });
      } else {
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };

  // Active category detection on scroll
  useEffect(() => {
    const scrollTarget = isShopMode ? shopContainerRef.current : window;
    if (!scrollTarget) return;

    const handleScrollCategories = () => {
      const categoryElements = MENU_CATEGORIES.map((cat) => ({
        id: cat.id,
        el: document.getElementById(`shop-category-${cat.id}`),
      })).filter((item): item is { id: string; el: HTMLElement } => item.el !== null);

      if (categoryElements.length === 0) return;

      const triggerOffset = isShopMode ? 140 : 200;
      for (let i = categoryElements.length - 1; i >= 0; i--) {
        const rect = categoryElements[i].el.getBoundingClientRect();
        if (rect.top <= triggerOffset) {
          setActiveCategory(categoryElements[i].id);
          break;
        }
      }
    };

    scrollTarget.addEventListener('scroll', handleScrollCategories, { passive: true });
    return () => {
      scrollTarget.removeEventListener('scroll', handleScrollCategories);
    };
  }, [isShopMode]);

  return (
    <section
      id="shop-experience"
      ref={shopContainerRef}
      aria-label={lang === 'he' ? "חנות יהודל'ס" : "Yehudales Shop"}
      className={
        isShopMode
          ? "fixed inset-x-0 bottom-0 top-[96px] z-40 overflow-y-auto overscroll-contain bg-[#0B0C0E] border-t border-[#1E232B] pb-24 sm:pb-28"
          : "relative z-20 bg-[#0B0C0E] border-t border-[#1E232B]"
      }
    >
      {/* 
        Sticky Shop Header (Horizontal Category Nav)
        In normal mode: locks at top-[96px] (beneath topmost fixed header).
        In Shop Mode: locks at top-0 (inside the dedicated Shop scrolling container).
      */}
      <div
        className={
          isShopMode
            ? "sticky top-0 z-40 bg-[#0B0C0E]/98 backdrop-blur-md shadow-xl border-b border-[#1E232B]"
            : "sticky top-[96px] z-40 bg-[#0B0C0E]/98 backdrop-blur-md shadow-xl border-b border-[#1E232B]"
        }
      >
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
              {/* Category Header matching screenshot 1 (Bullet dot + Category Name | English uppercase menu subtitle in cyan) */}
              <div
                dir={lang === 'he' ? 'rtl' : 'ltr'}
                className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-[#1E232B]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D2FF] shrink-0 animate-pulse" />
                  <h3 className="text-base sm:text-lg font-black text-[#FAF9F6] tracking-tight">
                    {category.name[lang]}
                  </h3>
                </div>

                <span className="text-[11px] sm:text-xs font-black tracking-wider text-[#00D2FF] uppercase font-sans">
                  {category.name.en.toUpperCase()} MENU
                </span>
              </div>

              {/* Vertical Free-Standing Products List */}
              {products.length > 0 ? (
                <div className="divide-y divide-[#1A1F28]">
                  {products.map((product) => (
                    <ShopProductItem
                      key={product.id}
                      product={product}
                      lang={lang}
                      quantityInCart={getItemQuantity(product.id)}
                      onAddToCart={addItem}
                      onUpdateQuantity={updateQuantity}
                      onOpenSheet={(p) => setSelectedSheetProduct(p)}
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

      {/* Product Bottom Sheet Modal matching Screenshot 2 */}
      <ProductSheetModal
        product={selectedSheetProduct}
        isOpen={Boolean(selectedSheetProduct)}
        onClose={() => setSelectedSheetProduct(null)}
        lang={lang}
        onAddToCart={(product, qty) => {
          for (let i = 0; i < (qty || 1); i++) {
            addItem(product);
          }
        }}
      />

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

