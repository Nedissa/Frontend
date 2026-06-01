'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';

export interface ProductData {
  id: string;
  title: string;
  handle: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  isNew?: boolean;
  discount?: string;
  discountPercent?: number;
  rating?: number;
  reviews?: number;
  colors?: string[];
  features?: string[];
  stock?: string;
  sectionCategory?: string;
}

type ProductCardVariant = 'popular' | 'recommended' | 'new' | 'related' | 'also-like';

interface ProductCardProps {
  product: ProductData;
  variant?: ProductCardVariant;
  categorySlug?: string;
  onAddToCart?: (product: ProductData) => void;
  isAdded?: boolean;
  priority?: boolean;
}

const VARIANT_CONFIG: Record<ProductCardVariant, { showFeatures: boolean }> = {
  popular: { showFeatures: true },
  recommended: { showFeatures: true },
  new: { showFeatures: false },
  related: { showFeatures: false },
  'also-like': { showFeatures: false },
};

export function ProductCard({
  product,
  variant = 'popular',
  categorySlug,
  onAddToCart,
  isAdded = false,
  priority = false,
}: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const config = VARIANT_CONFIG[variant];

  const handleAddToCart = useCallback(() => {
    const cartEvent = new CustomEvent('addToCart', {
      detail: {
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity: 1,
      },
    });
    window.dispatchEvent(cartEvent);
    onAddToCart?.(product);
  }, [product, onAddToCart]);

  const [added, setAdded] = useState(false);

  const handleClick = () => {
    handleAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const productLink = `/produkter/${product.handle}`;

  const getProxiedImageUrl = (url: string) => url;

  return (
    <div
      className="flex flex-col bg-white h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Badges */}
      <div
        className="relative bg-gray-100 overflow-hidden mb-4 aspect-square flex items-center justify-center w-full"
        style={{ position: 'relative' }}
        onMouseMove={(e) => {
          if (!product.images || product.images.length === 0) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const thirdWidth = rect.width / 3;

          let newIndex = 0;
          if (x < thirdWidth) {
            newIndex = 0;
          } else if (x < thirdWidth * 2) {
            newIndex = 1;
          } else {
            newIndex = 2;
          }

          setImageIndex(newIndex);
        }}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <div className="bg-orange-600 text-white px-2.5 py-1 rounded text-xs font-bold w-fit">
              Ny
            </div>
          )}
          {product.discountPercent ? (
            <div className="bg-red-700 text-white px-2.5 py-1 rounded text-xs font-bold">
              -{product.discountPercent}%
            </div>
          ) : product.discount ? (
            <div className="bg-red-700 text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1">
              <span>♥</span>
              <span>{product.discount}</span>
            </div>
          ) : null}
        </div>

        <Link href={productLink} scroll={false} className="absolute inset-0 flex items-center justify-center">
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            .fade-in {
              animation: fadeIn 0.3s ease-out forwards;
            }
          `}</style>
          {(product.images?.[imageIndex] || product.image) ? (
            <img
              key={imageIndex}
              src={getProxiedImageUrl(product.images?.[imageIndex] || product.image)}
              alt={product.title}
              className={`w-full h-full object-contain p-4 ${imageIndex > 0 ? 'fade-in' : ''}`}
              loading={priority && imageIndex === 0 ? 'eager' : 'lazy'}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Ingen bild</span>
            </div>
          )}
        </Link>
      </div>

      {/* Image Carousel Dots */}
      {product.images && product.images.length > 0 && (
        <div className="flex gap-2 justify-center mb-4">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                imageIndex === idx ? 'bg-gray-900' : 'bg-gray-300'
              }`}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
          {product.title}
        </h3>

        {/* Brand */}
        {product.brand && <p className="text-xs text-gray-400 mb-2 uppercase">{product.brand}</p>}

        {/* Features */}
        {config.showFeatures && product.features && product.features.length > 0 && (
          <ul className="text-xs text-gray-600 mb-2 space-y-1">
            {product.features.slice(0, 3).map((feature: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Rating */}
        <Link href={`${productLink}#reviews`} className="flex items-center gap-1 mb-2 hover:opacity-70 transition-opacity">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-black' : 'text-gray-300'}>★</span>
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.reviews || 0})</span>
        </Link>

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            {product.price !== undefined && (
              <span className="text-lg font-bold text-gray-900">
                {product.price.toLocaleString('sv-SE')} kr
              </span>
            )}
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.originalPrice.toLocaleString('sv-SE')} kr
              </span>
            )}
          </div>
        </div>

        {/* Color Selector */}
        <div className="flex gap-2 mb-3 min-h-[28px]">
          {product.colors && product.colors.length > 0 && product.colors.map((color, idx) => {
            const colorMap: Record<string, string> = {
              'svart': '#000000', 'black': '#000000',
              'vit': '#FFFFFF', 'white': '#FFFFFF',
              'silver': '#C0C0C0', 'grå': '#808080', 'gray': '#808080', 'grey': '#808080',
              'röd': '#EF4444', 'red': '#EF4444',
              'blå': '#3B82F6', 'blue': '#3B82F6',
              'grön': '#22C55E', 'green': '#22C55E',
              'gul': '#EAB308', 'yellow': '#EAB308',
            };
            const bgColor = colorMap[color.toLowerCase()] || color;
            const isSelected = selectedColor === idx;
            return (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColor(idx); }}
                className={`w-5 h-5 rounded-full border-2 transition-colors ${isSelected ? 'border-gray-900 scale-110' : 'border-gray-300 hover:border-gray-600'}`}
                style={{ backgroundColor: bgColor }}
                title={color}
              />
            );
          })}
        </div>

        {/* Stock Status */}
        <p className={`text-xs font-semibold mb-3 flex items-center gap-2 ${product.stock === 'Slut i lager' ? 'text-red-500' : 'text-green-600'}`}>
          <span className={`w-2 h-2 rounded-full ${product.stock === 'Slut i lager' ? 'bg-red-500' : 'bg-green-600'}`}></span>
          {product.stock || 'I lager'}
        </p>

        {/* Button Container */}
        <div className="mt-auto border-t border-gray-200"></div>
        <div className="relative overflow-hidden">
          <button
            onClick={handleClick}
            disabled={added}
            className="w-full py-2.5 font-semibold text-sm flex items-center justify-center gap-2 relative z-10 text-white"
            style={{ background: 'transparent' }}
          >
            <span
              className="absolute inset-0 bg-black origin-bottom transition-transform duration-300 ease-out"
              style={{ transform: isHovered ? 'scaleY(1)' : 'scaleY(0)' }}
            />
            <span className="relative z-10 flex items-center gap-2">
              {added ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Tillagd
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  Lägg i varukorg
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
