'use client';
import type { Project } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { Eyebrow, ITALIC, StyledSection } from './StyledPrimitives';

export function StyledTabletShowcase({ project }: { project: Project }) {
  if (!project.tabletImage && !project.image) return null;

  return (
    <StyledSection className="border-t border-black/5">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <FadeIn>
          <div className="flex flex-col items-center gap-4">
            <Eyebrow>Resultat</Eyebrow>
            <h2
              className="text-[clamp(28px,3.5vw,44px)] font-normal tracking-[-0.02em] leading-[1.1] text-[#030303] m-0 max-w-[800px]"
              style={ITALIC}
            >
              Responsiv design på dator och surfplatta.
            </h2>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.08}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-[1280px] mx-auto">
          {project.image && (
            <div className="relative w-full md:max-w-[720px]" data-mockup data-mockup-color={project.accentColor}>
              <img
                src={project.image}
                alt={`${project.title} — dator`}
                className="relative w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
              />
            </div>
          )}
          {project.tabletImage && (
            <div className="relative w-full md:max-w-[480px]" data-mockup data-mockup-color={project.accentColor}>
              <img
                src={project.tabletImage}
                alt={`${project.title} — surfplatta`}
                className="relative w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
              />
            </div>
          )}
        </div>
      </FadeIn>
    </StyledSection>
  );
}
