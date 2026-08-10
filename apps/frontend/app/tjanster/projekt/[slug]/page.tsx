import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '../../projekt-data';
import { ProjectNav } from '../../components/ProjectNav';
import { HeroWireframe } from '../../components/wireframe/HeroWireframe';
import { BentoWireframe } from '../../components/wireframe/BentoWireframe';
import { CompactStorySection } from '../../components/wireframe/CompactStorySection';
import { GalleryWireframe } from '../../components/wireframe/GalleryWireframe';
import { CtaNavWireframe } from '../../components/wireframe/CtaNavWireframe';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.title} — Webbprojekt`;
  const description = project.description.slice(0, 155);
  return {
    title,
    description,
    openGraph: { title, description, url: `https://techpilots.se/tjanster/projekt/${slug}`, ...(project.image ? { images: [{ url: project.image }] } : {}) },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://techpilots.se/tjanster/projekt/${slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <main className="bg-neutral-50 text-neutral-900 relative">
      <ProjectNav />

      <HeroWireframe project={project} />

      <BentoWireframe project={project} />

      <CompactStorySection
        cards={[
          project.challenge ? { eyebrow: 'Utmaningen', heading: 'Vad kunden stod inför.', text: project.challenge } : null,
          project.solution ? { eyebrow: 'Lösningen', heading: 'Vad vi byggde.', text: project.solution } : null,
          project.result ? { eyebrow: 'Resultatet', heading: 'Vad kunden fick.', text: project.result } : null,
        ].filter((c): c is { eyebrow: string; heading: string; text: string } => c !== null)}
      />

      <GalleryWireframe steps={project.steps} />

      <CtaNavWireframe prevSlug={prevProject.slug} nextSlug={nextProject.slug} />
    </main>
  );
}
