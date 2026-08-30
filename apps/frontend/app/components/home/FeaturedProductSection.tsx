'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PRODUCT_IMAGE_BG } from '../../lib/productDisplay';

interface FeaturedProduct {
  title: string;
  brand: string;
  price: string;
  image: string;
  rating: number;
  colors?: string[];
}

interface FeaturedProductSectionProps {
  subtitle?: string;
  title?: string;
  heroImage: string;
  products: FeaturedProduct[];
}

export function FeaturedProductSection({
  subtitle = 'Techpilots',
  title = 'Utvalda produkter',
  heroImage,
  products,
}: FeaturedProductSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const product = products[activeIndex];

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {subtitle && <p className="text-sm text-gray-500 mb-1">{subtitle}</p>}
          {title && <h2 className="text-3xl font-bold text-gray-900">{title}</h2>}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4" style={{ minHeight: '320px' }}>
        {/* Vänster — stor hero-bild */}
        <div className="relative overflow-hidden flex-1" style={{ minHeight: '200px' }}>
          <img src={heroImage} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Höger — produktkort */}
        <div className="flex flex-col bg-white overflow-hidden w-full sm:w-[300px] sm:flex-shrink-0" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
          <div className="relative flex-1 flex items-center justify-center p-4" style={{ backgroundColor: PRODUCT_IMAGE_BG }}>
            <span className="absolute top-3 right-3 flex items-center gap-0.5 bg-white px-2 py-0.5 text-xs font-semibold shadow-sm rounded">
              <span className="text-yellow-400">★</span> {product.rating.toFixed(1)}
            </span>
            <img src={product.image} alt={product.title} className="w-full h-full object-contain" style={{ maxHeight: '220px' }} />
          </div>
          <div className="p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-black">{product.title}</p>
              <p className="text-sm font-bold text-black">{product.price}</p>
            </div>
            {product.colors && (
              <div className="flex gap-2 mb-4">
                {product.colors.map((color, i) => (
                  <div key={i} className="w-7 h-7 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                    <img src={color} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Dots */}
          {products.length > 1 && (
            <div className="flex items-center justify-center gap-2 pb-4">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`transition-all duration-300 rounded-full ${i === activeIndex ? 'w-6 h-2 bg-black' : 'w-2 h-2 bg-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
