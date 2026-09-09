import React from 'react';
import { Language } from '../../types';
import { ShoppingBag } from 'lucide-react';

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
      {/* Vibrant Cyan Pill Button strictly matching Screenshot 1 */}
      <button
        type="button"
        onClick={onOpenCart}
        dir={lang === 'he' ? 'rtl' : 'ltr'}
        className="w-full bg-[#00D2FF] hover:bg-[#38BDF8] text-[#0B0C0E] py-3 px-5 rounded-full shadow-[0_8px_30px_rgba(0,210,255,0.4)] flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer group"
      >
        {/* Shopping Bag Icon on Right (in RTL) */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#00A2C7]/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-[#0B0C0E] stroke-[2.5]" />
          </div>
        </div>

        {/* Action Title in Center */}
        <div className="font-black text-sm sm:text-base tracking-tight text-[#0B0C0E]">
          {lang === 'he' ? `צפייה בפרטים (${totalItems})` : `View Order (${totalItems})`}
        </div>

        {/* Total Price on Left (in RTL) */}
        <div className="font-black text-sm sm:text-base tracking-tight text-[#0B0C0E] font-sans">
          ₪{totalPrice}
        </div>
      </button>
    </aside>
  );
};
