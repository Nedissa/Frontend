'use client';
import { useState } from 'react';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';
import { useScrollActiveIndex } from './useScrollActiveIndex';

const PROCESS = [
  { step: '01', title: 'Planering & behovsanalys', desc: 'Vi träffar ert team för att lära känna er verksamhet, era mål och projektidén. Tillsammans tar vi fram en handlingsplan skräddarsydd för just er.' },
  { step: '02', title: 'Prototyp', desc: 'Vi designar en mockup av er webbplats och presenterar den för er. När den initiala designen är klar går vi vidare med revisioner för att finslipa den.' },
  { step: '03', title: 'Utveckling', desc: 'Vi bygger webbplatsen med moderna metoder och standarder, så ni får en responsiv, SEO-vänlig och högkonverterande lösning.' },
  { step: '04', title: 'Lansering', desc: 'Projektet testas och optimeras innan lansering, och vi säkerställer att allt fungerar precis som det ska innan sajten går live.' },
  { step: '05', title: 'Support', desc: 'Vi håller nära kontakt med ert team efter lansering, så vi kan hjälpa till med framtida utvecklingsbehov på lång sikt.' },
];

function FeatureCard({ step, title, desc, tall, forceHovered, onRef }: { step: string; title: string; desc: string; tall?: boolean; forceHovered?: boolean; onRef?: (el: HTMLDivElement | null) => void }) {
  const [mouseHovered, setMouseHovered] = useState(false);
  const [origin, setOrigin] = useState('top left');
  const hovered = forceHovered || mouseHovered;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left < rect.width / 2 ? 'left' : 'right';
    const y = e.clientY - rect.top < rect.height / 2 ? 'top' : 'bottom';
    setOrigin(`${y} ${x}`);
    setMouseHovered(true);
  };

  return (
    <div
      ref={onRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setMouseHovered(false)}
      className="feature-card relative overflow-hidden bg-[#ebebea] px-[36px] py-[40px] min-h-[220px] flex flex-col justify-between rounded-[8px] cursor-default box-border"
      style={{ height: tall ? '100%' : undefined }}
    >
      <div
        className="absolute inset-0 bg-[#030303]"
        style={{
          transform: hovered ? 'scale(1)' : 'scale(0)',
          transformOrigin: origin,
          transition: 'transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      />
      <span
        className="relative text-[32px] font-extrabold block"
        style={{
          letterSpacing: '-0.02em',
          color: hovered ? '#e8c547' : '#030303',
          transition: 'color 0.35s',
        }}
      >
        {step}
      </span>
      <div className="relative">
        <h3
          className="text-[19px] font-semibold m-0 mb-[12px]"
          style={{
            letterSpacing: '-0.02em',
            color: hovered ? '#fff' : '#030303',
            transition: 'color 0.35s',
          }}
        >
          {title}
        </h3>
        <p
          className="feature-card-desc text-[15px] leading-[1.6] m-0"
          style={{
            color: hovered ? 'rgba(255,255,255,0.6)' : 'rgb(104,105,99)',
            transition: 'color 0.35s',
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

// Grid placement for the five rendered feature cards, in render order.
const GRID_AREAS = ['a', 'd', 'b', 'c', 'e'];

export function FeaturesSection() {
  const { activeIndex, setItemRef } = useScrollActiveIndex();

  return (
    <section
      className="section-padding section-full-desktop py-[140px] px-[30px] min-h-screen box-border"
      style={{ background: '#f5f5f3' }}
    >
      <div className="max-w-[1440px] mx-auto">
        <SectionHeader num="06" label="Processen" extra="© 2026" hasVisibleHeading />
        <FadeIn>
          <div className="mb-[48px]">
            <p className="text-[12px] font-semibold uppercase m-0 mb-[10px] flex items-center gap-[8px]" style={{ letterSpacing: '0.12em', color: 'rgb(104,105,99)' }}>
              <span className="w-[7px] h-[7px] bg-[#e8c547] inline-block" />
              PROCESSEN
            </p>
            <h2
              className="features-heading font-extrabold uppercase m-0"
              style={{
                fontSize: 'clamp(36px,5vw,64px)',
                letterSpacing: '-0.03em',
                lineHeight: 0.95,
                color: '#030303',
              }}
            >
              <span className="features-heading-line" style={{ display: 'block' }}>Vi Designar.</span>
              <span className="features-heading-line" style={{ display: 'block', color: 'rgb(104,105,99)' }}>Utvecklar.</span>
              <span className="features-heading-line" style={{ display: 'block', color: 'rgb(180,180,175)' }}>Levererar</span>
            </h2>
          </div>
        </FadeIn>

        <div
          className="grid-features grid gap-[20px] min-h-[480px]"
          style={{
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gridTemplateAreas: '"a b c" "d b e"',
          }}
        >
          {GRID_AREAS.map((gridArea, i) => (
            <FadeIn key={PROCESS[i].title} delay={(i + 1) * 0.05} className="feature-grid-item" style={{ gridArea }}>
              <FeatureCard {...PROCESS[i]} tall forceHovered={activeIndex === i} onRef={setItemRef(i)} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
