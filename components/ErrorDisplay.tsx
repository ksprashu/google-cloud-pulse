
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-6 text-center bg-red-900/20 border border-red-500 rounded-lg">
      <h2 className="text-2xl font-bold text-red-400">An Error Occurred</h2>
      <p className="mt-2 text-red-300">{message}</p>
      <p className="mt-4 text-xs text-slate-400">Please ensure your Gemini API key is correctly configured and try again.</p>
    </div>
  </div>
);

export default ErrorDisplay;
