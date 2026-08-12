'use client';
import type { ProjectStep } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { Eyebrow, ITALIC, StyledSection } from './StyledPrimitives';

const FALLBACK_BENEFITS: ProjectStep[] = [
  { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
  { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
  { title: 'Matchningar', description: 'Statistik och matchningsdata presenteras tydligt så användaren ser sin utveckling.' },
];


function BenefitCard({ item, index }: { item: ProjectStep; index: number; isActive?: boolean }) {

  return (
    <div className="w-full max-w-[280px] mx-auto relative">
      <div className="relative w-full aspect-[9/16] rounded-[24px] overflow-hidden shadow-lg mockup-frame">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <span className="text-xs uppercase tracking-widest font-medium text-[#e8c547]">Fördel</span>
          <h3 className="text-xl font-bold mt-2 mb-2">{item.title}</h3>
          <p className="text-sm leading-relaxed line-clamp-2">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export function StyledBenefitScroll({ projectTitle, benefits }: { projectTitle: string; benefits?: ProjectStep[] }) {
  const items = benefits && benefits.length > 0 ? benefits : FALLBACK_BENEFITS;

  return (
    <StyledSection className="border-t border-black/5">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <FadeIn>
          <div className="flex flex-col items-center gap-4">
            <Eyebrow>Fördelar</Eyebrow>
            <h2
              className="text-[clamp(28px,3.5vw,44px)] font-normal tracking-[-0.02em] leading-[1.1] text-[#030303] m-0 max-w-[600px]"
              style={ITALIC}
            >
              Så prioriterar du rätt i en digital transformation
            </h2>
            <p className="text-sm text-[#5c5c58] max-w-[60ch] m-0">
              De första projekten måste in på grund av teknikens gränser och på grund av allt för ofta att man.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Cards grid - show first 3 cards */}
      <div className="grid grid-cols-3 gap-8 w-full px-4 bg-transparent">
        {items.slice(0, 3).map((item, index) => (
          <BenefitCard
            key={item.title}
            item={item}
            index={index}
          />
        ))}
      </div>
    </StyledSection>
  );
}
