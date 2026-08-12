'use client';
import { useRef, useState, useEffect, type ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
    <div className="relative w-full max-w-[240px] mx-auto">
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
    <motion.div
      className={`flex-shrink-0 w-[240px] transition-all duration-300 ${isActive ? 'scale-100' : 'scale-85 opacity-50'}`}
      style={{
        transformOrigin: 'center',
      }}
    >
      <MobileFrame>
        <div className="w-full h-full flex flex-col items-center justify-between p-4 text-center bg-gradient-to-b from-[#030303] to-[#1a1a1a]">
          {/* Gul prick på toppen */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#e8c547] shadow-lg z-10" />

          <div className="flex flex-col items-center gap-4 mt-6 flex-1 justify-center">
            <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-[180px]">{item.description}</p>

            {item.bullets && (
              <ul className="flex flex-col gap-2 mt-3 text-left text-xs text-gray-400">
                {item.bullets.slice(0, 2).map((bullet) => (
                  <li key={bullet} className="flex items-start gap-1.5">
                    <span className="mt-1 w-0.5 h-0.5 rounded-full bg-[#e8c547] shrink-0" />
                    <span className="line-clamp-2">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="px-4 py-1.5 bg-white text-[#030303] rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors mb-2">
            Läs mer
          </button>
        </div>
      </MobileFrame>
    </motion.div>
  );
}

export function StyledBenefitScroll({ projectTitle, benefits }: { projectTitle: string; benefits?: ProjectStep[] }) {
  const items = benefits && benefits.length > 0 ? benefits : FALLBACK_BENEFITS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const itemWidth = 240 + 16; // width + gap
      const containerWidth = scrollContainer.clientWidth;
      const centerX = containerWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      items.forEach((_, i) => {
        // Calculate item center position
        const itemCenter = scrollLeft + (i * itemWidth) + 120; // itemLeft + half card width
        const distance = Math.abs(itemCenter - centerX);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount

    // Scroll to center first item
    setTimeout(() => {
      if (scrollContainer) {
        const containerWidth = scrollContainer.clientWidth;
        const itemWidth = 240 + 16;
        const padding = (containerWidth - 240) / 2;
        scrollContainer.scrollLeft = -padding;
      }
    }, 100);

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [items.length]);

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

      {/* Scrollbar container */}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Benefit cards */}
          {items.map((item, index) => (
            <div key={item.title} className="snap-center flex-shrink-0">
              <BenefitCard item={item} isActive={index === activeIndex} />
            </div>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollRef.current) {
                  const itemWidth = 240 + 16;
                  const scrollTarget = index * itemWidth;
                  scrollRef.current.scrollTo({
                    left: scrollTarget,
                    behavior: 'smooth',
                  });
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-[#030303] w-8' : 'bg-black/20 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </StyledSection>
  );
}
