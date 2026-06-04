'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { MAIN_CATEGORIES } from '@/app/lib/products';

interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const handleAddToCart = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { id, title, price, originalPrice, quantity } = customEvent.detail;
      const priceNum = typeof price === 'string' ? parseInt(price) : price;
      const originalPriceNum = originalPrice ? (typeof originalPrice === 'string' ? parseInt(originalPrice) : originalPrice) : undefined;

      setCartItems(prev => {
        const existingItem = prev.find(item => item.id === id);
        if (existingItem) {
          return prev.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + (quantity || 1) } : item
          );
        }
        return [...prev, { id, title, price: priceNum, originalPrice: originalPriceNum, quantity: quantity || 1 }];
      });
    };

    window.addEventListener('addToCart', handleAddToCart);
    return () => window.removeEventListener('addToCart', handleAddToCart);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const totalDiscount = cartItems.reduce((total, item) => {
    if (item.originalPrice) {
      return total + ((item.originalPrice - item.price) * item.quantity);
    }
    return total;
  }, 0);
  const total = subtotal + shipping;

  return (
    <MainLayout bordered={false}>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8">Din varukorg</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-4xl font-bold mb-4">Din varukorg är tom</h2>
            <p className="text-gray-600 mb-12">Inte säker på var du ska börja?<br />Prova dessa kategorier:</p>

            <div className="space-y-3 max-w-md mx-auto">
              {Object.entries(MAIN_CATEGORIES).map(([slug, title]) => (
                <Link key={slug} href={`/kategori/${slug}`} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded">
                  <span className="text-lg font-medium text-gray-900">{title}</span>
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4 border-b border-gray-200 pb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-4">
                    {/* Product image placeholder */}
                    <div className="col-span-2">
                      <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        Bild
                      </div>
                    </div>

                    {/* Product title */}
                    <div className="col-span-4 min-w-0">
                      <Link
                        href={`/produkter/${item.id}`}
                        className="text-gray-900 font-semibold text-sm hover:text-gray-700 block"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-1 mt-2">
                        <svg className="w-2 h-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="10" cy="10" r="10" />
                        </svg>
                        <span className="text-xs text-gray-600">I lager</span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="col-span-3 flex justify-center">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-gray-700 disabled:text-gray-300 hover:text-gray-900 text-base font-bold"
                        >
                          −
                        </button>
                        <span className="text-gray-900 text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-700 hover:text-gray-900 text-sm font-medium"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price and remove */}
                    <div className="col-span-3 flex flex-col items-end gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {(item.price * item.quantity).toLocaleString('sv-SE')} SEK
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m3 0V4a1 1 0 011-1h6a1 1 0 011 1v3m-6 4v6m4-6v6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-8">
                <Link href="/produkter" className="text-gray-600 hover:text-gray-900 font-semibold">
                  ← Fortsätt handla
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="p-6 border border-gray-200 sticky top-20">
                <h2 className="text-xl font-bold mb-6">Orderöversikt</h2>

                {/* Summary Lines */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delsumma</span>
                    <span className="text-gray-900 font-medium">{subtotal.toLocaleString('sv-SE')} SEK</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Rabatt</span>
                      <span className="text-green-600 font-semibold">-{totalDiscount.toLocaleString('sv-SE')} SEK</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frakt</span>
                    <span className="text-gray-900 font-medium">Gratis</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-8">
                  <div className="flex justify-between items-center text-base font-bold">
                    <span>Totalt</span>
                    <span className="text-lg">{total.toLocaleString('sv-SE')} SEK</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/kassan">
                  <button className="w-full bg-green-600 text-white py-3 font-bold hover:bg-green-700 mb-4">
                    Till kassan
                  </button>
                </Link>

                {/* Continue Shopping */}
                <Link href="/">
                  <button className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-800">
                    Fortsätt handla
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
