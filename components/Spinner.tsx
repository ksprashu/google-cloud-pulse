import React from 'react';

const Spinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Analyzing Release Notes...</p>
  </div>
);

export default Spinner;