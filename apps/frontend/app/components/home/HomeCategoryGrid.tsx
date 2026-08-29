'use client';

import Link from 'next/link';

const CATEGORIES = [
  { title: 'Datorer', url: '/kategori/datorer-tillbehor', icon: '/icons/categories/datorer.png' },
  { title: 'Komponenter', url: '/kategori/datorkomponenter', icon: '/icons/categories/datorkomponenter.png' },
  { title: 'Gaming', url: '/kategori/gaming', icon: '/icons/categories/gaming.png' },
  { title: 'Mobiler', url: '/kategori/mobiltelefoner', icon: '/icons/categories/mobiltelefoner.png' },
  { title: 'Nätverk', url: '/kategori/natverk', icon: '/icons/categories/natverk.png' },
  { title: 'TV & HiFi', url: '/kategori/tv-hifi', icon: '/icons/categories/tv-hifi.png' },
];

const DESKTOP_CATEGORIES = [
  ...CATEGORIES,
  { title: 'Datortillbehör', url: '/kategori/datortillbehor', icon: '/icons/datortillbehor.svg' },
];

export function HomeCategoryGrid() {
  return (
    <div className="w-full pt-6 pb-4 px-2 md:px-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Handla efter kategori</h2>
        <p className="text-sm text-gray-500 mt-1">Utforska våra mest populära produktkategorier.</p>
      </div>

      {/* Mobil: 2-kolumnsgrid */}
      <div className="sm:hidden grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.url}
            href={cat.url}
            className="flex items-center gap-3 no-underline bg-gray-100 p-3"
          >
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#0a0a0a', width: '48px', height: '48px' }}>
              <img src={cat.icon} alt={cat.title} className="category-icon" style={{ width: '45%', height: '45%', objectFit: 'contain' }} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 leading-tight">{cat.title}</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Visa kategori</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: en rad, cirklarna krymper relativt till containerns bredd */}
      <div className="hidden sm:flex justify-center w-full mx-auto" style={{ gap: 'clamp(8px, 2vw, 40px)' }}>
        {DESKTOP_CATEGORIES.map((cat) => (
          <Link key={cat.url} href={cat.url} className="group flex flex-col items-center no-underline flex-shrink-0">
            <div
              className="rounded-full flex flex-col items-center justify-center gap-1"
              style={{ background: '#0a0a0a', width: 'clamp(76px, 11vw, 128px)', height: 'clamp(76px, 11vw, 128px)' }}
            >
              <img src={cat.icon} alt={cat.title} className="object-contain category-icon" style={{ width: 'clamp(28px, 3.4vw, 40px)', height: 'clamp(28px, 3.4vw, 40px)' }} />
              <span className="font-semibold text-white text-center leading-tight w-fit relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full" style={{ fontSize: 'clamp(9px, 0.9vw, 12px)' }}>
                {cat.title}
              </span>
              <span className="text-white/60" style={{ fontSize: 'clamp(8px, 0.8vw, 10px)' }}>Visa kategori</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
