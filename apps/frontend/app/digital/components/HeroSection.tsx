'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const MotionImage = motion.create(Image);
import { FloatingParticles } from './FloatingParticles';
import { ShootingStars } from './ShootingStars';
import { CalPopupButton } from './CalPopupButton';
import { RotatingHeadline } from './RotatingHeadline';

const MOUSE_SPRING_CONFIG = { stiffness: 40, damping: 20, mass: 0.6 };

function HeroPromo() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="hero-promo-panel absolute left-8 top-[26%] -translate-y-1/2 z-[2]"
      style={{
        maxWidth: '520px',
        width: 'calc(100% - 64px)',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.16)',
        borderRadius: '8px',
        padding: '28px 40px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.9 }}
    >
      <div style={{ fontSize: '14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px', letterSpacing: '2px', color: '#fff' }} aria-hidden="true">★★★★★</span>
        <span style={{ color: '#fff' }}>4.9/5</span>
      </div>
      <RotatingHeadline />
      <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.35)', margin: '0 0 16px' }} />
      <p
        className="hero-promo-text"
        style={{
          fontSize: '15px',
          fontWeight: 500,
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.7)',
          margin: '0 0 28px',
        }}
      >
        Webbplatser som säljer. Från startup till e-commerce. <br className="hero-promo-text-break" /> Optimerad för prestanda, konvertering och tillväxt.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="flex items-center gap-[16px]" style={{ flexWrap: 'nowrap' }}>
          <CalPopupButton
            className="inline-flex items-center gap-[8px] w-fit px-[20px] py-[12px] sm:px-[28px] sm:py-[16px] text-[14px] sm:text-[15px] font-semibold rounded-full no-underline whitespace-nowrap"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: hovered ? '#030303' : '#e8c547',
              color: hovered ? '#e8c547' : '#0c0d12',
              border: hovered ? '2px solid #e8c547' : '2px solid #030303',
              transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
            }}
          >
            Boka samtal
            <span>↗</span>
          </CalPopupButton>
          <a
            href="/digital#projekt"
            className="inline-flex items-center w-fit px-[20px] py-[12px] sm:px-[28px] sm:py-[16px] text-[14px] sm:text-[15px] font-semibold rounded-full no-underline whitespace-nowrap"
            style={{
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.4)',
            }}
          >
            Se vad vi byggt
          </a>
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>30 min helt kostnadsfritt, utan bindning</div>
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
  // Bilden är bottenförankrad (objectPosition: 'center bottom'), så en obegränsad negativ
  // y-rörelse drar upp den och lämnar ett synligt tomrum under bilden. Klampa till max -12px
  // så parallaxeffekten finns kvar utan att bottenkanten någonsin lossnar.
  const imageY = useTransform(mouseY, (v) => Math.max(-12, Math.min(0, v * 0.02)));

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
      {/* Eclipse glow — dark center with golden corona ring */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 55% 100% at 0% 50%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 40%, rgba(255, 210, 60, 0.8) 47%, rgba(255, 210, 60, 0.6) 54%, rgba(255, 180, 40, 0.4) 62%, rgb(12, 13, 18) 75%)',
        }}
      />

      {/* Ojämn/texturerad kant på guldringen — organisk oregelbundenhet via SVG-turbulensfilter, som en riktig solförmörkelse */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="corona-edge-turbulence">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 55% 100% at 0% 50%, transparent 0%, transparent 44%, rgba(255, 210, 60, 0.55) 50%, rgba(255, 190, 50, 0.35) 56%, transparent 65%)',
          filter: 'url(#corona-edge-turbulence)',
        }}
      />

      {/* God rays — faint light beams radiating from the glow source */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'conic-gradient(from -90deg at 0% 100%, transparent 0deg, rgba(255,230,150,0.9) 8deg, transparent 20deg, transparent 32deg, rgba(255,230,150,0.7) 42deg, transparent 54deg, transparent 62deg, rgba(255,230,150,0.9) 72deg, transparent 84deg, transparent 90deg)',
          maskImage: 'radial-gradient(ellipse 70% 90% at 0% 100%, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 90% at 0% 100%, black 0%, transparent 80%)',
        }}
      />


      <FloatingParticles sectionRef={sectionRef} />
      <ShootingStars zIndex={1} />
      {/* Hero image — 55% from left, full height */}
      <motion.div
        initial={{ opacity: 0.2, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        className="absolute top-0 left-0 w-full h-full z-[1]"
        style={{ x: imageX }}
      >
        <MotionImage
          src="/digital/hero.webp"
          alt=""
          width={864}
          height={1080}
          draggable={false}
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className="hero-image absolute left-0 w-full block"
          style={{ bottom: '-12px', height: '90%', objectFit: 'contain', objectPosition: 'center bottom', mixBlendMode: 'screen', userSelect: 'none', y: imageY }}
        />
      </motion.div>

      {/* Bottom gradient — transparent → black */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4) 70%, #000 100%)' }}
      />

      <HeroPromo />
    </section>
  );
}
