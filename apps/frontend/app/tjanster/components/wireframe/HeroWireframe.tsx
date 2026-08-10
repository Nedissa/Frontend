import type { Project } from '../../projekt-data';
import { WireframeSection, Eyebrow, ImagePlaceholder, PrimaryButton, SecondaryButton } from './WireframePrimitives';

export function HeroWireframe({ project }: { project: Project }) {
  const bodyText = project.challenge ?? project.description.slice(0, 180);

  return (
    <WireframeSection className="pt-36">
      <div className="flex flex-col items-start text-left gap-4">
        <Eyebrow>Projektöversikt · {project.category}</Eyebrow>

        <h1 className="text-[clamp(32px,5vw,64px)] font-bold tracking-tight leading-none text-neutral-900 m-0">
          {project.title} — {project.year}
        </h1>

        <p className="text-base leading-relaxed text-neutral-600 max-w-[60ch] m-0">{bodyText}</p>

        <div className="flex flex-wrap gap-3 pt-4">
          {project.website && (
            <PrimaryButton href={`https://${project.website}`}>Besök live-sida ↗</PrimaryButton>
          )}
          <SecondaryButton href="/tjanster#projekt">Se alla projekt</SecondaryButton>
        </div>

        <div className="w-full pt-10">
          <ImagePlaceholder label={`${project.title} - Hero Showcase - 16:9`} aspect="aspect-video" />
        </div>
      </div>
    </WireframeSection>
  );
}
