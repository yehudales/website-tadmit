import React, { useState, useEffect, useRef } from 'react';
import { NavSectionId } from '../types';

interface PageEntranceAnimationProps {
  section: NavSectionId;
}

interface ParticleConfig {
  id: number;
  size: number;
  emitOffsetX: number;
  sprayX: number;
  arcUp: number;
  fallMultiplier: number;
  bounceH1: number;
  bounceH2: number;
  roll1X: number;
  roll2X: number;
  settleX: number;
  rotLand: number;
  rotRoll1: number;
  rotRoll2: number;
  rotSettle: number;
  delay: number;
  hasSpark: boolean;
  sparkX: number;
  sparkY: number;
}

// 10 distinct particles (24px to 32px):
// - Total duration: ~2.3s total visible lifetime
// - Fall: 0.0s - 1.0s (natural smooth gravity descent to floor)
// - Soft Floor Movement: 1.0s - 1.7s (soft landing bounce, smooth roll & wobble)
// - Settle & Fade Out: 1.7s - 2.3s (continues gentle rolling while fading smoothly to 0 opacity at bottom)
// - Clean unmount at 2.35s
const PARTICLES_CONFIG: ParticleConfig[] = [
  {
    id: 1,
    size: 26,
    emitOffsetX: -8,
    sprayX: -75,
    arcUp: -10,
    fallMultiplier: 0.98,
    bounceH1: 14,
    bounceH2: 5,
    roll1X: -20,
    roll2X: -34,
    settleX: -40,
    rotLand: -20,
    rotRoll1: -55,
    rotRoll2: -85,
    rotSettle: -95,
    delay: 0,
    hasSpark: true,
    sparkX: -5,
    sparkY: -4,
  },
  {
    id: 2,
    size: 31,
    emitOffsetX: 5,
    sprayX: 70,
    arcUp: -12,
    fallMultiplier: 1.01,
    bounceH1: 16,
    bounceH2: 6,
    roll1X: 22,
    roll2X: 38,
    settleX: 44,
    rotLand: 22,
    rotRoll1: 65,
    rotRoll2: 95,
    rotSettle: 110,
    delay: 15,
    hasSpark: true,
    sparkX: 5,
    sparkY: -5,
  },
  {
    id: 3,
    size: 24,
    emitOffsetX: -12,
    sprayX: -45,
    arcUp: -8,
    fallMultiplier: 0.97,
    bounceH1: 12,
    bounceH2: 4,
    roll1X: 12,
    roll2X: 8,
    settleX: 5,
    rotLand: 15,
    rotRoll1: 35,
    rotRoll2: 20,
    rotSettle: 12,
    delay: 30,
    hasSpark: false,
    sparkX: 0,
    sparkY: 0,
  },
  {
    id: 4,
    size: 32,
    emitOffsetX: 9,
    sprayX: 40,
    arcUp: -13,
    fallMultiplier: 1.02,
    bounceH1: 17,
    bounceH2: 6,
    roll1X: 16,
    roll2X: 28,
    settleX: 32,
    rotLand: 25,
    rotRoll1: 70,
    rotRoll2: 100,
    rotSettle: 115,
    delay: 10,
    hasSpark: true,
    sparkX: 6,
    sparkY: -6,
  },
  {
    id: 5,
    size: 27,
    emitOffsetX: -3,
    sprayX: -15,
    arcUp: -9,
    fallMultiplier: 0.99,
    bounceH1: 13,
    bounceH2: 5,
    roll1X: -16,
    roll2X: -24,
    settleX: -28,
    rotLand: -18,
    rotRoll1: -50,
    rotRoll2: -70,
    rotSettle: -80,
    delay: 20,
    hasSpark: true,
    sparkX: -4,
    sparkY: -4,
  },
  {
    id: 6,
    size: 29,
    emitOffsetX: 10,
    sprayX: 15,
    arcUp: -11,
    fallMultiplier: 1.00,
    bounceH1: 15,
    bounceH2: 5,
    roll1X: 14,
    roll2X: 22,
    settleX: 26,
    rotLand: 20,
    rotRoll1: 55,
    rotRoll2: 75,
    rotSettle: 85,
    delay: 35,
    hasSpark: false,
    sparkX: 0,
    sparkY: 0,
  },
  {
    id: 7,
    size: 24,
    emitOffsetX: -14,
    sprayX: -105,
    arcUp: -8,
    fallMultiplier: 0.96,
    bounceH1: 11,
    bounceH2: 4,
    roll1X: 14,
    roll2X: 24,
    settleX: 28,
    rotLand: 18,
    rotRoll1: 45,
    rotRoll2: 65,
    rotSettle: 75,
    delay: 15,
    hasSpark: true,
    sparkX: -5,
    sparkY: -3,
  },
  {
    id: 8,
    size: 30,
    emitOffsetX: 12,
    sprayX: 100,
    arcUp: -12,
    fallMultiplier: 1.01,
    bounceH1: 15,
    bounceH2: 6,
    roll1X: -18,
    roll2X: -30,
    settleX: -34,
    rotLand: -22,
    rotRoll1: -60,
    rotRoll2: -90,
    rotSettle: -105,
    delay: 25,
    hasSpark: true,
    sparkX: 5,
    sparkY: -5,
  },
  {
    id: 9,
    size: 26,
    emitOffsetX: -6,
    sprayX: -60,
    arcUp: -9,
    fallMultiplier: 0.98,
    bounceH1: 13,
    bounceH2: 5,
    roll1X: -14,
    roll2X: -20,
    settleX: -23,
    rotLand: -18,
    rotRoll1: -45,
    rotRoll2: -68,
    rotSettle: -76,
    delay: 15,
    hasSpark: false,
    sparkX: 0,
    sparkY: 0,
  },
  {
    id: 10,
    size: 30,
    emitOffsetX: 7,
    sprayX: 55,
    arcUp: -11,
    fallMultiplier: 1.00,
    bounceH1: 15,
    bounceH2: 5,
    roll1X: 18,
    roll2X: 30,
    settleX: 35,
    rotLand: 22,
    rotRoll1: 60,
    rotRoll2: 85,
    rotSettle: 95,
    delay: 30,
    hasSpark: true,
    sparkX: 4,
    sparkY: -4,
  },
];

export const PageEntranceAnimation: React.FC<PageEntranceAnimationProps> = ({ section }) => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [floorDistance, setFloorDistance] = useState<number>(380);

  // Measure actual container height and calculate floor point dynamically
  useEffect(() => {
    setIsVisible(true);

    const measureFloor = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement || containerRef.current;
        const totalHeight = parent.clientHeight || parent.offsetHeight || 500;
        const originY = Math.max(50, totalHeight * 0.14);
        // Floor target: 40px above bottom edge to ensure elements sit completely and comfortably inside
        const calculated = Math.max(260, totalHeight - originY - 40);
        setFloorDistance(calculated);
      }
    };

    measureFloor();

    // Re-measure after transition expands
    const t1 = setTimeout(measureFloor, 50);
    const t2 = setTimeout(measureFloor, 150);

    const handleResize = () => measureFloor();
    window.addEventListener('resize', handleResize);

    // Unmount completely after 2.35s (2350ms)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [section]);

  if (!isVisible) return null;

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

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-30 select-none"
    >
      <style>{`
        /* 
          Soft Physical Floor Sequence (2.3s total):
          - 0.0s - 1.0s (0% - 43%): Smooth natural gravity descent to floor
          - 1.0s - 1.7s (43% - 74%): Soft floor impact, cushioned bounce, smooth roll & wobble
          - 1.7s - 2.3s (74% - 100%): Continues rolling into settle while smoothly fading out in opacity at bottom
        */
        @keyframes toolbarSoftPhysics {
          0% {
            transform: translate(0, 0) scale(0.65) rotate(0deg);
            opacity: 0;
            filter: drop-shadow(0 0 2px #FF7B1C);
          }
          6% {
            opacity: 0.95;
            transform: translate(calc(var(--spray-x) * 0.15), calc(var(--arc-up, -10px) * 0.7)) scale(1) rotate(calc(var(--rot-land) * 0.1));
            filter: drop-shadow(0 0 8px #FF7B1C) drop-shadow(0 0 16px rgba(255, 123, 28, 0.6));
          }
          20% {
            opacity: 1;
            transform: translate(calc(var(--spray-x) * 0.45), calc(var(--fall-y) * 0.3)) scale(1) rotate(calc(var(--rot-land) * 0.35));
          }
          33% {
            opacity: 1;
            transform: translate(calc(var(--spray-x) * 0.8), calc(var(--fall-y) * 0.75)) scale(1) rotate(calc(var(--rot-land) * 0.75));
          }
          /* --- Floor arrival at ~1.0s (43%) --- */
          43.5% {
            transform: translate(var(--spray-x), var(--fall-y)) scale(1) rotate(var(--rot-land));
            opacity: 1;
            filter: drop-shadow(0 0 10px #FF7B1C) drop-shadow(0 0 18px rgba(255, 123, 28, 0.5));
          }
          /* --- Cushioned soft landing bounce peak (~1.22s / 53%) --- */
          53% {
            transform: translate(calc(var(--spray-x) + var(--roll1-x) * 0.35), calc(var(--fall-y) - var(--bounce-h1))) scale(1) rotate(calc(var(--rot-land) + var(--rot-roll1) * 0.25));
            opacity: 1;
            filter: drop-shadow(0 0 7px #FF7B1C);
          }
          /* --- Soft return to floor & smooth roll forward (~1.43s / 62%) --- */
          62% {
            transform: translate(calc(var(--spray-x) + var(--roll1-x) * 0.7), var(--fall-y)) scale(1) rotate(calc(var(--rot-land) + var(--rot-roll1) * 0.6));
            opacity: 1;
          }
          /* --- Gentle secondary micro-hop + rolling (~1.65s / 72%) --- */
          72% {
            transform: translate(calc(var(--spray-x) + var(--roll1-x)), calc(var(--fall-y) - var(--bounce-h2))) scale(1) rotate(var(--rot-roll1));
            opacity: 1;
          }
          /* --- Softly rolls into final path while starting gradual fade (~1.85s / 80%) --- */
          80% {
            transform: translate(calc(var(--spray-x) + var(--roll2-x) * 0.85), var(--fall-y)) scale(1) rotate(var(--rot-roll2));
            opacity: 0.85;
            filter: drop-shadow(0 0 5px #FF7B1C);
          }
          /* --- Continuing smooth roll & rocking settle (~2.1s / 91%) --- */
          91% {
            transform: translate(calc(var(--spray-x) + var(--settle-x) * 0.95), var(--fall-y)) scale(0.97) rotate(calc(var(--rot-settle) - 3deg));
            opacity: 0.45;
            filter: drop-shadow(0 0 3px #FF7B1C);
          }
          /* --- Completely settled at bottom and fully faded (~2.3s / 100%) --- */
          100% {
            transform: translate(calc(var(--spray-x) + var(--settle-x)), var(--fall-y)) scale(0.94) rotate(var(--rot-settle));
            opacity: 0;
            filter: drop-shadow(0 0 0px #FF7B1C);
          }
        }

        /* Trailing subtle sparks during fall and soft bounce */
        @keyframes toolbarSoftSparks {
          0%, 6% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3);
          }
          20% {
            opacity: 0.95;
            transform: translate(var(--spark-x, 5px), var(--spark-y, -5px)) scale(1);
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          38% {
            opacity: 0.8;
            transform: translate(calc(var(--spark-x, 5px) * 1.4), calc(var(--spark-y, -5px) * 1.4)) scale(0.7);
            filter: drop-shadow(0 0 2px #FF7B1C);
          }
          52% {
            opacity: 0.35;
            transform: translate(calc(var(--spark-x, 5px) * 1.8), calc(var(--spark-y, -5px) * 1.8)) scale(0.4);
          }
          65%, 100% {
            opacity: 0;
            transform: translate(calc(var(--spark-x, 5px) * 2.2), calc(var(--spark-y, -5px) * 2.2)) scale(0.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .emitter-particle {
            animation: reducedFade 2.3s ease-out forwards !important;
          }
          @keyframes reducedFade {
            0% { opacity: 0; }
            15% { opacity: 0.9; }
            75% { opacity: 0.9; }
            100% { opacity: 0; }
          }
        }
      `}</style>

      {/* Origin point: Inside upper 14% region, centered horizontally */}
      <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-0 h-0 pointer-events-none">
        {PARTICLES_CONFIG.map((p) => {
          const particleFallY = Math.round(floorDistance * p.fallMultiplier);

          return (
            <div
              key={p.id}
              className="emitter-particle absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                marginLeft: `${p.emitOffsetX}px`,
                animation: `toolbarSoftPhysics 2.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
                animationDelay: `${p.delay}ms`,
                ['--spray-x' as string]: `${p.sprayX}px`,
                ['--arc-up' as string]: `${p.arcUp}px`,
                ['--fall-y' as string]: `${particleFallY}px`,
                ['--bounce-h1' as string]: `${p.bounceH1}px`,
                ['--bounce-h2' as string]: `${p.bounceH2}px`,
                ['--roll1-x' as string]: `${p.roll1X}px`,
                ['--roll2-x' as string]: `${p.roll2X}px`,
                ['--settle-x' as string]: `${p.settleX}px`,
                ['--rot-land' as string]: `${p.rotLand}deg`,
                ['--rot-roll1' as string]: `${p.rotRoll1}deg`,
                ['--rot-roll2' as string]: `${p.rotRoll2}deg`,
                ['--rot-settle' as string]: `${p.rotSettle}deg`,
              }}
            >
              {renderItemSvg(section)}

              {p.hasSpark && (
                <span
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#FF7B1C] pointer-events-none"
                  style={{
                    animation: `toolbarSoftSparks 2.3s ease-out forwards`,
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
    </div>
  );
};
