import Link from 'next/link';
import { WireframeSection, PrimaryButton } from './WireframePrimitives';

export function CtaNavWireframe({
  prevSlug,
  nextSlug,
}: {
  prevSlug: string;
  nextSlug: string;
}) {
  return (
    <>
      <WireframeSection className="border-t border-neutral-200 text-center">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-[clamp(28px,3.5vw,40px)] font-bold tracking-tight text-neutral-900 m-0">
            Vill du ha samma resultat?
          </h2>
          <PrimaryButton href="/tjanster/kontakt">Boka möte</PrimaryButton>
        </div>
      </WireframeSection>

      <section className="border-t border-neutral-200">
        <div className="max-w-[1440px] mx-auto w-full px-12 box-border pt-10 pb-24 flex justify-between">
          <Link
            href={`/tjanster/projekt/${prevSlug}`}
            className="px-7 py-3 bg-neutral-900 text-neutral-50 text-sm font-semibold no-underline rounded-full"
          >
            ← Föregående
          </Link>
          <Link
            href={`/tjanster/projekt/${nextSlug}`}
            className="px-7 py-3 bg-neutral-900 text-neutral-50 text-sm font-semibold no-underline rounded-full"
          >
            Nästa →
          </Link>
        </div>
      </section>
    </>
  );
}
