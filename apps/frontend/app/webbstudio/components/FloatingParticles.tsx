'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';

// Seeded pseudo-random so left/top stay non-repeating but identical on server and client (avoids hydration mismatch)
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const MOBILE_BREAKPOINT = 900;
const SPRING_CONFIG = { stiffness: 40, damping: 20, mass: 0.6 };

const PARTICLE_COLOR = '#fff';
const PARTICLE_GOLD = '#e8c547';

const PARTICLES = Array.from({ length: 100 }, (_, i) => ({
  left: Math.round(seededRandom(i * 12.9898) * 10000) / 100,
  top: Math.round(seededRandom(i * 78.233) * 10000) / 100,
  size: 1.5 + (i % 4) * 0.6,
  duration: 8 + (i % 6) * 2,
  delay: (i % 10) * 0.15,
  opacity: 0.5 + (i % 4) * 0.15,
  pull: 0.15 + (i % 5) * 0.06,
  color: i % 4 === 0 ? PARTICLE_GOLD : PARTICLE_COLOR,
}));

function Particle({
  p,
  mouseXOffset,
  mouseYOffset,
  randomDrift,
}: {
  p: (typeof PARTICLES)[number];
  mouseXOffset: MotionValue<number>;
  mouseYOffset: MotionValue<number>;
  randomDrift?: boolean;
}) {
  const x = useTransform(mouseXOffset, (v) => v * p.pull);
  const y = useTransform(mouseYOffset, (v) => v * p.pull);

  return (
    <motion.div
      style={{ position: 'absolute', left: `${p.left}%`, top: `${p.top}%`, x, y, pointerEvents: 'none' }}
    >
      <motion.div
        initial={{ opacity: p.opacity, x: 0, y: 0 }}
        animate={
          randomDrift
            ? {
                opacity: [p.opacity, p.opacity * 0.3, p.opacity],
                x: [0, (seededRandom(p.left * 3.1) - 0.5) * 60, (seededRandom(p.top * 5.7) - 0.5) * 60, 0],
                y: [0, (seededRandom(p.top * 2.3) - 0.5) * 60, (seededRandom(p.left * 7.9) - 0.5) * 60, 0],
              }
            : { opacity: [p.opacity, p.opacity * 0.3, p.opacity] }
        }
        transition={{
          opacity: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' },
          x: { duration: p.duration * 1.5, delay: p.delay, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: p.duration * 1.8, delay: p.delay, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: p.color,
          boxShadow: `0 0 ${p.size * 0.9}px ${p.color}`,
        }}
      />
    </motion.div>
  );
}

export function FloatingParticles({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, SPRING_CONFIG);
  const mouseY = useSpring(rawY, SPRING_CONFIG);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile has no pointer to follow, so particles drift on their own instead.
  useEffect(() => {
    const syncIsMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    syncIsMobile();
    window.addEventListener('resize', syncIsMobile);
    return () => window.removeEventListener('resize', syncIsMobile);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      rawX.set(e.clientX - rect.left - rect.width / 2);
      rawY.set(e.clientY - rect.top - rect.height / 2);
    };
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [sectionRef, rawX, rawY]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {PARTICLES.map((p, i) => (
        <Particle key={i} p={p} mouseXOffset={mouseX} mouseYOffset={mouseY} randomDrift={isMobile} />
      ))}
    </div>
  );
}
