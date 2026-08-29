'use client';

import Link from 'next/link';

const CATEGORIES = [
  { title: 'Datorer', url: '/kategori/datorer-tillbehor', icon: '/icons/categories/datorer.webp' },
  { title: 'Komponenter', url: '/kategori/datorkomponenter', icon: '/icons/categories/datorkomponenter.webp' },
  { title: 'Gaming', url: '/kategori/gaming', icon: '/icons/categories/gaming.webp' },
  { title: 'Mobiler', url: '/kategori/mobiltelefoner', icon: '/icons/categories/mobiltelefoner.webp' },
  { title: 'Nätverk', url: '/kategori/natverk', icon: '/icons/categories/natverk.webp' },
  { title: 'TV & HiFi', url: '/kategori/tv-hifi', icon: '/icons/categories/tv-hifi.webp' },
];

const DESKTOP_CATEGORIES = [
  { title: 'Bärbara', url: '/kategori/barbara', icon: '/icons/categories/datorer.webp' },
  { title: 'Processorer', url: '/kategori/processorer', icon: '/icons/categories/datorkomponenter.webp' },
  { title: 'Gaming-tillbehör', url: '/kategori/gaming-tillbehor', icon: '/icons/categories/gaming.webp' },
  { title: 'Smartphones', url: '/kategori/smartphones', icon: '/icons/categories/mobiltelefoner.webp' },
  { title: 'Routrar', url: '/kategori/routrar', icon: '/icons/categories/natverk.webp' },
  { title: 'TV', url: '/kategori/tv', icon: '/icons/categories/tv-hifi.webp' },
  { title: 'Datortillbehör', url: '/kategori/datortillbehor', icon: '/icons/datortillbehor.svg' },
  { title: 'Ljud & HiFi', url: '/kategori/ljud-hifi', icon: '/icons/ljud-hifi.svg' },
];

function DesktopCategoryGrid({ categories }: { categories: typeof DESKTOP_CATEGORIES }) {
  return (
    <div className="grid w-full mx-auto" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
      {categories.map((cat, i) => (
        <Link
          key={cat.url}
          href={cat.url}
          className={`group flex flex-col items-center no-underline py-2 ${i > 0 ? 'border-l border-gray-200' : ''}`}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{ background: '#0a0a0a', width: 'clamp(50px, 6vw, 76px)', height: 'clamp(50px, 6vw, 76px)' }}
          >
            <img src={cat.icon} alt={cat.title} className="object-contain category-icon" style={{ width: 'clamp(26px, 3vw, 38px)', height: 'clamp(26px, 3vw, 38px)' }} />
          </div>
          <span className="font-semibold text-gray-900 text-center leading-tight w-fit relative mt-2 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-gray-900 after:transition-all after:duration-300 group-hover:after:w-full" style={{ fontSize: 'clamp(9px, 0.9vw, 12px)' }}>
            {cat.title}
          </span>
          <span className="text-gray-500" style={{ fontSize: 'clamp(8px, 0.8vw, 10px)' }}>Visa kategori</span>
        </Link>
      ))}
    </div>
  );
}

export function HomeCategoryGrid() {
  return (
    <div className="w-full pt-6 pb-4 px-2 md:px-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Underkategorier</h2>
        <p className="text-sm text-gray-500 mt-1">Hitta rätt i vårt sortiment.</p>
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

      {/* Desktop: rutnät med vertikala avdelare mellan varje kategori */}
      <div className="hidden sm:block">
        <DesktopCategoryGrid categories={DESKTOP_CATEGORIES} />
      </div>
    </div>
  );
}
