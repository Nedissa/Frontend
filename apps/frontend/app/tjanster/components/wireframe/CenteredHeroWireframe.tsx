import Image from 'next/image';
import type { Project } from '../../projekt-data';
import { ImagePlaceholder, PrimaryButton, SecondaryButton, WireframeSection } from './WireframePrimitives';

export function CenteredHeroWireframe({ project }: { project: Project }) {
  const bodyText = project.challenge ?? project.description.slice(0, 180);

  return (
    <WireframeSection className="pt-36">
      <div className="flex flex-col items-center text-center gap-4">
        <h1 className="text-[clamp(28px,4vw,48px)] font-bold tracking-tight leading-[1.1] text-neutral-900 m-0 max-w-[760px]">
          {project.title} — en resa värd att berätta.
        </h1>

        <p className="text-base leading-relaxed text-neutral-600 max-w-[60ch] m-0">{bodyText}</p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {project.website && (
            <PrimaryButton href={`https://${project.website}`}>Besök live-sida ↗</PrimaryButton>
          )}
          <SecondaryButton href="/tjanster#projekt">Se alla projekt</SecondaryButton>
        </div>

        <div className="w-full pt-10">
          {project.image ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-neutral-200">
              <Image
                src={project.image}
                alt={`${project.title} — skärmdump`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <ImagePlaceholder label={`${project.title} - Hero Showcase - 16:9`} aspect="aspect-video" />
          )}
        </div>
      </div>
    </WireframeSection>
  );
}
