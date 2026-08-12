'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import type { ProjectStep } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { Eyebrow, ITALIC, SecondaryButton, StyledSection } from './StyledPrimitives';

const FALLBACK_STEPS: ProjectStep[] = [
  { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
  { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
  { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.' },
];

export function StyledTimeline({ projectTitle, steps }: { projectTitle: string; steps?: ProjectStep[] }) {
  const items = steps && steps.length > 0 ? steps : FALLBACK_STEPS;
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.75', 'end 0.4'],
  });
  const progressHeight = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <StyledSection className="border-t border-black/5">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <FadeIn>
          <div className="flex flex-col items-center gap-4">
            <Eyebrow>Processen</Eyebrow>
            <h2
              className="text-[clamp(28px,3.5vw,44px)] font-normal tracking-[-0.02em] leading-[1.1] text-[#030303] m-0 max-w-[600px]"
              style={ITALIC}
            >
              En kronologi av skapande och lärdom.
            </h2>
            <p className="text-sm text-[#5c5c58] max-w-[60ch] m-0">
              Så tog {projectTitle} form, steg för steg, från första skiss till lanserad plattform.
            </p>
          </div>
        </FadeIn>
      </div>

      <div ref={trackRef} className="relative max-w-[1100px] mx-auto pl-10 md:pl-12">
        {/* Bakgrundslinje */}
        <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-px bg-black/10" />
        {/* Scroll-driven progress-linje, signatur-elementet */}
        <motion.div
          className="absolute left-[7px] md:left-[9px] top-2 w-px bg-[#e8c547] origin-top"
          style={{ scaleY: progressHeight, height: 'calc(100% - 16px)' }}
        />

        <div className="flex flex-col gap-20">
          {items.map((step, i) => {
            const imageFirst = i % 2 === 0;
            return (
              <FadeIn key={step.title} delay={i * 0.08}>
                <div className="relative">
                  <div className="absolute -left-10 md:-left-12 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#e8c547] shadow-[0_0_0_4px_rgba(215,94,21,0.1)]" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {step.image && imageFirst && (
                      <div
                        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(3,3,3,0.1)] border border-black/5 transition-transform duration-500 hover:scale-[1.01] order-1"
                        style={{ background: '#030303' }}
                      >
                        <Image
                          src={step.image}
                          alt={`${projectTitle} — ${step.title}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className={step.image ? `order-2 ${imageFirst ? '' : 'md:order-1'}` : ''}>
                      <span className="text-xs uppercase tracking-widest text-[#e8c547] font-semibold">{step.title}</span>
                      <h3 className="text-xl font-semibold tracking-tight text-[#030303] mt-1 mb-3">{step.title}</h3>
                      <p className="text-sm leading-[1.7] text-[#5c5c58] mb-4">{step.description}</p>
                      <SecondaryButton href="#">Visa steg ↗</SecondaryButton>
                    </div>

                    {step.image && !imageFirst && (
                      <div
                        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(3,3,3,0.1)] border border-black/5 transition-transform duration-500 hover:scale-[1.01] order-2 md:order-2"
                        style={{ background: '#030303' }}
                      >
                        <Image
                          src={step.image}
                          alt={`${projectTitle} — ${step.title}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </StyledSection>
  );
}
