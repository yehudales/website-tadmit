import React, { useState, useEffect, useRef } from 'react';
import { MenuItem, Language } from '../../types';
import { X, Share2, Plus, Minus, Utensils, Check } from 'lucide-react';
import { SAMPLE_MENU_ITEMS } from '../../config/businessConfig';
import { motion } from 'motion/react';

interface ProductSheetModalProps {
  product: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddToCart: (product: MenuItem, qty?: number) => void;
}

type SheetStage = 'stage1' | 'stage2' | 'complete';

export const ProductSheetModal: React.FC<ProductSheetModalProps> = ({
  product,
  isOpen,
  onClose,
  lang,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [addedRecIds, setAddedRecIds] = useState<Record<string, boolean>>({});
  const [stage, setStage] = useState<SheetStage>('stage1');
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const stageTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen || !product) {
      setStage('stage1');
      setIsClosing(false);
      return;
    }

    setStage('stage1');
    setIsClosing(false);
    setQuantity(1);

    // Stage 1 initial expansion (~380ms) + exactly 1 second hold (1000ms) = 1380ms
    stageTimerRef.current = window.setTimeout(() => {
      setStage('stage2');
    }, 1380);

    return () => {
      if (stageTimerRef.current) {
        window.clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
    };
  }, [isOpen, product?.id]);

  if (!isOpen && !isClosing) return null;
  if (!product) return null;

  const handleClose = () => {
    if (stageTimerRef.current) {
      window.clearTimeout(stageTimerRef.current);
      stageTimerRef.current = null;
    }
    setIsClosing(true);
  };

  const handleAnimationComplete = () => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    } else if (stage === 'stage2') {
      setStage('complete');
    }
  };

  // Filter 2 recommended items from other products
  const recommendations = SAMPLE_MENU_ITEMS.filter((item) => item.id !== product.id).slice(0, 2);

  const handleAddMainProduct = () => {
    onAddToCart(product, quantity);
    handleClose();
  };

  const handleAddRecommendation = (rec: MenuItem) => {
    onAddToCart(rec, 1);
    setAddedRecIds((prev) => ({ ...prev, [rec.id]: true }));
    setTimeout(() => {
      setAddedRecIds((prev) => ({ ...prev, [rec.id]: false }));
    }, 1500);
  };

  const totalPrice = (product.price || 0) * quantity;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Dark Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.28 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Two-Stage Bottom Sheet Modal */}
      <motion.div
        dir={lang === 'he' ? 'rtl' : 'ltr'}
        initial={{ y: '100%', height: '68vh' }}
        animate={{
          y: isClosing ? '100%' : 0,
          height: stage === 'stage1' ? '68vh' : '92vh',
        }}
        transition={{
          y: { duration: isClosing ? 0.28 : 0.38, ease: [0.16, 1, 0.3, 1] },
          height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        }}
        onAnimationComplete={handleAnimationComplete}
        className="fixed inset-x-0 bottom-0 max-w-lg mx-auto bg-[#0B0C0E] border-t border-[#1E232B] rounded-t-[28px] shadow-2xl flex flex-col z-10 overflow-hidden"
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

          {/* Top Center Drag Handle */}
          <div className="absolute top-3 inset-x-0 flex justify-center z-20 pointer-events-none">
            <span className="w-10 h-1 rounded-full bg-white/40 shadow-sm" />
          </div>

          {/* Compact Close "X" Button on the exact top-left corner of the product image */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-30 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-black/65 hover:bg-black/90 active:scale-95 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md"
            aria-label={lang === 'he' ? 'סגור מוצר' : 'Close product'}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Content Body (Locked to overflow-hidden until Stage 2 completes) */}
        <div
          className={`flex-1 px-5 py-4 space-y-4 ${
            stage === 'complete' && !isClosing ? 'overflow-y-auto' : 'overflow-hidden'
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
                {product.price ? `₪${product.price}` : (lang === 'he' ? 'לפי משקל' : 'Priced per item')}
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
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.name[lang],
                    url: window.location.href,
                  }).catch(() => {});
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
                const isJustAdded = addedRecIds[rec.id];

                return (
                  <div
                    key={rec.id}
                    className="relative bg-[#12151B] border border-white/10 hover:border-[#71D2F6]/30 rounded-xl p-2.5 flex flex-col justify-between transition-all group overflow-hidden"
                  >
                    {/* Top Corner Cyan Quick-Add Badge */}
                    <button
                      type="button"
                      onClick={() => handleAddRecommendation(rec)}
                      className={`absolute top-0 right-0 z-10 w-7 h-7 rounded-tr-xl rounded-bl-lg font-bold flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer ${
                        isJustAdded
                          ? 'bg-[#10B981] text-white'
                          : 'bg-[#71D2F6] hover:opacity-90 text-[#0B0C0E]'
                      }`}
                      aria-label={`${lang === 'he' ? 'הוסף' : 'Add'} ${rec.name[lang]}`}
                    >
                      {isJustAdded ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </button>

                    {/* Media Thumbnail Container */}
                    <div className="w-full h-20 bg-[#090A0C] rounded-lg flex items-center justify-center text-[#334155] mb-2 border border-white/5">
                      <Utensils className="w-6 h-6 stroke-[1.25] text-[#334155] group-hover:text-[#71D2F6]/60 transition-colors" />
                    </div>

                    {/* Recommendation Title & Price */}
                    <div className="text-right space-y-0.5">
                      <h4 className="font-shop-body text-[0.875rem] font-medium text-white truncate">
                        {rec.name[lang]}
                      </h4>
                      <div className="font-shop-body text-[0.8125rem] font-semibold text-[#71D2F6]">
                        ₪{rec.price}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FIXED BOTTOM ACTION BAR matching Screenshot Reference */}
        <div className="p-3 sm:p-4 bg-[#0B0C0E] border-t border-white/[0.12] flex items-center justify-between gap-3 shrink-0">
          {/* Large Cyan CTA Button with exact same corner geometry (rounded-lg) as "הצגת פריטים" */}
          <button
            type="button"
            onClick={handleAddMainProduct}
            className="flex-1 h-12 py-2.5 px-5 rounded-lg bg-[#71D2F6] hover:opacity-90 text-[#0B0C0E] font-shop-body text-[0.9375rem] sm:text-[1rem] font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-[0_4px_25px_rgba(113,210,246,0.35)] flex items-center justify-center gap-2"
          >
            <span>
              {lang === 'he'
                ? (product.price ? `הוסף לעגלה — ₪${totalPrice}` : 'הוסף לעגלה')
                : (product.price ? `Add to order — ₪${totalPrice}` : 'Add to order')}
            </span>
          </button>

          {/* Compact Dark Quantity Capsule [ - ] 1 [ + ] */}
          <div className="h-10 flex items-center justify-between gap-2.5 bg-[#13171E] border border-white/10 rounded-full px-3 py-1 shrink-0">
            <button
              type="button"
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
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-full bg-[#1E232C] hover:bg-[#282F3B] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
              aria-label={lang === 'he' ? 'הוסף כמות' : 'Increase quantity'}
            >
              <Plus className="w-3 h-3 text-[#FAF9F6]" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
