'use client';
import { motion } from 'framer-motion';

// Diagonal (top-left → bottom-right) streaks that fire one at a time with long gaps between,
// so the effect stays subtle and doesn't compete with the hero text.
const STARS = [
  { left: '5%', top: '-5%', delay: 2, duration: 4.4, cycle: 9 },
  { left: '35%', top: '-8%', delay: 6.5, duration: 4, cycle: 12 },
  { left: '55%', top: '-4%', delay: 11, duration: 4.8, cycle: 15 },
];

function Star({ left, top, delay, duration, cycle, color }: (typeof STARS)[number] & { color: string }) {
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
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: cycle,
        ease: 'linear',
        times: [0, 0.03, 0.92, 1],
      }}
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
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex, overflow: 'hidden', pointerEvents: 'none' }}>
      {STARS.map((s, i) => (
        <Star key={i} {...s} color={color} />
      ))}
    </div>
  );
}
