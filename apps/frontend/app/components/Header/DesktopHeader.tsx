'use client';

import Link from 'next/link';
import Image from 'next/image';
import { RefObject } from 'react';
import { Logo } from '../layout/Logo';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import { Spinner } from '../shared/Spinner';
import { MENU_DATA, MenuCategory, SearchProduct } from './menuData';

interface DesktopHeaderProps {
  menuData?: MenuCategory[];
  searchContainerRef: RefObject<HTMLDivElement | null>;
  categoryDropdownRef: RefObject<HTMLDivElement | null>;
  showCategoryDropdown: boolean;
  onToggleCategoryDropdown: () => void;
  selectedCategory: { title: string; url: string } | null;
  onSelectCategory: (category: { title: string; url: string } | null) => void;
  searchTerm: string;
  showSearchResults: boolean;
  searchProducts: SearchProduct[];
  onSearchChange: (value: string) => void;
  onSearchFocus: () => void;
  onAddToCart: (product: SearchProduct) => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onOpenCart: () => void;
  cartCount: number;
  isHydrated: boolean;
  isVibrating: boolean;
}

// Desktop header: logo, kategori-dropdown + sök, språkval, konto/kundvagn.
export function DesktopHeader({
  menuData = MENU_DATA,
  searchContainerRef,
  categoryDropdownRef,
  showCategoryDropdown,
  onToggleCategoryDropdown,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  showSearchResults,
  searchProducts,
  onSearchChange,
  onSearchFocus,
  onAddToCart,
  isLoggedIn,
  onOpenLogin,
  onOpenCart,
  cartCount,
  isHydrated,
  isVibrating,
}: DesktopHeaderProps) {
  const results = searchProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.manufacturerSku?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="hidden xl:block py-2 pt-4 px-6">
      <div className="max-w-content mx-auto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <Link href="/" className="flex-shrink-0 flex items-center gap-1 pl-6" style={{ marginLeft: '-18.5px' }}>
          <Logo size={32} />
          <span className="font-bold text-black" style={{ fontSize: '22px', lineHeight: '32px', letterSpacing: '-0.3px' }}>Techpilots</span>
        </Link>

        {/* Search Input */}
        <div className="flex-1 max-w-2xl relative" ref={searchContainerRef} id="header-search-container">
          <div className="relative flex items-center rounded overflow-visible border border-gray-200 bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            {/* Category dropdown - hidden on mobile */}
            <div className="relative flex-shrink-0 hidden sm:block" ref={categoryDropdownRef}>
              <button
                onClick={onToggleCategoryDropdown}
                className="flex items-center gap-2 pl-4 pr-3 py-2.5 text-sm font-medium text-gray-600 whitespace-nowrap border-r border-gray-200"
                style={{ backgroundColor: '#f5f5f5', width: '145px' }}
              >
                <span>{selectedCategory ? selectedCategory.title : 'Alla kategorier'}</span>
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg z-[9999] w-full">
                  {selectedCategory !== null && (
                    <button
                      onClick={() => onSelectCategory(null)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:text-black border-b border-gray-100 font-semibold"
                    >
                      Alla kategorier
                    </button>
                  )}
                  {menuData.filter(cat => cat.title !== selectedCategory?.title).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory({ title: cat.title, url: cat.url })}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:text-black relative group border-b border-gray-100 last:border-b-0"
                    >
                      <span className="relative inline-block">
                        {cat.title}
                        <span className="absolute bottom-0 left-0 w-full bg-black transition-transform duration-300 ease-out origin-left scale-x-0 group-hover:scale-x-100" style={{ height: '1px', willChange: 'transform' }} />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Search field */}
            <div className="flex items-center flex-1 px-3">
              <input
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                placeholder="Sök efter produkt eller varukod..."
                className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none py-2"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={onSearchFocus}
              />
            </div>
            <button id="header-search-btn" aria-label="Sök" className="flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0a0a0a', width: '40px', alignSelf: 'stretch', position: 'relative', isolation: 'isolate' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"/>
              </svg>
            </button>
          </div>
          {searchTerm.length > 0 && showSearchResults && (
            <div
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-[9999]"
              style={{ animation: 'searchFadeIn 120ms ease forwards' }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {results.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {results.map((product) => (
                    <div key={product.id} className="px-4 py-3 hover:bg-gray-50 flex items-center gap-4 group">
                      <Link href={`/produkter/${product.handle || product.id}`} className="flex-1 flex items-center gap-4 cursor-pointer min-w-0">
                        <div className="flex-shrink-0 w-14 h-14">
                          <Image src={product.image} alt={product.title} width={56} height={56} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-black">{product.title}</div>
                          <div className="text-xs text-gray-600">
                            {product.category}
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < (product.rating || 0) ? 'fill-black' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 whitespace-nowrap">● {product.reviews || 0} st</span>
                        <div className="text-sm font-bold text-red-600 whitespace-nowrap">{product.price.toLocaleString('sv-SE')} kr</div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                          aria-label={`Lägg till ${product.title} i varukorgen`}
                          className="bg-black text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-800 flex-shrink-0">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-sm text-gray-600 flex items-center gap-2">
                  {searchProducts.length === 0 ? <><Spinner size={14} /> Söker...</> : `Inga resultat för "${searchTerm}"`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0" style={{ justifyContent: 'flex-end' }}>
          <style>{`
            @keyframes vibrate {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-2px); }
              75% { transform: translateX(2px); }
            }
            .vibrating {
              animation: vibrate 0.15s ease-in-out infinite;
            }
            @keyframes searchFadeIn {
              from { opacity: 0; transform: translateY(-4px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {/* Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <div className="hidden md:block w-px h-6 bg-gray-300"></div>
          {isLoggedIn ? (
            <Link href="/konto" className="hidden md:flex flex-col items-center gap-0.5 text-black hover:text-gray-600 w-[70px]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="text-xs font-semibold">Mina sidor</span>
            </Link>
          ) : (
            <button id="header-login-btn" onClick={onOpenLogin} className="hidden md:flex flex-col items-center gap-0.5 text-black hover:text-gray-600 w-[70px]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="text-xs font-semibold">Logga in</span>
            </button>
          )}
          <div className="hidden md:block w-px h-6 bg-gray-300"></div>
          <button
            onClick={onOpenCart}
            aria-label="Öppna varukorg"
            className="flex flex-col items-center gap-0.5 text-black"
          >
            <div className={`relative flex items-center ${isVibrating ? 'vibrating' : ''}`}>
              <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              {isHydrated && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white font-bold rounded-full flex items-center justify-center shadow-lg" style={{ fontSize: '9px', minWidth: '16px', height: '16px', padding: '0 2px' }}>{cartCount}</span>
              )}
            </div>
            <span className="text-xs font-semibold hidden md:block">Varukorg</span>
          </button>
        </div>
      </div>
    </div>
  );
}
