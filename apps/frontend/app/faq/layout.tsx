import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vanliga frågor (FAQ) | Techpilots',
  description: 'Svar på vanliga frågor om leverans, betalning, returer och garantier hos Techpilots. Hitta snabbt det du undrar över.',
  openGraph: {
    title: 'Vanliga frågor | Techpilots',
    description: 'Svar på vanliga frågor om leverans, betalning, returer och garantier hos Techpilots.',
    url: 'https://techpilots.se/faq',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
