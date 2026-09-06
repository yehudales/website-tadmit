import React, { useEffect, useRef } from 'react';
import { X, CheckCircle2, ShieldCheck, Mail, Phone } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl my-8 rounded-2xl bg-[#1A1D22] border border-[#252A32] p-5 sm:p-7 md:p-8 shadow-2xl text-[#FAF9F6] max-h-[90vh] overflow-y-auto"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label={lang === 'he' ? 'סגור הצהרת נגישות' : 'Close accessibility statement'}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-auto ltr:right-4 rtl:left-4 min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-[#94A3B8] hover:text-[#FAF9F6] hover:bg-[#0B0C0E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BE55]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#0B0C0E] text-[#E0BE55] border border-[#252A32] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 id="accessibility-modal-title" className="text-xl md:text-2xl font-bold text-[#FAF9F6]">
              {lang === 'he' ? 'הצהרת נגישות' : 'Accessibility Statement'}
            </h2>
            <span className="text-xs text-[#94A3B8]">
              {lang === 'he' ? 'עדכון אחרון: מרץ 2025' : 'Last updated: March 2025'}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-normal">
          <p>
            {lang === 'he'
              ? 'עסק "יהודלס" מייחס חשיבות עליונה להנגשת שירותיו ואתר האינטרנט לכלל האוכלוסייה, לרבות אנשים עם מוגבלות. אנו שואפים לאפשר לכל אדם לגלוש בנוחות, ליהנות מהתכנים ולבצע הזמנות באופן שוויוני, מכובד ועצמאי.'
              : 'Yehudales places supreme importance on ensuring its services and website are accessible to all individuals, including people with disabilities. We strive to provide an equitable, dignified, and independent digital experience.'}
          </p>

          <h3 className="text-base font-bold text-[#FAF9F6] pt-2">
            {lang === 'he' ? 'התאמות הנגישות שבוצעו באתר' : 'Digital Accessibility Measures'}
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-[#FAF9F6]">
                {lang === 'he'
                  ? 'עמידה בהנחיות תקן הנגישות WCAG 2.2 ברמת AA.'
                  : 'Targeted compliance with WCAG 2.2 Level AA guidelines.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-[#FAF9F6]">
                {lang === 'he'
                  ? 'תמיכה מלאה בניווט מקלדת, לרבות סדר מיקוד לוגי וחיווי ויזואלי ברור.'
                  : 'Full keyboard navigation support, logical focus order, and visible focus indicators.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-[#FAF9F6]">
                {lang === 'he'
                  ? 'מבנה סמנטי של כותרות, תגיות ARIA וטקסט אלטרנטיבי לתמונות.'
                  : 'Semantic HTML5 structure, ARIA landmarks, and descriptive alternative texts.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-[#FAF9F6]">
                {lang === 'he'
                  ? 'התאמה מלאה לקוראי מסך ותמיכה מובנית בשפות עברית (RTL) ואנגלית.'
                  : 'Optimized for screen readers with native RTL Hebrew and English support.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-[#FAF9F6]">
                {lang === 'he'
                  ? 'יחסי ניגודיות צבעים (Contrast) מחמירים בהתאם להנחיות.'
                  : 'Strict color contrast ratios for effortless legibility across all screens.'}
              </span>
            </li>
          </ul>

          <h3 className="text-base font-bold text-[#FAF9F6] pt-2">
            {lang === 'he' ? 'הסדרי נגישות פיזיים (איסוף ומשלוחים)' : 'Physical Service Arrangements'}
          </h3>
          <p>
            {lang === 'he'
              ? `העסק פועל במתכונת Takeaway ואיסוף עצמי בלבד (ללא מקומות ישיבה), ברחוב ${BUSINESS_CONFIG.location.address.he}. הזמנות מתבצעות בנוחות מרחוק באמצעות פנייה ישירה ב-WhatsApp או בסיוע טלפוני אישי.`
              : `The business operates as a takeaway and self-pickup venue (no sit-down dining), located at ${BUSINESS_CONFIG.location.address.en}. Orders can be placed smoothly via direct WhatsApp messages or with personal phone assistance.`}
          </p>

          <div className="bg-[#0B0C0E] rounded-xl p-4 sm:p-5 border border-[#252A32] mt-4">
            <h4 className="text-sm font-bold text-[#FAF9F6] mb-2">
              {lang === 'he' ? 'רכז נגישות ופניות בנושא נגישות' : 'Accessibility Coordinator Contact'}
            </h4>
            <p className="text-xs text-[#94A3B8] mb-3">
              {lang === 'he'
                ? 'אם נתקלתם בבעיית נגישות או שיש לכם הצעה לשיפור, נשמח לעמוד לרשותכם:'
                : 'If you encountered an accessibility barrier or have suggestions for improvement, please contact us:'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-xs font-semibold">
              <a
                href={`tel:${BUSINESS_CONFIG.contact.phone}`}
                className="inline-flex items-center gap-1.5 text-[#FAF9F6] hover:text-[#E0BE55] hover:underline min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-[#E0BE55]" />
                {BUSINESS_CONFIG.contact.phoneFormatted}
              </a>
              <a
                href={`mailto:${BUSINESS_CONFIG.contact.email}`}
                className="inline-flex items-center gap-1.5 text-[#FAF9F6] hover:text-[#E0BE55] hover:underline min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-[#E0BE55]" />
                {BUSINESS_CONFIG.contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
