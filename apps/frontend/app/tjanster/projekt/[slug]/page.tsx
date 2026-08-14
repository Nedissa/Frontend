import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '../../projekt-data';
import { ProjectNav } from '../../components/ProjectNav';
import { StyledHero } from '../../components/styled/StyledHero';
import { StyledBenefitScroll } from '../../components/styled/StyledBenefitScroll';
import { StyledTabletShowcase } from '../../components/styled/StyledTabletShowcase';
import { StyledCaseScroll } from '../../components/styled/StyledCaseScroll';
import { CtaSection } from '../../components/CtaSection';

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

  return (
    <main className="bg-white text-[#030303] relative">
      <ProjectNav />

      <StyledHero project={project} />

      <StyledBenefitScroll projectTitle={project.title} benefits={project.steps} projectAccentColor={project.accentColor} />

      <StyledTabletShowcase project={project} />

      <StyledCaseScroll project={project} />

      <CtaSection />
    </main>
  );
}
