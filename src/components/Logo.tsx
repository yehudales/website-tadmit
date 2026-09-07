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
        src="/assets/images/logo hige q.svg"
        alt="יהודלס"
        className="h-full w-auto max-h-full object-contain"
        loading="eager"
      />
    </div>
  );
};
