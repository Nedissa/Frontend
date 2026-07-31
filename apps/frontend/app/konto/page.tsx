'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '../components/MainLayout';
import { ProductCard, type ProductData } from '@/app/components/ProductCard';
import { useKontoData } from './konto-context';

const orderStatusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Bearbetas' },
  processing: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Bearbetas' },
  shipped: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Skickad' },
  fulfilled: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Skickad' },
  delivered: { bg: 'bg-green-50', text: 'text-green-700', label: 'Levererad' },
  completed: { bg: 'bg-green-50', text: 'text-green-700', label: 'Levererad' },
  canceled: { bg: 'bg-red-50', text: 'text-red-700', label: 'Avbruten' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', label: 'Avbruten' },
  not_fulfilled: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Ej skickad' },
};

function getOrderStatusInfo(order: any) {
  const key = order.fulfillment_status || order.status;
  return orderStatusColors[key] || { bg: 'bg-gray-50', text: 'text-gray-700', label: key };
}

function getOrderTrackingNumber(order: any): string | null {
  const numbers = order.fulfillments?.flatMap((f: any) => f.tracking_numbers || []);
  return numbers && numbers.length > 0 ? numbers[0] : null;
}

export default function AccountPage() {
  const router = useRouter();
  const kontoData = useKontoData();

  const firstAddress = kontoData?.addresses?.[0];

  const [firstName, setFirstName] = useState(kontoData?.profile?.firstName || '');
  const [lastName, setLastName] = useState(kontoData?.profile?.lastName || '');
  const [registerEmail, setRegisterEmail] = useState(kontoData?.profile?.email || '');
  const [phone, setPhone] = useState(kontoData?.profile?.phone || '');
  const [address, setAddress] = useState(firstAddress?.address_1 || '');
  const [postalCode, setPostalCode] = useState(firstAddress?.postal_code || '');
  const [city, setCity] = useState(firstAddress?.city || '');
  const [addressPhone, setAddressPhone] = useState(firstAddress?.phone || '');
  const [activeTab, setActiveTab] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editFirstName, setEditFirstName] = useState(kontoData?.profile?.firstName || '');
  const [editLastName, setEditLastName] = useState(kontoData?.profile?.lastName || '');
  const [editEmail, setEditEmail] = useState(kontoData?.profile?.email || '');
  const [editPhone, setEditPhone] = useState(kontoData?.profile?.phone || '');
  const [editAddress, setEditAddress] = useState(firstAddress?.address_1 || '');
  const [editPostalCode, setEditPostalCode] = useState(firstAddress?.postal_code || '');
  const [editCity, setEditCity] = useState(firstAddress?.city || '');
  const [editAddressPhone, setEditAddressPhone] = useState(firstAddress?.phone || '');
  const [currentAddressId, setCurrentAddressId] = useState<string | null>(firstAddress?.id || null);
  const [addresses, setAddresses] = useState<any[]>(kontoData?.addresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [favoriteProducts, setFavoriteProducts] = useState<ProductData[]>(kontoData?.favoriteProducts || []);
  const [complaints, setComplaints] = useState<any[]>(kontoData?.complaints || []);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [loyalty, setLoyalty] = useState<any>(kontoData?.loyalty || null);
  const [orders, setOrders] = useState<any[]>(kontoData?.orders || []);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loadingComplaintsError, setLoadingComplaintsError] = useState('');
  const [loadingLoyaltyError, setLoadingLoyaltyError] = useState('');
  const [loadingOrdersError, setLoadingOrdersError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(true);
  const [complaintOrderId, setComplaintOrderId] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Check if all required fields are filled
  const isFormComplete = !!(editFirstName && editLastName && editEmail && editAddress && editPostalCode && editCity);

  const hasChanges = editFirstName !== firstName ||
    editLastName !== lastName ||
    editEmail !== registerEmail ||
    editPhone !== phone ||
    editAddress !== address ||
    editPostalCode !== postalCode ||
    editCity !== city ||
    editAddressPhone !== addressPhone ||
    !!(currentPassword || newPassword || confirmPassword);


  useEffect(() => {
    setIsHydrated(true);

    // Desktop: återställ senast aktiva tab, mobil: alltid stängt vid besök
    const savedTab = localStorage.getItem('accountTab');
    if (window.innerWidth >= 768) {
      setActiveTab(savedTab || 'profil');
    } else {
    }

    // Load favorites from localStorage if not already loaded from server
    if (favoriteProducts.length === 0) {
      const localFavorites = JSON.parse(localStorage.getItem('favoritesList') || '[]');
      if (localFavorites.length > 0) {
        setFavoriteProducts(localFavorites);
      }
    }
  }, []);

  useEffect(() => {
    const customerId = kontoData?.profile?.id;
    if (!customerId) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/complaints`);
        if (res.ok) {
          const data = await res.json();
          setComplaints(data.complaints || []);
        }
      } catch {}
    };

    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [kontoData?.profile?.id]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // logout errors are non-critical, proceed to redirect
    }
    window.dispatchEvent(new Event('userLogout'));
    router.push('/');
    router.refresh();
  };

  const handleAddComplaint = async () => {
    if (!complaintOrderId || !complaintDescription) {
      setSaveError('Fyll i alla fält');
      return;
    }

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: complaintOrderId,
          description: complaintDescription,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setSaveError(error.error || 'Kunde inte spara reklamation');
        return;
      }

      const data = await response.json();
      setComplaints([...complaints, data.complaint]);
      setComplaintOrderId('');
      setComplaintDescription('');
      setShowComplaintForm(false);
      setSaveMessage('Reklamation sparad');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveError('Ett fel uppstod');
    }
  };

  const handleSaveChanges = async () => {
    setSaveMessage('');
    setSaveError('');

    try {
      const response = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editFirstName,
          lastName: editLastName,
          phone: editPhone,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setSaveError(error.error || 'Kunde inte spara ändringar');
        return;
      }

      const data = await response.json();
      const customer = data.customer;

      setFirstName(customer.first_name);
      setLastName(customer.last_name);
      setRegisterEmail(customer.email);
      setPhone(customer.phone || '');
      setEditFirstName(customer.first_name);
      setEditLastName(customer.last_name);
      setEditEmail(customer.email);
      setEditPhone(customer.phone || '');

      // Save/Update address if provided
      if (editAddress && editPostalCode && editCity) {
        try {
          // If we have existing address, try to update it first
          if (currentAddressId) {
            const updateResponse = await fetch(`/api/auth/addresses/${currentAddressId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                first_name: editFirstName,
                last_name: editLastName,
                address_1: editAddress,
                postal_code: editPostalCode,
                city: editCity,
                phone: editAddressPhone || undefined,
                country_code: 'SE',
              }),
            });

            if (updateResponse.ok) {
              // Reload addresses to get fresh data
              const reloadResponse = await fetch('/api/auth/addresses');
              if (reloadResponse.ok) {
                const reloadData = await reloadResponse.json();
                const loadedAddresses = reloadData.addresses || [];
                setAddresses(loadedAddresses);
              }
            }
          }

          // Create new address if no existing or update failed
          const createResponse = await fetch('/api/auth/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              first_name: editFirstName,
              last_name: editLastName,
              address_1: editAddress,
              postal_code: editPostalCode,
              city: editCity,
              phone: editAddressPhone || undefined,
              country_code: 'SE',
            }),
          });

          if (createResponse.ok) {
            // Reload addresses from server
            const reloadResponse = await fetch('/api/auth/addresses');
            if (reloadResponse.ok) {
              const reloadData = await reloadResponse.json();
              const loadedAddresses = reloadData.addresses || [];
              setAddresses(loadedAddresses);
              if (loadedAddresses.length > 0) {
                const addr = loadedAddresses[0];
                setCurrentAddressId(addr.id);
                // Update original address data so hasChanges resets
                setAddress(addr.address_1 || '');
                setPostalCode(addr.postal_code || '');
                setCity(addr.city || '');
                setAddressPhone(addr.phone || '');
              }
            }
          } else {
            const errorData = await createResponse.json();
            setSaveError(errorData.error || 'Kunde inte spara adress');
          }
        } catch {
          setSaveError('Ett fel uppstod när adressen skulle sparas');
        }
      }

      // Byt lösenord om fälten är ifyllda
      if (showPasswordForm && (currentPassword || newPassword || confirmPassword)) {
        setPasswordError('');
        if (!currentPassword || !newPassword || !confirmPassword) {
          setSaveError('Fyll i alla lösenordsfält.');
          return;
        }
        if (newPassword !== confirmPassword) {
          setSaveError('Det nya lösenordet matchar inte.');
          return;
        }
        if (newPassword.length < 8) {
          setSaveError('Lösenordet måste vara minst 8 tecken.');
          return;
        }
        const res = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const data = await res.json();
        if (!res.ok) {
          setSaveError(data.error || 'Kunde inte byta lösenord.');
          return;
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordForm(false);
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setSaveError('Ett fel uppstod när ändringar skulle sparas');
    }
  };

  if (!isHydrated) return <MainLayout bordered={false}><div className="w-full max-w-4xl mx-auto px-6 py-16" /></MainLayout>;

  return (
    <MainLayout bordered={false}>
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-16">
        {/* Welcome Section */}
        {/* Mobil */}
        <div className="md:hidden p-4 mb-6 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
          <h2 className="text-xl font-bold mb-1 select-none">Välkommen, {firstName && lastName ? firstName : firstName || registerEmail?.split('@')[0] || 'Johan'}!</h2>
          <p className="text-sm text-gray-600 mb-3">Hantera ditt konto och se dina beställningar</p>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-semibold text-sm">Logga ut</button>
        </div>
        {/* Desktop */}
        <div className="hidden md:flex mb-8 overflow-hidden" style={{ background: '#000', minHeight: '200px', alignItems: 'stretch', position: 'relative' }}>
          <div className="flex flex-col justify-center px-10 py-6" style={{ flex: 1, zIndex: 1 }}>
            <h2 className="text-2xl font-bold mb-2 select-none text-white">Välkommen, {firstName && lastName ? firstName : firstName || registerEmail?.split('@')[0] || 'Johan'}!</h2>
            <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>Hantera ditt konto och se dina beställningar</p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 font-semibold text-sm w-fit transition-colors"
              style={{ color: '#ef4444' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ff6b6b')}
              onMouseLeave={e => (e.currentTarget.style.color = '#ef4444')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Logga ut
            </button>
          </div>
          {/* Robot i mitten */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }} className="hidden sm:block">
            <img src="/assets/medlem-banner.png" alt="" style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', height: '115%', width: 'auto', objectFit: 'contain', mixBlendMode: 'lighten' }} />
          </div>
          {/* Poäng + progress höger */}
          <div className="hidden sm:flex flex-col justify-center px-10" style={{ flex: 1, alignItems: 'flex-end' }}>
            {loyalty && loyalty.total_points !== undefined && (() => {
              const points = loyalty.total_points;
              const tier = points >= 3000 ? 'Platinum' : points >= 1500 ? 'Guld' : points >= 500 ? 'Silver' : 'Brons';
              const tierColors: Record<string, string> = { Brons: '#cd7f32', Silver: '#a0a0a0', Guld: '#d4a017', Platinum: '#8b9eb0' };
              const color = tierColors[tier];
              const nextTiers: Record<string, { name: string; threshold: number }> = { Brons: { name: 'Silver', threshold: 500 }, Silver: { name: 'Guld', threshold: 1500 }, Guld: { name: 'Platinum', threshold: 3000 } };
              const tierThresholds: Record<string, number> = { Brons: 0, Silver: 500, Guld: 1500, Platinum: 3000 };
              const next = nextTiers[tier];
              const progressPct = next ? Math.min(100, ((points - tierThresholds[tier]) / (next.threshold - tierThresholds[tier])) * 100) : 100;
              return (
                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ color, fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tier}</span>
                    {next && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>{next.name} om {next.threshold - points} p</span>}
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px' }}>
                    <div style={{ height: '100%', width: `${progressPct}%`, background: color, borderRadius: '999px', boxShadow: `0 0 8px ${color}` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, lineHeight: 1 }}>{points}</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>poäng</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .accordion-content-enter { animation: fadeIn 0.25s ease forwards; }
        `}</style>
        {/* Tabs — horisontella på desktop, accordion på mobil */}
        <div className="hidden md:flex gap-0 mb-8 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('profil');
              localStorage.setItem('accountTab', 'profil');
            }}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'profil'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            Profil
          </button>
          <button
            onClick={() => {
              setActiveTab('orderhistorik');
              localStorage.setItem('accountTab', 'orderhistorik');
            }}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'orderhistorik'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Orderhistorik
          </button>
          <button
            onClick={() => {
              setActiveTab('favoriter');
              localStorage.setItem('accountTab', 'favoriter');
            }}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'favoriter'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Favoriter
          </button>
          <button
            onClick={() => {
              setActiveTab('kundklubb');
              localStorage.setItem('accountTab', 'kundklubb');
            }}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'kundklubb'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Kundklubb
          </button>
          <button
            onClick={() => {
              setActiveTab('felanmalan');
              localStorage.setItem('accountTab', 'felanmalan');
            }}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'felanmalan'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
            Reklamation
          </button>
        </div>

        {/* Mobil accordion-navigation med inbyggt innehåll */}
        <div className="md:hidden mb-4 border border-gray-200">

          {/* Profil */}
          <div>
            <button
              onClick={() => { setActiveTab(activeTab === 'profil' ? '' : 'profil'); localStorage.setItem('accountTab', activeTab === 'profil' ? '' : 'profil'); }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left"
            >
              <span className={`flex items-center gap-2 ${activeTab === 'profil' ? 'text-black' : 'text-gray-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                Profil
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${activeTab === 'profil' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: activeTab === 'profil' ? '1fr' : '0fr', transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ overflow: 'hidden' }} className={activeTab === 'profil' ? 'accordion-content-enter' : ''}>
              <div className="p-4">
                {/* Profil content inline */}
                <h3 className="text-lg font-bold mb-4">Mina uppgifter</h3>
                {saveError && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm">{saveError}</div>}
                <div className="space-y-3">
                  <div><label className="block text-sm font-semibold mb-1">Förnamn</label><div className="relative"><input type="text" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} className="w-full px-3 py-2 pr-8 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />{editFirstName && <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}</div></div>
                  <div><label className="block text-sm font-semibold mb-1">Efternamn</label><div className="relative"><input type="text" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className="w-full px-3 py-2 pr-8 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />{editLastName && <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}</div></div>
                  <div><label className="block text-sm font-semibold mb-1">Telefon</label><div className="relative"><input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-3 py-2 pr-8 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />{editPhone && <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}</div></div>
                  <div><label className="block text-sm font-semibold mb-1">E-postadress</label><div className="relative"><input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full px-3 py-2 pr-8 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />{editEmail && <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}</div></div>
                  <div><label className="block text-sm font-semibold mb-1">Adress</label><div className="relative"><input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)}  className="w-full px-3 py-2 pr-8 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />{editAddress && <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}</div></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-semibold mb-1">Postnummer</label><input type="text" value={editPostalCode} onChange={(e) => setEditPostalCode(e.target.value)}  className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                    <div><label className="block text-sm font-semibold mb-1">Stad</label><input type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)}  className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                  </div>
                  <button onClick={handleSaveChanges} disabled={!hasChanges || isSaved} className="w-full py-2 bg-black text-white font-semibold disabled:opacity-40 mt-2">
                    {isSaved ? '✓ Sparad' : 'Spara ändringar'}
                  </button>
                </div>

                {/* Byt lösenord — mobil */}
                <div className="mt-6 pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                  <button
                    type="button"
                    onClick={() => { setShowPasswordForm(!showPasswordForm); setPasswordError(''); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                    className="text-sm font-semibold text-gray-600 flex items-center gap-1"
                  >
                    Byt lösenord
                    <svg className={`w-4 h-4 transition-transform ${showPasswordForm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showPasswordForm && (
                    <div className="mt-3 space-y-3">
                      <div><label className="block text-sm font-semibold mb-1">Nuvarande lösenord</label><input type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                      <div><label className="block text-sm font-semibold mb-1">Nytt lösenord</label><input type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                      <div><label className="block text-sm font-semibold mb-1">Bekräfta nytt lösenord</label><input type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Orderhistorik */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => { setActiveTab(activeTab === 'orderhistorik' ? '' : 'orderhistorik'); localStorage.setItem('accountTab', activeTab === 'orderhistorik' ? '' : 'orderhistorik'); }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left"
            >
              <span className={`flex items-center gap-2 ${activeTab === 'orderhistorik' ? 'text-black' : 'text-gray-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                Orderhistorik
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${activeTab === 'orderhistorik' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: activeTab === 'orderhistorik' ? '1fr' : '0fr', transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ overflow: 'hidden' }} className={activeTab === 'orderhistorik' ? 'accordion-content-enter' : ''}>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4">Orderhistorik</h3>
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const statusInfo = getOrderStatusInfo(order);
                      const isExpanded = expandedOrder === order.id;
                      const trackingNumber = getOrderTrackingNumber(order);

                      return (
                        <div key={order.id} className="border border-gray-200 overflow-hidden">
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            className="w-full px-3 py-3 flex justify-between items-center text-left"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">#{order.display_id}</p>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>{statusInfo.label}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{new Date(order.created_at).toLocaleDateString('sv-SE')} • {order.total.toLocaleString('sv-SE')} kr</p>
                            </div>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </button>

                          {isExpanded && (
                            <div className="px-3 py-4 border-t border-gray-200 text-sm">
                              <p className="text-xs text-gray-600 mb-1">Spårningsnummer</p>
                              <p className="font-semibold mb-3">{trackingNumber || 'Ej tillgängligt'}</p>

                              {order.shipping_address && (
                                <div className="mb-3 pb-3 border-b">
                                  <p className="font-semibold mb-1 text-xs text-gray-600">Leveransadress</p>
                                  <p className="text-gray-700">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                                  <p className="text-gray-700">{order.shipping_address.address_1}</p>
                                  <p className="text-gray-700">{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                                </div>
                              )}

                              <div className="mb-3 space-y-2">
                                {order.items?.map((item: any) => (
                                  <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="w-10 h-10 object-cover rounded" />}
                                      <div>
                                        <p className="text-xs">{item.title}</p>
                                        <p className="text-xs text-gray-500">Antal: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <span className="text-xs font-semibold">{(item.unit_price * item.quantity).toLocaleString('sv-SE')} kr</span>
                                  </div>
                                ))}
                                <div className="flex justify-between font-bold pt-2 border-t">
                                  <span>Totalt</span>
                                  <span>{order.total.toLocaleString('sv-SE')} kr</span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {trackingNumber ? (
                                  <a href={`https://www.postnord.se/vara-verktyg/spara-brev-paket-och-pall?shipmentId=${trackingNumber}`} target="_blank" rel="noopener noreferrer" className="flex-1 px-3 py-2 bg-black text-white text-xs font-semibold text-center">Spåra paket</a>
                                ) : (
                                  <button disabled className="flex-1 px-3 py-2 border-2 border-gray-300 text-gray-400 text-xs font-semibold cursor-not-allowed">Spåra paket</button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">Du har inga beställningar än</p>
                )}
              </div>
              </div>
            </div>
          </div>

          {/* Favoriter */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => { setActiveTab(activeTab === 'favoriter' ? '' : 'favoriter'); localStorage.setItem('accountTab', activeTab === 'favoriter' ? '' : 'favoriter'); }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left"
            >
              <span className={`flex items-center gap-2 ${activeTab === 'favoriter' ? 'text-black' : 'text-gray-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                Favoriter
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${activeTab === 'favoriter' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: activeTab === 'favoriter' ? '1fr' : '0fr', transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ overflow: 'hidden' }} className={activeTab === 'favoriter' ? 'accordion-content-enter' : ''}>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4">Favoriter</h3>
                {favoriteProducts.length > 0 ? (
                  <div className="space-y-3">
                    {favoriteProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                        <img src={product.image} alt={product.title} className="w-16 h-16 object-contain" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{product.title}</p>
                          <p className="text-sm font-bold mt-1">{product.price.toLocaleString('sv-SE')} kr</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">Du har inga sparade favoriter än</p>
                )}
              </div>
              </div>
            </div>
          </div>

          {/* Kundklubb */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => { setActiveTab(activeTab === 'kundklubb' ? '' : 'kundklubb'); localStorage.setItem('accountTab', activeTab === 'kundklubb' ? '' : 'kundklubb'); }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left"
            >
              <span className={`flex items-center gap-2 ${activeTab === 'kundklubb' ? 'text-black' : 'text-gray-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Kundklubb
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${activeTab === 'kundklubb' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: activeTab === 'kundklubb' ? '1fr' : '0fr', transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ overflow: 'hidden' }} className={activeTab === 'kundklubb' ? 'accordion-content-enter' : ''}>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">Kundklubb</h3>
                <p className="text-sm text-gray-600 mb-4">Som medlem i Techpilots kundklubb får du tillgång till exklusiva priser och förmåner.</p>
                {loyalty && loyalty.total_points !== undefined ? (
                  <p className="text-sm font-semibold">Du har {loyalty.total_points} poäng</p>
                ) : (
                  <p className="text-sm text-gray-700">Din kundklubbinformation är inte tillgänglig just nu.</p>
                )}
              </div>
              </div>
            </div>
          </div>

          {/* Reklamation */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => { setActiveTab(activeTab === 'felanmalan' ? '' : 'felanmalan'); localStorage.setItem('accountTab', activeTab === 'felanmalan' ? '' : 'felanmalan'); }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left"
            >
              <span className={`flex items-center gap-2 ${activeTab === 'felanmalan' ? 'text-black' : 'text-gray-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
                Reklamation
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${activeTab === 'felanmalan' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: activeTab === 'felanmalan' ? '1fr' : '0fr', transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ overflow: 'hidden' }} className={activeTab === 'felanmalan' ? 'accordion-content-enter' : ''}>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4">Reklamation</h3>
                {complaints.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">Du har {complaints.length} {complaints.length === 1 ? 'reklamation' : 'reklamationer'}</p>
                    {complaints.map((complaint) => (
                      <div key={complaint.id} className="p-3" style={{ border: '1px solid #e5e7eb' }}>
                        <p className="font-semibold text-sm">Ordernummer {complaint.order_number || complaint.order_id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(complaint.created_at).toLocaleDateString('sv-SE')}</p>
                        <p className="text-xs text-gray-600 mt-1"><span className="font-semibold">Beskrivning:</span> {complaint.description}</p>
                        <span style={{ display: 'inline-block', marginTop: '4px', background: complaint.status === 'resolved' ? '#000' : '#eff6ff', color: complaint.status === 'resolved' ? '#fff' : '#1d4ed8', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '999px' }}>{complaint.status === 'open' ? 'Pågående' : complaint.status === 'resolved' ? 'Löst' : 'Stängd'}</span>
                        {complaint.status === 'resolved' && (
                          <p className="text-xs text-gray-500 mt-1">Ärendet är avslutat. Har du fler frågor?<br />Kontakta oss på support@techpilots.se</p>
                        )}
                      </div>
                    ))}
                    <div className="pt-1">
                      {!showComplaintForm ? (
                        <button onClick={() => setShowComplaintForm(true)} className="w-full py-2 bg-black text-white font-semibold text-sm">Starta en reklamation</button>
                      ) : (
                        <div className="space-y-3">
                          <div><label className="block text-sm font-semibold mb-1">Ordernummer</label><input type="text" value={complaintOrderId} onChange={(e) => setComplaintOrderId(e.target.value)} className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                          <div><label className="block text-sm font-semibold mb-1">Beskriv felet</label><textarea value={complaintDescription} onChange={(e) => setComplaintDescription(e.target.value)} rows={3} className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                          <div className="flex gap-2">
                            <button onClick={handleAddComplaint} className="flex-1 py-2 bg-black text-white font-semibold text-sm">Skicka</button>
                            <button onClick={() => { setShowComplaintForm(false); setComplaintOrderId(''); setComplaintDescription(''); }} className="flex-1 py-2 border border-gray-300 text-gray-700 font-semibold text-sm">Avbryt</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>Du har ingen aktiv reklamation</p>
                    {showComplaintForm && (
                      <div className="space-y-3">
                        <div><label className="block text-sm font-semibold mb-1">Ordernummer</label><input type="text" value={complaintOrderId} onChange={(e) => setComplaintOrderId(e.target.value)}  className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                        <div><label className="block text-sm font-semibold mb-1">Beskriv felet</label><textarea value={complaintDescription} onChange={(e) => setComplaintDescription(e.target.value)}  rows={3} className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                        <button onClick={handleAddComplaint} className="w-full py-2 bg-black text-white font-semibold">Ny reklamation</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>

        </div>

        {/* Tab Content — desktop only */}
        {activeTab === 'profil' && (
        <div className="hidden md:block p-6 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
          <h3 className="text-xl font-bold mb-6">Mina uppgifter</h3>
          {saveError && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">{saveError}</div>}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Förnamn</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full px-4 py-2 pr-10 focus:outline-none border-2 border-transparent focus:border-black"
                    style={{ border: '1px solid #e5e7eb' }}
                  />
                  {editFirstName && <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Efternamn</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full px-4 py-2 pr-10 focus:outline-none border-2 border-transparent focus:border-black"
                    style={{ border: '1px solid #e5e7eb' }}
                  />
                  {editLastName && <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Telefon</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-2 pr-10 focus:outline-none border-2 border-transparent focus:border-black"
                    style={{ border: '1px solid #e5e7eb' }}
                  />
                  {editPhone && <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">E-postadress</label>
                <div className="relative">
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2 pr-10 focus:outline-none border-2 border-transparent focus:border-black"
                    style={{ border: '1px solid #e5e7eb' }}
                  />
                  {editEmail && <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
              </div>
            </div>

            {/* Address Fields */}
            <div>
              <div>
                <label className="block text-sm font-semibold mb-2">Adress</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-4 py-2 pr-10 focus:outline-none border-2 border-transparent focus:border-black"
                    style={{ border: '1px solid #e5e7eb' }}
                    
                  />
                  {editAddress && <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Postnummer</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editPostalCode}
                      onChange={(e) => setEditPostalCode(e.target.value)}
                      className="w-full px-4 py-2 pr-10 focus:outline-none border-2 border-transparent focus:border-black"
                      style={{ border: '1px solid #e5e7eb' }}
                      
                    />
                    {editPostalCode && <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Stad</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full px-4 py-2 pr-10 focus:outline-none border-2 border-transparent focus:border-black"
                      style={{ border: '1px solid #e5e7eb' }}
                      
                    />
                    {editCity && <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Byt lösenord — desktop */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={() => { setShowPasswordForm(!showPasswordForm); setPasswordError(''); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
              className="text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-1 transition-colors"
            >
              Byt lösenord
              <svg className={`w-4 h-4 transition-transform ${showPasswordForm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showPasswordForm && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nuvarande lösenord</label>
                  <input type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Nytt lösenord</label>
                  <input type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Bekräfta nytt lösenord</label>
                  <input type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            {passwordError && <p className="text-red-600 text-xs mb-2">{passwordError}</p>}
            <button
              onClick={handleSaveChanges}
              disabled={(!hasChanges || isSaved) ? true : false}
              className="px-8 py-2 bg-black text-white hover:bg-gray-800 font-semibold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40"
              style={{ minWidth: '180px', textAlign: 'center' }}
            >
              {isSaved ? '✓ Sparad' : 'Spara ändringar'}
            </button>
          </div>
        </div>
        )}

        {activeTab === 'orderhistorik' && (
        <div className="hidden md:block p-6 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
          <h3 className="text-xl font-bold mb-6">Orderhistorik</h3>
          {loadingOrdersError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
              {loadingOrdersError}
            </div>
          )}
          {orders.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-600">Du har {orders.length} beställning{orders.length !== 1 ? 'ar' : ''}</p>
              {orders.map((order) => {
                const statusInfo = getOrderStatusInfo(order);
                const isExpanded = expandedOrder === order.id;
                const trackingNumber = getOrderTrackingNumber(order);

                return (
                  <div key={order.id} className="border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full px-6 py-4 hover:bg-gray-50 flex justify-between items-center"
                    >
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-bold text-lg">#{order.display_id}</p>
                            <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('sv-SE')}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                            {statusInfo.label}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{order.total.toLocaleString('sv-SE')} kr</p>
                        <p className="text-sm text-gray-600">{order.items?.length || 0} artikel{(order.items?.length || 0) !== 1 ? 'ar' : ''}</p>
                      </div>
                      <svg className={`ml-4 w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {isExpanded && (
                      <div className="px-6 py-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Ordernummer</p>
                            <p className="font-semibold">#{order.display_id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Orderdatum</p>
                            <p className="font-semibold">{new Date(order.created_at).toLocaleDateString('sv-SE')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Spårningsnummer</p>
                            <p className="font-semibold">{trackingNumber || 'Ej tillgängligt'}</p>
                          </div>
                        </div>

                        {order.shipping_address && (
                          <div className="mb-6 pb-6 border-b">
                            <p className="font-semibold mb-2">Leveransadress</p>
                            <p className="text-gray-700">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                            <p className="text-gray-700">{order.shipping_address.address_1}</p>
                            <p className="text-gray-700">{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                          </div>
                        )}

                        <div className="mb-6">
                          <p className="font-semibold mb-4">Produkter</p>
                          <div className="space-y-3">
                            {order.items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center border-b pb-3">
                                <div className="flex items-center gap-3">
                                  {item.thumbnail && (
                                    <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-cover rounded" />
                                  )}
                                  <div>
                                    <p>{item.title}</p>
                                    <p className="text-sm text-gray-500">Antal: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="font-semibold">{(item.unit_price * item.quantity).toLocaleString('sv-SE')} kr</span>
                              </div>
                            ))}
                            <div className="flex justify-between font-bold text-lg pt-2">
                              <span>Totalt</span>
                              <span>{order.total.toLocaleString('sv-SE')} kr</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          {trackingNumber ? (
                            <a
                              href={`https://www.postnord.se/vara-verktyg/spara-brev-paket-och-pall?shipmentId=${trackingNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 font-semibold text-center"
                            >
                              Spåra paket
                            </a>
                          ) : (
                            <button disabled className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-400 font-semibold cursor-not-allowed">
                              Spåra paket
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-700">
              <p>Du har inga beställningar än</p>
            </div>
          )}
        </div>
        )}

        {activeTab === 'favoriter' && (
        <div className="hidden md:block p-6 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
          <h3 className="text-xl font-bold mb-6">Favoriter</h3>
          {favoriteProducts.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-700 mb-6">Du har {favoriteProducts.length} sparade favoriter</p>
              {favoriteProducts.map((product) => (
                <div key={product.id} className="flex items-stretch gap-0 py-8 border-b border-gray-200 last:border-b-0">
                  {/* Product image */}
                  <div className="flex-1 flex items-center justify-start">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-32 h-32 object-contain rounded"
                    />
                  </div>

                  {/* Product title and availability */}
                  <div className="flex-1 flex items-center justify-start">
                    <div>
                      <Link
                        href={`/produkter/${product.handle}`}
                        className="text-gray-900 font-semibold text-sm hover:text-gray-700 line-clamp-1 block"
                      >
                        {product.title}
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-2 h-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="10" cy="10" r="10" />
                        </svg>
                        <span className="text-xs text-gray-600">I lager</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex-1 flex items-center justify-start">
                    <p className="text-sm font-semibold text-gray-900">
                      {product.price.toLocaleString('sv-SE')} kr
                    </p>
                  </div>

                  {/* Add to cart and remove buttons */}
                  <div className="flex-1 flex items-center justify-start gap-8">
                    <button
                      onClick={() => {
                        const event = new CustomEvent('addToCart', {
                          detail: {
                            id: product.id,
                            variantId: product.variantId,
                            title: product.title,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            quantity: 1,
                            image: product.image,
                          },
                        });
                        window.dispatchEvent(event);
                      }}
                      className="text-black hover:text-gray-600 transition-colors flex items-center justify-center"
                      title="Lägg till i kundvagn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const updated = favoriteProducts.filter(p => p.id !== product.id);
                          await fetch('/api/favorites', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ wishlist: updated }),
                          });
                          setFavoriteProducts(updated);
                        } catch {
                          // UI already updated optimistically
                        }
                      }}
                      className="text-black hover:text-red-500 transition-colors flex items-center justify-center"
                      title="Ta bort från favoriter"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m3 0V4a1 1 0 011-1h6a1 1 0 011 1v3m-6 4v6m4-6v6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 text-gray-700">
              <p>Du har ingen sparade favoriter än</p>
            </div>
          )}
        </div>
        )}

        {activeTab === 'felanmalan' && (
        <div className="hidden md:block p-6 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
          <h3 className="text-xl font-bold mb-6">Reklamation</h3>
          {loadingComplaintsError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
              {loadingComplaintsError}
            </div>
          )}
          {loadingComplaints ? (
            <p className="text-gray-500">Laddar...</p>
          ) : complaints.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-700">Du har {complaints.length} {complaints.length === 1 ? 'reklamation' : 'reklamationer'}</p>
              {complaints.map((complaint) => (
                <div key={complaint.id} className="p-6 border border-gray-200">
                  <p className="font-semibold">Ordernummer {complaint.order_number || complaint.order_id}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(complaint.created_at).toLocaleDateString('sv-SE')}</p>
                  <div className="border-t border-gray-100 my-3" />
                  <p className="text-sm text-gray-600"><span className="font-semibold">Beskrivning:</span> {complaint.description}</p>
                  <div className="border-t border-gray-100 my-3" />
                  <span style={{ display: 'inline-block', background: complaint.status === 'resolved' ? '#000' : '#eff6ff', color: complaint.status === 'resolved' ? '#fff' : '#1d4ed8', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '999px' }}>{complaint.status === 'open' ? 'Pågående' : complaint.status === 'resolved' ? 'Löst' : 'Stängd'}</span>
                  {complaint.status === 'resolved' && (
                    <p className="text-xs text-gray-500 mt-3">Ärendet är avslutat. Har du fler frågor?<br />Kontakta oss på support@techpilots.se</p>
                  )}
                </div>
              ))}
              <div className="pt-2">
                {!showComplaintForm ? (
                  <button onClick={() => setShowComplaintForm(true)} className="px-6 py-2 bg-black text-white hover:bg-gray-800 font-semibold text-sm">
                    Starta en reklamation
                  </button>
                ) : (
                  <div className="p-4 space-y-4" style={{ border: '1px solid #e5e7eb' }}>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Ordernummer</label>
                      <input type="text" value={complaintOrderId} onChange={(e) => setComplaintOrderId(e.target.value)} className="w-full px-4 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Beskriv felet</label>
                      <textarea value={complaintDescription} onChange={(e) => setComplaintDescription(e.target.value)} rows={4} className="w-full px-4 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddComplaint} className="px-6 py-2 bg-black text-white hover:bg-gray-800 font-semibold">Ny reklamation</button>
                      <button onClick={() => { setShowComplaintForm(false); setComplaintOrderId(''); setComplaintDescription(''); }} className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold">Avbryt</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-gray-700">
              <p>Du har ingen aktiv reklamation</p>
              {!showComplaintForm ? (
                <button
                  onClick={() => setShowComplaintForm(true)}
                  className="w-full px-6 py-2 bg-black text-white hover:bg-gray-800 font-semibold">
                  Starta en reklamation
                </button>
              ) : (
                <div className="p-4 space-y-4" style={{ border: '1px solid #e5e7eb' }}>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ordernummer</label>
                    <input
                      type="text"
                      value={complaintOrderId}
                      onChange={(e) => setComplaintOrderId(e.target.value)}

                      className="w-full px-4 py-2 focus:outline-none"
                      style={{ border: '1px solid #e5e7eb' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Beskriv felet</label>
                    <textarea
                      value={complaintDescription}
                      onChange={(e) => setComplaintDescription(e.target.value)}

                      rows={4}
                      className="w-full px-4 py-2 focus:outline-none"
                      style={{ border: '1px solid #e5e7eb' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddComplaint}
                      className="px-6 py-2 bg-black text-white hover:bg-gray-800 font-semibold"
                    >
                      Ny reklamation
                    </button>
                    <button
                      onClick={() => {
                        setShowComplaintForm(false);
                        setComplaintOrderId('');
                        setComplaintDescription('');
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        )}

        {activeTab === 'kundklubb' && (
        <div className="hidden md:block shadow-sm overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
          {loadingLoyaltyError && <div className="p-4 bg-red-50 text-red-700 text-sm">{loadingLoyaltyError}</div>}
          {loyalty && Object.keys(loyalty).length > 0 && loyalty.total_points !== undefined ? (() => {
            const points = loyalty.total_points;
            const currentTier = points >= 3000 ? 'Platinum' : points >= 1500 ? 'Guld' : points >= 500 ? 'Silver' : 'Brons';
            const tiers = [
              { name: 'Brons',    threshold: 0,    next: 500,  color: '#cd7f32', glow: 'rgba(205,127,50,0.3)',  bg: 'rgba(205,127,50,0.08)', benefits: ['Fri frakt','30 dagars öppet köp','Erbjudanden'] },
              { name: 'Silver',   threshold: 500,  next: 1500, color: '#a0a0a0', glow: 'rgba(160,160,160,0.3)', bg: 'rgba(160,160,160,0.08)', benefits: ['Fri frakt','30 dagars öppet köp','Erbjudanden','5% på fyndvaror'] },
              { name: 'Guld',     threshold: 1500, next: 3000, color: '#d4a017', glow: 'rgba(212,160,23,0.3)',  bg: 'rgba(212,160,23,0.08)', benefits: ['Fri frakt','30 dagars öppet köp','Erbjudanden','10% på fyndvaror'] },
              { name: 'Platinum', threshold: 3000, next: 3000, color: '#8b9eb0', glow: 'rgba(139,158,176,0.3)', bg: 'rgba(139,158,176,0.08)', benefits: ['Fri frakt','30 dagars öppet köp','Erbjudanden','15% på fyndvaror','Fri hemleverans','Prioriterad service'] },
            ];
            const ct = tiers.find(t => t.name === currentTier)!;
            const nextTier = tiers.find(t => t.threshold > points);
            const progressPct = nextTier ? Math.min(100, ((points - ct.threshold) / (nextTier.threshold - ct.threshold)) * 100) : 100;
            const benefitIcons: Record<string, JSX.Element> = {
              'Fri frakt': <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17H5a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v3m0 0h2l3 4v3h-5m0 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0"/></svg>,
              '30 dagars öppet köp': <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v2H4zM4 8l1 12h14l1-12H4zm5 4v4m6-4v4"/></svg>,
              'Erbjudanden': <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M17 17h.01M3 12l9-9 9 9-9 9-9-9zm7-2a1 1 0 100 2 1 1 0 000-2z"/></svg>,
              '5% på fyndvaror': <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6M9.5 9.5h.01M14.5 14.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
              '10% på fyndvaror': <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6M9.5 9.5h.01M14.5 14.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
              '15% på fyndvaror': <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6M9.5 9.5h.01M14.5 14.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
              'Fri hemleverans': <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>,
              'Prioriterad service': <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636zM12 8v4l3 3"/></svg>,
            };
            return (
              <>
                {/* Nivåkort */}
                <div style={{ padding: '24px 24px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Nivåer & förmåner</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {tiers.map(tier => {
                      const isCurrent = tier.name === currentTier;
                      return (
                        <div key={tier.name} style={{ border: `1px solid ${isCurrent ? tier.color : '#e5e7eb'}`, background: isCurrent ? tier.bg : '#fff', padding: '16px', borderRadius: '2px', boxShadow: isCurrent ? `0 0 16px ${tier.glow}` : 'none', transition: 'all 0.2s' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isCurrent ? tier.color : '#111' }}>{tier.name}</span>
                            {isCurrent && <span style={{ fontSize: '0.6rem', fontWeight: 700, background: tier.color, color: '#fff', padding: '2px 8px', borderRadius: '999px', letterSpacing: '0.06em' }}>DIN NIVÅ</span>}
                          </div>
                          <p style={{ fontSize: '0.68rem', color: '#bbb', marginBottom: '14px' }}>{tier.threshold === 0 ? '0' : tier.threshold.toLocaleString('sv-SE')} p</p>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {tier.benefits.map((b, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#555' }}>
                                <span style={{ color: isCurrent ? tier.color : '#999', flexShrink: 0 }}>{benefitIcons[b] ?? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}</span>
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })() : (
            <div className="p-6 text-gray-500 text-sm">Din kundklubbinformation är inte tillgänglig just nu.</div>
          )}
        </div>
        )}


      </div>
    </MainLayout>
  );
}

