'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Diagonal (top-left → bottom-right) streaks. Only one star is ever visible
// at a time: a single sequence cycles through the start positions below.
const STARS = [
  { left: '5%', top: '-5%' },
  { left: '35%', top: '-8%' },
  { left: '55%', top: '-4%' },
];

const DURATION = 4.4;
const GAP = 8;

function Star({ left, top, color }: (typeof STARS)[number] & { color: string }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left,
        top,
        width: '2px',
        height: '2px',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], x: [0, 1400], y: [0, 1400] }}
      transition={{ duration: DURATION, ease: 'linear', times: [0, 0.03, 0.92, 1] }}
    >
      <div
        style={{
          width: '120px',
          height: '2px',
          borderRadius: '2px',
          background: `linear-gradient(225deg, ${color}, rgba(0,0,0,0))`,
          transform: 'rotate(45deg)',
          transformOrigin: 'left center',
        }}
      />
    </motion.div>
  );
}

export function ShootingStars({ color = '#fff', zIndex = -1 }: { color?: string; zIndex?: number }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % STARS.length);
    }, (DURATION + GAP) * 1000);
    return () => clearInterval(timer);
  }, []);

  const s = STARS[active];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex, overflow: 'hidden', pointerEvents: 'none' }}>
      <Star key={active} {...s} color={color} />
    </div>
  );
}
