import React from 'react';
import { Language } from '../../types';

interface TraditionalShopEmblemProps {
  lang: Language;
  className?: string;
}

export const TraditionalShopEmblem: React.FC<TraditionalShopEmblemProps> = ({
  lang,
  className = '',
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      dir={lang === 'he' ? 'rtl' : 'ltr'}
      aria-label={lang === 'he' ? "יהודל'ס חנות" : "Yehudales Shop"}
    >
      {/* 2D Flat Illustrated Animation Keyframes (Pure 2D transforms, noticeable motion) */}
      <style>{`
        /* 1. 2D AWNING WIND WAVE & FLUTTER */
        @keyframes flat-awning-wind {
          0%, 100% {
            transform: skewX(0deg) scaleY(1);
          }
          20% {
            transform: skewX(-3deg) scaleY(0.96) translateY(-0.5px);
          }
          45% {
            transform: skewX(2.8deg) scaleY(1.03) translateY(0.5px);
          }
          70% {
            transform: skewX(-2deg) scaleY(0.98);
          }
          85% {
            transform: skewX(1.2deg) scaleY(1.01);
          }
        }

        /* Scallop flutter ripple */
        @keyframes flat-scallop-wave {
          0%, 100% {
            transform: scaleY(1) translateY(0);
          }
          35% {
            transform: scaleY(0.8) translateY(-1.2px);
          }
          70% {
            transform: scaleY(1.2) translateY(1px);
          }
        }

        /* 2. 2D CARTOON CHIMNEY SMOKE PUFFS */
        @keyframes flat-smoke-puff-1 {
          0% {
            transform: translate(0, 0) scale(0.35);
            opacity: 0;
          }
          25% {
            opacity: 0.9;
          }
          60% {
            transform: translate(-4px, -6px) scale(1.1);
            opacity: 0.5;
          }
          100% {
            transform: translate(-7px, -11px) scale(1.45);
            opacity: 0;
          }
        }

        @keyframes flat-smoke-puff-2 {
          0% {
            transform: translate(0, 0) scale(0.3);
            opacity: 0;
          }
          30% {
            opacity: 0.85;
          }
          65% {
            transform: translate(3.5px, -7px) scale(1.15);
            opacity: 0.45;
          }
          100% {
            transform: translate(6px, -12px) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes flat-smoke-puff-3 {
          0% {
            transform: translate(0, 0) scale(0.35);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          55% {
            transform: translate(-2px, -5px) scale(1.05);
            opacity: 0.4;
          }
          100% {
            transform: translate(-3.5px, -10px) scale(1.35);
            opacity: 0;
          }
        }

        /* 3. 2D FLAT DOOR OPEN / CLOSE */
        @keyframes flat-door-open-l {
          0%, 18% {
            /* Closed */
            transform: scaleX(1);
          }
          32%, 68% {
            /* Clearly Open (2D flat door swinging open toward left jamb) */
            transform: scaleX(0.2);
          }
          82%, 100% {
            /* Closed */
            transform: scaleX(1);
          }
        }

        @keyframes flat-door-open-r {
          0%, 18% {
            /* Closed */
            transform: scaleX(1);
          }
          32%, 68% {
            /* Clearly Open (2D flat door swinging open toward right jamb) */
            transform: scaleX(0.2);
          }
          82%, 100% {
            /* Closed */
            transform: scaleX(1);
          }
        }

        /* 2D Interior light indicator when door is open */
        @keyframes flat-interior-glow {
          0%, 18% {
            opacity: 0.2;
          }
          32%, 68% {
            opacity: 0.95;
          }
          82%, 100% {
            opacity: 0.2;
          }
        }

        .anim-flat-awning {
          transform-origin: top center;
          animation: flat-awning-wind 4.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        .anim-scallop-1 { animation: flat-scallop-wave 3.2s ease-in-out infinite 0.0s; }
        .anim-scallop-2 { animation: flat-scallop-wave 3.2s ease-in-out infinite 0.15s; }
        .anim-scallop-3 { animation: flat-scallop-wave 3.2s ease-in-out infinite 0.3s; }
        .anim-scallop-4 { animation: flat-scallop-wave 3.2s ease-in-out infinite 0.45s; }
        .anim-scallop-5 { animation: flat-scallop-wave 3.2s ease-in-out infinite 0.6s; }
        .anim-scallop-6 { animation: flat-scallop-wave 3.2s ease-in-out infinite 0.75s; }
        .anim-scallop-7 { animation: flat-scallop-wave 3.2s ease-in-out infinite 0.9s; }

        .anim-flat-smoke-1 {
          animation: flat-smoke-puff-1 3.4s cubic-bezier(0.2, 0.6, 0.35, 1) infinite;
        }
        .anim-flat-smoke-2 {
          animation: flat-smoke-puff-2 3.4s cubic-bezier(0.2, 0.6, 0.35, 1) infinite 1.1s;
        }
        .anim-flat-smoke-3 {
          animation: flat-smoke-puff-3 3.4s cubic-bezier(0.2, 0.6, 0.35, 1) infinite 2.2s;
        }

        .anim-flat-door-l {
          transform-origin: left center;
          animation: flat-door-open-l 6.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .anim-flat-door-r {
          transform-origin: right center;
          animation: flat-door-open-r 6.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .anim-flat-interior {
          animation: flat-interior-glow 6.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-flat-awning,
          .anim-scallop-1,
          .anim-scallop-2,
          .anim-scallop-3,
          .anim-scallop-4,
          .anim-scallop-5,
          .anim-scallop-6,
          .anim-scallop-7,
          .anim-flat-smoke-1,
          .anim-flat-smoke-2,
          .anim-flat-smoke-3,
          .anim-flat-door-l,
          .anim-flat-door-r,
          .anim-flat-interior {
            animation: none !important;
          }
        }
      `}</style>

      {/* 
        COMPACT 2D FLAT ILLUSTRATED SHOP EMBLEM
        - Scaled smaller to serve as a clean decorative emblem
        - "יהודל'ס חנות" is large and primary
        - 100% pure 2D drawing / flat vector aesthetic
        - Unified Light Cyan / Pale Blue palette
      */}
      <div className="relative w-[138px] sm:w-[152px] flex flex-col items-center">
        
        {/* 1. FLAT 2D ROOF & CHIMNEY WITH 2D SMOKE PUFFS */}
        <div className="relative w-full h-[13px] flex items-end justify-center pointer-events-none">
          
          {/* Small 2D Chimney */}
          <div
            className={`absolute bottom-0 ${
              lang === 'he' ? 'right-[12px] sm:right-[16px]' : 'left-[12px] sm:left-[16px]'
            } flex flex-col items-center z-10`}
          >
            {/* 2D Smoke Puffs */}
            <div className="relative w-2.5 h-2.5 mb-0.5 pointer-events-none">
              <span className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-[#BAE6FD] anim-flat-smoke-1" />
              <span className="absolute bottom-0 left-0.5 w-2 h-2 rounded-full bg-[#7DD3FC] anim-flat-smoke-2" />
              <span className="absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full bg-[#38BDF8] anim-flat-smoke-3" />
            </div>

            {/* 2D Chimney Cap & Body */}
            <div className="w-2.5 h-1 bg-[#7DD3FC] border border-[#0284C7] rounded-t-xs" />
            <div className="w-2 h-1.5 bg-[#0284C7] border-x border-b border-[#0369A1]" />
          </div>

          {/* Flat 2D Roof Bar */}
          <div className="w-[94%] h-2 bg-[#0284C7] border-t border-x border-[#38BDF8] rounded-t-xs flex items-center justify-between px-1.5">
            <span className="w-1 h-0.5 bg-[#BAE6FD] rounded-xs" />
            <span className="w-8 h-0.5 bg-[#7DD3FC]/80 rounded-full" />
            <span className="w-1 h-0.5 bg-[#BAE6FD] rounded-xs" />
          </div>
        </div>

        {/* 2. PRIMARY PROMINENT TITLE FASCIA: "יהודל'ס חנות" */}
        <div className="relative z-30 -mt-0.5 w-full bg-[#BAE6FD] border border-[#0284C7] rounded-t-sm px-1.5 py-0.5 flex flex-col items-center shadow-xs">
          {/* Large, High-Visibility, Integrated Hebrew Brand Title */}
          <span
            id="shop-mode-center-title"
            className="font-['Frank_Ruhl_Libre',serif] text-[#0284C7] text-[16px] sm:text-[18px] font-black tracking-wide select-none whitespace-nowrap leading-tight text-center"
          >
            {lang === 'he' ? "יהודל'ס חנות" : "YEHUDAL'ES SHOP"}
          </span>
        </div>

        {/* 3. FLAT 2D STRIPED AWNING (With active wind flutter & scallop wave) */}
        <div className="relative z-20 w-full -mt-0.5 anim-flat-awning">
          {/* Flat Striped Canopy */}
          <div className="w-full h-3 sm:h-3.5 bg-[#0284C7] border-t border-x border-[#0284C7] flex overflow-hidden">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-full ${
                  i % 2 === 0
                    ? 'bg-[#E0F2FE] border-r border-[#BAE6FD]'
                    : 'bg-[#38BDF8] border-r border-[#0284C7]'
                }`}
              />
            ))}
          </div>

          {/* Scalloped Lower Trim with Traveling Wave */}
          <div className="w-full flex justify-between px-0.5 -mt-0.5">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-[14.2%] h-1.5 rounded-b-full border-b border-x anim-scallop-${i + 1} ${
                  i % 2 === 0
                    ? 'bg-[#E0F2FE] border-[#BAE6FD]'
                    : 'bg-[#38BDF8] border-[#0284C7]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 4. FLAT 2D LOWER STOREFRONT (Display windows, 2D animated doors & base plinth) */}
        <div className="relative z-10 w-[94%] bg-[#0C4A6E] border border-[#0284C7] rounded-b-xs p-1 flex flex-col items-center">
          
          <div className="w-full flex items-end justify-between gap-1">
            
            {/* Left 2D Window */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-4 sm:h-4.5 bg-[#082F49] border border-[#38BDF8] rounded-t-xs p-0.5 flex flex-col justify-between">
                <div className="w-full h-[0.5px] bg-[#38BDF8]" />
                <div className="flex justify-around items-center h-full">
                  <div className="w-1.5 h-2 bg-[#7DD3FC]/40 rounded-xs" />
                  <div className="w-[0.5px] h-full bg-[#38BDF8]" />
                  <div className="w-1.5 h-2 bg-[#7DD3FC]/40 rounded-xs" />
                </div>
                <div className="w-full h-[0.5px] bg-[#38BDF8]" />
              </div>
              <div className="w-full h-0.5 bg-[#38BDF8] rounded-b-xs" />
            </div>

            {/* Central 2D Entrance with Animated Doors */}
            <div className="relative w-9 sm:w-10 h-5 sm:h-6 bg-[#041E32] border border-[#38BDF8] rounded-t-xs overflow-hidden flex flex-col justify-end items-center">
              {/* 2D Interior light indicator */}
              <div className="absolute inset-0 bg-[#38BDF8]/40 anim-flat-interior pointer-events-none" />

              {/* Animated 2D Double Doors */}
              <div className="relative z-10 w-full h-4 sm:h-5 flex">
                
                {/* Left Door */}
                <div className="flex-1 h-full bg-[#0284C7] border-r border-[#38BDF8] border-t border-[#38BDF8] p-0.5 anim-flat-door-l flex flex-col justify-between">
                  <div className="w-full h-2 bg-[#38BDF8]/40 rounded-xs" />
                  <div className="flex justify-end pr-0.5">
                    <span className="w-0.5 h-0.5 rounded-full bg-[#BAE6FD]" />
                  </div>
                </div>

                {/* Right Door */}
                <div className="flex-1 h-full bg-[#0284C7] border-l border-[#38BDF8] border-t border-[#38BDF8] p-0.5 anim-flat-door-r flex flex-col justify-between">
                  <div className="w-full h-2 bg-[#38BDF8]/40 rounded-xs" />
                  <div className="flex justify-start pl-0.5">
                    <span className="w-0.5 h-0.5 rounded-full bg-[#BAE6FD]" />
                  </div>
                </div>

              </div>

              <div className="relative z-20 w-full h-0.5 bg-[#0284C7]" />
            </div>

            {/* Right 2D Window */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-4 sm:h-4.5 bg-[#082F49] border border-[#38BDF8] rounded-t-xs p-0.5 flex flex-col justify-between">
                <div className="w-full h-[0.5px] bg-[#38BDF8]" />
                <div className="flex justify-around items-center h-full">
                  <div className="w-1.5 h-2 bg-[#7DD3FC]/40 rounded-xs" />
                  <div className="w-[0.5px] h-full bg-[#38BDF8]" />
                  <div className="w-1.5 h-2 bg-[#7DD3FC]/40 rounded-xs" />
                </div>
                <div className="w-full h-[0.5px] bg-[#38BDF8]" />
              </div>
              <div className="w-full h-0.5 bg-[#38BDF8] rounded-b-xs" />
            </div>

          </div>

          {/* Flat Base Step */}
          <div className="w-full h-1 bg-[#0284C7] rounded-xs mt-0.5 border-t border-[#38BDF8] flex justify-between px-1 items-center">
            <span className="w-2 h-0.5 bg-[#BAE6FD] rounded-full" />
            <span className="w-2 h-0.5 bg-[#BAE6FD] rounded-full" />
          </div>

        </div>

      </div>
    </div>
  );
};
