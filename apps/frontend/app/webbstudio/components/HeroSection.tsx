'use client';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { OrbitParticles } from './OrbitParticles';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(42);
  const flareX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const flareY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const flareBackground = useMotionTemplate`radial-gradient(circle at ${flareX}% ${flareY}%, rgba(26,58,110,0.55) 0%, rgba(26,58,110,0.25) 25%, rgba(26,58,110,0) 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '800px',
        background: 'rgb(12, 13, 18)',
        overflow: 'hidden',
      }}
    >
      {/* Flare som följer muspekaren */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: flareBackground,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <OrbitParticles />

      {/* Loader bar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '7px', background: '#fff', zIndex: 10 }}
      />

      {/* Hero image — 55% från vänster, full höjd */}
      <motion.div
        initial={{ opacity: 0.2, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <img
          src="/webbstudio/hero.webp"
          alt=""
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '85%', display: 'block', objectFit: 'contain', objectPosition: 'center bottom', mixBlendMode: 'screen' }}
        />
      </motion.div>

      {/* Bottom gradient — transparent → svart */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4) 70%, #000 100%)',
        pointerEvents: 'none',
      }} />

      {/* Text — vänster, vertikalt centrerat */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.7 }}
        style={{
          position: 'absolute',
          left: '34px',
          top: '28%',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '32px',
        }}
      >
        <div style={{
          fontFamily: '"Geist", system-ui, sans-serif',
          fontSize: 'clamp(56px, 8vw, 120px)',
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: '-0.04em',
          color: '#fff',
        }}>
          Techpilots
        </div>
        <div style={{
          fontFamily: '"Geist", system-ui, sans-serif',
          fontSize: 'clamp(56px, 8vw, 120px)',
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: '-0.04em',
          color: '#fff',
        }}>
          Studio
        </div>
        <div style={{
          fontFamily: '"Geist", system-ui, sans-serif',
          fontSize: 'clamp(32px, 4vw, 56px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#d4af37',
          lineHeight: 1,
        }}>
          2.0
        </div>
      </motion.div>
    </section>
  );
}
