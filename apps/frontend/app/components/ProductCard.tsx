'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { ImageZoomDialog } from './ImageZoomDialog';

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
  const [showZoom, setShowZoom] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const config = VARIANT_CONFIG[variant];
  const cardImages = product.images?.slice(0, 3);

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
    <>
    <div className="h-full" style={{ isolation: 'isolate' }}>
    <div
      className="flex flex-col bg-white h-full p-3 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
      style={{ transform: isHovered ? 'translateY(-4px)' : 'translateY(0)', transition: 'transform 300ms ease, box-shadow 300ms ease' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Badges */}
      <div
        className="relative bg-gray-100 overflow-hidden mb-4 aspect-square flex items-center justify-center w-full"
        style={{ position: 'relative' }}
        onMouseMove={(e) => {
          if (!cardImages || cardImages.length === 0) return;
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

        {product.price !== undefined && (() => {
          const p = product.price;
          if (p < 2000) return <span className={`absolute bottom-3 left-3 z-20 bg-white text-black px-2 py-0.5 text-xs font-bold shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.12)] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>Insteg</span>;
          if (p < 8000) return <span className={`absolute bottom-3 left-3 z-20 bg-white text-black px-2 py-0.5 text-xs font-bold shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.12)] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>Mid-range</span>;
          return <span className={`absolute bottom-3 left-3 z-20 bg-white text-black px-2 py-0.5 text-xs font-bold shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.12)] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>High-end</span>;
        })()}

        {isHovered && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowZoom(true); }}
            className="absolute top-3 right-3 z-20 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110"
          >
            <svg className="w-4 h-4 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </button>
        )}

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
          {(cardImages?.[imageIndex] || product.image) ? (
            <img
              key={imageIndex}
              src={getProxiedImageUrl(cardImages?.[imageIndex] || product.image)}
              alt={product.title}
              className="w-full h-full object-contain p-4"
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
      {cardImages && cardImages.length > 0 && (
        <div className="flex gap-2 justify-center mb-4">
          {cardImages.map((_, idx) => (
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
        <div className="py-2 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{product.title}</h3>
          {product.brand && <p className="text-xs text-gray-400 mt-0.5 uppercase">{product.brand}</p>}
        </div>

        {/* Price + Stock */}
        <div className="py-2 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {product.price !== undefined && (
              <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString('sv-SE')} kr</span>
            )}
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString('sv-SE')} kr</span>
            )}
          </div>
          <p className={`text-xs font-semibold flex items-center gap-1 ${product.stock === 'Slut i lager' ? 'text-red-500' : 'text-green-600'}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock === 'Slut i lager' ? 'bg-red-500' : 'bg-green-600'}`}></span>
            {product.stock || 'I lager'}
          </p>
        </div>

        {/* Features */}
        {config.showFeatures && product.features && product.features.length > 0 && (
          <div className="py-2 border-b border-gray-100">
            <ul className="text-xs text-gray-600 space-y-1">
              {product.features.slice(0, 3).map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rating */}
        <div className="py-2 border-b border-gray-100">
          <Link href={`${productLink}#reviews`} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-black' : 'text-gray-300'}>★</span>
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviews || 0})</span>
          </Link>
        </div>

        {/* Colors */}
        <div className="py-2 border-b border-gray-100">
          <div className="flex gap-2 min-h-[20px]">
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
                  className={`w-4 h-4 rounded-full flex-shrink-0 transition-all ${isSelected ? 'ring-1 ring-offset-1 ring-black' : 'ring-1 ring-gray-300 hover:ring-gray-400'}`}
                  style={{ backgroundColor: bgColor }}
                  title={color}
                />
              );
            })}
          </div>
        </div>


        {/* Button Container */}
        <div className="mt-auto border-t border-gray-200"></div>
        <div className="relative overflow-hidden">
          <button
            onClick={handleClick}
            disabled={added}
            className="w-full py-2.5 font-semibold text-sm flex items-center justify-center gap-2 relative z-10 text-white transition-all duration-300"
            style={{ background: 'black', opacity: (isHovered || added) ? 1 : 0, transform: (isHovered || added) ? 'translateY(0)' : 'translateY(100%)' }}
          >
            <span className="absolute inset-0 bg-black" />
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
    </div>
    <ImageZoomDialog
      images={(cardImages && cardImages.length > 0 ? cardImages : [product.image]).map((url, idx) => ({ id: String(idx), url: getProxiedImageUrl(url), altText: product.title }))}
      initialIndex={imageIndex}
      isOpen={showZoom}
      onClose={() => setShowZoom(false)}
    />
    </>
  );
}
