'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { hexToRgb } from './StyledPrimitives';

const GOLD = '#E8C547';
const CYCLE_INTERVAL_MS = 2200;

const rgb = hexToRgb(GOLD);
const GRADIENT = `radial-gradient(circle at center, rgba(${rgb},1) 0%, rgba(${rgb},0.85) 35%, rgba(${rgb},0.4) 65%, rgba(${rgb},0) 100%)`;

type Rect = { top: number; left: number; width: number; height: number };

export function PageTravelingGlow() {
  const [rect, setRect] = useState<Rect | null>(null);
  const activeElRef = useRef<Element | null>(null);
  const visibleElsRef = useRef<Element[]>([]);
  const cycleIndexRef = useRef(0);

  useEffect(() => {
    function getMockups() {
      return Array.from(document.querySelectorAll<HTMLElement>('[data-mockup]'));
    }

    function measure(el: Element) {
      const pageTop = document.documentElement.getBoundingClientRect().top;
      const pageLeft = document.documentElement.getBoundingClientRect().left;
      const box = el.getBoundingClientRect();
      setRect({
        top: box.top - pageTop,
        left: box.left - pageLeft,
        width: box.width,
        height: box.height,
      });
      activeElRef.current = el;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target;
          const isVisible = entry.intersectionRatio > 0.5;
          const idx = visibleElsRef.current.indexOf(el);
          if (isVisible && idx === -1) visibleElsRef.current.push(el);
          if (!isVisible && idx !== -1) visibleElsRef.current.splice(idx, 1);
        }

        if (visibleElsRef.current.length === 0) return;
        if (!activeElRef.current || !visibleElsRef.current.includes(activeElRef.current)) {
          cycleIndexRef.current = 0;
          measure(visibleElsRef.current[0]);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const mockups = getMockups();
    for (const el of mockups) observer.observe(el);
    if (mockups.length > 0) measure(mockups[0]);

    let ticking = false;
    const remeasure = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (activeElRef.current) measure(activeElRef.current);
        ticking = false;
      });
    };
    window.addEventListener('resize', remeasure);
    window.addEventListener('scroll', remeasure, { passive: true });
    window.addEventListener('load', remeasure);

    const cycleInterval = setInterval(() => {
      const visible = visibleElsRef.current;
      if (visible.length < 2) return;
      cycleIndexRef.current = (cycleIndexRef.current + 1) % visible.length;
      measure(visible[cycleIndexRef.current]);
    }, CYCLE_INTERVAL_MS);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('scroll', remeasure);
      window.removeEventListener('load', remeasure);
      clearInterval(cycleInterval);
    };
  }, []);

  if (!rect) return null;

  const size = Math.max(rect.width, rect.height) * 0.9;

  return (
    <motion.div
      className="absolute pointer-events-none z-0 rounded-full"
      animate={{
        top: rect.top + rect.height / 2 - size / 2,
        left: rect.left + rect.width / 2 - size / 2,
        width: size,
        height: size,
        scale: [0.92, 1.06, 0.92],
      }}
      transition={{
        top: { type: 'spring', stiffness: 100, damping: 22 },
        left: { type: 'spring', stiffness: 100, damping: 22 },
        width: { type: 'spring', stiffness: 100, damping: 22 },
        height: { type: 'spring', stiffness: 100, damping: 22 },
        scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{ background: GRADIENT, filter: 'blur(6px)' }}
    />
  );
}
