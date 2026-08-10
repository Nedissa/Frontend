import type { Project } from '../../projekt-data';
import { Eyebrow, ImagePlaceholder } from './WireframePrimitives';

function StoryBlock({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center gap-4 py-12 border-b border-neutral-200 last:border-b-0">
      <Eyebrow>{eyebrow}</Eyebrow>
      {children}
    </div>
  );
}

export function SplitScreenStory({ project }: { project: Project }) {
  return (
    <section className="border-t border-neutral-200">
      <div className="max-w-[1440px] mx-auto w-full px-12 box-border grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Vänster: sticky bild */}
        <div className="md:sticky md:top-24 md:h-fit md:self-start py-12">
          <ImagePlaceholder label={`${project.title} - Storyvisual - 4:5`} aspect="aspect-[4/5]" />
        </div>

        {/* Höger: scrollande redaktionell text */}
        <div className="flex flex-col">
          <StoryBlock eyebrow={`Projektöversikt · ${project.category}`}>
            <h1 className="text-[clamp(28px,3.5vw,48px)] font-bold tracking-tight leading-[1.1] text-neutral-900 m-0">
              {project.title} — {project.year}
            </h1>
            <p className="text-base leading-relaxed text-neutral-600 max-w-[60ch] m-0">
              {project.challenge ?? project.description.slice(0, 180)}
            </p>
          </StoryBlock>

          {project.challenge && (
            <StoryBlock eyebrow="Utmaningen">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 m-0">Vad kunden stod inför.</h2>
              <p className="text-sm leading-[1.7] text-neutral-600 m-0">{project.challenge}</p>
            </StoryBlock>
          )}

          {project.solution && (
            <StoryBlock eyebrow="Lösningen">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 m-0">Vad vi byggde.</h2>
              <p className="text-sm leading-[1.7] text-neutral-600 m-0">{project.solution}</p>
            </StoryBlock>
          )}

          {project.result && (
            <StoryBlock eyebrow="Resultatet">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 m-0">Vad kunden fick.</h2>
              <p className="text-sm leading-[1.7] text-neutral-600 m-0">{project.result}</p>
            </StoryBlock>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <StoryBlock eyebrow="Verktyg & plattform">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-full text-xs font-medium text-neutral-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </StoryBlock>
          )}

          {project.solution && (
            <StoryBlock eyebrow="Kundcitat">
              <p className="text-lg leading-[1.65] text-neutral-800 m-0">&ldquo;{project.solution}&rdquo;</p>
              <span className="text-xs text-neutral-500">[Kundnamn] · {project.title}</span>
            </StoryBlock>
          )}
        </div>
      </div>
    </section>
  );
}
