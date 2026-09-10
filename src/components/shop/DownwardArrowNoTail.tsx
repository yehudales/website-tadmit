import React from 'react';
import { CanonicalArrow } from '../CanonicalArrow';

interface DownwardArrowNoTailProps {
  className?: string;
}

/**
 * Standardized Downward Line Arrow
 * Replaces legacy filled-triangle with the canonical line-based arrow.
 */
export const DownwardArrowNoTail: React.FC<DownwardArrowNoTailProps> = ({
  className = 'w-5 h-5',
}) => {
  return <CanonicalArrow direction="down" className={className} strokeWidth={2.2} />;
};

