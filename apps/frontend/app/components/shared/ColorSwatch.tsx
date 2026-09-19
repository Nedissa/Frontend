'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { createPortal } from 'react-dom';

export function Tooltip({ label, anchorRef }: { label: string; anchorRef: React.RefObject<HTMLElement | null> }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- markerar client-mount, krävs innan createPortal kan användas
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const onEnter = () => {
      const r = el.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top - 8 });
    };
    const onLeave = () => setPos(null);
    const onHide = () => { setPos(null); };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('click', onHide);
    window.addEventListener('scroll', onHide, { passive: true });
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('click', onHide);
      window.removeEventListener('scroll', onHide);
    };
  }, [anchorRef]);

  if (!mounted) return null;
  return createPortal(
    <div style={{ position: 'fixed', left: pos?.x ?? 0, top: pos?.y ?? 0, transform: 'translate(-50%, -100%)', background: 'rgba(60,60,60,0.88)', color: '#fff', fontSize: '0.7rem', fontWeight: 500, padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 99999, letterSpacing: '0.01em', opacity: pos ? 1 : 0, transition: 'opacity 0.15s ease' }}>
      {label}
      <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', border: '5px solid transparent', borderTopColor: 'rgba(20,20,20,0.92)' }} />
    </div>,
    document.body
  );
}

export const ColorSwatch = memo(function ColorSwatch({ color, bgColor, isSelected, onSelect }: { color: string; bgColor?: string; isSelected: boolean; onSelect: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative">
      <button
        ref={ref}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(); }}
        className="w-9 h-9 flex items-center justify-center flex-shrink-0"
        style={{ background: 'none', border: 'none', padding: 0 }}
        aria-label={`Välj färg ${color}`}
        aria-pressed={isSelected}
      >
        {bgColor ? (
          <span
            className="w-5 h-5 rounded-full block"
            style={{ background: bgColor, outline: isSelected ? '2px solid #999999' : 'none', outlineOffset: '2px', boxShadow: bgColor === '#FFFFFF' ? '0 0 0 1px #000000' : 'none' }}
          />
        ) : (
          <span
            className="px-3 h-8 flex items-center text-xs font-medium border rounded-full"
            style={{ borderColor: isSelected ? '#999999' : '#D1D5DB' }}
          >
            {color}
          </span>
        )}
      </button>
      <Tooltip anchorRef={ref} label={color} />
    </div>
  );
});
