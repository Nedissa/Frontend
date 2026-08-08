import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS } from '../../projekt-data';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

function ImageSlot({ style, image }: { style?: React.CSSProperties; image?: string }) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        borderRadius: '8px',
        background: image ? undefined : 'rgb(240,240,238)',
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style,
      }}
    />
  );
}

function StepBlock({ num, title, description }: { num: string; title: string; description: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px', maxWidth: '900px' }}>
      <h2 style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: '#030303' }}>
        <span>{num}</span> {title}
      </h2>
      <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgb(104,105,99)', margin: 0 }}>{description}</p>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];

  const steps = project.steps ?? [];
  const [heroStep, ...collageSteps] = steps;

  return (
    <main>
      {/* Section — light: title + meta + 1.0 single image */}
      <section style={{ background: '#fff', color: '#030303', minHeight: '100vh', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '160px 30px 100px', width: '100%' }}>
          <h1 style={{ fontSize: 'clamp(48px,8vw,88px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 32px' }}>
            {project.title}
          </h1>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgb(60,60,58)', maxWidth: '760px', margin: 0 }}>
              {project.description}
            </p>

            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgb(150,150,145)', marginBottom: '6px' }}>Tjänst</div>
                <div style={{ fontSize: '14px', color: 'rgb(60,60,58)' }}>{project.category}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgb(150,150,145)', marginBottom: '6px' }}>Status</div>
                <div style={{ fontSize: '14px', color: '#e8c547', fontWeight: 600 }}>{project.status}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgb(150,150,145)', marginBottom: '6px' }}>År</div>
                <div style={{ fontSize: '14px', color: 'rgb(60,60,58)' }}>{project.year}</div>
              </div>
            </div>
          </div>

          {heroStep && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              <ImageSlot image={heroStep.image} />
              <StepBlock num="1.0" title={heroStep.title} description={heroStep.description} />
            </div>
          )}
        </div>
      </section>

      {/* Section — 2.0 & 3.0: two equal-size images side by side */}
      {collageSteps.length > 0 && (
        <section style={{ background: 'rgb(247,247,246)', color: '#030303', minHeight: '100vh', boxSizing: 'border-box', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '100px 30px', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${collageSteps.length}, 1fr)`, gap: '48px' }}>
              {collageSteps.map((step, i) => (
                <div key={step.title} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <ImageSlot style={{ aspectRatio: '4 / 3' }} image={step.image} />
                  <div>
                    <h2 style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 12px', color: '#030303' }}>
                      {i + 2}.0 {step.title}
                    </h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgb(104,105,99)', margin: 0 }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section — 4.0: single image conclusion */}
      {project.solution && (
        <section style={{ background: '#fff', color: '#030303', minHeight: '100vh', boxSizing: 'border-box', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '100px 30px', display: 'flex', flexDirection: 'column', gap: '48px', width: '100%' }}>
            <ImageSlot />
            <StepBlock num="4.0" title="Slutsats" description={project.solution} />
          </div>
        </section>
      )}

      {/* Section — light: prev/next */}
      <section style={{ background: '#fff', color: '#030303' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 30px 140px', display: 'flex', justifyContent: 'space-between' }}>
          <Link
            href={`/webbstudio/projekt/${prevProject.slug}`}
            style={{ fontSize: '14px', fontWeight: 600, color: '#030303', textDecoration: 'none', padding: '10px 20px', border: '1px solid rgb(225,225,222)', borderRadius: '999px' }}
          >
            ← Föregående
          </Link>
          <Link
            href="/webbstudio#projekt"
            style={{ fontSize: '14px', fontWeight: 600, color: 'rgb(104,105,99)', textDecoration: 'none' }}
          >
            Alla projekt
          </Link>
          <Link
            href={`/webbstudio/projekt/${nextProject.slug}`}
            style={{ fontSize: '14px', fontWeight: 600, color: '#030303', textDecoration: 'none', padding: '10px 20px', border: '1px solid rgb(225,225,222)', borderRadius: '999px' }}
          >
            Nästa →
          </Link>
        </div>
      </section>
    </main>
  );
}
