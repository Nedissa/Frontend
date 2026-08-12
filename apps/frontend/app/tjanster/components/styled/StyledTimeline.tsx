'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion';
import type { ProjectStep } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { Eyebrow, ITALIC, StyledSection } from './StyledPrimitives';

const FALLBACK_BULLETS = ['Långsiktig support och underhåll', 'Transparent rapportering varje månad', 'Proaktiv övervakning av system'];

const FALLBACK_STEPS: ProjectStep[] = [
  { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
  { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
  { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.' },
];

function TiltImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const scale = useSpring(useMotionValue(1), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 45);
    rotateX.set(py * -28);
  };

  const handleEnter = () => {
    scale.set(1.06);
  };
  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-full"
      style={{ perspective: '800px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <motion.div
        className="relative w-full h-full overflow-hidden mockup-frame"
        style={{ rotateX, rotateY, scale }}
      >
        <Image src={src} alt={alt} fill className="object-cover scale-110" />
      </motion.div>
    </div>
  );
}

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

      <div ref={trackRef} className="relative max-w-[1100px] mx-auto">
        {/* Bakgrundslinje */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-gray-300" />
        {/* Scroll-driven progress-linje, signatur-elementet */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-2 w-px bg-black origin-top"
          style={{ scaleY: progressHeight, height: 'calc(100% - 16px)' }}
        />

        <div className="flex flex-col gap-20">
          {items.map((step, i) => {
            const imageFirst = i % 2 === 0;
            const isLast = i === items.length - 1;
            const offsetClass = i % 4 === 1 ? 'md:mt-16' : i % 4 === 3 ? 'md:-mt-10' : '';

            if (isLast) {
              return (
                <FadeIn key={step.title} delay={i * 0.08}>
                  <div className="relative bg-transparent">
                    <div className="absolute left-1/2 -translate-x-1/2 top-1 w-6 h-6 rounded-full bg-[#fbbf24] border-[6px] border-black z-10" />

                    <div className="flex flex-col items-center text-center gap-6 max-w-[560px] mx-auto">
                      {step.image && (
                        <div className="relative w-full max-w-[340px] aspect-[5/4]">
                          <div
                            className="absolute -inset-x-10 -inset-y-16 pointer-events-none"
                            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,241,191,1) 0%, rgba(250,220,110,0.95) 8%, rgba(232,197,71,0.85) 20%, rgba(232,197,71,0.55) 35%, rgba(232,197,71,0.28) 48%, rgba(232,197,71,0.1) 58%, rgba(232,197,71,0.03) 65%, rgba(255,255,255,0) 72%)' }}
                          />
                          <TiltImage src={step.image} alt={`${projectTitle} — ${step.title}`} />
                        </div>
                      )}

                      <div>
                        <span className="text-xs uppercase tracking-widest text-[#8a8a86] font-medium">Fördel</span>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#030303] mt-2 mb-3">{step.title}</h3>
                        <p className="text-sm leading-[1.7] text-[#5c5c58] mb-4">{step.description}</p>
                        <ul className="flex flex-col items-center gap-0 w-full divide-y divide-black/10">
                          {(step.bullets ?? FALLBACK_BULLETS).map((bullet) => (
                            <li key={bullet} className="text-sm text-[#5c5c58] py-4 w-full text-center">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            }

            return (
              <FadeIn key={step.title} delay={i * 0.08}>
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 top-1 w-6 h-6 rounded-full bg-[#fbbf24] border-[3px] border-black z-10" />

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${offsetClass} bg-transparent`}>
                    {step.image && imageFirst && (
                      <div className="relative w-full aspect-[5/4] order-1">
                        <div
                          className="absolute -inset-x-10 -inset-y-16 pointer-events-none"
                          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,241,191,1) 0%, rgba(250,220,110,0.95) 8%, rgba(232,197,71,0.85) 20%, rgba(232,197,71,0.55) 35%, rgba(232,197,71,0.28) 48%, rgba(232,197,71,0.1) 58%, rgba(232,197,71,0.03) 65%, rgba(255,255,255,0) 72%)' }}
                        />
                        <TiltImage src={step.image} alt={`${projectTitle} — ${step.title}`} />
                      </div>
                    )}

                    <div className={step.image ? `order-2 ${imageFirst ? '' : 'md:order-1'}` : ''}>
                      <span className="text-xs uppercase tracking-widest text-[#8a8a86] font-medium">Fördel</span>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#030303] mt-2 mb-3">{step.title}</h3>
                      <p className="text-sm leading-[1.7] text-[#5c5c58] mb-4">{step.description}</p>
                      <ul className="flex flex-col gap-0 mb-6 w-full divide-y divide-black/10">
                        {(step.bullets ?? FALLBACK_BULLETS).map((bullet, idx) => (
                          <li key={bullet} className="text-sm text-[#5c5c58] py-4">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {step.image && !imageFirst && (
                      <div className="relative w-full aspect-[5/4] order-2 md:order-2">
                        <div
                          className="absolute -inset-x-10 -inset-y-16 pointer-events-none"
                          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,241,191,1) 0%, rgba(250,220,110,0.95) 8%, rgba(232,197,71,0.85) 20%, rgba(232,197,71,0.55) 35%, rgba(232,197,71,0.28) 48%, rgba(232,197,71,0.1) 58%, rgba(232,197,71,0.03) 65%, rgba(255,255,255,0) 72%)' }}
                        />
                        <TiltImage src={step.image} alt={`${projectTitle} — ${step.title}`} />
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
