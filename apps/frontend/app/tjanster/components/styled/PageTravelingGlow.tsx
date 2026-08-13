'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const GOLD = '#E8C547';
const CYCLE_INTERVAL_MS = 2200;

const BLOB_PATHS = [
  'M45.8,-58.3C58.4,-49.4,67.4,-34.7,70.8,-18.6C74.2,-2.5,72,15,63.8,28.9C55.6,42.8,41.3,53.1,25.7,59.6C10.1,66.1,-6.8,68.8,-22.4,64.6C-38,60.4,-52.3,49.3,-60.5,34.8C-68.7,20.3,-70.8,2.4,-66.9,-13.6C-63,-29.6,-53.1,-43.7,-40,-52.4C-26.9,-61.1,-10.6,-64.4,3.9,-69.1C18.4,-73.8,33.2,-67.2,45.8,-58.3Z',
  'M39.6,-51.7C50.9,-43.6,59,-30.5,63.4,-15.9C67.8,-1.3,68.5,14.8,62.3,28.1C56.1,41.4,43,51.9,28.6,58.4C14.2,64.9,-1.5,67.4,-16.8,64.3C-32.1,61.2,-47,52.5,-56.4,39.6C-65.8,26.7,-69.7,9.6,-67.6,-6.5C-65.5,-22.6,-57.4,-37.7,-45.4,-46.1C-33.4,-54.5,-17.7,-56.2,-1.2,-54.4C15.3,-52.6,28.3,-59.8,39.6,-51.7Z',
  'M48.2,-62.9C61.8,-53.3,71.4,-37.5,74.7,-20.6C78,-3.7,75,14.3,66.7,29.5C58.4,44.7,44.8,57.1,29.1,63.8C13.4,70.5,-4.4,71.5,-20.7,66.5C-37,61.5,-51.8,50.5,-61.1,36C-70.4,21.5,-74.2,3.5,-71.1,-12.8C-68,-29.1,-58,-43.7,-44.9,-53.3C-31.8,-62.9,-15.9,-67.5,1.1,-68.8C18.1,-70.1,34.6,-72.5,48.2,-62.9Z',
];

const morphTargets = BLOB_PATHS.concat(BLOB_PATHS[0]);

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

  const size = Math.max(rect.width, rect.height) * 1.15;
  const pageWidth = typeof document !== 'undefined' ? document.documentElement.clientWidth : Infinity;
  const rotationMargin = size * 0.15;
  const idealLeft = rect.left + rect.width / 2 - size / 2;
  const clampedLeft = Math.min(Math.max(idealLeft, rotationMargin), Math.max(pageWidth - size - rotationMargin, rotationMargin));

  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      animate={{
        top: rect.top + rect.height / 2 - size / 2,
        left: clampedLeft,
        width: size,
        height: size,
        rotate: [0, 12, -8, 5, 0],
      }}
      transition={{
        top: { type: 'spring', stiffness: 100, damping: 22 },
        left: { type: 'spring', stiffness: 100, damping: 22 },
        width: { type: 'spring', stiffness: 100, damping: 22 },
        height: { type: 'spring', stiffness: 100, damping: 22 },
        rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <svg viewBox="-100 -100 200 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="glow-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <motion.path
          fill={GOLD}
          filter="url(#glow-blur)"
          opacity={0.55}
          initial={{ d: BLOB_PATHS[0] }}
          animate={{ d: morphTargets }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  );
}
