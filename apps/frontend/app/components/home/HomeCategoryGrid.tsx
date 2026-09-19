import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { title: 'Datorer', url: '/kategori/datorer-tillbehor', icon: '/icons/categories/datorer.webp', handles: ['datorer', 'laptops', 'laptop-tillbehor', 'stationardator-tillbehor', 'vaskor', 'blackpatroner', 'kablar', 'batterier', 'monitorarm', 'tangentbord', 'bordsben'] },
  { title: 'Komponenter', url: '/kategori/datorkomponenter', icon: '/icons/categories/datorkomponenter.webp', handles: ['grafikkort', 'kylar', 'grafikkort-tillbehor', 'kylare-tillbehor'] },
  { title: 'Gaming', url: '/kategori/gaming', icon: '/icons/categories/gaming.webp', handles: ['gaming-tillbehor', 'gaming-bord', 'gaming-tangentbord', 'mikrofoner', 'moss'] },
  { title: 'Mobiler', url: '/kategori/mobiltelefoner', icon: '/icons/categories/mobiltelefoner.webp', handles: ['mobil-tillbehor'] },
  { title: 'Nätverk', url: '/kategori/natverk', icon: '/icons/categories/natverk.webp', handles: [] },
  { title: 'Ljud & Bild', url: '/kategori/tv-hifi', icon: '/icons/categories/tv-hifi.webp', handles: ['tv-tillbehor'] },
];

const DESKTOP_CATEGORIES = [
  { title: 'Bärbara', url: '/kategori/barbara', icon: '/icons/categories/datorer.webp', handles: ['laptops'] },
  { title: 'Processorer', url: '/kategori/processorer', icon: '/icons/categories/datorkomponenter.webp', handles: [] },
  { title: 'Gaming Tillbehör', url: '/kategori/gaming-tillbehor', icon: '/icons/categories/gaming.webp', handles: ['gaming-tillbehor', 'gaming-bord', 'gaming-tangentbord', 'mikrofoner', 'moss'] },
  { title: 'Smartphones', url: '/kategori/smartphones', icon: '/icons/categories/mobiltelefoner.webp', handles: [] },
  { title: 'Mobil Tillbehör', url: '/kategori/mobil-tillbehor', icon: '/icons/categories/mobiltelefoner.webp', handles: ['mobil-tillbehor'] },
  { title: 'Routrar', url: '/kategori/routrar', icon: '/icons/categories/natverk.webp', handles: [] },
  { title: 'TV', url: '/kategori/tv', icon: '/icons/categories/tv-hifi.webp', handles: [] },
  { title: 'TV Tillbehör', url: '/kategori/tv-tillbehor', icon: '/icons/categories/tv-hifi.webp', handles: ['tv-tillbehor'] },
  { title: 'Dator Tillbehör', url: '/kategori/datortillbehor', icon: '/icons/datortillbehor.svg', handles: ['laptop-tillbehor', 'stationardator-tillbehor', 'vaskor', 'blackpatroner', 'kablar', 'batterier', 'monitorarm', 'tangentbord', 'bordsben'] },
  { title: 'Ljud & HiFi', url: '/kategori/ljud-hifi', icon: '/icons/ljud-hifi.svg', handles: [] },
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
            <Image src={cat.icon} alt={cat.title} width={38} height={38} className="object-contain category-icon" style={{ width: 'clamp(26px, 3vw, 38px)', height: 'clamp(26px, 3vw, 38px)' }} />
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

export function HomeCategoryGrid({ activeHandles }: { activeHandles: string[] }) {
  const activeHandleSet = new Set(activeHandles);

  const isVisible = (handles: string[]) => handles.some((h) => activeHandleSet.has(h));
  const visibleCategories = CATEGORIES.filter((cat) => isVisible(cat.handles));
  const visibleDesktopCategories = DESKTOP_CATEGORIES.filter((cat) => isVisible(cat.handles));

  return (
    <div className="w-full pt-6 pb-4 px-2 md:px-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Underkategorier</h2>
        <p className="text-sm text-gray-500 mt-1">Hitta rätt i vårt sortiment.</p>
      </div>

      {/* Mobil: 2-kolumnsgrid */}
      <div className="sm:hidden grid grid-cols-2 gap-3">
        {visibleCategories.map((cat) => (
          <Link
            key={cat.url}
            href={cat.url}
            className="flex items-center gap-3 no-underline bg-gray-100 p-3"
          >
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#0a0a0a', width: '48px', height: '48px' }}>
              <Image src={cat.icon} alt={cat.title} width={22} height={22} className="category-icon" style={{ width: '45%', height: '45%', objectFit: 'contain' }} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 leading-tight">{cat.title}</span>
              <span className="text-[10px] text-gray-600 mt-0.5">Visa kategori</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: rutnät med vertikala avdelare mellan varje kategori */}
      <div className="hidden sm:block">
        <DesktopCategoryGrid categories={visibleDesktopCategories} />
      </div>
    </div>
  );
}
