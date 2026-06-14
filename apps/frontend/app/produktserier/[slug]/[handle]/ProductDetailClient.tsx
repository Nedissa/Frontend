'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/app/lib/products';
import { Breadcrumb } from '@/app/components/Breadcrumb';
import { ImageZoomDialog } from '@/app/components/ImageZoomDialog';
import { ProductCard, type ProductData } from '@/app/components/ProductCard';
import { ProductReviews } from '@/app/components/ProductReviews';
import { fetchProductsFromMedusa } from '@/app/lib/medusa-client';

const COUNTDOWN_DURATION = 60000;
const saleEndTime = Date.now() + COUNTDOWN_DURATION;

function SaleCountdown() {
  const endTimeRef = useRef<number>(saleEndTime);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 1, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = endTimeRef.current - Date.now();
      if (diff <= 0) {
        endTimeRef.current = Date.now() + COUNTDOWN_DURATION;
      }
      const d = Math.max(0, endTimeRef.current - Date.now());
      const hours = Math.floor(d / 3600000);
      const minutes = Math.floor((d % 3600000) / 60000);
      const seconds = Math.floor((d % 60000) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  const remainingSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  const totalSeconds = COUNTDOWN_DURATION / 1000;
  const progress = Math.min(100, (remainingSeconds / totalSeconds) * 100);
  const time = `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>Kampanj</span>
      <span className="text-xs font-bold text-black tabular-nums" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{time}</span>
      <div className="h-1 rounded-full overflow-hidden" style={{ width: '60px', backgroundColor: '#555555' }}>
        <div className="h-full bg-red-500" style={{ width: `${progress}%`, transition: 'width 1s linear' }} />
      </div>
    </div>
  );
}

function ExtraInfoColumn({ product }: { product: any }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (key: string) => setOpenSection(openSection === key ? null : key);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const sections = [
    {
      key: 'oppet-kop',
      title: 'ÖPPET KÖP',
      content: '30 dagars öppet köp. Ångerrätt gäller enligt distansavtalslagen.',
    },
    {
      key: 'frakt',
      title: 'FRAKT',
      content: 'Gratis frakt på alla beställningar. Leverans inom 2–5 arbetsdagar.',
    },
    {
      key: 'retur',
      title: 'RETUR',
      content: 'Enkel retur inom 30 dagar. Produkten ska vara i originalskick och oöppnad förpackning.',
    },
  ];

  return (
    <div className="flex flex-col bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)', flex: 1 }}>
      {sections.map((s, i) => (
        <div key={s.key} className={i > 0 ? 'border-t border-gray-200' : ''}>
          <button
            onClick={() => toggle(s.key)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
          >
            <span className="text-xs font-bold tracking-widest text-gray-800">{s.title}</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSection === s.key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div style={{ display: 'grid', gridTemplateRows: openSection === s.key ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
            <div style={{ overflow: 'hidden' }}>
              <p className="px-5 pb-4 text-xs text-gray-600 leading-relaxed">{s.content}</p>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}

const COLORS = {
  'Svart': '#000000',
  'Vit': '#FFFFFF',
  'Silver': '#C0C0C0',
};

const RECOMMENDED_ACCESSORIES = [
  { id: 'acc1', name: 'Skärmskydd', price: '199.00', image: '/assets/Produkt bilder/LAPTOP/1978563_1.webp' },
  { id: 'acc2', name: 'Väska för Laptop', price: '399.00', image: '/assets/Produkt bilder/STATIONÄR/1.webp' },
  { id: 'acc3', name: 'USB-C Hub', price: '149.00', image: '/assets/Produkt bilder/LAPTOP/1978563_2.webp' },
];

interface BreadcrumbTrail {
  mainCategorySlug: string;
  mainCategoryTitle: string;
  subcategorySlug: string;
  subcategoryTitle: string;
  seriesSlug?: string;
  seriesTitle?: string;
}

interface ProductDetailClientProps {
  product: Product;
  categorySlug: string;
  categoryTitle: string;
  breadcrumbTrail: BreadcrumbTrail | null;
}

export default function ProductDetailClient({
  product,
  categorySlug,
  categoryTitle,
  breadcrumbTrail,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [prevImage, setPrevImage] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const [isSliding, setIsSliding] = useState(false);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const productInfoRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryHeight, setGalleryHeight] = useState<number>(476);
  const [productInfoHeight, setProductInfoHeight] = useState<number>(0);

  const goToImage = (idx: number) => {
    if (idx === selectedImage) return;
    setSlideDir(idx > selectedImage ? 'right' : 'left');
    setPrevImage(selectedImage);
    setSelectedImage(idx);
    setIsSliding(true);
    setTimeout(() => { setPrevImage(null); setIsSliding(false); }, 350);
    thumbnailRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  const [selectedColor, setSelectedColor] = useState('Svart');
  const [activeTab, setActiveTab] = useState('description');
  const [mobileActiveTab, setMobileActiveTab] = useState<string>('description');
  const [showAccessories, setShowAccessories] = useState(false);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [showZoom, setShowZoom] = useState(false);
  const [alsoLikeProducts, setAlsoLikeProducts] = useState<ProductData[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<ProductData[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const updateHeight = () => {
      if (productInfoRef.current) {
        setProductInfoHeight(productInfoRef.current.offsetHeight);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (productInfoRef.current) observer.observe(productInfoRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await fetchProductsFromMedusa();
      const filtered = allProducts.filter((p: any) => p.sectionCategory === 'also-like');
      setAlsoLikeProducts(filtered);

      const recentIds: string[] = JSON.parse(localStorage.getItem('recentlyViewedIds') || '[]');
      const recentExcludingCurrent = recentIds.filter(id => id !== product.id);
      const recentProducts = recentExcludingCurrent
        .map(id => allProducts.find((p: any) => p.id === id))
        .filter(Boolean)
        .slice(0, 6) as ProductData[];
      setRecentlyViewed(recentProducts);
    };
    loadProducts();

    const favoritesList = JSON.parse(localStorage.getItem('favoritesList') || '[]');
    setIsFavorite(favoritesList.some((item: any) => item.id === product.id));

    // Save current product ID to recently viewed list
    const existingIds: string[] = JSON.parse(localStorage.getItem('recentlyViewedIds') || '[]');
    const updatedIds = [product.id, ...existingIds.filter(id => id !== product.id)].slice(0, 8);
    localStorage.setItem('recentlyViewedIds', JSON.stringify(updatedIds));

    const handleCartCleared = () => { setSelectedAccessories([]); };
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartItems' && !e.newValue) setSelectedAccessories([]);
    };

    window.addEventListener('cartCleared', handleCartCleared);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('cartCleared', handleCartCleared);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [product.id]);

  const handleFavoriteToggle = () => {
    const favoritesList = JSON.parse(localStorage.getItem('favoritesList') || '[]');
    const newItem = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    };
    const updated = isFavorite
      ? favoritesList.filter((item: any) => item.id !== product.id)
      : [...favoritesList, newItem];
    localStorage.setItem('favoritesList', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.id) {
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: userData.id, wishlist: updated }),
      }).catch(() => {});
    }
  };

  const metadata = (product as any).metadata || {};

  const productDetails = {
    sku: product.id.slice(-8).toUpperCase(),
    quantityAvailable: (product as any).inventoryQuantity ?? null,
    compareAtPrice: product.originalPrice,
    description: (product as any).description || '',
    featuredImage: { url: product.image, altText: product.title },
    images: (product.images && product.images.length > 0)
      ? product.images.map((url, idx) => ({ id: String(idx + 1), url, altText: `${product.title} ${idx + 1}` }))
      : [{ id: '1', url: product.image, altText: product.title }],
    highlights: Array.isArray(metadata.highlights) ? metadata.highlights : [],
    specifications: Array.isArray(metadata.specifications) ? metadata.specifications : [],
    contents: Array.isArray(metadata.contents) ? metadata.contents : [],
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const mainImage = productDetails.images[selectedImage] || productDetails.featuredImage;

  const breadcrumbItems = breadcrumbTrail
    ? [
        { label: breadcrumbTrail.mainCategoryTitle, href: '#' },
        { label: breadcrumbTrail.subcategoryTitle, href: `/produktserier/${breadcrumbTrail.subcategorySlug}` },
        ...(breadcrumbTrail.seriesSlug ? [{ label: breadcrumbTrail.seriesTitle!, href: `/produktserier/${breadcrumbTrail.seriesSlug}` }] : []),
        { label: product.title },
      ]
    : [{ label: product.title }];

  return (
    <div className="pt-[20px]">
      <Breadcrumb items={breadcrumbItems} />

      {/* Main layout: left (gallery+tabs) + right (productinfo+handla tryggt) */}
      <div className="w-full max-w-[1280px] mx-auto flex flex-col md:flex-row gap-2" style={{ alignItems: 'stretch' }}>

        {/* Left column — gallery + tabs (tabs hidden on mobile, shown after right col) */}
        <div className="flex flex-col flex-1 min-w-0" style={{ gap: '8px' }}>

          {/* Gallery */}
          <div
            className="relative flex gap-3 bg-white h-[320px] md:h-[540px]"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '16px', overflow: 'hidden' }}
          >
            {/* Countdown badge on image */}
            <div className="absolute z-20 flex items-center" style={{ top: '24px', right: '24px' }}>
              <SaleCountdown />
            </div>
            {/* Vertical Thumbnails */}
            {productDetails.images.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 flex-shrink-0" style={{ width: '110px', height: '508px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}>
                {productDetails.images.map((img, idx) => (
                  <div key={idx} ref={el => { thumbnailRefs.current[idx] = el; }} className="flex flex-col flex-shrink-0" style={{ width: '110px' }}>
                    <button
                      onClick={() => goToImage(idx)}
                      className="relative flex items-center justify-center focus:outline-none"
                      style={{ width: '110px', height: '110px', backgroundColor: '#f5f5f5' }}
                    >
                      <img
                        src={img.url} alt=""
                        className="w-full h-full object-contain p-3 transition-all duration-300"
                      />
                    </button>
                    <div className="flex items-center justify-center pb-2" style={{ height: '20px', backgroundColor: '#f5f5f5' }}>
                      <div
                        className="rounded-full bg-black"
                        style={{
                          width: '10px',
                          height: '10px',
                          opacity: idx === selectedImage ? 1 : 0,
                          transform: idx === selectedImage ? 'scale(1)' : 'scale(0)',
                          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="relative flex flex-col" style={{ backgroundColor: '#f5f5f5', height: '508px' }}>
                <button
                  onClick={() => goToImage((selectedImage - 1 + productDetails.images.length) % productDetails.images.length)}
                  className="absolute left-3 z-10 text-gray-600 hover:text-black text-6xl font-light w-12 h-full flex items-center justify-center"
                >‹</button>
                <div className="relative flex-1 overflow-hidden" onClick={() => setShowZoom(true)}>
                  {[prevImage, selectedImage].map((imgIdx, i) => {
                    if (imgIdx === null) return null;
                    const isCurrent = imgIdx === selectedImage;
                    const enterFrom = slideDir === 'right' ? '100%' : '-100%';
                    const exitTo = slideDir === 'right' ? '-100%' : '100%';
                    return (
                      <div
                        key={imgIdx}
                        className="absolute inset-0 flex items-center justify-center cursor-zoom-in"
                        style={{
                          transform: isCurrent ? (isSliding ? `translateX(${enterFrom})` : 'translateX(0)') : `translateX(${exitTo})`,
                          transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
                          zIndex: isCurrent ? 2 : 1,
                        }}
                      >
                        <img
                          src={productDetails.images[imgIdx]?.url}
                          alt={productDetails.images[imgIdx]?.altText}
                          className="object-contain p-4"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => goToImage((selectedImage + 1) % productDetails.images.length)}
                  className="absolute right-3 z-10 text-gray-600 hover:text-black text-6xl font-light w-12 h-full flex items-center justify-center"
                >›</button>
                {productDetails.images.length > 1 && (
                  <div className="flex justify-center py-3 flex-shrink-0 relative z-10">
                    <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>
                      <span className="text-xs text-gray-400 tabular-nums flex-shrink-0">{selectedImage + 1} / {productDetails.images.length}</span>
                      {productDetails.images.map((_, idx) => (
                        <button key={idx} onClick={() => goToImage(idx)} className="relative h-1.5 rounded-full overflow-hidden bg-gray-300 flex-shrink-0" style={{ width: '20px' }}>
                          <div className="absolute inset-0 rounded-full bg-gray-800 transition-transform duration-300 origin-left" style={{ transform: idx <= selectedImage ? 'scaleX(1)' : 'scaleX(0.3)', opacity: idx <= selectedImage ? 1 : 0 }} />
                        </button>
                      ))}
                      <button onClick={() => setShowZoom(true)} className="text-gray-500 hover:text-black transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs — inside left column, hidden on mobile */}
          <div className="hidden md:block p-8 pb-0 bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <div className="pt-0 w-full pb-8">
              <div className="flex gap-8 mb-8 border-b border-gray-200 w-full">
                {[
                  { key: 'description', label: 'Beskrivning' },
                  { key: 'specifications', label: 'Specifikationer' },
                  { key: 'contents', label: 'Produktinnehåll' },
                  { key: 'reviews', label: 'Recensioner' },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setActiveTab(key)}
                    className={`pb-4 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${activeTab === key ? 'text-black border-black' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}>
                    {key === 'description' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" /></svg>}
                    {key === 'specifications' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.12-2.59-1.84 2.25h9.5L13.96 9.29z" /></svg>}
                    {key === 'contents' && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
                    {key === 'reviews' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>}
                    {label}
                  </button>
                ))}
              </div>
              {activeTab === 'description' && <div className="space-y-3 pb-8"><div className="border-b border-gray-200 pb-3"><p className="text-sm text-gray-700 whitespace-pre-wrap">{productDetails.description}</p></div></div>}
              {activeTab === 'specifications' && <div className="space-y-3 pb-8">{productDetails.specifications.length > 0 ? productDetails.specifications.map((spec: { label: string; value: string }, idx: number) => (<div key={idx} className="border-b border-gray-200 pb-3"><p className="text-sm font-semibold text-gray-900">{spec.label}</p><p className="text-sm text-gray-700">{spec.value}</p></div>)) : <p className="text-sm text-gray-500">Inga specifikationer tillagda</p>}</div>}
              {activeTab === 'contents' && <div className="space-y-3 pb-8">{productDetails.contents.length > 0 ? <div className="border-b border-gray-200 pb-3"><p className="text-sm text-gray-700">Följande tillbehör ingår i paketet:</p><ul className="text-sm text-gray-700 mt-2 space-y-1 list-disc list-inside">{productDetails.contents.map((item: string, idx: number) => <li key={idx}>{item}</li>)}</ul></div> : <p className="text-sm text-gray-500">Inget produktinnehåll tillagt</p>}</div>}
              {activeTab === 'reviews' && <ProductReviews productId={product.id} />}
            </div>
          </div>

        </div>{/* end left column */}

        {/* Right column — productinfo + handla tryggt */}
        <div className="flex flex-col md:flex-shrink-0 w-full md:w-[288px]" style={{ gap: '8px', alignSelf: 'stretch' }}>
        <div ref={productInfoRef} className="flex flex-col bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>

          <div className="p-6 pb-4">
            <div className="flex items-center gap-2 mb-2">
              {discountPercent > 0 && (
                <div className="inline-block bg-red-600 text-white px-2 py-0.5 text-xs font-bold rounded">-{discountPercent}%</div>
              )}
              {metadata.tier && (() => {
                const tierConfig: Record<string, { label: string; color: string }> = {
                  essential: { label: 'Standard', color: '#6b7280' },
                  standard: { label: 'Standard', color: '#6b7280' },
                  advanced: { label: 'Avancerad', color: '#2563eb' },
                  premium: { label: 'Premium', color: '#b45309' },
                };
                const t = tierConfig[metadata.tier.toLowerCase()];
                return t ? (
                  <div className="inline-block px-2 py-0.5 text-xs font-bold rounded" style={{ backgroundColor: t.color, color: 'white' }}>{t.label}</div>
                ) : null;
              })()}
            </div>
            {(() => {
              const brand = (product as any).brand || 'Brand';
              return <p className="text-xs text-gray-500 mb-1">Av <span className="font-bold text-gray-700">{brand}</span></p>;
            })()}
            <h1 className="text-xl font-bold text-black leading-tight">{product.title}</h1>
            <p className="text-xs text-gray-400 mt-1">Varukod: {productDetails.sku}</p>
            {(() => {
              const rating = (product as any).rating || 4.2;
              const reviews = (product as any).reviews || 12;
              if (!rating && !reviews) return null;
              return (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={i <= Math.round(rating) ? '#111827' : '#d1d5db'} stroke={i <= Math.round(rating) ? '#111827' : '#9ca3af'} strokeWidth="1">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{rating.toFixed(1)}/5</span>
                  <span className="text-xs text-gray-300">|</span>
                  <span className="text-xs text-gray-500">{reviews} {reviews === 1 ? 'recension' : 'recensioner'}</span>
                </div>
              );
            })()}
          </div>

          <div className="mx-6 h-px bg-gray-100" />
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Pris</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-600">{product.price.toLocaleString('sv-SE')} kr</span>
              {product.originalPrice && <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString('sv-SE')} kr</span>}
            </div>
          </div>
          <div className="mx-6 h-px bg-gray-100" />
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Färg</span>
            <div className="flex gap-3">
              {Object.entries(COLORS).map(([name, hex]) => (
                <div key={name} className="relative group/swatch">
                  <button
                    onClick={() => setSelectedColor(name)}
                    className="w-8 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: hex, outline: selectedColor === name ? '1px solid #999999' : 'none', outlineOffset: '2px', boxShadow: hex === '#FFFFFF' ? '0 0 0 1px #000000' : 'none' }}
                    aria-label={`Välj färg ${name}`}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0 px-2 py-0.5 bg-black text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/swatch:opacity-100 transition-opacity pointer-events-none z-50">
                    {name}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(() => {
            const qty = productDetails.quantityAvailable;
            const managesInventory = (product as any).variants?.some((v: any) => v.manage_inventory);
            const isOutOfStock = managesInventory && qty !== null && qty <= 0;
            return (
              <>
                <div className="mx-6 h-px bg-gray-100" />
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Lager</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-black'}`}>
                      {isOutOfStock ? 'Slut i lager' : qty !== null ? `${qty} st` : 'I lager'}
                    </span>
                  </div>
                </div>
              </>
            );
          })()}

          <div className="mx-6 h-px bg-gray-100" />
          <div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAccessories(!showAccessories); }}
              className="w-full flex items-center justify-between text-xs uppercase tracking-widest text-gray-400 font-medium px-6 py-4 hover:bg-gray-50"
            >
              <span>Tillbehör</span>
              <svg className={`w-4 h-4 transition-transform ${showAccessories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: showAccessories ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
              <div style={{ overflow: 'hidden' }}>
              <div className="px-4 pb-3 flex flex-col gap-2">
                {RECOMMENDED_ACCESSORIES.map((accessory) => {
                  const isSelected = selectedAccessories.includes(accessory.id);
                  return (
                    <div key={accessory.id} className="flex items-center gap-3 p-2" style={{ backgroundColor: '#f5f5f5' }}>
                      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-md">
                        <img src={accessory.image} alt={accessory.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{accessory.name}</p>
                        <p className="text-xs text-gray-500">{Number(accessory.price).toLocaleString('sv-SE')} kr</p>
                      </div>
                      <button
                        onClick={() => {
                          if (isSelected) {
                            setSelectedAccessories(selectedAccessories.filter(id => id !== accessory.id));
                          } else {
                            setSelectedAccessories([...selectedAccessories, accessory.id]);
                          }
                        }}
                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-white shadow-sm"
                      >
                        <svg
                          className="w-4 h-4 text-black"
                          fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                          style={{ transform: isSelected ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-6 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center h-11 px-4 gap-4" style={{ backgroundColor: '#f5f5f5' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black text-sm font-semibold">−</button>
                <span className="text-sm font-semibold w-4 text-center tabular-nums">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-black text-sm font-semibold">+</button>
              </div>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('addToCart', { detail: { id: product.id, title: product.title, price: product.price, originalPrice: product.originalPrice, quantity, image: product.image } }));
                  selectedAccessories.forEach((accessoryId) => {
                    const accessory = RECOMMENDED_ACCESSORIES.find(a => a.id === accessoryId);
                    if (accessory) window.dispatchEvent(new CustomEvent('addToCart', { detail: { id: accessory.id, title: accessory.name, price: Number(accessory.price), quantity: 1, image: accessory.image } }));
                  });
                  setSelectedAccessories([]);
                  setIsAdded(true);
                  setTimeout(() => setIsAdded(false), 100);
                }}
                className="flex-1 bg-black text-white text-sm font-semibold h-11 flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                {isAdded ? 'Tillagd' : 'Lägg i varukorg'}
              </button>
            </div>
            <button
              onClick={() => {
                localStorage.setItem('quickCheckout', JSON.stringify({ id: product.id, title: product.title, price: product.price, originalPrice: product.originalPrice, quantity }));
                router.push('/kassa');
              }}
              className="w-full bg-green-600 text-white text-sm font-semibold h-11 flex items-center justify-center hover:bg-green-700 transition-colors"
            >
              Handla nu
            </button>
          </div>
          <div className="mx-6 h-px bg-gray-100" />
          <button
            onClick={handleFavoriteToggle}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 transition-colors hover:bg-gray-50 text-black"
          >
            <span className="text-xs">Spara favorit</span>
            <svg className={`w-5 h-5 flex-shrink-0 ${isFavorite ? 'text-red-500' : ''}`} fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <div className="mx-6 h-px bg-gray-100" />
          <div className="px-6 py-4 flex items-center justify-center gap-4">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-700 hover:text-black">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              Facebook
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-700 hover:text-black">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Instagram
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-700 hover:text-black">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
              TikTok
            </a>
          </div>

        </div>{/* end productinfo */}

        {/* Beskrivning accordion — mobile only, direkt under köpknappen */}
        <div className="md:hidden flex flex-col bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          {[
            { key: 'description', label: 'BESKRIVNING', content: <p className="px-5 pb-4 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{productDetails.description || 'Ingen beskrivning tillagd'}</p> },
            { key: 'specifications', label: 'SPECIFIKATIONER', content: <div className="px-5 pb-4 space-y-2">{productDetails.specifications.length > 0 ? productDetails.specifications.map((spec: { label: string; value: string }, idx: number) => (<div key={idx} className="border-b border-gray-100 pb-2"><p className="text-xs font-semibold text-gray-900">{spec.label}</p><p className="text-xs text-gray-600">{spec.value}</p></div>)) : <p className="text-xs text-gray-400">Inga specifikationer</p>}</div> },
            { key: 'contents', label: 'INNEHÅLL', content: <div className="px-5 pb-4">{productDetails.contents.length > 0 ? <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">{productDetails.contents.map((item: string, idx: number) => <li key={idx}>{item}</li>)}</ul> : <p className="text-xs text-gray-400">Inget innehåll tillagt</p>}</div> },
            { key: 'reviews', label: 'RECENSIONER', content: <div className="px-5 pb-4"><ProductReviews productId={product.id} /></div> },
          ].map((s, i) => (
            <div key={s.key} className={i > 0 ? 'border-t border-gray-200' : ''}>
              <button
                onClick={() => setMobileActiveTab(mobileActiveTab === s.key ? '' : s.key)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
              >
                <span className="text-xs font-bold tracking-widest text-gray-800">{s.label}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${mobileActiveTab === s.key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: mobileActiveTab === s.key ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
                <div style={{ overflow: 'hidden' }}>{s.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Frakt, Retur, Öppet köp + Dela — desktop only */}
        <div className="hidden md:block"><ExtraInfoColumn product={product} /></div>

        {/* Handla tryggt */}
        <div className="flex flex-col bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)', flex: 1 }}>
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
            <svg className="w-4 h-4 text-black flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-black text-sm font-bold">Handla tryggt</span>
          </div>
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-gray-500 text-xs">Säker betalning med krypterad anslutning och betrodda betalmetoder.</p>
          </div>
          <div className="px-6 py-4 flex items-center gap-3 flex-nowrap">
            <div className="border border-gray-200 rounded px-2 py-1.5 flex items-center justify-center" style={{ minWidth: '48px' }}>
              <img src="/icons/visa.svg" alt="Visa" className="h-4 w-auto" />
            </div>
            <div className="border border-gray-200 rounded px-2 py-1.5 flex items-center justify-center" style={{ minWidth: '48px' }}>
              <img src="/icons/mastercard.svg" alt="Mastercard" className="h-4 w-auto" />
            </div>
            <div className="border border-gray-200 rounded px-2 py-1.5 flex items-center justify-center" style={{ minWidth: '48px' }}>
              <img src="/icons/applepay.svg" alt="Apple Pay" className="h-4 w-auto" />
            </div>
            <div className="border border-gray-200 rounded px-2 py-1.5 flex items-center justify-center" style={{ minWidth: '48px' }}>
              <img src="/icons/klarna.svg" alt="Klarna" className="h-4 w-auto" />
            </div>
          </div>
        </div>

        </div>{/* end right column wrapper */}

      </div>{/* end main layout */}

      {/* Mobile-only: ExtraInfoColumn below main layout */}
      <div className="md:hidden w-full max-w-[1280px] mx-auto flex flex-col gap-2 mt-2">
        <ExtraInfoColumn product={product} />
      </div>

      <ImageZoomDialog
        images={productDetails.images}
        initialIndex={selectedImage}
        isOpen={showZoom}
        onClose={() => setShowZoom(false)}
      />

      <div className="hidden md:block">
      {alsoLikeProducts.length > 0 && (
        <div className="w-full max-w-[1280px] mx-auto mt-12 px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Du kanske också gillar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4 -my-4 px-4 -mx-4">
            {alsoLikeProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="also-like" />
            ))}
          </div>
        </div>
      )}
      {recentlyViewed.length > 0 && (
        <div className="w-full max-w-[1280px] mx-auto mt-12 mb-8 px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Du tittade nyligen på</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-4 -my-4 px-4 -mx-4">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} variant="recently-viewed" />
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
