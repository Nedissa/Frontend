import Image from 'next/image';
import Link from 'next/link';

export function PerksBanner() {
  return (
    <div className="w-full flex perks-banner-bg" style={{ height: '400px' }}>
      <style>{`
        @keyframes gradientShiftPerks {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .perks-banner-bg {
          background: linear-gradient(135deg, #1e3048, #4a7faa, #223344, #2e5880, #1e3048);
          background-size: 300% 300%;
          animation: gradientShiftPerks 8s ease infinite;
        }
      `}</style>
      <div className="w-1/2 flex items-center justify-center" style={{ height: '400px', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src="/controllers.png"
          alt="Controllers"
          style={{ height: '100%', width: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>
      <div
        className="w-1/2 flex flex-col items-center justify-center gap-4 px-10 text-center"
        style={{ maxHeight: '400px' }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Exklusivt erbjudande</p>
        <h2 className="text-2xl font-bold text-white leading-tight">Sonos högtalare — upp till 30% rabatt</h2>
        <p className="text-sm text-gray-300">Begränsat antal. Passa på nu.</p>
        <Link
          href="/erbjudanden"
          className="mt-2 bg-white text-black font-semibold px-8 py-2.5 text-sm hover:bg-gray-100 transition-colors"
        >
          Shoppa nu
        </Link>
      </div>
    </div>
  );
}
