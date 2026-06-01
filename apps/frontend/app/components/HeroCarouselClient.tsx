'use client';

import { useState, useEffect, useRef } from 'react';

interface Collection {
  title: string;
  handle: string;
}

const SLIDE_DURATION = 5000;

export function HeroCarouselClient({ collections }: { collections: Collection[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  const goTo = (index: number, pause = false) => {
    setCurrentIndex(index);
    setProgress(0);
    startTimeRef.current = Date.now();
    if (pause) setIsPlaying(false);
  };

  const next = (pause = false) => goTo((currentIndex + 1) % collections.length, pause);
  const prev = (pause = false) => goTo((currentIndex - 1 + collections.length) % collections.length, pause);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / SLIDE_DURATION, 1);
      setProgress(p);

      if (p >= 1) {
        setCurrentIndex((prev) => (prev + 1) % collections.length);
        setProgress(0);
        startTimeRef.current = Date.now();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, collections.length]);

  // Reset progress when slide changes externally
  useEffect(() => {
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [currentIndex]);

  const heroImages = [
    '/assets/hero-1.jpg',
    '/assets/hero-2.jpg',
    '/assets/hero-3.jpg',
  ];

  return (
    <div className="relative z-0 flex justify-center w-full">
      <div
        className="relative max-w-[1280px] w-full aspect-[1280/484] overflow-hidden flex items-center justify-center cursor-pointer bg-gray-200"
        onClick={() => next(true)}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) diff > 0 ? next(true) : prev(true);
          touchStartX.current = null;
        }}
      >
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={collections[i]?.title || ''}
            className={`absolute inset-0 w-full h-full object-cover ${i === 0 ? '' : 'transition-opacity duration-500'}`}
            style={{ opacity: i === currentIndex ? 1 : 0 }}
            width={1280}
            height={484}
            fetchPriority={i === 0 ? 'high' : 'low'}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding={i === 0 ? 'sync' : 'async'}
          />
        ))}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Progress bars */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 px-4"
          style={{ width: 'min(400px, 80%)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, true)}
              className="relative flex-1 h-[3px] bg-white/40 rounded-full overflow-hidden"
              aria-label={`Gå till bild ${i + 1}`}
            >
              <div
                className="absolute inset-y-0 left-0 bg-white rounded-full"
                style={{
                  width: i < currentIndex
                    ? '100%'
                    : i === currentIndex
                    ? `${progress * 100}%`
                    : '0%',
                  transition: i === currentIndex ? 'none' : undefined,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
