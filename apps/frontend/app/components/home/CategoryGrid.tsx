import Link from 'next/link';
import Image from 'next/image';

const SUBCATEGORIES: Record<string, { title: string; url: string; icon: string }[]> = {
  'datorer-tillbehor': [
    { title: 'Bärbara', url: '/kategori/barbara', icon: '/assets/mega-barbara.webp' },
    { title: 'Stationära', url: '/kategori/stationara', icon: '/assets/mega-stationara.webp' },
    { title: 'Tillbehör', url: '/kategori/datortillbehor', icon: '/assets/mega-datortillbehor.webp' },
  ],
  'datorkomponenter': [
    { title: 'Processorer', url: '/kategori/processorer', icon: '/assets/mega-processorer.webp' },
    { title: 'Moderkort', url: '/kategori/moderkort', icon: '/assets/mega-moderkort.webp' },
    { title: 'Grafikkort', url: '/kategori/grafikkort', icon: '/assets/mega-grafikkort.webp' },
    { title: 'RAM-minne', url: '/kategori/ram', icon: '/assets/mega-ram.webp' },
    { title: 'Lagring', url: '/kategori/lagring', icon: '/assets/mega-lagring.webp' },
    { title: 'Nätaggregat', url: '/kategori/natagregat', icon: '/assets/mega-natlaggregat.webp' },
  ],
  'gaming': [
    { title: 'Gaming Laptops', url: '/kategori/gaming-laptops', icon: '/assets/mega-gaming-laptop.webp' },
    { title: 'Gaming PC', url: '/kategori/gaming-pc', icon: '/assets/mega-gaming-pc.webp' },
    { title: 'Gamingtillbehör', url: '/kategori/gaming-tillbehor', icon: '/assets/mega-gaming-tillbehor.webp' },
  ],
  'mobiltelefoner': [
    { title: 'Smartphones', url: '/kategori/smartphones', icon: '/assets/mega-smartphones.webp' },
    { title: 'Mobiltillbehör', url: '/kategori/mobil-tillbehor', icon: '/assets/mega-mobil-tillbehor.webp' },
  ],
  'natverk': [
    { title: 'Accesspunkter', url: '/kategori/accesspunkter', icon: '/assets/mega-accesspunkter.webp' },
    { title: 'Nätverksförlängare', url: '/kategori/natverksforlangare', icon: '/assets/mega-natverksforlangare.webp' },
    { title: 'Routrar', url: '/kategori/routrar', icon: '/assets/mega-routrar.webp' },
    { title: 'Mesh-nätverk', url: '/kategori/mesh-natverk', icon: '/assets/mega-mesh.webp' },
  ],
  'tv-hifi': [
    { title: 'TV', url: '/kategori/tv', icon: '/assets/mega-tv.webp' },
    { title: 'Ljud & HiFi', url: '/kategori/ljud-hifi', icon: '/assets/mega-ljud.webp' },
    { title: 'TV-tillbehör', url: '/kategori/tv-tillbehor', icon: '/assets/mega-tv-tillbehor.webp' },
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
            <div className="relative w-[72px] h-[72px] sm:w-[100px] sm:h-[100px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image
                src={cat.icon}
                alt={cat.title}
                fill
                sizes="100px"
                className="object-cover"
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
