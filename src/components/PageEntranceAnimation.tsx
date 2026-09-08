import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavSectionId } from '../types';

interface PageEntranceAnimationProps {
  section: NavSectionId;
}

interface ParticleConfig {
  id: number;
  size: number;
  emitOffsetX: number;
  sprayX: number;
  driftX: number;
  travelMultiplier: number;
  spinTurns: number; // Dreidel self-rotation in degrees (preserved exact turns)
  startAngle: number; // Initial rotation angle
  delay: number;
  hasSpark: boolean;
  sparkX: number;
  sparkY: number;
}

// 5 distinct particles:
// - Origin: Screen/viewport bottom boundary (independent of tab height or scroll)
// - Smooth upward movement with gradual fan/cone horizontal expansion
// - Fast initial spin burst, slowing down smoothly towards the end
// - Total duration: 3.6s visible lifetime (shortened by 1s)
// - Clean unmount at 3.7s
const PARTICLES_CONFIG: ParticleConfig[] = [
  {
    id: 1,
    size: 28,
    emitOffsetX: -3,
    sprayX: -75, // Wide left fan
    driftX: -10,
    travelMultiplier: 0.98,
    spinTurns: -1080, // 3 full CCW spins (1080°)
    startAngle: -15,
    delay: 0,
    hasSpark: true,
    sparkX: -5,
    sparkY: -5,
  },
  {
    id: 2,
    size: 31,
    emitOffsetX: 2,
    sprayX: 70, // Wide right fan
    driftX: 12,
    travelMultiplier: 1.02,
    spinTurns: 1120, // ~3.1 full CW spins
    startAngle: 20,
    delay: 30,
    hasSpark: true,
    sparkX: 5,
    sparkY: -6,
  },
  {
    id: 3,
    size: 25,
    emitOffsetX: -1,
    sprayX: -32, // Mid-left fan
    driftX: -6,
    travelMultiplier: 0.95,
    spinTurns: 900, // 2.5 full CW spins
    startAngle: -10,
    delay: 60,
    hasSpark: false,
    sparkX: 0,
    sparkY: 0,
  },
  {
    id: 4,
    size: 32,
    emitOffsetX: 3,
    sprayX: 36, // Mid-right fan
    driftX: 8,
    travelMultiplier: 1.04,
    spinTurns: -1020, // ~2.8 full CCW spins
    startAngle: 12,
    delay: 20,
    hasSpark: true,
    sparkX: 4,
    sparkY: -4,
  },
  {
    id: 5,
    size: 27,
    emitOffsetX: 0,
    sprayX: 0, // Center loft
    driftX: 5,
    travelMultiplier: 1.00,
    spinTurns: 1080, // 3 full CW spins (1080°)
    startAngle: 0,
    delay: 40,
    hasSpark: true,
    sparkX: -3,
    sparkY: -4,
  },
];

export const PageEntranceAnimation: React.FC<PageEntranceAnimationProps> = ({ section }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [travelDistance, setTravelDistance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Math.min(380, Math.max(220, Math.round(window.innerHeight * 0.38)));
    }
    return 260;
  });

  // Calculate upward travel distance relative to screen viewport height
  useEffect(() => {
    setMounted(true);
    setIsVisible(true);

    const measureTravel = () => {
      const vh = window.innerHeight || 800;
      // Travel upward from screen bottom boundary into visible viewport (~38% of screen height)
      const calculated = Math.min(380, Math.max(220, Math.round(vh * 0.38)));
      setTravelDistance(calculated);
    };

    measureTravel();
    window.addEventListener('resize', measureTravel);

    // Unmount completely after 3.7s (shortened by 1s from 4.7s)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3700);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureTravel);
    };
  }, [section]);

  if (!mounted || !isVisible || typeof document === 'undefined') return null;

  // Render SVG element according to the page type (strictly clean and proportional)
  const renderItemSvg = (type: NavSectionId) => {
    switch (type) {
      case 'reviews':
        // Glowing Orange 5-Point Star
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm" preserveAspectRatio="xMidYMid meet">
            <polygon
              points="12,1.5 15.3,8.5 23,9.5 17.5,15 19,22.5 12,18.8 5,22.5 6.5,15 1,9.5 8.7,8.5"
              fill="#FF7B1C"
            />
          </svg>
        );

      case 'about':
        // Glowing Orange Exclamation / Attention Mark
        return (
          <svg viewBox="0 0 32 48" className="w-full h-full drop-shadow-sm" preserveAspectRatio="xMidYMid meet">
            <path
              d="M 12 4 L 20 4 L 18 28 L 14 28 Z"
              fill="#FF7B1C"
              stroke="#FF7B1C"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="38" r="3.5" fill="#FF7B1C" />
          </svg>
        );

      case 'updates':
        // Glowing Orange Bell
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm" preserveAspectRatio="xMidYMid meet">
            <circle cx="24" cy="7" r="2.5" stroke="#FF7B1C" strokeWidth="1.5" fill="none" />
            <path
              d="M 15 30 C 15 19 18 12 24 12 C 30 12 33 19 33 30 L 36 33 C 37 34 36 35 34 35 L 14 35 C 12 35 11 34 12 33 Z"
              fill="#FF7B1C"
              fillOpacity="0.35"
              stroke="#FF7B1C"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M 21 35 Q 21 39 24 39 Q 27 39 27 35"
              stroke="#FF7B1C"
              strokeWidth="1.8"
              fill="#FF7B1C"
            />
          </svg>
        );

      case 'business-orders':
        // Glowing Orange Cooking Pot
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm" preserveAspectRatio="xMidYMid meet">
            <path
              d="M 20 10 Q 18 6 21 3 M 24 9 Q 26 5 23 2 M 28 10 Q 30 6 27 3"
              stroke="#FF7B1C"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <rect x="21" y="11" width="6" height="2.5" rx="1.2" fill="#FF7B1C" />
            <path d="M 13 16 Q 24 13 35 16" stroke="#FF7B1C" strokeWidth="1.8" fill="none" />
            <rect x="11" y="16" width="26" height="3" rx="1.5" fill="#FF7B1C" fillOpacity="0.4" stroke="#FF7B1C" strokeWidth="1" />
            <path
              d="M 12 19 L 13 34 Q 14 39 24 39 Q 34 39 35 34 L 36 19 Z"
              fill="#FF7B1C"
              fillOpacity="0.25"
              stroke="#FF7B1C"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M 11 21 C 6 21 6 26 12 26" stroke="#FF7B1C" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <path d="M 37 21 C 42 21 42 26 36 26" stroke="#FF7B1C" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'location':
        // Glowing Orange Storefront / Shop + Awning + Sun
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm" preserveAspectRatio="xMidYMid meet">
            {/* Radiant sun accent above awning */}
            <path d="M 24 5 L 24 2 M 17 7 L 15 4 M 31 7 L 33 4" stroke="#FF7B1C" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="24" cy="9" r="2.2" fill="#FF7B1C" />
            {/* Awning */}
            <path
              d="M 8 14 L 40 14 L 42 21 Q 39 23 36 21 Q 33 23 30 21 Q 27 23 24 21 Q 21 23 18 21 Q 15 23 12 21 Q 9 23 6 21 Z"
              fill="#FF7B1C"
              fillOpacity="0.3"
              stroke="#FF7B1C"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Walls & Door */}
            <path d="M 9 21 L 9 39 L 39 39 L 39 21" stroke="#FF7B1C" strokeWidth="1.4" fill="none" />
            <line x1="6" y1="39" x2="42" y2="39" stroke="#FF7B1C" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 19 39 L 19 26 Q 24 23 29 26 L 29 39" stroke="#FF7B1C" strokeWidth="1.3" fill="#FF7B1C" fillOpacity="0.2" />
            <rect x="11" y="25" width="5" height="8" rx="1" stroke="#FF7B1C" strokeWidth="1" fill="#FF7B1C" fillOpacity="0.1" />
            <rect x="32" y="25" width="5" height="8" rx="1" stroke="#FF7B1C" strokeWidth="1" fill="#FF7B1C" fillOpacity="0.1" />
          </svg>
        );

      default:
        return null;
    }
  };

  return createPortal(
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-[999] select-none"
    >
      <style>{`
        /* 
          Bottom Confetti Trajectory Animation (3.6s total — shortened by 1s):
          - Launches from screen/viewport bottom boundary
          - Fluid, soft upward curve with continuous natural easing
          - 0% to 72%: Concentrated bottom launch with fan expansion upward into viewport
          - 72% to 84%: Gentle apex float and hover dwell
          - 84% to 100%: Soft drift and gradual fade out
        */
        @keyframes bottomConfettiTrajectory {
          0% {
            transform: translate(0, 0) scale(0.4);
            opacity: 0;
            filter: drop-shadow(0 0 2px #FF7B1C);
          }
          10% {
            opacity: 1;
            transform: translate(calc(var(--spray-x) * 0.12), calc(var(--travel-y) * -0.18)) scale(0.95);
            filter: drop-shadow(0 0 8px #FF7B1C) drop-shadow(0 0 16px rgba(255, 123, 28, 0.6));
          }
          32% {
            opacity: 1;
            transform: translate(calc(var(--spray-x) * 0.52), calc(var(--travel-y) * -0.62)) scale(1);
          }
          58% {
            opacity: 1;
            transform: translate(calc(var(--spray-x) * 0.88), calc(var(--travel-y) * -0.90)) scale(1);
            filter: drop-shadow(0 0 7px #FF7B1C);
          }
          72% {
            opacity: 1;
            transform: translate(var(--spray-x), calc(var(--travel-y) * -1)) scale(1);
            filter: drop-shadow(0 0 6px #FF7B1C);
          }
          84% {
            opacity: 0.85;
            transform: translate(calc(var(--spray-x) + var(--drift-x) * 0.6), calc(var(--travel-y) * -1 - 6px)) scale(0.98);
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          92% {
            opacity: 0.4;
            transform: translate(calc(var(--spray-x) + var(--drift-x)), calc(var(--travel-y) * -1 - 10px)) scale(0.96);
            filter: drop-shadow(0 0 2px #FF7B1C);
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--spray-x) + var(--drift-x)), calc(var(--travel-y) * -1 - 14px)) scale(0.93);
            filter: drop-shadow(0 0 0px #FF7B1C);
          }
        }

        /* 
          Dreidel Self-Rotation around OWN CENTER:
          - Starts very fast, decelerates heavily to spin even slower at the end
          - Preserves the exact same number of total turns as configured
        */
        @keyframes dreidelSelfSpin {
          0% {
            transform: rotate(var(--start-rot, 0deg));
          }
          100% {
            transform: rotate(calc(var(--start-rot, 0deg) + var(--spin-rot, 1080deg)));
          }
        }

        /* Subtle trailing sparks during upward confetti launch */
        @keyframes confettiSoftSparks {
          0%, 6% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3);
          }
          25% {
            opacity: 0.95;
            transform: translate(var(--spark-x, 5px), var(--spark-y, -5px)) scale(1);
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          50% {
            opacity: 0.75;
            transform: translate(calc(var(--spark-x, 5px) * 1.5), calc(var(--spark-y, -5px) * 1.5)) scale(0.7);
            filter: drop-shadow(0 0 2px #FF7B1C);
          }
          75% {
            opacity: 0.35;
            transform: translate(calc(var(--spark-x, 5px) * 2.0), calc(var(--spark-y, -5px) * 2.0)) scale(0.4);
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--spark-x, 5px) * 2.5), calc(var(--spark-y, -5px) * 2.5)) scale(0.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .emitter-particle {
            animation: reducedFade 3.6s ease-out forwards !important;
          }
          .dreidel-spinner {
            animation: none !important;
          }
          @keyframes reducedFade {
            0% { opacity: 0; }
            15% { opacity: 0.9; }
            75% { opacity: 0.9; }
            100% { opacity: 0; }
          }
        }
      `}</style>

      {/* Origin point: Bottom boundary of the screen viewport */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 pointer-events-none">
        {PARTICLES_CONFIG.map((p) => {
          const particleTravelY = Math.round(travelDistance * p.travelMultiplier);

          return (
            <div
              key={p.id}
              className="emitter-particle absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                marginLeft: `${p.emitOffsetX}px`,
                animation: `bottomConfettiTrajectory 3.6s cubic-bezier(0.25, 1, 0.35, 1) forwards`,
                animationDelay: `${p.delay}ms`,
                ['--spray-x' as string]: `${p.sprayX}px`,
                ['--drift-x' as string]: `${p.driftX}px`,
                ['--travel-y' as string]: `${particleTravelY}px`,
              }}
            >
              {/* Inner Dreidel Container: Spins faster at start, much slower at end */}
              <div
                className="dreidel-spinner w-full h-full flex items-center justify-center will-change-transform"
                style={{
                  transformOrigin: '50% 50%',
                  animation: `dreidelSelfSpin 3.6s cubic-bezier(0.06, 0.82, 0.16, 1) forwards`,
                  animationDelay: `${p.delay}ms`,
                  ['--start-rot' as string]: `${p.startAngle}deg`,
                  ['--spin-rot' as string]: `${p.spinTurns}deg`,
                }}
              >
                {renderItemSvg(section)}
              </div>

              {p.hasSpark && (
                <span
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#FF7B1C] pointer-events-none"
                  style={{
                    animation: `confettiSoftSparks 3.6s ease-out forwards`,
                    animationDelay: `${p.delay}ms`,
                    ['--spark-x' as string]: `${p.sparkX}px`,
                    ['--spark-y' as string]: `${p.sparkY}px`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>,
    document.body
  );
};
