import React, { useState } from 'react';
import { MenuItem, Language } from '../../types';
import { X, Home, Share2, Plus, Minus, Utensils, Check } from 'lucide-react';
import { SAMPLE_MENU_ITEMS } from '../../config/businessConfig';

interface ProductSheetModalProps {
  product: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddToCart: (product: MenuItem, qty?: number) => void;
}

export const ProductSheetModal: React.FC<ProductSheetModalProps> = ({
  product,
  isOpen,
  onClose,
  lang,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [addedRecIds, setAddedRecIds] = useState<Record<string, boolean>>({});

  if (!isOpen || !product) return null;

  // Filter 2 recommended items from other products
  const recommendations = SAMPLE_MENU_ITEMS.filter((item) => item.id !== product.id).slice(0, 2);

  const handleAddMainProduct = () => {
    onAddToCart(product, quantity);
    onClose();
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
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Drawer matching Screenshot Reference exactly */}
      <div
        dir={lang === 'he' ? 'rtl' : 'ltr'}
        className="fixed inset-x-0 bottom-0 max-w-lg mx-auto bg-[#0B0C0E] border-t border-[#1E232B] rounded-t-[28px] shadow-2xl flex flex-col max-h-[92vh] z-10 animate-slide-in-up"
      >
        {/* TOP IMAGE AREA with Drag Handle & Overlaid Circular Controls */}
        <div className="relative w-full h-44 sm:h-52 bg-[#12151B] rounded-t-[28px] overflow-hidden shrink-0 border-b border-white/5">
          {/* Visual Background Pattern / Texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0B0C0E]" />

          {/* Dish Image / Icon Centered */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#181C24] border-2 border-white/10 flex items-center justify-center shadow-2xl text-[#00D2FF]/70">
              <Utensils className="w-12 h-12 stroke-[1.25]" />
            </div>
          </div>

          {/* Top Center Drag Handle */}
          <div className="absolute top-3 inset-x-0 flex justify-center z-20">
            <span className="w-10 h-1 rounded-full bg-white/40 shadow-sm" />
          </div>

          {/* Top Circular Buttons (Home & Close) Overlaid on Right in RTL */}
          <div className="absolute top-3 left-3 sm:left-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg"
              aria-label={lang === 'he' ? 'בית' : 'Home'}
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg"
              aria-label={lang === 'he' ? 'סגור' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* MAIN PRODUCT INFO: Title, Price & Share Action */}
          <div className="flex items-start justify-between gap-3 pt-1">
            {/* Title & Price on Right (RTL) */}
            <div className="space-y-1 text-right">
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight tracking-tight">
                {product.name[lang]}
              </h2>
              <div className="text-base sm:text-lg font-black text-[#00D2FF] font-sans">
                {product.price ? `₪${product.price}` : (lang === 'he' ? 'לפי משקל' : 'Priced per item')}
              </div>
              {product.description && product.description[lang] && (
                <p className="text-xs text-[#64748B] pt-1 leading-relaxed">
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
              className="w-10 h-10 rounded-full bg-[#13161C] border border-[#252A32] text-[#94A3B8] hover:text-[#00D2FF] hover:border-[#00D2FF]/40 flex items-center justify-center transition-all active:scale-95 shrink-0 cursor-pointer shadow-sm"
              title={lang === 'he' ? 'שתף' : 'Share'}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thin Separator Line */}
          <div className="w-full h-[1px] bg-[#1A1F28]" />

          {/* RECOMMENDATIONS SECTION "לקוחות קנו גם" */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs sm:text-sm font-black text-[#00D2FF] text-right tracking-tight">
              {lang === 'he' ? 'לקוחות קנו גם' : 'Customers also bought'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((rec) => {
                const isJustAdded = addedRecIds[rec.id];

                return (
                  <div
                    key={rec.id}
                    className="relative bg-[#12151B] border border-[#1E232B] hover:border-[#00D2FF]/30 rounded-2xl p-2.5 flex flex-col justify-between transition-all group overflow-hidden"
                  >
                    {/* Top Corner Cyan Quick-Add Badge */}
                    <button
                      type="button"
                      onClick={() => handleAddRecommendation(rec)}
                      className={`absolute top-0 right-0 z-10 w-8 h-8 rounded-tr-2xl rounded-bl-xl font-black flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer ${
                        isJustAdded
                          ? 'bg-[#10B981] text-white'
                          : 'bg-[#00D2FF] hover:bg-[#38BDF8] text-[#0B0C0E]'
                      }`}
                      aria-label={`${lang === 'he' ? 'הוסף' : 'Add'} ${rec.name[lang]}`}
                    >
                      {isJustAdded ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[3]" />
                      )}
                    </button>

                    {/* Media Thumbnail Container */}
                    <div className="w-full h-20 sm:h-24 bg-[#090A0C] rounded-xl flex items-center justify-center text-[#334155] mb-2 border border-white/5">
                      <Utensils className="w-6 h-6 stroke-[1.25] text-[#334155] group-hover:text-[#00D2FF]/60 transition-colors" />
                    </div>

                    {/* Recommendation Title & Price */}
                    <div className="text-right space-y-0.5">
                      <h4 className="text-xs font-bold text-white truncate">
                        {rec.name[lang]}
                      </h4>
                      <div className="text-xs font-black text-[#00D2FF] font-sans">
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
        <div className="p-4 bg-[#0B0C0E] border-t border-[#1E232B] flex items-center justify-between gap-3 shrink-0">
          {/* Large Cyan Pill CTA Button */}
          <button
            type="button"
            onClick={handleAddMainProduct}
            className="flex-1 py-3 px-5 rounded-full bg-[#00D2FF] hover:bg-[#38BDF8] text-[#0B0C0E] text-sm sm:text-base font-black transition-all active:scale-[0.98] cursor-pointer shadow-[0_4px_25px_rgba(0,210,255,0.35)] flex items-center justify-center gap-2"
          >
            <span>
              {lang === 'he'
                ? `הוסף לעגלה — ₪${totalPrice}`
                : `Add to order — ₪${totalPrice}`}
            </span>
          </button>

          {/* Compact Dark Quantity Capsule [ - ] 1 [ + ] */}
          <div className="flex items-center justify-between gap-2.5 bg-[#13171E] border border-[#252A32] rounded-full px-3 py-2 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-6 h-6 rounded-full bg-[#1E232C] hover:bg-[#282F3B] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
              aria-label={lang === 'he' ? 'הפחת כמות' : 'Decrease quantity'}
            >
              <Minus className="w-3 h-3 text-[#FAF9F6]" />
            </button>

            <span className="text-sm font-black font-mono text-white w-4 text-center">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-6 h-6 rounded-full bg-[#1E232C] hover:bg-[#282F3B] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
              aria-label={lang === 'he' ? 'הוסף כמות' : 'Increase quantity'}
            >
              <Plus className="w-3 h-3 text-[#FAF9F6]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
