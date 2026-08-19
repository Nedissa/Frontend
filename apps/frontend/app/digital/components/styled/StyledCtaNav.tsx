import Link from 'next/link';
import { FadeIn } from '../FadeIn';
import { ITALIC, StyledSection } from './StyledPrimitives';
import { CalPopupButton } from '../CalPopupButton';

export function StyledCtaNav({ prevSlug, nextSlug }: { prevSlug: string; nextSlug: string }) {
  return (
    <>
      <StyledSection className="bg-[#030303] text-center">
        <FadeIn>
          <div className="flex flex-col items-center gap-6">
            <h2
              className="text-[clamp(28px,3.5vw,44px)] font-normal tracking-[-0.02em] text-white m-0"
              style={ITALIC}
            >
              Vill du ha samma resultat?
            </h2>
            <CalPopupButton className="group inline-flex items-center gap-2 px-6 py-3 bg-[#e8c547] text-[#030303] text-sm font-semibold rounded-full no-underline shadow-[0_8px_24px_rgba(232,197,71,0.35)] transition-all duration-300 hover:bg-[#030303] hover:text-[#e8c547] hover:shadow-[0_12px_32px_rgba(3,3,3,0.25)] hover:scale-[1.02]">
              Boka ett samtal
            </CalPopupButton>
          </div>
        </FadeIn>
      </StyledSection>

      <section className="bg-[#030303] border-t border-white/10">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 box-border pt-10 pb-24 flex justify-between">
          <Link
            href={`/digital/projekt/${prevSlug}`}
            className="px-7 py-3 bg-white text-[#030303] text-sm font-semibold no-underline rounded-full transition-transform duration-300 hover:scale-[1.03]"
          >
            ← Föregående
          </Link>
          <Link
            href={`/digital/projekt/${nextSlug}`}
            className="px-7 py-3 bg-white text-[#030303] text-sm font-semibold no-underline rounded-full transition-transform duration-300 hover:scale-[1.03]"
          >
            Nästa →
          </Link>
        </div>
      </section>
    </>
  );
}
