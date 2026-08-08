'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FloatingParticles } from './FloatingParticles';

function HeroCta() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href="/webbstudio/kontakt"
      className="hero-cta"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 1.55 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '10px',
        width: 'fit-content',
        padding: '11px 25px',
        background: hovered ? '#030303' : '#e8c547',
        color: hovered ? '#e8c547' : '#0c0d12',
        border: hovered ? '2px solid #e8c547' : '2px solid transparent',
        fontSize: '15px',
        fontWeight: 600,
        borderRadius: '999px',
        textDecoration: 'none',
        transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
      }}
    >
      Kontakt
      <span>↗</span>
    </motion.a>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      className="hero-section hero-order-first"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '800px',
        background: 'rgb(12, 13, 18)',
        overflow: 'hidden',
      }}
    >
      {/* Glow — fades in on load */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at left center, rgba(255, 210, 60, 0.6) 0%, rgb(12, 13, 18) 65%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

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
        initial={{ opacity: 0.2, scale: 1.05 }}
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
          className="hero-image"
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
        className="hero-text-block"
        style={{
          position: 'absolute',
          left: '80px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '15px',
          }}
        >
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: 'clamp(60px, 8vw, 120px)',
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              color: '#fff',
              whiteSpace: 'nowrap',
              marginBottom: '-0.24em',
              textShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}
          >
            Tech<span style={{ color: '#e8c547' }}>pilots</span>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 1.0 }}
            style={{ width: '100%', height: '3px', background: '#e8c547', transformOrigin: 'left' }}
          />

          <motion.div
            className="hero-tagline"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 1.3 }}
            style={{
              fontSize: 'clamp(14px, 1.4vw, 18px)',
              fontWeight: 500,
              letterSpacing: '0.02em',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Vi bygger webbplatser som håller.
          </motion.div>

          <HeroCta />
        </div>
      </div>
    </section>
  );
}
