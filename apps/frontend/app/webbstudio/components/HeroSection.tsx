'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FloatingParticles } from './FloatingParticles';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '800px',
        background: 'rgb(12, 13, 18)',
        overflow: 'hidden',
      }}
    >
      <FloatingParticles sectionRef={sectionRef} />

      {/* Loader bar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '7px', background: '#fff', zIndex: 10 }}
      />

      {/* Hero image — 55% from left, full height */}
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
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '95%', display: 'block', objectFit: 'contain', objectPosition: 'center bottom', mixBlendMode: 'screen' }}
        />
      </motion.div>

      {/* Bottom gradient — transparent → black */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4) 70%, #000 100%)',
        pointerEvents: 'none',
      }} />

      {/* Text — left, vertically centered */}
      <div
        style={{
          position: 'absolute',
          left: '80px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.7 }}
          style={{
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
        </motion.div>
      </div>
    </section>
  );
}
