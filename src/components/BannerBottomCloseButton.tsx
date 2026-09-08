import React from 'react';
import { ChevronUp } from 'lucide-react';
import { triggerMobileHaptic } from '../utils/haptics';

interface BannerBottomCloseButtonProps {
  onClose: () => void;
  ariaLabel: string;
  title?: string;
  className?: string;
}

/**
 * Circular Arrow Control for the bottom of expanded banners.
 * Matches the exact design, sizing, icon, colors, and behavior
 * used at the bottom of the existing expanded toolbar tabs.
 */
export const BannerBottomCloseButton: React.FC<BannerBottomCloseButtonProps> = ({
  onClose,
  ariaLabel,
  title,
  className = '',
}) => {
  const handleClick = () => {
    triggerMobileHaptic(15);
    onClose();
  };

  return (
    <div className={`flex justify-center pt-3 pb-1 ${className}`}>
      <button
        onClick={handleClick}
        type="button"
        className="group pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.18] active:bg-white/[0.25] backdrop-blur-md border border-white/20 hover:border-white/35 shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
        aria-label={ariaLabel}
        title={title || ariaLabel}
      >
        <ChevronUp
          className="w-4 h-4 sm:w-5 sm:h-5 text-[#FAF9F6] group-hover:text-[#FF7B1C] transition-colors"
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};
