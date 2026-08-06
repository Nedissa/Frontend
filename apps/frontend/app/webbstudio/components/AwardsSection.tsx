'use client';
import { useState } from 'react';
import { FadeIn } from './FadeIn';

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
        background: '#0a0a0a',
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
      {/* Wipe från vänster till höger */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, bottom: 0,
        width: hovered ? '100%' : '0%',
        background: '#0a0a0a',
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
        {/* Prickar — vänster krymper, höger växer från vänster */}
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
            background: hovered ? '#0a0a0a' : '#fff',
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
  { title: 'UTVALD STUDIO', source: 'Design Inspiration Hub · 2023 Kvalitet framför troféer', desc: 'Lyfts fram som en studio att bevaka för konsekvent kvalitetstänkande.', year: '2021' },
];

function AwardRow({ a }: { a: typeof AWARDS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        background: '#0a0a0a',
        transition: 'width 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
        zIndex: 0,
      }} />
      <span style={{ position: 'relative', zIndex: 1, fontSize: '20px', fontWeight: 500, letterSpacing: '0.04em', color: hovered ? '#fff' : '#0a0a0a', textTransform: 'uppercase', transition: 'color 0.3s' }}>{a.title}</span>
      <span style={{ position: 'relative', zIndex: 1, fontSize: '16px', color: hovered ? 'rgba(255,255,255,0.6)' : 'rgb(120,120,114)', lineHeight: 1.5, transition: 'color 0.3s' }}>{a.source}</span>
      <span style={{ position: 'relative', zIndex: 1, fontSize: '16px', color: hovered ? 'rgba(255,255,255,0.6)' : 'rgb(120,120,114)', lineHeight: 1.5, transition: 'color 0.3s' }}>{a.desc}</span>
      <span style={{ position: 'relative', zIndex: 1, fontSize: '18px', fontWeight: 500, color: hovered ? '#fff' : '#0a0a0a', textAlign: 'right', transition: 'color 0.3s' }}>{a.year}</span>
    </div>
  );
}

export function AwardsSection() {
  return (
    <section style={{ background: '#f5f5f3', padding: '140px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FadeIn>
          <h2 style={{ fontSize: 'clamp(40px,6vw,80px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#0a0a0a', textTransform: 'uppercase', margin: '0 0 80px' }}>
            ERBJUDANDEN
          </h2>
        </FadeIn>
        <div style={{ borderBottom: '1px solid rgb(220,220,220)' }}>
          {AWARDS.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.07}>
              <AwardRow a={a} />
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
