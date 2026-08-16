'use client';
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
  return (
    <section className="relative">
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-12 box-border pt-24 md:pt-32">
        <FadeIn>
          <div className="max-w-[900px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex flex-col gap-5">
              <h1
                className="text-[clamp(36px,6vw,52px)] font-bold uppercase tracking-tight leading-[0.95] text-[#030303] m-0"
                style={{ textShadow: '0 2px 12px rgba(3,3,3,0.15)' }}
              >
                {project.title}
              </h1>
            </div>

            <div className="flex gap-8 shrink-0 mt-6">
              <MetaItem label="Kund" value={project.title} />
              <MetaItem label="Tjänst" value={project.category} />
              <MetaItem label="Datum" value={project.year} />
            </div>
          </div>
        </FadeIn>

        {project.image && (
          <FadeIn delay={0.15}>
            <div className="relative max-w-[1000px] mx-auto -mt-12 md:-mt-20">
              <div className="relative w-full aspect-square" data-mockup data-mockup-color={project.accentColor}>
                <Image
                  src={project.image}
                  alt={`${project.title} — skärmdump`}
                  fill
                  className="object-cover mockup-frame"
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
