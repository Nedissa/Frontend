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

export function HomeCategoryGrid() {
  return (
    <div className="w-full pt-6 pb-4">
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

      {/* Desktop: en rad */}
      <div className="hidden sm:flex justify-center gap-10">
        {CATEGORIES.map((cat) => (
          <Link key={cat.url} href={cat.url} className="group flex flex-col items-center no-underline">
            <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center gap-1" style={{ background: '#0a0a0a' }}>
              <img src={cat.icon} alt={cat.title} className="w-10 h-10 object-contain category-icon" />
              <span className="text-xs font-semibold text-white text-center leading-tight w-fit relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                {cat.title}
              </span>
              <span className="text-[10px] text-white/60">Visa kategori</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
