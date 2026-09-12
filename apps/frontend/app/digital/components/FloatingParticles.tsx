'use client';
import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';

// Seeded pseudo-random so left/top stay non-repeating but identical on server and client (avoids hydration mismatch)
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const SPRING_CONFIG = { stiffness: 220, damping: 25, mass: 0.4 };

const PARTICLE_COLOR = '#fff';
const PARTICLE_GOLD = '#e8c547';

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
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
  mouseX,
  mouseY,
}: {
  p: (typeof PARTICLES)[number];
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  // Musens offset skalas per partikel med p.pull. mouseX/mouseY är redan en spring
  // (satt av föräldern), så vi transformerar den direkt istället för att lägga på
  // ytterligare en spring per partikel — annars blir det 80 extra fjädersimuleringar.
  // mouseX/mouseY glider själva mot 0 (i föräldern) när musen lämnar, så partiklarna
  // glider tillbaka smidigt istället för att hoppa.
  const pullX = useTransform(mouseX, (v) => v * p.pull);
  const pullY = useTransform(mouseY, (v) => v * p.pull);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${p.left}%`,
        top: `${p.top}%`,
        pointerEvents: 'none',
        x: pullX,
        y: pullY,
      }}
    >
      <motion.div
        initial={{ opacity: p.opacity, x: 0, y: 0 }}
        animate={{
          opacity: [p.opacity, p.opacity * 0.3, p.opacity],
          x: [0, (seededRandom(p.left * 3.1) - 0.5) * 150, (seededRandom(p.top * 5.7) - 0.5) * 150, 0],
          y: [0, (seededRandom(p.top * 2.3) - 0.5) * 150, (seededRandom(p.left * 7.9) - 0.5) * 150, 0],
        }}
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

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Lyssnar på document (inte el) eftersom överlagrade element som menyn tar emot
    // mousemove-eventet istället för sektionen när muspekaren är över dem — annars
    // fryser partiklarna varje gång pekaren hovrar en menylänk.
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) return;
      rawX.set(e.clientX - rect.left - rect.width / 2);
      rawY.set(e.clientY - rect.top - rect.height / 2);
    };
    // Musen kan lämna fönstret eller bli overksam utan att vi vill dra partiklarna
    // tillbaka mot mitten — rawX/rawY lämnas orörda så pullX/pullY fryser på sitt
    // senaste värde, och den oberoende drift-animationen svävar vidare därifrån.
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sectionRef, rawX, rawY]);

  // Mobilenheter har svagare GPU:er och kan inte styra hover ändå, så partiklarna döljs
  // med CSS istället för att monteras villkorligt via JS — annars skiljer sig server- och
  // klientrendern (window finns inte på servern) och React kastar ett hydration mismatch-fel.
  return (
    <div className="hidden md:block" style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {PARTICLES.map((p, i) => (
        <Particle key={i} p={p} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}
