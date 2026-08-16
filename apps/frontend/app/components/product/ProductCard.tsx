'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useEffect, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { ImageZoomDialog } from '../shared/ImageZoomDialog';
import { useFavoritesAndCompare } from '../../hooks/useFavoritesAndCompare';

function Tooltip({ label, anchorRef }: { label: string; anchorRef: React.RefObject<HTMLElement | null> }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const onEnter = () => {
      const r = el.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top - 8 });
    };
    const onLeave = () => setPos(null);
    const onHide = () => { setPos(null); };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('click', onHide);
    window.addEventListener('scroll', onHide, { passive: true });
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('click', onHide);
      window.removeEventListener('scroll', onHide);
    };
  }, [anchorRef]);

  if (!mounted) return null;
  return createPortal(
    <div style={{ position: 'fixed', left: pos?.x ?? 0, top: pos?.y ?? 0, transform: 'translate(-50%, -100%)', background: 'rgba(60,60,60,0.88)', color: '#fff', fontSize: '0.7rem', fontWeight: 500, padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 99999, letterSpacing: '0.01em', opacity: pos ? 1 : 0, transition: 'opacity 0.15s ease' }}>
      {label}
      <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', border: '5px solid transparent', borderTopColor: 'rgba(20,20,20,0.92)' }} />
    </div>,
    document.body
  );
}

const ColorSwatch = memo(function ColorSwatch({ color, bgColor, isSelected, onSelect }: { color: string; bgColor: string; isSelected: boolean; onSelect: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative">
      <button
        ref={ref}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(); }}
        className="w-11 h-11 flex items-center justify-center flex-shrink-0"
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        <span
          className="w-8 h-3 rounded-full block"
          style={{ backgroundColor: bgColor, outline: isSelected ? '2px solid #999999' : 'none', outlineOffset: '2px', boxShadow: bgColor === '#FFFFFF' ? '0 0 0 1px #000000' : 'none' }}
        />
      </button>
      <Tooltip anchorRef={ref} label={color} />
    </div>
  );
});

export interface ProductData {
  id: string;
  variantId?: string;
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
  categorySlug?: string;
  metadata?: Record<string, any>;
}

type ProductCardVariant = 'popular' | 'recommended' | 'new' | 'related' | 'also-like' | 'recently-viewed';

interface ProductCardProps {
  product: ProductData;
  variant?: ProductCardVariant;
  categorySlug?: string;
  onAddToCart?: (product: ProductData) => void;
  isAdded?: boolean;
  priority?: boolean;
  isActive?: boolean;
}

const VARIANT_CONFIG: Record<ProductCardVariant, { showFeatures: boolean }> = {
  popular: { showFeatures: true },
  recommended: { showFeatures: true },
  new: { showFeatures: true },
  related: { showFeatures: true },
  'also-like': { showFeatures: true },
  'recently-viewed': { showFeatures: true },
};

export function ProductCard({
  product,
  variant = 'popular',
  categorySlug,
  onAddToCart,
  isAdded = false,
  priority = false,
  isActive = false,
}: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const activeHover = isHovered || isActive;
  const [showZoom, setShowZoom] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const config = VARIANT_CONFIG[variant];
  const cardImages = product.images?.slice(0, 3);

  const handleAddToCart = useCallback(() => {
    const cartEvent = new CustomEvent('addToCart', {
      detail: {
        id: product.id,
        variantId: product.variantId || '',
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
  const compareRef = useRef<HTMLButtonElement>(null);
  const favRef = useRef<HTMLButtonElement>(null);
  const { isFav, inCompare, toggleFavorite } = useFavoritesAndCompare(product.id);
  const mouseMoveFrameRef = useRef<number | null>(null);

  const handleClick = () => {
    handleAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const productLink = `/produkter/${product.handle}`;

  const getProxiedImageUrl = (url: string) => url;

  return (
    <>
    <div className="h-full" style={{ isolation: 'isolate', contain: 'layout' }}>
    <div
      className="flex flex-col bg-white h-full p-2 sm:p-3 md:hover:-translate-y-1"
      style={{ boxShadow: activeHover ? '0 4px 20px rgba(0,0,0,0.12)' : undefined, transition: 'box-shadow 300ms ease, transform 300ms ease', willChange: 'transform' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image + Ikoner */}
      <div
        className="relative bg-[#f0f0f0] aspect-[3/2] sm:aspect-square w-full"
        onMouseMove={(e) => {
          if (!cardImages || cardImages.length === 0) return;
          if (mouseMoveFrameRef.current) return;
          mouseMoveFrameRef.current = requestAnimationFrame(() => {
            const rect = e.currentTarget?.getBoundingClientRect();
            if (rect) {
              const x = e.clientX - rect.left;
              const third = rect.width / 3;
              setImageIndex(x < third ? 0 : x < third * 2 ? 1 : 2);
            }
            mouseMoveFrameRef.current = null;
          });
        }}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {(() => {
            const tierRaw = product.features?.find(f => f.startsWith('tier:'))?.split(':')[1] || product.metadata?.tier;
            const tierMap: Record<string, string> = { standard: 'Standard', essential: 'Standard', avancerad: 'Avancerad', advanced: 'Avancerad', premium: 'Premium' };
            const tier = tierRaw ? tierMap[tierRaw.toLowerCase()] : null;
            return tier ? <span className="bg-black text-white text-[10px] font-bold px-3 py-1 w-fit">{tier}</span> : null;
          })()}
          {product.isNew && <div className="px-2.5 py-1 rounded text-xs font-bold w-fit" style={{ background: '#e8c547', color: '#0a0a0a' }}>Ny</div>}
          {product.discountPercent ? (
            <div className="bg-red-700 text-white px-2.5 py-1 rounded text-xs font-bold">-{product.discountPercent}%</div>
          ) : product.discount ? (
            <div className="bg-red-700 text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1"><span>♥</span><span>{product.discount}</span></div>
          ) : null}
        </div>

        {/* Ikoner — horisontellt, övre högra hörnet */}
        <div className="absolute top-2 right-2 flex flex-row gap-2" style={{ zIndex: 10 }}>
          <button
            ref={compareRef}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('toggleCompare', { detail: { ...product, categorySlug: categorySlug || product.sectionCategory } })); }}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-150"
            style={{ border: 'none', padding: 0, cursor: 'pointer', background: inCompare ? '#0f2448' : 'transparent', boxShadow: inCompare ? '0 2px 8px rgba(0,0,0,0.18)' : 'none' }}
            onMouseEnter={(e) => { if (!inCompare) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)'; } }}
            onMouseLeave={(e) => { if (!inCompare) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; } }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={inCompare ? '#fff' : '#111'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
          </button>
          <Tooltip anchorRef={compareRef} label={inCompare ? 'Ta bort jämförelse' : 'Lägg till i jämförelse'} />

          <button
            ref={favRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite();
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-150"
            style={{ border: 'none', padding: 0, cursor: 'pointer', background: isFav ? '#fff' : 'transparent', boxShadow: isFav ? '0 2px 8px rgba(0,0,0,0.18)' : 'none' }}
            onMouseEnter={(e) => { if (!isFav) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)'; } }}
            onMouseLeave={(e) => { if (!isFav) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; } }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isFav ? '#e53e3e' : 'none'} stroke={isFav ? '#e53e3e' : '#111'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <Tooltip anchorRef={favRef} label={isFav ? 'Ta bort från önskelista' : 'Lägg till i önskelista'} />
        </div>

        <Link href={productLink} scroll={false} className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {(cardImages?.[imageIndex] || product.image) ? (
            <Image
              src={getProxiedImageUrl(cardImages?.[imageIndex] || product.image)}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain pt-12 pb-6 pl-6 pr-6"
              priority={priority}
              quality={80}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Ingen bild</span>
            </div>
          )}
        </Link>
      </div>

      {/* Quick facts — below image */}
      {config.showFeatures && product.features && product.features.length > 0 && (
        <div className="relative flex items-stretch bg-[#fafaf8] border-b border-gray-200">
          {product.features.filter(f => !f.startsWith('tier:')).slice(0, 3).map((feature: string, idx: number) => {
            const parts = feature.split('|');
            const value = parts[0]?.trim() || feature;
            const label = parts[1]?.trim() || '';
            return (
              <div key={idx} className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 text-center min-w-0 ${idx < 2 ? 'border-r border-gray-300' : ''}`}>
                <span className="text-[11px] font-bold text-gray-800 truncate w-full">{value}</span>
                <span className="text-[9px] text-gray-400 leading-tight truncate w-full">{label}</span>
              </div>
            );
          })}
        </div>
      )}


      {/* Product Info */}
      <div className="flex-1 flex flex-col">

        {/* Brand + Title */}
        <div className="pt-2 pb-1 border-b border-gray-100">
          <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{product.brand || 'Varumärke'}</p>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2 sm:line-clamp-none">{product.title}</h3>
        </div>

        {/* Price */}
        <div className="py-2 border-b border-gray-100 flex items-baseline gap-2">
          {product.price !== undefined && (
            <span className="text-sm sm:text-lg font-bold text-gray-900">{product.price.toLocaleString('sv-SE')} kr</span>
          )}
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString('sv-SE')} kr</span>
          )}
        </div>

        {/* Stock */}
        <div className="py-1 border-b border-gray-100">
          <p className={`text-xs font-semibold flex items-center gap-2 ${product.stock === 'Slut i lager' ? 'text-red-500' : 'text-green-600'}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock === 'Slut i lager' ? 'bg-red-500' : 'bg-green-600'}`}></span>
            {product.stock || 'I lager'}
          </p>
        </div>


        {/* Rating */}
        <div className="py-1 border-b border-gray-100">
          <Link href={`${productLink}#reviews`} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < Math.floor(product.rating || 0) ? '#000000' : '#d1d5db' }}>★</span>
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviews || 0})</span>
          </Link>
        </div>

        {/* Colors */}
        <div className="py-1 border-b border-gray-100">
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
              return (
                <ColorSwatch key={idx} color={color} bgColor={bgColor} isSelected={selectedColor === idx} onSelect={() => setSelectedColor(idx)} />
              );
            })}
          </div>
        </div>


        {/* Button Container */}
        <div className="mt-auto border-t border-gray-200"></div>
        <div className="relative overflow-hidden" style={{ height: '38px' }}>
          <button
            onClick={handleClick}
            disabled={added}
            className="absolute inset-0 w-full py-2.5 font-semibold text-sm flex items-center justify-center gap-2 z-10 text-white transition-all duration-300 mobile-btn-visible"
            style={{ background: 'black', opacity: (activeHover || added) ? 1 : 0, transform: (activeHover || added) ? 'translateY(0)' : 'translateY(100%)' }}
          >
            <span className="absolute inset-0 bg-black" />
            <span className="relative z-10 flex items-center gap-2">
              {added ? (
                <>
                  <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
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
      initialIndex={0}
      isOpen={showZoom}
      onClose={() => setShowZoom(false)}
    />
    </>
  );
}
