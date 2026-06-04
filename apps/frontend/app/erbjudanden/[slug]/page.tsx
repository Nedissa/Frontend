import { MainLayout } from '@/app/components/MainLayout';

const ERBJUDANDEN: Record<string, { title: string; description: string }> = {
  'veckans-deals': { title: 'Veckans deals', description: 'Upp till 40% rabatt på utvalda produkter den här veckan.' },
  'rea': { title: 'Rea', description: 'Stora rabatter på ett brett sortiment — passa på innan det tar slut.' },
  'paketpris': { title: 'Paketpris', description: 'Köp mer och spara mer med våra paketpriser.' },
  'lagertomning': { title: 'Lagertömning', description: 'Sista exemplaren till kraftigt reducerade priser.' },
};

export default function ErbjudandenPage({ params }: { params: { slug: string } }) {
  const erbjudande = ERBJUDANDEN[params.slug];

  if (!erbjudande) {
    return (
      <MainLayout>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Erbjudandet hittades inte</h1>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{erbjudande.title}</h1>
        <p className="text-gray-500 mb-8">{erbjudande.description}</p>
        <div className="text-gray-400 text-sm">Produkter kommer snart...</div>
      </div>
    </MainLayout>
  );
}
