import Image from 'next/image';
import type { Project } from '../../projekt-data';
import { FadeIn } from '../FadeIn';

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-widest text-[#8a8a86]">{label}</span>
      <span className="text-sm font-bold uppercase text-[#030303]">{value}</span>
    </div>
  );
}

export function StyledHero({ project }: { project: Project }) {
  const bodyText = project.challenge ?? project.description.slice(0, 180);

  return (
    <section className="bg-white">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 box-border pt-32 md:pt-44">
        <FadeIn>
          <div className="max-w-[900px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex flex-col gap-5">
              <h1
                className="text-[clamp(36px,6vw,72px)] font-bold uppercase tracking-tight leading-[0.95] text-[#030303] m-0"
                style={{ textShadow: '0 2px 12px rgba(3,3,3,0.15)' }}
              >
                {project.title}
              </h1>
              <p className="text-base leading-relaxed text-[#5c5c58] max-w-[45ch] m-0">{bodyText}</p>
            </div>

            <div className="flex gap-8 shrink-0 mt-6">
              <MetaItem label="Client" value={project.title} />
              <MetaItem label="Service" value={project.category} />
              <MetaItem label="Date" value={project.year} />
            </div>
          </div>
        </FadeIn>

        {project.image && (
          <FadeIn delay={0.15}>
            <div className="relative max-w-[1100px] mx-auto mt-4 md:mt-6">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={project.image}
                  alt={`${project.title} — skärmdump`}
                  fill
                  className="object-contain mockup-frame"
                  priority
                />
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
