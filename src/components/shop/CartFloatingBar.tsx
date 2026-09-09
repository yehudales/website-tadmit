import React from 'react';
import { Language } from '../../types';

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
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:w-80 z-40 animate-fade-in-up select-none"
    >
      {/* Clean Horizontal Rectangular Bar with slight rounding, NO glow, NO shadow */}
      <button
        type="button"
        onClick={onOpenCart}
        dir={lang === 'he' ? 'rtl' : 'ltr'}
        className="w-full bg-[#71D2F6] hover:opacity-90 text-[#0B0C0E] py-2.5 px-3.5 rounded-lg flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
      >
        {/* Right side in RTL: Black circle with item count (no icon, no emoji) */}
        <div className="w-7 h-7 rounded-full bg-[#0B0C0E] text-white flex items-center justify-center text-xs font-bold shrink-0">
          {totalItems}
        </div>

        {/* Center: Action Title */}
        <div className="font-black text-sm sm:text-base tracking-tight text-[#0B0C0E]">
          {lang === 'he' ? 'הצגת פריטים' : 'View Items'}
        </div>

        {/* Left side in RTL: Total Price directly as plain text without any separate frame */}
        <div className="text-sm sm:text-base font-bold text-[#0B0C0E] shrink-0 font-sans">
          ₪{totalPrice}
        </div>
      </button>
    </aside>
  );
};
