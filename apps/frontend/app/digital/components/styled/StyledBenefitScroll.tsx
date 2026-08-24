'use client';
import type { ProjectStep } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { Eyebrow, ITALIC, StyledSection } from './StyledPrimitives';
import { BrowserFrame } from '../BrowserFrame';

const FALLBACK_BENEFITS: ProjectStep[] = [
  { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
  { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
  { title: 'Matchningar', description: 'Statistik och matchningsdata presenteras tydligt så användaren ser sin utveckling.' },
];


function BenefitCard({ item, index, projectTitle }: { item: ProjectStep; index: number; projectTitle: string }) {
  return (
    <div className="mx-auto relative w-full max-w-[300px]" {...(index === 1 ? { 'data-line-start': true } : {})}>
      {item.image && (
        <BrowserFrame
          src={item.image}
          alt={item.title}
          website={projectTitle.toLowerCase().replace(/\s+/g, '')}
          className="w-full"
          imgClassName="w-full h-auto block"
        />
      )}
    </div>
  );
}

export function StyledBenefitScroll({ projectTitle, benefits }: { projectTitle: string; benefits?: ProjectStep[]; projectAccentColor?: string }) {
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
              projectTitle={projectTitle}
            />
          </FadeIn>
        ))}
      </div>
    </StyledSection>
  );
}
