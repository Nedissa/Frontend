'use client';
import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';

// Seeded pseudo-random so left/top stay non-repeating but identical on server and client (avoids hydration mismatch)
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const PARTICLES = Array.from({ length: 100 }, (_, i) => ({
  left: Math.round(seededRandom(i * 12.9898) * 10000) / 100,
  top: Math.round(seededRandom(i * 78.233) * 10000) / 100,
  size: 3 + (i % 4),
  duration: 8 + (i % 6) * 2,
  delay: (i % 10) * 0.15,
  opacity: 0.5 + (i % 4) * 0.15,
  pull: 0.15 + (i % 5) * 0.06,
}));

function Particle({
  p,
  mouseXOffset,
  mouseYOffset,
}: {
  p: (typeof PARTICLES)[number];
  mouseXOffset: MotionValue<number>;
  mouseYOffset: MotionValue<number>;
}) {
  const x = useTransform(mouseXOffset, (v) => v * p.pull);
  const y = useTransform(mouseYOffset, (v) => v * p.pull);

  return (
    <motion.div
      style={{ position: 'absolute', left: `${p.left}%`, top: `${p.top}%`, x, y, pointerEvents: 'none' }}
    >
      <motion.div
        initial={{ opacity: p.opacity }}
        animate={{ opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
        transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: '#fff',
        }}
      />
    </motion.div>
  );
}

export function FloatingParticles({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 40, damping: 20, mass: 0.6 });
  const mouseY = useSpring(rawY, { stiffness: 40, damping: 20, mass: 0.6 });

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

  // Mobile fallback: no mouse available, so drive the same offset with a slow autonomous drift
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth > 900) return;

    let frame: number;
    const start = performance.now();
    const animate = (now: number) => {
      const t = (now - start) / 1000;
      rawX.set(Math.sin(t * 0.3) * 80);
      rawY.set(Math.cos(t * 0.22) * 60);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [rawX, rawY]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {PARTICLES.map((p, i) => (
        <Particle key={i} p={p} mouseXOffset={mouseX} mouseYOffset={mouseY} />
      ))}
    </div>
  );
}
