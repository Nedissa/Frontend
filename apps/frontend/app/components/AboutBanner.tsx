import Link from 'next/link';

export function AboutBanner() {
  return (
    <div className="w-full flex flex-col sm:flex-row bg-white sm:h-[400px] overflow-hidden">
      {/* Left — image */}
      <div className="relative flex-shrink-0 w-full sm:w-[52%] h-[220px] sm:h-full" style={{
        background: 'linear-gradient(135deg, #0a0f1a, #1a3a6e, #0d1b2e, #1e4d8c, #0a0f1a)',
        backgroundSize: '300% 300%',
        animation: 'gradientShiftAbout 8s ease infinite',

      }}>
        <style>{`
          @keyframes gradientShiftAbout {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
        <img
          src="/assets/svg-hand.webp"
          alt="Techpilots"
          className="absolute bottom-[-25%] left-0 h-[160%] w-auto"
        />
        {/* Rotating badge */}
        <div className="absolute" style={{ top: '16px', right: '16px', width: '80px', height: '80px' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '12s' }}>
            <defs>
              <path id="circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <circle cx="50" cy="50" r="46" fill="#f0c040" />
            <text fontSize="9.5" fontWeight="600" fill="#111" letterSpacing="2">
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
      <div className="flex flex-col justify-center px-6 sm:px-16 w-full sm:w-[48%] py-6 sm:py-0 sm:h-full overflow-hidden">
        <p className="text-sm font-semibold text-gray-500 mb-2 tracking-wide">Enkelt. Snabbt. Pålitligt.</p>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
          Teknik ska vara<br />enkelt att handla
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-3" style={{ maxWidth: '380px' }}>
          Vi har gjort det enkelt att hitta rätt teknik, utan krångel, utan förvirring. Bara produkter du kan lita på, levererade direkt hem till dig.
        </p>
        <ul className="flex flex-col gap-2 mb-3">
          {[
            { text: 'Skickar direkt från svenska lager' },
            { text: '4,8 i recensionsbetyg' },
            { text: 'Över 200 utvalda elektronikprodukter' },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              {item.text}
            </li>
          ))}
        </ul>
        <Link
          href="/kundservice"
          className="inline-flex items-center justify-center bg-black text-white font-semibold text-sm px-8 py-2.5 hover:bg-gray-800 transition-colors w-fit rounded-full"
        >
          Läs mer
        </Link>
      </div>
    </div>
  );
}
