import type { ReactNode } from 'react';

export const ITALIC = { fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontStyle: 'italic' } as const;

export function StyledSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`py-16 md:py-24 lg:py-32 ${className}`}>
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 box-border">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-3.5 py-1 bg-white border border-black/5 rounded-full text-xs font-medium text-[#8a8a86] uppercase tracking-widest w-fit">
      {children}
    </span>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 px-6 py-3 bg-[#D75E15] text-white text-sm font-semibold rounded-full no-underline shadow-[0_8px_24px_rgba(215,94,21,0.25)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(215,94,21,0.35)] hover:scale-[1.02]"
    >
      {children}
    </a>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-[#030303] text-sm font-semibold rounded-full border border-black/10 no-underline transition-all duration-300 hover:bg-white hover:border-black/20"
    >
      {children}
    </a>
  );
}
