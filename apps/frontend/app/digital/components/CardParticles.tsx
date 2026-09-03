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

const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  left: Math.round(seededRandom(i * 12.9898) * 10000) / 100,
  top: Math.round(seededRandom(i * 78.233) * 10000) / 100,
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
        <motion.div
          key={i}
          style={{ position: 'absolute', left: `${p.left}%`, top: `${p.top}%` }}
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
      ))}
    </div>
  );
}
