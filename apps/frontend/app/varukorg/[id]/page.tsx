'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/app/components/MainLayout';
import Link from 'next/link';

export default function SharedCartPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    fetch(`/api/shared-cart?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setStatus('error');
          return;
        }

        // Lägg in produkterna i localStorage — samma format som CartAside
        localStorage.setItem('cartItems', JSON.stringify(data.items));
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { count: data.items.reduce((s: number, i: any) => s + i.quantity, 0) }
        }));

        setStatus('success');

        // Navigera till startsidan — HeaderWrapper lyssnar på openCart-event
        setTimeout(() => {
          router.push('/');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('openCart'));
          }, 300);
        }, 1200);
      })
      .catch(() => {
        setError('Något gick fel, försök igen.');
        setStatus('error');
      });
  }, [id, router]);

  return (
    <MainLayout bordered={false}>
      <div className="max-w-lg mx-auto py-24 px-4 text-center">
        {status === 'loading' && (
          <>
            <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-gray-500 text-sm">Laddar delad korg...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <svg className="w-14 h-14 mx-auto text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold mb-2">Korgen är redo!</h1>
            <p className="text-gray-500 text-sm">Du omdirigeras strax...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <svg className="w-14 h-14 mx-auto text-red-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold mb-2">Länken fungerar inte</h1>
            <p className="text-gray-500 text-sm mb-8">{error}</p>
            <Link href="/produkter" className="bg-black text-white px-8 py-3 text-sm font-semibold hover:bg-gray-900 transition-colors">
              Gå till butiken
            </Link>
          </>
        )}
      </div>
    </MainLayout>
  );
}
