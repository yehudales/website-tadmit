import React from 'react';

interface DownwardArrowNoTailProps {
  className?: string;
}

/**
 * Downward arrow without a vertical tail/stem.
 * Features a distinct arrow head pointing downward (triangle head with subtle rounded corners).
 * Meets the strict requirement:
 * - Visually: ↓
 * - Arrow shape with arrow head
 * - NO vertical tail/stem
 * - NOT a chevron alone
 * - NOT a standard arrow with a long tail
 * - NOT an up arrow
 * - NOT an X icon
 */
export const DownwardArrowNoTail: React.FC<DownwardArrowNoTailProps> = ({
  className = 'w-5 h-5',
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 17.5a1.2 1.2 0 0 1-1-.536L4.2 8.464A1.2 1.2 0 0 1 5.2 6.5h13.6a1.2 1.2 0 0 1 1 1.964L13 16.964a1.2 1.2 0 0 1-1 .536z" />
    </svg>
  );
};
