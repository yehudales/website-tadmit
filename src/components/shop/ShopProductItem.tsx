import React from 'react';
import { MenuItem, Language } from '../../types';
import { Plus, Minus, BookOpen, Ban } from 'lucide-react';

interface ShopProductItemProps {
  product: MenuItem;
  lang: Language;
  quantityInCart: number;
  onAddToCart: (product: MenuItem) => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onOpenSheet?: (product: MenuItem) => void;
}

export const ShopProductItem: React.FC<ShopProductItemProps> = ({
  product,
  lang,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onOpenSheet,
}) => {
  const isOutOfStock = product.availability === 'out_of_stock';

  return (
    <article
      id={`product-${product.id}`}
      dir={lang === 'he' ? 'rtl' : 'ltr'}
      className="group relative bg-transparent py-3 sm:py-3.5 border-b border-white/[0.12] transition-all duration-200 ease-out flex items-center justify-between gap-3 sm:gap-4 select-none hover:bg-white/[0.015] [@media(hover:hover)]:hover:scale-[1.015] origin-center"
    >
      {/* Right: Product Information */}
      <div
        onClick={() => onOpenSheet && onOpenSheet(product)}
        className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer select-none"
      >
        {/* Title & Out of Stock Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-shop-body font-semibold text-[1rem] leading-[1.3] text-white transition-colors truncate">
            {product.name[lang]}
          </h4>

          {isOutOfStock && (
            <span className="inline-flex items-center gap-1 font-shop-body text-[0.75rem] font-medium leading-[1.41667] text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-1.5 py-0.5 rounded-md">
              <Ban className="w-2.5 h-2.5" />
              {lang === 'he' ? 'אזל מהמלאי' : 'Out of stock'}
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && product.description[lang] && (
          <p className="mt-1 font-shop-body text-[0.875rem] leading-[1.42857] text-white/70 line-clamp-2">
            {product.description[lang]}
          </p>
        )}

        {/* Price (Cyan) */}
        <div className="mt-1.5 flex items-baseline gap-0.5">
          {product.price ? (
            <span className="font-shop-body font-semibold text-[0.9375rem] sm:text-[1rem] leading-[1.375] text-[#71D2F6] tracking-tight">
              ₪{product.price}
            </span>
          ) : (
            <span className="font-shop-body text-[0.75rem] text-white/50 leading-[1.41667]">
              {lang === 'he' ? 'לפי משקל' : 'Priced per item'}
            </span>
          )}
        </div>
      </div>

      {/* Left: Product Image with Overlaid Top-Left Add Button */}
      <div className="relative w-20 h-20 sm:w-[92px] sm:h-[92px] rounded-xl overflow-hidden shrink-0 bg-[#12151B] border border-white/10 flex items-center justify-center select-none shadow-inner group/img">
        {/* The Image (Click to open sheet) */}
        <div
          onClick={() => onOpenSheet && onOpenSheet(product)}
          className="w-full h-full flex items-center justify-center cursor-pointer"
        >
          {product.imagePlaceholder ? (
            <img
              src={product.imagePlaceholder}
              alt={product.name[lang]}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          ) : (
            <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.25] text-[#334155] group-hover/img:text-[#71D2F6]/80 transition-colors" />
          )}
        </div>

        {/* Top-Left Overlaid Expandable Button */}
        {!isOutOfStock && (
          <div
            dir="ltr"
            className={`absolute top-0 left-0 z-10 h-[32px] sm:h-[34px] flex flex-row items-center bg-[#71D2F6] text-[#0B0C0E] rounded-none rounded-br-[18px] transition-[width] duration-250 ease-out overflow-hidden shadow-md ${
              quantityInCart > 0 ? 'w-[78px] sm:w-[84px]' : 'w-[32px] sm:w-[34px]'
            }`}
          >
            {/* Visual 1: Leftmost PLUS Button (Stationary at left: 0) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (quantityInCart === 0) {
                  onAddToCart(product);
                } else {
                  onUpdateQuantity(product.id, Math.min(100, quantityInCart + 1));
                }
              }}
              className="w-[32px] sm:w-[34px] h-[32px] sm:h-[34px] shrink-0 flex items-center justify-center text-[#0B0C0E] hover:bg-black/10 active:bg-black/25 transition-colors cursor-pointer"
              aria-label={
                quantityInCart === 0
                  ? `${lang === 'he' ? 'הוספה להזמנה' : 'Add to order'} ${product.name[lang]}`
                  : lang === 'he'
                  ? 'הוסף כמות'
                  : 'Increase quantity'
              }
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>

            {/* Visual 2: Center QUANTITY */}
            <span
              className={`w-[20px] sm:w-[22px] text-center font-shop-body font-bold text-xs sm:text-[0.8125rem] text-[#0B0C0E] shrink-0 transition-opacity duration-200 select-none ${
                quantityInCart > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {quantityInCart}
            </span>

            {/* Visual 3: Rightmost MINUS Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (quantityInCart > 0) {
                  onUpdateQuantity(product.id, quantityInCart - 1);
                }
              }}
              className={`w-[26px] sm:w-[28px] h-[32px] sm:h-[34px] shrink-0 flex items-center justify-center text-[#0B0C0E] hover:bg-black/10 active:bg-black/25 transition-all cursor-pointer ${
                quantityInCart > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label={lang === 'he' ? 'הפחת כמות' : 'Decrease quantity'}
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
