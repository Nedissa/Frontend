'use client';
import { useEffect, useRef, useState } from 'react';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';

const FEATURES = [
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4a2 2 0 00-2 2v11a2 2 0 002 2h7v2H8v2h8v-2h-3v-2h7a2 2 0 002-2V5a2 2 0 00-2-2zm0 13H4V5h16v11z"/></svg>, title: 'Fullt Responsiv', desc: 'Ser perfekt ut på alla skärmstorlekar — från mobil till desktop, varje layout anpassas sömlöst.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>, title: 'Skalbar Design', desc: 'Byggd med struktur och system som gör det enkelt att växa utan att tappa konsekvens.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 11H19V7a2 2 0 00-2-2h-4V3.5A2.5 2.5 0 0010.5 1 2.5 2.5 0 008 3.5V5H4a2 2 0 00-2 2v3.8h1.5C5 10.8 6 11.8 6 13s-1 2.2-2.5 2.2H2V19a2 2 0 002 2h3.8v-1.5C7.8 18 8.8 17 10 17s2.2 1 2.2 2.5V21H16a2 2 0 002-2v-4h1.5a2.5 2.5 0 000-5z"/></svg>, title: 'Anpassning utan Kod', desc: 'Ändra typsnitt, färger och layouter visuellt — ingen kodning behövs.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2.05V4.1c3.95.49 7 3.85 7 7.9 0 3.21-1.81 6-4.5 7.54L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95zM11 2.05C5.95 2.55 2 6.82 2 12c0 3.76 2.09 7.07 5.22 8.78L6 22h5V2.05z"/></svg>, title: 'Byggt för Prestanda', desc: 'Optimerat för snabb laddning med moderna tekniker som ger bättre upplevelse.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>, title: 'SEO & Prestandaredo', desc: 'Optimerat för snabb laddning, ren struktur och bättre synlighet i sökresultat.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V8z"/></svg>, title: 'Rent, Modernt Design', desc: 'Minimalt, strukturerat och visuellt balanserat — designat för tydlighet och bestående intryck.' },
];

function FeatureCard({ icon, title, desc, tall, forceHovered, onRef }: { icon: React.ReactNode; title: string; desc: string; tall?: boolean; forceHovered?: boolean; onRef?: (el: HTMLDivElement | null) => void }) {
  const [mouseHovered, setMouseHovered] = useState(false);
  const hovered = forceHovered ?? mouseHovered;

  return (
    <div
      ref={onRef}
      onMouseEnter={() => setMouseHovered(true)}
      onMouseLeave={() => setMouseHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#ebebea',
        padding: '40px 36px',
        minHeight: '220px',
        height: tall ? '100%' : undefined,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '4px',
        cursor: 'default',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#030303',
          transform: hovered ? 'scale(1)' : 'scale(0)',
          transformOrigin: 'top left',
          transition: 'transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      />
      <span style={{ position: 'relative', color: hovered ? '#e8c547' : '#030303', display: 'block', transition: 'color 0.35s' }}>{icon}</span>
      <div style={{ position: 'relative' }}>
        <h4 style={{ fontSize: '19px', fontWeight: 600, color: hovered ? '#fff' : '#030303', margin: '0 0 12px', letterSpacing: '-0.02em', transition: 'color 0.35s' }}>{title}</h4>
        <p style={{ fontSize: '15px', color: hovered ? 'rgba(255,255,255,0.6)' : 'rgb(104,105,99)', lineHeight: 1.6, margin: 0, transition: 'color 0.35s' }}>{desc}</p>
      </div>
    </div>
  );
}

const GRID_ICON = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
  </svg>
);

function IconOnlyCard({ icon }: { icon: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#030303' : '#ebebea',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '220px',
        borderRadius: '4px',
        transition: 'background 0.35s cubic-bezier(0.76, 0, 0.24, 1)',
        cursor: 'default',
      }}
    >
      <span style={{ color: hovered ? '#e8c547' : '#030303', display: 'block', transition: 'color 0.35s' }}>{icon}</span>
    </div>
  );
}

export function FeaturesSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth > 900) {
        setActiveIndex(null);
        return;
      }
      const viewportCenter = window.innerHeight / 2;
      let closestIndex: number | null = null;
      let closestDistance = Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < closestDistance && distance < rect.height / 2) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="section-padding" style={{ background: '#f5f5f3', padding: '140px 30px', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <SectionHeader num="03" label="Funktioner" extra="© 2026" />
        <FadeIn>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(104,105,99)', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '7px', height: '7px', background: '#e8c547', display: 'inline-block' }} />
              FUNKTIONER
            </p>
            <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#030303', textTransform: 'uppercase', margin: 0 }}>
              Designa. Utveckla. <span style={{ color: 'rgb(104,105,99)' }}>Leverera</span>
            </h2>
          </div>
        </FadeIn>

        <div className="grid-features" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gridTemplateAreas: '"a b c" "d b e"',
          gap: '20px',
          minHeight: '480px',
        }}>
          <FadeIn delay={0.05} className="feature-grid-item" style={{ gridArea: 'a' }}><FeatureCard {...FEATURES[0]} tall forceHovered={activeIndex === 0} onRef={(el) => { cardRefs.current[0] = el; }} /></FadeIn>
          <FadeIn delay={0.1} className="feature-grid-item" style={{ gridArea: 'd' }}><FeatureCard {...FEATURES[1]} tall forceHovered={activeIndex === 1} onRef={(el) => { cardRefs.current[1] = el; }} /></FadeIn>
          <FadeIn delay={0.15} className="feature-grid-item" style={{ gridArea: 'b' }}><FeatureCard {...FEATURES[2]} tall forceHovered={activeIndex === 2} onRef={(el) => { cardRefs.current[2] = el; }} /></FadeIn>
          <FadeIn delay={0.2} className="feature-grid-item" style={{ gridArea: 'c' }}><FeatureCard {...FEATURES[3]} tall forceHovered={activeIndex === 3} onRef={(el) => { cardRefs.current[3] = el; }} /></FadeIn>
          <FadeIn delay={0.25} className="feature-grid-item" style={{ gridArea: 'e' }}><FeatureCard {...FEATURES[4]} tall forceHovered={activeIndex === 4} onRef={(el) => { cardRefs.current[4] = el; }} /></FadeIn>
        </div>
      </div>
    </section>
  );
}
