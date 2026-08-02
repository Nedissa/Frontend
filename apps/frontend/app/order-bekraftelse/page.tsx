'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '../components/MainLayout';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (paymentIntent && redirectStatus === 'succeeded') {
      const pending = sessionStorage.getItem('pendingOrder');
      if (pending) {
        const { cartId, formData, total } = JSON.parse(pending);
        if (formData?.firstName) setFirstName(formData.firstName);
        setLoading(true);
        fetch('/api/medusa-checkout/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId, formData, total }),
        })
          .then(r => r.json())
          .then(() => {
            sessionStorage.removeItem('pendingOrder');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('checkoutData');
            window.dispatchEvent(new CustomEvent('cartCleared'));
          })
          .catch(() => setError('Ordern kunde inte bekräftas, kontakta support.'))
          .finally(() => setLoading(false));
      }
    } else {
      localStorage.removeItem('checkoutData');
      sessionStorage.removeItem('checkoutData');
    }
  }, [searchParams]);

  if (loading) {
    return (
      <MainLayout bordered={false}>
        <div className="max-w-lg mx-auto py-16 px-4 text-center">
          <p className="text-gray-500">Bekräftar din order...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout bordered={false}>
      <div className="max-w-lg mx-auto py-16 px-4 text-center">
        <svg className="w-14 h-14 mx-auto text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Din order är på väg{firstName ? `, ${firstName}` : ''}!
        </h1>
        <p className="text-gray-500 mb-10">
          En orderbekräftelse har skickats till din e-post.
        </p>

        {error && <p className="text-red-500 text-sm mb-6">{error}</p>}

        <div className="text-left border border-gray-100 rounded-lg p-6 mb-8 space-y-6">
          {[
            { n: 1, title: 'Bekräftelse skickad', desc: 'Du får strax ett mail med din orderinformation.' },
            { n: 2, title: 'Vi packar din order', desc: 'Vi skickar generellt paketet inom 24 timmar.' },
            { n: 3, title: 'Leverans', desc: 'Du får ett spårningsnummer när paketet är på väg.' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {n}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-gray-400 text-sm mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="block w-full bg-black text-white py-3.5 font-semibold text-sm rounded transition-opacity hover:opacity-80"
        >
          Fortsätt handla
        </Link>

        <p className="text-gray-400 text-xs mt-6">
          Frågor? <Link href="/kundservice" className="text-black underline">Kontakta oss</Link>
        </p>
      </div>
    </MainLayout>
  );
}

import { Suspense } from 'react';

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<div className="p-12">Laddar...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
