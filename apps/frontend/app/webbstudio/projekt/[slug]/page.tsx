import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS } from '../../projekt-data';

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

const SERIF = { fontFamily: '"Georgia","Times New Roman",serif' } as const;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];

  const heroImg = project.image;
  const mobileImg = project.mobileImage;

  return (
    <main className="bg-[#f0efed] text-[#030303]">

      {/* ══ SEKTION 1: Hero ══ */}
      <section>
        <div className="max-w-[1440px] mx-auto w-full px-12 box-border">

          <div className="pt-24 flex flex-col items-center text-center gap-5">

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} viewBox="0 0 256 256" width="12" height="12" fill="#D75E15">
                  <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                </svg>
              ))}
              <span className="text-[13px] font-medium ml-2">{project.category}</span>
            </div>

            <h1 className="text-[clamp(44px,7vw,88px)] font-normal tracking-[-0.03em] leading-none m-0 max-w-[800px]" style={SERIF}>
              {project.title} — <em>{project.year}</em>
            </h1>

            <p className="text-base leading-relaxed text-[#4d4d4d] max-w-[500px] m-0">
              {project.challenge ?? project.description.slice(0, 180)}
            </p>

            <div className="flex gap-2 mt-2">
              <Link href="/webbstudio" className="px-7 py-3.5 bg-[#030303] text-white text-[15px] font-semibold no-underline rounded-full">
                Se alla projekt
              </Link>
              {project.website && (
                <a href={`https://${project.website}`} target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 bg-white text-[#030303] text-[15px] font-semibold no-underline rounded-full border border-[#ddd]">
                  Besök sajten
                </a>
              )}
            </div>

            {heroImg && (
              <div className="w-full pt-10">
                <img src={heroImg} alt={project.title} className="w-full block rounded-[20px] max-h-[660px] object-cover" />
              </div>
            )}
          </div>

          {/* Ticker */}
          <div className="pt-12 pb-20 text-center">
            <p className="text-[13px] text-[#888] mb-5 font-medium">Techpilots projekt:</p>
            <div className="flex gap-12 justify-center flex-wrap opacity-45">
              {PROJECTS.filter(p => p.slug !== project.slug).map(p => (
                <Link key={p.slug} href={`/webbstudio/projekt/${p.slug}`} className="text-sm font-semibold text-[#030303] no-underline">
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SEKTION 2: Om projektet ══ */}
      <section>
        <div className="max-w-[1440px] mx-auto w-full px-12 box-border">

          {/* Del 1: bild vänster + text höger */}
          <div className="py-20 grid gap-16 items-start" style={{ gridTemplateColumns: '45fr 55fr' }}>
            {(heroImg || mobileImg) && (
              <img src={heroImg ?? mobileImg} alt={project.title} className="w-full block rounded-[20px] object-cover aspect-[4/3]" />
            )}
            <div className="flex flex-col gap-5 pt-2">
              <span className="inline-block px-3.5 py-1 bg-[#f0efed] border border-[#ddd] rounded-full text-xs font-medium text-[#555] w-fit">
                Om projektet
              </span>
              <h2 className="text-[clamp(28px,3.5vw,48px)] font-normal tracking-[-0.02em] leading-[1.1] m-0" style={SERIF}>
                En <em>digital resa</em><br />för {project.title}.
              </h2>
              {project.challenge && <p className="text-[13px] font-semibold m-0">Vad var utmaningen?</p>}
              {project.challenge && <p className="text-sm leading-[1.7] text-[#555] m-0">{project.challenge}</p>}
              {project.solution && <p className="text-sm leading-[1.7] text-[#555] m-0">{project.solution}</p>}
              <p className="text-[13px] text-[#888] m-0">Framtiden tillhör dem som lär sig och anpassar sig.</p>
            </div>
          </div>

          {/* Del 2: centrerad rubrik */}
          <div className="pb-12 flex flex-col items-center text-center gap-4">
            <span className="inline-block px-3.5 py-1 bg-[#f0efed] border border-[#ddd] rounded-full text-xs font-medium text-[#555]">
              Vad vi gjorde
            </span>
            <h2 className="text-[clamp(36px,5vw,64px)] font-normal tracking-[-0.03em] leading-[1.05] m-0 max-w-[640px]" style={SERIF}>
              Hur Techpilots <em>levererade.</em>
            </h2>
            <p className="text-sm leading-relaxed text-[#555] max-w-[480px] m-0">
              Skräddarsydd lösning som skapar tydlighet, stärker varumärket och levererar verkliga resultat.
            </p>
          </div>

          {/* Del 3: kort + teknik-lista vänster, bild höger */}
          <div className="pb-20 grid grid-cols-2 gap-8 items-start">
            <div className="flex flex-col">
              <div className="bg-white rounded-[20px] p-10 flex flex-col gap-4">
                <h3 className="text-[32px] font-normal m-0 tracking-[-0.02em] leading-[1.1]" style={SERIF}>
                  {project.technologies?.[0] ?? 'Webbutveckling'}
                </h3>
                <p className="text-[13px] leading-[1.7] text-[#555] m-0">{project.result}</p>
                <Link href="/webbstudio/kontakt" className="inline-block px-6 py-3 bg-[#030303] text-white text-[13px] font-semibold no-underline rounded-full w-fit">
                  Starta ett projekt
                </Link>
              </div>
              <div className="flex flex-col">
                {(project.technologies ?? []).map((tech) => (
                  <div key={tech} className="py-5 border-b border-[#ddd] text-[32px] font-normal tracking-[-0.02em]" style={SERIF}>
                    {tech}
                  </div>
                ))}
              </div>
            </div>
            {(mobileImg || heroImg) && (
              <img src={mobileImg ?? heroImg} alt={project.title} className="w-full block rounded-[20px] object-cover aspect-[4/3]" />
            )}
          </div>

        </div>
      </section>

      {/* ══ SEKTION 3: Varför Techpilots ══ */}
      <section>
        <div className="max-w-[1440px] mx-auto w-full px-12 box-border">
          <div className="py-20 flex flex-col items-center gap-12 text-center">

            <div className="flex flex-col items-center gap-4">
              <span className="inline-block px-3.5 py-1 bg-white border border-[#e0e0e0] rounded-full text-[13px] font-medium">
                Varför Techpilots
              </span>
              <h2 className="text-[clamp(36px,5vw,64px)] font-normal tracking-[-0.03em] leading-[1.05] m-0 max-w-[700px]" style={SERIF}>
                Techpilots är <em>inte</em> ett vanligt webbyrå.
              </h2>
              <p className="text-[15px] leading-relaxed text-[#4d4d4d] max-w-[420px] m-0">
                Hoppa över mallen och kortsiktiga lösningar. Välj en partner med verklig erfarenhet.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 w-full">

              <div className="rounded-[24px] overflow-hidden relative min-h-[520px]">
                {(mobileImg || heroImg) && <img src={mobileImg ?? heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative p-8 h-full flex flex-col justify-between min-h-[520px] box-border">
                  <div className="flex justify-center">
                    <span className="inline-block px-5 py-2 bg-white/20 border border-white/40 rounded-full text-[22px] font-normal text-white" style={SERIF}>
                      Utmaningen
                    </span>
                  </div>
                  <div className="bg-white/95 rounded-[20px] p-8 flex flex-col items-center">
                    {project.challenge?.split('.').filter(s => s.trim().length > 8).slice(0, 4).map((s, i, arr) => (
                      <div key={i} className="flex flex-col items-center w-full">
                        <p className="text-sm text-[#030303] m-0 text-center leading-relaxed py-2.5">{s.trim()}.</p>
                        {i < arr.length - 1 && <span className="text-[#D75E15] text-[10px]">•</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] overflow-hidden relative min-h-[520px]">
                {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative p-8 h-full flex flex-col justify-between min-h-[520px] box-border">
                  <div className="flex justify-center">
                    <span className="inline-block px-5 py-2 bg-white/20 border border-white/40 rounded-full text-[22px] font-normal text-white" style={SERIF}>
                      Med Techpilots
                    </span>
                  </div>
                  <div className="bg-white/95 rounded-[20px] p-8 flex flex-col items-center">
                    {project.result?.split('.').filter(s => s.trim().length > 8).slice(0, 4).map((s, i, arr) => (
                      <div key={i} className="flex flex-col items-center w-full">
                        <p className="text-sm text-[#030303] m-0 text-center leading-relaxed py-2.5">{s.trim()}.</p>
                        {i < arr.length - 1 && <span className="text-[#D75E15] text-[10px]">•</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="max-w-[600px] flex flex-col gap-4 items-center">
              <span className="text-[40px] leading-none" style={SERIF}>"</span>
              <p className="text-lg leading-[1.65] m-0 font-normal">{project.solution}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-11 h-11 rounded-full bg-[#D75E15] flex items-center justify-center text-white text-lg font-bold" style={SERIF}>
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
