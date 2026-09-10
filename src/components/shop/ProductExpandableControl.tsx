import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem, Language } from '../../types';

export interface ProductExpandableControlProps {
  product: MenuItem;
  lang: Language;
  quantityInCart: number;
  onAddToCart: (product: MenuItem) => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  position?: 'top-left' | 'top-right';
}

export const ProductExpandableControl: React.FC<ProductExpandableControlProps> = ({
  product,
  lang,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  position = 'top-left',
}) => {
  const isOutOfStock = product.isOutOfStock;
  if (isOutOfStock) return null;

  const isTopRight = position === 'top-right';

  return (
    <div
      dir="ltr"
      className={`absolute top-0 ${
        isTopRight
          ? 'right-0 rounded-none rounded-bl-[18px] flex-row-reverse'
          : 'left-0 rounded-none rounded-br-[18px] flex-row'
      } z-10 h-[32px] sm:h-[34px] flex items-center bg-[#71D2F6] text-[#0B0C0E] transition-[width] duration-250 ease-out overflow-hidden shadow-md ${
        quantityInCart > 0 ? 'w-[78px] sm:w-[84px]' : 'w-[32px] sm:w-[34px]'
      }`}
    >
      {/* Plus Button (Stationary at the corner: left:0 for top-left, right:0 for top-right) */}
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

      {/* Center QUANTITY */}
      <span
        className={`w-[20px] sm:w-[22px] text-center font-shop-body font-bold text-xs sm:text-[0.8125rem] text-[#0B0C0E] shrink-0 transition-opacity duration-200 select-none ${
          quantityInCart > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {quantityInCart}
      </span>

      {/* MINUS Button */}
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
  );
};
