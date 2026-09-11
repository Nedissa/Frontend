'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/app/components/layout/MainLayout';
import { ProductCard } from '@/app/components/product/ProductCard';
import { fetchProductsFromMedusa } from '@/app/lib/medusa-client';

const OFFERS: Record<string, { title: string; description: string; filter: (p: any) => boolean }> = {
  'veckans-deals': {
    title: 'Veckans deals',
    description: 'Upp till 40% rabatt på utvalda produkter den här veckan.',
    filter: (p) => p.discountPercent >= 10,
  },
  'rea': {
    title: 'Rea',
    description: 'Stora rabatter på ett brett sortiment. Passa på innan det tar slut.',
    filter: (p) => p.discountPercent > 0,
  },
  'paketpris': {
    title: 'Paketpris',
    description: 'Köp mer och spara mer med våra paketpriser.',
    filter: (p) => p.discountPercent >= 5,
  },
  'lagertomning': {
    title: 'Lagertömning',
    description: 'Sista exemplaren till kraftigt reducerade priser.',
    filter: (p) => p.discountPercent >= 20,
  },
};

export default function OffersPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const offer = OFFERS[slug];

  useEffect(() => {
    if (!offer) return;
    fetchProductsFromMedusa()
      .then(all => {
        setProducts(all.filter(offer.filter));
      })
      .finally(() => setLoading(false));
  }, [slug, offer]);

  if (!offer) {
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
      <div className="w-full px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
        <p className="text-gray-500 mb-8">{offer.description}</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p>Inga erbjudanden just nu. Kolla in igen snart!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
