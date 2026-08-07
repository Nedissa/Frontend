'use client';
import { useState } from 'react';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';
import { useScrollActiveIndex } from './useScrollActiveIndex';

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
        background: '#e8c547',
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
      <span style={{ position: 'relative', zIndex: 1, color: hovered ? '#fff' : '#030303', fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap', transition: 'color 0.3s' }}>Låt oss prata</span>
      <span style={{
        width: '34px', height: '34px', borderRadius: '50%',
        background: hovered ? '#fff' : 'rgba(255,255,255,0.4)',
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
            background: 'rgba(3,3,3,0.4)',
            overflow: 'hidden',
            flexShrink: 0,
            transition: 'width 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
          }} />
          <span style={{
            width: hovered ? '14px' : '10px',
            height: hovered ? '14px' : '10px',
            borderRadius: '50%',
            background: hovered ? '#030303' : '#fff',
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
  { title: 'DESIGN & VARUMÄRKE', source: 'Visuell identitet och UX · Skräddarsytt för er verksamhet', desc: 'Vi tar fram design och varumärkesidentitet som håller ihop, från första skiss till färdig produkt. Genomtänkt användarupplevelse, inte bara fina bilder.', year: '' },
  { title: 'WEBBUTVECKLING', source: 'Next.js och React · Byggt från grunden, inte mallverktyg', desc: 'Vi bygger snabba, skalbara digitala lösningar med modern kod. Från arkitektur till lansering levererar vi något som håller och växer med er verksamhet.', year: '' },
  { title: 'E-HANDEL', source: 'Medusa, Shopify, Stripe och Klarna · Rätt plattform för varje projekt', desc: 'Vi bygger e-handelslösningar med Medusa eller Shopify som motor, kopplat mot rätt betallösningar. Full kontroll över köpupplevelsen, anpassad efter era behov.', year: '' },
  { title: 'SÖKOPTIMERING', source: 'Teknisk SEO · Från struktur till mätbara resultat', desc: 'Vi bygger med sökmotorer i åtanke redan från start, med snabb laddning, ren kod och rätt struktur. Vi hjälper er synas, oavsett om målet är lokalt eller nationellt.', year: '' },
  { title: 'SPÅRNING & ANALYS', source: 'Google Analytics och Tag Manager · Data ni faktiskt kan använda', desc: 'Vi kopplar upp rätt analysverktyg så ni ser hur besökare faktiskt använder er produkt. Ingen gissning, bara underlag för att fatta bättre beslut.', year: '' },
];

function AwardRow({ a, forceHovered, onRef }: { a: typeof AWARDS[0]; forceHovered?: boolean; onRef?: (el: HTMLDivElement | null) => void }) {
  const [mouseHovered, setMouseHovered] = useState(false);
  const hovered = forceHovered || mouseHovered;
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
      <span style={{
        position: 'absolute', bottom: '8px', right: '8px', zIndex: 2,
        width: 0, height: 0,
        borderStyle: 'solid',
        borderWidth: '0 0 18px 18px',
        borderColor: `transparent transparent ${'#e8c547'} transparent`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />
      <span className="award-title" style={{ position: 'relative', zIndex: 1, fontSize: '20px', fontWeight: 500, letterSpacing: '0.04em', color: hovered ? '#e8c547' : '#030303', textTransform: 'uppercase', transition: 'color 0.3s' }}>{a.title}</span>
      <span className="award-text" style={{ position: 'relative', zIndex: 1, fontSize: '16px', color: hovered ? 'rgba(255,255,255,0.6)' : 'rgb(104,105,99)', lineHeight: 1.5, transition: 'color 0.3s' }}>{a.source}</span>
      <span className="award-text" style={{ position: 'relative', zIndex: 1, fontSize: '16px', color: hovered ? 'rgba(255,255,255,0.6)' : 'rgb(104,105,99)', lineHeight: 1.5, transition: 'color 0.3s' }}>{a.desc}</span>
      <span style={{ position: 'relative', zIndex: 1, fontSize: '18px', fontWeight: 500, color: hovered ? '#fff' : '#030303', textAlign: 'right', transition: 'color 0.3s' }}>{a.year}</span>
    </div>
  );
}

export function AwardsSection() {
  const { activeIndex, setItemRef } = useScrollActiveIndex();

  return (
    <section className="section-padding" style={{ background: '#f5f5f3', padding: '140px 30px', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <SectionHeader num="02" label="Expertis" extra="© 2026" />
        <FadeIn>
          <h2 className="hide-mobile" style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#030303', textTransform: 'uppercase', margin: '0 0 80px' }}>
            BRED <span style={{ color: 'rgb(104,105,99)' }}>EXPERTIS.</span>
          </h2>
        </FadeIn>
        <div style={{ borderBottom: '1px solid rgb(220,220,220)' }}>
          {AWARDS.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.07}>
              <AwardRow a={a} forceHovered={activeIndex === i} onRef={setItemRef(i)} />
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
