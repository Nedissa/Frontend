'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/app/lib/products';
import { Breadcrumb } from '@/app/components/layout/Breadcrumb';
import { ImageZoomDialog } from '@/app/components/shared/ImageZoomDialog';
import { ProductCard, type ProductData } from '@/app/components/product/ProductCard';
import { ProductReviews } from '@/app/components/product/ProductReviews';
import { ProductQuestions } from '@/app/components/product/ProductQuestions';
import { fetchProductsFromMedusa } from '@/app/lib/medusa-client';
import { klaviyoTrack } from '@/app/lib/klaviyoTrack';
import { COLOR_HEX_MAP, sortColors } from '@/app/lib/productDisplay';

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

  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (progress / 100) * circ;

  return (
    <div className="scale-75 md:scale-100 origin-top-right" style={{ position: 'relative', width: '96px', height: '96px', filter: 'drop-shadow(0 4px 12px rgba(239,68,68,0.45))' }}>
      <svg width="96" height="96" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r={r + 6} fill="#1a3a6e" />
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
        <circle cx="48" cy="48" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="3" strokeDasharray={`${dash} ${circ}`} strokeLinecap="butt" style={{ transition: 'stroke-dasharray 1s linear' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
        <span style={{ fontSize: '8px', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kampanj</span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'white', fontVariantNumeric: 'tabular-nums' }}>{time}</span>
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
      key: 'frakt',
      title: 'FRAKT',
      content: 'Fri frakt på beställningar över 499 kr. Leveranstid visas vid kassan baserat på produkt och lagerstatus.',
    },
    {
      key: 'retur',
      title: 'RETUR',
      content: 'Retur inom 14 dagar. Produkten ska vara i originalskick och oöppnad förpackning.',
    },
  ];

  return (
    <div className="flex flex-col justify-evenly bg-white divide-y divide-gray-200" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)', minHeight: '100%' }}>
      {sections.map((s, i) => (
        <div key={s.key}>
          <button
            onClick={() => toggle(s.key)}
            className="w-full flex items-center justify-between px-5 py-2 text-left hover:bg-gray-50"
          >
            <span className="text-xs font-bold tracking-widest text-gray-800">{s.title}</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSection === s.key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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
  initialAccessories?: ProductData[];
  initialReviewStats?: { avg: number; count: number };
  initialQuestionCount?: number;
}

export default function ProductDetailClient({
  product,
  categorySlug,
  categoryTitle,
  breadcrumbTrail,
  initialAccessories = [],
  initialQuestionCount = 0,
  initialReviewStats = { avg: 0, count: 0 },
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [prevImage, setPrevImage] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const [isSliding, setIsSliding] = useState(false);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryHeight, setGalleryHeight] = useState<number>(476);

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
  const [isAdded, setIsAdded] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [showZoom, setShowZoom] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const [alsoLikeProducts, setAlsoLikeProducts] = useState<ProductData[]>([]);
  const [questionCount, setQuestionCount] = useState(initialQuestionCount);
  const [recentlyViewed, setRecentlyViewed] = useState<ProductData[]>([]);
  const [accessories] = useState<ProductData[]>(initialAccessories);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewStats, setReviewStats] = useState<{ avg: number; count: number } | null>(initialReviewStats);
  const router = useRouter();

  useEffect(() => {
    klaviyoTrack('Viewed Product', {
      ProductID: product.id,
      ProductName: product.title,
      Price: product.price,
      ImageURL: product.image,
      Categories: categorySlug ? [categorySlug] : undefined,
    });
  }, [product.id]);

  // Öppna recensionsflik om URL:en har #reviews
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#reviews') {
      setActiveTab('reviews');
      const scroll = () => document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(scroll, 300);
    }
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
      <div className="w-full flex flex-col lg:flex-row" style={{ alignItems: 'stretch', gap: '5px' }}>

        {/* Left column — gallery + tabs (tabs hidden on mobile, shown after right col) */}
        <div className="flex flex-col flex-1 min-w-0" style={{ gap: '5px' }}>

          {/* Gallery */}
          <div
            className="relative flex gap-3 bg-white h-[320px] md:h-[540px]"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '16px', overflow: 'hidden' }}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(dx) < 30) return;
              if (dx < 0) goToImage((selectedImage + 1) % productDetails.images.length);
              else goToImage((selectedImage - 1 + productDetails.images.length) % productDetails.images.length);
            }}
          >
            {/* Countdown badge on image */}
            <div className="absolute z-20 flex items-center" style={{ top: '24px', right: '24px' }}>
              <SaleCountdown />
            </div>
            {/* Vertical Thumbnails */}
            {productDetails.images.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 flex-shrink-0" style={{ width: '110px', height: '508px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}>
                {productDetails.images.map((img, idx) => (
                  <div key={idx} ref={el => { thumbnailRefs.current[idx] = el; }} className="flex-shrink-0" style={{ width: '110px' }}>
                    <button
                      onClick={() => goToImage(idx)}
                      className="relative flex items-center justify-center focus:outline-none"
                      style={{ width: '110px', height: '110px', backgroundColor: 'rgba(238, 241, 244, 0.5)' }}
                    >
                      <Image
                        src={img.url} alt=""
                        fill
                        sizes="110px"
                        className="object-contain p-3 transition-all duration-300"
                      />
                      {idx === selectedImage && (
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 0, height: 0, borderLeft: '10px solid transparent', borderBottom: '10px solid #111' }} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 flex flex-col min-w-0">
              <div
                className="relative flex flex-col h-full"
                style={{ backgroundColor: 'rgba(238, 241, 244, 0.5)' }}
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  if (touchStartX.current === null) return;
                  const dx = e.changedTouches[0].clientX - touchStartX.current;
                  touchStartX.current = null;
                  if (Math.abs(dx) < 30) return;
                  if (dx < 0) goToImage((selectedImage + 1) % productDetails.images.length);
                  else goToImage((selectedImage - 1 + productDetails.images.length) % productDetails.images.length);
                }}
              >
                <button
                  onClick={() => goToImage((selectedImage - 1 + productDetails.images.length) % productDetails.images.length)}
                  className="absolute left-2 z-10 w-9 h-9 hidden md:flex items-center justify-center bg-white rounded-full top-1/2 -translate-y-1/2"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                </button>
                <div
                  className="relative flex-1 overflow-hidden"
                >
                  {[prevImage, selectedImage].map((imgIdx, i) => {
                    if (imgIdx === null) return null;
                    const isCurrent = imgIdx === selectedImage;
                    const enterFrom = slideDir === 'right' ? '100%' : '-100%';
                    const exitTo = slideDir === 'right' ? '-100%' : '100%';
                    return (
                      <div
                        key={imgIdx}
                        className="absolute inset-0 flex items-center justify-center md:cursor-zoom-in"
                  onClick={() => { if (window.innerWidth >= 768) setShowZoom(true); }}
                        style={{
                          transform: isCurrent ? (isSliding ? `translateX(${enterFrom})` : 'translateX(0)') : `translateX(${exitTo})`,
                          transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
                          zIndex: isCurrent ? 2 : 1,
                        }}
                      >
                        <Image
                          src={productDetails.images[imgIdx]?.url || ''}
                          alt={productDetails.images[imgIdx]?.altText || ''}
                          fill
                          sizes="(max-width: 768px) 100vw, 700px"
                          priority={imgIdx === 0}
                          className="object-contain p-4 md:p-20 transition-opacity duration-300"
                          style={{ opacity: 0 }}
                          onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => goToImage((selectedImage + 1) % productDetails.images.length)}
                  className="absolute right-2 z-10 w-9 h-9 hidden md:flex items-center justify-center bg-white rounded-full top-1/2 -translate-y-1/2"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                </button>
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

          {/* Tabs — inside left column, hidden on mobile/tablet */}
          <div className="hidden lg:block p-8 pb-0 bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <style>{`@keyframes tab-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div className="pt-0 w-full pb-8" id="product-tabs">
              <div className="flex gap-8 mb-8 border-b border-gray-200 w-full">
                {[
                  { key: 'description', label: 'Beskrivning' },
                  { key: 'specifications', label: 'Specifikationer' },
                  { key: 'contents', label: 'Produktinnehåll' },
                  { key: 'reviews', label: 'Recensioner' },
                  { key: 'questions', label: 'Frågor och Svar' },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setActiveTab(key)}
                    className={`pb-4 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${activeTab === key ? 'text-black border-black' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}>
                    {key === 'description' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" /></svg>}
                    {key === 'specifications' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.12-2.59-1.84 2.25h9.5L13.96 9.29z" /></svg>}
                    {key === 'contents' && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
                    {key === 'reviews' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>}
                    {key === 'questions' && (
                      <span className="relative inline-flex">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path><path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"></path></svg>
                        {questionCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {questionCount}
                          </span>
                        )}
                      </span>
                    )}
                    {label}
                  </button>
                ))}
              </div>
              <div key={activeTab} style={{ animation: 'tab-fade-in 220ms ease both' }}>
              {activeTab === 'description' && (
                <div className="pb-8">
                  {(() => {
                    const text = productDetails.description || '';
                    const firstDot = text.search(/[.!?]\s/);
                    const ingress = firstDot > 0 ? text.slice(0, firstDot + 1) : text.slice(0, 120);
                    const rest = firstDot > 0 ? text.slice(firstDot + 2) : text.slice(120);
                    return (
                      <>
                        <p className="text-sm font-semibold text-gray-900 leading-relaxed mb-3">{ingress}</p>
                        {rest && <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{rest}</p>}
                      </>
                    );
                  })()}
                </div>
              )}
              {activeTab === 'specifications' && (
                <div className="pb-8">
                  {productDetails.specifications.length > 0 ? (
                    <table className="w-full text-sm border-collapse">
                      <tbody>
                        {productDetails.specifications.map((spec: { label: string; value: string }, idx: number) => (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9fafb' : 'white' }}>
                            <td className="py-2.5 px-4 font-semibold text-gray-700 w-2/5">{spec.label}</td>
                            <td className="py-2.5 px-4 text-gray-600">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p className="text-sm text-gray-500">Inga specifikationer tillagda</p>}
                </div>
              )}
              {activeTab === 'contents' && (
                <div className="pb-8">
                  {productDetails.contents.length > 0 ? (
                    <>
                      <p className="text-sm font-semibold text-gray-900 mb-3">Detta ingår i förpackningen</p>
                      <table className="w-full text-sm border-collapse">
                        <tbody>
                          {productDetails.contents.map((item: string, idx: number) => (
                            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9fafb' : 'white' }}>
                              <td className="py-2.5 px-4 text-gray-600">{item}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : <p className="text-sm text-gray-500">Inget produktinnehåll tillagt</p>}
                </div>
              )}
              {activeTab === 'reviews' && <div id="reviews"><ProductReviews productId={product.id} /></div>}
              {activeTab === 'questions' && <div id="questions"><ProductQuestions productId={product.id} /></div>}
              </div>
            </div>
          </div>

        </div>{/* end left column */}

        {/* Right column — productinfo + handla tryggt */}
        <div className="flex flex-col lg:flex-shrink-0 w-full lg:w-[288px]" style={{ gap: '5px', alignSelf: 'stretch' }}>
        <div className="flex flex-col lg:grid lg:min-h-[540px]" style={{ gridTemplateRows: 'auto 1fr', gap: '5px' }}>
        <div className="flex flex-col bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>

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
              const brand = (product as any).brand;
              return brand ? <p className="text-xs text-gray-500 mb-1">Av <span className="font-bold text-gray-700">{brand}</span></p> : null;
            })()}
            <h1 className="text-xl font-bold text-black leading-tight">{product.title}</h1>
            <p className="text-xs text-gray-400 mt-1">Varukod: {productDetails.sku}</p>
            {reviewStats && reviewStats.count > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(star => {
                      const full = reviewStats.avg >= star;
                      const half = !full && reviewStats.avg >= star - 0.5;
                      const id = `pd-half-${star}`;
                      return (
                        <svg key={star} viewBox="0 0 24 24" className="w-3.5 h-3.5" strokeWidth="1">
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
                  <span className="text-xs text-gray-500">{reviewStats.avg.toFixed(1)}/5</span>
                  <span className="text-xs text-gray-300">|</span>
                  <span className="text-xs text-gray-500">{reviewStats.count} {reviewStats.count === 1 ? 'recension' : 'recensioner'}</span>
                </div>
            )}
          </div>

          <div className="mx-6 h-px bg-gray-100" />
          <div className="px-6 py-[10px] flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Pris</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-600">{product.price.toLocaleString('sv-SE')} kr</span>
              {product.originalPrice && <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString('sv-SE')} kr</span>}
            </div>
          </div>
          <div className="mx-6 h-px bg-gray-100" />
          <div className="px-6 py-[10px] flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Färg</span>
            <div className="flex gap-3">
              {sortColors(product.colors || []).map((name) => {
                const hex = COLOR_HEX_MAP[name.toLowerCase()] || name;
                return (
                <div key={name} className="tp-tooltip-wrap">
                  <button
                    onClick={() => setSelectedColor(name)}
                    className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                    style={{ background: 'none', border: 'none', padding: 0 }}
                    aria-label={`Välj färg ${name}`}
                  >
                    <span
                      className="w-10 h-4 rounded-full block"
                      style={{ backgroundColor: hex, outline: selectedColor === name ? '2px solid #999999' : 'none', outlineOffset: '2px', boxShadow: hex === '#FFFFFF' ? '0 0 0 1px #000000' : 'none' }}
                    />
                  </button>
                  <span className="tp-tooltip">
                    {name}
                  </span>
                </div>
                );
              })}
            </div>
          </div>

          {(() => {
            const qty = productDetails.quantityAvailable;
            const managesInventory = (product as any).variants?.some((v: any) => v.manage_inventory);
            const isOutOfStock = managesInventory && qty !== null && qty <= 0;
            return (
              <>
                <div className="mx-6 h-px bg-gray-100" />
                <div className="px-6 py-[10px] flex items-center justify-between">
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

          <div className="px-6 pt-4 pb-6 border-t border-gray-100 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center h-11 px-4 gap-4 self-stretch" style={{ backgroundColor: '#f5f5f5' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black text-sm font-semibold">−</button>
                <span className="text-sm font-semibold w-4 text-center tabular-nums">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-black text-sm font-semibold">+</button>
              </div>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('addToCart', { detail: { id: product.id, variantId: product.variantId, title: product.title, price: product.price, originalPrice: product.originalPrice, quantity, image: product.image } }));
                  setIsAdded(true);
                  setTimeout(() => setIsAdded(false), 2000);
                }}
                disabled={isAdded}
                className="flex-1 text-white text-sm font-semibold h-11 flex items-center justify-center gap-2 transition-colors"
                style={{ background: 'black' }}
              >
                {isAdded ? (
                  <>
                    <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Tillagd
                  </>
                ) : 'Lägg i varukorg'}
              </button>
            </div>
            <button
              onClick={() => {
                const params = new URLSearchParams({
                  quick: '1',
                  id: product.id,
                  title: product.title,
                  price: String(product.price),
                  qty: String(quantity),
                  ...(product.variantId ? { variantId: product.variantId } : {}),
                  ...(product.originalPrice ? { originalPrice: String(product.originalPrice) } : {}),
                  ...(product.image ? { image: product.image } : {}),
                });
                router.push(`/kassa?${params.toString()}`);
              }}
              className="w-full text-white text-sm font-semibold h-11 flex items-center justify-center transition-colors px-4"
              style={{ backgroundColor: '#16a34a' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#15803d')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#16a34a')}
            >
              Handla nu
            </button>
          </div>
          <div className="mx-6 h-px bg-gray-100" />
          <button
            onClick={handleFavoriteToggle}
            className="w-full flex items-center justify-center gap-2 px-6 py-[10px] transition-colors hover:bg-gray-50 text-black"
          >
            <span className="text-xs">{isFavorite ? 'Sparad favorit' : 'Spara favorit'}</span>
            <svg className={`w-5 h-5 flex-shrink-0 ${isFavorite ? 'text-red-500' : ''}`} fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

        </div>{/* end productinfo */}

        {/* Beskrivning accordion — mobile/tablet only, direkt under köpknappen */}
        <div className="lg:hidden flex flex-col bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          {[
            { key: 'description', label: 'BESKRIVNING', content: <p className="px-5 pb-4 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{productDetails.description || 'Ingen beskrivning tillagd'}</p> },
            { key: 'specifications', label: 'SPECIFIKATIONER', content: <div className="px-5 pb-4 space-y-2">{productDetails.specifications.length > 0 ? productDetails.specifications.map((spec: { label: string; value: string }, idx: number) => (<div key={idx} className="border-b border-gray-100 pb-2"><p className="text-xs font-semibold text-gray-900">{spec.label}</p><p className="text-xs text-gray-600">{spec.value}</p></div>)) : <p className="text-xs text-gray-400">Inga specifikationer</p>}</div> },
            { key: 'contents', label: 'INNEHÅLL', content: <div className="px-5 pb-4">{productDetails.contents.length > 0 ? <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">{productDetails.contents.map((item: string, idx: number) => <li key={idx}>{item}</li>)}</ul> : <p className="text-xs text-gray-400">Inget innehåll tillagt</p>}</div> },
            { key: 'reviews', label: 'RECENSIONER', content: <div className="px-5 pb-4"><ProductReviews productId={product.id} /></div> },
            { key: 'questions', label: 'FRÅGOR OCH SVAR', content: <div className="px-5 pb-4"><ProductQuestions productId={product.id} /></div> },
          ].map((s, i) => (
            <div key={s.key} className={i > 0 ? 'border-t border-gray-200' : ''}>
              <button
                onClick={() => setMobileActiveTab(mobileActiveTab === s.key ? '' : s.key)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-widest text-gray-800">{s.label}</span>
                  {s.key === 'questions' && questionCount > 0 && (
                    <span className="bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                      {questionCount}
                    </span>
                  )}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${mobileActiveTab === s.key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: mobileActiveTab === s.key ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
                <div style={{ overflow: 'hidden' }}>{s.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Frakt, Retur, Öppet köp — desktop only */}
        <div className="hidden lg:flex lg:flex-col lg:min-h-0"><ExtraInfoColumn product={product} /></div>
        </div>{/* end productinfo+extrainfo grid */}

        {/* Handla tryggt */}
        <div className="flex flex-col bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <div className="flex items-center gap-2 px-6 py-[10px] border-b border-gray-100">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#16a34a" d="M12 2.944a11.955 11.955 0 008.618 3.04A12.02 12.02 0 0121 9c0 5.591-3.824 10.29-9 11.622C6.824 19.29 3 14.591 3 9c0-1.042.133-2.052.382-3.016A11.955 11.955 0 0012 2.944z" />
              <path stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M9 12l2 2 4-4" />
            </svg>
            <span className="text-black text-sm font-bold">Handla tryggt</span>
          </div>
          <div className="px-6 py-[10px] border-b border-gray-100">
            <p className="text-gray-500 text-xs">Säker betalning med krypterad anslutning och betrodda betalmetoder.</p>
          </div>
          <div className="px-6 py-[10px] flex items-center gap-3 flex-nowrap">
            <div className="border border-gray-200 rounded px-2 py-1.5 flex items-center justify-center" style={{ minWidth: '48px' }}>
              <img src="/icons/klarna.svg" alt="Klarna" className="h-4 w-auto" />
            </div>
            <div className="border border-gray-200 rounded px-2 py-1.5 flex items-center justify-center" style={{ minWidth: '48px' }}>
              <img src="/icons/visa.svg" alt="Visa" className="h-4 w-auto" />
            </div>
            <div className="border border-gray-200 rounded px-2 py-1.5 flex items-center justify-center" style={{ minWidth: '48px' }}>
              <img src="/icons/mastercard.svg" alt="Mastercard" className="h-4 w-auto" />
            </div>
            <div className="border border-gray-200 rounded px-2 py-1.5 flex items-center justify-center" style={{ minWidth: '48px' }}>
              <img src="/icons/applepay.svg" alt="Apple Pay" className="h-8 w-auto" />
            </div>
          </div>
        </div>

        {/* Tillbehör */}
        {accessories.length > 0 && (
          <div className="flex flex-col bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <div className="px-5 py-[10px] border-b border-gray-200">
              <span className="text-xs font-bold tracking-widest text-gray-800">TILLBEHÖR</span>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {accessories.map((acc) => (
                <div key={acc.id} className="flex items-center gap-3 px-6 py-3">
                  <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
                    <Image src={acc.image} alt={acc.title} fill sizes="56px" className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{acc.title}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{acc.price.toLocaleString('sv-SE')} kr</p>
                  </div>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('addToCart', { detail: { id: acc.id, variantId: acc.variantId, title: acc.title, price: acc.price, quantity: 1, image: acc.image } }))}
                    className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
                    aria-label={`Lägg till ${acc.title} i varukorg`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5H17"/>
                      <circle cx="9" cy="22" r="1.6" fill="currentColor" stroke="none"/>
                      <circle cx="16" cy="22" r="1.6" fill="currentColor" stroke="none"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        </div>{/* end right column wrapper */}

      </div>{/* end main layout */}

      {/* Mobile/tablet-only: ExtraInfoColumn below main layout */}
      <div className="lg:hidden w-full flex flex-col gap-2 mt-2">
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
        <div className="w-full mt-12 px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Du kanske också gillar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4 -my-4 px-4 -mx-4">
            {alsoLikeProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="also-like" />
            ))}
          </div>
        </div>
      )}
      {recentlyViewed.length > 0 && (
        <div className="w-full mt-12 mb-8 px-4">
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
