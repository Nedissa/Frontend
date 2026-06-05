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
  const [width, setWidth] = useState<number | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (buttonRef.current) setWidth(buttonRef.current.offsetWidth);
  }, [selected]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-4 px-3 py-1.5 border border-gray-200 bg-white text-gray-800 text-sm whitespace-nowrap w-full"
      >
        <span>{selected?.label}</span>
        <svg className={`w-3 h-3 text-gray-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="absolute right-0 top-full mt-1 bg-white border border-gray-200 z-50 shadow-sm overflow-hidden transition-all duration-200 ease-out"
        style={{ width: width ? `${width}px` : '100%', maxHeight: open ? '300px' : '0px', opacity: open ? 1 : 0, borderWidth: open ? '1px' : '0px' }}
      >
        {options.map(option => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-sm whitespace-nowrap relative"
              style={isSelected ? { color: '#000000', fontWeight: '600' } : { color: '#374151' }}
              onMouseEnter={e => {
                const line = e.currentTarget.querySelector('.underline-anim') as HTMLElement;
                if (line) line.style.width = '100%';
              }}
              onMouseLeave={e => {
                const line = e.currentTarget.querySelector('.underline-anim') as HTMLElement;
                if (line && !isSelected) line.style.width = '0%';
              }}
            >
              <span className="relative inline-flex">
                {option.label}
                <span className="underline-anim absolute bottom-0 left-0 h-0.5 bg-black" style={{ width: isSelected ? '100%' : '0%', transition: 'width 300ms ease-out' }} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
