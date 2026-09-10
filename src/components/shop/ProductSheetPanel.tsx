import React from 'react';
import { MenuItem, Language } from '../../types';
import { X, Share2, Plus, Minus, Utensils } from 'lucide-react';
import { CanonicalArrow } from '../CanonicalArrow';
import { ProductExpandableControl } from './ProductExpandableControl';

export interface ProductSheetPanelProps {
  product: MenuItem;
  lang: Language;
  quantity: number;
  setQuantity: (updater: number | ((prev: number) => number)) => void;
  hasHistory: boolean;
  isLocked: boolean;
  onClose: () => void;
  onBack: () => void;
  onNavigateToProduct: (targetProduct: MenuItem) => void;
  recommendations: MenuItem[];
  onAddToCart: (product: MenuItem, qty?: number) => void;
  getItemQuantity?: (productId: string) => number;
  onUpdateQuantity?: (productId: string, qty: number) => void;
  handleAddMainProduct: () => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
  isScrollLocked?: boolean;
}

export const ProductSheetPanel: React.FC<ProductSheetPanelProps> = ({
  product,
  lang,
  quantity,
  setQuantity,
  hasHistory,
  isLocked,
  onClose,
  onBack,
  onNavigateToProduct,
  recommendations,
  onAddToCart,
  getItemQuantity,
  onUpdateQuantity,
  handleAddMainProduct,
  scrollRef,
  isScrollLocked = false,
}) => {
  const totalPrice = (product.price || 0) * quantity;

  return (
    <div
      dir={lang === 'he' ? 'rtl' : 'ltr'}
      className="w-full h-full flex flex-col justify-between overflow-hidden bg-[#0B0C0E] text-[#FAF9F6]"
    >
      {/* TOP IMAGE AREA with Drag Handle & Overlaid Circular Controls */}
      <div className="relative w-full h-44 sm:h-52 bg-[#12151B] rounded-t-[28px] overflow-hidden shrink-0 border-b border-white/5">
        {/* Visual Background Pattern / Texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0B0C0E]" />

        {/* Dish Image / Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {product.imagePlaceholder ? (
            <img
              src={product.imagePlaceholder}
              alt={product.name[lang]}
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
          disabled={isLocked}
          onClick={(e) => {
            e.stopPropagation();
            if (!isLocked) onClose();
          }}
          className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-30 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-black/65 hover:bg-black/90 active:scale-95 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label={lang === 'he' ? 'סגור מוצר' : 'Close product'}
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Canonical Back Arrow Button on the exact top-right corner of the product image */}
        {hasHistory && (
          <button
            type="button"
            disabled={isLocked}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLocked) onBack();
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

      {/* Scrollable Content Body */}
      <div
        ref={scrollRef}
        className={`flex-1 px-5 py-4 space-y-4 ${
          isScrollLocked ? 'overflow-hidden' : 'overflow-y-auto'
        }`}
      >
        {/* MAIN PRODUCT INFO: Title, Price & Share Action */}
        <div className="flex items-start justify-between gap-3 pt-1">
          {/* Title & Price on Right (RTL) */}
          <div className="space-y-1 text-right">
            <h2 className="font-shop-headline font-semibold text-[1.25rem] leading-[1.2] text-white tracking-tight">
              {product.name[lang]}
            </h2>
            <div className="font-shop-body font-semibold text-[1rem] sm:text-[1.125rem] text-[#71D2F6]">
              {product.price
                ? `₪${product.price}`
                : lang === 'he'
                ? 'לפי משקל'
                : 'Priced per item'}
            </div>
            {product.description && product.description[lang] && (
              <p className="font-shop-body font-normal text-[0.875rem] leading-[1.42857] text-white/70 pt-1">
                {product.description[lang]}
              </p>
            )}
          </div>

          {/* Share Circular Button on Left (RTL) */}
          <button
            type="button"
            disabled={isLocked}
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: product.name[lang],
                    url: window.location.href,
                  })
                  .catch(() => {});
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
              const recQtyInCart = getItemQuantity ? getItemQuantity(rec.id) : 0;

              return (
                <div
                  key={rec.id}
                  onClick={() => {
                    if (!isLocked) {
                      onNavigateToProduct(rec);
                    }
                  }}
                  className="relative bg-[#12151B] border border-white/10 hover:border-[#71D2F6]/30 rounded-xl flex flex-col justify-between transition-all group overflow-hidden cursor-pointer active:scale-[0.98] select-none"
                >
                  {/* Media Thumbnail Container: Flush with top edge of card, zero padding */}
                  <div className="relative w-full h-24 sm:h-28 bg-[#090A0C] flex items-center justify-center text-[#334155] border-b border-white/5 overflow-hidden">
                    {rec.imagePlaceholder ? (
                      <img
                        src={rec.imagePlaceholder}
                        alt={rec.name[lang]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    ) : (
                      <Utensils className="w-7 h-7 stroke-[1.25] text-[#334155] group-hover:text-[#71D2F6]/60 transition-colors" />
                    )}

                    {/* Top-Right Overlaid Expandable + Control */}
                    <ProductExpandableControl
                      product={rec}
                      lang={lang}
                      quantityInCart={recQtyInCart}
                      onAddToCart={(p) => {
                        onAddToCart(p, 1);
                      }}
                      onUpdateQuantity={(pid, qty) => {
                        if (onUpdateQuantity) {
                          onUpdateQuantity(pid, qty);
                        }
                      }}
                      position="top-right"
                    />
                  </div>

                  {/* Recommendation Price on Top & Title Below */}
                  <div className="p-2.5 pt-2 text-right space-y-0.5">
                    <div className="font-shop-body text-[0.8125rem] sm:text-[0.875rem] font-semibold text-[#71D2F6]">
                      ₪{rec.price}
                    </div>
                    <h4 className="font-shop-body text-[0.875rem] font-medium text-white truncate">
                      {rec.name[lang]}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM ACTION BAR */}
      <div className="p-3 sm:p-4 bg-[#0B0C0E] border-t border-white/[0.12] flex items-center justify-between gap-3 shrink-0">
        {/* Large Cyan CTA Button */}
        <button
          type="button"
          disabled={isLocked}
          onClick={handleAddMainProduct}
          className="flex-1 h-12 py-2.5 px-5 rounded-lg bg-[#71D2F6] hover:opacity-90 text-[#0B0C0E] font-shop-body text-[0.9375rem] sm:text-[1rem] font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-[0_4px_25px_rgba(113,210,246,0.35)] flex items-center justify-center gap-2"
        >
          <span>
            {lang === 'he'
              ? product.price
                ? `הוסף לעגלה — ₪${totalPrice}`
                : 'הוסף לעגלה'
              : product.price
              ? `Add to order — ₪${totalPrice}`
              : 'Add to order'}
          </span>
        </button>

        {/* Compact Dark Quantity Capsule [ - ] 1 [ + ] */}
        <div className="h-10 flex items-center justify-between gap-2.5 bg-[#13171E] border border-white/10 rounded-full px-3 py-1 shrink-0">
          <button
            type="button"
            disabled={isLocked}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
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
            disabled={isLocked}
            onClick={() => setQuantity((q) => q + 1)}
            className="w-7 h-7 rounded-full bg-[#1E232C] hover:bg-[#282F3B] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
            aria-label={lang === 'he' ? 'הוסף כמות' : 'Increase quantity'}
          >
            <Plus className="w-3 h-3 text-[#FAF9F6]" />
          </button>
        </div>
      </div>
    </div>
  );
};
