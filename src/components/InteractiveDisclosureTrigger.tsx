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
  emojiColor?: string;
  circleColor?: string;
  accentColor?: string;
  textClassName?: string;
  variant?: 'touch' | 'kashrut-arrow';
}

export const InteractiveDisclosureTrigger: React.FC<InteractiveDisclosureTriggerProps> = ({
  isOpen,
  onToggle,
  label,
  ariaControls,
  ariaLabelOpen,
  ariaLabelClosed,
  id,
  emojiColor = '#FF7B1C',
  circleColor = '#FF7B1C',
  accentColor = '#FF7B1C',
  textClassName = '',
  variant = 'touch',
}) => {
  const handleClick = () => {
    triggerMobileHaptic(15);
    onToggle();
  };

  if (variant === 'kashrut-arrow') {
    const arrowColor = isOpen ? accentColor : '#FFFFFF';
    const fringeColor = isOpen ? '#A84805' : '#0B0C0E';

    return (
      <button
        id={id}
        type="button"
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-controls={ariaControls}
        aria-label={isOpen ? ariaLabelOpen : ariaLabelClosed}
        className="group inline-flex flex-col items-center justify-center py-0.5 px-2 text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg whitespace-nowrap select-none no-underline"
      >
        {/* Text: Normal = WHITE, Open/Active = ACCENT COLOR (#FF7B1C), NO UNDERLINE in any state */}
        <span
          className={`transition-colors duration-200 no-underline decoration-transparent select-none leading-tight ${textClassName} ${
            isOpen ? '' : 'text-[#FAF9F6]'
          }`}
          style={isOpen ? { color: accentColor } : undefined}
        >
          {label}
        </span>

        {/* Clean, minimal line-style downward arrow (no triangle, no tail) directly below text with tiny visible gap */}
        <div className="mt-[2.5px] flex items-center justify-center leading-none" aria-hidden="true">
          <svg
            viewBox="0 0 10 6"
            className="w-[10px] h-[6px] block overflow-hidden select-none"
            aria-hidden="true"
          >
            <defs>
              {/* Mask strictly adhering to the 1.25px line stroke so shimmer cannot bleed */}
              <mask id="kashrut-line-arrow-mask">
                <path
                  d="M1.5 1.75 L 5 4.75 L 8.5 1.75"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </mask>
              <linearGradient id="kashrut-line-arrow-glint" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="42%" stopColor={fringeColor} stopOpacity={isOpen ? 0.35 : 0.25} />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="58%" stopColor={fringeColor} stopOpacity={isOpen ? 0.35 : 0.25} />
                <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Base line-style downward arrow stroke: white when closed, #FF7B1C when open */}
            <path
              d="M1.5 1.75 L 5 4.75 L 8.5 1.75"
              fill="none"
              stroke={arrowColor}
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors duration-200"
            />

            {/* Shimmer sweep traveling strictly through the line arrow stroke */}
            <g mask="url(#kashrut-line-arrow-mask)">
              <rect
                x="-14"
                y="0"
                width="16"
                height="6"
                fill="url(#kashrut-line-arrow-glint)"
                className="kashrut-arrow-shimmer-anim"
              />
            </g>
          </svg>
        </div>

        {/* Shimmer Keyframes: Slower smooth travel (~1.05s) with subtle rest, exact 1.4s total continuous loop */}
        <style>{`
          @keyframes kashrut-arrow-shimmer-sweep {
            0% {
              transform: translateX(-14px);
            }
            75% {
              transform: translateX(14px);
            }
            100% {
              transform: translateX(14px);
            }
          }
          .kashrut-arrow-shimmer-anim {
            animation: kashrut-arrow-shimmer-sweep 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .kashrut-arrow-shimmer-anim {
              animation: none !important;
              display: none !important;
            }
          }
        `}</style>
      </button>
    );
  }

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      aria-label={isOpen ? ariaLabelOpen : ariaLabelClosed}
      className="group inline-flex flex-row items-center justify-center gap-1.5 py-0.5 px-2 text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] rounded-lg whitespace-nowrap select-none no-underline"
    >
      {/* Animated Touch Indicator Composition: Positioned to the RIGHT of text and lowered 2.5px to align with text */}
      <div className="relative top-[2.5px] flex items-center justify-center w-5 h-5 shrink-0 select-none finger-combined-motion [isolation:isolate]">
        {/* 1. LAYER: BACK -> Simple Solid Orange Circle on layer z-0 (+30% size: 6.5px x 6.5px), raised slightly UP to sit precisely in front of fingertip */}
        <span
          className="absolute left-[0.5px] top-[56%] -translate-y-1/2 w-[6.5px] h-[6.5px] rounded-full z-0 pointer-events-none motion-reduce:hidden finger-circle-pulse"
          style={{ zIndex: 0, backgroundColor: circleColor }}
          aria-hidden="true"
        />

        {/* 2. LAYER: FRONT -> Hand / Finger with opaque fill on layer z-10, vertically mirrored (flipped along horizontal axis: TOP becomes BOTTOM, preserving left-pointing direction) */}
        <div
          className="relative z-10 flex items-center justify-center"
          style={{ zIndex: 10, transform: 'scaleY(-1)' }}
        >
          <div className="flex items-center justify-center rotate-[-90deg]">
            <svg
              className="w-4 h-4"
              style={{ color: emojiColor }}
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
      </div>

      {/* Text: Normal = WHITE, Open/Active = ACCENT COLOR, NO UNDERLINE in any state */}
      <span
        className={`transition-colors duration-200 no-underline decoration-transparent select-none ${textClassName} ${
          isOpen ? '' : 'text-[#FAF9F6]'
        }`}
        style={isOpen ? { color: accentColor } : undefined}
      >
        {label}
      </span>

      {/* Reverse / Close Upward Arrow (Appears ONLY in open state, tailless chevron) */}
      {isOpen && (
        <ChevronUp
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: accentColor }}
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
