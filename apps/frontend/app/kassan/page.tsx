'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '../components/MainLayout';
import { InputWithCheck } from '../components/InputWithCheck';

interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
}

const countryCodeMap: Record<string, string> = {
  'Sverige': 'se',
  'Norge': 'no',
  'Danmark': 'dk',
  'Finland': 'fi'
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFromStripe = searchParams.get('from') === 'stripe';

  // Always start empty to match server render (avoids hydration mismatch)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [customerType, setCustomerType] = useState<'private' | 'business'>('private');
  const [isHydrated, setIsHydrated] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'Sverige',
    companyName: '',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const WELCOME_DISCOUNT = 0.10;
  const addressInputRef = useRef<HTMLInputElement>(null);

  const fetchShippingOptions = useCallback(async (country: string) => {
    setLoadingShipping(true);
    try {
      const countryCode = countryCodeMap[country] || country.toLowerCase();
      const response = await fetch(`/api/shipping-options?country=${countryCode}`);
      const data = await response.json();
      if (data.shipping_options) {
        setShippingOptions(data.shipping_options);
        setShippingMethod(data.shipping_options[0]?.id || 'standard');
      }
    } catch (error) {
      console.error('Failed to fetch shipping options:', error);
      setShippingOptions([]);
    } finally {
      setLoadingShipping(false);
    }
  }, []);

  // Store whether we've restored checkout data to prevent other effects from clearing it
  const hasRestoredCheckoutDataRef = useRef(false);

  // Use useLayoutEffect to restore data BEFORE the browser paints
  // This runs EVERY time the component mounts, ensuring we always try to restore
  useLayoutEffect(() => {
    try {
      // Always load cart from cartItems (source of truth)
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        const items = JSON.parse(savedCartItems);
        if (items.length > 0) {
          setCartItems(items);
          const total = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
          setCartTotal(total);
          hasRestoredCheckoutDataRef.current = true;
        }
      }

      // Restore form data and shipping from checkoutData if available
      const checkoutData = localStorage.getItem('checkoutData') || sessionStorage.getItem('checkoutData');
      if (checkoutData) {
        const data = JSON.parse(checkoutData);
        if (data.formData) setFormData(data.formData);
        if (data.shippingMethod) setShippingMethod(data.shippingMethod);
      }
    } catch (e) {
      console.error('[KASSAN-RESTORE] Error restoring checkout data:', e);
    }
  }, []);

  // Handle Stripe return by replacing history
  useEffect(() => {
    if (isFromStripe) {
      window.history.replaceState({ kassan: true }, '', window.location.pathname);
    }
  }, [isFromStripe]);

  // Load shipping options after data restoration (only once)
  useEffect(() => {
    if (hasRestoredCheckoutDataRef.current && formData.country && shippingOptions.length === 0) {
      fetchShippingOptions(formData.country);
    }
  }, [formData.country, shippingOptions.length, fetchShippingOptions]);

  // Auto-save checkout data IMMEDIATELY when anything changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cartItems.length > 0) {
        const shippingCost = shippingOptions.find(opt => opt.id === shippingMethod)?.amount || 0;
        const checkoutState = {
          cartItems,
          formData,
          shippingMethod,
          shippingCost,
        };
        localStorage.setItem('checkoutData', JSON.stringify(checkoutState));
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutState));
      }
    }, 100); // Small delay to batch updates

    return () => clearTimeout(timer);
  }, [cartItems, formData, shippingMethod, shippingOptions]);

  // Restore data when user presses back button (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      const checkoutData = localStorage.getItem('checkoutData') || sessionStorage.getItem('checkoutData');
      if (checkoutData) {
        try {
          const data = JSON.parse(checkoutData);
          if (data.cartItems?.length > 0) {
            setCartItems(data.cartItems);
            const total = data.cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
            setCartTotal(total);
          }
          if (data.formData) {
            setFormData(data.formData);
          }
          if (data.shippingMethod) {
            setShippingMethod(data.shippingMethod);
          }
        } catch (e) {
          console.error('[KASSAN] Error restoring data on popstate:', e);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Load Google Maps Places API script once
    if ((window as any).google?.maps?.places) {
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = false;
    script.defer = true;

    (window as any).initGoogleMapsAutocomplete = () => {
      if (addressInputRef.current && (window as any).google?.maps?.places) {
        try {
          new (window as any).google.maps.places.Autocomplete(addressInputRef.current, {
            types: ['address'],
            componentRestrictions: { country: ['se', 'no', 'dk', 'fi'] }
          }).addListener('place_changed', function(this: any) {
            const place = this.getPlace();
            if (place.geometry && place.address_components) {
              const addressComponents = place.address_components;
              const address = place.formatted_address || addressInputRef.current!.value;
              const streetAddress = addressComponents.find((c: any) => c.types.includes('route'))?.long_name || '';
              const streetNumber = addressComponents.find((c: any) => c.types.includes('street_number'))?.long_name || '';
              const postalCode = addressComponents.find((c: any) => c.types.includes('postal_code'))?.long_name || '';
              const city = addressComponents.find((c: any) => c.types.includes('locality'))?.long_name || '';
              const countryCode = addressComponents.find((c: any) => c.types.includes('country'))?.short_name || '';

              const countryMap: Record<string, string> = {
                'SE': 'Sverige',
                'NO': 'Norge',
                'DK': 'Danmark',
                'FI': 'Finland'
              };

              const selectedCountry = countryMap[countryCode] || 'Sverige';

              setFormData(prev => ({
                ...prev,
                address: streetAddress + (streetNumber ? ' ' + streetNumber : ''),
                postalCode,
                city,
                country: selectedCountry
              }));

              if (selectedCountry !== formData.country) {
                fetchShippingOptions(selectedCountry);
              }
            }
          });
        } catch (error) {
          console.warn('Failed to initialize address autocomplete:', error);
        }
      }
    };

    script.onload = () => {
      (window as any).initGoogleMapsAutocomplete?.();
    };

    script.onerror = () => {
      console.warn('Google Maps API failed to load');
    };

    document.head.appendChild(script);

    return () => {
      delete (window as any).initGoogleMapsAutocomplete;
    };
  }, [fetchShippingOptions]);

  const loadCartData = useCallback(() => {
    try {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        const items = JSON.parse(savedCartItems);
        setCartItems(items);
        const total = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
      }
    } catch (error) {
      console.error('Failed to load cart items', error);
    }
  }, []);

  useEffect(() => {
    // Only load cart from cartItems if we didn't restore from checkoutData
    if (!hasRestoredCheckoutDataRef.current) {
      loadCartData();
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        const checkoutData = localStorage.getItem('checkoutData') || sessionStorage.getItem('checkoutData');
        if (checkoutData) {
          try {
            const data = JSON.parse(checkoutData);
            if (data.cartItems?.length > 0) {
              setCartItems(data.cartItems);
              const total = data.cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
              setCartTotal(total);
            }
            if (data.formData) {
              setFormData(data.formData);
            }
            if (data.shippingMethod) {
              setShippingMethod(data.shippingMethod);
            }
          } catch (e) {
            console.error('[KASSAN] Error restoring checkout data on pageshow:', e);
          }
        } else {
          loadCartData();
        }
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [loadCartData]);

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          const customer = data.customer;

          const addressResponse = await fetch('/api/auth/addresses');
          if (addressResponse.ok) {
            const addressData = await addressResponse.json();
            const addresses = addressData.addresses || [];

            setFormData(prev => ({
              ...prev,
              firstName: customer.first_name || '',
              lastName: customer.last_name || '',
              email: customer.email || '',
              phone: customer.phone || '',
              address: addresses[0]?.address_1 || '',
              postalCode: addresses[0]?.postal_code || '',
              city: addresses[0]?.city || '',
            }));

            if (addresses[0]?.city) {
              fetchShippingOptions('Sverige');
            }
          }

          // Check if first order
          const ordersResponse = await fetch('/api/orders');
          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            setIsFirstOrder((ordersData.orders || []).length === 0);
          }
        }
      } catch (error) {
        console.error('Failed to load customer data:', error);
      }
    };

    setIsHydrated(true);

    // If we restored checkout data from Stripe return, skip all other loading
    if (hasRestoredCheckoutDataRef.current) {
      return;
    }

    const quickCheckout = localStorage.getItem('quickCheckout');
    if (quickCheckout) {
      try {
        const item = JSON.parse(quickCheckout);
        const priceNum = typeof item.price === 'string' ? parseInt(item.price) : item.price;
        const originalPriceNum = item.originalPrice ? (typeof item.originalPrice === 'string' ? parseInt(item.originalPrice) : item.originalPrice) : undefined;
        setCartItems([{ id: item.id, title: item.title, price: priceNum, originalPrice: originalPriceNum, quantity: item.quantity }]);
        setCartTotal(priceNum * item.quantity);
        localStorage.removeItem('quickCheckout');
        fetchShippingOptions('Sverige');
        loadCustomerData();
        return;
      } catch (e) {
        localStorage.removeItem('quickCheckout');
      }
    }

    if (cartItems.length > 0) {
      loadCustomerData();
      return;
    }

    const savedCartItems = sessionStorage.getItem('cartItems');
    if (savedCartItems) {
      try {
        const items = JSON.parse(savedCartItems);
        setCartItems(items);
        const total = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
      } catch (e) {
        console.error('Failed to load cart items from sessionStorage', e);
      }
    }

    fetchShippingOptions('Sverige');
    loadCustomerData();

    const handleAddToCart = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { id, title, price, originalPrice, quantity, image } = customEvent.detail;
      const priceNum = typeof price === 'string' ? parseInt(price) : price;
      const originalPriceNum = originalPrice ? (typeof originalPrice === 'string' ? parseInt(originalPrice) : originalPrice) : undefined;

      setCartItems(prev => {
        const existingItem = prev.find(item => item.id === id);
        if (existingItem) {
          return prev.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + (quantity || 1) } : item
          );
        }
        return [...prev, { id, title, price: priceNum, originalPrice: originalPriceNum, quantity: quantity || 1, image }];
      });

      setCartTotal(prev => prev + (priceNum * (quantity || 1)));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCustomerData();
      }
    };

    window.addEventListener('addToCart', handleAddToCart);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('addToCart', handleAddToCart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchShippingOptions, cartItems.length]);

  const selectedShippingOption = shippingOptions.find(opt => opt.id === shippingMethod);
  const shippingCost = selectedShippingOption?.amount || 0;
  const totalDiscount = cartItems.reduce((total, item) => {
    if (item.originalPrice) {
      return total + ((item.originalPrice - item.price) * item.quantity);
    }
    return total;
  }, 0);
  const welcomeDiscount = isFirstOrder ? Math.round(cartTotal * WELCOME_DISCOUNT) : 0;
  const finalTotal = cartTotal + shippingCost - welcomeDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const checkoutState = {
        cartItems,
        formData,
        shippingMethod,
        shippingCost,
      };
      localStorage.setItem('checkoutData', JSON.stringify(checkoutState));
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutState));

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          total: finalTotal,
          formData,
          shippingCost,
          shippingName: selectedShippingOption?.name || 'Frakt',
          welcomeDiscount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API error details:', data);
        throw new Error(data.details || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Checkout error:', errorMsg);
      setIsProcessing(false);
      alert('Det gick inte att starta checkout. Försök igen senare.');
    }
  };

  return (
    <MainLayout bordered={false}>
      <div className="flex justify-center pt-12 pb-16">
      <div className="w-full max-w-[800px] flex flex-col gap-12">
        {/* Cart Items Section */}
        <section className="bg-white p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 className="text-xl font-bold mb-4">Orderöversikt</h2>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-3 items-center p-3 border-b border-gray-200 last:border-b-0">
                <div className="flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Bild</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h3>
                  <p className="text-xs text-gray-600">Antal: {item.quantity}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    {(item.price * item.quantity).toLocaleString('sv-SE')} kr
                  </p>
                  {item.originalPrice && (
                    <p className="text-xs text-gray-400 line-through">
                      {(item.originalPrice * item.quantity).toLocaleString('sv-SE')} kr
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delsumma</span>
              <span className="font-semibold">{cartTotal.toLocaleString('sv-SE')} kr</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Rabatt</span>
                <span className="font-semibold">-{totalDiscount.toLocaleString('sv-SE')} kr</span>
              </div>
            )}
            {welcomeDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Välkomstrabatt (10%)</span>
                <span className="font-semibold">-{welcomeDiscount.toLocaleString('sv-SE')} kr</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frakt</span>
              <span className="font-semibold">
                {(shippingCost || 0) === 0 ? 'Gratis' : `${(shippingCost || 0).toLocaleString('sv-SE')} kr`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
              <span>Totalt</span>
              <span>{(finalTotal || cartTotal).toLocaleString('sv-SE')} kr</span>
            </div>
          </div>
        </section>

        <div className="w-full">
          <div className="flex gap-0 mb-4 border-b border-gray-200">
            <button
              onClick={() => setCustomerType('private')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                customerType === 'private'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Privatperson
            </button>
            <button
              onClick={() => setCustomerType('business')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                customerType === 'business'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Företag
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 space-y-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <section>
              <h2 className="text-2xl font-bold mb-6">Leveransadress</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Förnamn</label>
                    <InputWithCheck
                      type="text"
                      name="firstName"
                      placeholder=""
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Efternamn</label>
                    <InputWithCheck
                      type="text"
                      name="lastName"
                      placeholder=""
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                </div>

                {customerType === 'business' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Företagsnamn</label>
                    <InputWithCheck
                      type="text"
                      name="companyName"
                      placeholder=""
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">E-postadress</label>
                    <InputWithCheck
                      type="email"
                      name="email"
                      placeholder=""
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Telefonnummer</label>
                    <InputWithCheck
                      type="tel"
                      name="phone"
                      placeholder=""
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      ref={addressInputRef}
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Gata och husnummer</label>
                  <InputWithCheck
                    type="text"
                    name="address"
                    placeholder=""
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Postnummer</label>
                    <InputWithCheck
                      type="text"
                      name="postalCode"
                      placeholder=""
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Stad</label>
                    <InputWithCheck
                      type="text"
                      name="city"
                      placeholder=""
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                </div>

              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Frakt</h2>
              <div className="space-y-3">
                {loadingShipping ? (
                  <p className="text-gray-600">Laddar frakt alternativ...</p>
                ) : shippingOptions.length > 0 ? (
                  shippingOptions.map(option => (
                    <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={option.id}
                        checked={shippingMethod === option.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{option.name}</p>
                        <p className="text-sm text-gray-600">{option.description || ''}</p>
                      </div>
                      <p className="font-semibold text-gray-900">{(option.amount || 0).toLocaleString('sv-SE')} kr</p>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-600">Inga fraktöversättningar tillgängliga</p>
                )}
              </div>
            </section>

            <button
              type="submit"
              disabled={isProcessing || cartItems.length === 0}
              className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Bearbetar...' : 'Slutför köp'}
            </button>
          </form>
        </div>
      </div>
      </div>
    </MainLayout>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="p-12">Laddar...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
