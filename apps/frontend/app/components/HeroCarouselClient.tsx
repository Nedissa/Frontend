'use client';

import { useState, useEffect, useRef } from 'react';

interface Collection {
  title: string;
  handle: string;
}

export function HeroCarouselClient({ collections }: { collections: Collection[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const slideTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % collections.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [isPlaying, collections.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % collections.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + collections.length) % collections.length);

  const currentCollection = collections[currentIndex];

  const heroImages = [
    '/assets/Hero bilder/1.jpg.jpg',
    '/assets/Hero bilder/2.jpg.jpg',
    '/assets/Hero bilder/3.jpg.jpg',
  ];

  return (
    <div className="relative z-0 flex justify-center">
      <div
        className="relative max-w-[1280px] w-full h-[484px] overflow-hidden flex items-center justify-center cursor-pointer"
        onClick={next}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
          touchStartX.current = null;
        }}
      >
        <img
          src={heroImages[currentIndex]}
          alt={currentCollection.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute bottom-6 right-6 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-full px-4 py-2 flex items-center gap-3">
            <button
              onClick={prev}
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="Föregående"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-900 min-w-[3rem] text-center">
              {currentIndex + 1}/{collections.length}
            </span>
            <button
              onClick={next}
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="Nästa"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label={isPlaying ? "Pausa" : "Spela"}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4v16l14-8z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
