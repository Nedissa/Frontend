'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ProductCard, type ProductData } from './ProductCard';

interface ProductCarouselProps {
  title: string;
  products: ProductData[];
  variant?: 'popular' | 'recommended' | 'new' | 'related' | 'also-like';
}

export function ProductCarousel({ title, products, variant = 'popular' }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [products]);

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
    const cardWidth = el.clientWidth / 4;
    el.scrollBy({ left: dir === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <div className="pt-8">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden md:block px-6">
        <div
          ref={scrollRef}
          className="flex gap-4 py-4 -my-4 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[...products, ...products].map((product, idx) => (
            <div key={`${product.id}-${idx}`} style={{ flexShrink: 0, width: 'calc(25% - 12px)' }}>
              <ProductCard product={product} variant={variant} priority={idx < 4} />
            </div>
          ))}
        </div>
      </div>
      {/* Mobil */}
      <div className="md:hidden overflow-x-auto" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
        <div className="flex gap-4 py-4 -my-4">
          {products.slice(0, 4).map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              ref={el => { mobileItemRefs.current[idx] = el; }}
              style={{ flexShrink: 0, width: 'calc(100% - 32px)', scrollSnapAlign: 'center' }}
            >
              <ProductCard product={product} variant={variant} priority={idx < 4} isActive={activeIndex === idx} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
