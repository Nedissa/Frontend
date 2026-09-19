'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface Product {
  id: string;
  variantId?: string;
  title: string;
  handle: string;
  price: string | number;
  originalPrice?: string | number;
  brand?: string;
  discount?: number;
  rating?: number;
  reviews?: number;
  specs?: string[];
  image?: string;
}

export function ProductItem({
  product,
  addToCartLabel = 'Lägg i varukorg',
}: {
  product: Product;
  addToCartLabel?: string;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const discountPercent = product.discount || 0;
  const brand = product.brand || product.title?.split(' ')[0] || '';
  const specs = product.specs || [
    'Högsta prestanda',
    'Världsklass design',
    'Garanterad kvalitet',
  ];
  const rating = product.rating || 5;
  const reviews = product.reviews || 128;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Dispatch custom event to update cart in header
      const event = new CustomEvent('addToCart', {
        detail: {
          id: product.id,
          variantId: product.variantId,
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: 1,
          image: product.image,
        },
      });
      window.dispatchEvent(event);

      setIsAdded(true);

      // Reset after 2 seconds
      setTimeout(() => setIsAdded(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="overflow-hidden flex flex-col w-72 transition-shadow duration-300"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
    >
      <div className="relative">
        {discountPercent > 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 text-sm font-bold shadow-lg z-10">
            -{discountPercent}%
          </div>
        )}
        <div className="absolute top-4 right-4 z-10">
          <StarRating rating={rating} count={reviews} />
        </div>
        <Link
          href={`/produkter/${product.handle}`}
          className="relative w-full h-64 flex items-center justify-center"
        >
          <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform duration-300 bg-gray-200 overflow-hidden">
            {product.image ? (
              <Image src={product.image} alt={product.title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 300px" />
            ) : (
              <span className="text-gray-400">Bild</span>
            )}
          </div>
        </Link>
      </div>

      <div className="flex flex-col flex-1 bg-white px-4 py-3">
        {brand && (
          <p className="text-xs text-gray-500 font-medium mb-0.5">{brand}</p>
        )}

        <Link href={`/produkter/${product.handle}`} className="mb-0.5 hover:text-gray-700">
          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
            {product.title}
          </h4>
        </Link>

        {specs.length > 0 && (
          <ul className="text-xs space-y-0.5 mb-2 flex-1">
            {specs.slice(0, 3).map((spec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5 text-gray-700">•</span>
                <span className="text-gray-700 flex-1">{spec}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mb-3">
          {product.originalPrice && (
            <div className="text-xs text-gray-400 line-through">
              {Number(product.originalPrice).toLocaleString('sv-SE')} SEK
            </div>
          )}
          <div className="text-lg font-bold text-gray-900">
            {Number(product.price).toLocaleString('sv-SE')} SEK
          </div>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="w-full bg-black text-white text-sm font-semibold py-3 transition-colors flex items-center justify-center gap-2 hover:bg-gray-900 disabled:bg-gray-400"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
        <span>{isAdded ? 'Tillagd' : addToCartLabel}</span>
      </button>
    </div>
  );
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(star => {
          const full = rating >= star;
          const half = !full && rating >= star - 0.5;
          const id = `pi-half-${star}`;
          return (
            <svg key={star} className="w-3 h-3" viewBox="0 0 24 24" strokeWidth="1">
              {half && (
                <defs>
                  <linearGradient id={id}>
                    <stop offset="50%" stopColor="#111827" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={full ? '#111827' : half ? `url(#${id})` : 'none'}
                stroke={full || half ? '#111827' : '#d1d5db'}
              />
            </svg>
          );
        })}
      </div>
      <span className="text-xs text-gray-600">({count})</span>
    </div>
  );
}
