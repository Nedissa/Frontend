'use client';

import Link from 'next/link';

export function CallToAction() {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10 sm:py-16 px-4">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Är du redo att uppgradera?</h2>
        <p className="text-base sm:text-xl mb-6 sm:mb-8 max-w-2xl">
          Hitta de bästa datorerna, komponenterna och tillbehöret. Snabb leverans och utmärkt kundsupport.
        </p>
        <Link href="/produkter" className="inline-block bg-white text-gray-900 px-8 py-3 rounded font-bold hover:bg-gray-100">
          Börja shoppa nu →
        </Link>
      </div>
    </div>
  );
}
