import Link from 'next/link';

const SUBCATEGORIES: Record<string, { title: string; url: string; icon: string }[]> = {
  'datorer-tillbehor': [
    { title: 'Bärbara', url: '/kategori/barbara', icon: '/assets/mega-barbara.svg' },
    { title: 'Stationära', url: '/kategori/stationara', icon: '/assets/mega-stationara.svg' },
    { title: 'Tillbehör', url: '/kategori/datortillbehor', icon: '/assets/mega-datortillbehor.svg' },
  ],
  'datorkomponenter': [
    { title: 'Processorer', url: '/kategori/processorer', icon: '/assets/mega-processorer.svg' },
    { title: 'Moderkort', url: '/kategori/moderkort', icon: '/assets/mega-moderkort.svg' },
    { title: 'Grafikkort', url: '/kategori/grafikkort', icon: '/assets/mega-grafikkort.svg' },
    { title: 'RAM-minne', url: '/kategori/ram', icon: '/assets/mega-ram.svg' },
    { title: 'Lagring', url: '/kategori/lagring', icon: '/assets/mega-lagring.svg' },
    { title: 'Nätaggregat', url: '/kategori/natagregat', icon: '/assets/mega-natlaggregat.svg' },
  ],
  'gaming': [
    { title: 'Gaming Laptops', url: '/kategori/gaming-laptops', icon: '/assets/mega-gaming-laptop.svg' },
    { title: 'Gaming PC', url: '/kategori/gaming-pc', icon: '/assets/mega-gaming-pc.svg' },
    { title: 'Gamingtillbehör', url: '/kategori/gaming-tillbehor', icon: '/assets/mega-gaming-tillbehor.svg' },
  ],
  'mobiltelefoner': [
    { title: 'Smartphones', url: '/kategori/smartphones', icon: '/assets/mega-smartphones.svg' },
    { title: 'Mobiltillbehör', url: '/kategori/mobil-tillbehor', icon: '/assets/mega-mobil-tillbehor.svg' },
  ],
  'natverk': [
    { title: 'Accesspunkter', url: '/kategori/accesspunkter', icon: '/assets/mega-accesspunkter.svg' },
    { title: 'Nätverksförlängare', url: '/kategori/natverksforlangare', icon: '/assets/mega-natverksforlangare.svg' },
    { title: 'Routrar', url: '/kategori/routrar', icon: '/assets/mega-routrar.svg' },
    { title: 'Mesh-nätverk', url: '/kategori/mesh-natverk', icon: '/assets/mega-mesh.svg' },
  ],
  'tv-hifi': [
    { title: 'TV', url: '/kategori/tv', icon: '/assets/mega-tv.svg' },
    { title: 'Ljud & HiFi', url: '/kategori/ljud-hifi', icon: '/assets/mega-ljud.svg' },
    { title: 'TV-tillbehör', url: '/kategori/tv-tillbehor', icon: '/assets/mega-tv-tillbehor.svg' },
  ],
};

export function CategoryGrid({ slug }: { slug: string }) {
  const categories = SUBCATEGORIES[slug] || [];
  if (categories.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <div className="w-full flex flex-wrap items-start justify-center gap-4 sm:gap-10">
        {categories.map((cat) => (
          <Link key={cat.url + cat.title} href={cat.url} className="flex flex-col items-center gap-3 group min-w-[72px] sm:min-w-[100px]">
            <div className="w-[72px] h-[72px] sm:w-[100px] sm:h-[100px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={cat.icon}
                alt={cat.title}
                className="w-[72px] h-[72px] sm:w-[100px] sm:h-[100px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-black relative inline-block">
                {cat.title}
                <span className="absolute bottom-0 left-0 h-0.5 bg-black w-0 group-hover:w-full transition-all duration-300 ease-out" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
