
import React from 'react';

export const SparkleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c.321.64.321 1.415 0 2.055a.75.75 0 01-1.06 1.06-8.995 8.995 0 00-2.312 3.022c-.529 1.026-.955 2.158-1.295 3.336a.75.75 0 01-1.341.246c-.366-.787-.73-1.618-1.128-2.494a.75.75 0 01.246-1.341 8.995 8.995 0 003.022-2.312c1.026-.529 2.158-.955 3.336-1.295a.75.75 0 011.06 1.061 8.995 8.995 0 00-2.312 3.022c-.529 1.026-.955 2.158-1.295 3.336a.75.75 0 01-1.341.246c-.366-.787-.73-1.618-1.128-2.494a.75.75 0 01.246-1.341 8.995 8.995 0 003.022-2.312c1.026-.529 2.158-.955 3.336-1.295a.75.75 0 01.246 1.341zM16.949 9.182a.75.75 0 011.06 0c.32.641.32 1.415 0 2.056a.75.75 0 01-1.06 1.06 8.995 8.995 0 00-2.312 3.022c-.529 1.026-.955 2.158-1.295 3.336a.75.75 0 01-1.341.246c-.366-.787-.73-1.618-1.128-2.494a.75.75 0 01.246-1.341 8.995 8.995 0 003.022-2.312c1.026-.529 2.158-.955 3.336-1.295a.75.75 0 01.246 1.341z"
      clipRule="evenodd"
    />
  </svg>
);

export const HeartIcon = ({ className, isFavorite }: { className?: string, isFavorite: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={isFavorite ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const CalendarIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor" 
        className={className}
    >
        <path fillRule="evenodd" d="M5.75 3a.75.75 0 01.75.75V4h7V3.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5v-.25A.75.75 0 015.75 3zM4.5 8.25a.75.75 0 000 1.5h11a.75.75 0 000-1.5h-11z" clipRule="evenodd" />
    </svg>
);