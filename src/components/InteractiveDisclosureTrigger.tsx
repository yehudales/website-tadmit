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
  lang?: 'he' | 'en';
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
  lang,
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

  // Detect RTL semantics: Hebrew text or explicit lang="he"
  const isRTL = lang === 'he' || /[\u0590-\u05FF]/.test(label);

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      aria-label={isOpen ? ariaLabelOpen : ariaLabelClosed}
      className="group relative inline-flex items-center justify-center py-0.5 px-2 text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] rounded-lg whitespace-nowrap select-none no-underline"
    >
      {/* 
        Independent Centered Text Container:
        The text element serves as the sole in-flow alignment anchor.
        The finger emoji is completely excluded from the text centering calculation and layout box.
      */}
      <span className="relative inline-flex items-center justify-center">
        {/* Text: Normal = WHITE, Open/Active = ACCENT COLOR, NO UNDERLINE in any state */}
        <span
          className={`transition-colors duration-200 no-underline decoration-transparent select-none ${textClassName} ${
            isOpen ? '' : 'text-[#FAF9F6]'
          }`}
          style={isOpen ? { color: accentColor } : undefined}
        >
          {label}
        </span>

        {/* 
          Independent Touch Indicator (Finger Emoji):
          Positioned beside the text (to the physical RIGHT of Hebrew text in RTL, to the physical LEFT in LTR).
          Completely excluded from the centering calculation with zero push or offset on the text anchor.
        */}
        <span
          className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none"
          style={
            isRTL
              ? { left: 'calc(100% + 6px)' }
              : { right: 'calc(100% + 6px)' }
          }
          aria-hidden="true"
        >
          {/* Touch Indicator Composition: lowered 2.5px to align with text, container position static */}
          <div className="relative top-[2.5px] flex items-center justify-center w-5 h-5 shrink-0 select-none [isolation:isolate]">
            {/* 1. LAYER: BACK -> Locked Static Orange Circle on layer z-0 (+30% size: 6.5px x 6.5px), center point permanently fixed, offset X: -2px, Y: -3px, perfectly circular */}
            <div
              className="absolute -translate-y-1/2 flex items-center justify-center pointer-events-none z-0 overflow-hidden shrink-0"
              style={{
                zIndex: 0,
                left: '-1.5px',
                top: 'calc(56% - 3px)',
                width: '6.5px',
                height: '6.5px',
                minWidth: '6.5px',
                minHeight: '6.5px',
                maxWidth: '6.5px',
                maxHeight: '6.5px',
                borderRadius: '50%',
                aspectRatio: '1 / 1',
                clipPath: 'circle(50% at 50% 50%)',
                WebkitClipPath: 'circle(50% at 50% 50%)',
                boxSizing: 'border-box',
                padding: 0,
                margin: 0,
              }}
              aria-hidden="true"
            >
              <span
                className="block motion-reduce:hidden finger-circle-wave shrink-0"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  aspectRatio: '1 / 1',
                  clipPath: 'circle(50% at 50% 50%)',
                  WebkitClipPath: 'circle(50% at 50% 50%)',
                  backgroundColor: circleColor,
                  boxSizing: 'border-box',
                  padding: 0,
                  margin: 0,
                }}
              />
            </div>

            {/* 2. LAYER: FRONT -> Hand / Finger with opaque fill on layer z-10, vertically mirrored, anchored at index fingertip (8.33% 45.83%) with further proportional size reduction, shifted left 1px (left: 1px) and top: -1px, animated independently without moving the circle */}
            <div className="finger-hand-motion flex items-center justify-center">
              <div
                className="relative z-10 flex items-center justify-center"
                style={{
                  zIndex: 10,
                  transform: 'scaleY(-1) scale(0.70)',
                  transformOrigin: '8.33% 45.83%',
                  top: '-1px',
                  left: '1px',
                }}
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
          </div>
        </span>

        {/* Reverse / Close Upward Arrow (Appears ONLY in open state, placed on opposite side without affecting text center) */}
        {isOpen && (
          <span
            className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none"
            style={
              isRTL
                ? { right: 'calc(100% + 6px)' }
                : { left: 'calc(100% + 6px)' }
            }
            aria-hidden="true"
          >
            <ChevronUp
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: accentColor }}
              strokeWidth={2.4}
              aria-hidden="true"
            />
          </span>
        )}
      </span>

      {/* Lightweight CSS Keyframes: Independent Hand Tap Motion & Fixed-Center Circle Pulse */}
      <style>{`
        @keyframes finger-hand-anim {
          0%, 100% {
            transform: translateX(1.5px);
          }
          50% {
            transform: translateX(-2.5px);
          }
        }
        .finger-hand-motion {
          animation: finger-hand-anim 2.2s ease-in-out infinite;
        }

        @keyframes finger-circle-wave-anim {
          0% {
            background-position: -20px 0;
          }
          100% {
            background-position: 7px 0;
          }
        }
        .finger-circle-wave {
          border-radius: 50%;
          aspect-ratio: 1 / 1;
          clip-path: circle(50% at 50% 50%);
          -webkit-clip-path: circle(50% at 50% 50%);
          background: linear-gradient(
            110deg,
            #FF7B1C 0%,
            #FF7B1C 28%,
            #FF8D32 40%,
            #FFA04D 50%,
            #FF8D32 60%,
            #FF7B1C 72%,
            #FF7B1C 100%
          );
          background-size: 28px 100%;
          background-repeat: no-repeat;
          background-color: #FF7B1C;
          animation: finger-circle-wave-anim 3.0s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .finger-hand-motion,
          .finger-circle-wave {
            animation: none !important;
          }
        }
      `}</style>
    </button>
  );
};
