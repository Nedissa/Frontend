'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchProductsFromMedusa } from '@/app/lib/medusa-client';

export function ProductBanner() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProductsFromMedusa().then((all) => setProducts(all.slice(0, 4)));
  }, []);

  const group1 = products.slice(0, 2);
  const group2 = products.slice(2, 4);

  const handleAdd = (p: any) => {
    window.dispatchEvent(new CustomEvent('addToCart', {
      detail: { id: p.id, title: p.title, price: p.price, image: p.image, quantity: 1 }
    }));
  };

  const ProductItem = ({ p, borderRight }: { p: any; borderRight: boolean }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        className="flex-1 flex flex-col"
        style={{ borderRight: borderRight ? '1px solid #e5e7eb' : 'none' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link href={`/produkter/${p.handle}`} className="flex flex-col p-4 flex-1" style={{ backgroundColor: hovered ? '#f9f9f9' : 'white', transition: 'background 200ms' }}>
          <div className="flex items-center justify-center mb-3" style={{ backgroundColor: '#f5f5f5', height: '160px' }}>
            <img src={p.image} alt={p.title} className="w-full h-full object-contain p-4" style={{ maxHeight: '160px' }} />
          </div>
          <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{p.price?.toLocaleString('sv-SE')} kr</p>
        </Link>
        <div className="px-4 pb-4" style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 200ms, transform 200ms' }}>
          <button
            onClick={() => handleAdd(p)}
            className="w-full bg-black text-white font-semibold py-2.5 text-sm hover:bg-gray-800 transition-colors"
          >
            Lägg i varukorg
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-6">
      <div className="flex gap-4" style={{ minHeight: '420px' }}>

        {/* Left — hero card */}
        <div className="relative flex-shrink-0 overflow-hidden" style={{ width: '280px' }}>
          <img src="/assets/hero-1.jpg" alt="Special Deals" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            <span className="text-white text-xs font-bold uppercase tracking-widest">Special Deals</span>
            <div>
              <h2 className="text-white text-3xl font-bold leading-tight mb-6">Rabatt 30%<br />Gaming</h2>
              <Link href="/erbjudanden" className="inline-flex items-center bg-white text-black font-semibold px-6 py-2.5 text-sm">
                Shoppa nu
              </Link>
            </div>
          </div>
        </div>

        {/* Group 1 */}
        <div className="flex-1 flex flex-col border border-gray-200" style={{ overflow: 'hidden' }}>
          <div className="px-5 pt-5 pb-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900">Köp 2 och få 20% rabatt</p>
          </div>
          <div className="flex flex-1">
            {group1.length > 0 ? group1.map((p, i) => (
              <ProductItem key={p.id} p={p} borderRight={i === 0} />
            )) : (
              <div className="flex-1 flex items-center justify-center text-gray-300 text-sm">Laddar...</div>
            )}
          </div>
        </div>

        {/* Group 2 */}
        <div className="flex-1 flex flex-col border border-gray-200" style={{ overflow: 'hidden' }}>
          <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">Köp 3 och få 20% rabatt</p>
            <div className="flex gap-1">
              <button className="w-7 h-7 flex items-center justify-center border border-gray-200 hover:bg-gray-50">‹</button>
              <button className="w-7 h-7 flex items-center justify-center border border-gray-200 hover:bg-gray-50">›</button>
            </div>
          </div>
          <div className="flex flex-1">
            {group2.length > 0 ? group2.map((p, i) => (
              <ProductItem key={p.id} p={p} borderRight={i === 0} />
            )) : (
              <div className="flex-1 flex items-center justify-center text-gray-300 text-sm">Laddar...</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
