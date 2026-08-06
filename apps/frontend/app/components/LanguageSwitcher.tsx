'use client';

import { useState } from 'react';
import './LanguageSwitcher.css';

const SwedenFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="16" fill="#006AA7"/>
    <rect width="24" height="4" y="6" fill="#FFCD00"/>
    <rect width="4" height="16" x="5" fill="#FFCD00"/>
    <rect width="24" height="16" fill="none" stroke="#333" strokeWidth="0.5"/>
  </svg>
);

const UKFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="16" fill="#FFFFFF"/>
    <rect width="24" height="4" y="6" fill="#CE1126"/>
    <rect width="4" height="16" x="10" fill="#CE1126"/>
    <rect width="24" height="16" fill="none" stroke="#333" strokeWidth="0.5"/>
  </svg>
);

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState('SV');
  const [isAnimating, setIsAnimating] = useState(false);

  const switchLanguage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentLocale(currentLocale === 'SV' ? 'EN' : 'SV');
      setIsAnimating(false);
    }, 150);
  };

  return (
    <button
      onClick={switchLanguage}
      className={`flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-black transition-colors ${isAnimating ? 'language-flip' : ''}`}
      style={{ minWidth: '48px' }}
      aria-label="Byt språk"
      disabled={isAnimating}
    >
      {currentLocale === 'SV' ? <SwedenFlag /> : <UKFlag />}
      {currentLocale === 'SV' ? 'SV' : 'EN'}
    </button>
  );
}
