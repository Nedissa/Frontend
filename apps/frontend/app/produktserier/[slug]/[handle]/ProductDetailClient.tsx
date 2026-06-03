'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/app/lib/products';
import { Breadcrumb } from '@/app/components/Breadcrumb';
import { ImageZoomDialog } from '@/app/components/ImageZoomDialog';
import { ProductCard, type ProductData } from '@/app/components/ProductCard';
import { fetchProductsFromMedusa } from '@/app/lib/medusa-client';

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
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
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
  const [showAccessories, setShowAccessories] = useState(false);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [alsoLikeProducts, setAlsoLikeProducts] = useState<ProductData[]>([]);
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
    const loadAlsoLikeProducts = async () => {
      const products = await fetchProductsFromMedusa();
      const filtered = products.filter((p: any) => p.sectionCategory === 'also-like');
      setAlsoLikeProducts(filtered);
    };
    loadAlsoLikeProducts();

    const favoritesList = JSON.parse(localStorage.getItem('favoritesList') || '[]');
    setIsFavorite(favoritesList.some((item: any) => item.id === product.id));

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
      <div className="w-[1280px] mx-auto flex gap-[5px] items-stretch">

        {/* Left column — gallery + tabs */}
        <div className="flex flex-col flex-1 min-w-0" style={{ gap: '5px' }}>

          {/* Gallery */}
          <div
            className="flex gap-3 bg-white"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '16px', height: '540px', overflow: 'hidden' }}
          >
            {/* Vertical Thumbnails */}
            {productDetails.images.length > 1 && (
              <div className="flex flex-col gap-3 flex-shrink-0" style={{ width: '110px', height: '476px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {productDetails.images.map((img, idx) => (
                  <button
                    key={idx}
                    ref={el => { thumbnailRefs.current[idx] = el; }}
                    onClick={() => goToImage(idx)}
                    className="relative flex-shrink-0 flex items-center justify-center overflow-hidden focus:outline-none"
                    style={{ width: '110px', height: '110px', backgroundColor: '#f8f9fa' }}
                  >
                    <img
                      src={img.url} alt=""
                      className="w-full h-full object-contain p-3 transition-all duration-300"
                      style={{}}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="relative flex flex-col" style={{ backgroundColor: '#f8f9fa', height: '476px' }}>
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
                          className="object-contain p-8"
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

          {/* Tabs — inside left column */}
          <div className="p-8 pb-0 bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
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
              {activeTab === 'reviews' && <div className="space-y-3 pb-8"><p className="text-sm text-gray-600">Denna produkt har inga recensioner än</p><p className="text-xs text-gray-500">Var den första att recensera denna produkt</p></div>}
            </div>
          </div>

        </div>{/* end left column */}

        {/* Right column — productinfo + handla tryggt */}
        <div className="flex flex-col flex-shrink-0" style={{ width: '288px', gap: '5px' }}>
        <div ref={productInfoRef} className="flex flex-col bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)', minHeight: '540px' }}>

          <div className="p-6 pb-4">
            {discountPercent > 0 && (
              <div className="inline-block bg-red-600 text-white px-2 py-0.5 text-xs font-bold mb-2 rounded w-fit">-{discountPercent}%</div>
            )}
            <h1 className="text-xl font-bold text-black leading-tight">{product.title}</h1>
            <p className="text-xs text-gray-400 mt-1">Varukod: {productDetails.sku}</p>
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
                <button
                  key={name}
                  onClick={() => setSelectedColor(name)}
                  className={`w-4 h-4 rounded-full flex-shrink-0 transition-all ${selectedColor === name ? 'ring-1 ring-offset-1 ring-black' : 'ring-1 ring-gray-300 hover:ring-gray-400'}`}
                  style={{ backgroundColor: hex }}
                  title={name}
                  aria-label={`Välj färg ${name}`}
                />
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
            {showAccessories && (
              <div className="divide-y divide-gray-100 px-4 pb-2">
                {RECOMMENDED_ACCESSORIES.map((accessory) => {
                  const isSelected = selectedAccessories.includes(accessory.id);
                  return (
                    <div key={accessory.id} className="flex items-center gap-3 py-3">
                      <div className="w-14 h-14 flex-shrink-0 bg-gray-50 flex items-center justify-center rounded">
                        <img src={accessory.image} alt={accessory.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{accessory.name}</p>
                        <p className="text-sm text-gray-500">{Number(accessory.price).toLocaleString('sv-SE')} kr</p>
                      </div>
                      <button
                        onClick={() => {
                          if (isSelected) {
                            setSelectedAccessories(selectedAccessories.filter(id => id !== accessory.id));
                            window.dispatchEvent(new CustomEvent('removeFromCart', { detail: { id: accessory.id } }));
                          } else {
                            setSelectedAccessories([...selectedAccessories, accessory.id]);
                            window.dispatchEvent(new CustomEvent('addToCart', { detail: { id: accessory.id, title: accessory.name, price: Number(accessory.price), quantity: 1, image: accessory.image } }));
                          }
                        }}
                        className={`w-4 h-4 flex-shrink-0 flex items-center justify-center rounded transition-colors ${isSelected ? 'bg-black' : 'bg-black hover:bg-gray-800'}`}
                      >
                        {isSelected ? (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-6 pt-4 pb-6 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 h-11 px-4 gap-4">
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
                router.push('/kassan');
              }}
              className="w-full bg-green-600 text-white text-sm font-semibold h-11 flex items-center justify-center hover:bg-green-700 transition-colors"
            >
              Handla nu
            </button>
          </div>
          <div className="mx-6 h-px bg-gray-100" />
          <button
            onClick={handleFavoriteToggle}
            className="w-full flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 text-black"
          >
            <span className="text-xs">Spara i favoriter</span>
            <svg className={`w-5 h-5 flex-shrink-0 ${isFavorite ? 'text-red-500' : ''}`} fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

        </div>{/* end productinfo */}

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

      <ImageZoomDialog
        images={productDetails.images}
        initialIndex={selectedImage}
        isOpen={showZoom}
        onClose={() => setShowZoom(false)}
      />

      {alsoLikeProducts.length > 0 && (
        <div className="w-[1280px] mx-auto mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Du kanske också gillar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {alsoLikeProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="also-like" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
