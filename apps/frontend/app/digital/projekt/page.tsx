import type { Metadata } from 'next';
import Link from 'next/link';
import { PROJECTS } from '../projekt-data';

export const metadata: Metadata = {
  title: 'Alla projekt — Techpilots',
  description: 'En samlad översikt över Techpilots digitala projekt.',
  alternates: { canonical: 'https://techpilots.se/digital/projekt' },
};

export default function AllProjectsPage() {
  return (
    <main className="bg-white text-[#030303]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-40 pb-16">
        <h1
          className="font-bold leading-[0.9] m-0"
          style={{ fontSize: 'clamp(48px,7vw,88px)', letterSpacing: '-0.04em' }}
        >
          Alla projekt
        </h1>
        <p className="mt-8 text-[16px] max-w-[420px]" style={{ color: 'rgb(104,105,99)' }}>
          En samlad översikt över projekt vi har byggt, från idé till lansering.
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {PROJECTS.map((p) => (
            <div key={p.slug} className="flex flex-col">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-[16px] font-semibold">{p.title}</span>
                <span className="text-[13px]" style={{ color: 'rgb(104,105,99)' }}>{p.category}</span>
              </div>
              <Link
                href={`/digital/projekt/${p.slug}`}
                className="group block w-full box-border no-underline p-[10px] md:p-[20px] aspect-[4/2.4] md:aspect-[4/3.4]"
                style={{
                  background: 'rgb(240,240,238)',
                  borderRadius: '8px',
                }}
              >
                <div
                  className="relative w-full h-full p-[10px] md:p-[20px] overflow-hidden"
                  style={{
                    background: '#f5f5f3',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, transparent 50%, #030303 50%)',
                      opacity: 0.08,
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${p.accentColor ?? '#e8c547'} 50%, transparent 50%)`,
                      opacity: 0.08,
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    style={{
                      WebkitMaskImage: 'linear-gradient(135deg, #000 50%, transparent 50%)',
                      maskImage: 'linear-gradient(135deg, #000 50%, transparent 50%)',
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 15% 15%, ${p.accentColor ?? '#e8c547'} 0%, transparent 55%), linear-gradient(#0a0a0a, #0a0a0a)`,
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    {p.cardImage && (
                      <img
                        src={p.cardImage}
                        alt={p.title}
                        className="max-w-[94%] mx-auto rounded-lg border-2 border-black/15 bg-white overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.18)]"
                      />
                    )}
                  </div>
                </div>
              </Link>
              <div className="flex items-center justify-between pt-4">
                <span className="text-[13px]" style={{ color: 'rgb(104,105,99)' }}>{p.status}</span>
                <span className="text-[13px]" style={{ color: 'rgb(104,105,99)' }}>{p.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
