import Image from 'next/image';
import type { Project } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { ITALIC, PrimaryButton, SecondaryButton, StyledSection } from './StyledPrimitives';

export function StyledHero({ project }: { project: Project }) {
  const bodyText = project.challenge ?? project.description.slice(0, 180);

  return (
    <StyledSection className="pt-40">
      <div className="flex flex-col items-center text-center gap-5">
        <FadeIn>
          <div className="flex flex-col items-center gap-5">
            <h1
              className="text-[clamp(32px,4.5vw,56px)] font-normal tracking-[-0.02em] leading-[1.05] text-[#030303] m-0 max-w-[820px]"
              style={ITALIC}
            >
              {project.title} — en resa värd att berätta.
            </h1>

            <p className="text-base leading-relaxed text-[#5c5c58] max-w-[60ch] m-0">{bodyText}</p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {project.website && (
                <PrimaryButton href={`https://${project.website}`}>Besök live-sida ↗</PrimaryButton>
              )}
              <SecondaryButton href="/tjanster#projekt">Se alla projekt</SecondaryButton>
            </div>
          </div>
        </FadeIn>

        {project.image && (
          <FadeIn delay={0.15} className="w-full pt-8">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(3,3,3,0.12)] border border-black/5 bg-white transition-transform duration-500 hover:scale-[1.005]">
              <Image
                src={project.image}
                alt={`${project.title} — skärmdump`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
        )}
      </div>
    </StyledSection>
  );
}
