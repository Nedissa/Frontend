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
      className="inline-flex items-center justify-between rounded-full gap-[40px] no-underline cursor-pointer relative overflow-hidden min-w-[220px]"
      style={{
        background: '#e8c547',
        padding: '10px 10px 10px 20px',
      }}
    >
      {/* Wipe from left to right */}
      <div
        className="absolute top-0 left-0 bottom-0 rounded-full z-0"
        style={{
          width: hovered ? '100%' : '0%',
          background: '#030303',
          transition: 'width 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      />
      <span
        className="relative z-[1] text-[15px] font-medium whitespace-nowrap"
        style={{
          color: hovered ? '#fff' : '#030303',
          transition: 'color 0.3s',
        }}
      >
        Låt oss prata
      </span>
      <span
        className="relative z-[1] w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0"
        style={{
          background: hovered ? '#fff' : 'rgba(255,255,255,0.4)',
          transition: 'background 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        {/* Dots — left shrinks, right grows from the left */}
        <span
          className="flex items-center"
          style={{
            gap: hovered ? '0px' : '4px',
            transition: 'gap 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        >
          <span
            className="h-[10px] rounded-full overflow-hidden shrink-0"
            style={{
              width: hovered ? '0px' : '10px',
              background: 'rgba(3,3,3,0.4)',
              transition: 'width 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
            }}
          />
          <span
            className="rounded-full shrink-0"
            style={{
              width: hovered ? '14px' : '10px',
              height: hovered ? '14px' : '10px',
              background: hovered ? '#030303' : '#fff',
              transformOrigin: 'left center',
              transition: 'width 0.4s cubic-bezier(0.76, 0, 0.24, 1), height 0.4s cubic-bezier(0.76, 0, 0.24, 1), background 0.3s ease',
            }}
          />
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
      className="grid-awards-row relative grid items-center gap-[40px] px-[24px] py-[40px] cursor-default overflow-hidden"
      style={{
        gridTemplateColumns: '2fr 2fr 2fr 80px',
        borderTop: '1px solid rgb(220,220,220)',
      }}
      onMouseEnter={() => setMouseHovered(true)}
      onMouseLeave={() => setMouseHovered(false)}
    >
      <div
        className="absolute top-0 left-0 bottom-0 z-0"
        style={{
          width: hovered ? '100%' : '0%',
          background: '#030303',
          transition: 'width 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      />
      <span
        className="absolute bottom-[8px] right-[8px] z-[2]"
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: '0 0 18px 18px',
          borderColor: 'transparent transparent #e8c547 transparent',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      <span
        className="award-title relative z-[1] text-[20px] font-medium uppercase"
        style={{
          letterSpacing: '0.04em',
          color: hovered ? '#e8c547' : '#030303',
          transition: 'color 0.3s',
        }}
      >
        {a.title}
      </span>
      <span
        className="award-text relative z-[1] text-[16px] leading-[1.5]"
        style={{
          color: hovered ? 'rgba(255,255,255,0.6)' : 'rgb(104,105,99)',
          transition: 'color 0.3s',
        }}
      >
        {a.source}
      </span>
      <span
        className="award-text relative z-[1] text-[16px] leading-[1.5]"
        style={{
          color: hovered ? 'rgba(255,255,255,0.6)' : 'rgb(104,105,99)',
          transition: 'color 0.3s',
        }}
      >
        {a.desc}
      </span>
      <span
        className="relative z-[1] text-[18px] font-medium text-right"
        style={{
          color: hovered ? '#fff' : '#030303',
          transition: 'color 0.3s',
        }}
      >
        {a.year}
      </span>
    </div>
  );
}

export function AwardsSection() {
  const { activeIndex, setItemRef } = useScrollActiveIndex();

  return (
    <section
      className="section-padding py-[140px] px-[30px] min-h-screen box-border"
      style={{ background: '#f5f5f3' }}
    >
      <div className="max-w-[1440px] mx-auto">
        <SectionHeader num="02" label="Expertis" extra="© 2026" />
        <FadeIn>
          <h2
            className="hide-mobile font-extrabold uppercase m-0 mb-[80px]"
            style={{
              fontSize: 'clamp(36px,5vw,64px)',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              color: '#030303',
            }}
          >
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
          <div className="mt-[48px]">
            <PillButton />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
