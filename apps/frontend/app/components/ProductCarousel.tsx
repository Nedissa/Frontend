'use client';

import { useRef, useState, useEffect } from 'react';
import { ProductCard, type ProductData } from './ProductCard';

interface ProductCarouselProps {
  title: string;
  products: ProductData[];
  variant?: 'popular' | 'recommended' | 'new' | 'related' | 'also-like';
}

export function ProductCarousel({ title, products, variant = 'popular' }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const mobileItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    mobileItemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(idx); },
        { threshold: 0.6 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [products]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    if (dir === 'right' && desktopIndex >= products.length) return;
    if (dir === 'left' && desktopIndex <= 0) return;
    const newIndex = dir === 'right' ? desktopIndex + 1 : desktopIndex - 1;
    setDesktopIndex(newIndex);
    const cardEl = el.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl ? cardEl.offsetWidth + 16 : 0;
    el.scrollTo({ left: newIndex * cardWidth, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <div className="pt-8">
      <div className="flex items-center mb-4 px-2 md:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {/* Desktop */}
      <div className="hidden md:block px-6" style={{ position: 'relative' }}>
        {/* overflow:hidden klipper bort halvsynliga kort utan att stoppa scroll-funktionen */}
        <div style={{ overflow: 'hidden', paddingTop: '16px', paddingBottom: '16px', marginTop: '-16px', marginBottom: '-16px' }}>
          <div
            ref={scrollRef}
            className="flex gap-4"
            style={{ overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...products, ...products].map((product, idx) => (
              <div key={`${product.id}-${idx}`} style={{ flexShrink: 0, width: 'calc((100% - 48px) / 4)' }}>
                <ProductCard product={product} variant={variant} priority={idx < 4} />
              </div>
            ))}
          </div>
        </div>

        {desktopIndex > 0 && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex"
            style={{ position: 'absolute', left: '-16px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', zIndex: 2 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {desktopIndex < products.length && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex"
            style={{ position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', zIndex: 2 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobil */}
      <div className="md:hidden overflow-x-auto" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
        <div className="flex gap-3" style={{ paddingRight: '12px' }}>
          {products.map((product, idx) => (
            <div
              key={product.id}
              ref={el => { mobileItemRefs.current[idx] = el; }}
              style={{ flexShrink: 0, width: 'calc(75vw)', scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} variant={variant} priority={idx < 4} isActive={activeIndex === idx} />
            </div>
          ))}
        </div>
      </div>

      {/* Step slider */}
      <div className="flex items-center justify-center gap-1.5 mt-4 mb-6">
        <div className="md:hidden flex gap-1.5">
          {products.map((_, idx) => (
            <div key={idx} style={{ height: '3px', width: activeIndex === idx ? '24px' : '12px', borderRadius: '999px', background: activeIndex === idx ? '#111' : '#d1d5db', transition: 'width 0.25s ease, background 0.25s ease' }} />
          ))}
        </div>
        <div className="hidden md:flex gap-1.5">
          {Array.from({ length: products.length + 1 }).map((_, idx) => (
            <div key={idx} style={{ height: '3px', width: desktopIndex === idx ? '24px' : '12px', borderRadius: '999px', background: desktopIndex === idx ? '#111' : '#d1d5db', transition: 'width 0.25s ease, background 0.25s ease' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
