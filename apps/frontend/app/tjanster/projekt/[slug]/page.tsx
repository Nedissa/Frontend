import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '../../projekt-data';
import { ProjectNav } from '../../components/ProjectNav';
import { CenteredHeroWireframe } from '../../components/wireframe/CenteredHeroWireframe';
import { TimelineWireframe } from '../../components/wireframe/TimelineWireframe';
import { TestimonialWireframe } from '../../components/wireframe/TestimonialWireframe';
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

      <CenteredHeroWireframe project={project} />

      <TimelineWireframe projectTitle={project.title} steps={project.steps} />

      {project.solution && (
        <TestimonialWireframe quote={project.solution} projectTitle={project.title} category={project.category} />
      )}

      <CtaNavWireframe prevSlug={prevProject.slug} nextSlug={nextProject.slug} />
    </main>
  );
}
