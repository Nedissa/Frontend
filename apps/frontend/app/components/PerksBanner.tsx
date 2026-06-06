'use client';

import Link from 'next/link';

const PERKS = [
  {
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: 'Kundtjänst',
    description: 'Vårt dedikerade team hjälper dig snabbt med alla frågor och ärenden.',
    label: 'KONTAKTA OSS',
    href: '/kontakt',
  },
  {
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    title: '30 dagars öppet köp',
    description: 'Handla tryggt med vår enkla och kostnadsfria returpolicy.',
    label: 'RETURPOLICY',
    href: '/retur',
  },
  {
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: 'Fri frakt',
    description: 'Fri frakt på alla beställningar. Leverans inom 2–5 arbetsdagar.',
    label: 'FRAKTINFO',
    href: '/frakt',
  },
];

export function PerksBanner() {
  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .perks-animated-bg {
          background: linear-gradient(135deg, #1e3048, #4a7faa, #223344, #2e5880, #1e3048);
          background-size: 300% 300%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>
      <div className="w-full perks-animated-bg">
        <div className="grid grid-cols-3 divide-x divide-gray-700">
          {PERKS.map((perk, i) => (
            <div key={i} className="flex flex-col px-16 py-8">
              <div className="mb-6">{perk.icon}</div>
              <h3 className="text-lg font-bold text-white mb-3">{perk.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">{perk.description}</p>
              <Link
                href={perk.href}
                className="inline-flex items-center gap-3 bg-white text-black text-xs font-bold tracking-widest px-5 py-3 w-fit"
                style={{ borderRadius: '999px' }}
              >
                <span className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                {perk.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
