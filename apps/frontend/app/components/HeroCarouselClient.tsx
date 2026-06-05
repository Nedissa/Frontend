'use client';

import { useState, useEffect, useRef } from 'react';

const heroCarouselStyle = `
  @keyframes heroGradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .hero-animated-bg {
    background: linear-gradient(135deg, #0a1628, #2e5f8a, #0d1b2a, #1a3a5c, #0a1628);
    background-size: 300% 300%;
    animation: heroGradientShift 8s ease infinite;
  }
`;

interface Collection {
  title: string;
  handle: string;
}

const SLIDE_DURATION = 5000;

export function HeroCarouselClient({ collections }: { collections: Collection[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [sliding, setSliding] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  const goTo = (index: number, pause = false) => {
    if (index === currentIndex) return;
    setPrevIndex(currentIndex);
    setCurrentIndex(index);
    setSliding(true);
    setProgress(0);
    startTimeRef.current = Date.now();
    if (pause) setIsPlaying(false);
    setTimeout(() => { setPrevIndex(null); setSliding(false); }, 600);
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
        setPrevIndex((cur) => cur);
        setCurrentIndex((cur) => {
          const next = (cur + 1) % collections.length;
          setPrevIndex(cur);
          setSliding(true);
          setTimeout(() => { setPrevIndex(null); setSliding(false); }, 600);
          return next;
        });
        setProgress(0);
        startTimeRef.current = Date.now();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, collections.length]);

  const heroImages = [
    '/assets/hero-thumb-1.webp',
    '/assets/hero-thumb-2.webp',
    '/assets/hero-thumb-3.webp',
  ];

  return (
    <>
    <style>{heroCarouselStyle}</style>
    <div className="relative z-0 flex justify-center w-full">
      <div
        className="relative max-w-[1280px] w-full aspect-[1280/640] overflow-hidden flex items-center justify-center cursor-pointer bg-gray-200"
        onClick={() => next(true)}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) diff > 0 ? next(true) : prev(true);
          touchStartX.current = null;
        }}
      >
        {heroImages.map((src, i) => {
          const isCurrent = i === currentIndex;
          const isPrev = i === prevIndex;

          let transform = 'translateX(100%)';
          if (isCurrent) transform = sliding ? 'translateX(0%)' : 'translateX(0%)';
          if (isPrev) transform = 'translateX(-100%)';
          if (!isCurrent && !isPrev) transform = 'translateX(100%)';

          const isSvg = src.endsWith('.svg');
          return (
            <div
              key={src}
              className={`absolute inset-0 w-full h-full${isSvg ? ' hero-animated-bg' : ''}`}
              style={{
                transform,
                transition: (isCurrent || isPrev) && sliding ? 'transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                zIndex: isCurrent ? 2 : isPrev ? 1 : 0,
              }}
            >
              <img
                src={src}
                alt={collections[i]?.title || ''}
                className="w-full h-full"
                style={{ objectFit: isSvg ? 'contain' : 'cover' }}
                width={1280}
                height={640}
                fetchPriority={i === 0 ? 'high' : 'low'}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding={i === 0 ? 'sync' : 'async'}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        {/* Bottom-left text overlay */}
        <div className="absolute top-10 left-10 z-20 flex flex-col gap-3" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
          <h2 className="text-white font-bold leading-tight" style={{ fontSize: '2.8rem', maxWidth: '480px', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
            Teknik för din<br />vardag
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            Hitta rätt produkt enkelt och snabbt<br />— levererad direkt hem till dig.
          </p>
          <a
            href="/produkter"
            className="inline-flex items-center gap-3 font-bold text-sm px-5 py-3 w-fit mt-1"
            style={{ backgroundColor: '#f0c040', color: '#111', borderRadius: '999px' }}
          >
            <span className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
            SHOPPA NU
          </a>
        </div>

        {/* Pill controller */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
            {/* Prev */}
            <button onClick={() => prev(true)} className="text-gray-500 hover:text-black transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Dots */}
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, false)}
                className="relative w-2.5 h-2.5 rounded-full bg-gray-200 overflow-hidden"
              >
                <div
                  className="absolute inset-0 rounded-full bg-gray-800 transition-transform duration-300"
                  style={{ transform: i <= currentIndex ? 'scale(1)' : 'scale(0)' }}
                />
              </button>
            ))}

            {/* Next */}
            <button onClick={() => next(true)} className="text-gray-500 hover:text-black transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Play/Pause with progress ring */}
            <button onClick={() => setIsPlaying(!isPlaying)} className="relative w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors">
              <svg className="absolute inset-0 w-7 h-7 -rotate-90" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="12" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                <circle
                  cx="14" cy="14" r="12" fill="none" stroke="#1f2937" strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 12}`}
                  strokeDashoffset={`${2 * Math.PI * 12 * (1 - (isPlaying ? progress : 0))}`}
                  strokeLinecap="round"
                />
              </svg>
              {isPlaying ? (
                <svg className="w-3 h-3 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
              ) : (
                <svg className="w-3 h-3 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4v16l14-8z" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
