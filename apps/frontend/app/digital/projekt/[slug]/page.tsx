import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '../../projekt-data';
import { ProjectPageTemplate } from '../../components/styled/ProjectPageTemplate';
import { getPagespeedResult } from '../../components/styled/PerformanceBadge';
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
    openGraph: { title, description, url: `https://techpilots.se/digital/projekt/${slug}`, ...(project.image ? { images: [{ url: project.image }] } : {}) },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://techpilots.se/digital/projekt/${slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const pagespeedResult = await getPagespeedResult(project.slug);

  return (
    <main className="bg-white text-[#030303] relative">
      <ProjectPageTemplate project={project} pagespeedResult={pagespeedResult} />

      <CtaSection />
    </main>
  );
}
