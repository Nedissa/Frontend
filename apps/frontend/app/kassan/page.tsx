'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '../components/MainLayout';
import { InputWithCheck } from '../components/InputWithCheck';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface CartItem {
  id: string;
  variantId?: string;
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
  'Finland': 'fi',
};

// --- Stripe payment form ---
function PaymentForm({
  cartId,
  formData,
  finalTotal,
  onSuccess,
  onError,
}: {
  cartId: string;
  formData: any;
  finalTotal: number;
  onSuccess: (order: any) => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    // Spara data för redirect-flödet (3DS etc)
    sessionStorage.setItem('pendingOrder', JSON.stringify({ cartId, formData, total: finalTotal * 100 }));

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/order-bekraftelse' },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message || 'Betalningen misslyckades');
      setProcessing(false);
      return;
    }

    // Betalning godkänd utan redirect — komplettera ordern i Medusa
    const res = await fetch('/api/medusa-checkout/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId, formData, total: finalTotal * 100 }),
    });
    const data = await res.json();
    if (!res.ok) {
      onError(data.error || 'Kunde inte slutföra order');
      setProcessing(false);
      return;
    }

    onSuccess(data.order);
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={processing || !stripe}
        className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
      >
        {processing ? 'Bearbetar...' : 'Slutför köp'}
      </button>
    </form>
  );
}

// --- Main checkout ---
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Stripe Elements state
  const [clientSecret, setClientSecret] = useState('');
  const [cartId, setCartId] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const addressInputRef = useRef<HTMLInputElement>(null);
  const hasRestoredRef = useRef(false);
  const formDataRef = useRef(formData);
  const hasInitPaymentRef = useRef(false);

  // Refs för stepper-positionering
  const sectionRefs = useRef<(HTMLElement | null)[]>([null, null, null, null, null]);
  const contentColRef = useRef<HTMLDivElement>(null);
  const [dotTops, setDotTops] = useState<number[]>([]);

  useEffect(() => {
    const measure = () => {
      const containerTop = contentColRef.current?.getBoundingClientRect().top ?? 0;
      const tops = sectionRefs.current.map(el => {
        if (!el) return 0;
        return el.getBoundingClientRect().top - containerTop;
      });
      setDotTops(tops);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (contentColRef.current) observer.observe(contentColRef.current);
    sectionRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [cartItems, shippingOptions, clientSecret, isProcessing]);

  // Håll formDataRef synkad med formData
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  const WELCOME_DISCOUNT = 0.10;

  const fetchShippingOptions = useCallback(async (country: string) => {
    setLoadingShipping(true);
    try {
      const countryCode = countryCodeMap[country] || country.toLowerCase();
      const response = await fetch(`/api/shipping-options?country=${countryCode}`);
      const data = await response.json();
      if (data.shipping_options?.length) {
        setShippingOptions(data.shipping_options);
        setShippingMethod(data.shipping_options[0]?.id || '');
      }
    } catch {
      setShippingOptions([]);
    } finally {
      setLoadingShipping(false);
    }
  }, []);

  // Restore cart from localStorage
  useLayoutEffect(() => {
    try {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        const items = JSON.parse(savedCartItems);
        if (items.length > 0) {
          setCartItems(items);
          setCartTotal(items.reduce((s: number, i: CartItem) => s + i.price * i.quantity, 0));
          hasRestoredRef.current = true;
        }
      }
      const checkoutData = localStorage.getItem('checkoutData');
      if (checkoutData) {
        const data = JSON.parse(checkoutData);
        if (data.formData) setFormData(data.formData);
        if (data.shippingMethod) setShippingMethod(data.shippingMethod);
      }
    } catch {}
  }, []);

  // Skapa Medusa cart + hämta Stripe client secret automatiskt (körs bara en gång)
  const initPayment = useCallback(async (items: CartItem[], shipping: string) => {
    if (!items.length || !shipping || hasInitPaymentRef.current) return;
    hasInitPaymentRef.current = true;
    setIsProcessing(true);
    setPaymentError('');
    try {
      const res = await fetch('/api/medusa-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: items, formData: formDataRef.current, shippingOptionId: shipping }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPaymentError(data.error || 'Något gick fel');
        hasInitPaymentRef.current = false;
        return;
      }
      setClientSecret(data.clientSecret);
      setCartId(data.cartId);
      setShowPayment(true);
    } catch {
      setPaymentError('Kunde inte ansluta till betalningssystemet');
      hasInitPaymentRef.current = false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Load shipping after restore
  useEffect(() => {
    if (hasRestoredRef.current && shippingOptions.length === 0) {
      fetchShippingOptions(formData.country);
    }
  }, [formData.country, shippingOptions.length, fetchShippingOptions]);

  // Auto-initiera betalning när cart, shipping och e-post finns
  useEffect(() => {
    if (cartItems.length > 0 && shippingMethod && formData.email && !hasInitPaymentRef.current) {
      initPayment(cartItems, shippingMethod);
    }
  }, [cartItems, shippingMethod, formData.email, initPayment]);

  // Auto-save
  useEffect(() => {
    const t = setTimeout(() => {
      if (cartItems.length > 0) {
        localStorage.setItem('checkoutData', JSON.stringify({ cartItems, formData, shippingMethod }));
      }
    }, 100);
    return () => clearTimeout(t);
  }, [cartItems, formData, shippingMethod]);

  // Load customer data
  useEffect(() => {
    setIsHydrated(true);
    if (hasRestoredRef.current) return;

    const loadCustomer = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return;
        const { customer } = await res.json();
        const addrRes = await fetch('/api/auth/addresses');
        const addrData = addrRes.ok ? await addrRes.json() : {};
        const addresses = addrData.addresses || [];
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
        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setIsFirstOrder((ordData.orders || []).length === 0);
        }
      } catch {}
    };

    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        setCartTotal(items.reduce((s: number, i: CartItem) => s + i.price * i.quantity, 0));
      } catch {}
    }

    fetchShippingOptions('Sverige');
    loadCustomer();
  }, [fetchShippingOptions]);

  // Google Maps autocomplete
  useEffect(() => {
    if ((window as any).google?.maps?.places) return;
    if (document.querySelector('script[src*="maps.googleapis.com"]')) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = false;
    script.defer = true;

    (window as any).initGoogleMapsAutocomplete = () => {
      if (!addressInputRef.current || !(window as any).google?.maps?.places) return;
      try {
        new (window as any).google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: ['se', 'no', 'dk', 'fi'] },
        }).addListener('place_changed', function (this: any) {
          const place = this.getPlace();
          if (!place.geometry) return;
          const c = place.address_components;
          const countryMap: Record<string, string> = { SE: 'Sverige', NO: 'Norge', DK: 'Danmark', FI: 'Finland' };
          const selectedCountry = countryMap[c.find((x: any) => x.types.includes('country'))?.short_name || ''] || 'Sverige';
          setFormData(prev => ({
            ...prev,
            address: (c.find((x: any) => x.types.includes('route'))?.long_name || '') + ' ' + (c.find((x: any) => x.types.includes('street_number'))?.long_name || ''),
            postalCode: c.find((x: any) => x.types.includes('postal_code'))?.long_name || '',
            city: c.find((x: any) => x.types.includes('locality'))?.long_name || '',
            country: selectedCountry,
          }));
          fetchShippingOptions(selectedCountry);
        });
      } catch {}
    };

    script.onload = () => (window as any).initGoogleMapsAutocomplete?.();
    document.head.appendChild(script);
    return () => { delete (window as any).initGoogleMapsAutocomplete; };
  }, [fetchShippingOptions]);

  const selectedShippingOption = shippingOptions.find(o => o.id === shippingMethod);
  const shippingCost = selectedShippingOption?.amount || 0;
  const totalDiscount = cartItems.reduce((s, i) => i.originalPrice ? s + (i.originalPrice - i.price) * i.quantity : s, 0);
  const welcomeDiscount = isFirstOrder ? Math.round(cartTotal * WELCOME_DISCOUNT) : 0;
  const finalTotal = cartTotal + shippingCost - welcomeDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value };
      formDataRef.current = next;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePaymentSuccess = (order: any) => {
    localStorage.removeItem('cartItems');
    localStorage.removeItem('checkoutData');
    sessionStorage.removeItem('cartItems');
    sessionStorage.removeItem('checkoutData');
    window.dispatchEvent(new CustomEvent('cartCleared'));
    const orderId = order?.id || order?.display_id || '';
    router.push(`/order-bekraftelse?order_id=${orderId}`);
  };

  const handlePaymentError = (msg: string) => {
    setPaymentError(msg);
  };

  return (
    <MainLayout bordered={false} noPadding>
      <div className="flex justify-center py-5 border-b border-gray-100 mb-0">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Techpilots" className="w-12 h-12" />
          <span className="text-2xl font-bold tracking-tight">Techpilots</span>
        </a>
      </div>
      <div className="flex pt-6 pb-16 px-4 gap-0 relative justify-center">

          {/* Stepper — absolut positionerad mot sektionernas faktiska Y */}
          <div className="hidden lg:block pr-8 w-44 flex-shrink-0 relative">
            {(() => {
              const steps = [
                { label: 'Varukorg', done: true },
                { label: 'Dina uppgifter', done: !!formData.email },
                { label: 'Fraktsätt', done: !!shippingMethod },
                { label: 'Betalsätt', done: !!clientSecret },
                { label: 'Slutför köp', done: false },
              ];
              const tops = dotTops.length === steps.length ? dotTops : steps.map((_, i) => i * 80);
              return (
                <>
                  {/* Linje-segment per steg */}
                  {steps.slice(0, -1).map((step, i) => (
                    <div
                      key={`line-${i}`}
                      className={`absolute w-0.5 ${step.done ? 'bg-black' : 'bg-gray-200'}`}
                      style={{
                        right: 26,
                        top: tops[i] + 6,
                        height: Math.max(0, (tops[i + 1] ?? tops[i] + 60) - tops[i] - 6),
                      }}
                    />
                  ))}
                  {/* Prickar + labels */}
                  {steps.map((step, i) => (
                    <div
                      key={step.label}
                      className="absolute right-0 flex items-center gap-2"
                      style={{ top: tops[i] }}
                    >
                      <span className={`text-xs font-medium whitespace-nowrap ${step.done ? 'text-black' : 'text-gray-400'}`}>{step.label}</span>
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 border-2 mr-[20px] ${step.done ? 'bg-black border-black' : 'bg-white border-gray-300'}`} />
                    </div>
                  ))}
                </>
              );
            })()}
          </div>

          <div ref={contentColRef} className="flex-1 max-w-[800px] flex flex-col gap-8">

          {/* Orderöversikt */}
          <section ref={el => { sectionRefs.current[0] = el; }} className="bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 px-6 py-3 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Produkt</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Antal</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Pris</span>
            </div>
            <div className="divide-y divide-gray-100">
              {cartItems.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-x-6 items-center px-6 py-4">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="flex-shrink-0 bg-gray-50 rounded-lg p-1.5">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-12 h-12 object-contain" />
                      ) : (
                        <div className="w-12 h-12" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h3>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-700 font-medium">{item.quantity}</div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toLocaleString('sv-SE')} kr</p>
                    {item.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">{(item.originalPrice * item.quantity).toLocaleString('sv-SE')} kr</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 space-y-2">
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
                <span className="font-semibold">{shippingCost === 0 ? 'Gratis' : `${shippingCost.toLocaleString('sv-SE')} kr`}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-100">
                <span>Totalt</span>
                <span>{(finalTotal || cartTotal).toLocaleString('sv-SE')} kr</span>
              </div>
            </div>
          </section>

          <div className="w-full">
              <div className="flex gap-0 mb-4 border-b border-gray-200">
                <button
                  onClick={() => setCustomerType('private')}
                  className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${customerType === 'private' ? 'border-black text-black' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  Privatperson
                </button>
                <button
                  onClick={() => setCustomerType('business')}
                  className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${customerType === 'business' ? 'border-black text-black' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  Företag
                </button>
              </div>

              <div className="bg-white p-6 space-y-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <section ref={el => { sectionRefs.current[1] = el; }}>
                  <h2 className="text-2xl font-bold mb-6">Leveransadress</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Förnamn</label>
                        <InputWithCheck type="text" name="firstName" placeholder="" value={formData.firstName} onChange={handleInputChange} required style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Efternamn</label>
                        <InputWithCheck type="text" name="lastName" placeholder="" value={formData.lastName} onChange={handleInputChange} required style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                      </div>
                    </div>

                    {customerType === 'business' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Företagsnamn</label>
                        <InputWithCheck type="text" name="companyName" placeholder="" value={formData.companyName} onChange={handleInputChange} required style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">E-postadress</label>
                        <InputWithCheck type="email" name="email" placeholder="" value={formData.email} onChange={handleInputChange} required style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Telefonnummer</label>
                        <InputWithCheck type="tel" name="phone" placeholder="" value={formData.phone} onChange={handleInputChange} required ref={addressInputRef} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Gata och husnummer</label>
                      <InputWithCheck type="text" name="address" placeholder="" value={formData.address} onChange={handleInputChange} required style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Postnummer</label>
                        <InputWithCheck type="text" name="postalCode" placeholder="" value={formData.postalCode} onChange={handleInputChange} required style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Stad</label>
                        <InputWithCheck type="text" name="city" placeholder="" value={formData.city} onChange={handleInputChange} required style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                      </div>
                    </div>
                  </div>
                </section>

                <section ref={el => { sectionRefs.current[2] = el; }}>
                  <h2 className="text-2xl font-bold mb-6">Frakt</h2>
                  <div className="space-y-3">
                    {loadingShipping ? (
                      <p className="text-gray-600">Laddar fraktalternativ...</p>
                    ) : shippingOptions.length > 0 ? (
                      shippingOptions.map(option => (
                        <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                          <input type="radio" name="shippingMethod" value={option.id} checked={shippingMethod === option.id} onChange={e => setShippingMethod(e.target.value)} className="mr-3" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{option.name}</p>
                            <p className="text-sm text-gray-600">{option.description || ''}</p>
                          </div>
                          <p className="font-semibold text-gray-900">{option.amount === 0 ? 'Gratis' : `${option.amount.toLocaleString('sv-SE')} kr`}</p>
                        </label>
                      ))
                    ) : (
                      <p className="text-gray-600">Inga fraktalternativ tillgängliga</p>
                    )}
                  </div>
                </section>

                <section ref={el => { sectionRefs.current[3] = el; }}>
                  <h2 className="text-2xl font-bold mb-2">Betalning</h2>
                  {!clientSecret && !isProcessing && (
                    <p className="text-sm text-gray-400 mb-4">Fyll i dina kontaktuppgifter ovan så visas betalningsalternativen här.</p>
                  )}
                  {paymentError && <p className="text-red-600 text-sm mb-4">{paymentError}</p>}
                  {isProcessing && !clientSecret && (
                    <p className="text-gray-400 text-sm mb-4">Laddar betalningsalternativ...</p>
                  )}
                  {showPayment && clientSecret && (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#000000' } } }}
                    >
                      <PaymentForm cartId={cartId} formData={formData} finalTotal={finalTotal} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
                    </Elements>
                  )}
                </section>
              </div>
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
