import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Language, CartItem } from '../../types';
import { Plus, Minus, Trash2, ShoppingBag, Send, CheckCircle2, Clock, MapPin, Store } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../../config/businessConfig';
import { DownwardArrowNoTail } from './DownwardArrowNoTail';
import { motion } from 'motion/react';
import { getOverlayRoot } from '../../utils/overlayRoot';

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
  const [paymentMethod, setPaymentMethod] = useState<'cash_or_bit' | 'bit'>('cash_or_bit');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isReadyToScroll, setIsReadyToScroll] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);

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
      if (isSuccess) {
        setIsSuccess(false);
      }
      onClose();
    } else if (isOpen) {
      setIsReadyToScroll(true);
    }
  };

  const handleSendOrder = () => {
    setIsSubmitting(true);

    // Build structured order summary
    const typeLabel = orderType === 'pickup' ? 'איסוף עצמי (טייק אווי)' : 'משלוח ליל שישי';
    const paymentLabel = paymentMethod === 'bit' ? 'ביט (Bit)' : 'מזומן / ביט בעת המסירה';
    
    let message = `🍲 *הזמנה חדשה מ-YEHUDAL'ES .NET*\n`;
    message += `-------------------------\n`;
    if (customerName) message += `👤 *שם:* ${customerName}\n`;
    if (customerPhone) message += `📞 *טלפון:* ${customerPhone}\n`;
    message += `🛵 *סוג הזמנה:* ${typeLabel}\n`;
    message += `💳 *אמצעי תשלום:* ${paymentLabel}\n\n`;
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
    <div
      id="cart-drawer-modal-portal"
      className="fixed inset-0 overflow-hidden select-none pointer-events-auto z-[60] font-shop shop-scope"
      style={{ zIndex: 'var(--z-modal-overlay, 60)' }}
    >
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
        className="fixed inset-x-0 bottom-0 max-w-lg mx-auto w-full max-h-[88vh] bg-[#0E1116] border-t border-[#1E232B] rounded-t-[28px] shadow-2xl flex flex-col z-10 overflow-hidden font-shop shop-scope"
      >
        {/* Drag Handle Top Pill */}
        <div className="pt-2.5 pb-1 flex justify-center shrink-0">
          <span className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Drawer Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#1E232B] flex items-center justify-between bg-[#13161B] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#71D2F6]/10 border border-[#71D2F6]/30 text-[#71D2F6]">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#FAF9F6] tracking-tight">
                {isSuccess
                  ? (lang === 'he' ? 'אישור הזמנה' : 'Order Confirmation')
                  : (lang === 'he' ? 'סיכום הזמנה' : 'Order Summary')}
              </h2>
              <span className="text-xs text-[#94A3B8]">
                {isSuccess
                  ? (lang === 'he' ? 'ההזמנה בטיפול' : 'Order In Progress')
                  : `${totalItems} ${lang === 'he' ? 'פריטים בסל' : 'items in cart'}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSuccess && items.length > 0 && (
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
          {isSuccess ? (
            /* ==========================================================
               ORDER CONFIRMATION & ORDER STATUS SCREEN
               ========================================================== */
            <div className="space-y-4 py-2">
              {/* Order Status Badge */}
              <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 mx-auto flex items-center justify-center text-[#10B981]">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'he' ? 'ההזמנה נשלחה בהצלחה ב-WhatsApp!' : 'Order Sent via WhatsApp!'}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13161B] border border-white/10 text-xs font-semibold text-[#86EFAC]">
                  <Clock className="w-3.5 h-3.5 text-[#71D2F6]" />
                  <span>{lang === 'he' ? 'סטטוס הזמנה: בטיפול מול בית העסק' : 'Order Status: Processing by store'}</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed pt-1">
                  {lang === 'he'
                    ? "נציג יהודל'ס יאשר את פרטי ההזמנה, זמני המסירה וחישוב הסל ישירות בצ'אט ה-WhatsApp שנפתח מולך."
                    : 'A Yehudales representative will confirm your order details and delivery window directly on WhatsApp.'}
                </p>
              </div>

              {/* Collapsible / Expandable Order Details "צפייה בפרטי ההזמנה" */}
              <div className="bg-[#13161B] border border-[#1E232B] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsDetailsExpanded((prev) => !prev)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-[#171B22] text-right font-bold text-xs sm:text-sm text-[#FAF9F6] hover:bg-[#1E232C] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#71D2F6]" />
                    <span>{lang === 'he' ? 'צפייה בפרטי ההזמנה' : 'View Order Details'}</span>
                  </span>
                  <span className="text-xs text-[#71D2F6] font-medium">
                    {isDetailsExpanded
                      ? (lang === 'he' ? 'הסתר פרטים' : 'Hide')
                      : (lang === 'he' ? 'הצג פרטים' : 'Show')}
                  </span>
                </button>

                {isDetailsExpanded && (
                  <div className="p-4 space-y-3 text-xs border-t border-[#1E232B]">
                    {/* Customer Info */}
                    <div className="space-y-1 pb-2 border-b border-white/5">
                      <div className="text-[#94A3B8] font-bold">
                        {lang === 'he' ? 'פרטי לקוח:' : 'Customer Details:'}
                      </div>
                      <div className="text-[#FAF9F6]">
                        {customerName ? customerName : (lang === 'he' ? 'הוזמן ללא שם' : 'Anonymous')}{' '}
                        {customerPhone && `• ${customerPhone}`}
                      </div>
                    </div>

                    {/* Delivery / Pickup */}
                    <div className="space-y-1 pb-2 border-b border-white/5">
                      <div className="text-[#94A3B8] font-bold">
                        {lang === 'he' ? 'אופן קבלת ההזמנה:' : 'Fulfillment:'}
                      </div>
                      <div className="text-[#FAF9F6]">
                        {orderType === 'pickup'
                          ? (lang === 'he' ? 'איסוף עצמי (טייק אווי)' : 'Self Pickup')
                          : (lang === 'he' ? 'משלוח ליל שישי' : 'Friday Night Delivery')}
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-1 pb-2 border-b border-white/5">
                      <div className="text-[#94A3B8] font-bold">
                        {lang === 'he' ? 'פרטי תשלום:' : 'Payment Details:'}
                      </div>
                      <div className="text-[#FAF9F6]">
                        {lang === 'he' ? 'מזומן / ביט בעת המסירה' : 'Cash or Bit on delivery'}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 pb-2 border-b border-white/5">
                      <div className="text-[#94A3B8] font-bold">
                        {lang === 'he' ? 'סיכום פריטים:' : 'Ordered Items:'}
                      </div>
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-[#FAF9F6]">
                          <span>{item.quantity}x {item.name[lang]}</span>
                          <span className="text-[#71D2F6] font-bold">₪{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="pt-1 flex justify-between items-center text-sm font-bold text-white">
                      <span>{lang === 'he' ? 'סה"כ לתשלום:' : 'Total:'}</span>
                      <span className="text-[#86EFAC]">₪{totalPrice}</span>
                    </div>
                  </div>
                )}
              </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSendOrder}
                    className="w-full py-3 rounded-xl bg-[#71D2F6] hover:opacity-90 text-[#0B0C0E] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{lang === 'he' ? 'פתח שוב ב-WhatsApp' : 'Open WhatsApp Again'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClearCart();
                      handleClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#1A1E26] hover:bg-[#252A34] text-white text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span>{lang === 'he' ? 'חזרה לתפריט והמשך הזמנה' : 'Back to Menu'}</span>
                  </button>
                </div>
            </div>
          ) : items.length === 0 ? (
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
              {/* Order Type Tabs (Delivery / Pickup Details) */}
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

                      <span className="w-5 text-center text-xs font-bold text-[#71D2F6]">
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

              {/* Payment Section */}
              <div className="space-y-2 pt-2 border-t border-[#1E232B]">
                <label className="block text-xs font-bold text-[#94A3B8]">
                  {lang === 'he' ? 'אמצעי תשלום:' : 'Payment Method:'}
                </label>

                <div className="p-2.5 rounded-xl bg-[#13161B] border border-[#252A32] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#86EFAC]" />
                    <span className="text-[#FAF9F6] font-medium">
                      {lang === 'he' ? 'מזומן / ביט (Bit) בעת המסירה' : 'Cash / Bit on delivery'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#71D2F6] font-bold">
                    {lang === 'he' ? 'מאובטח' : 'Secure'}
                  </span>
                </div>
              </div>

              {/* Price Breakdown / Order Summary */}
              <div className="bg-[#13161B] border border-[#1E232B] rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>{lang === 'he' ? 'סיכום ביניים' : 'Subtotal'}</span>
                  <span className="text-[#86EFAC] font-normal">₪{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>{lang === 'he' ? 'אריזה ושירות' : 'Packaging & Service'}</span>
                  <span className="text-[#86EFAC] font-normal">{lang === 'he' ? 'חינם' : 'Free'}</span>
                </div>
                <div className="pt-2 border-t border-[#1E232B] flex items-center justify-between text-sm text-[#FAF9F6]">
                  <span className="font-normal">{lang === 'he' ? 'סה"כ לתשלום' : 'Total'}</span>
                  <span className="text-base text-[#86EFAC] font-normal">₪{totalPrice}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer / Checkout CTA "שלח הזמנה" */}
        {!isSuccess && items.length > 0 && (
          <div className="p-4 border-t border-[#1E232B] bg-[#13161B] space-y-2">
            <button
              type="button"
              onClick={handleSendOrder}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#71D2F6] hover:opacity-90 active:scale-[0.98] text-[#0B0C0E] text-sm font-black transition-all shadow-[0_4px_20px_rgba(113,210,246,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'he' ? 'שלח הזמנה' : 'Send Order'}</span>
            </button>

            <p className="text-[11px] text-center text-[#94A3B8]">
              {lang === 'he'
                ? 'בלחיצה על "שלח הזמנה" תועבר לסיכום מהיר ב-WhatsApp לאישור מול בית העסק'
                : 'Clicking "Send Order" will connect you to WhatsApp for instant confirmation'}
            </p>
          </div>
        )}
      </motion.div>
    </div>,
    getOverlayRoot()
  );
};
