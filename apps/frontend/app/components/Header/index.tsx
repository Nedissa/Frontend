'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAside } from '../shared/Aside';
import { MobileHeader } from './MobileHeader';
import { MobileMenu } from './MobileMenu';
import { DesktopHeader } from './DesktopHeader';
import { MegaMenu } from './MegaMenu';
import { ERBJUDANDEN_DATA, MENU_DATA, SearchProduct } from './menuData';

// Header: äger allt delat state (cart, sök, mobilmeny, scroll) och
// sätter ihop mobil/desktop-underkomponenterna. Se menuData.tsx för innehåll.
export function HeaderWrapper({ initialIsLoggedIn = false }: { initialIsLoggedIn?: boolean }) {
  const { open, type: asideType } = useAside();
  const pathname = usePathname();

  if (pathname === '/inlogg' || pathname === '/aterstall-losenord') return null;

  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ title: string; url: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const [mobileActiveSubCategory, setMobileActiveSubCategory] = useState<Set<string>>(new Set());
  const [mobileActiveLevel, setMobileActiveLevel] = useState<0 | 1 | 2>(0);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const mobileHeaderRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isVibrating, setIsVibrating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  const doLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    window.dispatchEvent(new Event('userLogout'));
    router.push('/');
  };
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>([]);
  const searchFetchedRef = useRef(false);

  const fetchProductsForSearch = async () => {
    if (searchFetchedRef.current) return;
    searchFetchedRef.current = true;
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        const products = data.products || [];
        setSearchProducts(products.map((p: any) => ({
          id: p.id, title: p.title, handle: p.handle, image: p.image,
          category: p.category, price: p.price, rating: p.rating || 0, reviews: p.reviews || 0,
        })));
      }
    } catch {}
  };
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const isPathActive = (url: string) => {
    if (!pathname) return false;
    if (url === '/') return pathname === '/';
    return pathname === url;
  };

  useEffect(() => {
    setShowMegaMenu(false);
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    setMobileExpandedCategory(null);
    setMobileActiveSubCategory(new Set());
    setMobileActiveLevel(0);
  }, [pathname]);

  useEffect(() => {
    const handleOpenCart = () => open('cart');
    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, [open]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function updatePositions() {
      const searchBtn = document.getElementById('header-search-btn');
      if (searchBtn) {
        const r = searchBtn.getBoundingClientRect();
        document.documentElement.style.setProperty('--search-right', `${Math.round(r.right)}px`);
        document.documentElement.style.setProperty('--search-left', `${Math.round(r.left)}px`);
      }
      const loginBtn = document.getElementById('header-login-btn');
      if (loginBtn) {
        const r = loginBtn.getBoundingClientRect();
        document.documentElement.style.setProperty('--login-left', `${Math.round(r.left)}px`);
        document.documentElement.style.setProperty('--login-right', `${Math.round(window.innerWidth - r.right)}px`);
      }
    }
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  useEffect(() => {
    // Load cart from cartItems in localStorage on mount
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      try {
        const items = JSON.parse(savedCartItems);
        const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        setCartCount(count);
        setCartTotal(total);
      } catch (e) {
        console.error('Failed to load cart from localStorage', e);
      }
    }

    const checkLoginStatus = () => {
      setIsLoggedIn(document.cookie.includes('is_logged_in=1'));
    };
    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    setIsHydrated(true);

    const handleCartUpdated = () => {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        try {
          const items = JSON.parse(savedCartItems);
          const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
          setCartCount(count);
          setCartTotal(total);
        } catch (e) {
          console.error('Failed to update cart from localStorage', e);
        }
      } else {
        setCartCount(0);
        setCartTotal(0);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartItems') {
        if (!e.newValue) {
          setCartCount(0);
          setCartTotal(0);
        } else {
          handleCartUpdated();
        }
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdated);
    window.addEventListener('cartCleared', handleCartUpdated);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleLogin);
    window.addEventListener('userLogout', handleLogout);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
      window.removeEventListener('cartCleared', handleCartUpdated);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleLogin);
      window.removeEventListener('userLogout', handleLogout);
    };
  }, []);

  useEffect(() => {
    const handleAddToCart = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { price, quantity } = customEvent.detail;
      const priceNum = typeof price === 'string' ? parseInt(price) : price;

      const newCount = cartCount + (quantity || 1);
      const newTotal = cartTotal + (priceNum * (quantity || 1));

      setCartCount(newCount);
      setCartTotal(newTotal);

      sessionStorage.setItem('cart', JSON.stringify({ count: newCount, total: newTotal }));

      setIsHeaderVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

      if (isHeaderVisible) {
        setIsVibrating(true);
        setTimeout(() => setIsVibrating(false), 400);
      } else {
        setTimeout(() => {
          setIsVibrating(true);
          setTimeout(() => setIsVibrating(false), 800);
        }, 300);
      }
    };

    const handleCartUpdatedEvent = () => {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        try {
          const items = JSON.parse(savedCartItems);
          const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
          setCartCount(count);
          setCartTotal(total);
        } catch (e) {
          console.error('Failed to update cart from event', e);
        }
      }
    };

    window.addEventListener('addToCart', handleAddToCart);
    window.addEventListener('cartUpdated', handleCartUpdatedEvent);
    return () => {
      window.removeEventListener('addToCart', handleAddToCart);
      window.removeEventListener('cartUpdated', handleCartUpdatedEvent);
    };
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 50) { setIsHeaderVisible(true); }
      else if (currentY < lastY) { setIsHeaderVisible(true); }
      else if (currentY > lastY + 5) { setIsHeaderVisible(false); }
      lastY = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const inDesktop = searchContainerRef.current?.contains(event.target as Node);
      const inMobile = mobileSearchContainerRef.current?.contains(event.target as Node);
      if (!inDesktop && !inMobile) {
        setShowSearchResults(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.length > 0) setShowSearchResults(true);
  };

  const handleSearchFocus = () => {
    fetchProductsForSearch();
    if (searchTerm.length > 0) setShowSearchResults(true);
  };

  const handleSearchResultClick = () => {
    setShowSearchResults(false);
    setSearchTerm('');
  };

  const handleAddToCart = (product: SearchProduct) => {
    window.dispatchEvent(new CustomEvent('addToCart', {
      detail: {
        id: product.id,
        variantId: product.variantId,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
    }));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileActiveLevel(0);
    setMobileExpandedCategory(null);
    setMobileActiveSubCategory(new Set());
  };

  const openMobileCategory = (categoryId: string) => {
    setMobileExpandedCategory(categoryId);
    setMobileActiveLevel(1);
  };

  const backToMobileLevel0 = () => {
    setMobileActiveLevel(0);
    setMobileActiveSubCategory(new Set());
  };

  const toggleMobileSubCategory = (sectionId: string) => {
    setMobileActiveSubCategory(prev => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  };

  return (
    <header suppressHydrationWarning className={`fixed top-0 left-0 right-0 w-full bg-white z-40 transition-transform duration-300 ease-in-out ${
      isHeaderVisible && !mobileMenuOpen ? 'translate-y-0' : mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
    }`} style={{ paddingTop: 'env(safe-area-inset-top)' }}>

      <MobileHeader
        mobileHeaderRef={mobileHeaderRef}
        mobileSearchContainerRef={mobileSearchContainerRef}
        mobileSearchInputRef={mobileSearchInputRef}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => open('login')}
        onOpenCart={() => open('cart')}
        cartCount={cartCount}
        searchTerm={searchTerm}
        showSearchResults={showSearchResults}
        searchProducts={searchProducts}
        onSearchChange={handleSearchChange}
        onSearchFocus={handleSearchFocus}
        onSearchResultClick={handleSearchResultClick}
      />

      <DesktopHeader
        searchContainerRef={searchContainerRef}
        categoryDropdownRef={categoryDropdownRef}
        showCategoryDropdown={showCategoryDropdown}
        onToggleCategoryDropdown={() => setShowCategoryDropdown(!showCategoryDropdown)}
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => { setSelectedCategory(category); setShowCategoryDropdown(false); }}
        searchTerm={searchTerm}
        showSearchResults={showSearchResults}
        searchProducts={searchProducts}
        onSearchChange={handleSearchChange}
        onSearchFocus={handleSearchFocus}
        onAddToCart={handleAddToCart}
        isLoggedIn={isHydrated ? isLoggedIn : initialIsLoggedIn}
        onOpenLogin={() => open('login')}
        onOpenCart={() => open('cart')}
        cartCount={cartCount}
        isHydrated={isHydrated}
        isVibrating={isVibrating}
      />

      {/* Mobile Menu Overlay — rendered via portal outside <header> */}
      {isHydrated && createPortal(
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          mobileActiveLevel={mobileActiveLevel}
          mobileExpandedCategory={mobileExpandedCategory}
          mobileActiveSubCategory={mobileActiveSubCategory}
          activeMobileCategory={activeMobileCategory}
          isLoggedIn={isHydrated ? isLoggedIn : initialIsLoggedIn}
          onClose={closeMobileMenu}
          onOpenCategory={openMobileCategory}
          onBackToLevel0={backToMobileLevel0}
          onToggleErbjudanden={() => setActiveMobileCategory(activeMobileCategory === 'erbjudanden' ? null : 'erbjudanden')}
          onToggleSubCategory={toggleMobileSubCategory}
        />,
        document.body
      )}

      <MegaMenu
        showMegaMenu={showMegaMenu}
        activeMegaMenu={activeMegaMenu}
        onMouseEnterCategory={(categoryId) => { setShowMegaMenu(true); setActiveMegaMenu(categoryId); }}
        onMouseEnterErbjudanden={() => { setShowMegaMenu(true); setActiveMegaMenu('erbjudanden'); }}
        onMouseLeave={() => { setShowMegaMenu(false); setActiveMegaMenu(null); }}
        isPathActive={isPathActive}
      />
    </header>
  );
}
