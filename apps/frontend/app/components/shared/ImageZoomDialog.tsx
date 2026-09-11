'use client';

import { useState, useEffect, useRef } from 'react';

interface ImageZoomDialogProps {
  images: Array<{ id: string; url: string; altText: string }>;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoomDialog({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageZoomDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const thumbRowRef = useRef<HTMLDivElement>(null);
  const thumbItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const goTo = (idx: number) => setCurrentIndex(idx);

  // Återställ currentIndex under render (inte i effect) när initialIndex ändras
  if (initialIndex !== prevInitialIndex) {
    setPrevInitialIndex(initialIndex);
    setCurrentIndex(initialIndex);
  }

  useEffect(() => {
    if (!isMobile) return;
    const item = thumbItemRefs.current[currentIndex];
    const row = thumbRowRef.current;
    if (!item || !row) return;
    const itemLeft = item.offsetLeft;
    const itemWidth = item.offsetWidth;
    const rowWidth = row.offsetWidth;
    row.scrollTo({ left: itemLeft - rowWidth / 2 + itemWidth / 2, behavior: 'smooth' });
  }, [currentIndex, isMobile]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synkas tillsammans med DOM-mutationer (scroll lock) nedan
      setVisible(true);
      setAnimIn(true);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      setAnimIn(false);
      setVisible(false);
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goTo((currentIndex - 1 + images.length) % images.length);
      else if (e.key === 'ArrowRight') goTo((currentIndex + 1) % images.length);
    };
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) setCurrentIndex((prev) => (prev + 1) % images.length);
      else setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, images.length, onClose, currentIndex]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ pointerEvents: animIn ? 'auto' : 'none' }}
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: animIn ? 0.5 : 0 }}
      />
      <div
        className="relative bg-white w-screen flex flex-col z-10"
        style={{
          height: '100dvh',
          transform: animIn ? 'translateY(0)' : 'translateY(100%)',
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(dx) < 50) return;
          if (dx < 0) setCurrentIndex((prev) => (prev + 1) % images.length);
          else setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Stäng bildvisning"
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-black rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Container with Navigation */}
        <div className="flex-1 flex items-center justify-center overflow-hidden relative" style={{ minHeight: 0, padding: isMobile ? '8px 8px' : '8px 56px' }}>
          {/* Left Arrow */}
          {!isMobile && <button
            onClick={() => goTo((currentIndex - 1 + images.length) % images.length)}
            aria-label="Föregående bild"
            className="absolute left-2 p-3 hover:bg-gray-100 rounded transition-colors flex items-center justify-center z-10"
          >
            <svg className="w-9 h-9 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>}

          <img
            key={currentIndex}
            src={images[currentIndex]?.url}
            alt={images[currentIndex]?.altText || `Bild ${currentIndex + 1} av ${images.length}`}
            className="max-w-full max-h-full object-contain"
            style={{ minWidth: '60%', minHeight: '60%' }}
          />

          {/* Right Arrow */}
          {!isMobile && <button
            onClick={() => goTo((currentIndex + 1) % images.length)}
            aria-label="Nästa bild"
            className="absolute right-2 p-3 hover:bg-gray-100 rounded transition-colors flex items-center justify-center z-10"
          >
            <svg className="w-9 h-9 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>}
        </div>

        {/* Thumbnails */}
        <style>{`
          .zoom-thumb-row { padding: 16px 24px; display: flex; gap: 24px; justify-content: center; overflow-x: auto; height: 160px; scrollbar-width: none; align-items: flex-end; }
          @media (max-width: 767px) {
            .zoom-thumb-row { justify-content: flex-start; height: 130px; gap: 10px; padding: 28px 16px 12px 48px; scroll-snap-type: x mandatory; }
            .zoom-thumb-item { scroll-snap-align: start; flex-shrink: 0; width: calc((100vw - 48px) / 3.5); display: flex; align-items: center; justify-content: center; padding: 0 4px; }
          }
        `}</style>
        <div className="zoom-thumb-row" ref={thumbRowRef}>
          {images.map((img, idx) => (
            <div key={idx} ref={el => { thumbItemRefs.current[idx] = el; }} className={isMobile ? 'zoom-thumb-item' : 'flex-shrink-0 flex items-center justify-center'}>
              <button
                onClick={() => goTo(idx)}
                aria-label={`Visa bild ${idx + 1} av ${images.length}`}
                className="aspect-square flex items-center justify-center transition-all duration-200"
                style={{
                  opacity: currentIndex === idx ? 1 : 0.25,
                  width: isMobile ? (currentIndex === idx ? '110%' : '80%') : (currentIndex === idx ? '130px' : '60px'),
                  transform: currentIndex === idx ? (isMobile ? 'none' : 'translateY(-10px) scale(1.06)') : 'none',
                  filter: currentIndex === idx ? 'drop-shadow(0 3px 8px rgba(0,0,0,0.2))' : 'none',
                }}
              >
                <img src={img.url} alt="" className="w-full h-full object-contain" />
              </button>
            </div>
          ))}
        </div>

        {/* Counter and Dots */}
        <div className="flex flex-col items-center justify-center px-6 py-4 gap-3">
          <span className="text-xs text-gray-400 tracking-wider">
            {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
          <div className="flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                  currentIndex === idx ? 'bg-black' : 'bg-gray-300'
                }`}
                aria-label={`Image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
