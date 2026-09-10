import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, Language } from '../../types';
import { Plus, Minus } from 'lucide-react';

interface ProductQuantityButtonProps {
  product: MenuItem;
  lang: Language;
  quantityInCart: number;
  onAddToCart: (product: MenuItem) => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  className?: string;
  size?: 'normal' | 'compact';
  autoCollapseMs?: number;
}

export const ProductQuantityButton: React.FC<ProductQuantityButtonProps> = ({
  product,
  lang,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  className = '',
  size = 'normal',
  autoCollapseMs = 3000,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearCollapseTimer = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  };

  const startCollapseTimer = () => {
    clearCollapseTimer();
    if (autoCollapseMs > 0) {
      collapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
        collapseTimerRef.current = null;
      }, autoCollapseMs);
    }
  };

  // Clear timer on component unmount
  useEffect(() => {
    return () => {
      clearCollapseTimer();
    };
  }, []);

  // When quantity drops to 0, immediately collapse and cancel any pending timer
  useEffect(() => {
    if (quantityInCart <= 0) {
      clearCollapseTimer();
      setIsExpanded(false);
    }
  }, [quantityInCart]);

  const isCompact = size === 'compact';
  const isOutOfStock = product.availability === 'out_of_stock';

  if (isOutOfStock) return null;

  // Initial "+" click when quantity is 0: adds 1 to canonical cart, expands control, starts 3s timer
  const handleInitialPlus = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCollapseTimer();
    onAddToCart(product);
    setIsExpanded(true);
    startCollapseTimer();
  };

  // Clicking/tapping the quantity number when collapsed: re-expands control, keeps quantity, starts fresh 3s timer
  const handleTapQuantityNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCollapseTimer();
    setIsExpanded(true);
    startCollapseTimer();
  };

  // Clicking "+" when expanded: increments canonical cart quantity immediately, resets 3s timer
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCollapseTimer();
    const nextQty = Math.min(100, quantityInCart + 1);
    onUpdateQuantity(product.id, nextQty);
    setIsExpanded(true);
    startCollapseTimer();
  };

  // Clicking "−" when expanded: decrements canonical cart quantity immediately
  // If quantity reaches 0, collapses immediately to initial "+", does NOT show "0"
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCollapseTimer();
    if (quantityInCart <= 1) {
      onUpdateQuantity(product.id, 0);
      setIsExpanded(false);
    } else {
      onUpdateQuantity(product.id, quantityInCart - 1);
      setIsExpanded(true);
      startCollapseTimer();
    }
  };

  const isExpandedActive = isExpanded && quantityInCart > 0;

  return (
    <div
      dir="ltr"
      onClick={(e) => e.stopPropagation()}
      className={`absolute top-0 left-0 z-10 flex flex-row items-center bg-[#71D2F6] text-[#0B0C0E] rounded-none rounded-br-[18px] transition-[width] duration-250 ease-out overflow-hidden shadow-md select-none ${
        isCompact
          ? `h-[30px] sm:h-[32px] ${isExpandedActive ? 'w-[74px] sm:w-[78px]' : 'w-[30px] sm:w-[32px]'}`
          : `h-[32px] sm:h-[34px] ${isExpandedActive ? 'w-[78px] sm:w-[84px]' : 'w-[32px] sm:w-[34px]'}`
      } ${className}`}
    >
      {quantityInCart === 0 ? (
        /* INITIAL STATE: quantity = 0 -> only "+" button */
        <button
          type="button"
          onClick={handleInitialPlus}
          className="w-full h-full flex items-center justify-center text-[#0B0C0E] hover:bg-black/10 active:bg-black/25 transition-colors cursor-pointer"
          aria-label={`${lang === 'he' ? 'הוספה להזמנה' : 'Add to order'} ${product.name[lang]}`}
        >
          <Plus className={`${isCompact ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} stroke-[2.5]`} />
        </button>
      ) : !isExpandedActive ? (
        /* COLLAPSED STATE: quantity > 0 -> only current quantity number */
        <button
          type="button"
          onClick={handleTapQuantityNumber}
          className="w-full h-full flex items-center justify-center font-shop-body font-bold text-xs sm:text-[0.8125rem] text-[#0B0C0E] hover:bg-black/10 active:bg-black/25 transition-colors cursor-pointer select-none"
          aria-label={
            lang === 'he'
              ? `כמות בעגלה: ${quantityInCart}, לחץ לשינוי כמות`
              : `Cart quantity: ${quantityInCart}, click to edit`
          }
        >
          {quantityInCart}
        </button>
      ) : (
        /* EXPANDED STATE: + / quantity / − */
        <>
          {/* Left: Plus Button */}
          <button
            type="button"
            onClick={handleIncrement}
            className={`${
              isCompact ? 'w-[28px] sm:w-[30px] h-[30px] sm:h-[32px]' : 'w-[30px] sm:w-[32px] h-[32px] sm:h-[34px]'
            } shrink-0 flex items-center justify-center text-[#0B0C0E] hover:bg-black/10 active:bg-black/25 transition-colors cursor-pointer`}
            aria-label={lang === 'he' ? 'הוסף כמות' : 'Increase quantity'}
          >
            <Plus className={`${isCompact ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} stroke-[2.5]`} />
          </button>

          {/* Center: Current Quantity Number */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              startCollapseTimer();
            }}
            className={`${
              isCompact ? 'w-[20px] sm:w-[20px]' : 'w-[22px] sm:w-[24px]'
            } text-center font-shop-body font-bold text-xs sm:text-[0.8125rem] text-[#0B0C0E] shrink-0 select-none cursor-default`}
          >
            {quantityInCart}
          </span>

          {/* Right: Minus Button */}
          <button
            type="button"
            onClick={handleDecrement}
            className={`${
              isCompact ? 'w-[26px] sm:w-[28px] h-[30px] sm:h-[32px]' : 'w-[26px] sm:w-[28px] h-[32px] sm:h-[34px]'
            } shrink-0 flex items-center justify-center text-[#0B0C0E] hover:bg-black/10 active:bg-black/25 transition-colors cursor-pointer`}
            aria-label={lang === 'he' ? 'הפחת כמות' : 'Decrease quantity'}
          >
            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </>
      )}
    </div>
  );
};
