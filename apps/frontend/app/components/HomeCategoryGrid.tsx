'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

const CATEGORIES = [
  { title: 'Datorer', url: '/kategori/datorer-tillbehor', icon: '/icons/categories/datorer.png' },
  { title: 'Komponenter', url: '/kategori/datorkomponenter', icon: '/icons/categories/datorkomponenter.png' },
  { title: 'Gaming', url: '/kategori/gaming', icon: '/icons/categories/gaming.png' },
  { title: 'Mobiltelefoner', url: '/kategori/mobiltelefoner', icon: '/icons/categories/mobiltelefoner.png' },
  { title: 'Nätverk', url: '/kategori/natverk', icon: '/icons/categories/natverk.png' },
  { title: 'TV & HiFi', url: '/kategori/tv-hifi', icon: '/icons/categories/tv-hifi.png' },
];

export function HomeCategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    const children = Array.from(el.querySelectorAll('a')) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIndex(closest);
  };

  return (
    <div className="w-full pt-6 pb-4">
      <div className="px-4 sm:px-6 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Handla efter kategori</h2>
        <p className="text-sm text-gray-500 mt-1">Utforska våra mest populära produktkategorier.</p>
      </div>

      {/* Mobil: horisontell scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="sm:hidden flex overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.url}
            href={cat.url}
            className="flex flex-col items-center text-center no-underline flex-shrink-0"
            style={{ width: '27vw', scrollSnapAlign: 'center' }}
          >
            <div className="rounded-full flex items-center justify-center" style={{ background: '#0a0a0a', width: '24vw', height: '24vw', maxWidth: '96px', maxHeight: '96px' }}>
              <img src={cat.icon} alt={cat.title} style={{ width: '45%', height: '45%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>
            <span className="text-xs font-bold text-gray-900 text-center mt-2 leading-tight w-full">{cat.title}</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Visa kategori</span>
          </Link>
        ))}
      </div>

      {/* Scroll-indikator mobil */}
      <div className="sm:hidden flex items-center justify-center gap-1 px-6 mt-1">
        {CATEGORIES.map((_, i) => (
          <div
            key={i}
            className="h-[3px] rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === activeIndex ? '#152f5a' : '#d1d5db',
              flex: i === activeIndex ? 2 : 1,
            }}
          />
        ))}
      </div>

      {/* Desktop: en rad */}
      <div className="hidden sm:flex justify-center gap-6 px-6">
        {CATEGORIES.map((cat) => (
          <Link key={cat.url} href={cat.url} className="group flex flex-col items-center no-underline">
            <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center gap-1" style={{ background: '#0a0a0a' }}>
              <img src={cat.icon} alt={cat.title} className="w-10 h-10 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
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
