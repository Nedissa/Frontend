import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS } from '../../projekt-data';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <main style={{ background: '#fff', color: '#030303', minHeight: '100vh' }}>
      <section style={{ padding: '160px 30px 100px', maxWidth: '900px', margin: '0 auto' }}>
        <Link
          href="/webbstudio#projekt"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'rgb(104,105,99)', textDecoration: 'none', marginBottom: '48px' }}
        >
          ← Tillbaka till projekt
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', color: '#e8c547', textTransform: 'uppercase' }}>{project.status}</span>
          <span style={{ fontSize: '13px', color: 'rgb(104,105,99)' }}>{project.category} · {project.year}</span>
        </div>

        <h1 style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 40px' }}>
          {project.title}
        </h1>

        <div style={{ width: '100%', aspectRatio: '16 / 9', background: 'rgb(240,240,238)', borderRadius: '4px', marginBottom: '48px' }} />

        <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgb(60,60,58)', maxWidth: '700px' }}>
          {project.description}
        </p>
      </section>
    </main>
  );
}
