'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FloatingParticles } from './FloatingParticles';

const MOUSE_SPRING_CONFIG = { stiffness: 40, damping: 20, mass: 0.6 };

function HeroPromo() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="absolute left-8 top-[38%] -translate-y-1/2 z-[2]"
      style={{ maxWidth: '380px' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.9 }}
    >
      <h2
        style={{
          fontFamily: '"Geist", system-ui, sans-serif',
          fontSize: 'clamp(28px, 2.6vw, 38px)',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          color: '#fff',
          margin: '0 0 16px',
          textShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        Din vision förtjänar ett digitalt hem
      </h2>
      <p
        style={{
          fontSize: '15px',
          fontWeight: 500,
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.7)',
          margin: '0 0 28px',
        }}
      >
        Vi bygger snabba, sökmotoroptimerade webbplatser som omvandlar besökare till kunder, skräddarsydda för ditt varumärke från grund till lansering.
      </p>
      <div className="flex items-center gap-[12px]">
        <motion.a
          href="/webbstudio/kontakt"
          className="inline-flex items-center gap-[10px] w-fit px-[25px] py-[11px] text-[15px] font-semibold rounded-full no-underline"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
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
        <a
          href="/webbstudio#projekt"
          className="inline-flex items-center w-fit px-[25px] py-[11px] text-[15px] font-semibold rounded-full no-underline"
          style={{
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          Se projekt
        </a>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Samma spring-baserade musparallax som FloatingParticles, så bilden rör sig i takt med partiklarna.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, MOUSE_SPRING_CONFIG);
  const mouseY = useSpring(rawY, MOUSE_SPRING_CONFIG);
  const imageX = useTransform(mouseX, (v) => v * 0.02);
  const imageY = useTransform(mouseY, (v) => v * 0.02);

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
  }, [rawX, rawY]);

  return (
    <section
      ref={sectionRef}
      className="hero-section hero-order-first relative w-full h-screen min-h-[800px] overflow-hidden"
      style={{ background: 'rgb(6, 7, 10)' }}
    >
      {/* Glow — fades in on load */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at left center, rgba(255, 210, 60, 0.8) 0%, rgb(12, 13, 18) 65%)',
        }}
      />


      <FloatingParticles sectionRef={sectionRef} />
      {/* Hero image — 55% from left, full height */}
      <motion.div
        initial={{ opacity: 0.2, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        className="absolute top-0 left-0 w-full h-full z-[1]"
        style={{ x: imageX, y: imageY }}
      >
        <img
          src="/webbstudio/hero.webp"
          alt=""
          className="hero-image absolute bottom-0 left-0 w-full block"
          style={{ height: '95%', objectFit: 'contain', objectPosition: '35% bottom', mixBlendMode: 'screen' }}
        />
      </motion.div>

      {/* Bottom gradient — transparent → black */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4) 70%, #000 100%)' }}
      />

      {/* Text — left and right of the woman, bottom */}
      <div className="absolute left-8 bottom-[80px] z-[2]">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
          style={{
            fontFamily: '"Geist", system-ui, sans-serif',
            fontSize: 'clamp(38px, 5vw, 88px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            color: '#fff',
            whiteSpace: 'nowrap',
            textShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}
        >
          Lyft din
        </motion.div>
      </div>

      <div className="absolute right-8 bottom-[80px] z-[2] text-right">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.65 }}
          style={{
            fontFamily: '"Geist", system-ui, sans-serif',
            fontSize: 'clamp(38px, 5vw, 88px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            color: '#e8c547',
            whiteSpace: 'nowrap',
            textShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}
        >
          Digitala Närvaro
        </motion.div>
      </div>

      <HeroPromo />
    </section>
  );
}
