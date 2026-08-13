'use client';
import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';

export const ITALIC = { fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontStyle: 'italic' } as const;

export function StyledSection({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <section className={`relative py-16 md:py-24 lg:py-32 ${className}`} style={style}>
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-12 box-border">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-3.5 py-1 bg-[#e8c547] border border-[#e8c547] rounded-full text-xs font-bold text-[#030303] uppercase tracking-widest w-fit">
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

export function hexToRgb(hex: string) {
  const parsed = hex.replace('#', '');
  const r = parseInt(parsed.substring(0, 2), 16);
  const g = parseInt(parsed.substring(2, 4), 16);
  const b = parseInt(parsed.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

export function GlowBackground({ strong = false, color = '#E8C547' }: { strong?: boolean; color?: string } = {}) {
  const spread = strong ? '-inset-56' : '-inset-32';
  const rgb = hexToRgb(color);
  const gradient = strong
    ? `radial-gradient(circle at 50% 50%, rgba(${rgb},1) 0%, rgba(${rgb},0.92) 10%, rgba(${rgb},0.7) 20%, rgba(${rgb},0.48) 30%, rgba(${rgb},0.3) 40%, rgba(${rgb},0.16) 50%, rgba(${rgb},0.06) 62%, rgba(255,255,255,0) 78%)`
    : `radial-gradient(circle at 50% 50%, rgba(${rgb},0.9) 0%, rgba(${rgb},0.75) 10%, rgba(${rgb},0.5) 20%, rgba(${rgb},0.3) 30%, rgba(${rgb},0.16) 40%, rgba(${rgb},0.07) 50%, rgba(${rgb},0.02) 62%, rgba(255,255,255,0) 78%)`;

  return (
    <>
      <motion.div
        className={`absolute ${spread} pointer-events-none`}
        style={{ background: gradient }}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <div
        className={`absolute ${spread} pointer-events-none opacity-[0.3] mix-blend-overlay`}
        style={{
          maskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 35%, transparent 62%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, black 35%, transparent 62%)',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
