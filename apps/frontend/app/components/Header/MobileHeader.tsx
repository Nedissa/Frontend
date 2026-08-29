'use client';

import Link from 'next/link';
import { RefObject } from 'react';
import { Logo } from '../layout/Logo';
import { Spinner } from '../shared/Spinner';
import { SearchProduct } from './menuData';

interface MobileHeaderProps {
  mobileHeaderRef: RefObject<HTMLDivElement | null>;
  mobileSearchContainerRef: RefObject<HTMLDivElement | null>;
  mobileSearchInputRef: RefObject<HTMLInputElement | null>;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onOpenCart: () => void;
  cartCount: number;
  searchTerm: string;
  showSearchResults: boolean;
  searchProducts: SearchProduct[];
  onSearchChange: (value: string) => void;
  onSearchFocus: () => void;
  onSearchResultClick: () => void;
}

// Mobil header: hamburgarmeny, logo, konto/kundvagn, sökfält + resultat.
export function MobileHeader({
  mobileHeaderRef,
  mobileSearchContainerRef,
  mobileSearchInputRef,
  mobileMenuOpen,
  onToggleMobileMenu,
  isLoggedIn,
  onOpenLogin,
  onOpenCart,
  cartCount,
  searchTerm,
  showSearchResults,
  searchProducts,
  onSearchChange,
  onSearchFocus,
  onSearchResultClick,
}: MobileHeaderProps) {
  const results = searchProducts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5);

  return (
    <div className="lg:hidden" ref={mobileHeaderRef}>
      {/* Row 1: hamburger | logo | konto+kundvagn */}
      <div className="relative flex items-center px-0 py-0 border-b border-gray-100" style={{ minHeight: '56px', background: 'white' }}>
        <button
          onClick={onToggleMobileMenu}
          aria-label="Meny"
          className="inline-flex items-center justify-center flex-shrink-0 self-stretch"
          style={{ background: 'white', width: '44px' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            {mobileMenuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" stroke="#111" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              : <path stroke="#111" strokeWidth="2.5" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18"/>}
          </svg>
        </button>
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-1">
          <Logo size={28} />
          <span className="font-bold text-black" style={{ fontSize: '17px', letterSpacing: '-0.3px' }}>Techpilots</span>
        </Link>
        <div className="flex items-stretch gap-0 ml-auto self-stretch">
          {isLoggedIn ? (
            <Link href="/konto" className="inline-flex flex-col items-center justify-center gap-0.5" style={{ background: 'white', width: '56px' }}>
              <svg className="w-5 h-5" fill="none" stroke="#111" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
              <span style={{ fontSize: '9px', color: '#111', fontWeight: 600 }}>Konto</span>
            </Link>
          ) : (
            <button onClick={onOpenLogin} className="inline-flex flex-col items-center justify-center gap-0.5" style={{ background: 'white', width: '56px' }}>
              <svg className="w-5 h-5" fill="none" stroke="#111" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
              <span style={{ fontSize: '9px', color: '#111', fontWeight: 600 }}>Logga in</span>
            </button>
          )}
          <button onClick={onOpenCart} className="inline-flex flex-col items-center justify-center gap-0.5 relative" style={{ background: 'white', width: '56px' }}>
            <div className="relative">
              <svg className="w-5 h-5" fill="none" stroke="#111" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5H17"/>
                <circle cx="9" cy="22" r="1.6" fill="#111" stroke="none"/>
                <circle cx="16" cy="22" r="1.6" fill="#111" stroke="none"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute bg-red-600 text-white font-bold rounded-full flex items-center justify-center" style={{ fontSize: '8px', minWidth: '14px', height: '14px', padding: '0 2px', top: '-6px', right: '-8px' }} suppressHydrationWarning>{cartCount}</span>
              )}
            </div>
            <span style={{ fontSize: '9px', color: '#111', fontWeight: 600 }}>Varukorg</span>
          </button>
        </div>
      </div>
      {/* Row 2: search */}
      <div className="px-4 py-2 relative bg-white border-b border-gray-200" ref={mobileSearchContainerRef}>
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-3 py-2 gap-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={mobileSearchInputRef}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            placeholder="Sök efter produkt..."
            className="flex-1 bg-transparent text-sm text-black placeholder-gray-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onSearchFocus}
          />
        </div>
        {searchTerm.length > 0 && showSearchResults && (
          <div
            className="absolute left-0 right-0 bg-white border border-gray-200 shadow-lg z-[9999] mt-1 mx-4"
            style={{ animation: 'searchFadeIn 120ms ease forwards' }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {results.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produkter/${product.handle || product.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    onClick={onSearchResultClick}
                  >
                    <img src={product.image} alt={product.title} className="w-14 h-14 object-contain flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{product.title}</div>
                      <div className="text-xs text-red-600 font-bold">{product.price.toLocaleString('sv-SE')} kr</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-3 text-sm text-gray-500 flex items-center gap-2">
                {searchProducts.length === 0 ? <><Spinner size={14} /> Söker...</> : `Inga resultat för "${searchTerm}"`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
