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
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const goTo = (idx: number) => setCurrentIndex(idx);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setVisible(false), 300);
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      return () => clearTimeout(t);
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
      e.preventDefault();
      if (e.deltaY > 0) setCurrentIndex((prev) => (prev + 1) % images.length);
      else setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
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
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: animIn ? 0.5 : 0 }}
      />
      <div
        className="relative bg-white w-screen flex flex-col z-10"
        style={{
          height: '100dvh',
          transform: animIn ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
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
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-black rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Container with Navigation */}
        <div className="flex-1 flex items-center justify-center overflow-hidden relative" style={{ minHeight: 0, padding: '8px 56px' }}>
          {/* Left Arrow */}
          {!isMobile && <button
            onClick={() => goTo((currentIndex - 1 + images.length) % images.length)}
            className="absolute left-2 p-3 hover:bg-gray-100 rounded transition-colors flex items-center justify-center z-10"
          >
            <svg className="w-9 h-9 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>}

          <img
            key={currentIndex}
            src={images[currentIndex]?.url}
            alt={images[currentIndex]?.altText}
            className="max-w-full max-h-full object-contain"
            style={{ minWidth: '60%', minHeight: '60%' }}
          />

          {/* Right Arrow */}
          {!isMobile && <button
            onClick={() => goTo((currentIndex + 1) % images.length)}
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
            .zoom-thumb-row { justify-content: flex-start; height: 90px; gap: 10px; padding: 10px 16px 8px; }
            .zoom-thumb-btn-active { width: 72px !important; }
          }
        `}</style>
        <div className="zoom-thumb-row">
          {images.map((img, idx) => (
            <div key={idx} className="flex-shrink-0 flex items-center justify-center">
              <button
                onClick={() => goTo(idx)}
                className="aspect-square flex items-center justify-center transition-all duration-200"
                style={{
                  opacity: currentIndex === idx ? 1 : 0.25,
                  width: currentIndex === idx ? (isMobile ? '72px' : '130px') : (isMobile ? '52px' : '60px'),
                  transform: currentIndex === idx ? (isMobile ? 'translateY(-4px) scale(1.04)' : 'translateY(-10px) scale(1.06)') : 'translateY(0)',
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
