import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MenuItem, Language } from '../../types';
import { X, Share2, Plus, Minus, Utensils, BookOpen, Ban } from 'lucide-react';
import { SAMPLE_MENU_ITEMS } from '../../config/businessConfig';
import { motion } from 'motion/react';
import { getOverlayRoot } from '../../utils/overlayRoot';
import { CanonicalArrow } from '../CanonicalArrow';
import { ProductQuantityButton } from './ProductQuantityButton';

interface ProductSheetModalProps {
  product: MenuItem | null;
  allProducts?: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  getItemQuantity: (productId: string) => number;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onAddToCart: (product: MenuItem, qty?: number) => void;
}

// AUTHORITATIVE SINGLE SOURCE OF TRUTH FOR PRODUCT BANNER GEOMETRY & TIMINGS
export const PRODUCT_SHEET_INTERMEDIATE_HEIGHT = '68vh';
export const PRODUCT_SHEET_FULL_HEIGHT = '92vh';
export const PRODUCT_SHEET_PAUSE_HOLD_MS = 1000;
export const PRODUCT_SHEET_INITIAL_ENTRANCE_MS = 380;
export const PRODUCT_SHEET_HEIGHT_TRANSITION_MS = 450;

type SheetStage =
  | 'initial_entrance'
  | 'initial_expanding'
  | 'full_open'
  | 'forward_descending'
  | 'forward_hold'
  | 'forward_expanding';

export const ProductSheetModal: React.FC<ProductSheetModalProps> = ({
  product,
  allProducts,
  isOpen,
  onClose,
  lang,
  getItemQuantity,
  onUpdateQuantity,
  onAddToCart,
}) => {
  const [activeProduct, setActiveProduct] = useState<MenuItem | null>(product);
  const [history, setHistory] = useState<{ product: MenuItem; quantity: number }[]>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [stage, setStage] = useState<SheetStage>('initial_entrance');
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const stageTimerRef = useRef<number | null>(null);
  const pendingProductRef = useRef<MenuItem | null>(null);
  const contentBodyRef = useRef<HTMLDivElement>(null);

  // Single source of truth catalog: ensures all references resolve to canonical products
  const catalog = allProducts && allProducts.length > 0 ? allProducts : SAMPLE_MENU_ITEMS;
  const rawProduct = activeProduct || product;
  const currentDisplayProduct = rawProduct
    ? catalog.find((p) => p.id === rawProduct.id) || rawProduct
    : null;

  // Initialize and synchronize quantity when active product changes or when cart changes
  useEffect(() => {
    if (!currentDisplayProduct) return;
    const currentCartQty = getItemQuantity(currentDisplayProduct.id);
    if (currentCartQty > 0) {
      setQuantity(currentCartQty);
    } else {
      setQuantity(0);
    }
  }, [currentDisplayProduct?.id, getItemQuantity]);

  useEffect(() => {
    if (!isOpen || !product) {
      setStage('initial_entrance');
      setIsClosing(false);
      setHistory([]);
      setActiveProduct(null);
      pendingProductRef.current = null;
      if (stageTimerRef.current) {
        window.clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
      return;
    }

    // New initial open: reset navigation history and load initial product
    setActiveProduct(product);
    setHistory([]);
    setStage('initial_entrance');
    setIsClosing(false);
    const initialCartQty = getItemQuantity(product.id);
    setQuantity(initialCartQty > 0 ? initialCartQty : 0);
    pendingProductRef.current = null;

    if (stageTimerRef.current) {
      window.clearTimeout(stageTimerRef.current);
    }

    // Stage 1 initial entrance (~380ms) + exactly 1 second pause hold (1000ms) = 1380ms
    stageTimerRef.current = window.setTimeout(() => {
      setStage('initial_expanding');
    }, PRODUCT_SHEET_INITIAL_ENTRANCE_MS + PRODUCT_SHEET_PAUSE_HOLD_MS);

    return () => {
      if (stageTimerRef.current) {
        window.clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
    };
  }, [isOpen, product?.id]);

  // Recommendations are exact visual references to original canonical products from the menu catalog
  // Exclude current displayed product and any hidden items
  const recommendations = useMemo(() => {
    if (!currentDisplayProduct) return [];
    return catalog
      .filter((item) => item.id !== currentDisplayProduct.id && item.availability !== 'hidden')
      .slice(0, 2);
  }, [catalog, currentDisplayProduct?.id]);

  const handleClose = () => {
    if (stageTimerRef.current) {
      window.clearTimeout(stageTimerRef.current);
      stageTimerRef.current = null;
    }
    setIsClosing(true);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    if (stageTimerRef.current) {
      window.clearTimeout(stageTimerRef.current);
      stageTimerRef.current = null;
    }
    const previousEntry = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setActiveProduct(previousEntry.product);
    const backCartQty = getItemQuantity(previousEntry.product.id);
    setQuantity(backCartQty > 0 ? backCartQty : previousEntry.quantity || 0);
    setStage('full_open');
    if (contentBodyRef.current) {
      contentBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToProduct = (targetProduct: MenuItem) => {
    if (!currentDisplayProduct || isClosing) return;

    // Clear any active running timer to prevent timer desynchronization
    if (stageTimerRef.current) {
      window.clearTimeout(stageTimerRef.current);
      stageTimerRef.current = null;
    }

    // Record previous product into history for Back arrow support
    setHistory((prev) => [...prev, { product: currentDisplayProduct, quantity }]);
    pendingProductRef.current = targetProduct;

    // Lock scroll and reset to top
    if (contentBodyRef.current) {
      contentBodyRef.current.scrollTop = 0;
    }

    // STEP 2: Animate the existing visible Product Banner DOWN to the exact intermediate position
    setStage('forward_descending');

    // After downward motion reaches the exact intermediate position:
    stageTimerRef.current = window.setTimeout(() => {
      // STEP 3 & STEP 5: Stop at exact middle checkpoint & switch content to Product B
      if (pendingProductRef.current) {
        setActiveProduct(pendingProductRef.current);
        const targetCartQty = getItemQuantity(pendingProductRef.current.id);
        setQuantity(targetCartQty > 0 ? targetCartQty : 0);
        pendingProductRef.current = null;
      }
      setStage('forward_hold');

      // STEP 4: WAIT EXACTLY 1 SECOND at this exact same intermediate height
      stageTimerRef.current = window.setTimeout(() => {
        // STEP 6: Animate the SAME Product Banner upward to FULL OPEN
        setStage('forward_expanding');
      }, PRODUCT_SHEET_PAUSE_HOLD_MS);
    }, PRODUCT_SHEET_HEIGHT_TRANSITION_MS);
  };

  const handleAnimationComplete = () => {
    if (isClosing) {
      setIsClosing(false);
      setHistory([]);
      setStage('initial_entrance');
      onClose();
    } else if (stage === 'initial_expanding' || stage === 'forward_expanding') {
      setStage('full_open');
    }
  };

  // Determine current animated height strictly using the authoritative single source of truth
  const isAtIntermediateHeight =
    stage === 'initial_entrance' ||
    stage === 'forward_descending' ||
    stage === 'forward_hold';

  const currentTargetHeight = isAtIntermediateHeight
    ? PRODUCT_SHEET_INTERMEDIATE_HEIGHT
    : PRODUCT_SHEET_FULL_HEIGHT;

  const handleIncreaseQuantity = () => {
    if (!currentDisplayProduct) return;
    const nextQty = Math.min(100, quantity + 1);
    setQuantity(nextQty);
    const currentCartQty = getItemQuantity(currentDisplayProduct.id);
    if (currentCartQty > 0) {
      onUpdateQuantity(currentDisplayProduct.id, nextQty);
    } else {
      onAddToCart(currentDisplayProduct, 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (!currentDisplayProduct) return;
    const nextQty = Math.max(0, quantity - 1);
    setQuantity(nextQty);
    const currentCartQty = getItemQuantity(currentDisplayProduct.id);
    if (currentCartQty > 0) {
      onUpdateQuantity(currentDisplayProduct.id, nextQty);
    }
  };

  const handleAddMainProduct = () => {
    if (!currentDisplayProduct) return;
    const qtyToAdd = quantity > 0 ? quantity : 1;
    const currentCartQty = getItemQuantity(currentDisplayProduct.id);
    if (currentCartQty > 0) {
      onUpdateQuantity(currentDisplayProduct.id, qtyToAdd);
    } else {
      onAddToCart(currentDisplayProduct, qtyToAdd);
    }
    handleClose();
  };

  const displayPrice = quantity > 0
    ? (currentDisplayProduct?.price || 0) * quantity
    : (currentDisplayProduct?.price || 0);

  if (typeof document === 'undefined') return null;
  if (!isOpen && !isClosing) return null;
  if (!currentDisplayProduct) return null;

  return createPortal(
    <div
      id="product-sheet-modal-portal"
      className="fixed inset-0 overflow-hidden select-none pointer-events-auto z-[70] font-shop shop-scope"
      style={{ zIndex: 'var(--z-product-banner, 70)' }}
    >
      {/* Dark Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.28 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Two-Stage Bottom Sheet Modal */}
      <motion.div
        dir={lang === 'he' ? 'rtl' : 'ltr'}
        initial={{ y: '100%', height: PRODUCT_SHEET_INTERMEDIATE_HEIGHT }}
        animate={{
          y: isClosing ? '100%' : 0,
          height: currentTargetHeight,
        }}
        transition={{
          y: { duration: isClosing ? 0.28 : 0.38, ease: [0.16, 1, 0.3, 1] },
          height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        }}
        onAnimationComplete={handleAnimationComplete}
        className="fixed inset-x-0 bottom-0 max-w-lg mx-auto bg-[#0B0C0E] border-t border-[#1E232B] rounded-t-[28px] shadow-2xl flex flex-col z-10 overflow-hidden pointer-events-auto"
      >
        {/* TOP IMAGE AREA with Drag Handle & Overlaid Circular Controls */}
        <div className="relative w-full h-44 sm:h-52 bg-[#12151B] rounded-t-[28px] overflow-hidden shrink-0 border-b border-white/5">
          {/* Visual Background Pattern / Texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0B0C0E]" />

          {/* Dish Image / Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {currentDisplayProduct.imagePlaceholder ? (
              <img
                src={currentDisplayProduct.imagePlaceholder}
                alt={currentDisplayProduct.name[lang]}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#181C24] border-2 border-white/10 flex items-center justify-center shadow-2xl text-[#71D2F6]/70">
                <Utensils className="w-12 h-12 stroke-[1.25]" />
              </div>
            )}
          </div>

          {/* Permanent Top-Center Line Indicator: ~6% width, subtle neutral gray */}
          <div className="absolute top-1.5 inset-x-0 flex justify-center z-20 pointer-events-none">
            <div className="w-[6%] min-w-[16px] max-w-[28px] h-[3px] rounded-full bg-[#71717A]/75 shadow-xs" />
          </div>

          {/* Permanent Bottom Black Fade: ~18% height */}
          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

          {/* Compact Close "X" Button on the exact top-left corner of the product image */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-30 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-black/65 hover:bg-black/90 active:scale-95 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md"
            aria-label={lang === 'he' ? 'סגור מוצר' : 'Close product'}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Canonical Back Arrow Button on the exact top-right corner of the product image (visible when navigating between products) */}
          {history.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBack();
              }}
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-black/65 hover:bg-black/90 active:scale-95 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label={lang === 'he' ? 'חזור למוצר הקודם' : 'Back to previous product'}
              title={lang === 'he' ? 'חזור למוצר הקודם' : 'Back to previous product'}
            >
              <CanonicalArrow
                direction="back"
                lang={lang}
                className="w-4 h-4 text-white"
                strokeWidth={2.2}
              />
            </button>
          )}
        </div>

        {/* Scrollable Content Body (Locked to overflow-hidden until full open completes) */}
        <div
          ref={contentBodyRef}
          className={`flex-1 px-5 py-4 space-y-4 ${
            stage === 'full_open' && !isClosing ? 'overflow-y-auto' : 'overflow-hidden'
          }`}
        >
          {/* MAIN PRODUCT INFO: Title, Price & Share Action */}
          <div className="flex items-start justify-between gap-3 pt-1">
            {/* Title & Price on Right (RTL) */}
            <div className="space-y-1 text-right">
              <h2 className="font-shop-headline font-semibold text-[1.25rem] leading-[1.2] text-white tracking-tight">
                {currentDisplayProduct.name[lang]}
              </h2>
              <div className="font-shop-body font-semibold text-[1rem] sm:text-[1.125rem] text-[#71D2F6]">
                {currentDisplayProduct.price ? `₪${currentDisplayProduct.price}` : (lang === 'he' ? 'לפי משקל' : 'Priced per item')}
              </div>
              {currentDisplayProduct.description && currentDisplayProduct.description[lang] && (
                <p className="font-shop-body font-normal text-[0.875rem] leading-[1.42857] text-white/70 pt-1">
                  {currentDisplayProduct.description[lang]}
                </p>
              )}
            </div>

            {/* Share Circular Button on Left (RTL) */}
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: currentDisplayProduct.name[lang],
                    url: window.location.href,
                  }).catch(() => {});
                }
              }}
              className="w-9 h-9 rounded-full bg-[#13161C] border border-white/10 text-white/70 hover:text-[#71D2F6] hover:border-[#71D2F6]/40 flex items-center justify-center transition-all active:scale-95 shrink-0 cursor-pointer shadow-sm"
              title={lang === 'he' ? 'שתף' : 'Share'}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thin Separator Line */}
          <div className="w-full h-[1px] bg-white/[0.12]" />

          {/* RECOMMENDATIONS SECTION "אחרים קנו גם" */}
          <div className="space-y-3 pt-1">
            <h3 className="font-shop-headline font-semibold text-[0.875rem] sm:text-[1rem] text-[#71D2F6] text-right tracking-tight">
              {lang === 'he' ? 'אחרים קנו גם' : 'Others also bought'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((rec) => {
                // Ensure authoritative reference to the original product in the menu
                const originalProduct = catalog.find((p) => p.id === rec.id) || rec;
                const recQty = getItemQuantity(originalProduct.id);
                const isRecOutOfStock = originalProduct.availability === 'out_of_stock';

                return (
                  <div
                    key={originalProduct.id}
                    id={`recommendation-item-${originalProduct.id}`}
                    onClick={() => handleNavigateToProduct(originalProduct)}
                    className="relative bg-[#12151B] border border-white/10 hover:border-[#71D2F6]/30 rounded-xl p-2.5 flex flex-col justify-between transition-all group overflow-hidden cursor-pointer active:scale-[0.98]"
                  >
                    {/* Top-Left Overlaid Expandable Quantity Control synchronized with cart */}
                    {!isRecOutOfStock && (
                      <ProductQuantityButton
                        product={originalProduct}
                        lang={lang}
                        quantityInCart={recQty}
                        onAddToCart={(p) => onAddToCart(p, 1)}
                        onUpdateQuantity={onUpdateQuantity}
                        size="compact"
                      />
                    )}

                    {/* Media Thumbnail Container - Displays exact same canonical image as original product */}
                    <div className="relative w-full h-20 bg-[#090A0C] rounded-lg overflow-hidden flex items-center justify-center text-[#334155] mb-2 border border-white/5">
                      {originalProduct.imagePlaceholder ? (
                        <img
                          src={originalProduct.imagePlaceholder}
                          alt={originalProduct.name[lang]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                      ) : (
                        <BookOpen className="w-7 h-7 stroke-[1.25] text-[#334155] group-hover:text-[#71D2F6]/80 transition-colors" />
                      )}
                      {/* Subtle bottom gradient */}
                      <div
                        className="absolute bottom-0 inset-x-0 h-[22%] pointer-events-none z-1 bg-gradient-to-t from-black/60 to-transparent"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Recommendation Title, Price & Stock */}
                    <div className="text-right space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-shop-body text-[0.875rem] font-medium text-white truncate">
                          {originalProduct.name[lang]}
                        </h4>
                        {isRecOutOfStock && (
                          <span className="inline-flex items-center gap-0.5 font-shop-body text-[0.6875rem] font-medium text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-1 py-0.25 rounded shrink-0">
                            <Ban className="w-2.5 h-2.5" />
                            {lang === 'he' ? 'אזל' : 'Out'}
                          </span>
                        )}
                      </div>
                      <div className="font-shop-body text-[0.8125rem] font-semibold text-[#71D2F6]">
                        {originalProduct.price ? `₪${originalProduct.price}` : (lang === 'he' ? 'לפי משקל' : 'Priced per item')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FIXED BOTTOM ACTION BAR matching Screenshot Reference */}
        <div className="p-3 sm:p-4 bg-[#0B0C0E] border-t border-white/[0.12] flex items-center justify-between gap-3 shrink-0">
          {/* Large Cyan CTA Button with exact same corner geometry (rounded-lg) as "הצגת פריטים" */}
          <button
            type="button"
            onClick={handleAddMainProduct}
            className="flex-1 h-12 py-2.5 px-5 rounded-lg bg-[#71D2F6] hover:opacity-90 text-[#0B0C0E] font-shop-body text-[0.9375rem] sm:text-[1rem] font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-[0_4px_25px_rgba(113,210,246,0.35)] flex items-center justify-center gap-2"
          >
            <span>
              {lang === 'he'
                ? (currentDisplayProduct.price ? `הוסף לעגלה — ₪${displayPrice}` : 'הוסף לעגלה')
                : (currentDisplayProduct.price ? `Add to order — ₪${displayPrice}` : 'Add to order')}
            </span>
          </button>

          {/* Compact Dark Quantity Capsule [ - ] 1 [ + ] */}
          <div className="h-10 flex items-center justify-between gap-2.5 bg-[#13171E] border border-white/10 rounded-full px-3 py-1 shrink-0">
            <button
              type="button"
              onClick={handleDecreaseQuantity}
              className="w-7 h-7 rounded-full bg-[#1E232C] hover:bg-[#282F3B] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
              aria-label={lang === 'he' ? 'הפחת כמות' : 'Decrease quantity'}
            >
              <Minus className="w-3 h-3 text-[#FAF9F6]" />
            </button>

            <span className="font-shop-body text-sm font-semibold text-white w-4 text-center">
              {quantity}
            </span>

            <button
              type="button"
              onClick={handleIncreaseQuantity}
              className="w-7 h-7 rounded-full bg-[#1E232C] hover:bg-[#282F3B] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
              aria-label={lang === 'he' ? 'הוסף כמות' : 'Increase quantity'}
            >
              <Plus className="w-3 h-3 text-[#FAF9F6]" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    getOverlayRoot()
  );
};

