import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Language, MenuCategory, MenuItem } from '../../types';
import { MENU_CATEGORIES, SAMPLE_MENU_ITEMS } from '../../config/businessConfig';
import { ShopCategoryBar } from './ShopCategoryBar';
import { ShopProductItem } from './ShopProductItem';
import { CartFloatingBar } from './CartFloatingBar';
import { CartDrawer } from './CartDrawer';
import { ProductSheetModal } from './ProductSheetModal';
import { useCart } from '../../hooks/useCart';

// Proximity trigger distance (in px) from the sticky category navigation bar.
// When a category's content boundary comes within this distance of the sticky bar, that category activates early.
export const CATEGORY_ACTIVE_TRIGGER_OFFSET = 32;

// Visual vertical gap (in px) between the bottom edge of the sticky category navigation bar
// and the top edge of the category title after clicking a category.
export const CATEGORY_SCROLL_TOP_GAP = 16;

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

  const isManualClickRef = useRef(false);
  const manualClickTimerRef = useRef<number | null>(null);

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

  // Smooth scroll to category with consistent gap beneath the sticky category navigation bar
  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    isManualClickRef.current = true;
    if (manualClickTimerRef.current) {
      window.clearTimeout(manualClickTimerRef.current);
    }
    manualClickTimerRef.current = window.setTimeout(() => {
      isManualClickRef.current = false;
    }, 650);

    const targetEl = document.getElementById(`shop-category-${categoryId}`);
    if (targetEl) {
      const categoryBarEl = document.getElementById('shop-category-bar');
      // Actual current sticky category navigation height from DOM measurements:
      const barHeight = categoryBarEl?.getBoundingClientRect().height || categoryBarEl?.offsetHeight || 60;

      if (isShopMode && shopContainerRef.current) {
        const container = shopContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        // Exact category position in container's scroll coordinate system
        const categoryPosition = targetRect.top - containerRect.top + container.scrollTop;

        // Calculate target scroll position using:
        // category position MINUS sticky category navigation bar height MINUS CATEGORY_SCROLL_TOP_GAP
        const targetTop = categoryPosition - barHeight - CATEGORY_SCROLL_TOP_GAP;

        container.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });
      } else {
        const targetRect = targetEl.getBoundingClientRect();
        const topmostHeader = document.getElementById('topmost-header-row');
        const topHeaderHeight = topmostHeader?.getBoundingClientRect().height || topmostHeader?.offsetHeight || 96;

        // Total sticky obstruction height above content
        const totalStickyHeight = topHeaderHeight + barHeight;

        // Category position in document scroll coordinates
        const categoryPosition = targetRect.top + window.scrollY;

        // Calculate target scroll position using:
        // category position MINUS sticky navigation obstruction MINUS CATEGORY_SCROLL_TOP_GAP
        const targetTop = categoryPosition - totalStickyHeight - CATEGORY_SCROLL_TOP_GAP;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });
      }
    }
  };

  // Active category detection on scroll with proximity trigger to the sticky category navigation bar
  useEffect(() => {
    const scrollTarget = isShopMode ? shopContainerRef.current : window;
    if (!scrollTarget) return;

    let rafId: number | null = null;

    const handleScrollCategories = () => {
      // Avoid overriding user click target while smooth scroll is underway
      if (isManualClickRef.current) return;

      const categoryElements = MENU_CATEGORIES.map((cat) => ({
        id: cat.id,
        el: document.getElementById(`shop-category-${cat.id}`),
      })).filter((item): item is { id: string; el: HTMLElement } => item.el !== null);

      if (categoryElements.length === 0) return;

      // Measure current geometry of the sticky category navigation bar
      const categoryBarEl = document.getElementById('shop-category-bar');
      const barRect = categoryBarEl?.getBoundingClientRect();
      const barBottom = barRect ? barRect.bottom : (isShopMode ? 180 : 180);

      // Proximity threshold: activates category as soon as its beginning content reaches within
      // CATEGORY_ACTIVE_TRIGGER_OFFSET (32px) of the sticky category bar
      const triggerThreshold = barBottom + CATEGORY_ACTIVE_TRIGGER_OFFSET;

      // Handle scroll reaching the absolute bottom of the container
      if (isShopMode && shopContainerRef.current) {
        const c = shopContainerRef.current;
        if (c.scrollHeight - c.scrollTop - c.clientHeight <= 2) {
          const lastCat = categoryElements[categoryElements.length - 1];
          setActiveCategory((prev) => (prev !== lastCat.id ? lastCat.id : prev));
          return;
        }
      } else if (!isShopMode) {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
          const lastCat = categoryElements[categoryElements.length - 1];
          setActiveCategory((prev) => (prev !== lastCat.id ? lastCat.id : prev));
          return;
        }
      }

      // Detect active category from bottom-most category upwards
      let matchedCategory = categoryElements[0].id;
      for (let i = categoryElements.length - 1; i >= 0; i--) {
        const rect = categoryElements[i].el.getBoundingClientRect();
        if (rect.top <= triggerThreshold) {
          matchedCategory = categoryElements[i].id;
          break;
        }
      }

      setActiveCategory((prev) => (prev !== matchedCategory ? matchedCategory : prev));
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        handleScrollCategories();
      });
    };

    // Initial detection on mount or mode change
    handleScrollCategories();

    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (manualClickTimerRef.current) window.clearTimeout(manualClickTimerRef.current);
      scrollTarget.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
          className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between text-xs bg-[#71D2F6]/10 text-[#71D2F6] border-b border-[#71D2F6]/20"
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
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
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
              {/* Category Header */}
              <div
                dir={lang === 'he' ? 'rtl' : 'ltr'}
                className="mb-1.5 pb-2 border-b border-white/[0.12]"
              >
                <h3 className="font-shop-headline font-semibold text-[1.25rem] leading-[1.2] text-[#FAF9F6] tracking-tight">
                  {category.name[lang]}
                </h3>
              </div>

              {/* Vertical Free-Standing Products List */}
              {products.length > 0 ? (
                <div className="divide-y divide-white/[0.12]">
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
                <div className="p-4 rounded-xl bg-[#13161B] border border-white/10 text-center font-shop-body text-[0.875rem] text-white/50">
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

