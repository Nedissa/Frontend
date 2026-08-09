import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { IconType } from 'react-icons';
import { SiNextdotjs, SiPayloadcms, SiStripe, SiKlarna, SiShopify, SiMedusa, SiReact, SiTypescript } from 'react-icons/si';
import { PROJECTS } from '../../projekt-data';
import { ProjectNav } from '../../components/ProjectNav';
import { ServicesAccordion } from '../../components/ServicesAccordion';

const TECH_ICONS: Record<string, IconType> = {
  'Next.js': SiNextdotjs,
  'Payload CMS': SiPayloadcms,
  'Stripe': SiStripe,
  'Klarna': SiKlarna,
  'Shopify': SiShopify,
  'Medusa': SiMedusa,
  'React': SiReact,
  'TypeScript': SiTypescript,
};

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
    openGraph: { title, description, url: `https://techpilots.se/webbstudio/projekt/${slug}`, ...(project.image ? { images: [{ url: project.image }] } : {}) },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://techpilots.se/webbstudio/projekt/${slug}` },
  };
}

const ITALIC = { fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontStyle: 'italic' } as const;
const PLACEHOLDER_GRADIENT = 'radial-gradient(circle at 30% 20%, #e8c547 0%, #d9d9d9 55%, #f0f0f0 100%)';

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <main className="bg-[#f0efed] text-[#030303] relative">
      <ProjectNav />

      {/* ══ SEKTION 1: Hero ══ */}
      <section>
        <div className="max-w-[1440px] mx-auto w-full px-12 box-border">

          <div className="pt-36 flex flex-col items-start text-left gap-2">

            <div className="text-lg text-[#f5b700]" style={{ letterSpacing: '2px' }}>★★★★★</div>

            <span className="inline-block px-3.5 py-1 bg-white border border-[#e0e0e0] rounded-full text-xs font-medium text-[#555] mb-3">
              Projektöversikt
            </span>

            <h1 className="text-[clamp(28px,5vw,88px)] font-normal tracking-[-0.03em] leading-none m-0 whitespace-nowrap" style={ITALIC}>
              {project.title} — {project.year}
            </h1>

            <p className="text-base leading-relaxed text-[#4d4d4d] max-w-[500px] m-0">
              {project.challenge ?? project.description.slice(0, 180)}
            </p>

            <div className="w-full pt-10">
              <div className="w-full rounded-[20px] max-h-[660px] aspect-[16/9]" style={{ background: PLACEHOLDER_GRADIENT }} />
            </div>
          </div>

        </div>
      </section>

      {/* ══ SEKTION 2: Teknikstack (ticker) ══ */}
      {project.technologies && project.technologies.length > 0 && (
        <section className="pt-10 pb-10">
          <div className="max-w-[1440px] mx-auto w-full px-12 box-border overflow-hidden">
            <p className="text-base text-[#555] mb-6 font-semibold text-center">Techpilots teknikstack:</p>
            <div className="flex justify-center">
              <div className="animate-marquee flex items-center gap-0 whitespace-nowrap opacity-45">
                {Array.from({ length: 8 }, () => project.technologies).flat().map((tech, i) => {
                  const Icon = TECH_ICONS[tech];
                  return (
                    <span key={i} className="inline-flex items-center gap-3 text-2xl font-semibold text-[#030303] px-10">
                      {Icon && <Icon size={32} />}
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ SEKTION 3: Om projektet ══ */}
      <section>
        <div className="max-w-[1440px] mx-auto w-full px-12 box-border">
          <div className="py-20 grid gap-16 items-start" style={{ gridTemplateColumns: '45fr 55fr' }}>
            <div className="w-full rounded-[20px] aspect-[4/3]" style={{ background: PLACEHOLDER_GRADIENT }} />
            <div className="flex flex-col gap-5 pt-2">
              <span className="inline-block px-3.5 py-1 bg-[#f0efed] border border-[#ddd] rounded-full text-xs font-medium text-[#555] w-fit">
                Utmaningen
              </span>
              <h2 className="text-[clamp(28px,3.5vw,48px)] font-normal tracking-[-0.02em] leading-[1.1] m-0" style={ITALIC}>
                Utmaningen med {project.title}.
              </h2>
              <p className="text-sm leading-[1.7] text-[#555] m-0">{project.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SEKTION 2b: Vad vi levererade (accordion + bild) ══ */}
      <section>
        <div className="max-w-[1440px] mx-auto w-full px-12 box-border">
          <div className="pt-20 pb-20" style={{ minHeight: '640px' }}>
            <ServicesAccordion
              rows={[
                { title: 'Utmaningen', text: project.challenge },
                { title: 'Lösningen', text: project.solution },
                { title: 'Resultatet', text: project.result },
              ].filter(row => row.text)}
            />
          </div>
        </div>
      </section>

      {/* ══ SEKTION 4: Varför Techpilots ══ */}
      <section>
        <div className="max-w-[1440px] mx-auto w-full px-12 box-border">
          <div className="py-20 flex flex-col items-center gap-12 text-center">

            <div className="flex flex-col items-center gap-4">
              <span className="inline-block px-3.5 py-1 bg-white border border-[#e0e0e0] rounded-full text-[13px] font-medium">
                Varför Techpilots
              </span>
              <h2 className="text-[clamp(36px,5vw,64px)] font-normal tracking-[-0.03em] leading-[1.05] m-0 max-w-[700px]" style={ITALIC}>
                Techpilots är inte en vanlig webbyrå.
              </h2>
              <p className="text-[15px] leading-relaxed text-[#4d4d4d] max-w-[420px] m-0">
                Hoppa över mallen och kortsiktiga lösningar. Välj en partner med verklig erfarenhet.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 w-full">

              <div className="rounded-[24px] min-h-[520px]" style={{ background: PLACEHOLDER_GRADIENT }} />

              <div className="rounded-[24px] min-h-[520px]" style={{ background: PLACEHOLDER_GRADIENT }} />

            </div>

            <div className="max-w-[600px] flex flex-col gap-4 items-center">
              <span className="text-[40px] leading-none" style={ITALIC}>"</span>
              <p className="text-lg leading-[1.65] m-0 font-normal">{project.solution}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-11 h-11 rounded-full bg-[#D75E15] flex items-center justify-center text-white text-lg font-bold" style={ITALIC}>
                  {project.title[0]}
                </div>
                <div className="text-left">
                  <div className="text-[15px] font-semibold">{project.title}</div>
                  <div className="text-xs text-[#888]">{project.category}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ NAV ══ */}
      <section className="border-t border-[#ddd]">
        <div className="max-w-[1440px] mx-auto w-full px-12 box-border pt-10 pb-24 flex justify-between">
          <Link href={`/webbstudio/projekt/${prevProject.slug}`} className="px-7 py-3 bg-[#030303] text-white text-sm font-semibold no-underline rounded-full">
            ← Föregående
          </Link>
          <Link href={`/webbstudio/projekt/${nextProject.slug}`} className="px-7 py-3 bg-[#030303] text-white text-sm font-semibold no-underline rounded-full">
            Nästa →
          </Link>
        </div>
      </section>

    </main>
  );
}
