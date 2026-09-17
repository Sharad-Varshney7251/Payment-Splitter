import React from 'react';

export default function Logo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  }[size] || 'w-9 h-9';

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <rect width="48" height="48" rx="12" className="fill-slate-900 dark:fill-slate-900" />
        <circle cx="16" cy="16" r="6" fill="#10B981" />
        <circle cx="32" cy="32" r="6" fill="#10B981" />
        <path
          d="M34 14L14 34"
          stroke="url(#logoGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="24" cy="24" r="2.5" fill="#F8FAFC" />
        <defs>
          <linearGradient id="logoGradient" x1="12" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

