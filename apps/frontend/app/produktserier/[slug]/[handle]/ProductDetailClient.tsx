'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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

  const goToImage = (idx: number) => {
    setSelectedImage(idx);
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
    const loadAlsoLikeProducts = async () => {
      const products = await fetchProductsFromMedusa();
      const filtered = products.filter((p: any) => p.sectionCategory === 'also-like');
      setAlsoLikeProducts(filtered);
    };
    loadAlsoLikeProducts();

    // Load favorite status from localStorage (cache)
    const favoritesList = JSON.parse(localStorage.getItem('favoritesList') || '[]');
    setIsFavorite(favoritesList.some((item: any) => item.id === product.id));

    // Listen for cart clear event
    const handleCartCleared = () => {
      setSelectedAccessories([]);
    };

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartItems' && !e.newValue) {
        setSelectedAccessories([]);
      }
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

    // Sync to Medusa in background if logged in
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
    featuredImage: {
      url: product.image,
      altText: product.title,
    },
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
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className="px-6">
      {/* Main Product Grid */}
      <div className="flex gap-2">
        {/* Left Column - Image & Tabs */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Image Gallery */}
          <div
            className="p-8 flex gap-6 bg-white"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            {/* Highlights Card */}
            <div className="flex flex-col w-72">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Snabbfakta</h3>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="grid grid-cols-2 gap-8">
                  {productDetails.highlights.map((item: { value: string; label: string }, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 text-black text-xl flex items-center justify-center"
                        style={{ minWidth: '20px', minHeight: '20px' }}
                      >
                        +
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                        <div className="text-xs text-gray-600">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Viktiga egenskaper och specifikationer för denna produkt.
              </p>
            </div>

            {/* Image Gallery */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Main Image */}
              <div className="relative flex items-center justify-center h-96 overflow-hidden">
                <button
                  onClick={() => goToImage((selectedImage - 1 + productDetails.images.length) % productDetails.images.length)}
                  className="absolute left-2 z-10 text-black hover:text-gray-500 text-4xl font-light flex-shrink-0"
                >
                  ‹
                </button>

                <div
                  className="absolute inset-0 flex items-center justify-center p-8 cursor-zoom-in"
                  onClick={() => setShowZoom(true)}
                >
                  <img
                    key={selectedImage}
                    src={productDetails.images[selectedImage]?.url}
                    alt={productDetails.images[selectedImage]?.altText}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <button
                  onClick={() => goToImage((selectedImage + 1) % productDetails.images.length)}
                  className="absolute right-2 z-10 text-black hover:text-gray-500 text-4xl font-light flex-shrink-0"
                >
                  ›
                </button>
              </div>

              {/* Pill controller */}
              {productDetails.images.length > 1 && (
                <div className="flex justify-center pt-4">
                  <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>
                    {/* Counter */}
                    <span className="text-xs text-gray-400 tabular-nums">{selectedImage + 1} / {productDetails.images.length}</span>

                    {/* Dots */}
                    {productDetails.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToImage(idx)}
                        className="relative w-2.5 h-2.5 rounded-full bg-gray-200 overflow-hidden"
                      >
                        <div
                          className="absolute inset-0 rounded-full bg-gray-800 transition-transform duration-300"
                          style={{ transform: idx <= selectedImage ? 'scale(1)' : 'scale(0)' }}
                        />
                      </button>
                    ))}

                    {/* Zoom */}
                    <button onClick={() => setShowZoom(true)} className="text-gray-500 hover:text-black transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Tabs */}
          <div
            className="p-8 pb-0 flex-1 bg-white"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            <div className="pt-0 w-full pb-8">
              {/* Tab Bar */}
              <div className="flex gap-8 mb-8 border-b border-gray-200 w-full">
                {[
                { key: 'description', label: 'Beskrivning' },
                { key: 'specifications', label: 'Specifikationer' },
                { key: 'contents', label: 'Produktinnehåll' },
                { key: 'reviews', label: 'Recensioner' },
              ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`pb-4 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${
                      activeTab === key
                        ? 'text-black border-b-2 border-black'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {key === 'description' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
                      </svg>
                    )}
                    {key === 'specifications' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.12-2.59-1.84 2.25h9.5L13.96 9.29z" />
                      </svg>
                    )}
                    {key === 'contents' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    )}
                    {key === 'reviews' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'description' && (
                <div className="space-y-3 pb-8">
                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{productDetails.description}</p>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-3 pb-8">
                  {productDetails.specifications.length > 0 ? (
                    productDetails.specifications.map((spec: { label: string; value: string }, idx: number) => (
                      <div key={idx} className="border-b border-gray-200 pb-3">
                        <p className="text-sm font-semibold text-gray-900">{spec.label}</p>
                        <p className="text-sm text-gray-700">{spec.value}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Inga specifikationer tillagda</p>
                  )}
                </div>
              )}

              {activeTab === 'contents' && (
                <div className="space-y-3 pb-8">
                  {productDetails.contents.length > 0 ? (
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-sm text-gray-700">Följande tillbehör ingår i paketet:</p>
                      <ul className="text-sm text-gray-700 mt-2 space-y-1 list-disc list-inside">
                        {productDetails.contents.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Inget produktinnehåll tillagt</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3 pb-8">
                  <div className="py-8">
                    <p className="text-sm text-gray-600">Denna produkt har inga recensioner än</p>
                    <p className="text-xs text-gray-500 mt-2">Var den första att recensera denna produkt</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Column - Product Info + Accessories */}
        <div className="w-72 flex flex-col gap-2">
        <div
          className="flex flex-col bg-white"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)', height: 'fit-content' }}
        >
          {/* Header - Title + Favorite */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex-1 min-w-0">
              {discountPercent > 0 && (
                <div className="inline-block bg-red-600 text-white px-2 py-0.5 text-xs font-bold mb-2 rounded w-fit">
                  -{discountPercent}%
                </div>
              )}
              <h1 className="text-xl font-bold text-black leading-tight">{product.title}</h1>
              <p className="text-xs text-gray-400 mt-1">Varukod: {productDetails.sku}</p>
            </div>
            <button
              onClick={handleFavoriteToggle}
              className={`ml-3 flex-shrink-0 ${isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-500'} transition-colors`}
              title={isFavorite ? 'Ta bort från favoriter' : 'Lägg till i favoriter'}
            >
              <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Price */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Pris</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-600">{product.price.toLocaleString('sv-SE')} kr</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString('sv-SE')} kr</span>
              )}
            </div>
          </div>

          {/* Color */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Färg</span>
            <div className="flex gap-3">
              {Object.entries(COLORS).map(([name, hex]) => (
                <button
                  key={name}
                  onClick={() => setSelectedColor(name)}
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                    selectedColor === name ? 'border-black ring-2 ring-offset-2 ring-black' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={name}
                  aria-label={`Välj färg ${name}`}
                />
              ))}
            </div>
          </div>

          {/* Stock */}
          {(() => {
            const qty = productDetails.quantityAvailable;
            const managesInventory = (product as any).variants?.some((v: any) => v.manage_inventory);
            const isOutOfStock = managesInventory && qty !== null && qty <= 0;
            return (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Lager</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-black'}`}>
                    {isOutOfStock ? 'Slut i lager' : qty !== null ? `${qty} st` : 'I lager'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Quantity + Buttons */}
          <div className="px-6 pt-4 pb-6 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center bg-gray-100 h-11 px-4 gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black text-sm font-semibold">−</button>
                <span className="text-sm font-semibold w-4 text-center tabular-nums">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-black text-sm font-semibold">+</button>
              </div>

              {/* Add to cart */}
              <button
                onClick={() => {
                  if (selectedAccessories.length === 0) {
                    window.dispatchEvent(new CustomEvent('addToCart', { detail: { id: product.id, title: product.title, price: product.price, originalPrice: product.originalPrice, quantity, image: product.image } }));
                  } else {
                    selectedAccessories.forEach((accessoryId) => {
                      const accessory = RECOMMENDED_ACCESSORIES.find(a => a.id === accessoryId);
                      if (accessory) window.dispatchEvent(new CustomEvent('addToCart', { detail: { id: accessory.id, title: accessory.name, price: Number(accessory.price), quantity: 1, image: accessory.image } }));
                    });
                    setSelectedAccessories([]);
                  }
                  setIsAdded(true);
                  setTimeout(() => setIsAdded(false), 100);
                }}
                className="flex-1 bg-black text-white text-sm font-semibold h-11 flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                {isAdded ? 'Tillagd' : 'Lägg i varukorg'}
              </button>
            </div>

            {/* Buy now */}
            <button
              onClick={() => {
                localStorage.setItem('quickCheckout', JSON.stringify({ id: product.id, title: product.title, price: product.price, originalPrice: product.originalPrice, quantity }));
                router.push('/kassan');
              }}
              className="w-full bg-green-600 text-white text-sm font-semibold h-11 tracking-widest uppercase hover:bg-green-700 transition-colors"
            >
              Handla nu
            </button>
          </div>

          {/* Fri frakt + Klarna */}
          <div className="border-t border-gray-100 px-6 py-4 space-y-3">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                <span className="text-black text-xs">Fri frakt</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                <span className="text-black text-xs">Fria returer</span>
              </div>
            </div>
            <div className="border-t border-gray-100"></div>
            <div className="flex justify-center">
              <div className="inline-block bg-pink-300 text-pink-900 px-3 py-1 text-xs font-bold rounded">
                Klarna
              </div>
            </div>
          </div>

        </div>

          {/* Rekommenderade tillbehör */}
          <div className="bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <button
              onClick={() => setShowAccessories(!showAccessories)}
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 py-4 px-6 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 7l-2-4H6L4 7m16 0l-1.286 10.715A2 2 0 0116.734 20H7.266a2 2 0 01-1.98-2.285L4 7m16 0H4m6-4v4m4-4v4m-5 10h6" />
                </svg>
                Rekommenderade tillbehör
              </div>
              <svg className={`w-5 h-5 transition-transform ${showAccessories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showAccessories && (
              <div className="border-t border-gray-200 divide-y divide-gray-100">
                {RECOMMENDED_ACCESSORIES.map((accessory) => {
                  const isSelected = selectedAccessories.includes(accessory.id);
                  return (
                    <button
                      key={accessory.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedAccessories(selectedAccessories.filter(id => id !== accessory.id));
                        } else {
                          setSelectedAccessories([...selectedAccessories, accessory.id]);
                        }
                      }}
                      className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-50' : ''}`}
                    >
                      <img src={accessory.image} alt={accessory.name} className="w-10 h-10 object-contain flex-shrink-0 bg-gray-100" />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900">{accessory.name}</p>
                        <p className="text-sm text-gray-500">{Number(accessory.price).toLocaleString('sv-SE')} kr</p>
                      </div>
                      <div className={`w-4 h-4 flex-shrink-0 border-2 rounded-sm transition-colors ${isSelected ? 'bg-black border-black' : 'border-gray-300'}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      </div>

      {/* Image Zoom Dialog */}
      <ImageZoomDialog
        images={productDetails.images}
        initialIndex={selectedImage}
        isOpen={showZoom}
        onClose={() => setShowZoom(false)}
      />

      {/* Du kanske också gillar Section */}
      {alsoLikeProducts.length > 0 && (
        <div className="px-6 mt-12">
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
