'use client';
import { useEffect, useRef, useState } from 'react';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';

function PillButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="/webbstudio#kontakt"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#030303',
        borderRadius: '999px',
        padding: '10px 10px 10px 20px',
        gap: '40px',
        textDecoration: 'none',
        minWidth: '220px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Wipe from left to right */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, bottom: 0,
        width: hovered ? '100%' : '0%',
        background: '#030303',
        transition: 'width 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
        zIndex: 0,
        borderRadius: '999px',
      }} />
      <span style={{ position: 'relative', zIndex: 1, color: '#fff', fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap' }}>Låt oss prata</span>
      <span style={{
        width: '34px', height: '34px', borderRadius: '50%',
        background: hovered ? '#fff' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Dots — left shrinks, right grows from the left */}
        <span style={{ display: 'flex', alignItems: 'center', gap: hovered ? '0px' : '4px', transition: 'gap 0.4s cubic-bezier(0.76, 0, 0.24, 1)' }}>
          <span style={{
            width: hovered ? '0px' : '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
            overflow: 'hidden',
            flexShrink: 0,
            transition: 'width 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
          }} />
          <span style={{
            width: hovered ? '14px' : '10px',
            height: hovered ? '14px' : '10px',
            borderRadius: '50%',
            background: hovered ? '#030303' : '#e8c547',
            flexShrink: 0,
            transformOrigin: 'left center',
            transition: 'width 0.4s cubic-bezier(0.76, 0, 0.24, 1), height 0.4s cubic-bezier(0.76, 0, 0.24, 1), background 0.3s ease',
          }} />
        </span>
      </span>
    </a>
  );
}

const AWARDS = [
  { title: 'BÄSTA UI/UX DESIGN', source: 'Utmärkt Digital Designexcellens · 2024 SaaS', desc: 'Uppmärksammad för att skapa en ren, intuitiv användarupplevelse som förbättrade resultaten.', year: '2024' },
  { title: 'MÅNADENS WEBBPLATS', source: 'Web Creators Collective · 2024 Webbdesign', desc: 'Tilldelad för visuell kvalitet, prestanda och berättande i en modern webbplats.', year: '2023' },
  { title: 'BÄSTA VARUMÄRKESIDENTITET', source: 'Creative Industry Network · 2023 Varumärkesdesign', desc: 'Erkänd för ett sammanhängande och skalbart varumärkesidentitetssystem.', year: '2022' },
  { title: 'UTVALD LEVERANTÖR', source: 'Design Inspiration Hub · 2023 Kvalitet framför troféer', desc: 'Lyfts fram som ett team att bevaka för konsekvent kvalitetstänkande.', year: '2021' },
];

function AwardRow({ a, forceHovered, onRef }: { a: typeof AWARDS[0]; forceHovered?: boolean; onRef?: (el: HTMLDivElement | null) => void }) {
  const [mouseHovered, setMouseHovered] = useState(false);
  const hovered = forceHovered ?? mouseHovered;
  return (
    <div
      ref={onRef}
      className="grid-awards-row"
      onMouseEnter={() => setMouseHovered(true)}
      onMouseLeave={() => setMouseHovered(false)}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '2fr 2fr 2fr 80px',
        alignItems: 'center',
        gap: '40px',
        padding: '40px 24px',
        borderTop: '1px solid rgb(220,220,220)',
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0, left: 0, bottom: 0,
        width: hovered ? '100%' : '0%',
        background: '#030303',
        transition: 'width 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
        zIndex: 0,
      }} />
      <span className="award-title" style={{ position: 'relative', zIndex: 1, fontSize: '20px', fontWeight: 500, letterSpacing: '0.04em', color: hovered ? '#e8c547' : '#030303', textTransform: 'uppercase', transition: 'color 0.3s' }}>{a.title}</span>
      <span className="award-text" style={{ position: 'relative', zIndex: 1, fontSize: '16px', color: hovered ? 'rgba(255,255,255,0.6)' : 'rgb(104,105,99)', lineHeight: 1.5, transition: 'color 0.3s' }}>{a.source}</span>
      <span className="award-text" style={{ position: 'relative', zIndex: 1, fontSize: '16px', color: hovered ? 'rgba(255,255,255,0.6)' : 'rgb(104,105,99)', lineHeight: 1.5, transition: 'color 0.3s' }}>{a.desc}</span>
      <span style={{ position: 'relative', zIndex: 1, fontSize: '18px', fontWeight: 500, color: hovered ? '#fff' : '#030303', textAlign: 'right', transition: 'color 0.3s' }}>{a.year}</span>
    </div>
  );
}

export function AwardsSection() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
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

      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenter - viewportCenter);
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
        <SectionHeader num="02" label="Erbjudanden" extra="© 2026" />
        <FadeIn>
          <h2 className="hide-mobile" style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#030303', textTransform: 'uppercase', margin: '0 0 80px' }}>
            ERBJUDANDEN
          </h2>
        </FadeIn>
        <div style={{ borderBottom: '1px solid rgb(220,220,220)' }}>
          {AWARDS.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.07}>
              <AwardRow a={a} forceHovered={activeIndex === i} onRef={(el) => { rowRefs.current[i] = el; }} />
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.3}>
          <div style={{ marginTop: '48px' }}>
            <PillButton />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
