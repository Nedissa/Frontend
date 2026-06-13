import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakta oss | Techpilots',
  description: 'Har du frågor om en order, produkt eller leverans? Kontakta Techpilots — vi svarar snabbt via telefon eller e-post.',
  openGraph: {
    title: 'Kontakta oss | Techpilots',
    description: 'Har du frågor om en order, produkt eller leverans? Kontakta Techpilots.',
    url: 'https://techpilots.se/kontakt',
  },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        main > div { max-width: 100% !important; }
      `}</style>
      {children}
    </>
  );
}
