import Link from 'next/link';

export function AboutBanner() {
  return (
    <>
      <style>{`
        @keyframes gradientShiftAbout {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .about-animated-bg {
          background: linear-gradient(135deg, #1e3048, #4a7faa, #223344, #2e5880, #1e3048);
          background-size: 300% 300%;
          animation: gradientShiftAbout 8s ease infinite;
        }
      `}</style>
    <div className="w-full flex items-stretch" style={{ height: '600px', backgroundColor: '#fff' }}>
      {/* Left — image */}
      <div className="relative flex-shrink-0 about-animated-bg" style={{ width: '52%' }}>
        <img
          src="/assets/svg-hand.webp"
          alt="Techpilots"
          className="w-full h-full object-cover"
        />
        {/* Rotating badge */}
        <div
          className="absolute"
          style={{ top: '32px', right: '-48px', width: '96px', height: '96px' }}
        >
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
      <div className="flex flex-col justify-center px-16" style={{ width: '48%' }}>
        <p className="text-sm font-semibold text-gray-500 mb-4 tracking-wide">Enkelt. Snabbt. Pålitligt.</p>
        <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-5">
          Teknik ska vara<br />enkelt att handla
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8" style={{ maxWidth: '380px' }}>
          Vi har gjort det enkelt att hitta rätt teknik, utan krångel, utan förvirring. Bara produkter du kan lita på, levererade direkt hem till dig.
        </p>

        <ul className="flex flex-col gap-4 mb-10">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              ),
              text: 'Skickar direkt från svenska lager',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              ),
              text: '4,8 i recensionsbetyg',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              ),
              text: 'Över 200 utvalda elektronikprodukter',
            },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm font-semibold text-gray-900">
              <span className="text-gray-700">{item.icon}</span>
              {item.text}
            </li>
          ))}
        </ul>

        <Link
          href="/om-oss"
          className="inline-flex items-center justify-center bg-black text-white font-semibold text-sm px-8 py-3 hover:bg-gray-800 transition-colors w-fit"
          style={{ borderRadius: '999px' }}
        >
          Läs mer
        </Link>
      </div>
    </div>
    </>
  );
}
