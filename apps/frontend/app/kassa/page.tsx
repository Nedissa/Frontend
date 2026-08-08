'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '../components/layout/MainLayout';
import { InputWithCheck } from '../components/auth/InputWithCheck';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Spinner } from '../components/shared/Spinner';

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

// --- Sticky step bar (mobil) ---
function StickyStepBar({ steps, step }: { steps: { label: string; icon: React.ReactNode }[]; step: number }) {
  return (
    <div
      className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100"
      style={{ paddingTop: 'env(safe-area-inset-top)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center justify-center py-3 px-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex flex-col items-center gap-1 ${i <= step ? 'text-black' : 'text-gray-300'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${i === step ? 'text-white' : i < step ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`} style={i === step ? { background: '#ea580c' } : {}}>
                {s.icon}
              </div>
              <span className="text-[10px] font-semibold">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 mb-4 mx-1 ${i < step ? 'bg-black' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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
    sessionStorage.setItem('pendingOrder', JSON.stringify({ cartId, formData, total: finalTotal }));

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/order-bekraftelse',
        payment_method_data: {
          billing_details: {
            address: { country: 'SE' },
          },
        },
      },
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
      body: JSON.stringify({ cartId, formData, total: finalTotal }),
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
      <PaymentElement options={{ fields: { billingDetails: { address: { country: 'never' } } } }} />
      <div className="flex gap-3 mt-4">
        <button type="button" onClick={() => window.history.back()} className="flex-1 py-3 border border-gray-300 text-sm font-semibold text-gray-600 hover:text-black hover:border-black transition-colors">
          Avbryt köp
        </button>
        <button
          type="submit"
          disabled={processing || !stripe}
          className="flex-1 bg-black text-white py-3 font-semibold hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? 'Bearbetar...' : 'Slutför köp'}
        </button>
      </div>
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Stripe Elements state
  const [clientSecret, setClientSecret] = useState('');
  const [cartId, setCartId] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [medusaDiscountTotal, setMedusaDiscountTotal] = useState(0);

  const addressInputRef = useRef<HTMLInputElement>(null);
  const hasRestoredRef = useRef(false);
  const formDataRef = useRef(formData);
  const hasInitPaymentRef = useRef(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([null, null, null]);


  // Håll formDataRef synkad med formData
  useEffect(() => { formDataRef.current = formData; }, [formData]);

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
      const params = new URLSearchParams(window.location.search);
      if (params.get('quick') === '1') {
        const item: CartItem = {
          id: params.get('id') || '',
          variantId: params.get('variantId') || params.get('id') || '',
          title: params.get('title') || '',
          price: Number(params.get('price')) || 0,
          originalPrice: params.get('originalPrice') ? Number(params.get('originalPrice')) : undefined,
          quantity: Number(params.get('qty')) || 1,
          image: params.get('image') || undefined,
        };
        setCartItems([item]);
        setCartTotal(item.price * item.quantity);
        hasRestoredRef.current = true;
        return;
      }
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
      setMedusaDiscountTotal(data.discountTotal ?? 0);
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
  // Om frakt ändras efter att betalning initierats — skapa ny session med rätt belopp
  const prevShippingRef = useRef('');
  useEffect(() => {
    if (!cartItems.length || !shippingMethod || !formData.email) return;
    const shippingChanged = prevShippingRef.current && prevShippingRef.current !== shippingMethod;
    if (shippingChanged && hasInitPaymentRef.current) {
      hasInitPaymentRef.current = false;
      setShowPayment(false);
      setClientSecret('');
    }
    prevShippingRef.current = shippingMethod;
    if (!hasInitPaymentRef.current) {
      // Debounce 600ms så autofyll hinner fylla alla fält innan vi skickar till Medusa
      const t = setTimeout(() => initPayment(cartItems, shippingMethod), 600);
      return () => clearTimeout(t);
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
          const streetNumber = c.find((x: any) => x.types.includes('street_number'))?.long_name || '';
          const route = c.find((x: any) => x.types.includes('route'))?.long_name || '';
          const fullAddress = streetNumber ? `${route} ${streetNumber}` : `${route} `;
          setFormData(prev => ({
            ...prev,
            address: fullAddress,
            postalCode: c.find((x: any) => x.types.includes('postal_code'))?.long_name || '',
            city: c.find((x: any) => x.types.includes('postal_town'))?.long_name || c.find((x: any) => x.types.includes('locality'))?.long_name || '',
            country: selectedCountry,
          }));
          fetchShippingOptions(selectedCountry);
          // Sätt fokus tillbaka på adressfältet om husnummer saknas
          if (!streetNumber && addressInputRef.current) {
            setTimeout(() => {
              addressInputRef.current?.focus();
              const len = addressInputRef.current?.value.length || 0;
              addressInputRef.current?.setSelectionRange(len, len);
            }, 50);
          }
        });
      } catch {}
    };

    script.onload = () => (window as any).initGoogleMapsAutocomplete?.();
    document.head.appendChild(script);
    return () => { delete (window as any).initGoogleMapsAutocomplete; };
  }, [fetchShippingOptions]);

  const selectedShippingOption = shippingOptions.find(o => o.id === shippingMethod);
  const hasContactInfo = !!(formData.email && formData.firstName && formData.lastName && formData.address && formData.postalCode && formData.city);
  const hasPayment = showPayment && hasContactInfo && !!shippingMethod;
  const step = !hasContactInfo ? 1 : !shippingMethod ? 2 : hasPayment ? 3 : 2;
  const [desktopStep, setDesktopStep] = useState(-1);
  const prevStepRef = useRef(-1);
  useEffect(() => {
    const t = setTimeout(() => setDesktopStep(step), 200);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (prevStepRef.current !== -1 && step !== prevStepRef.current) {
      if (window.innerWidth < 640) {
        const sectionIndex = step - 1;
        const el = sectionRefs.current[sectionIndex];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    prevStepRef.current = step;
  }, [step]);
  const shippingCost = selectedShippingOption?.amount || 0;
  const totalDiscount = cartItems.reduce((s, i) => i.originalPrice ? s + (i.originalPrice - i.price) * i.quantity : s, 0);
  const finalTotal = cartTotal + shippingCost - medusaDiscountTotal;

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
      <style>{`
        @media(max-width:767px){.ml-container{padding-left:8px!important;padding-right:8px!important;}}
      `}</style>
      {/* Steg-indikator — endast mobil */}
      {(() => {
        const steps = [
          { label: 'Orderöversikt', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4"/></svg> },
          { label: 'Uppgifter', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
          { label: 'Frakt', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/></svg> },
          { label: 'Betalning', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path strokeLinecap="square" d="M2 10h20"/></svg> },
        ];
        return (
          <StickyStepBar steps={steps} step={step} />
        );
      })()}
      <div className="flex pt-[88px] sm:pt-4 lg:pt-12 pb-16 gap-0 relative justify-center">

          <div className="flex-1 max-w-[800px] flex flex-col gap-8 relative">

          {/* Orderöversikt */}
          <section className="bg-white relative" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <span className="hidden lg:block absolute top-0 whitespace-nowrap" style={{ right: 'calc(100% + 24px)', boxShadow: '0 14px 0 white, 0 -14px 0 white', zIndex: 1 }}><span className="text-xs font-semibold uppercase tracking-wider p-2 block" style={{ background: '#000', color: '#fff', boxShadow: '0 0 0 2px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.2)', transition: 'background 300ms ease' }}>Orderöversikt</span></span>
            <span className="hidden lg:block absolute w-0.5 bg-black pointer-events-none" style={{ right: 'calc(100% + 24px)', top: '32px', bottom: '-100px' }} />
            <div className="grid grid-cols-[1fr_80px_64px] sm:grid-cols-[1fr_160px_120px] px-2 sm:px-6 py-3 border-b border-gray-200 gap-3">
              <div className="flex items-center">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500">Produkter</span>
              </div>
              <div className="flex justify-center"><span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500">Antal</span></div>
              <div className="flex justify-end"><span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500">Pris</span></div>
            </div>
            <div className="divide-y divide-gray-100">
              {cartItems.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr_80px_64px] sm:grid-cols-[1fr_160px_120px] items-center px-2 sm:px-6 py-4 gap-3">
                  <div className="flex gap-4 sm:gap-6 items-center min-w-0">
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-10 h-10 sm:w-24 sm:h-24 object-contain" />
                      ) : (
                        <div className="w-[52px] h-[52px] sm:w-24 sm:h-24" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug truncate">{item.title}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <svg className="w-2 h-2 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                        <span className="text-xs text-gray-500">I lager</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        const updated = cartItems.map(i => i.id === item.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i);
                        setCartItems(updated);
                        setCartTotal(updated.reduce((s, i) => s + i.price * i.quantity, 0));
                        localStorage.setItem('cartItems', JSON.stringify(updated));
                      }}
                      className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-gray-100 text-lg font-medium rounded"
                    >−</button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => {
                        const updated = cartItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
                        setCartItems(updated);
                        setCartTotal(updated.reduce((s, i) => s + i.price * i.quantity, 0));
                        localStorage.setItem('cartItems', JSON.stringify(updated));
                      }}
                      className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-gray-100 text-lg font-medium rounded"
                    >+</button>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">{(item.price * item.quantity).toLocaleString('sv-SE')} kr</p>
                    {item.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">{(item.originalPrice * item.quantity).toLocaleString('sv-SE')} kr</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 sm:px-6 py-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Antal artiklar</span>
                <span className="font-semibold">{cartItems.reduce((s, i) => s + i.quantity, 0)} st</span>
              </div>
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
              {medusaDiscountTotal > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Välkomstrabatt (10%)</span>
                  <span className="font-semibold">-{Math.round(medusaDiscountTotal).toLocaleString('sv-SE')} kr</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frakt</span>
                <span className="font-semibold">{shippingCost === 0 ? 'Gratis' : `${shippingCost.toLocaleString('sv-SE')} kr`}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-4 mt-2 border-t border-gray-200">
                <span>Totalt</span>
                <span>{(finalTotal || cartTotal).toLocaleString('sv-SE')} kr</span>
              </div>
            </div>
          </section>

          <div className="w-full">
              <div className="flex gap-0 mb-4 border-b border-gray-200">
                <button
                  onClick={() => setCustomerType('private')}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${customerType === 'private' ? 'border-black text-black' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" /></svg>
                  Privatperson
                </button>
                <button
                  onClick={() => setCustomerType('business')}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${customerType === 'business' ? 'border-black text-black' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
                  Företag
                </button>
              </div>

              <div className="bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <section ref={el => { sectionRefs.current[0] = el; }} className="relative p-6 border-b border-gray-100">
                  <span className="hidden lg:block absolute top-0 whitespace-nowrap" style={{ right: 'calc(100% + 24px)', boxShadow: '0 14px 0 white, 0 -14px 0 white', zIndex: 1 }}><span className="text-xs font-semibold uppercase tracking-wider p-2 block" style={{ background: step === 1 ? '#ea580c' : step > 1 ? '#000' : '#d1d5db', color: '#fff', transition: 'background 300ms ease', boxShadow: step >= 1 ? '0 0 0 2px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.2)' : 'none' }}>Dina uppgifter</span></span>
                  <span className="hidden lg:block absolute w-0.5 pointer-events-none" style={{ right: 'calc(100% + 24px)', top: '32px', bottom: '-14px', background: desktopStep >= 2 ? '#000' : '#d1d5db', transition: 'background 600ms ease' }} />
                  <h2 className="text-2xl font-bold mb-6"><span className="text-black">Leveransadress</span></h2>
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
                        <InputWithCheck type="tel" name="phone" placeholder="" value={formData.phone} onChange={handleInputChange} required autoComplete="tel" inputMode="tel" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Adress</label>
                      <InputWithCheck type="text" name="address" placeholder="" value={formData.address} onChange={handleInputChange} required ref={addressInputRef} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Postnummer</label>
                        <InputWithCheck type="text" name="postalCode" placeholder="" value={formData.postalCode} onChange={handleInputChange} required inputMode="numeric" autoComplete="postal-code" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Stad</label>
                        <InputWithCheck type="text" name="city" placeholder="" value={formData.city} onChange={handleInputChange} required style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                      </div>
                    </div>
                  </div>
                </section>

                <section ref={el => { sectionRefs.current[1] = el; }} className="relative p-6 border-b border-gray-100">
                  <span className="hidden lg:block absolute top-0 whitespace-nowrap" style={{ right: 'calc(100% + 24px)', boxShadow: '0 14px 0 white, 0 -14px 0 white', zIndex: 1 }}><span className="text-xs font-semibold uppercase tracking-wider p-2 block" style={{ background: step === 2 ? '#ea580c' : step > 2 ? '#000' : '#d1d5db', color: '#fff', transition: 'background 300ms ease', boxShadow: step >= 2 ? '0 0 0 2px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.2)' : 'none' }}>Fraktsätt</span></span>
                  <span className="hidden lg:block absolute w-0.5 pointer-events-none" style={{ right: 'calc(100% + 24px)', top: '32px', bottom: '-14px', background: desktopStep >= 3 ? '#000' : '#d1d5db', transition: 'background 600ms ease' }} />
                  <h2 className="text-2xl font-bold mb-6"><span className="text-black">Frakt</span></h2>
                  <div className="space-y-3">
                    {loadingShipping ? (
                      <div className="flex items-center gap-2 text-gray-400 text-sm"><Spinner size={16} /> Hämtar fraktalternativ...</div>
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

                <section ref={el => { sectionRefs.current[2] = el; }} className="relative p-6">
                  <span className="hidden lg:block absolute top-0 whitespace-nowrap" style={{ right: 'calc(100% + 24px)', boxShadow: '0 14px 0 white, 0 -14px 0 white', zIndex: 1 }}><span className="text-xs font-semibold uppercase tracking-wider p-2 block" style={{ background: step === 3 ? '#ea580c' : step > 3 ? '#000' : '#d1d5db', color: '#fff', transition: 'background 300ms ease', boxShadow: step >= 3 ? '0 0 0 2px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.2)' : 'none' }}>Betalsätt</span></span>
                  <span className="hidden lg:block absolute w-0.5 pointer-events-none" style={{ right: 'calc(100% + 24px)', top: '32px', bottom: '0', background: desktopStep >= 3 ? '#000' : '#d1d5db', transition: 'background 600ms ease' }} />
                  <h2 className="text-2xl font-bold mb-4"><span className="text-black">Betalning</span></h2>
                  {!clientSecret && !isProcessing && (
                    <p className="text-sm text-gray-400 mb-4">Fyll i dina kontaktuppgifter ovan så visas betalningsalternativen här.</p>
                  )}
                  {paymentError && <p className="text-red-600 text-sm mb-4">{paymentError}</p>}
                  {isProcessing && !clientSecret && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4"><Spinner size={16} /> Förbereder betalning...</div>
                  )}
                  {showPayment && clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#000000' } } }}>
                      <PaymentForm cartId={cartId} formData={formData} finalTotal={finalTotal} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
                    </Elements>
                  )}
                  {!showPayment && (
                    <div className="text-center pt-4">
                      <a href="/" className="text-sm text-gray-500 hover:text-black">Avbryt</a>
                    </div>
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
    <Suspense fallback={<div className="p-12 flex justify-center"><Spinner size={24} /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
