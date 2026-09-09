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
      className="group relative bg-transparent py-3 sm:py-3.5 border-b border-[#1A1F28] transition-colors duration-150 flex items-center justify-between gap-3 sm:gap-4 select-none hover:bg-white/[0.015]"
    >
      {/* Right Column (in RTL): Thumbnail + Title & Description (Clickable to open Sheet) */}
      <div
        onClick={() => onOpenSheet && onOpenSheet(product)}
        className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0 cursor-pointer"
      >
        {/* Compact Square Thumbnail matching screenshot (Dark square with book/food icon) */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#12151B] border border-white/5 flex items-center justify-center shrink-0 text-[#475569] group-hover:text-[#00D2FF] group-hover:border-[#00D2FF]/30 transition-colors shadow-inner">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.25] text-[#334155] group-hover:text-[#00D2FF]/80 transition-colors" />
        </div>

        {/* Middle Column: Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-sm sm:text-base font-black text-white leading-snug group-hover:text-[#00D2FF] transition-colors truncate">
              {product.name[lang]}
            </h4>

            {isOutOfStock && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-1.5 py-0.2 rounded-md">
                <Ban className="w-2.5 h-2.5" />
                {lang === 'he' ? 'אזל מהמלאי' : 'Out of stock'}
              </span>
            )}
          </div>

          {product.description && product.description[lang] && (
            <p className="mt-0.5 text-xs text-[#64748B] leading-relaxed line-clamp-2">
              {product.description[lang]}
            </p>
          )}

          {product.kashrutNote && product.kashrutNote[lang] && (
            <span className="inline-block mt-0.5 text-[10px] font-medium text-[#00D2FF]/70">
              {product.kashrutNote[lang]}
            </span>
          )}
        </div>
      </div>

      {/* Left Column (in RTL): Price & Quantity Actions */}
      <div className="flex flex-col items-end justify-center gap-1.5 shrink-0 pl-1">
        {/* Bold Cyan Price strictly matching screenshot */}
        <div className="flex items-baseline gap-0.5">
          {product.price ? (
            <span className="text-base sm:text-lg font-black text-[#00D2FF] tracking-tight font-sans">
              ₪{product.price}
            </span>
          ) : (
            <span className="text-xs text-[#64748B]">
              {lang === 'he' ? 'לפי משקל' : 'Priced per item'}
            </span>
          )}
        </div>

        {/* Add / Quantity Controls */}
        {!isOutOfStock && (
          quantityInCart > 0 ? (
            <div className="flex items-center gap-1 bg-[#12151B] border border-[#00D2FF]/40 rounded-lg p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                className="w-5 h-5 rounded-md bg-[#1E232B] hover:bg-[#2A313C] text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                aria-label={lang === 'he' ? 'הפחת כמות' : 'Decrease quantity'}
              >
                <Minus className="w-2.5 h-2.5 text-[#FAF9F6]" />
              </button>

              <span className="w-4 text-center text-xs font-mono font-bold text-[#00D2FF]">
                {quantityInCart}
              </span>

              <button
                type="button"
                onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                className="w-5 h-5 rounded-md bg-[#00D2FF] hover:bg-[#38BDF8] text-[#0B0C0E] flex items-center justify-center transition-all active:scale-95 cursor-pointer font-bold"
                aria-label={lang === 'he' ? 'הוסף כמות' : 'Increase quantity'}
              >
                <Plus className="w-2.5 h-2.5 text-[#0B0C0E] stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141820] hover:bg-[#00D2FF] text-[#00D2FF] hover:text-[#0B0C0E] border border-[#00D2FF]/30 hover:border-[#00D2FF] text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
              aria-label={`${lang === 'he' ? 'הוסף' : 'Add'} ${product.name[lang]}`}
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span>{lang === 'he' ? 'הוספה' : 'Add'}</span>
            </button>
          )
        )}
      </div>
    </article>
  );
};
