import React from 'react';
import { Language } from '../../types';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

interface CartFloatingBarProps {
  lang: Language;
  totalItems: number;
  totalPrice: number;
  onOpenCart: () => void;
}

export const CartFloatingBar: React.FC<CartFloatingBarProps> = ({
  lang,
  totalItems,
  totalPrice,
  onOpenCart,
}) => {
  if (totalItems <= 0) return null;

  return (
    <aside
      id="cart-floating-bar"
      aria-label={lang === 'he' ? 'סרגל הזמנה צף' : 'Floating cart bar'}
      className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 animate-fade-in-up"
    >
      <button
        type="button"
        onClick={onOpenCart}
        dir={lang === 'he' ? 'rtl' : 'ltr'}
        className="w-full bg-[#0E1116]/95 hover:bg-[#151922] backdrop-blur-md border border-[#00D2FF]/50 hover:border-[#00D2FF] text-[#FAF9F6] p-3 sm:p-3.5 rounded-2xl shadow-[0_8px_30px_rgba(0,210,255,0.2)] flex items-center justify-between gap-3 transition-all active:scale-[0.98] cursor-pointer group"
      >
        {/* Total Items & Price Badge */}
        <div className="flex items-center gap-2.5">
          <div className="relative p-2 rounded-xl bg-[#00D2FF] text-[#0B0C0E] font-black flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 bg-[#FF7B1C] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-[#0B0C0E]">
              {totalItems}
            </span>
          </div>

          <div className="text-right">
            <div className="text-xs font-medium text-[#94A3B8]">
              {lang === 'he' ? `${totalItems} פריטים בהזמנה` : `${totalItems} items in order`}
            </div>
            <div className="text-base sm:text-lg font-black text-[#00D2FF] tracking-tight">
              ₪{totalPrice}
            </div>
          </div>
        </div>

        {/* Action Button Label with Directional Arrow */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00D2FF] group-hover:bg-[#38BDF8] text-[#0B0C0E] text-xs sm:text-sm font-black transition-colors shadow-sm">
          <span>{lang === 'he' ? 'לצפייה בהזמנה' : 'View Order'}</span>
          {lang === 'he' ? (
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          )}
        </div>
      </button>
    </aside>
  );
};
