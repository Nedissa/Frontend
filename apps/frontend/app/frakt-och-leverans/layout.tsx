import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frakt & Leverans | Techpilots',
  description: 'Techpilots erbjuder fri standardleverans och expressfrakt. Läs om leveranstider, fraktsätt och vad som gäller för din beställning.',
  openGraph: {
    title: 'Frakt & Leverans | Techpilots',
    description: 'Fri standardleverans och expressfrakt. Läs om leveranstider och fraktsätt.',
    url: 'https://techpilots.se/frakt-och-leverans',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
