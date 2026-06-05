'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Logo } from './Logo';
import { useAside } from './Aside';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LaptopIcon } from './Icons/LaptopIcon';
import { DesktopIcon } from './Icons/DesktopIcon';
import { ProcessorIcon } from './Icons/ProcessorIcon';
import { GrafikkortIcon } from './Icons/GrafikkortIcon';
import { ModerkortIcon } from './Icons/ModerkortIcon';
import { AccessoriesIcon } from './Icons/AccessoriesIcon';
import { RamMinnenIcon } from './Icons/RamMinnenIcon';
import { NataggregatIcon } from './Icons/NataggregatIcon';
import { GamepadIcon } from './Icons/GamepadIcon';
import { GamingHeadsetIcon } from './Icons/GamingHeadsetIcon';
import { GamingMusmattorIcon } from './Icons/GamingMusmattorIcon';
import { MobiltelephoneIcon } from './Icons/MobiltelephoneIcon';
import { MobilTillbehorIcon } from './Icons/MobilTillbehorIcon';
import { SmartWatchIcon } from './Icons/SmartWatchIcon';
import { GamingComputerIcon } from './Icons/GamingComputerIcon';
import { StorageIcon } from './Icons/StorageIcon';
import { TvIcon } from './Icons/TvIcon';
import { SpeakerIcon } from './Icons/SpeakerIcon';
import { TvTillbehorIcon } from './Icons/TvTillbehorIcon';
import { RouterIcon } from './Icons/RouterIcon';
import { WifiIcon } from './Icons/WifiIcon';
import { MeshNetworkIcon } from './Icons/MeshNetworkIcon';

interface MenuItem {
  id: string;
  title: string;
  url: string;
  items?: MenuItem[];
}

interface MenuSection {
  id: string;
  title: string;
  url: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface MenuCategory {
  id: string;
  title: string;
  url: string;
  items?: MenuSection[];
}


const MENU_DATA: MenuCategory[] = [
  {
    id: 'datorer-och-tillbehor',
    title: 'Datorer & Tillbehör',
    url: '/kategori/datorer-tillbehor',
    items: [
      {
        id: 'barbara',
        title: 'Bärbara',
        url: '/produkter',
        icon: <img src="/icons/barbara-datorer.png" alt="Bärbara datorer" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'ultrabooks', title: 'Ultrabooks', url: '/produkter' },
          { id: 'gaming-barbara', title: 'Gaming bärbara', url: '/produkter' },
          { id: 'kontor-barbara', title: 'Kontor', url: '/produkter' },
        ],
      },
      {
        id: 'stationara',
        title: 'Stationära',
        url: '/produkter',
        icon: <img src="/icons/stationara-datorer.png" alt="Stationära datorer" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'mini-pc', title: 'Mini-PC', url: '/produkter' },
          { id: 'allt-i-ett', title: 'Allt-i-ett-datorer', url: '/produkter' },
          { id: 'arbetsdatorer', title: 'Arbetsdatorer', url: '/produkter' },
        ],
      },
      {
        id: 'datortillbehor',
        title: 'Tillbehör',
        url: '/produkter',
        icon: <img src="/icons/datortillbehor.png" alt="Datortillbehör" style={{ width: '38px', height: '38px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'bildskarm', title: 'Bildskärmar', url: '/produkter' },
          { id: 'tangentbord', title: 'Tangentbord', url: '/produkter' },
          { id: 'moss', title: 'Möss', url: '/produkter' },
        ],
      },
    ],
  },
  {
    id: 'komponenter',
    title: 'Datorkomponenter',
    url: '/kategori/datorkomponenter',
    items: [
      {
        id: 'processorer',
        title: 'Processorer',
        url: '/produkter',
        icon: <img src="/icons/cpu.png" alt="CPU" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'intel', title: 'Intel', url: '/produkter' },
          { id: 'amd', title: 'AMD', url: '/produkter' },
        ],
      },
      {
        id: 'moderkort',
        title: 'Moderkort',
        url: '/produkter',
        icon: <img src="/icons/moderkort.png" alt="Moderkort" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'intel-socket', title: 'Intel', url: '/produkter' },
          { id: 'amd-socket', title: 'AMD', url: '/produkter' },
        ],
      },
      {
        id: 'grafikkort',
        title: 'Grafikkort',
        url: '/produkter',
        icon: <img src="/icons/gpu.png" alt="GPU" style={{ width: '38px', height: '38px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'nvidia', title: 'NVIDIA', url: '/produkter' },
          { id: 'amd-gpu', title: 'AMD', url: '/produkter' },
        ],
      },
      {
        id: 'ram',
        title: 'RAM-minne',
        url: '/produkter',
        icon: <img src="/icons/ram.png" alt="RAM" style={{ width: '38px', height: '38px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'ddr5', title: 'DDR5', url: '/produkter' },
          { id: 'ddr4', title: 'DDR4', url: '/produkter' },
        ],
      },
      {
        id: 'lagringsenhet',
        title: 'Lagring',
        url: '/produkter',
        icon: <img src="/icons/lagring.png" alt="Lagring" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'ssd-nvme', title: 'SSD NVMe', url: '/produkter' },
          { id: 'ssd-sata', title: 'SSD SATA', url: '/produkter' },
          { id: 'hdd', title: 'Hårddiskar', url: '/produkter' },
        ],
      },
      {
        id: 'natlagring',
        title: 'Nätaggregat',
        url: '/produkter',
        icon: <img src="/icons/nataggregat.png" alt="Nätaggregat" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'modular', title: 'Modulärt', url: '/produkter' },
          { id: 'semi-modular', title: 'Semi-modulärt', url: '/produkter' },
        ],
      },
    ],
  },
  {
    id: 'gaming',
    title: 'Gaming',
    url: '/kategori/gaming',
    items: [
      {
        id: 'gaming-laptops',
        title: 'Bärbara',
        url: '/produkter',
        icon: <img src="/icons/gaming-laptop.png" alt="Gaming Bärbara" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'high-end', title: 'High-End', url: '/produkter' },
          { id: 'mid-range', title: 'Mid-Range', url: '/produkter' },
        ],
      },
      {
        id: 'gaming-pc',
        title: 'Datorer',
        url: '/produkter',
        icon: <img src="/icons/gaming-pc.png" alt="Gaming PC" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'budget', title: 'Budget', url: '/produkter' },
          { id: 'pro', title: 'Pro', url: '/produkter' },
        ],
      },
      {
        id: 'gaming-peripherals',
        title: 'Tillbehör',
        url: '/produkter',
        icon: <img src="/icons/gaming-tillbehor.png" alt="Gamingtillbehör" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'gaming-mus', title: 'Gaming Möss', url: '/produkter' },
          { id: 'gaming-tangentbord', title: 'Gaming Tangentbord', url: '/produkter' },
          { id: 'gaming-headset', title: 'Gaming Headset', url: '/produkter' },
        ],
      },
    ],
  },
  {
    id: 'mobiltelefoner',
    title: 'Mobiltelefoner',
    url: '/kategori/mobiltelefoner',
    items: [
      {
        id: 'smartphones',
        title: 'Smartphones',
        url: '/produkter',
        icon: <img src="/icons/smartphones.png" alt="Smartphones" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'flagship', title: 'Flaggskepp', url: '/produkter' },
          { id: 'mid-range-phone', title: 'Mid-Range', url: '/produkter' },
          { id: 'budget-phone', title: 'Budget', url: '/produkter' },
        ],
      },
      {
        id: 'mobil-tillbehor',
        title: 'Mobil tillbehör',
        url: '/produkter',
        icon: <img src="/icons/mobiltillbehor.png" alt="Mobiltillbehör" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'skal', title: 'Skal & Skydd', url: '/produkter' },
          { id: 'laddare', title: 'Laddare', url: '/produkter' },
          { id: 'screenprotectors', title: 'Skärmskydd', url: '/produkter' },
        ],
      },
    ],
  },
  {
    id: 'natverk',
    title: 'Nätverk',
    url: '/kategori/natverk',
    items: [
      {
        id: 'accesspunkter',
        title: 'Accesspunkter',
        url: '/produkter',
        icon: <img src="/icons/accesspunkter.png" alt="Accesspunkter" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'wifi6', title: 'WiFi 6', url: '/produkter' },
          { id: 'wifi7', title: 'WiFi 7', url: '/produkter' },
        ],
      },
      {
        id: 'natsverksforlangarе',
        title: 'Nätverksförlängare',
        url: '/produkter',
        icon: <img src="/icons/natverksforlangare.png" alt="Nätverksförlängare" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'wifi-forlangarе', title: 'WiFi', url: '/produkter' },
          { id: 'mesh-forlangarе', title: 'Mesh', url: '/produkter' },
        ],
      },
      {
        id: 'routrar',
        title: 'Routrar',
        url: '/produkter',
        icon: <img src="/icons/routrar.png" alt="Routrar" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'wifi6-routrar', title: 'WiFi 6', url: '/produkter' },
          { id: 'wifi7-routrar', title: 'WiFi 7', url: '/produkter' },
          { id: 'gaming-routrar', title: 'Gaming', url: '/produkter' },
        ],
      },
      {
        id: 'mesh',
        title: 'Mesh Nätverk',
        url: '/produkter',
        icon: <img src="/icons/mesh.png" alt="Mesh Nätverk" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'mesh-wifi6', title: 'WiFi 6', url: '/produkter' },
          { id: 'mesh-wifi7', title: 'WiFi 7', url: '/produkter' },
        ],
      },
    ],
  },
  {
    id: 'tv-hifi',
    title: 'TV & HiFi',
    url: '/kategori/tv-hifi',
    items: [
      {
        id: 'tv',
        title: 'TV',
        url: '/produkter',
        icon: <img src="/icons/tv.png" alt="TV" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: '4k-tv', title: '4K TV', url: '/produkter' },
          { id: 'oled-tv', title: 'OLED TV', url: '/produkter' },
          { id: 'gaming-tv', title: 'Gaming TV', url: '/produkter' },
        ],
      },
      {
        id: 'ljud',
        title: 'Ljud & HiFi',
        url: '/produkter',
        icon: <img src="/icons/ljud-hifi.png" alt="Ljud & HiFi" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'hogtalare', title: 'Högtalare', url: '/produkter' },
          { id: 'horlur', title: 'Hörlurar', url: '/produkter' },
          { id: 'surround', title: 'Surroundljud', url: '/produkter' },
        ],
      },
      {
        id: 'tillbehor-tv',
        title: 'TV Tillbehör',
        url: '/produkter',
        icon: <img src="/icons/tv-tillbehor.png" alt="TV Tillbehör" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'montering', title: 'Montering', url: '/produkter' },
          { id: 'soundbar', title: 'Soundbar', url: '/produkter' },
        ],
      },
    ],
  },
];

const ERBJUDANDEN_CAMPAIGNS = [
  { id: 'veckans-deals', title: 'Veckans deals', bg: 'bg-gray-900', url: '/erbjudanden/veckans-deals', image: '/assets/kampanj-1.webp' },
  { id: 'rea', title: 'Rea — upp till 50%', bg: 'bg-red-700', url: '/erbjudanden/rea', image: '/assets/kampanj-2.webp' },
  { id: 'paketpris', title: 'Paketpris', bg: 'bg-blue-900', url: '/erbjudanden/paketpris', image: '/assets/kampanj-3.webp' },
  { id: 'lagertomning', title: 'Lagertömning', bg: 'bg-gray-800', url: '/erbjudanden/lagertomning', image: '/assets/kampanj-4.webp' },
];

const ERBJUDANDEN_DATA: MenuCategory = {
  id: 'erbjudanden',
  title: 'Erbjudanden',
  url: '/erbjudanden',
  items: [],
};

interface SearchProduct {
  id: string;
  title: string;
  handle?: string;
  image: string;
  category: string;
  price: number;
  rating?: number;
  reviews?: number;
}

export function HeaderWrapper({ initialIsLoggedIn = false }: { initialIsLoggedIn?: boolean }) {
  const { open } = useAside();
  const pathname = usePathname();

  if (pathname === '/inlogg' || pathname === '/aterstall-losenord') return null;
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ title: string; url: string } | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isVibrating, setIsVibrating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>([]);
  const lastScrollY = useRef(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const isPathActive = (url: string) => {
    if (!pathname) return false;
    if (url === '/') return pathname === '/';
    return pathname === url;
  };

  useEffect(() => {
    setShowMegaMenu(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  const getCartCount = () => {
    if (typeof window === 'undefined') return cartCount;
    try {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        const items = JSON.parse(savedCartItems);
        return items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      }
    } catch (e) {
      console.error('Failed to get cart count', e);
    }
    return cartCount;
  };

  const getCartTotal = () => {
    if (typeof window === 'undefined') return cartTotal;
    try {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        const items = JSON.parse(savedCartItems);
        return items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      }
    } catch (e) {
      console.error('Failed to get cart total', e);
    }
    return cartTotal;
  };

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

    // Listen for cart updates - read from localStorage
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

    // Fetch products from API for search
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          const products = data.products || [];
          const formattedProducts: SearchProduct[] = products.map((p: any) => ({
            id: p.id,
            title: p.title,
            handle: p.handle,
            image: p.image,
            category: p.category,
            price: p.price,
            rating: p.rating || 0,
            reviews: p.reviews || 0,
          }));
          setSearchProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error fetching products for search:', error);
      }
    };

    fetchProducts();

    // Listen for login event
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

      // Save to sessionStorage
      sessionStorage.setItem('cart', JSON.stringify({ count: newCount, total: newTotal }));

      // Show header when item is added to cart
      setIsHeaderVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

      // Trigger vibration on cart icon only if header is already visible
      if (isHeaderVisible) {
        setIsVibrating(true);
        setTimeout(() => setIsVibrating(false), 400);
      } else {
        // If header is hidden, wait for it to slide up (300ms) then vibrate for longer
        setTimeout(() => {
          setIsVibrating(true);
          setTimeout(() => setIsVibrating(false), 800);
        }, 300);
      }
    };

    const handleCartUpdated = () => {
      // Always recalculate from localStorage - don't trust event data
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

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up
      if (currentScrollY < lastScrollY.current) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Hide header when scrolling down
        setIsHeaderVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getActiveCategory = () => activeMegaMenu === 'erbjudanden' ? ERBJUDANDEN_DATA : MENU_DATA.find(cat => cat.id === activeMegaMenu);

  return (
    <header suppressHydrationWarning className={`fixed top-0 left-0 right-0 w-full bg-white z-40 transition-transform duration-300 ease-in-out ${
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Search bar section */}
      <div className="py-2 pt-4 px-6">
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <Link href="/" className="flex-shrink-0 flex items-center gap-1.5 pl-6">
            <div style={{ width: '32px', height: '32px' }}>
              <Logo />
            </div>
            <span className="font-bold text-black hidden sm:inline" style={{ fontSize: '22px', lineHeight: '32px', letterSpacing: '-0.3px' }}>Techpilots</span>
          </Link>

          {/* Search Input */}
          <div className="flex-1 max-w-2xl relative" ref={searchContainerRef}>
            <div className="relative flex items-center rounded overflow-visible" style={{ backgroundColor: '#f5f5f5' }}>
              {/* Category dropdown */}
              <div className="relative flex-shrink-0" ref={categoryDropdownRef}>
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-black whitespace-nowrap border-r border-gray-300"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <span>{selectedCategory ? selectedCategory.title : 'Alla kategorier'}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg z-[9999] min-w-[200px]">
                    <button
                      onClick={() => { setSelectedCategory(null); setShowCategoryDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-black relative group"
                    >
                      <span className="relative inline-flex">
                        Alla kategorier
                        <span className="absolute bottom-0 left-0 h-0.5 bg-black w-0 group-hover:w-full transition-all duration-300 ease-out" />
                      </span>
                    </button>
                    {MENU_DATA.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory({ title: cat.title, url: cat.url }); setShowCategoryDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:text-black relative group"
                      >
                        <span className="relative inline-flex">
                          {cat.title}
                          <span className="absolute bottom-0 left-0 h-0.5 bg-black w-0 group-hover:w-full transition-all duration-300 ease-out" />
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
                  placeholder="Sök efter produkt, kategori eller artikel"
                  className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none py-1.5"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.length > 0) setShowSearchResults(true);
                  }}
                  onFocus={() => searchTerm.length > 0 && setShowSearchResults(true)}
                />
                <svg className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"/>
                </svg>
              </div>
            </div>
            {searchTerm.length > 0 && showSearchResults && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg z-[9999]"
                onMouseDown={(e) => e.preventDefault()}
              >
                {(() => {
                  const results = searchProducts.filter(product =>
                    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchTerm.toLowerCase())
                  ).slice(0, 5);

                  return results.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {results.map((product) => (
                        <div key={product.id} className="px-4 py-3 hover:bg-gray-50 flex items-center gap-4 group">
                          <Link href={`/produkter/${product.handle || product.id}`} className="flex-1 flex items-center gap-4 cursor-pointer min-w-0">
                            <div className="flex-shrink-0 w-12 h-12">
                              <Image src={product.image} alt={product.title} width={48} height={48} className="w-full h-full object-contain" />
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
                                window.dispatchEvent(new CustomEvent('addToCart', {
                                  detail: {
                                    id: product.id,
                                    title: product.title,
                                    price: product.price,
                                    image: product.image,
                                    quantity: 1
                                  }
                                }));
                              }}
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
                    <div className="p-3 text-sm text-gray-600">
                      {searchProducts.length === 0 ? 'Laddar produkter...' : `Inga resultat för "${searchTerm}"`}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4 flex-shrink-0" style={{ minWidth: '280px', justifyContent: 'flex-end' }}>
            <style>{`
              @keyframes vibrate {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
              }
              .vibrating {
                animation: vibrate 0.15s ease-in-out infinite;
              }
            `}</style>
            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-300"></div>
            <Link href="/konto" className="hidden md:flex items-center gap-1 text-black hover:text-gray-600">
              <span className="text-xs font-semibold">{isHydrated ? (isLoggedIn ? 'Mina sidor' : 'Logga in') : 'Logga in'}</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </Link>
            <div className="hidden md:block w-px h-6 bg-gray-300"></div>
            <button
              onClick={() => open('cart')}
              className="flex items-center gap-6 text-black"
            >
              <div className={`relative flex items-center ${isVibrating ? 'vibrating' : ''}`}>
                <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg" style={{ display: cartCount > 0 ? 'flex' : 'none' }} suppressHydrationWarning>{cartCount}</span>
              </div>
              <div className="flex flex-col items-start gap-0.5 hidden md:flex" style={{ minWidth: '72px' }}>
                <span className="text-sm font-bold text-black" suppressHydrationWarning>{cartTotal.toLocaleString('sv-SE')} kr</span>
                <span className="text-xs font-semibold text-black">Varukorg</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation & Mega Menu Wrapper */}
      <div onMouseLeave={() => { setShowMegaMenu(false); setActiveMegaMenu(null); }}>
        {/* Navigation */}
        <nav className="bg-white">
          <div className="px-6 py-0 flex justify-center">
            <div className="w-full max-w-[1280px] flex items-stretch gap-0">
              {MENU_DATA.map((category) => {
                const isActive = isPathActive(category.url);
                return (
                  <Link
                    key={category.id}
                    href={category.url}
                    onMouseEnter={() => {
                      if (category.items && category.items.length > 0) {
                        setShowMegaMenu(true);
                        setActiveMegaMenu(category.id);
                      }
                    }}
                    className="px-6 py-2 text-sm font-semibold text-black whitespace-nowrap relative group inline-flex"
                  >
                    {category.title}
                    <span className={`absolute bottom-0 left-6 h-0.5 bg-black transition-all duration-300 ease-out ${
                      isActive ? 'w-[calc(100%-48px)]' : 'w-0 group-hover:w-[calc(100%-48px)]'
                    }`}></span>
                  </Link>
                );
              })}
              <div className="flex-1" />
              <button
                onMouseEnter={() => { setShowMegaMenu(true); setActiveMegaMenu('erbjudanden'); }}
                className="px-6 py-2 text-sm font-semibold text-black whitespace-nowrap relative group inline-flex items-center"
              >
                Erbjudanden
                <span className={`absolute bottom-0 left-6 h-0.5 bg-black transition-all duration-300 ${activeMegaMenu === 'erbjudanden' ? 'w-[calc(100%-48px)]' : 'w-0 group-hover:w-[calc(100%-48px)]'}`} />
              </button>
            </div>
          </div>
        </nav>

        {/* Mega Menu */}
        {showMegaMenu && activeMegaMenu && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white z-40 flex justify-center border-b border-l border-r border-gray-200">
            <div className="w-[1280px] px-6">
              <div className="py-8">
                {activeMegaMenu === 'erbjudanden' ? (
                  <div className="flex gap-8">
                    {/* Vänster — kategorilista */}
                    <div className="flex flex-col justify-between" style={{ minWidth: '180px' }}>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 invisible">placeholder</p>
                        <ul className="space-y-3">
                          {[
                            { label: 'Veckans deals', url: '/erbjudanden/veckans-deals' },
                            { label: 'Rea', url: '/erbjudanden/rea' },
                            { label: 'Paketpris', url: '/erbjudanden/paketpris' },
                            { label: 'Lagertömning', url: '/erbjudanden/lagertomning' },
                          ].map((item) => (
                            <li key={item.label}>
                              <Link href={item.url} className="text-sm font-medium text-gray-700 hover:text-black transition-colors relative group inline-flex">
                                {item.label}
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ease-out ${isPathActive(item.url) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t border-gray-200 pt-4 mt-6">
                        <Link href="/erbjudanden" className="text-sm font-bold text-black flex items-center gap-1 hover:gap-2 transition-all">
                          Se alla erbjudanden <span>→</span>
                        </Link>
                      </div>
                    </div>

                    {/* Mitten — banners */}
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Erbjudanden</p>
                      <div className="flex gap-3">
                        {ERBJUDANDEN_CAMPAIGNS.map((b) => (
                          <Link key={b.id} href={b.url} className={`group relative overflow-hidden rounded flex-1 flex items-end p-3 hover:opacity-90 transition-opacity ${b.bg}`} style={{ aspectRatio: '1/1' }}>
                            <div>
                              <p className="text-white font-bold text-sm">{b.title}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {getActiveCategory()?.items?.map((section) => (
                      <div key={section.id}>
                        <div className="mb-4 pb-4 border-b border-gray-200">
                          <div className="text-white flex-shrink-0 mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-black p-2">
                            {section.icon}
                          </div>
                          <Link href={section.url}>
                            <h3 className={`font-bold text-sm uppercase tracking-wide transition-colors cursor-pointer ${
                              isPathActive(section.url) ? 'text-black' : 'text-black hover:text-gray-600'
                            }`}>
                              {section.title}
                            </h3>
                          </Link>
                        </div>
                        <ul className="space-y-2">
                          {section.items && section.items.map((item) => (
                            <li key={item.id}>
                              <Link href={item.url} className="text-sm text-gray-700 hover:text-black transition-colors relative group inline-flex">
                                {item.title}
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ease-out ${isPathActive(item.url) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full h-px bg-gray-200 relative z-50"></div>
    </header>
  );
}
