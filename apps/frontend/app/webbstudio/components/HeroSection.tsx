'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FloatingParticles } from './FloatingParticles';

function HeroCta() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href="/webbstudio/kontakt"
      className="hero-cta inline-flex items-center gap-[10px] mt-[10px] w-fit px-[25px] py-[11px] text-[15px] font-semibold rounded-full no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 1.55 }}
      style={{
        background: hovered ? '#030303' : '#e8c547',
        color: hovered ? '#e8c547' : '#0c0d12',
        border: hovered ? '2px solid #e8c547' : '2px solid transparent',
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
      className="hero-section hero-order-first relative w-full h-screen min-h-[800px] overflow-hidden"
      style={{ background: 'rgb(12, 13, 18)' }}
    >
      {/* Glow — fades in on load */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at left center, rgba(255, 210, 60, 0.6) 0%, rgb(12, 13, 18) 65%)',
        }}
      />

      <FloatingParticles sectionRef={sectionRef} />

      {/* Loader bar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 w-full h-[7px] bg-white z-10"
      />

      {/* Hero image — 55% from left, full height */}
      <motion.div
        initial={{ opacity: 0.2, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        className="absolute top-0 left-0 w-full h-full z-[1]"
      >
        <img
          src="/webbstudio/hero.webp"
          alt=""
          className="hero-image absolute bottom-0 left-0 w-full block"
          style={{ height: '95%', objectFit: 'contain', objectPosition: 'center bottom', mixBlendMode: 'screen' }}
        />
      </motion.div>

      {/* Bottom gradient — transparent → black */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4) 70%, #000 100%)' }}
      />

      {/* Text — left, vertically centered */}
      <div
        className="hero-text-block absolute left-[80px] top-1/2 -translate-y-1/2 z-[2]"
      >
        <div className="flex flex-col items-stretch gap-[15px]">
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
            className="w-full h-[3px] origin-left"
            style={{ background: '#e8c547' }}
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
