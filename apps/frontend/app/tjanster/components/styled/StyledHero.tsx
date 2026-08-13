'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Project } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { GlowBackground } from './StyledPrimitives';

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
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 box-border pt-24 md:pt-32">
        <FadeIn>
          <div className="max-w-[780px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex flex-col gap-5">
              <h1
                className="text-[clamp(36px,6vw,52px)] font-bold uppercase tracking-tight leading-[0.95] text-[#030303] m-0"
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
            <div className="relative max-w-[1000px] mx-auto -mt-12 md:-mt-20">
              <motion.div
                className="relative w-full aspect-[4/3]"
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <GlowBackground strong color={project.accentColor} />
                <Image
                  src={project.image}
                  alt={`${project.title} — skärmdump`}
                  fill
                  className="object-cover mockup-frame"
                  priority
                />
              </motion.div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
