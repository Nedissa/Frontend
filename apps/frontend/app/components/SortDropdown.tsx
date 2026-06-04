'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function SortDropdown({ value, onChange, options }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-4 p-1 border border-gray-300 bg-white text-gray-700 font-semibold text-sm whitespace-nowrap"
      >
        <span>{selected?.label}</span>
        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 z-50 min-w-full">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm transition-colors whitespace-nowrap"
              style={value === option.value ? { backgroundColor: '#000000', color: '#ffffff', fontWeight: '600' } : { color: '#374151' }}
              onMouseEnter={e => { if (value !== option.value) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000000'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; } }}
              onMouseLeave={e => { if (value !== option.value) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = ''; (e.currentTarget as HTMLButtonElement).style.color = '#374151'; } }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
