'use client';
import type { ProjectStep } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { Eyebrow, ITALIC, StyledSection } from './StyledPrimitives';

const FALLBACK_BENEFITS: ProjectStep[] = [
  { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
  { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
  { title: 'Matchningar', description: 'Statistik och matchningsdata presenteras tydligt så användaren ser sin utveckling.' },
];


function BenefitCard({ item, index, accentColor }: { item: ProjectStep; index: number; isActive?: boolean; accentColor?: string }) {
  return (
    <div
      className="mx-auto relative w-full max-w-[260px]"
      data-mockup
      data-mockup-color={item.accentColor ?? accentColor}
      {...(index === 1 ? { 'data-line-start': true } : {})}
    >
      <img
        src={item.image}
        alt={item.title}
        className="relative w-full h-[540px] object-cover rounded-[24px]"
      />
    </div>
  );
}

export function StyledBenefitScroll({ projectTitle, benefits, projectAccentColor }: { projectTitle: string; benefits?: ProjectStep[]; projectAccentColor?: string }) {
  const items = benefits && benefits.length > 0 ? benefits : FALLBACK_BENEFITS;

  return (
    <StyledSection className="border-t border-black/5">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <FadeIn>
          <div className="flex flex-col items-center gap-4">
            <Eyebrow>Genomförande</Eyebrow>
            <h2
              className="text-[clamp(28px,3.5vw,44px)] font-normal tracking-[-0.02em] leading-[1.1] text-[#030303] m-0 max-w-[600px]"
              style={ITALIC}
            >
              Så prioriterar du rätt i en digital transformation
            </h2>
          </div>
        </FadeIn>
      </div>

      {/* Cards grid - show first 3 cards */}
      <div className="flex flex-wrap justify-center items-center gap-20 w-full bg-transparent shadow-none">
        {items.slice(0, 3).map((item, index) => (
          <FadeIn key={item.title} delay={index * 0.15} className="!w-auto">
            <BenefitCard
              item={item}
              index={index}
              accentColor={projectAccentColor}
            />
          </FadeIn>
        ))}
      </div>
    </StyledSection>
  );
}
