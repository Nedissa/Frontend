import type { ReactNode } from 'react';

export function WireframeSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`py-16 md:py-24 lg:py-32 ${className}`}>
      <div className="max-w-[1440px] mx-auto w-full px-12 box-border">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-3.5 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-xs font-medium text-neutral-600 uppercase tracking-widest w-fit">
      {children}
    </span>
  );
}

export function ImagePlaceholder({
  label,
  aspect = 'aspect-video',
  className = '',
}: {
  label: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`${aspect} border border-neutral-300 bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300 rounded-lg flex items-center justify-center text-neutral-500 font-mono text-sm text-center px-4 ${className}`}
    >
      [{label}]
    </div>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-neutral-50 text-sm font-semibold rounded-full no-underline hover:bg-neutral-700 transition-colors"
    >
      {children}
    </a>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-neutral-900 text-sm font-semibold rounded-full border border-neutral-300 no-underline hover:bg-neutral-100 transition-colors"
    >
      {children}
    </a>
  );
}
