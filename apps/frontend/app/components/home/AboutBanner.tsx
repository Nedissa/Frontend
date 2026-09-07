import Link from 'next/link';
import Image from 'next/image';

export function AboutBanner() {
  return (
    <div className="w-full flex flex-col sm:flex-row bg-white sm:h-[400px] overflow-hidden border border-black/10">
      {/* Left — image */}
      <div className="relative flex-shrink-0 w-full sm:w-[52%] h-[220px] sm:h-full" style={{
        background: 'linear-gradient(135deg, #0a0a0a, #030303, #0a0a0a, #0a0a0a, #030303)',
      }}>
        <Image
          src="/assets/svg-hand.webp"
          alt="Techpilots"
          width={265}
          height={352}
          sizes="(max-width: 640px) 60vw, 30vw"
          className="absolute bottom-[-25%] left-0 h-[160%] w-auto"
          loading="lazy"
        />
        {/* Rotating badge */}
        <div className="absolute" style={{ top: '16px', right: '16px', width: '80px', height: '80px' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '20s', willChange: 'transform' }}>
            <defs>
              <path id="circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <circle cx="50" cy="50" r="46" fill="#f0c040" />
            <text fontSize="9.5" fontWeight="600" fill="#111" letterSpacing="3.5">
              <textPath href="#circle">TECHPILOTS ● DÄR ● TEKNIK ● MÖTER ● ENKELHET ●</textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="#111" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right — content */}
      <div className="flex flex-col justify-center px-2 sm:px-16 w-full sm:w-[48%] py-6 sm:py-0 sm:h-full overflow-hidden bg-white sm:border-l sm:border-black/10">
        <p className="text-sm sm:text-base font-semibold text-gray-500 mb-2 tracking-wide">Enkelt. Snabbt. Pålitligt.</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4 pb-4 border-b border-black/10">
          Teknik ska vara<br />enkelt att handla
        </h2>
        <ul className="flex flex-col gap-2.5 mb-4">
          {[
            { text: 'Skickar direkt från svenska lager' },
            { text: '4,8 i recensionsbetyg' },
            { text: 'Över 200 utvalda elektronikprodukter' },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm sm:text-base font-semibold text-gray-900">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#e8c547' }} />
              {item.text}
            </li>
          ))}
        </ul>
        <Link
          href="/produkter"
          className="inline-flex items-center justify-center font-semibold text-sm px-8 py-2.5 transition-colors w-fit rounded-full"
          style={{ background: '#e8c547', color: '#0a0a0a' }}
        >
          Handla nu
        </Link>
      </div>
    </div>
  );
}
