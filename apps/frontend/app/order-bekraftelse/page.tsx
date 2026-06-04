'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from '../components/MainLayout';

export default function OrderConfirmation() {
  useEffect(() => {
    // Clear checkout data from localStorage and sessionStorage after successful order
    localStorage.removeItem('checkoutData');
    sessionStorage.removeItem('checkoutData');
  }, []);

  return (
    <MainLayout bordered={false}>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="mb-8">
          <svg className="w-16 h-16 mx-auto text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tack för din beställning!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Din order har mottagits och behandlas. Du får en bekräftelse via e-post inom kort.
          </p>
        </div>

        <div className="p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vad händer nu?</h2>
          <div className="space-y-6 text-left max-w-lg mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-600 text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Bekräftelse skickas</p>
                <p className="text-gray-600 text-sm">Du får en bekräftelse-email med din ordernummer.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-600 text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Behandling börjar</p>
                <p className="text-gray-600 text-sm">Vi packerar din order och förbereder den för försändelse.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-600 text-white font-bold">
                  3
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Leverans</p>
                <p className="text-gray-600 text-sm">Du får ett spårningsnummer när paketet är på väg.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-green-600 text-white py-4 font-bold text-lg hover:bg-green-700"
          >
            Tillbaka till startsidan
          </Link>
          <Link
            href="/konto/bestallningar"
            className="block w-full bg-black text-white py-4 font-bold text-lg hover:bg-gray-800"
          >
            Mina beställningar
          </Link>
        </div>

        <p className="text-gray-600 text-sm mt-8">
          Frågor? <Link href="/kontakt" className="text-green-600 hover:text-green-700 font-semibold">Kontakta oss</Link>
        </p>
      </div>
    </MainLayout>
  );
}
