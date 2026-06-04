'use client';

import { useRef, useState, useCallback } from 'react';

interface ImageCompareSliderProps {
  leftImage: string;
  rightImage: string;
  leftLabel?: string;
  leftSublabel?: string;
  rightLabel?: string;
  rightSublabel?: string;
  title?: string;
  subtitle?: string;
}

export function ImageCompareSlider({
  leftImage,
  rightImage,
  leftLabel = 'Vänster',
  leftSublabel,
  rightLabel = 'Höger',
  rightSublabel,
  title,
  subtitle,
}: ImageCompareSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = () => {
    isDragging.current = true;
    const onMove = (e: MouseEvent) => { if (isDragging.current) updatePosition(e.clientX); };
    const onUp = () => { isDragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {subtitle && <p className="text-sm text-gray-500 mb-1">{subtitle}</p>}
          {title && <h2 className="text-3xl font-bold text-gray-900">{title}</h2>}
        </div>
      )}
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none cursor-col-resize"
        style={{ borderRadius: '12px', aspectRatio: '16/7' }}
        onMouseMove={(e) => { if (isDragging.current) updatePosition(e.clientX); }}
        onTouchMove={onTouchMove}
      >
        {/* Right image (full) */}
        <img src={rightImage} alt={rightLabel} className="absolute inset-0 w-full h-full object-cover" />

        {/* Left image (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={leftImage} alt={leftLabel} className="absolute inset-0 h-full object-cover" style={{ width: containerRef.current?.offsetWidth ?? '100%', left: 0 }} />
        </div>

        {/* Divider line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
          {/* Handle */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseDown={onMouseDown}
            onTouchStart={() => { isDragging.current = true; }}
            onTouchEnd={() => { isDragging.current = false; }}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
            </svg>
          </div>
        </div>

        {/* Left label */}
        {leftLabel && (
          <div className="absolute bottom-5 left-5 pointer-events-none">
            {leftSublabel && <p className="text-white/80 text-xs font-medium">{leftSublabel}</p>}
            <p className="text-white text-xl font-bold drop-shadow-lg">{leftLabel}</p>
          </div>
        )}

        {/* Right label */}
        {rightLabel && (
          <div className="absolute bottom-5 right-5 pointer-events-none text-right">
            {rightSublabel && <p className="text-white/80 text-xs font-medium">{rightSublabel}</p>}
            <p className="text-white text-xl font-bold drop-shadow-lg">{rightLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
