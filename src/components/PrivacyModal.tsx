import React, { useEffect, useRef } from 'react';
import { X, Lock, CheckCircle2 } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { Language } from '../types';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
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
      aria-labelledby="privacy-modal-title"
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
          aria-label={lang === 'he' ? 'סגור מדיניות פרטיות' : 'Close privacy policy'}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-auto ltr:right-4 rtl:left-4 min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-[#94A3B8] hover:text-[#FAF9F6] hover:bg-[#0B0C0E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#0B0C0E] text-[#FF7B1C] border border-[#252A32] flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 id="privacy-modal-title" className="text-xl md:text-2xl font-bold text-[#FAF9F6]">
              {lang === 'he' ? 'מדיניות פרטיות ואבטחה' : 'Privacy & Security Policy'}
            </h2>
            <span className="text-[13.8px] text-[#94A3B8]">
              {BUSINESS_CONFIG.name[lang]} • {lang === 'he' ? 'עודכן במרץ 2025' : 'Updated March 2025'}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-[13.8px] sm:text-[16.1px] text-[#94A3B8] leading-relaxed font-normal">
          <p>
            {lang === 'he'
              ? 'אתר "יהודלס" הינו אתר תדמיתי והפניה בלבד. אנו מכבדים את פרטיות המשתמשים ואיננו אוספים מידע אישי שלא לצורך.'
              : 'The Yehudales website is an informational presentation site. We respect your privacy and do not harvest unnecessary personal information.'}
          </p>

          <h3 className="text-[18.4px] font-bold text-[#FAF9F6] pt-2">
            {lang === 'he' ? 'עקרונות הפרטיות באתר שלנו' : 'Core Privacy Commitments'}
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-[#FAF9F6]">
                {lang === 'he'
                  ? 'ללא קובצי Cookie של צד שלישי, ללא פיקסלים של פרסום וללא מעקבים שיווקיים.'
                  : 'Zero third-party advertising cookies, tracking pixels, or intrusive marketing trackers.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-[#FAF9F6]">
                {lang === 'he'
                  ? 'אין צורך ברישום, פתיחת חשבון או מסירת פרטי אשראי באתר. תיאום הזמנות מתבצע באופן ישיר ומאובטח באמצעות WhatsApp וטלפון.'
                  : 'No customer account registration or credit card handling on this site. Order coordination is completed directly and securely via WhatsApp and telephone.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-[#FAF9F6]">
                {lang === 'he'
                  ? 'פניות באמצעות WhatsApp או שיחה טלפונית משמשות אך ורק למתן מענה לפניה ולשירות לקוחות.'
                  : 'Contact via WhatsApp or phone is utilized solely for customer service and direct catering responses.'}
              </span>
            </li>
          </ul>

          <p className="text-[13.8px] text-[#94A3B8] pt-3 border-t border-[#252A32]">
            {lang === 'he'
              ? `לשאלות נוספות בנושאי פרטיות, ניתן לפנות אלינו בכתובת: ${BUSINESS_CONFIG.contact.email}`
              : `For further inquiries regarding data privacy, reach us at: ${BUSINESS_CONFIG.contact.email}`}
          </p>
        </div>
      </div>
    </div>
  );
};
