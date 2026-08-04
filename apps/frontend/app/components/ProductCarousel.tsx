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
      <div className="flex items-center mb-4 px-2 md:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {/* Desktop */}
      <div className="hidden md:block px-6" style={{ position: 'relative', overflowY: 'visible' }}>
        <div
          ref={scrollRef}
          className="flex gap-4 py-4 -my-4 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'visible' }}
        >
          {[...products, ...products].map((product, idx) => (
            <div key={`${product.id}-${idx}`} style={{ flexShrink: 0, width: 'calc(25% - 12px)' }}>
              <ProductCard product={product} variant={variant} priority={idx < 4} />
            </div>
          ))}
        </div>
        {canScrollLeft && (
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
        {canScrollRight && (
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
          {products.slice(0, 4).map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              ref={el => { mobileItemRefs.current[idx] = el; }}
              style={{ flexShrink: 0, width: 'calc(75vw)', scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} variant={variant} priority={idx < 4} isActive={activeIndex === idx} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
