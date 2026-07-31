'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Aside, useAside } from './Aside';
import { MAIN_CATEGORIES } from '@/app/lib/products';

interface CartItem {
  id: string;
  variantId?: string;
  title: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
}

export function CartAside() {
  const { close } = useAside();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSharedCart, setIsSharedCart] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const WELCOME_DISCOUNT = 0.10;

  const loadCartFromStorage = () => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      try {
        const items = JSON.parse(savedCartItems);
        setCartItems(items);
        const total = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
      } catch (e) {
        console.error('Failed to load cart items from localStorage', e);
      }
    }
  };

  useEffect(() => {
    // Load from localStorage on mount
    loadCartFromStorage();
    setIsHydrated(true);
    setIsSharedCart(!!sessionStorage.getItem('sharedCart'));

    // Check if first order
    fetch('/api/orders').then(res => {
      if (res.ok) res.json().then(data => {
        setIsFirstOrder((data.orders || []).length === 0);
      });
    }).catch(() => {});

    // Also listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartItems') {
        loadCartFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handleCartCleared = () => { setCartItems([]); setIsSharedCart(false); sessionStorage.removeItem('sharedCart'); };
    window.addEventListener('cartCleared', handleCartCleared);

    const handleCartReplace = () => {
      loadCartFromStorage();
      setTimeout(() => setIsSharedCart(!!sessionStorage.getItem('sharedCart')), 100);
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const count = items.reduce((s: number, i: any) => s + i.quantity, 0);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count } }));
    };
    window.addEventListener('cartReplaced', handleCartReplace);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartCleared', handleCartCleared);
      window.removeEventListener('cartReplaced', handleCartReplace);
    };
  }, []);

  useEffect(() => {
    // Update total when cartItems changes
    if (isHydrated) {
      const total = cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      setCartTotal(total);
    }
  }, [cartItems, isHydrated]);

  useEffect(() => {
    const handleAddToCart = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { id, title, price, originalPrice, quantity, image, variantId } = customEvent.detail;
      const priceNum = typeof price === 'string' ? parseInt(price) : price;
      const originalPriceNum = originalPrice ? (typeof originalPrice === 'string' ? parseInt(originalPrice) : originalPrice) : undefined;

      setCartItems(prev => {
        const existingItem = prev.find(item => item.id === id);
        let updated;
        if (existingItem) {
          updated = prev.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + (quantity || 1), variantId: item.variantId || variantId || '' } : item
          );
        } else {
          updated = [...prev, { id, title, price: priceNum, originalPrice: originalPriceNum, quantity: quantity || 1, image, variantId: variantId || '' }];
        }
        localStorage.setItem('cartItems', JSON.stringify(updated));
        sessionStorage.setItem('cartItems', JSON.stringify(updated));
        return updated;
      });

      setCartTotal(prev => prev + (priceNum * (quantity || 1)));

      // Notify header of cart update - read from localStorage to get latest count
      setTimeout(() => {
        const savedCartItems = localStorage.getItem('cartItems');
        const items = savedCartItems ? JSON.parse(savedCartItems) : [];
        const newTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const totalItems = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { totalAmount: newTotal, itemCount: totalItems }
        }));
      }, 0);
    };

    window.addEventListener('addToCart', handleAddToCart);
    return () => window.removeEventListener('addToCart', handleAddToCart);
  }, []);

  const calculateTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.originalPrice) {
        const discountPerItem = item.originalPrice - item.price;
        return total + (discountPerItem * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleRemoveItem = (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      const newTotal = cartTotal - (item.price * item.quantity);
      const updated = cartItems.filter(i => i.id !== id);
      const totalItems = updated.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartTotal(newTotal);
      setCartItems(updated);
      localStorage.setItem('cartItems', JSON.stringify(updated));
      sessionStorage.setItem('cartItems', JSON.stringify(updated));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { totalAmount: newTotal, itemCount: totalItems }
        }));
      }, 0);
    }
  };


  const handleClearCart = () => {
    localStorage.removeItem('cartItems');
    sessionStorage.removeItem('cartItems');
    setCartItems([]);
    setCartTotal(0);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { totalAmount: 0, itemCount: 0 }
      }));
      window.dispatchEvent(new CustomEvent('cartCleared'));
    }, 0);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    const item = cartItems.find(i => i.id === id);
    if (item) {
      const diff = newQuantity - item.quantity;
      const newTotal = cartTotal + (item.price * diff);
      const updated = cartItems.map(i => (i.id === id ? { ...i, quantity: newQuantity } : i));
      const totalItems = updated.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartTotal(newTotal);
      setCartItems(updated);
      localStorage.setItem('cartItems', JSON.stringify(updated));
      sessionStorage.setItem('cartItems', JSON.stringify(updated));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { totalAmount: newTotal, itemCount: totalItems }
        }));
      }, 0);
    }
  };

  const handleShare = async () => {
    if (cartItems.length === 0) return;

    try {
      const res = await fetch('/api/shared-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) throw new Error();

      const url = `${window.location.origin}/varukorg/${data.id}`;

      if (navigator.share) {
        navigator.share({ title: 'Min varukorg på Techpilots', url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Länken har kopierats!');
      }
    } catch {
      alert('Kunde inte dela korgen, försök igen.');
    }
  };

  return (
    <Aside type="cart" heading={
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        Din varukorg
        {isSharedCart && (
          <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#000', color: '#fff', padding: '2px 7px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center' }}>
            delad
          </span>
        )}
      </span>
    }>
      <div className="flex flex-col h-full bg-white">
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8" style={{ display: cartItems.length > 0 ? 'none' : 'flex' }}>
            <p className="text-gray-600 text-sm mb-6 text-center">Inte säker på var du ska börja?<br />Prova dessa kategorier:</p>

            <div className="space-y-2 w-full">
              {Object.entries(MAIN_CATEGORIES).map(([slug, title]) => (
                <Link key={slug} href={`/kategori/${slug}`} onClick={close} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded">
                  <span className="text-sm font-medium text-gray-900">{title}</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            <button
              onClick={close}
              className="text-black hover:text-gray-700 text-sm font-semibold mt-6"
            >
              Fortsätt handla
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 flex flex-col" style={{ display: cartItems.length === 0 ? 'none' : 'flex' }}>
              <ul className="space-y-0 py-4 flex-1">
                {cartItems.map(item => (
                  <li key={item.id} className="border-b border-gray-200 last:border-b-0 py-4">
                    <div className="grid items-center" style={{ gridTemplateColumns: '56px 1fr auto auto', columnGap: '12px' }}>
                      {/* Bild */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />

                      {/* Titel + (I lager + räknare på samma rad) */}
                      <div className="min-w-0">
                        <Link href={`/produkter/${item.id}`} className="text-gray-900 font-semibold text-sm hover:text-gray-700 leading-snug block truncate" style={{ textTransform: 'capitalize' }} title={item.title}>
                          {item.title.toLowerCase()}
                        </Link>
                        <div className="flex items-center flex-nowrap">
                          <div className="flex items-center gap-1">
                            <svg className="w-2 h-2 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                            <span className="text-xs text-gray-500 whitespace-nowrap">I lager</span>
                          </div>
                          <div className="flex items-center ml-16 sm:ml-28">
                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="text-gray-700 disabled:text-gray-300 font-bold w-11 h-11 flex items-center justify-center text-lg">−</button>
                            <span className="text-sm font-semibold tabular-nums w-5 text-center">{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="text-gray-700 font-bold w-11 h-11 flex items-center justify-center text-lg">+</button>
                          </div>
                        </div>
                      </div>

                      {/* Pris + ta bort */}
                      <div className="flex flex-col items-end gap-1" style={{ width: '72px' }}>
                        <span className="text-sm font-bold text-gray-900 tabular-nums whitespace-nowrap">
                          {(item.price * item.quantity).toLocaleString('sv-SE')} kr
                        </span>
                        <button onClick={() => handleRemoveItem(item.id)} className="w-11 h-11 flex items-center justify-center text-black hover:text-red-500 transition-colors" style={{ marginRight: '-8px' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-200 px-4 py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delsumma</span>
                  <span className="text-gray-900">{cartTotal.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frakt från</span>
                  <span className="text-gray-600">0 kr</span>
                </div>
                {calculateTotalDiscount() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Total rabatt</span>
                    <span className="text-green-600 font-semibold">-{calculateTotalDiscount().toLocaleString('sv-SE')} kr</span>
                  </div>
                )}
                {isFirstOrder && cartTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Välkomstrabatt (10%)</span>
                    <span className="text-green-600 font-semibold">-{Math.round(cartTotal * WELCOME_DISCOUNT).toLocaleString('sv-SE')} kr</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2">
                  <span className="text-gray-900">Summa</span>
                  <span className="text-gray-900">{isFirstOrder && cartTotal > 0 ? (cartTotal - Math.round(cartTotal * WELCOME_DISCOUNT)).toLocaleString('sv-SE') : cartTotal.toLocaleString('sv-SE')} kr</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={close}
                  className="flex-1 bg-black text-white py-3 text-sm font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  Fortsätt handla
                </button>
                <Link href="/kassa" onClick={close} className="flex-1 bg-green-600 text-white py-3 text-sm font-semibold hover:bg-green-700 flex items-center justify-center gap-2">
                  Till kassan
                </Link>
              </div>

              {/* Action buttons - Share, Print, Clear */}
              <div className="flex justify-around items-start pt-4 border-t border-gray-200">
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 text-gray-800 hover:text-black text-xs font-medium flex-1"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>
                  </svg>
                  Dela
                </button>
                <button
                  onClick={() => {
                    const printWindow = window.open('', '', 'height=800,width=1000');
                    if (printWindow) {
                      const today = new Date();
                      const dateStr = today.toISOString().split('T')[0];
                      const timeStr = today.toLocaleTimeString('sv-SE');

                      printWindow.document.write('<html><head><title>Din Varukorg</title>');
                      printWindow.document.write(`
                        <style>
                          * { margin: 0; padding: 0; box-sizing: border-box; }
                          body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            padding: 40px;
                            background: white;
                          }
                          .header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            margin-bottom: 40px;
                            border-bottom: 1px solid #ddd;
                            padding-bottom: 20px;
                          }
                          .logo {
                            font-size: 24px;
                            font-weight: bold;
                            color: #000;
                          }
                          .date {
                            font-size: 16px;
                            color: #333;
                          }
                          .title {
                            font-size: 20px;
                            font-weight: bold;
                            margin-bottom: 20px;
                          }
                          table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 30px;
                          }
                          th {
                            text-align: left;
                            padding: 12px 0;
                            border-bottom: 2px solid #333;
                            font-weight: 600;
                            font-size: 13px;
                          }
                          td {
                            padding: 15px 0;
                            border-bottom: 1px solid #ddd;
                            font-size: 14px;
                          }
                          .product-col { width: 50%; }
                          .sku-col { width: 20%; text-align: center; }
                          .qty-col { width: 15%; text-align: center; }
                          .price-col { width: 15%; text-align: right; }
                          .price-red { color: #d32f2f; font-weight: bold; }
                          .price-strikethrough { text-decoration: line-through; color: #999; }
                          .summary {
                            margin-top: 30px;
                            text-align: right;
                          }
                          .summary-row {
                            display: flex;
                            justify-content: flex-end;
                            margin-bottom: 8px;
                            font-size: 14px;
                          }
                          .summary-label {
                            margin-right: 40px;
                            min-width: 100px;
                          }
                          .summary-value {
                            min-width: 100px;
                            text-align: right;
                          }
                          .discount { color: #d32f2f; }
                          .total-row {
                            font-size: 18px;
                            font-weight: bold;
                            margin-top: 15px;
                            padding-top: 15px;
                            border-top: 2px solid #333;
                          }
                          .footer {
                            margin-top: 40px;
                            padding-top: 20px;
                            border-top: 1px solid #ddd;
                            font-size: 12px;
                            color: #666;
                          }
                          .footer-link { color: #0066cc; }
                        </style>
                      `);
                      printWindow.document.write('</head><body>');

                      printWindow.document.write(`
                        <div class="header">
                          <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="/logo.png" alt="Techpilots" style="width: 40px; height: 40px;">
                            <div class="logo">Techpilots</div>
                          </div>
                          <div class="date">Kundvagn - ${dateStr}</div>
                        </div>

                        <table>
                          <thead>
                            <tr>
                              <th style="width: 10%; text-align: center;">Bild</th>
                              <th style="width: 40%;">Produkt</th>
                              <th class="sku-col">Art.nr</th>
                              <th class="qty-col">Antal</th>
                              <th class="price-col">Pris</th>
                            </tr>
                          </thead>
                          <tbody>
                      `);

                      cartItems.forEach(item => {
                        const itemTotal = (item.price * item.quantity).toLocaleString('sv-SE');
                        const originalPriceStr = item.originalPrice ? `<div class="price-strikethrough">${item.originalPrice.toLocaleString('sv-SE')} kr</div>` : '';
                        const imageUrl = item.image || '';
                        printWindow.document.write(`
                          <tr>
                            <td style="width: 10%; text-align: center; padding-right: 20px;">
                              ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: contain;">` : ''}
                            </td>
                            <td style="width: 40%; padding-left: 20px;">${item.title}</td>
                            <td class="sku-col">-</td>
                            <td class="qty-col">${item.quantity}</td>
                            <td class="price-col">
                              <div class="price-red">${itemTotal} kr</div>
                              ${originalPriceStr}
                            </td>
                          </tr>
                        `);
                      });

                      printWindow.document.write('</tbody></table>');

                      const discount = calculateTotalDiscount();
                      const subtotal = cartTotal.toLocaleString('sv-SE');
                      const discountStr = discount > 0 ? `<div class="summary-row"><span class="summary-label">Rabatt</span><span class="summary-value discount">-${discount.toLocaleString('sv-SE')} kr</span></div>` : '';

                      printWindow.document.write(`
                        <div class="summary">
                          <div class="summary-row">
                            <span class="summary-label">Delsumma</span>
                            <span class="summary-value">${subtotal} kr</span>
                          </div>
                          ${discountStr}
                          <div class="summary-row">
                            <span class="summary-label">Frakt från</span>
                            <span class="summary-value">0 kr</span>
                          </div>
                          <div class="summary-row total-row">
                            <span class="summary-label">Summa</span>
                            <span class="summary-value">${subtotal} kr</span>
                          </div>
                        </div>

                        <div class="footer">
                          <div>Utskriven den ${dateStr} ${timeStr}</div>
                        </div>
                      `);

                      printWindow.document.write('</body></html>');
                      printWindow.document.close();
                      setTimeout(() => printWindow.print(), 250);
                    }
                  }}
                  className="flex flex-col items-center gap-1 text-gray-800 hover:text-black text-xs font-medium flex-1"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v3h12V3z"/>
                  </svg>
                  Skriv ut
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex flex-col items-center gap-1 text-gray-700 hover:text-red-600 text-xs font-medium flex-1"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/>
                  </svg>
                  Töm varukorg
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Aside>
  );
}
