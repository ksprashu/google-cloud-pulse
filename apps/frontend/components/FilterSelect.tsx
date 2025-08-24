import React from 'react';

const FilterSelect: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  allLabel?: string;
  children?: React.ReactNode;
}> = ({ label, value, onChange, options, allLabel = 'All', children }) => (
  <div className="flex-1 min-w-[150px]">
    <label
      htmlFor={label}
      className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
    >
      {label}
    </label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
    >
      {children ? (
        children
      ) : (
        <>
          <option value="all">{allLabel}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </>
      )}
    </select>
  </div>
);

export default FilterSelect;
