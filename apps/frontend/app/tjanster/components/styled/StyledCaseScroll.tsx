'use client';
import type { Project } from '../../projekt-data';
import { FadeIn } from '../FadeIn';

function CaseBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm text-[#8a8a86]">({label})</span>
      <p className="text-base leading-relaxed text-[#5c5c58] max-w-[40ch] m-0">{text}</p>
    </div>
  );
}

export function StyledCaseScroll({ project }: { project: Project }) {
  const images = (project.steps ?? []).map((step) => step.image).filter((src): src is string => Boolean(src));

  if (!project.challenge && !project.solution && !project.result && images.length === 0) return null;

  return (
    <section className="relative border-t border-black/5">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 box-border py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start flex flex-col gap-16">
            <FadeIn>
              <div className="flex flex-col gap-16">
                {project.challenge && <CaseBlock label="Utmaning" text={project.challenge} />}
                {project.solution && <CaseBlock label="Lösning" text={project.solution} />}
                {project.result && (
                  <div className="flex flex-col gap-3">
                    <span className="text-sm text-[#8a8a86]">(Resultat)</span>
                    <p className="text-base leading-relaxed text-[#5c5c58] max-w-[40ch] m-0">{project.result}</p>
                  </div>
                )}
              </div>
            </FadeIn>

            {project.website && (
              <FadeIn delay={0.1}>
                <a
                  href={`https://${project.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base text-[#030303] font-medium border-b border-black/20 pb-1 w-fit no-underline transition-colors duration-300 hover:border-black/60"
                >
                  Live Preview
                </a>
              </FadeIn>
            )}
          </div>

          <div className="flex flex-col items-center gap-6">
            {images.map((src, index) => (
              <FadeIn key={src} delay={index * 0.1}>
                <img
                  src={src}
                  alt={project.steps?.[index]?.title ?? project.title}
                  className="w-full max-w-[380px] h-auto object-cover rounded-[16px]"
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
