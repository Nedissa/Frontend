'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Project, ProjectStep } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { Eyebrow, ITALIC, StyledSection } from './StyledPrimitives';
import { TravelingGlow, type GlowRect } from './TravelingGlow';

const FALLBACK_BULLETS = ['Långsiktig support och underhåll', 'Transparent rapportering varje månad', 'Proaktiv övervakning av system'];

const FALLBACK_STEPS: ProjectStep[] = [
  { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
  { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
  { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.' },
];

const DEFAULT_ACCENT = '#E8C547';

export function StyledTimeline({ projectTitle, steps, projectAccentColor }: { projectTitle: string; steps?: ProjectStep[]; projectAccentColor?: Project['accentColor'] }) {
  const items = steps && steps.length > 0 ? steps : FALLBACK_STEPS;
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeRect, setActiveRect] = useState<GlowRect | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  activeIndexRef.current = activeIndex;

  const indexesWithImage = useMemo(
    () =>
      items.reduce<number[]>((acc, step, i) => {
        if (step.image) acc.push(i);
        return acc;
      }, []),
    [items]
  );

  useEffect(() => {
    if (indexesWithImage.length === 0) return;

    function measure(index: number) {
      const container = containerRef.current;
      const el = imageRefs.current.get(index);
      if (!container || !el) return;
      const containerBox = container.getBoundingClientRect();
      const elBox = el.getBoundingClientRect();
      setActiveIndex(index);
      setActiveRect({
        top: elBox.top - containerBox.top,
        left: elBox.left - containerBox.left,
        width: elBox.width,
        height: elBox.height,
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          const indexAttr = entry.target.getAttribute('data-step-index');
          if (indexAttr === null) continue;
          const index = Number(indexAttr);
          if (entry.intersectionRatio > 0.5 && (!best || entry.intersectionRatio > best.ratio)) {
            best = { index, ratio: entry.intersectionRatio };
          }
        }
        if (best) measure(best.index);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    for (const index of indexesWithImage) {
      const el = imageRefs.current.get(index);
      if (el) observer.observe(el);
    }

    measure(indexesWithImage[0]);

    let ticking = false;
    const remeasure = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (activeIndexRef.current !== null) measure(activeIndexRef.current);
        ticking = false;
      });
    };
    window.addEventListener('resize', remeasure);
    window.addEventListener('scroll', remeasure, { passive: true });
    window.addEventListener('load', remeasure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('scroll', remeasure);
      window.removeEventListener('load', remeasure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexesWithImage.length]);

  const activeColor = (activeIndex !== null ? items[activeIndex]?.accentColor : undefined) ?? projectAccentColor ?? DEFAULT_ACCENT;

  return (
    <StyledSection className="border-t border-black/5">
      <div className="relative z-10 bg-white flex flex-col items-center text-center gap-4 mb-16">
        <FadeIn>
          <div className="flex flex-col items-center gap-4">
            <Eyebrow>Processen</Eyebrow>
            <h2
              className="text-[clamp(28px,3.5vw,44px)] font-normal tracking-[-0.02em] leading-[1.1] text-[#030303] m-0 max-w-[800px]"
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

      <div ref={containerRef} className="relative w-full mx-auto">
        <TravelingGlow rect={activeRect} color={activeColor} />

        <div className="flex flex-col gap-20 pb-20">
          {items.map((step, i) => {
            const imageFirst = i % 2 === 0;
            const isLast = i === items.length - 1;

            const registerImageRef = (el: HTMLDivElement | null) => {
              if (el) imageRefs.current.set(i, el);
              else imageRefs.current.delete(i);
            };

            if (isLast) {
              return (
                <FadeIn key={step.title} delay={i * 0.08}>
                  <div className="relative">
                    <div data-line-end className="absolute left-1/2 -translate-x-1/2 top-1 w-6 h-6 rounded-full bg-[#fbbf24] border-[3px] border-black z-10" />

                    <div className="flex flex-col items-center text-center gap-6 max-w-[720px] mx-auto px-2 md:px-0">
                      {step.image && (
                        <div ref={registerImageRef} data-step-index={i} className="relative mx-auto mt-4 w-[300px]">
                          <img src={step.image} alt={`${projectTitle} — ${step.title}`} className="relative w-full h-[420px] object-cover rounded-[24px]" />
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

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-transparent`}>
                    {step.image && (
                      <div
                        ref={registerImageRef}
                        data-step-index={i}
                        className={`relative mx-auto w-[300px] ${imageFirst ? 'md:order-1 md:ml-auto md:mr-8' : 'md:order-2 md:mr-auto md:ml-8'}`}
                      >
                        <img src={step.image} alt={`${projectTitle} — ${step.title}`} className="relative w-full h-[420px] object-cover rounded-[24px]" />
                      </div>
                    )}

                    <div className={`max-w-[420px] ${imageFirst ? 'md:order-2 md:ml-8' : 'md:order-1 md:mr-8 md:ml-auto'}`}>
                      <span className="text-xs uppercase tracking-widest text-[#8a8a86] font-medium">Fördel</span>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#030303] mt-2 mb-3">{step.title}</h3>
                      <p className="text-sm leading-[1.7] text-[#5c5c58] mb-4">{step.description}</p>
                      <ul className="flex flex-col gap-0 mb-6 w-full divide-y divide-black/10">
                        {(step.bullets ?? FALLBACK_BULLETS).map((bullet) => (
                          <li key={bullet} className="text-sm text-[#5c5c58] py-4">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
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
