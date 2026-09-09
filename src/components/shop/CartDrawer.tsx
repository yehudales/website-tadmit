import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Language, CartItem } from '../../types';
import { Plus, Minus, Trash2, ShoppingBag, Send, CheckCircle2, Clock, MapPin, Store } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../../config/businessConfig';
import { DownwardArrowNoTail } from './DownwardArrowNoTail';
import { motion } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totalPrice,
  totalItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  lang,
}) => {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isReadyToScroll, setIsReadyToScroll] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsReadyToScroll(false);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationComplete = () => {
    if (isClosing) {
      setIsClosing(false);
      setIsReadyToScroll(false);
      onClose();
    } else if (isOpen) {
      setIsReadyToScroll(true);
    }
  };

  const handleSendOrder = () => {
    setIsSubmitting(true);

    // Build structured order summary
    const typeLabel = orderType === 'pickup' ? 'איסוף עצמי (טייק אווי)' : 'משלוח ליל שישי';
    
    let message = `🍲 *הזמנה חדשה מ-YEHUDAL'ES .NET*\n`;
    message += `-------------------------\n`;
    if (customerName) message += `👤 *שם:* ${customerName}\n`;
    if (customerPhone) message += `📞 *טלפון:* ${customerPhone}\n`;
    message += `🛵 *סוג הזמנה:* ${typeLabel}\n\n`;
    message += `📋 *פירוט המנות:*\n`;

    items.forEach((item) => {
      message += `• ${item.quantity}x ${item.name[lang]} (₪${item.price * item.quantity})\n`;
    });

    message += `\n💰 *סה"כ לתשלום:* ₪${totalPrice}\n`;

    if (orderNotes.trim()) {
      message += `📝 *הערות מיוחדות:* ${orderNotes.trim()}\n`;
    }

    message += `-------------------------\n`;
    message += `תודה רבה!`;

    const whatsappUrl = getWhatsAppOrderUrl(message);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setIsSuccess(true);
    setIsSubmitting(false);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[var(--z-modal-overlay,60)] overflow-hidden select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.28 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Bottom-origin Banner / Bottom Sheet Container */}
      <motion.div
        dir={lang === 'he' ? 'rtl' : 'ltr'}
        initial={{ y: '100%' }}
        animate={{ y: isClosing ? '100%' : 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={handleAnimationComplete}
        className="fixed inset-x-0 bottom-0 max-w-lg mx-auto w-full max-h-[88vh] bg-[#0E1116] border-t border-[#1E232B] rounded-t-[28px] shadow-2xl flex flex-col z-10 overflow-hidden"
      >
        {/* Drag Handle Top Pill */}
        <div className="pt-2.5 pb-1 flex justify-center shrink-0">
          <span className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Drawer Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#1E232B] flex items-center justify-between bg-[#13161B] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#71D2F6]/10 border border-[#71D2F6]/30 text-[#71D2F6]">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#FAF9F6] tracking-tight">
                {lang === 'he' ? 'סיכום הזמנה' : 'Order Summary'}
              </h2>
              <span className="text-xs text-[#94A3B8]">
                {totalItems} {lang === 'he' ? 'פריטים בסל' : 'items in cart'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="p-2 rounded-xl text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-xs font-medium cursor-pointer"
                title={lang === 'he' ? 'רוקן סל' : 'Clear cart'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Close Control: Downward Arrow Without Tail */}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 sm:p-2.5 rounded-xl bg-[#1A1E26] hover:bg-[#252A34] text-[#94A3B8] hover:text-white transition-colors cursor-pointer flex items-center justify-center active:scale-95"
              aria-label={lang === 'he' ? 'סגור סל' : 'Close cart'}
            >
              <DownwardArrowNoTail className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body with controlled scrolling */}
        <div
          className={`flex-1 p-4 sm:p-5 space-y-5 ${
            isReadyToScroll && !isClosing ? 'overflow-y-auto' : 'overflow-hidden'
          }`}
        >
          {items.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#161A22] border border-[#252A32] flex items-center justify-center text-[#64748B] mb-3">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-[#FAF9F6]">
                {lang === 'he' ? 'הסל שלך ריק' : 'Your cart is empty'}
              </h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-xs">
                {lang === 'he'
                  ? 'הוסף מנות מהתפריט כדי להמשיך בהזמנה חמה ומובחרת'
                  : 'Add items from the menu to start your order'}
              </p>
            </div>
          ) : (
            <>
              {/* Order Type Tabs */}
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] mb-2">
                  {lang === 'he' ? 'אופן קבלת ההזמנה:' : 'Order Type:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      orderType === 'pickup'
                        ? 'bg-[#71D2F6]/10 text-[#71D2F6] border-[#71D2F6]'
                        : 'bg-[#13161B] text-[#94A3B8] border-[#252A32] hover:border-white/20'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>{lang === 'he' ? 'איסוף עצמי' : 'Self Pickup'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'bg-[#71D2F6]/10 text-[#71D2F6] border-[#71D2F6]'
                        : 'bg-[#13161B] text-[#94A3B8] border-[#252A32] hover:border-white/20'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{lang === 'he' ? 'משלוח ליל שישי' : 'Delivery'}</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-[#94A3B8]">
                  {lang === 'he' ? 'המנות שבחרת:' : 'Selected Items:'}
                </label>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#13161B] border border-[#1E232B] rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#FAF9F6] truncate">
                        {item.name[lang]}
                      </h4>
                      <div className="text-xs font-black text-[#71D2F6] mt-0.5">
                        ₪{item.price * item.quantity}
                        <span className="text-[10px] text-[#64748B] font-normal mr-1">
                          (₪{item.price} ליחידה)
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1 bg-[#1A1E26] border border-[#252A32] rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 rounded bg-[#202530] text-white flex items-center justify-center hover:bg-[#2A313C] transition-colors cursor-pointer"
                        aria-label="Decrease"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>

                      <span className="w-5 text-center text-xs font-mono font-bold text-[#71D2F6]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded bg-[#71D2F6] text-[#0B0C0E] flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer font-bold"
                        aria-label="Increase"
                      >
                        <Plus className="w-2.5 h-2.5 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Info Form */}
              <div className="space-y-2.5 pt-2 border-t border-[#1E232B]">
                <label className="block text-xs font-bold text-[#94A3B8]">
                  {lang === 'he' ? 'פרטי המזמין (אופציונלי):' : 'Customer Info (Optional):'}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={lang === 'he' ? 'שם מלא' : 'Full Name'}
                    className="w-full bg-[#13161B] border border-[#252A32] focus:border-[#71D2F6]/60 rounded-xl px-3 py-1.5 text-xs text-[#FAF9F6] placeholder-[#64748B] focus:outline-none"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={lang === 'he' ? 'מספר טלפון' : 'Phone'}
                    className="w-full bg-[#13161B] border border-[#252A32] focus:border-[#71D2F6]/60 rounded-xl px-3 py-1.5 text-xs text-[#FAF9F6] placeholder-[#64748B] focus:outline-none"
                  />
                </div>

                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={
                    lang === 'he'
                      ? 'הערות מיוחדות להזמנה (לדוגמה: תוספת חריף, ביצה חומה נוספת)...'
                      : 'Special requests (e.g. extra sauce, brown egg)...'
                  }
                  rows={2}
                  className="w-full bg-[#13161B] border border-[#252A32] focus:border-[#71D2F6]/60 rounded-xl px-3 py-1.5 text-xs text-[#FAF9F6] placeholder-[#64748B] focus:outline-none resize-none"
                />
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#13161B] border border-[#1E232B] rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>{lang === 'he' ? 'סיכום ביניים' : 'Subtotal'}</span>
                  <span className="text-[#86EFAC] font-normal font-sans">₪{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>{lang === 'he' ? 'אריזה ושירות' : 'Packaging & Service'}</span>
                  <span className="text-[#86EFAC] font-normal">{lang === 'he' ? 'חינם' : 'Free'}</span>
                </div>
                <div className="pt-2 border-t border-[#1E232B] flex items-center justify-between text-sm text-[#FAF9F6]">
                  <span className="font-normal">{lang === 'he' ? 'סה"כ לתשלום' : 'Total'}</span>
                  <span className="text-base text-[#86EFAC] font-normal font-sans">₪{totalPrice}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[#1E232B] bg-[#13161B] space-y-2">
            <button
              type="button"
              onClick={handleSendOrder}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#71D2F6] hover:opacity-90 active:scale-[0.98] text-[#0B0C0E] text-sm font-black transition-all shadow-[0_4px_20px_rgba(113,210,246,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'he' ? 'שליחת הזמנה ישירה' : 'Send Direct Order'}</span>
            </button>

            <p className="text-[10px] text-center text-[#64748B]">
              {lang === 'he'
                ? 'בלחיצה על הכפתור תועבר לסיכום ההזמנה המהיר של יהודלס'
                : 'Clicking will direct you to confirm your Yehudales feast'}
            </p>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};
