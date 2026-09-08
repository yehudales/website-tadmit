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
  bounceH: number;
  rot: number;
  driftX: number;
  delay: number;
  hasSpark: boolean;
  sparkX: number;
  sparkY: number;
}

// 14 distinct particles per entrance animation:
// - Emits from upper 14-16% region of the page
// - Sprays outward with natural trajectories (mobile-safe widths)
// - Falls continuously ALL THE WAY DOWN to the floor (0.0s - 2.4s)
// - Gentle floor impact bounce (2.4s - 2.8s)
// - Subtle spread sideways along the floor (2.8s - 3.4s)
// - Only dims and fades out AFTER reaching the bottom (2.8s - 3.4s)
// - Unmounts cleanly after 3.45s
const PARTICLES_CONFIG: ParticleConfig[] = [
  { id: 1, size: 16, emitOffsetX: -6, sprayX: -95, arcUp: -16, fallMultiplier: 0.98, bounceH: 18, rot: -160, driftX: -12, delay: 0, hasSpark: true, sparkX: -7, sparkY: -5 },
  { id: 2, size: 21, emitOffsetX: 4, sprayX: 90, arcUp: -20, fallMultiplier: 1.01, bounceH: 22, rot: 175, driftX: 14, delay: 50, hasSpark: true, sparkX: 6, sparkY: -6 },
  { id: 3, size: 15, emitOffsetX: -10, sprayX: -55, arcUp: -14, fallMultiplier: 0.97, bounceH: 16, rot: -120, driftX: -8, delay: 90, hasSpark: false, sparkX: 0, sparkY: 0 },
  { id: 4, size: 22, emitOffsetX: 8, sprayX: 50, arcUp: -22, fallMultiplier: 1.02, bounceH: 23, rot: 190, driftX: 10, delay: 140, hasSpark: true, sparkX: 8, sparkY: -7 },
  { id: 5, size: 17, emitOffsetX: -2, sprayX: -25, arcUp: -15, fallMultiplier: 0.99, bounceH: 17, rot: -90, driftX: -6, delay: 180, hasSpark: true, sparkX: -5, sparkY: -5 },
  { id: 6, size: 19, emitOffsetX: 10, sprayX: 20, arcUp: -18, fallMultiplier: 1.00, bounceH: 19, rot: 130, driftX: 7, delay: 210, hasSpark: false, sparkX: 0, sparkY: 0 },
  { id: 7, size: 14, emitOffsetX: -12, sprayX: -120, arcUp: -12, fallMultiplier: 0.96, bounceH: 15, rot: -200, driftX: -15, delay: 80, hasSpark: true, sparkX: -7, sparkY: -4 },
  { id: 8, size: 18, emitOffsetX: 12, sprayX: 115, arcUp: -22, fallMultiplier: 1.01, bounceH: 20, rot: 210, driftX: 15, delay: 120, hasSpark: true, sparkX: 7, sparkY: -6 },
  { id: 9, size: 16, emitOffsetX: -5, sprayX: -75, arcUp: -15, fallMultiplier: 0.98, bounceH: 17, rot: -140, driftX: -10, delay: 240, hasSpark: false, sparkX: 0, sparkY: 0 },
  { id: 10, size: 20, emitOffsetX: 6, sprayX: 70, arcUp: -19, fallMultiplier: 1.00, bounceH: 21, rot: 160, driftX: 11, delay: 270, hasSpark: true, sparkX: 6, sparkY: -6 },
  { id: 11, size: 15, emitOffsetX: 0, sprayX: -40, arcUp: -16, fallMultiplier: 0.97, bounceH: 18, rot: -105, driftX: -7, delay: 300, hasSpark: true, sparkX: -6, sparkY: -5 },
  { id: 12, size: 18, emitOffsetX: 9, sprayX: 35, arcUp: -17, fallMultiplier: 0.99, bounceH: 19, rot: 115, driftX: 8, delay: 330, hasSpark: false, sparkX: 0, sparkY: 0 },
  { id: 13, size: 14, emitOffsetX: -8, sprayX: -135, arcUp: -10, fallMultiplier: 0.95, bounceH: 14, rot: -220, driftX: -16, delay: 160, hasSpark: true, sparkX: -8, sparkY: -4 },
  { id: 14, size: 19, emitOffsetX: 11, sprayX: 130, arcUp: -20, fallMultiplier: 1.02, bounceH: 21, rot: 230, driftX: 16, delay: 190, hasSpark: true, sparkX: 7, sparkY: -7 },
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
        // Floor target: 36px above bottom edge to ensure particles remain comfortably inside
        const calculated = Math.max(260, totalHeight - originY - 36);
        setFloorDistance(calculated);
      }
    };

    measureFloor();

    // Re-measure after transition opens
    const t1 = setTimeout(measureFloor, 80);
    const t2 = setTimeout(measureFloor, 250);

    const handleResize = () => measureFloor();
    window.addEventListener('resize', handleResize);

    // Unmount completely and remove all DOM nodes after 3.45s
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [section]);

  if (!isVisible) return null;

  // Render SVG element according to the page type
  const renderItemSvg = (type: NavSectionId) => {
    switch (type) {
      case 'reviews':
        // Glowing Orange 5-Point Star
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm">
            <polygon
              points="12,1 15.5,8.5 23.5,9.5 17.5,15 19.5,23 12,19 4.5,23 6.5,15 0.5,9.5 8.5,8.5"
              fill="#FF7B1C"
            />
          </svg>
        );

      case 'about':
        // Glowing Orange Exclamation / Attention Mark
        return (
          <svg viewBox="0 0 32 48" className="w-full h-full drop-shadow-sm">
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
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm">
            <circle cx="24" cy="8" r="2.5" stroke="#FF7B1C" strokeWidth="1.5" fill="none" />
            <path
              d="M 15 30 C 15 20 18 13 24 13 C 30 13 33 20 33 30 L 36 33 C 37 34 36 35 34 35 L 14 35 C 12 35 11 34 12 33 Z"
              fill="#FF7B1C"
              fillOpacity="0.3"
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
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm">
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
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm">
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
        /* Continuous physical emission, descent all the way to floor (0-2.4s), floor impact bounce (2.4-2.8s), floor spread & fade (2.8-3.4s) */
        @keyframes emitterPhysics34 {
          0% {
            transform: translate(0, 0) scale(0.3) rotate(0deg);
            opacity: 0;
            filter: drop-shadow(0 0 2px #FF7B1C);
          }
          6% {
            opacity: 0.95;
            transform: translate(calc(var(--spray-x) * 0.2), calc(var(--arc-up, -16px) * 0.7)) scale(1.05) rotate(calc(var(--rot) * 0.08));
            filter: drop-shadow(0 0 8px #FF7B1C) drop-shadow(0 0 16px rgba(255, 123, 28, 0.6));
          }
          16% {
            opacity: 1;
            transform: translate(calc(var(--spray-x) * 0.45), var(--arc-up, -16px)) scale(1) rotate(calc(var(--rot) * 0.2));
            filter: drop-shadow(0 0 10px #FF7B1C) drop-shadow(0 0 18px rgba(255, 123, 28, 0.5));
          }
          /* Full downward descent to floor without premature fading */
          70% {
            /* Reaches actual floor boundary */
            transform: translate(var(--spray-x), var(--fall-y)) scale(1) rotate(calc(var(--rot) * 0.85));
            opacity: 1;
            filter: drop-shadow(0 0 12px #FF7B1C) drop-shadow(0 0 20px rgba(255, 123, 28, 0.55));
          }
          80% {
            /* Gentle floor impact bounce peak */
            transform: translate(calc(var(--spray-x) + var(--drift-x, 6px)), calc(var(--fall-y) - var(--bounce-h, 18px))) scale(0.95) rotate(var(--rot));
            opacity: 0.95;
            filter: drop-shadow(0 0 8px #FF7B1C);
          }
          88% {
            /* Settling down on floor, starts spreading along the floor */
            transform: translate(calc(var(--spray-x) + var(--drift-x, 6px) * 1.5), var(--fall-y)) scale(0.9) rotate(calc(var(--rot) + 8deg));
            opacity: 0.85;
            filter: drop-shadow(0 0 5px #FF7B1C);
          }
          94% {
            /* Further spread sideways along bottom, dimming and fading */
            transform: translate(calc(var(--spray-x) + var(--drift-x, 6px) * 2), var(--fall-y)) scale(0.82) rotate(calc(var(--rot) + 14deg));
            opacity: 0.35;
            filter: drop-shadow(0 0 2px #FF7B1C);
          }
          100% {
            /* Faded out completely while remaining safely inside on the floor */
            transform: translate(calc(var(--spray-x) + var(--drift-x, 6px) * 2.3), var(--fall-y)) scale(0.75) rotate(calc(var(--rot) + 18deg));
            opacity: 0;
            filter: drop-shadow(0 0 0px #FF7B1C);
          }
        }

        /* Trailing subtle sparse sparks */
        @keyframes emitterSpark34 {
          0%, 15% {
            opacity: 0;
            transform: translate(0, 0) scale(0.2);
          }
          35% {
            opacity: 0.9;
            transform: translate(var(--spark-x, 6px), var(--spark-y, -6px)) scale(1);
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          65% {
            opacity: 0.75;
            transform: translate(calc(var(--spark-x, 6px) * 1.4), calc(var(--spark-y, -6px) * 1.4)) scale(0.8);
            filter: drop-shadow(0 0 3px #FF7B1C);
          }
          80% {
            opacity: 0.45;
            transform: translate(calc(var(--spark-x, 6px) * 1.8), calc(var(--spark-y, -6px) * 1.8)) scale(0.5);
            filter: drop-shadow(0 0 1px #FF7B1C);
          }
          92%, 100% {
            opacity: 0;
            transform: translate(calc(var(--spark-x, 6px) * 2.2), calc(var(--spark-y, -6px) * 2.2)) scale(0.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .emitter-particle {
            animation: reducedFade 3s ease-out forwards !important;
          }
          @keyframes reducedFade {
            0% { opacity: 0; }
            15% { opacity: 0.8; }
            70% { opacity: 0.8; }
            100% { opacity: 0; }
          }
        }
      `}</style>

      {/* Origin point: Inside the upper 14% area of the page container, centered horizontally */}
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
                animation: `emitterPhysics34 3.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
                animationDelay: `${p.delay}ms`,
                ['--spray-x' as string]: `${p.sprayX}px`,
                ['--arc-up' as string]: `${p.arcUp}px`,
                ['--fall-y' as string]: `${particleFallY}px`,
                ['--bounce-h' as string]: `${p.bounceH}px`,
                ['--rot' as string]: `${p.rot}deg`,
                ['--drift-x' as string]: `${p.driftX}px`,
              }}
            >
              {renderItemSvg(section)}

              {p.hasSpark && (
                <span
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#FF7B1C] pointer-events-none"
                  style={{
                    animation: `emitterSpark34 3.4s ease-out forwards`,
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
