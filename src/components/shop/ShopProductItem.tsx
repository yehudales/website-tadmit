import React from 'react';
import { MenuItem, Language } from '../../types';
import { BookOpen, Ban } from 'lucide-react';

interface ShopProductItemProps {
  product: MenuItem;
  lang: Language;
  quantityInCart?: number;
  onAddToCart?: (product: MenuItem) => void;
  onUpdateQuantity?: (productId: string, qty: number) => void;
  onOpenSheet?: (product: MenuItem) => void;
}

export const ShopProductItem: React.FC<ShopProductItemProps> = ({
  product,
  lang,
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

      {/* Left: Product Image */}
      <div className="relative w-20 h-20 sm:w-[92px] sm:h-[92px] rounded-xl overflow-hidden shrink-0 bg-[#12151B] border border-white/10 flex items-center justify-center select-none shadow-inner group/img">
        {/* The Image (Click to open sheet) */}
        <div
          onClick={() => onOpenSheet && onOpenSheet(product)}
          className="relative w-full h-full flex items-center justify-center cursor-pointer"
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

          {/* Bottom Black Fade (Gradual upward fade on bottom ~18% of image) */}
          <div
            className="absolute bottom-0 inset-x-0 h-[18%] pointer-events-none z-10 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
};
