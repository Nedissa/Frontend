'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const MOBILE_BREAKPOINT = 900;
const PARTICLE_COLOR = '#fff';
const PARTICLE_GOLD = '#e8c547';

// Kortets partikellager maskas till den nedre-vänstra diagonalen (left + top <= 100).
// Partiklarna läggs ut på ett rutnät över den triangeln (med lite jitter) så täckningen
// blir jämn hela vägen upp, istället för att råka klumpa sig via fri slump.
const GRID_COLS = 12;
const GRID_ROWS = 12;
const PARTICLES = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
  const col = i % GRID_COLS;
  const row = Math.floor(i / GRID_COLS);
  const cellLeft = (col / GRID_COLS) * 100;
  const cellTop = (row / GRID_ROWS) * 100;
  if (cellLeft + cellTop > 100) return null;
  const jitterX = (seededRandom(i * 12.9898) - 0.5) * (100 / GRID_COLS) * 0.8;
  const jitterY = (seededRandom(i * 78.233) - 0.5) * (100 / GRID_ROWS) * 0.8;
  const left = Math.round(Math.min(100, Math.max(0, cellLeft + jitterX)) * 100) / 100;
  const top = Math.round(Math.min(100 - left, Math.max(0, cellTop + jitterY)) * 100) / 100;
  return { left, top };
}).filter((p): p is { left: number; top: number } => p !== null)
  .map((pos, i) => ({
  ...pos,
  size: 2 + (i % 4) * 0.8,
  duration: 6 + (i % 6) * 2,
  delay: (i % 10) * 0.15,
  opacity: 0.75 + (i % 4) * 0.1,
  color: i % 4 === 0 ? PARTICLE_GOLD : PARTICLE_COLOR,
}));

export function CardParticles() {
  const [isMobile, setIsMobile] = useState(false);

  // Mobilenheter har svagare GPU:er och renderar dessa kort en gång per projekt, så partiklarna hoppas över helt där.
  useEffect(() => {
    const syncIsMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    syncIsMobile();
    window.addEventListener('resize', syncIsMobile);
    return () => window.removeEventListener('resize', syncIsMobile);
  }, []);

  if (isMobile) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: `${p.left}%`, top: `${p.top}%` }}>
          <motion.div
            initial={{ opacity: p.opacity, x: 0, y: 0 }}
            animate={{
              opacity: [p.opacity, p.opacity * 0.3, p.opacity],
              x: [0, (seededRandom(p.left * 3.1) - 0.5) * 60, (seededRandom(p.top * 5.7) - 0.5) * 60, 0],
              y: [0, (seededRandom(p.top * 2.3) - 0.5) * 60, (seededRandom(p.left * 7.9) - 0.5) * 60, 0],
            }}
            transition={{
              opacity: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: p.duration * 1.5, delay: p.delay, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: p.duration * 1.8, delay: p.delay, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div
              style={{
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: p.color,
                boxShadow: `0 0 ${p.size * 0.9}px ${p.color}`,
              }}
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
