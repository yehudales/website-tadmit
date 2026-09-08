import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '../types';

interface WeeklyEnergyTimelineProps {
  lang: Language;
}

interface DayNode {
  index: number;
  label: { line1: { he: string; en: string }; line2?: { he: string; en: string } };
  isThu: boolean;
  positionPercent: number; // percentage from right (0% = right edge, 100% = left edge)
}

// 7 days distributed along the tube from RIGHT to LEFT for RTL
const DAYS: DayNode[] = [
  {
    index: 0,
    label: { line1: { he: 'ראשון', en: 'Sun' } },
    isThu: false,
    positionPercent: 5,
  },
  {
    index: 1,
    label: { line1: { he: 'שני', en: 'Mon' } },
    isThu: false,
    positionPercent: 20,
  },
  {
    index: 2,
    label: { line1: { he: 'שלישי', en: 'Tue' } },
    isThu: false,
    positionPercent: 35,
  },
  {
    index: 3,
    label: { line1: { he: 'רביעי', en: 'Wed' } },
    isThu: false,
    positionPercent: 50,
  },
  {
    index: 4,
    label: {
      line1: { he: 'חמישי', en: 'Thu' },
      line2: { he: 'שמח', en: 'Happy' },
    },
    isThu: true,
    positionPercent: 65,
  },
  {
    index: 5,
    label: { line1: { he: 'שישי', en: 'Fri' } },
    isThu: false,
    positionPercent: 80,
  },
  {
    index: 6,
    label: { line1: { he: 'שבת', en: 'Sat' } },
    isThu: false,
    positionPercent: 95,
  },
];

// Helper to get current Israel (Asia/Jerusalem) calendar day (0=Sun..6=Sat) and hour
function getIsraelTime(): { day: number; hours: number } {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem',
      weekday: 'short',
      hour: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(now);

    const weekdayPart = parts.find((p) => p.type === 'weekday')?.value;
    const hourPart = parts.find((p) => p.type === 'hour')?.value;

    const weekdayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    const day =
      weekdayPart && weekdayMap[weekdayPart] !== undefined
        ? weekdayMap[weekdayPart]
        : now.getDay();
    const hours = hourPart !== undefined ? parseInt(hourPart, 10) : now.getHours();

    return { day, hours };
  } catch {
    const now = new Date();
    const israelStr = now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
    const israelDate = new Date(israelStr);
    return {
      day: !isNaN(israelDate.getTime()) ? israelDate.getDay() : now.getDay(),
      hours: !isNaN(israelDate.getTime()) ? israelDate.getHours() : now.getHours(),
    };
  }
}

export const WeeklyEnergyTimeline: React.FC<WeeklyEnergyTimelineProps> = ({ lang }) => {
  const [fillPercent, setFillPercent] = useState(5);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [isSparkBurst, setIsSparkBurst] = useState(false);

  // Press Counter System from 0 (Clean Idle) to 50 (Maximum Boiling & Floor Spill)
  const [pressCount, setPressCount] = useState<number>(0);
  const pressCountRef = useRef<number>(0);
  const isPressingRef = useRef<boolean>(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const decayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const decayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate real-time Israel day and discrete daily position (00:00 midnight calendar day)
  const updateTimelinePosition = useCallback(() => {
    const { day, hours } = getIsraelTime();

    // CURRENT DAY = CURRENT LOADING-LINE DAY:
    // At exactly 00:00 local Israel time, the active day immediately becomes the NEW calendar day.
    const activeDay = DAYS[day] || DAYS[0];
    setFillPercent(activeDay.positionPercent);

    // Business window: Thursday 17:00 -> Friday 01:00
    const isThuOpen = day === 4 && hours >= 17;
    const isFriEarlyOpen = day === 5 && hours < 1;
    setIsOpenNow(isThuOpen || isFriEarlyOpen);
  }, []);

  useEffect(() => {
    updateTimelinePosition();
    const interval = setInterval(updateTimelinePosition, 1000);
    return () => clearInterval(interval);
  }, [updateTimelinePosition]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
      if (decayIntervalRef.current) clearInterval(decayIntervalRef.current);
    };
  }, []);

  // Feature-safe subtle haptic pulse (15ms) for interactive loading-line clicks and pot activation
  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Silently ignore if unsupported or restricted
      }
    }
  }, []);

  // Increment press count (1 to 50)
  const incrementPress = useCallback((amount: number = 1) => {
    // Cancel any active decay immediately
    if (decayTimeoutRef.current) {
      clearTimeout(decayTimeoutRef.current);
      decayTimeoutRef.current = null;
    }
    if (decayIntervalRef.current) {
      clearInterval(decayIntervalRef.current);
      decayIntervalRef.current = null;
    }

    triggerHaptic();

    const nextCount = Math.min(50, Math.max(0, pressCountRef.current + amount));
    pressCountRef.current = nextCount;
    setPressCount(nextCount);
  }, [triggerHaptic]);

  // Start Press / Hold interaction
  const startPotActivation = useCallback(() => {
    isPressingRef.current = true;
    incrementPress(1);

    // Continuous build while holding (up to 50)
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      if (pressCountRef.current < 50) {
        incrementPress(1);
      }
    }, 75);
  }, [incrementPress]);

  // Stop Press / Release interaction with smooth organic decay
  const stopPotActivation = useCallback(() => {
    isPressingRef.current = false;
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }

    // Schedule smooth decay after a short natural pause
    if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
    decayTimeoutRef.current = setTimeout(() => {
      if (decayIntervalRef.current) clearInterval(decayIntervalRef.current);
      decayIntervalRef.current = setInterval(() => {
        if (isPressingRef.current) {
          if (decayIntervalRef.current) clearInterval(decayIntervalRef.current);
          decayIntervalRef.current = null;
          return;
        }

        if (pressCountRef.current > 0) {
          pressCountRef.current -= 1;
          setPressCount(pressCountRef.current);
        } else {
          if (decayIntervalRef.current) clearInterval(decayIntervalRef.current);
          decayIntervalRef.current = null;
        }
      }, 65);
    }, 320);
  }, []);

  const handleTimelineClick = () => {
    triggerHaptic();
    setIsSparkBurst(true);
    setTimeout(() => setIsSparkBurst(false), 450);

    // Single click increments press counter by 1
    incrementPress(1);
    stopPotActivation();
  };

  // Continuous Progress Normalization (0.0 to 1.0 across 50 steps)
  const progress = pressCount / 50;

  // Visual parameters calculated per individual press step (1 to 50)
  // Pot Lid lifts subtly and realistically with steam pressure (0px idle -> -3.8px max at Level 50)
  const lidTranslateY =
    pressCount === 0
      ? 0
      : pressCount <= 10
      ? -(0.2 + (pressCount / 10) * 0.7)
      : pressCount <= 30
      ? -(0.9 + ((pressCount - 10) / 20) * 1.3)
      : -(2.2 + ((pressCount - 30) / 20) * 1.6);

  const simmeringGlowOpacity = 0.2 + progress * 0.8;
  const isBoiling = pressCount >= 4;

  // High-End Physics Multi-Stream Rounded & Organic Hot Vapor Steam Definitions
  // LEVEL 0 (ZERO PRESSES): Noticeably smaller, very short, compact, narrow at source, low volume, calm & subtle gentle wisp (~10-14px tall)
  // PROGRESSIVE BUILDUP (1 -> 50): Multiplies rounded, organic vapor forms that naturally widen, gently twist with subtle eddy curls,
  // and smoothly disperse up to the full maximum height (~220px/apex y=-80) at Level 50.
  // ALL STREAMS originate strictly from the central pot opening (160, 218).
  const STEAM_STREAMS = [
    // Level 0 (Zero Presses): Tiny compact delicate center vapor wisp (Height = 13px, strokeWidth = 4.2px, soft calm drift)
    {
      id: 'steam-0a',
      minLevel: 0,
      d: 'M 160 218 C 158.8 214.5, 161.4 211.2, 160.2 208 C 159.4 206.2, 160.6 204.5, 160 203',
      strokeWidth: 4.2,
      opacity: 0.32,
      animClass: 'steam-idle-1',
      delay: '0s',
      duration: '3.4s',
      filterType: 'tiny',
    },
    // Level 0 (Zero Presses): Tiny compact delicate left vapor wisp (Height = 9.5px, strokeWidth = 3.6px, calm gentle drift)
    {
      id: 'steam-0b',
      minLevel: 0,
      d: 'M 158.5 218 C 157.2 215.2, 158.4 212.8, 157.5 210.5 C 156.8 209, 157.6 207.8, 157.2 206.8',
      strokeWidth: 3.6,
      opacity: 0.22,
      animClass: 'steam-idle-2',
      delay: '0.7s',
      duration: '3.8s',
      filterType: 'tiny',
    },
    // Level 1: Gentle small rounded right curl (Height = 22px, strokeWidth = 5.5px)
    {
      id: 'steam-1',
      minLevel: 1,
      d: 'M 160.8 218 C 163.5 212, 165.2 206, 162.8 200 C 160.8 195, 163.2 191, 161.6 186',
      strokeWidth: 5.5,
      opacity: 0.38,
      animClass: 'steam-stream-3',
      delay: '0.3s',
      duration: '3.1s',
      filterType: 'tiny',
    },
    // Level 3: Small rounded rising vapor wave with gentle bow (Height = 35px, strokeWidth = 7.5px)
    {
      id: 'steam-3',
      minLevel: 3,
      d: 'M 159.2 218 C 155.6 210, 153.2 202, 156.8 193 C 160.2 184, 155.4 177, 153.8 170',
      strokeWidth: 7.5,
      opacity: 0.44,
      animClass: 'steam-stream-4',
      delay: '0.8s',
      duration: '3.0s',
      filterType: 'soft',
    },
    // Level 6: Left organic vapor wave curving softly outward (Height = 52px, strokeWidth = 10px)
    {
      id: 'steam-6',
      minLevel: 6,
      d: 'M 160.5 218 C 166.2 206, 169.8 192, 164.5 178 C 159.5 165, 166.8 154, 163.5 142',
      strokeWidth: 10,
      opacity: 0.5,
      animClass: 'steam-stream-1',
      delay: '0.4s',
      duration: '2.9s',
      filterType: 'soft',
    },
    // Level 9: Right rounded vapor wave with gentle curving loop (Height = 72px, strokeWidth = 13px)
    {
      id: 'steam-9',
      minLevel: 9,
      d: 'M 158.8 218 C 150.8 202, 145.5 184, 152.6 166 C 159.2 148, 149.8 134, 145.4 118',
      strokeWidth: 13,
      opacity: 0.56,
      animClass: 'steam-stream-2',
      delay: '0.9s',
      duration: '2.8s',
      filterType: 'soft',
    },
    // Level 13: Central rounded plume with a SUBTLE gentle eddy curl (Height = 94px, strokeWidth = 16px)
    {
      id: 'steam-13',
      minLevel: 13,
      d: 'M 160 218 C 167.5 198, 174.2 176, 166.8 152 C 160.5 138, 168.2 126, 163.4 114 C 158.6 102, 166.4 92, 162 82',
      strokeWidth: 16,
      opacity: 0.62,
      animClass: 'steam-stream-3',
      delay: '0.2s',
      duration: '2.7s',
      filterType: 'cloud',
      isWarmCore: true,
    },
    // Level 17: Left billowing rounded swirl curving wider as it rises (Height = 118px, strokeWidth = 19px)
    {
      id: 'steam-17',
      minLevel: 17,
      d: 'M 158.5 218 C 146.2 192, 136.5 162, 145.8 130 C 153.4 104, 140.2 82, 134.6 64 C 129.8 48, 138.2 36, 132.5 24',
      strokeWidth: 19,
      opacity: 0.66,
      animClass: 'steam-stream-4',
      delay: '0.7s',
      duration: '2.7s',
      filterType: 'cloud',
      isSmoky: true,
    },
    // Level 21: Right billowing rounded swirl with organic widening (Height = 142px, strokeWidth = 22px)
    {
      id: 'steam-21',
      minLevel: 21,
      d: 'M 161.5 218 C 173.8 190, 185.6 154, 176.4 116 C 169.2 88, 182.5 70, 176.2 50 C 171.4 36, 179.6 24, 174.2 12',
      strokeWidth: 22,
      opacity: 0.70,
      animClass: 'steam-stream-1',
      delay: '0.5s',
      duration: '2.6s',
      filterType: 'cloud',
      isWarmCore: true,
    },
    // Level 25: Center twisting hot vapor column with subtle rising vortex loop (Height = 166px, strokeWidth = 25px)
    {
      id: 'steam-25',
      minLevel: 25,
      d: 'M 160 218 C 150.6 180, 168.4 138, 157.8 92 C 149.2 56, 164.6 36, 155.4 16 C 149.8 4, 157.5 -6, 153.2 -14',
      strokeWidth: 25,
      opacity: 0.74,
      animClass: 'steam-stream-2',
      delay: '1.0s',
      duration: '2.5s',
      filterType: 'cloud',
      isWarmCore: true,
    },
    // Level 30: Left wide curved vapor canopy curving organically (Height = 192px, strokeWidth = 27px)
    {
      id: 'steam-30',
      minLevel: 30,
      d: 'M 157 218 C 137.5 178, 119.2 128, 131.6 74 C 139.8 40, 122.4 18, 115.2 0 C 109.8 -14, 118.6 -24, 112.4 -34',
      strokeWidth: 27,
      opacity: 0.76,
      animClass: 'steam-stream-3',
      delay: '0.3s',
      duration: '3.0s',
      filterType: 'cloud',
      isSmoky: true,
    },
    // Level 35: Right wide curved vapor canopy widening outward (Height = 214px, strokeWidth = 29px)
    {
      id: 'steam-35',
      minLevel: 35,
      d: 'M 163 218 C 183.4 178, 202.8 128, 190.2 68 C 182.5 36, 199.6 16, 205.2 -4 C 209.8 -18, 200.4 -30, 206.5 -40',
      strokeWidth: 29,
      opacity: 0.78,
      animClass: 'steam-stream-4',
      delay: '0.8s',
      duration: '3.0s',
      filterType: 'cloud',
    },
    // Level 40: Far left high rounded billowing wave with subtle vortex curl (Height = 236px, strokeWidth = 31px)
    {
      id: 'steam-40',
      minLevel: 40,
      d: 'M 154 218 C 126.8 172, 96.5 114, 111.4 52 C 120.6 18, 105.2 -6, 96.8 -26 C 90.4 -40, 101.2 -52, 94.6 -62',
      strokeWidth: 31,
      opacity: 0.80,
      animClass: 'steam-stream-1',
      delay: '0.6s',
      duration: '3.1s',
      filterType: 'cloud',
      isSmoky: true,
    },
    // Level 44: Far right high rounded billowing wave with wide dispersion (Height = 246px, strokeWidth = 32px)
    {
      id: 'steam-44',
      minLevel: 44,
      d: 'M 166 218 C 195.4 172, 223.8 114, 209.2 48 C 201.5 14, 219.8 -8, 226.4 -28 C 231.8 -42, 222.4 -54, 228.6 -64',
      strokeWidth: 32,
      opacity: 0.82,
      animClass: 'steam-stream-2',
      delay: '1.1s',
      duration: '3.1s',
      filterType: 'cloud',
    },
    // Level 47: Full lateral left & right billow cloud expanding wide (Height = 264px, strokeWidth = 34px)
    {
      id: 'steam-47',
      minLevel: 47,
      d: 'M 150 218 C 104.2 166, 62.8 104, 76.5 34 C 84.8 -6, 67.5 -32, 59.2 -52 C 52.8 -66, 65.4 -78, 57.2 -88',
      strokeWidth: 34,
      opacity: 0.84,
      animClass: 'steam-stream-3',
      delay: '0.4s',
      duration: '3.2s',
      filterType: 'cloud',
      isSmoky: true,
    },
    // Level 49: Apex massive billowing crown cloud with central looping expansion (Height = 286px, strokeWidth = 36px)
    {
      id: 'steam-49',
      minLevel: 49,
      d: 'M 160 218 C 132.4 150, 187.6 92, 151.8 20 C 187.2 -36, 155.6 -68, 162.4 -90',
      strokeWidth: 36,
      opacity: 0.88,
      animClass: 'steam-stream-1',
      delay: '0.1s',
      duration: '2.5s',
      filterType: 'cloud',
      isWarmCore: true,
    },
    // Level 50: Superheated core maximum canopy (Height = 298px reaching max apex y=-80, strokeWidth = 38px)
    {
      id: 'steam-50',
      minLevel: 50,
      d: 'M 160 218 C 187.6 150, 132.4 92, 168.2 20 C 131.6 -36, 164.8 -68, 156.2 -90',
      strokeWidth: 38,
      opacity: 0.92,
      animClass: 'steam-stream-2',
      delay: '0s',
      duration: '2.2s',
      filterType: 'cloud',
      isWarmCore: true,
    },
  ];

  return (
    <aside
      aria-label={lang === 'he' ? 'ציר אנרגיה שבועי' : 'Weekly energy timeline'}
      className="fixed bottom-0 inset-x-0 z-40 bg-[#0B0C0E]/95 backdrop-blur-md pb-2 sm:pb-2.5 pt-4 sm:pt-5 px-3 sm:px-6 select-none border-t border-[#252A32]/40"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto w-full">
        {/* Interactive Timeline Area */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleTimelineClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleTimelineClick();
            }
          }}
          className="w-full relative group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C] rounded-xl py-1"
          aria-label={
            isOpenNow
              ? (lang === 'he' ? 'ציר שבועי — פתוח כעת' : 'Weekly timeline — Open now')
              : (lang === 'he' ? 'ציר שבועי' : 'Weekly timeline')
          }
        >
          {/* Main Cylindrical Glass Tube (RTL: Starts on Right, fills towards Left) */}
          <div className="w-full h-3 sm:h-3.5 rounded-full bg-[#111317] border border-white/10 relative overflow-visible shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.8)]">
            {/* Top Glass Highlight */}
            <div className="absolute top-[0.5px] inset-x-2 h-[1px] rounded-full bg-white/20 pointer-events-none" />

            {/* Glowing Orange Liquid / Filament Fill (Right -> Left) */}
            {/* Discrete daily state without CSS transition; line itself cleanly cut with rounded end */}
            <div
              className="absolute top-0 right-0 bottom-0 rounded-full"
              style={{
                width: `${fillPercent}%`,
                background:
                  'linear-gradient(180deg, #FFB066 0%, #FF7B1C 45%, #E65A00 100%)',
                boxShadow:
                  '0 0 12px rgba(255, 123, 28, 0.75), 0 0 24px rgba(255, 123, 28, 0.35), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.6)',
              }}
            >
              {/* Internal Filament Hot Core Stripe */}
              <div className="absolute top-1/2 -translate-y-1/2 inset-x-1 h-[1.5px] rounded-full bg-white/70 shadow-[0_0_3px_#FFF]" />
            </div>

            {/* 7 Day Marker Nodes on the timeline */}
            {/* RULE: POINT COLOR = TEXT COLOR BELOW THAT POINT. NO GLOW / HIGHLIGHT EFFECT. */}
            {DAYS.map((day) => {
              const isThu = day.isThu;
              const pointColorClass = isThu
                ? 'bg-[#FF7B1C] border-[#FF7B1C]'
                : 'bg-[#94A3B8] border-[#94A3B8]';

              return (
                <div
                  key={day.index}
                  className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 z-20 cursor-pointer touch-manipulation pointer-events-auto"
                  style={{ right: `${day.positionPercent}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTimelineClick();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      handleTimelineClick();
                    }
                  }}
                  aria-label={`${day.label.line1[lang]} - ${day.positionPercent}%`}
                >
                  <div
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${pointColorClass} border-2 transition-transform active:scale-110`}
                  />
                  {/* Invisible extended touch target for mobile accuracy */}
                  <div className="absolute -inset-3.5 rounded-full" />
                </div>
              );
            })}

            {/* Cooking Pot sitting DIRECTLY ON the center of timeline at Thursday position (65% from right) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 right-[65%] translate-x-1/2 z-30 flex flex-col items-center cursor-pointer touch-manipulation select-none pointer-events-auto"
              onPointerDown={(e) => {
                e.stopPropagation();
                startPotActivation();
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                stopPotActivation();
              }}
              onPointerLeave={stopPotActivation}
              onPointerCancel={stopPotActivation}
              role="button"
              tabIndex={0}
              aria-label={
                lang === 'he'
                  ? `סיר צ׳ולנט חמישי — עוצמת לחיצה ${pressCount}/50`
                  : `Thursday cholent pot — Press level ${pressCount}/50`
              }
            >
              {/* Extended Invisible Hit Area for Easy Mobile Tap/Hold */}
              <div className="absolute -inset-6 sm:-inset-7 rounded-full z-40" />

              {/* High-End Physics Steam System: Thick, Wide, Soft, Rounded, Organic Wave-like Vapor Multiplied per Press */}
              <div
                className="absolute bottom-full mb-0 left-1/2 -translate-x-1/2 pointer-events-none motion-reduce:hidden overflow-visible z-20 w-[320px] h-[220px] flex justify-center"
              >
                <svg
                  width="320"
                  height="220"
                  viewBox="0 0 320 220"
                  fill="none"
                  className="overflow-visible"
                >
                  <defs>
                    {/* Atmospheric Gaussian Blur Filters for Soft-Edged Vapor */}
                    <filter id="steamTinyBlur" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
                    </filter>
                    <filter id="steamSoftBlur" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="2.6" />
                    </filter>
                    <filter id="steamCloudBlur" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="5.0" />
                    </filter>

                    {/* Silvery White Hot Vapor Gradient */}
                    <linearGradient id="steamVaporGrad" x1="160" y1="220" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                      <stop offset="25%" stopColor="#F8FAFC" stopOpacity="0.85" />
                      <stop offset="60%" stopColor="#CBD5E1" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                    </linearGradient>

                    {/* Hot Amber Core Plume Gradient for Superheated Steam */}
                    <linearGradient id="steamHotCoreGrad" x1="160" y1="220" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFF7ED" stopOpacity="0.95" />
                      <stop offset="30%" stopColor="#FED7AA" stopOpacity="0.85" />
                      <stop offset="70%" stopColor="#E2E8F0" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0" />
                    </linearGradient>

                    {/* Smoky Slate Shadow Plume Gradient */}
                    <linearGradient id="steamSmokyGrad" x1="160" y1="220" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.9" />
                      <stop offset="40%" stopColor="#94A3B8" stopOpacity="0.75" />
                      <stop offset="75%" stopColor="#64748B" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#475569" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Render only the active independent thick rounded steam streams according to current pressCount */}
                  {STEAM_STREAMS.filter((stream) => pressCount >= stream.minLevel).map((stream) => {
                    let strokeGrad = 'url(#steamVaporGrad)';
                    if (stream.isWarmCore && pressCount >= 10) {
                      strokeGrad = 'url(#steamHotCoreGrad)';
                    } else if (stream.isSmoky) {
                      strokeGrad = 'url(#steamSmokyGrad)';
                    }

                    const filterUrl =
                      stream.filterType === 'tiny'
                        ? 'url(#steamTinyBlur)'
                        : stream.filterType === 'cloud'
                        ? 'url(#steamCloudBlur)'
                        : 'url(#steamSoftBlur)';

                    return (
                      <path
                        key={stream.id}
                        d={stream.d}
                        stroke={strokeGrad}
                        strokeWidth={stream.strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        filter={filterUrl}
                        className={stream.animClass}
                        style={{
                          animationDelay: stream.delay,
                          animationDuration: stream.duration,
                          opacity: stream.opacity,
                        }}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Symmetrical Emoji-Style Silver Cooking Pot (Centered precisely at cx = 22, cy = 17) */}
              <svg
                width="40"
                height="32"
                viewBox="0 0 44 34"
                fill="none"
                className="overflow-visible drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] relative z-20"
              >
                <defs>
                  {/* Silver pot metallic body gradient */}
                  <linearGradient id="emojiPotBodyGrad" x1="7" y1="8" x2="37" y2="28" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="18%" stopColor="#F1F5F9" />
                    <stop offset="55%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  {/* Silver pot rim gradient */}
                  <linearGradient id="emojiPotRimGrad" x1="6" y1="6" x2="38" y2="10" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#E2E8F0" />
                    <stop offset="80%" stopColor="#64748B" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>

                  {/* Silver lid metallic gradient */}
                  <linearGradient id="emojiPotLidGrad" x1="6" y1="2" x2="38" y2="8" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="#F1F5F9" />
                    <stop offset="70%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  {/* Hot stew orange gradient */}
                  <linearGradient id="emojiStewGrad" x1="22" y1="6" x2="22" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFC285" />
                    <stop offset="35%" stopColor="#FF7B1C" />
                    <stop offset="100%" stopColor="#C2410C" />
                  </linearGradient>

                  {/* Molten stew highlight */}
                  <linearGradient id="emojiStewHighlight" x1="22" y1="6" x2="22" y2="20" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFF7ED" />
                    <stop offset="60%" stopColor="#FFB066" />
                    <stop offset="100%" stopColor="#FF7B1C" />
                  </linearGradient>
                </defs>

                {/* Symmetrical Left Handle Protrusion (Small metallic side grip near upper body) */}
                <rect
                  x="5"
                  y="11.5"
                  width="3.5"
                  height="3.2"
                  rx="1.2"
                  fill="url(#emojiPotRimGrad)"
                  stroke="#334155"
                  strokeWidth="0.6"
                />
                <line x1="5.6" y1="13.1" x2="8" y2="13.1" stroke="#CBD5E1" strokeWidth="0.5" />

                {/* Symmetrical Right Handle Protrusion (Small metallic side grip near upper body) */}
                <rect
                  x="35.5"
                  y="11.5"
                  width="3.5"
                  height="3.2"
                  rx="1.2"
                  fill="url(#emojiPotRimGrad)"
                  stroke="#334155"
                  strokeWidth="0.6"
                />
                <line x1="36" y1="13.1" x2="38.4" y2="13.1" stroke="#CBD5E1" strokeWidth="0.5" />

                {/* Pot Body: Symmetrical from x = 8 to x = 36, y = 8 to y = 26 (Center = (22, 17)) */}
                <rect
                  x="8"
                  y="8"
                  width="28"
                  height="18"
                  rx="5.5"
                  fill="url(#emojiPotBodyGrad)"
                  stroke="#475569"
                  strokeWidth="0.8"
                />

                {/* Left Metallic Specular Highlight */}
                <path
                  d="M 11 10 C 11 15, 12 21, 13.5 23.5"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.9"
                />

                {/* Glowing Orange Stew inside Pot Opening */}
                <g className={pressCount >= 2 ? 'liquid-surface-wobble' : ''}>
                  <ellipse
                    cx="22"
                    cy="8.5"
                    rx="14"
                    ry="2.5"
                    fill="url(#emojiStewGrad)"
                    opacity={simmeringGlowOpacity}
                  />
                  {/* Watery Surface Sheen Highlight */}
                  <ellipse
                    cx="22"
                    cy="7.8"
                    rx="9.5"
                    ry="1.3"
                    fill="url(#emojiStewHighlight)"
                    opacity={pressCount >= 2 ? 0.75 : 0.35}
                  />
                </g>

                {/* Active Boiling Simmer Bubbles inside Pot Opening (Reacting physically to bubbling) */}
                {pressCount >= 2 && (
                  <g>
                    <circle cx="18" cy="8.2" r="1.1" fill="#FFF7ED" className="stew-bubble-1" />
                    <circle cx="25" cy="8.6" r="1.3" fill="#FFF7ED" className="stew-bubble-2" />
                    <circle cx="21" cy="7.8" r="0.9" fill="#FFC285" className="stew-bubble-3" />
                  </g>
                )}
                {pressCount >= 15 && (
                  <g>
                    <circle cx="14" cy="8.4" r="1.2" fill="#FFF7ED" className="stew-bubble-2" />
                    <circle cx="29" cy="8.3" r="1.1" fill="#FFF7ED" className="stew-bubble-1" />
                    <circle cx="23.5" cy="8.8" r="0.8" fill="#FFF7ED" className="stew-bubble-3" />
                  </g>
                )}

                {/* Pot Upper Rim Lip (Centered at x = 22, y = 7.5) */}
                <rect
                  x="6.5"
                  y="6.8"
                  width="31"
                  height="3.2"
                  rx="1.6"
                  fill="url(#emojiPotRimGrad)"
                  stroke="#334155"
                  strokeWidth="0.6"
                />

                {/* ========================================================= */}
                {/* STRICT PHYSICAL CONTINUITY: ONE SOURCE LIQUID SYSTEM      */}
                {/* All liquid originates from the hot stew inside pot opening */}
                {/* (cx = 22, cy = 8.5) and flows continuously over rim       */}
                {/* down the body, cascading to the floor without gaps.       */}
                {/* ========================================================= */}

                {/* Level 3-5: Initial watery crest over right rim lip */}
                {pressCount >= 3 && (
                  <path
                    d="M 26 7 C 27.2 8, 28 9.5, 27.5 11.2 C 27 10.2, 26.2 8.2, 25.2 7 Z"
                    fill="url(#emojiStewGrad)"
                    stroke="#C2410C"
                    strokeWidth="0.25"
                    className="liquid-stream-pulse-1"
                  />
                )}

                {/* Level 6-9: Stream 1 (Right Front) flows down upper-body (y=7 to 16) with watery fluid wave */}
                {pressCount >= 6 && (
                  <path
                    d="M 26 7 C 27.4 9.8, 28.2 12.8, 27.7 16.2 C 26.9 15.4, 25.8 12.2, 25.2 7 Z"
                    fill="url(#emojiStewGrad)"
                    stroke="#C2410C"
                    strokeWidth="0.3"
                    className="liquid-stream-pulse-1"
                  />
                )}

                {/* Level 10-13: Stream 2 (Left Front) crests rim and flows down to y=16 */}
                {pressCount >= 10 && (
                  <path
                    d="M 15.2 7 C 14.1 9.8, 13.3 12.8, 13.9 16.2 C 14.7 15.4, 15.7 12.2, 16 7 Z"
                    fill="url(#emojiStewGrad)"
                    stroke="#C2410C"
                    strokeWidth="0.3"
                    className="liquid-stream-pulse-2"
                  />
                )}

                {/* Level 14-17: Stream 1 advances to mid-lower body (y=7 to 21) */}
                {pressCount >= 14 && (
                  <g className="liquid-stream-pulse-1">
                    <path
                      d="M 26 7 C 27.6 11, 28.7 16.2, 28.1 21.2 C 27.2 21, 26 16, 25.2 7 Z"
                      fill="url(#emojiStewHighlight)"
                      stroke="#C2410C"
                      strokeWidth="0.35"
                    />
                    <ellipse cx="27.4" cy="18" rx="0.6" ry="1.2" fill="#FFFFFF" opacity="0.75" />
                  </g>
                )}

                {/* Level 18-21: Stream 2 advances to y=21 + Center front tongue crests rim (y=7 to 15) */}
                {pressCount >= 18 && (
                  <g>
                    <g className="liquid-stream-pulse-2">
                      <path
                        d="M 15.2 7 C 13.6 11, 12.8 16.2, 13.6 21.2 C 14.4 21, 15.4 16, 16 7 Z"
                        fill="url(#emojiStewHighlight)"
                        stroke="#C2410C"
                        strokeWidth="0.35"
                      />
                      <ellipse cx="14.3" cy="18" rx="0.6" ry="1.2" fill="#FFFFFF" opacity="0.75" />
                    </g>
                    <path
                      d="M 20.4 7 C 21 10.2, 23.2 10.2, 23.6 7 C 23.8 11.2, 23.2 15.2, 22 15.2 C 20.8 15.2, 20.2 11.2, 20.4 7 Z"
                      fill="url(#emojiStewGrad)"
                      stroke="#C2410C"
                      strokeWidth="0.3"
                      className="liquid-stream-pulse-center"
                    />
                  </g>
                )}

                {/* Level 22-24: Stream 1 reaches pot bottom (y=26) and forms a heavy pendant drop */}
                {pressCount >= 22 && (
                  <g className="liquid-stream-pulse-1">
                    <path
                      d="M 26 7 C 27.8 12, 28.7 19, 28.1 26.2 C 27 26.2, 25.9 19, 25.2 7 Z"
                      fill="url(#emojiStewGrad)"
                      stroke="#C2410C"
                      strokeWidth="0.4"
                    />
                    <path
                      d="M 28.1 26.2 C 28.6 27.6, 27.9 28.8, 27.5 29.3 C 27.1 28.8, 26.5 27.6, 27 26.2 Z"
                      fill="url(#emojiStewHighlight)"
                      className="droplet-stretch-wobble"
                    />
                    <circle cx="27.5" cy="28.4" r="0.4" fill="#FFFFFF" opacity="0.8" />
                  </g>
                )}

                {/* Level 25-27: Stream 2 reaches pot bottom (y=26) and forms pendant drop + Center tongue reaches y=22 */}
                {pressCount >= 25 && (
                  <g>
                    <g className="liquid-stream-pulse-2">
                      <path
                        d="M 15.2 7 C 13.4 12, 12.6 19, 13.6 26.2 C 14.6 26.2, 15.6 19, 16 7 Z"
                        fill="url(#emojiStewGrad)"
                        stroke="#C2410C"
                        strokeWidth="0.4"
                      />
                      <path
                        d="M 13.6 26.2 C 13.1 27.6, 13.7 28.8, 14.1 29.3 C 14.5 28.8, 15.1 27.6, 14.6 26.2 Z"
                        fill="url(#emojiStewHighlight)"
                        className="droplet-stretch-wobble"
                      />
                      <circle cx="14.1" cy="28.4" r="0.4" fill="#FFFFFF" opacity="0.8" />
                    </g>
                    <path
                      d="M 20.4 7 C 21 12, 23.6 12, 23.6 7 C 24 13, 23.6 18.2, 22.4 22.2 C 21.4 22.2, 20.6 17.2, 20.4 7 Z"
                      fill="url(#emojiStewHighlight)"
                      stroke="#C2410C"
                      strokeWidth="0.35"
                      className="liquid-stream-pulse-center"
                    />
                  </g>
                )}

                {/* Level 28-34: Continuous Right Gravity Cascade touches floor (from pot bottom y=26 straight to floor y=38) */}
                {pressCount >= 28 && (
                  <g className="gravity-drip-flow">
                    <path
                      d="M 27.5 26 C 27.9 29.8, 27.1 34.2, 27.5 38"
                      stroke="url(#emojiStewGrad)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M 27.5 26 C 27.9 29.8, 27.1 34.2, 27.5 38"
                      stroke="url(#emojiStewHighlight)"
                      strokeWidth="0.6"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="27.5" cy="32" r="0.95" fill="#FFC285" className="drip-droplet-bead-1" />
                    <circle cx="27.5" cy="37" r="0.75" fill="#FFF7ED" className="drip-droplet-bead-2" />
                  </g>
                )}

                {/* Level 35-41: Continuous Left Gravity Cascade touches floor (from pot bottom y=26 straight to floor y=38) */}
                {pressCount >= 35 && (
                  <g className="gravity-drip-flow-2">
                    <path
                      d="M 14 26 C 13.6 29.8, 14.4 34.2, 14 38"
                      stroke="url(#emojiStewGrad)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M 14 26 C 13.6 29.8, 14.4 34.2, 14 38"
                      stroke="url(#emojiStewHighlight)"
                      strokeWidth="0.6"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="14" cy="32" r="0.95" fill="#FFC285" className="drip-droplet-bead-1" />
                    <circle cx="14" cy="37" r="0.75" fill="#FFF7ED" className="drip-droplet-bead-2" />
                  </g>
                )}

                {/* Level 42-45: Center Heavy Waterfall plunges continuously from rim down front to floor (y=38) */}
                {pressCount >= 42 && (
                  <g className="gravity-drip-flow-center">
                    <path
                      d="M 22 15 C 22.4 22, 21.6 30, 22 38"
                      stroke="url(#emojiStewHighlight)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="22" cy="28" r="1.1" fill="#FFF7ED" className="drip-droplet-bead-1" />
                    <circle cx="22" cy="35" r="0.9" fill="#FFE4CC" className="drip-droplet-bead-2" />
                  </g>
                )}

                {/* Level 46-50: Outer Right Flank Continuous Overflow down to floor */}
                {pressCount >= 46 && (
                  <g className="gravity-drip-flow">
                    <path
                      d="M 34 8 C 35.1 14, 35.6 22, 34.6 28 C 34.1 32, 34.6 36, 34 38"
                      stroke="url(#emojiStewGrad)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="34.3" cy="33" r="0.7" fill="#FFC285" className="drip-droplet-bead-1" />
                  </g>
                )}

                {/* Level 48-50: Outer Left Flank Continuous Overflow down to floor */}
                {pressCount >= 48 && (
                  <g className="gravity-drip-flow-2">
                    <path
                      d="M 10 8 C 8.9 14, 8.4 22, 9.4 28 C 9.9 32, 9.4 36, 10 38"
                      stroke="url(#emojiStewGrad)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="9.7" cy="33" r="0.7" fill="#FFC285" className="drip-droplet-bead-2" />
                  </g>
                )}

                {/* Symmetrical Pot Lid with Knob (Lifts subtly & wobbles with boiling pressure, centered at x = 22) */}
                <g
                  className={isBoiling ? 'lid-simmer-wobble' : ''}
                  style={{
                    transform: `translateY(${lidTranslateY}px)`,
                    transformOrigin: '22px 6px',
                  }}
                >
                  {/* Symmetrical Knob centered at cx = 22 */}
                  <ellipse cx="22" cy="2" rx="2.5" ry="1.6" fill="#1E293B" stroke="#475569" strokeWidth="0.6" />
                  <rect x="21" y="2.5" width="2" height="2" fill="#334155" />

                  {/* Symmetrical Lid Dome centered from x = 6 to x = 38 (center = 22) */}
                  <path
                    d="M 6 6.5 C 10 2.5, 34 2.5, 38 6.5 L 36.5 8 H 7.5 L 6 6.5 Z"
                    fill="url(#emojiPotLidGrad)"
                    stroke="#475569"
                    strokeWidth="0.75"
                  />
                  <line x1="7.5" y1="7.5" x2="36.5" y2="7.5" stroke="#334155" strokeWidth="0.5" />
                </g>
              </svg>

              {/* High-End Physics Accumulating Floor Spill */}
              {/* Formed STRICTLY by incoming liquid streams touching down at Level >= 28, expanding organically without single-object scaling */}
              {pressCount >= 28 && (
                <div
                  className="absolute top-[100%] left-1/2 -translate-x-1/2 pointer-events-none z-10 overflow-visible w-[560px] h-[36px] flex justify-center"
                >
                  <svg
                    width="560"
                    height="36"
                    viewBox="0 0 560 36"
                    fill="none"
                    className="overflow-visible drop-shadow-[0_2px_14px_rgba(255,123,28,0.7)]"
                  >
                    <defs>
                      <linearGradient id="puddleFluidGrad" x1="0" y1="18" x2="560" y2="18" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FF7B1C" stopOpacity="0" />
                        <stop offset="10%" stopColor="#C2410C" stopOpacity="0.8" />
                        <stop offset="35%" stopColor="#FF7B1C" stopOpacity="0.95" />
                        <stop offset="50%" stopColor="#FFB066" stopOpacity="1" />
                        <stop offset="65%" stopColor="#FF7B1C" stopOpacity="0.95" />
                        <stop offset="90%" stopColor="#C2410C" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#FF7B1C" stopOpacity="0" />
                      </linearGradient>

                      <linearGradient id="puddleCoreHighlight" x1="200" y1="18" x2="360" y2="18" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFE4CC" stopOpacity="0" />
                        <stop offset="30%" stopColor="#FFE4CC" stopOpacity="0.85" />
                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.98" />
                        <stop offset="70%" stopColor="#FFE4CC" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#FFE4CC" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Stage 1: Initial Right Stream Contact Landing Pool (Level >= 28) */}
                    {pressCount >= 28 && (
                      <path
                        d="M 270 18 C 280 13, 305 12, 318 17 C 312 22, 285 23, 268 21 C 265 20, 265 19, 270 18 Z"
                        fill="url(#puddleFluidGrad)"
                      />
                    )}

                    {/* Active Ripple Rings at Right Stream Touchdown Point (Level >= 28) */}
                    {pressCount >= 28 && (
                      <ellipse cx="295" cy="18" rx="7" ry="3" stroke="#FFF7ED" strokeWidth="0.8" className="puddle-ripple-1" />
                    )}

                    {/* Stage 2: Left Stream Contact Landing Pool & Connecting Channel (Level >= 35) */}
                    {pressCount >= 35 && (
                      <path
                        d="M 235 18 C 245 12, 275 12, 290 17 C 280 23, 245 24, 230 21 C 225 19, 230 18, 235 18 Z"
                        fill="url(#puddleFluidGrad)"
                      />
                    )}

                    {/* Active Ripple Rings at Left Stream Touchdown Point (Level >= 35) */}
                    {pressCount >= 35 && (
                      <ellipse cx="260" cy="18" rx="7" ry="3" stroke="#FFF7ED" strokeWidth="0.8" className="puddle-ripple-2" />
                    )}

                    {/* Stage 3: Center Heavy Waterfall Plunge Pool & Deep Reservoir (Level >= 42) */}
                    {pressCount >= 42 && (
                      <g>
                        <path
                          d="M 200 18 C 230 9, 330 9, 360 18 C 340 27, 220 27, 200 18 Z"
                          fill="url(#puddleFluidGrad)"
                        />
                        <path
                          d="M 240 18 C 260 13, 300 13, 320 18 C 300 22, 260 22, 240 18 Z"
                          fill="url(#puddleCoreHighlight)"
                          opacity="0.9"
                        />
                        <ellipse cx="280" cy="18" rx="11" ry="4.2" stroke="#FFFFFF" strokeWidth="1.0" className="puddle-ripple-1" />
                      </g>
                    )}

                    {/* Stage 4: Lateral Left & Right Spreading Fluid Lobes (Level >= 46) */}
                    {pressCount >= 46 && (
                      <g>
                        <path
                          d="M 140 18 C 165 10, 215 12, 230 18 C 210 25, 160 24, 135 20 C 130 19, 135 18, 140 18 Z"
                          fill="url(#puddleFluidGrad)"
                        />
                        <path
                          d="M 340 18 C 360 12, 410 10, 425 18 C 410 25, 360 24, 335 20 Z"
                          fill="url(#puddleFluidGrad)"
                        />
                      </g>
                    )}

                    {/* Stage 5: Massive Screen-Spanning Fluid Flood (Levels 49–50) */}
                    {pressCount >= 49 && (
                      <g>
                        <path
                          d="M 35 18 C 80 8, 150 12, 190 18 C 160 26, 70 25, 30 20 C 25 19, 30 18, 35 18 Z"
                          fill="url(#puddleFluidGrad)"
                        />
                        <path
                          d="M 380 18 C 420 12, 490 8, 530 18 C 500 26, 420 25, 375 20 Z"
                          fill="url(#puddleFluidGrad)"
                        />
                        {/* Shimmering Surface Sheen across the entire flood */}
                        <path
                          d="M 80 18 C 170 13, 390 13, 480 18 C 400 21, 160 21, 80 18 Z"
                          fill="url(#puddleCoreHighlight)"
                          opacity="0.8"
                        />
                      </g>
                    )}
                  </svg>
                </div>
              )}
            </div>

            {/* Current Fill Leading Edge Sparks (Burning Wick Sparks) */}
            {/* Clean rounded cut of the line itself — white circular bead removed, all sparks preserved */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 translate-x-1/2 pointer-events-none z-20 transition-transform duration-200 ${
                isSparkBurst ? 'scale-125' : 'scale-100'
              }`}
              style={{ right: `${fillPercent}%` }}
            >
              {/* Burning Wick Spark Embers */}
              <div className="absolute -top-1 right-1/2 translate-x-1/2 pointer-events-none motion-reduce:hidden">
                <span className="wick-spark spark-1" />
                <span className="wick-spark spark-2" />
                <span className="wick-spark spark-3" />
                <span className="wick-spark spark-4" />
                <span className="wick-spark spark-5" />
                <span className="wick-spark spark-6" />
                <span className="wick-spark spark-7" />
                <span className="wick-spark spark-8" />
              </div>
            </div>
          </div>

          {/* 7 Day Labels directly aligned under each node in RTL */}
          <div className="relative w-full mt-1.5 h-8 text-[11px] sm:text-xs">
            {DAYS.map((day) => {
              const isThu = day.isThu;

              return (
                <div
                  key={day.index}
                  className="absolute top-0 translate-x-1/2 flex flex-col items-center pointer-events-none text-center"
                  style={{ right: `${day.positionPercent}%` }}
                >
                  {isThu ? (
                    <div className="flex flex-col items-center leading-tight">
                      <span className="text-[#FF7B1C] font-bold text-[11px] sm:text-xs">
                        {day.label.line1[lang]}
                      </span>
                      <span className="text-[#FF7B1C] font-bold text-[11px] sm:text-xs mt-0.5">
                        {day.label.line2 ? day.label.line2[lang] : ''}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#94A3B8] font-medium leading-none">
                      {day.label.line1[lang]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightweight High-End Physics CSS Keyframes for Steam, Simmer, Liquid Drips, and Accumulating Puddle */}
      <style>{`
        /* Idle Calm Steam Animations (Level 0): very subtle, short, calm & compact gentle rise directly above pot */
        @keyframes steam-idle-anim-1 {
          0% {
            transform: translateY(0) scale(0.96, 0.96);
            opacity: 0.12;
          }
          40% {
            opacity: 0.35;
            transform: translateY(-2.5px) skewX(0.8deg) scale(1.02, 1.02);
          }
          75% {
            opacity: 0.22;
            transform: translateY(-5px) skewX(-0.8deg) scale(1.06, 1.04);
          }
          100% {
            transform: translateY(-8px) skewX(1.2deg) scale(1.1, 1.08);
            opacity: 0;
          }
        }

        @keyframes steam-idle-anim-2 {
          0% {
            transform: translateY(0) scale(0.96, 0.96);
            opacity: 0.08;
          }
          45% {
            opacity: 0.26;
            transform: translateY(-2px) skewX(-0.8deg) scale(1.02, 1.02);
          }
          80% {
            opacity: 0.15;
            transform: translateY(-4.5px) skewX(0.8deg) scale(1.05, 1.03);
          }
          100% {
            transform: translateY(-7px) skewX(-1deg) scale(1.08, 1.06);
            opacity: 0;
          }
        }

        .steam-idle-1 {
          transform-origin: 160px 218px;
          animation: steam-idle-anim-1 3.4s infinite ease-in-out;
        }

        .steam-idle-2 {
          transform-origin: 158.5px 218px;
          animation: steam-idle-anim-2 3.8s infinite ease-in-out;
        }

        /* Steam Stream Wave Animations: smooth curved waves, gentle rolling lift, widening & soft natural dispersion */
        @keyframes steam-stream-anim-1 {
          0% {
            transform: translateY(0) skewX(-2.5deg) scale(0.9, 0.94);
            opacity: 0.12;
          }
          30% {
            opacity: 0.85;
            transform: translateY(-9px) skewX(2.8deg) scale(1.06, 1.04);
          }
          65% {
            opacity: 0.6;
            transform: translateY(-23px) skewX(-2.2deg) scale(1.18, 1.15);
          }
          100% {
            transform: translateY(-40px) skewX(3.5deg) scale(1.32, 1.28);
            opacity: 0;
          }
        }

        @keyframes steam-stream-anim-2 {
          0% {
            transform: translateY(0) skewX(2.8deg) scale(0.88, 0.92);
            opacity: 0.18;
          }
          35% {
            opacity: 0.9;
            transform: translateY(-11px) skewX(-3.8deg) scale(1.1, 1.07);
          }
          70% {
            opacity: 0.65;
            transform: translateY(-26px) skewX(2.8deg) scale(1.22, 1.18);
          }
          100% {
            transform: translateY(-44px) skewX(-4.8deg) scale(1.36, 1.3);
            opacity: 0;
          }
        }

        @keyframes steam-stream-anim-3 {
          0% {
            transform: translateY(0) skewX(-2deg) scale(0.9, 0.93);
            opacity: 0.15;
          }
          32% {
            opacity: 0.82;
            transform: translateY(-10px) skewX(2.4deg) scale(1.08, 1.05);
          }
          68% {
            opacity: 0.55;
            transform: translateY(-25px) skewX(-2.8deg) scale(1.2, 1.16);
          }
          100% {
            transform: translateY(-42px) skewX(3.2deg) scale(1.34, 1.28);
            opacity: 0;
          }
        }

        @keyframes steam-stream-anim-4 {
          0% {
            transform: translateY(0) skewX(2.2deg) scale(0.86, 0.9);
            opacity: 0.1;
          }
          38% {
            opacity: 0.85;
            transform: translateY(-13px) skewX(-3.2deg) scale(1.12, 1.09);
          }
          72% {
            opacity: 0.5;
            transform: translateY(-29px) skewX(3.8deg) scale(1.26, 1.22);
          }
          100% {
            transform: translateY(-48px) skewX(-3.8deg) scale(1.4, 1.34);
            opacity: 0;
          }
        }

        .steam-stream-1 {
          transform-origin: 160px 220px;
          animation: steam-stream-anim-1 infinite ease-out;
        }

        .steam-stream-2 {
          transform-origin: 160px 220px;
          animation: steam-stream-anim-2 infinite ease-out;
        }

        .steam-stream-3 {
          transform-origin: 160px 220px;
          animation: steam-stream-anim-3 infinite ease-out;
        }

        .steam-stream-4 {
          transform-origin: 160px 220px;
          animation: steam-stream-anim-4 infinite ease-out;
        }

        /* Boiling Simmer Bubbles at Pot Opening */
        @keyframes simmer-bubble-pop {
          0% { transform: scale(0.5) translateY(0.5px); opacity: 0.3; }
          50% { transform: scale(1.35) translateY(-0.8px); opacity: 1; }
          100% { transform: scale(0.7) translateY(-1.2px); opacity: 0.3; }
        }

        .stew-bubble-1 {
          animation: simmer-bubble-pop 0.55s infinite ease-in-out;
          transform-origin: 18px 8.2px;
        }
        .stew-bubble-2 {
          animation: simmer-bubble-pop 0.7s infinite ease-in-out;
          animation-delay: 0.18s;
          transform-origin: 25px 8.6px;
        }
        .stew-bubble-3 {
          animation: simmer-bubble-pop 0.5s infinite ease-in-out;
          animation-delay: 0.32s;
          transform-origin: 21px 7.8px;
        }

        /* Watery Stew Surface Wobble & Bounce under bubbling */
        @keyframes stew-wobble-fluid {
          0% { transform: scale(1, 1) translateY(0); }
          25% { transform: scale(1.02, 1.1) translateY(-0.3px); }
          50% { transform: scale(0.98, 0.92) translateY(0.2px); }
          75% { transform: scale(1.01, 1.05) translateY(-0.15px); }
          100% { transform: scale(1, 1) translateY(0); }
        }

        .stew-surface-wobble {
          animation: stew-wobble-fluid 0.65s infinite ease-in-out;
          transform-origin: 22px 8.5px;
        }

        /* Fluid Stream Stretching & Pulsing */
        @keyframes liquid-pulse-1 {
          0% { transform: scaleY(1) skewX(0deg); opacity: 0.9; }
          50% { transform: scaleY(1.04) skewX(0.5deg); opacity: 1; }
          100% { transform: scaleY(1) skewX(0deg); opacity: 0.9; }
        }

        @keyframes liquid-pulse-2 {
          0% { transform: scaleY(1) skewX(0deg); opacity: 0.9; }
          50% { transform: scaleY(1.04) skewX(-0.5deg); opacity: 1; }
          100% { transform: scaleY(1) skewX(0deg); opacity: 0.9; }
        }

        .liquid-stream-pulse-1 {
          animation: liquid-pulse-1 0.75s infinite ease-in-out;
          transform-origin: 26px 7px;
        }
        .liquid-stream-pulse-2 {
          animation: liquid-pulse-2 0.85s infinite ease-in-out;
          animation-delay: 0.2s;
          transform-origin: 15px 7px;
        }
        .liquid-stream-pulse-center {
          animation: liquid-pulse-1 0.6s infinite ease-in-out;
          animation-delay: 0.1s;
          transform-origin: 22px 7px;
        }

        /* Pendant Droplet Stretch & Wobble */
        @keyframes droplet-wobble {
          0% { transform: scale(1, 1); }
          50% { transform: scale(1.1, 1.25) translateY(0.4px); }
          100% { transform: scale(1, 1); }
        }

        .droplet-stretch-wobble {
          animation: droplet-wobble 0.5s infinite ease-in-out;
          transform-origin: center top;
        }

        /* Lid Simmer Wobble under boiling pressure */
        @keyframes lid-rattle {
          0% { transform: translateY(var(--lid-y, 0px)) rotate(0deg); }
          25% { transform: translateY(calc(var(--lid-y, 0px) - 0.5px)) rotate(-0.7deg); }
          75% { transform: translateY(calc(var(--lid-y, 0px) - 0.2px)) rotate(0.8deg); }
          100% { transform: translateY(var(--lid-y, 0px)) rotate(0deg); }
        }

        .lid-simmer-wobble {
          animation: lid-rattle 0.16s infinite ease-in-out;
          transform-origin: 22px 6px;
        }

        /* Gravity Drip Flow downwards with fluid stretch & bead travel */
        @keyframes drip-flow-down {
          0% { transform: scaleY(0.96) translateY(0); opacity: 0.85; }
          50% { transform: scaleY(1.04) translateY(1.2px); opacity: 1; }
          100% { transform: scaleY(0.96) translateY(0); opacity: 0.85; }
        }

        .gravity-drip-flow {
          animation: drip-flow-down 0.42s infinite ease-in-out;
          transform-origin: 27.5px 26px;
        }
        .gravity-drip-flow-2 {
          animation: drip-flow-down 0.48s infinite ease-in-out;
          animation-delay: 0.15s;
          transform-origin: 14px 26px;
        }
        .gravity-drip-flow-center {
          animation: drip-flow-down 0.38s infinite ease-in-out;
          animation-delay: 0.08s;
          transform-origin: 22px 15px;
        }

        /* Falling Droplet Beads inside continuous cascade */
        @keyframes drip-bead-fall-1 {
          0% { transform: translateY(0); opacity: 0.9; }
          50% { transform: translateY(2.5px); opacity: 1; }
          100% { transform: translateY(5px); opacity: 0.7; }
        }
        @keyframes drip-bead-fall-2 {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(3px); opacity: 1; }
          100% { transform: translateY(6px); opacity: 0.6; }
        }

        .drip-droplet-bead-1 {
          animation: drip-bead-fall-1 0.45s infinite linear;
          transform-origin: center;
        }
        .drip-droplet-bead-2 {
          animation: drip-bead-fall-2 0.45s infinite linear;
          animation-delay: 0.22s;
          transform-origin: center;
        }

        /* Puddle Concentric Impact Ripples */
        @keyframes puddle-impact-expand-1 {
          0% { transform: scale(0.35); opacity: 0.95; }
          100% { transform: scale(1.9); opacity: 0; }
        }

        @keyframes puddle-impact-expand-2 {
          0% { transform: scale(0.45); opacity: 0.9; }
          100% { transform: scale(2.0); opacity: 0; }
        }

        .puddle-ripple-1 {
          animation: puddle-impact-expand-1 0.8s infinite cubic-bezier(0.1, 0.7, 0.4, 1);
          transform-origin: center;
        }
        .puddle-ripple-2 {
          animation: puddle-impact-expand-2 0.9s infinite cubic-bezier(0.1, 0.7, 0.4, 1);
          animation-delay: 0.28s;
          transform-origin: center;
        }

        /* Burning Wick Spark Embers */
        .wick-spark {
          position: absolute;
          bottom: 0;
          right: 50%;
          border-radius: 9999px;
          pointer-events: none;
          opacity: 0;
        }

        .spark-1 {
          width: 1.5px;
          height: 1.5px;
          background: #FFF;
          box-shadow: 0 0 3px #FF7B1C;
          animation: spark-anim-1 0.8s infinite linear;
          animation-delay: 0s;
        }
        .spark-2 {
          width: 2px;
          height: 2px;
          background: #FFB066;
          box-shadow: 0 0 4px #FF7B1C;
          animation: spark-anim-2 0.9s infinite ease-out;
          animation-delay: 0.15s;
        }
        .spark-3 {
          width: 1.5px;
          height: 1.5px;
          background: #FFF;
          box-shadow: 0 0 3px #FF7B1C;
          animation: spark-anim-3 0.75s infinite linear;
          animation-delay: 0.3s;
        }
        .spark-4 {
          width: 2px;
          height: 2px;
          background: #FF7B1C;
          box-shadow: 0 0 4px #FF7B1C;
          animation: spark-anim-4 0.85s infinite ease-out;
          animation-delay: 0.45s;
        }
        .spark-5 {
          width: 1.5px;
          height: 1.5px;
          background: #FFF;
          box-shadow: 0 0 3px #FF7B1C;
          animation: spark-anim-5 0.95s infinite linear;
          animation-delay: 0.6s;
        }
        .spark-6 {
          width: 1.5px;
          height: 1.5px;
          background: #FFB066;
          box-shadow: 0 0 3px #FF7B1C;
          animation: spark-anim-6 0.7s infinite ease-out;
          animation-delay: 0.2s;
        }
        .spark-7 {
          width: 1.5px;
          height: 1.5px;
          background: #FFF;
          box-shadow: 0 0 3px #FF7B1C;
          animation: spark-anim-1 0.8s infinite linear;
          animation-delay: 0.5s;
        }
        .spark-8 {
          width: 2px;
          height: 2px;
          background: #FF7B1C;
          box-shadow: 0 0 4px #FF7B1C;
          animation: spark-anim-2 0.9s infinite ease-out;
          animation-delay: 0.7s;
        }

        @keyframes spark-anim-1 {
          0% { transform: translate(50%, 0) scale(1); opacity: 1; }
          40% { opacity: 0.9; }
          100% { transform: translate(calc(50% + 12px), -22px) scale(0.2); opacity: 0; }
        }
        @keyframes spark-anim-2 {
          0% { transform: translate(50%, 0) scale(1.1); opacity: 1; }
          50% { opacity: 0.85; }
          100% { transform: translate(calc(50% - 14px), -26px) scale(0.2); opacity: 0; }
        }
        @keyframes spark-anim-3 {
          0% { transform: translate(50%, 0) scale(1); opacity: 1; }
          40% { opacity: 1; }
          100% { transform: translate(calc(50% + 3px), -28px) scale(0.2); opacity: 0; }
        }
        @keyframes spark-anim-4 {
          0% { transform: translate(50%, 0) scale(1); opacity: 1; }
          50% { opacity: 0.8; }
          100% { transform: translate(calc(50% - 6px), -18px) scale(0.2); opacity: 0; }
        }
        @keyframes spark-anim-5 {
          0% { transform: translate(50%, 0) scale(1); opacity: 1; }
          40% { opacity: 0.9; }
          100% { transform: translate(calc(50% + 16px), -16px) scale(0.2); opacity: 0; }
        }
        @keyframes spark-anim-6 {
          0% { transform: translate(50%, 0) scale(1); opacity: 1; }
          50% { opacity: 0.85; }
          100% { transform: translate(calc(50% - 18px), -20px) scale(0.2); opacity: 0; }
        }
      `}</style>
    </aside>
  );
};
