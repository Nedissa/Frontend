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

  // Mobile fallback: map device tilt (gamma/beta) to the same offset the mouse drives on desktop
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth > 900) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
      const clampedBeta = Math.max(-30, Math.min(30, e.beta - 45));
      rawX.set((clampedGamma / 30) * 120);
      rawY.set((clampedBeta / 30) * 120);
    };

    type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    const DOE = DeviceOrientationEvent as DeviceOrientationEventWithPermission;

    if (typeof DOE.requestPermission === 'function') {
      const grantOnTap = () => {
        DOE.requestPermission?.().then((state) => {
          if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation);
        });
        window.removeEventListener('touchstart', grantOnTap);
      };
      window.addEventListener('touchstart', grantOnTap, { once: true });
      return () => window.removeEventListener('touchstart', grantOnTap);
    }

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [rawX, rawY]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {PARTICLES.map((p, i) => (
        <Particle key={i} p={p} mouseXOffset={mouseX} mouseYOffset={mouseY} />
      ))}
    </div>
  );
}
