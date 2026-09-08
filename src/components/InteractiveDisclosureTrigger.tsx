import React from 'react';
import { ChevronUp } from 'lucide-react';
import { triggerMobileHaptic } from '../utils/haptics';

interface InteractiveDisclosureTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  label: string;
  ariaControls: string;
  ariaLabelOpen: string;
  ariaLabelClosed: string;
  id?: string;
}

export const InteractiveDisclosureTrigger: React.FC<InteractiveDisclosureTriggerProps> = ({
  isOpen,
  onToggle,
  label,
  ariaControls,
  ariaLabelOpen,
  ariaLabelClosed,
  id,
}) => {
  const handleClick = () => {
    triggerMobileHaptic(15);
    onToggle();
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      aria-label={isOpen ? ariaLabelOpen : ariaLabelClosed}
      className="group inline-flex flex-row items-center justify-center gap-2 py-1.5 px-2 text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] rounded-lg whitespace-nowrap select-none no-underline"
    >
      {/* Animated Touch Indicator Composition: Positioned to the RIGHT of text and lowered 2.5px to align with text */}
      <div className="relative top-[2.5px] flex items-center justify-center w-5 h-5 shrink-0 select-none finger-combined-motion [isolation:isolate]">
        {/* 1. LAYER: BACK -> Simple Solid Orange Circle on layer z-0 (50% size: 5px x 5px), positioned underneath the fingertip */}
        <span
          className="absolute left-[0.5px] top-[68%] -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#FF7B1C] z-0 pointer-events-none motion-reduce:hidden finger-circle-pulse"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        />

        {/* 2. LAYER: FRONT -> Hand / Finger with opaque fill on layer z-10, physically overlapping and occluding the circle underneath */}
        <div
          className="relative z-10 flex items-center justify-center rotate-[-90deg]"
          style={{ zIndex: 10 }}
        >
          <svg
            className="w-4 h-4 text-[#FF7B1C]"
            viewBox="0 0 24 24"
            fill="#0B0C0E"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2a2 2 0 0 0-2 2v9.5l-1.5-1.5a2.12 2.12 0 0 0-3 3L10 19.5a6 6 0 0 0 6 2.5h1a6 6 0 0 0 6-6V13a2 2 0 0 0-2-2 2 2 0 0 0-2 2v-1a2 2 0 0 0-2-2 2 2 0 0 0-2 2V4a2 2 0 0 0-2-2z" />
          </svg>
        </div>
      </div>

      {/* Text: Normal = WHITE, Open/Active = ORANGE #FF7B1C, NO UNDERLINE in any state */}
      <span
        className={`transition-colors duration-200 no-underline decoration-transparent select-none ${
          isOpen ? 'text-[#FF7B1C]' : 'text-[#FAF9F6]'
        }`}
      >
        {label}
      </span>

      {/* Reverse / Close Upward Arrow (Appears ONLY in open state, tailless chevron) */}
      {isOpen && (
        <ChevronUp
          className="w-3.5 h-3.5 text-[#FF7B1C] shrink-0"
          strokeWidth={2.4}
          aria-hidden="true"
        />
      )}

      {/* Lightweight CSS Keyframes: Synchronized Hand + Circle Micro-Motion & Fingertip Circle Pulse */}
      <style>{`
        @keyframes finger-combined-anim {
          0%, 100% {
            transform: translateX(1.5px);
          }
          50% {
            transform: translateX(-2.5px);
          }
        }
        .finger-combined-motion {
          animation: finger-combined-anim 2.2s ease-in-out infinite;
        }

        @keyframes finger-circle-pulse-anim {
          0%, 100% {
            transform: translateY(-50%) scale(0.9);
            opacity: 0.65;
          }
          50% {
            transform: translateY(-50%) scale(1.2);
            opacity: 1;
          }
        }
        .finger-circle-pulse {
          animation: finger-circle-pulse-anim 2.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .finger-combined-motion,
          .finger-circle-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </button>
  );
};
