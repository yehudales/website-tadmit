import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'symbol';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-16 w-auto',
  variant = 'full',
  showSubtitle = true
}) => {
  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      <img
        src="/assets/images/logo.svg"
        alt="יהודלס - הצ'ולנט הכי טעים בעיר"
        className="h-full w-auto max-h-full object-contain filter drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]"
        width="280"
        height="120"
        loading="eager"
      />
    </div>
  );
};
