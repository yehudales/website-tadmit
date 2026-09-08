import React, { useState, useEffect } from 'react';
import { NavSectionId } from '../types';

interface PageEntranceAnimationProps {
  section: NavSectionId;
}

export const PageEntranceAnimation: React.FC<PageEntranceAnimationProps> = ({ section }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-complete and cleanly remove all DOM elements after 2.1s
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2100);
    return () => clearTimeout(timer);
  }, [section]);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute top-0 inset-x-0 h-64 sm:h-80 pointer-events-none overflow-hidden z-30 select-none flex items-center justify-center"
    >
      <style>{`
        /* Reviews: Falling Glowing Orange Stars with subtle rotation, bounce and fade */
        @keyframes starFallBounce {
          0% {
            transform: translateY(-30px) rotate(0deg) scale(0.5);
            opacity: 0;
            filter: drop-shadow(0 0 3px #FF7B1C);
          }
          14% {
            opacity: 0.95;
            filter: drop-shadow(0 0 10px #FF7B1C) drop-shadow(0 0 18px rgba(255, 123, 28, 0.5));
          }
          56% {
            transform: translateY(var(--fall-dist, 160px)) rotate(var(--rot-deg, 90deg)) scale(1);
            opacity: 0.95;
            filter: drop-shadow(0 0 12px #FF7B1C) drop-shadow(0 0 20px rgba(255, 123, 28, 0.6));
          }
          68% {
            transform: translateY(calc(var(--fall-dist, 160px) - 16px)) rotate(calc(var(--rot-deg, 90deg) + 16deg)) scale(0.96);
            opacity: 0.85;
            filter: drop-shadow(0 0 8px #FF7B1C);
          }
          79% {
            transform: translateY(var(--fall-dist, 160px)) rotate(calc(var(--rot-deg, 90deg) + 28deg)) scale(0.9);
            opacity: 0.6;
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          92% {
            transform: translateY(calc(var(--fall-dist, 160px) + 3px)) rotate(calc(var(--rot-deg, 90deg) + 36deg)) scale(0.75);
            opacity: 0.15;
            filter: drop-shadow(0 0 1px #FF7B1C);
          }
          100% {
            transform: translateY(calc(var(--fall-dist, 160px) + 5px)) rotate(calc(var(--rot-deg, 90deg) + 40deg)) scale(0.6);
            opacity: 0;
            filter: drop-shadow(0 0 0px #FF7B1C);
          }
        }

        /* Subtle Sparse Sparks for Falling Stars */
        @keyframes sparkEmbers {
          0%, 50% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3);
          }
          62% {
            opacity: 0.85;
            transform: translate(var(--spark-x, 4px), var(--spark-y, -6px)) scale(1);
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          78% {
            opacity: 0.45;
            transform: translate(calc(var(--spark-x, 4px) * 1.5), calc(var(--spark-y, -6px) * 1.5)) scale(0.8);
            filter: drop-shadow(0 0 2px #FF7B1C);
          }
          92%, 100% {
            opacity: 0;
            transform: translate(calc(var(--spark-x, 4px) * 2), calc(var(--spark-y, -6px) * 2)) scale(0.2);
          }
        }

        /* About: Exclamation Mark Glow Pulse & Float */
        @keyframes exclamationPulse {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.7);
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          22% {
            opacity: 1;
            transform: translateY(-4px) scale(1.05);
            filter: drop-shadow(0 0 16px #FF7B1C) drop-shadow(0 0 26px rgba(255, 123, 28, 0.6));
          }
          42% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: drop-shadow(0 0 12px #FF7B1C);
          }
          65% {
            opacity: 0.95;
            transform: translateY(-2px) scale(1.02);
            filter: drop-shadow(0 0 14px #FF7B1C);
          }
          84% {
            opacity: 0.4;
            transform: translateY(3px) scale(0.96);
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          100% {
            opacity: 0;
            transform: translateY(8px) scale(0.9);
            filter: drop-shadow(0 0 0px #FF7B1C);
          }
        }

        /* Updates: Bell Pendulum Swing */
        @keyframes bellSwing {
          0% {
            opacity: 0;
            transform: translateY(-10px) rotate(0deg) scale(0.85);
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          18% {
            opacity: 1;
            transform: translateY(0) rotate(-14deg) scale(1);
            filter: drop-shadow(0 0 14px #FF7B1C) drop-shadow(0 0 22px rgba(255, 123, 28, 0.5));
          }
          36% {
            opacity: 1;
            transform: translateY(0) rotate(12deg) scale(1);
            filter: drop-shadow(0 0 14px #FF7B1C);
          }
          54% {
            opacity: 0.95;
            transform: translateY(0) rotate(-8deg) scale(0.99);
            filter: drop-shadow(0 0 10px #FF7B1C);
          }
          72% {
            opacity: 0.8;
            transform: translateY(0) rotate(4deg) scale(0.97);
            filter: drop-shadow(0 0 6px #FF7B1C);
          }
          88% {
            opacity: 0.3;
            transform: translateY(3px) rotate(0deg) scale(0.94);
            filter: drop-shadow(0 0 2px #FF7B1C);
          }
          100% {
            opacity: 0;
            transform: translateY(6px) rotate(0deg) scale(0.9);
            filter: drop-shadow(0 0 0px #FF7B1C);
          }
        }

        /* Business Orders: Cooking Pot Float, Wobble & Steam */
        @keyframes potWobble {
          0% {
            opacity: 0;
            transform: translateY(22px) scale(0.85);
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          20% {
            opacity: 1;
            transform: translateY(-3px) scale(1.03);
            filter: drop-shadow(0 0 16px #FF7B1C) drop-shadow(0 0 24px rgba(255, 123, 28, 0.5));
          }
          40% {
            opacity: 1;
            transform: translateY(0) rotate(-1.5deg) scale(1);
            filter: drop-shadow(0 0 14px #FF7B1C);
          }
          60% {
            opacity: 0.95;
            transform: translateY(0) rotate(1.5deg) scale(1);
            filter: drop-shadow(0 0 12px #FF7B1C);
          }
          78% {
            opacity: 0.75;
            transform: translateY(1px) rotate(-0.5deg) scale(0.98);
            filter: drop-shadow(0 0 6px #FF7B1C);
          }
          90% {
            opacity: 0.25;
            transform: translateY(4px) rotate(0deg) scale(0.95);
            filter: drop-shadow(0 0 2px #FF7B1C);
          }
          100% {
            opacity: 0;
            transform: translateY(8px) rotate(0deg) scale(0.9);
            filter: drop-shadow(0 0 0px #FF7B1C);
          }
        }

        /* Storefront: Upward emergence, subtle glow, micro bounce & fade */
        @keyframes storefrontRise {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.88);
            filter: drop-shadow(0 0 4px #FF7B1C);
          }
          22% {
            opacity: 1;
            transform: translateY(-4px) scale(1.03);
            filter: drop-shadow(0 0 16px #FF7B1C) drop-shadow(0 0 26px rgba(255, 123, 28, 0.6));
          }
          44% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: drop-shadow(0 0 14px #FF7B1C);
          }
          65% {
            opacity: 0.95;
            transform: translateY(-1px) scale(1.01);
            filter: drop-shadow(0 0 12px #FF7B1C);
          }
          84% {
            opacity: 0.45;
            transform: translateY(3px) scale(0.97);
            filter: drop-shadow(0 0 5px #FF7B1C);
          }
          100% {
            opacity: 0;
            transform: translateY(8px) scale(0.92);
            filter: drop-shadow(0 0 0px #FF7B1C);
          }
        }
      `}</style>

      {/* 1. REVIEWS (ביקורות): Falling Glowing Orange Stars with Gentle Bounce */}
      {section === 'reviews' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Star 1 */}
          <div
            className="absolute top-0 left-[14%]"
            style={{
              width: '18px',
              height: '18px',
              animation: 'starFallBounce 1.9s ease-in-out forwards',
              animationDelay: '0ms',
              ['--fall-dist' as string]: '165px',
              ['--rot-deg' as string]: '90deg',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <polygon
                points="12,1 15.5,8.5 23.5,9.5 17.5,15 19.5,23 12,19 4.5,23 6.5,15 0.5,9.5 8.5,8.5"
                fill="#FF7B1C"
              />
            </svg>
            <span
              className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-[#FF7B1C]"
              style={{
                animation: 'sparkEmbers 1.9s ease-out forwards',
                animationDelay: '0ms',
                ['--spark-x' as string]: '6px',
                ['--spark-y' as string]: '-6px',
              }}
            />
          </div>

          {/* Star 2 */}
          <div
            className="absolute top-0 left-[26%]"
            style={{
              width: '22px',
              height: '22px',
              animation: 'starFallBounce 1.9s ease-in-out forwards',
              animationDelay: '120ms',
              ['--fall-dist' as string]: '190px',
              ['--rot-deg' as string]: '-110deg',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <polygon
                points="12,1 15.5,8.5 23.5,9.5 17.5,15 19.5,23 12,19 4.5,23 6.5,15 0.5,9.5 8.5,8.5"
                fill="#FF7B1C"
              />
            </svg>
            <span
              className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-[#FF7B1C]"
              style={{
                animation: 'sparkEmbers 1.9s ease-out forwards',
                animationDelay: '120ms',
                ['--spark-x' as string]: '-8px',
                ['--spark-y' as string]: '-5px',
              }}
            />
          </div>

          {/* Star 3 */}
          <div
            className="absolute top-0 left-[40%]"
            style={{
              width: '16px',
              height: '16px',
              animation: 'starFallBounce 1.9s ease-in-out forwards',
              animationDelay: '60ms',
              ['--fall-dist' as string]: '155px',
              ['--rot-deg' as string]: '75deg',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <polygon
                points="12,1 15.5,8.5 23.5,9.5 17.5,15 19.5,23 12,19 4.5,23 6.5,15 0.5,9.5 8.5,8.5"
                fill="#FF7B1C"
              />
            </svg>
          </div>

          {/* Star 4 (Center anchor) */}
          <div
            className="absolute top-0 left-[52%]"
            style={{
              width: '24px',
              height: '24px',
              animation: 'starFallBounce 1.9s ease-in-out forwards',
              animationDelay: '180ms',
              ['--fall-dist' as string]: '205px',
              ['--rot-deg' as string]: '-80deg',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <polygon
                points="12,1 15.5,8.5 23.5,9.5 17.5,15 19.5,23 12,19 4.5,23 6.5,15 0.5,9.5 8.5,8.5"
                fill="#FF7B1C"
              />
            </svg>
            <span
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#FF7B1C]"
              style={{
                animation: 'sparkEmbers 1.9s ease-out forwards',
                animationDelay: '180ms',
                ['--spark-x' as string]: '7px',
                ['--spark-y' as string]: '-8px',
              }}
            />
          </div>

          {/* Star 5 */}
          <div
            className="absolute top-0 left-[66%]"
            style={{
              width: '18px',
              height: '18px',
              animation: 'starFallBounce 1.9s ease-in-out forwards',
              animationDelay: '90ms',
              ['--fall-dist' as string]: '175px',
              ['--rot-deg' as string]: '100deg',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <polygon
                points="12,1 15.5,8.5 23.5,9.5 17.5,15 19.5,23 12,19 4.5,23 6.5,15 0.5,9.5 8.5,8.5"
                fill="#FF7B1C"
              />
            </svg>
            <span
              className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-[#FF7B1C]"
              style={{
                animation: 'sparkEmbers 1.9s ease-out forwards',
                animationDelay: '90ms',
                ['--spark-x' as string]: '-5px',
                ['--spark-y' as string]: '-6px',
              }}
            />
          </div>

          {/* Star 6 */}
          <div
            className="absolute top-0 left-[78%]"
            style={{
              width: '20px',
              height: '20px',
              animation: 'starFallBounce 1.9s ease-in-out forwards',
              animationDelay: '220ms',
              ['--fall-dist' as string]: '185px',
              ['--rot-deg' as string]: '-95deg',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <polygon
                points="12,1 15.5,8.5 23.5,9.5 17.5,15 19.5,23 12,19 4.5,23 6.5,15 0.5,9.5 8.5,8.5"
                fill="#FF7B1C"
              />
            </svg>
          </div>

          {/* Star 7 */}
          <div
            className="absolute top-0 left-[88%]"
            style={{
              width: '15px',
              height: '15px',
              animation: 'starFallBounce 1.9s ease-in-out forwards',
              animationDelay: '140ms',
              ['--fall-dist' as string]: '160px',
              ['--rot-deg' as string]: '65deg',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <polygon
                points="12,1 15.5,8.5 23.5,9.5 17.5,15 19.5,23 12,19 4.5,23 6.5,15 0.5,9.5 8.5,8.5"
                fill="#FF7B1C"
              />
            </svg>
            <span
              className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-[#FF7B1C]"
              style={{
                animation: 'sparkEmbers 1.9s ease-out forwards',
                animationDelay: '140ms',
                ['--spark-x' as string]: '5px',
                ['--spark-y' as string]: '-4px',
              }}
            />
          </div>
        </div>
      )}

      {/* 2. ABOUT (אודות): Glowing Orange "!" Attention Mark */}
      {section === 'about' && (
        <div
          className="flex items-center justify-center pointer-events-none"
          style={{ animation: 'exclamationPulse 1.9s ease-out forwards' }}
        >
          <div className="relative flex items-center justify-center">
            {/* Elegant Exclamation Mark */}
            <svg viewBox="0 0 60 100" className="w-12 h-20 sm:w-14 sm:h-24">
              <path
                d="M 26 12 L 34 12 L 32 60 L 28 60 Z"
                fill="#FF7B1C"
                stroke="#FF7B1C"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="30" cy="76" r="4.5" fill="#FF7B1C" />
            </svg>
            {/* Subtle flanker micro spark */}
            <span
              className="absolute -top-1 -right-3 w-1.5 h-1.5 rounded-full bg-[#FF7B1C]"
              style={{
                animation: 'sparkEmbers 1.9s ease-out forwards',
                ['--spark-x' as string]: '6px',
                ['--spark-y' as string]: '-6px',
              }}
            />
          </div>
        </div>
      )}

      {/* 3. UPDATES (עדכונים): Glowing Orange Bells with Pendulum Swing */}
      {section === 'updates' && (
        <div
          className="flex items-center justify-center pointer-events-none"
          style={{
            transformOrigin: 'top center',
            animation: 'bellSwing 1.9s ease-in-out forwards',
          }}
        >
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20">
              {/* Top Ring */}
              <circle cx="50" cy="20" r="5" stroke="#FF7B1C" strokeWidth="2.5" fill="none" />
              {/* Bell Body */}
              <path
                d="M 32 64 C 32 46 38 30 50 30 C 62 30 68 46 68 64 L 74 68 C 76 69 74 72 71 72 L 29 72 C 26 72 24 69 26 68 Z"
                fill="#FF7B1C"
                fillOpacity="0.25"
                stroke="#FF7B1C"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Clapper */}
              <path
                d="M 44 72 Q 44 79 50 79 Q 56 79 56 72"
                stroke="#FF7B1C"
                strokeWidth="2.5"
                fill="#FF7B1C"
              />
            </svg>
            {/* Subtle spark accent */}
            <span
              className="absolute top-2 -right-2 w-1.5 h-1.5 rounded-full bg-[#FF7B1C]"
              style={{
                animation: 'sparkEmbers 1.9s ease-out forwards',
                ['--spark-x' as string]: '8px',
                ['--spark-y' as string]: '-4px',
              }}
            />
          </div>
        </div>
      )}

      {/* 4. BUSINESS ORDERS (הזמנות עסקיות): Glowing Orange Cooking Pot */}
      {section === 'business-orders' && (
        <div
          className="flex items-center justify-center pointer-events-none"
          style={{ animation: 'potWobble 1.9s ease-out forwards' }}
        >
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24">
              {/* Steam Wisps rising above */}
              <path
                d="M 40 24 Q 36 16 42 8"
                stroke="#FF7B1C"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
              />
              <path
                d="M 50 22 Q 54 14 48 6"
                stroke="#FF7B1C"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
              <path
                d="M 60 25 Q 64 17 58 9"
                stroke="#FF7B1C"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
              />

              {/* Lid Handle */}
              <rect x="44" y="27" width="12" height="5" rx="2.5" fill="#FF7B1C" />
              {/* Pot Lid */}
              <path
                d="M 28 36 Q 50 31 72 36"
                stroke="#FF7B1C"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />

              {/* Pot Body Rim */}
              <rect
                x="25"
                y="36"
                width="50"
                height="5"
                rx="2.5"
                fill="#FF7B1C"
                fillOpacity="0.3"
                stroke="#FF7B1C"
                strokeWidth="2"
              />

              {/* Pot Body */}
              <path
                d="M 27 41 L 29 68 Q 30 78 50 78 Q 70 78 71 68 L 73 41 Z"
                fill="#FF7B1C"
                fillOpacity="0.2"
                stroke="#FF7B1C"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Loop Handles on left and right */}
              <path
                d="M 25 45 C 16 45 16 55 26 55"
                stroke="#FF7B1C"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 75 45 C 84 45 84 55 74 55"
                stroke="#FF7B1C"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            {/* Subtle spark accent */}
            <span
              className="absolute -top-1 left-2 w-1.5 h-1.5 rounded-full bg-[#FF7B1C]"
              style={{
                animation: 'sparkEmbers 1.9s ease-out forwards',
                ['--spark-x' as string]: '-6px',
                ['--spark-y' as string]: '-8px',
              }}
            />
          </div>
        </div>
      )}

      {/* 5. LOCATION (סניף): Glowing Orange Storefront with Awning and Radiant Sun */}
      {section === 'location' && (
        <div
          className="flex items-center justify-center pointer-events-none"
          style={{ animation: 'storefrontRise 1.9s ease-out forwards' }}
        >
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24">
              {/* Radiant subtle sun crest / rays above roofline */}
              <path
                d="M 50 12 L 50 6"
                stroke="#FF7B1C"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M 37 17 L 33 12"
                stroke="#FF7B1C"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M 63 17 L 67 12"
                stroke="#FF7B1C"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.85"
              />
              <circle cx="50" cy="22" r="5" fill="#FF7B1C" opacity="0.95" />

              {/* Awning Roof / Eaves */}
              <path
                d="M 20 32 L 80 32 L 85 46 Q 80 50 75 46 Q 70 50 65 46 Q 60 50 55 46 Q 50 50 45 46 Q 40 50 35 46 Q 30 50 25 46 Q 20 50 15 46 Z"
                fill="#FF7B1C"
                fillOpacity="0.25"
                stroke="#FF7B1C"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Awning Crease Lines */}
              <path
                d="M 33 32 L 31 47 M 44 32 L 44 47 M 56 32 L 56 47 M 67 32 L 69 47"
                stroke="#FF7B1C"
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />

              {/* Shop Front Walls & Base */}
              <path
                d="M 22 47 L 22 82 L 78 82 L 78 47"
                stroke="#FF7B1C"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <line
                x1="16"
                y1="82"
                x2="84"
                y2="82"
                stroke="#FF7B1C"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Open Shop Entrance / Arched Door */}
              <path
                d="M 40 82 L 40 58 Q 50 52 60 58 L 60 82"
                stroke="#FF7B1C"
                strokeWidth="2"
                fill="#FF7B1C"
                fillOpacity="0.15"
              />
              {/* Side Display Windows */}
              <rect
                x="26"
                y="55"
                width="10"
                height="16"
                rx="2"
                stroke="#FF7B1C"
                strokeWidth="1.5"
                fill="#FF7B1C"
                fillOpacity="0.1"
              />
              <rect
                x="64"
                y="55"
                width="10"
                height="16"
                rx="2"
                stroke="#FF7B1C"
                strokeWidth="1.5"
                fill="#FF7B1C"
                fillOpacity="0.1"
              />
            </svg>
            {/* Subtle spark accent */}
            <span
              className="absolute top-2 -right-2 w-1.5 h-1.5 rounded-full bg-[#FF7B1C]"
              style={{
                animation: 'sparkEmbers 1.9s ease-out forwards',
                ['--spark-x' as string]: '7px',
                ['--spark-y' as string]: '-7px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
