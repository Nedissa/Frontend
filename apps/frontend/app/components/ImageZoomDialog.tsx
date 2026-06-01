'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (e.deltaY < 0) {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, images.length, onClose]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-[90vw] h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Container with Navigation */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden relative" style={{ minHeight: 0 }}>
          {/* Left Arrow */}
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
            }
            className="absolute left-4 p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center z-10"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="w-full h-full flex items-center justify-center">
            <img
              src={currentImage.url}
              alt={currentImage.altText}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Right Arrow */}
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % images.length)
            }
            className="absolute right-4 p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center z-10"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Thumbnails */}
        <div className="px-6 py-2 flex gap-4 justify-center overflow-x-auto h-28" style={{ scrollbarWidth: 'none' }}>
          {images.map((img, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <button
                onClick={() => setCurrentIndex(idx)}
                className={`aspect-square transition-all duration-200 flex items-center justify-center ${
                  currentIndex === idx ? 'w-36 -translate-y-1' : 'w-20'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-contain" />
              </button>
            </div>
          ))}
        </div>

        {/* Counter and Dots */}
        <div className="flex flex-col items-center justify-center px-6 py-2 gap-2">
          <span className="text-xs text-gray-400 tracking-wider">
            {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
          <div className="flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
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
