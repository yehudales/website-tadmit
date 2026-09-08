import React from 'react';
import { MenuItem, Language } from '../../types';
import { Plus, Minus, Check, UtensilsCrossed, Soup, Ban } from 'lucide-react';

interface ShopProductItemProps {
  product: MenuItem;
  lang: Language;
  quantityInCart: number;
  onAddToCart: (product: MenuItem) => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
}

export const ShopProductItem: React.FC<ShopProductItemProps> = ({
  product,
  lang,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const isOutOfStock = product.availability === 'out_of_stock';

  return (
    <article
      id={`product-${product.id}`}
      dir={lang === 'he' ? 'rtl' : 'ltr'}
      className="group bg-[#0E1116] hover:bg-[#13171E] border border-[#1E232B] hover:border-[#2A313C] rounded-2xl p-3 sm:p-3.5 transition-all duration-200 shadow-sm flex items-center justify-between gap-3 sm:gap-4"
    >
      {/* Right Column (in RTL): Thumbnail Box + Title & Description */}
      <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
        {/* Compact Square Thumbnail / Food Icon Box matching screenshot */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#161A22] border border-[#252A32] flex items-center justify-center shrink-0 text-[#64748B] group-hover:text-[#00D2FF] group-hover:border-[#00D2FF]/30 transition-colors">
          {product.category === 'cholent' ? (
            <Soup className="w-6 h-6 stroke-[1.5]" />
          ) : (
            <UtensilsCrossed className="w-6 h-6 stroke-[1.5]" />
          )}
        </div>

        {/* Middle Column: Title & Ingredients / Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-sm sm:text-base font-bold text-[#FAF9F6] leading-snug group-hover:text-[#00D2FF] transition-colors truncate">
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
            <p className="mt-0.5 text-xs text-[#717F94] leading-relaxed line-clamp-2">
              {product.description[lang]}
            </p>
          )}

          {product.kashrutNote && product.kashrutNote[lang] && (
            <span className="inline-block mt-0.5 text-[10px] font-medium text-[#4ADE80]">
              {product.kashrutNote[lang]}
            </span>
          )}
        </div>
      </div>

      {/* Left Column (in RTL): Price & Add to Cart Action */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        {/* Price matching screenshot (Cyan bold font) */}
        <div className="flex items-baseline gap-0.5">
          {product.price ? (
            <span className="text-base sm:text-lg font-black text-[#00D2FF] tracking-tight">
              ₪{product.price}
            </span>
          ) : (
            <span className="text-xs text-[#64748B]">
              {lang === 'he' ? 'לפי משקל' : 'Priced per item'}
            </span>
          )}
        </div>

        {/* Add to Cart / Quantity Selector */}
        {isOutOfStock ? (
          <button
            type="button"
            disabled
            className="px-2.5 py-1 rounded-lg bg-[#161A22] text-[#475569] text-xs font-medium cursor-not-allowed border border-[#252A32]"
          >
            {lang === 'he' ? 'לא זמין' : 'Unavailable'}
          </button>
        ) : quantityInCart > 0 ? (
          <div className="flex items-center gap-1 bg-[#161A22] border border-[#00D2FF]/40 rounded-xl p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
              className="w-6 h-6 rounded-lg bg-[#202530] hover:bg-[#2A313C] text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              aria-label={lang === 'he' ? 'הפחת כמות' : 'Decrease quantity'}
            >
              <Minus className="w-3 h-3 text-[#FAF9F6]" />
            </button>

            <span className="w-6 text-center text-xs font-mono font-bold text-[#00D2FF]">
              {quantityInCart}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
              className="w-6 h-6 rounded-lg bg-[#00D2FF] hover:bg-[#38BDF8] text-[#0B0C0E] flex items-center justify-center transition-all active:scale-95 cursor-pointer font-bold"
              aria-label={lang === 'he' ? 'הוסף כמות' : 'Increase quantity'}
            >
              <Plus className="w-3 h-3 text-[#0B0C0E] stroke-[3]" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#161A22] hover:bg-[#00D2FF] text-[#00D2FF] hover:text-[#0B0C0E] border border-[#00D2FF]/40 hover:border-[#00D2FF] text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow-[0_2px_10px_rgba(0,210,255,0.3)]"
            aria-label={`${lang === 'he' ? 'הוסף להזמנה את' : 'Add to order'} ${product.name[lang]}`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{lang === 'he' ? 'הוספה' : 'Add'}</span>
          </button>
        )}
      </div>
    </article>
  );
};

