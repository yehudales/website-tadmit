import React from 'react';

export type ArrowDirection = 'left' | 'right' | 'up' | 'down' | 'back';

export interface CanonicalArrowProps {
  direction?: ArrowDirection;
  className?: string;
  strokeWidth?: number;
  lang?: 'he' | 'en';
  style?: React.CSSProperties;
}

/**
 * Canonical Line-Based Arrow for YEHUDALES'.NET
 * Standardized across the entire application for navigation, back, return, and drawer close/return.
 * 
 * Specifications:
 * - Simple, thin line construction
 * - Arrowhead constructed strictly from lines (no filled triangle, no solid arrowhead)
 * - Proportional line stem (no long decorative tail, no bulky icon)
 * - NOT a chevron alone (contains the balanced stem line)
 * - Canonical stroke width: 2.2 with rounded caps and joins
 * - Full RTL support: when direction="back", resolves toward previous screen/product
 *   (points 'right' in Hebrew RTL, 'left' in LTR)
 */
export const CanonicalArrow: React.FC<CanonicalArrowProps> = ({
  direction = 'back',
  className = 'w-4 h-4',
  strokeWidth = 2.2,
  lang = 'he',
  style,
}) => {
  // Determine effective direction:
  // In RTL (Hebrew), "back" / "previous" points right (→).
  // In LTR (English), "back" / "previous" points left (←).
  let effectiveDirection: 'left' | 'right' | 'up' | 'down' = 'left';
  if (direction === 'back') {
    effectiveDirection = lang === 'he' ? 'right' : 'left';
  } else if (direction === 'right' || direction === 'up' || direction === 'down') {
    effectiveDirection = direction;
  } else {
    effectiveDirection = 'left';
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {effectiveDirection === 'left' && (
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      )}
      {effectiveDirection === 'right' && (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      )}
      {effectiveDirection === 'up' && (
        <>
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </>
      )}
      {effectiveDirection === 'down' && (
        <>
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </>
      )}
    </svg>
  );
};
