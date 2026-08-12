'use client';
import { type ReactNode } from 'react';
import type { ProjectStep } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { Eyebrow, ITALIC, StyledSection } from './StyledPrimitives';

const FALLBACK_BENEFITS: ProjectStep[] = [
  { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
  { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
  { title: 'Matchningar', description: 'Statistik och matchningsdata presenteras tydligt så användaren ser sin utveckling.' },
];

function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      {/* iPhone-ram */}
      <div className="relative aspect-[9/19.5] bg-black rounded-[32px] shadow-2xl border-[8px] border-black overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-6 bg-black rounded-b-[16px] z-50" />

        {/* Skärm */}
        <div className="absolute inset-6 top-7 bottom-6 bg-white rounded-[24px] overflow-hidden">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-0.5 bg-black rounded-full" />
      </div>
    </div>
  );
}

function BenefitCard({ item, isActive }: { item: ProjectStep; isActive: boolean }) {
  return (
    <div className="w-full max-w-[280px] mx-auto">

      {item.image ? (
        <div className="relative w-full aspect-[9/16] rounded-[24px] overflow-hidden shadow-lg">
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
      ) : (
        <MobileFrame>
          <div className="w-full h-full flex flex-col items-center justify-between p-4 text-center bg-gradient-to-b from-[#030303] to-[#1a1a1a]">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#e8c547] shadow-lg z-10" />
            <div className="flex flex-col items-center gap-4 mt-6 flex-1 justify-center">
              <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed max-w-[180px]">{item.description}</p>
            </div>
            <button className="px-4 py-1.5 bg-white text-[#030303] rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors mb-2">
              Läs mer
            </button>
          </div>
        </MobileFrame>
      )}
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
      <div className="grid grid-cols-3 gap-8 w-full px-4">
        {items.slice(0, 3).map((item, index) => (
          <BenefitCard
            key={item.title}
            item={item}
            isActive={true}
          />
        ))}
      </div>
    </StyledSection>
  );
}
