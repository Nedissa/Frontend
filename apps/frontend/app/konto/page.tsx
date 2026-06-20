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
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Check if all required fields are filled
  const isFormComplete = !!(editFirstName && editLastName && editEmail && editAddress && editPostalCode && editCity);

  // Track if any changes have been made
  const hasChanges = editFirstName !== firstName ||
    editLastName !== lastName ||
    editEmail !== registerEmail ||
    editPhone !== phone ||
    editAddress !== address ||
    editPostalCode !== postalCode ||
    editCity !== city ||
    editAddressPhone !== addressPhone;


  useEffect(() => {
    setIsHydrated(true);

    // Återställ senast aktiva tab (desktop: fallback till profil, mobil: stängd)
    const savedTab = localStorage.getItem('accountTab');
    if (savedTab) {
      setActiveTab(savedTab);
    } else if (window.innerWidth >= 768) {
      setActiveTab('profil');
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
        setSaveError(error.error || 'Kunde inte spara felanmälan');
        return;
      }

      const data = await response.json();
      setComplaints([...complaints, data.complaint]);
      setComplaintOrderId('');
      setComplaintDescription('');
      setShowComplaintForm(false);
      setSaveMessage('Felanmälan sparad');
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
        <div className="p-4 md:p-8 mb-6 md:mb-8 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
          <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 select-none">Välkommen, {firstName && lastName ? firstName : firstName || registerEmail?.split('@')[0] || 'Johan'}!</h2>
          <p className="text-sm text-gray-600 mb-3">Hantera ditt konto och se dina beställningar</p>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-semibold text-sm"
          >
            Logga ut
          </button>
        </div>

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
            Felanmälan
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
                  <button onClick={handleSaveChanges} disabled={!isFormComplete || !hasChanges || isSaved} className="w-full py-2 bg-black text-white font-semibold disabled:opacity-40 mt-2">
                    {isSaved ? '✓ Sparad' : 'Spara ändringar'}
                  </button>
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
                            <span className="text-gray-400 text-lg">{isExpanded ? '−' : '+'}</span>
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

          {/* Felanmälan */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => { setActiveTab(activeTab === 'felanmalan' ? '' : 'felanmalan'); localStorage.setItem('accountTab', activeTab === 'felanmalan' ? '' : 'felanmalan'); }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left"
            >
              <span className={`flex items-center gap-2 ${activeTab === 'felanmalan' ? 'text-black' : 'text-gray-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
                Felanmälan
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${activeTab === 'felanmalan' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: activeTab === 'felanmalan' ? '1fr' : '0fr', transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ overflow: 'hidden' }} className={activeTab === 'felanmalan' ? 'accordion-content-enter' : ''}>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4">Felanmälan</h3>
                {complaints.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">Du har {complaints.length} {complaints.length === 1 ? 'felanmälan' : 'felanmälningar'}</p>
                    {complaints.map((complaint) => (
                      <div key={complaint.id} className="p-3" style={{ border: '1px solid #e5e7eb' }}>
                        <p className="font-semibold text-sm">Beställning #{complaint.order_number || complaint.order_id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(complaint.created_at).toLocaleDateString('sv-SE')}</p>
                        <p className="text-xs text-gray-600 mt-1"><span className="font-semibold">Beskrivning:</span> {complaint.description}</p>
                        <p className="text-xs font-semibold mt-1">Status: <span className={complaint.status === 'resolved' ? 'text-green-600' : 'text-blue-600'}>{complaint.status === 'open' ? 'Pågående' : complaint.status === 'resolved' ? 'Löst' : 'Stängd'}</span></p>
                        {complaint.status === 'resolved' && (
                          <p className="text-xs text-gray-500 mt-1">Ärendet är avslutat. Fler frågor? support@techpilots.se</p>
                        )}
                      </div>
                    ))}
                    <div className="pt-1">
                      {!showComplaintForm ? (
                        <button onClick={() => setShowComplaintForm(true)} className="w-full py-2 bg-black text-white font-semibold text-sm">Ny felanmälan</button>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold">Ny felanmälan</p>
                          <div><label className="block text-sm font-semibold mb-1">Ordernummer</label><input type="text" value={complaintOrderId} onChange={(e) => setComplaintOrderId(e.target.value)} className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                          <div><label className="block text-sm font-semibold mb-1">Meddelande</label><textarea value={complaintDescription} onChange={(e) => setComplaintDescription(e.target.value)} rows={3} className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
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
                    <p>Du har ingen aktiv felanmälan</p>
                    {showComplaintForm && (
                      <div className="space-y-3">
                        <div><label className="block text-sm font-semibold mb-1">Ordernummer</label><input type="text" value={complaintOrderId} onChange={(e) => setComplaintOrderId(e.target.value)}  className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                        <div><label className="block text-sm font-semibold mb-1">Meddelande</label><textarea value={complaintDescription} onChange={(e) => setComplaintDescription(e.target.value)}  rows={3} className="w-full px-3 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} /></div>
                        <button onClick={handleAddComplaint} className="w-full py-2 bg-black text-white font-semibold">Skicka felanmälan</button>
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
          {saveError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
              {saveError}
            </div>
          )}
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

            <button
              onClick={handleSaveChanges}
              disabled={(!isFormComplete || !hasChanges || isSaved) ? true : false}
              className="mt-6 px-8 py-2 bg-black text-white hover:bg-gray-800 font-semibold whitespace-nowrap disabled:cursor-not-allowed"
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
                      <span className="ml-4 text-gray-400 text-xl">{isExpanded ? '−' : '+'}</span>
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
          <h3 className="text-xl font-bold mb-6">Felanmälan</h3>
          {loadingComplaintsError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
              {loadingComplaintsError}
            </div>
          )}
          {loadingComplaints ? (
            <p className="text-gray-500">Laddar...</p>
          ) : complaints.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-700">Du har {complaints.length} {complaints.length === 1 ? 'felanmälan' : 'felanmälningar'}</p>
              {complaints.map((complaint) => (
                <div key={complaint.id} className="p-4 border border-gray-200">
                  <p className="font-semibold">Beställning #{complaint.order_number || complaint.order_id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(complaint.created_at).toLocaleDateString('sv-SE')}</p>
                  <p className="text-sm text-gray-600 mt-2"><span className="font-semibold">Beskrivning:</span> {complaint.description}</p>
                  <p className="text-sm font-semibold mt-2">
                    Status: <span className={complaint.status === 'resolved' ? 'text-green-600' : 'text-blue-600'}>{complaint.status === 'open' ? 'Pågående' : complaint.status === 'resolved' ? 'Löst' : 'Stängd'}</span>
                  </p>
                  {complaint.status === 'resolved' && (
                    <p className="text-xs text-gray-500 mt-1">Ärendet är avslutat. Har du fler frågor? Kontakta oss på support@techpilots.se</p>
                  )}
                </div>
              ))}
              <div className="pt-2">
                {!showComplaintForm ? (
                  <button onClick={() => setShowComplaintForm(true)} className="px-6 py-2 bg-black text-white hover:bg-gray-800 font-semibold text-sm">
                    Ny felanmälan
                  </button>
                ) : (
                  <div className="p-4 space-y-4" style={{ border: '1px solid #e5e7eb' }}>
                    <h4 className="font-semibold text-sm">Ny felanmälan</h4>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Ditt ordernummer</label>
                      <input type="text" value={complaintOrderId} onChange={(e) => setComplaintOrderId(e.target.value)} className="w-full px-4 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Meddelande</label>
                      <textarea value={complaintDescription} onChange={(e) => setComplaintDescription(e.target.value)} rows={4} className="w-full px-4 py-2 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddComplaint} className="px-6 py-2 bg-black text-white hover:bg-gray-800 font-semibold">Skicka felanmälan</button>
                      <button onClick={() => { setShowComplaintForm(false); setComplaintOrderId(''); setComplaintDescription(''); }} className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold">Avbryt</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-gray-700">
              <p>Du har ingen aktiv felanmälan</p>
              {!showComplaintForm ? (
                <button
                  onClick={() => setShowComplaintForm(true)}
                  className="w-full px-6 py-2 bg-black text-white hover:bg-gray-800 font-semibold">
                  Anmäl ett fel
                </button>
              ) : (
                <div className="p-4 space-y-4" style={{ border: '1px solid #e5e7eb' }}>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ditt ordernummer</label>
                    <input
                      type="text"
                      value={complaintOrderId}
                      onChange={(e) => setComplaintOrderId(e.target.value)}

                      className="w-full px-4 py-2 focus:outline-none"
                      style={{ border: '1px solid #e5e7eb' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Meddelande</label>
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
                      Skicka felanmälan
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
        <div className="hidden md:block p-6 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
          <h3 className="text-xl font-bold mb-2">Kundklubb</h3>
          <p className="text-gray-600 mb-6">Som medlem i Techpilots kundklubb får du tillgång till exklusiva priser, erbjudanden från våra partners och förmåner anpassade efter din medlemsnivå. Ju mer du handlar, desto mer får du tillbaka.</p>
          {loadingLoyaltyError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
              {loadingLoyaltyError}
            </div>
          )}
          {loyalty && Object.keys(loyalty).length > 0 && loyalty.total_points !== undefined ? (
            <div className="space-y-6">
              {/* Tier progress stepper */}
              <div>
                <p className="font-semibold text-lg mb-1">{loyalty.total_points >= 3000 ? 'Platinum' : loyalty.total_points >= 1500 ? 'Guld' : loyalty.total_points >= 500 ? 'Silver' : 'Brons'}-medlem</p>
                <p className="text-sm text-gray-500 mb-3">Du har <span className="font-bold text-black">{loyalty.total_points} poäng</span></p>
                {(() => {
                  const tiers = [
                    { name: 'Brons', threshold: 0 },
                    { name: 'Silver', threshold: 500 },
                    { name: 'Guld', threshold: 1500 },
                    { name: 'Platinum', threshold: 3000 },
                  ];
                  const points = loyalty.total_points;
                  const totalMax = 3000;
                  const progress = Math.min(100, (points / totalMax) * 100);
                  return (
                    <div className="relative mb-6">
                      <div className="w-full bg-gray-300 h-2 rounded-full mb-2">
                        <div className="h-2 bg-black rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="relative" style={{ marginTop: '-22px', height: '52px' }}>
                        {tiers.map((tier, i) => {
                          const reached = points >= tier.threshold;
                          const currentTier = loyalty.total_points >= 3000 ? 'Platinum' : loyalty.total_points >= 1500 ? 'Guld' : loyalty.total_points >= 500 ? 'Silver' : 'Brons';
                          const isCurrent = currentTier === tier.name;
                          const leftPct = (tier.threshold / totalMax) * 100;
                          const transform = i === 0 ? 'translateX(0)' : i === tiers.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)';
                          return (
                            <div key={tier.name} className="flex flex-col items-center" style={{ position: 'absolute', left: `${leftPct}%`, transform }}>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${reached ? 'bg-black border-black' : 'bg-white border-gray-300'}`}>
                                {reached && <span className="w-2 h-2 bg-white rounded-full block" />}
                              </div>
                              <span className={`text-xs font-semibold mt-2 ${isCurrent ? 'text-black' : 'text-gray-400'}`}>{tier.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <h4 className="font-semibold mb-4">Medlemsnivåer och förmåner</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      name: 'Brons',
                      threshold: '0 p',
                      headerColor: 'text-black',
                      borderColor: 'border-amber-300',
                      benefits: [
                        'Fri frakt på alla orders',
                        '30 dagars öppet köp',
                        'Exklusiva erbjudanden',
                      ],
                    },
                    {
                      name: 'Silver',
                      threshold: '500 p',
                      headerColor: 'text-black',
                      borderColor: 'border-gray-300',
                      benefits: [
                        'Fri frakt på alla orders',
                        '30 dagars öppet köp',
                        'Exklusiva erbjudanden',
                        '5% rabatt på fyndvaror',
                      ],
                    },
                    {
                      name: 'Guld',
                      threshold: '1 500 p',
                      headerColor: 'text-black',
                      borderColor: 'border-yellow-400',
                      benefits: [
                        'Fri frakt på alla orders',
                        '30 dagars öppet köp',
                        'Exklusiva erbjudanden',
                        '10% rabatt på fyndvaror',
                      ],
                    },
                    {
                      name: 'Platinum',
                      threshold: '3 000 p',
                      headerColor: 'text-black',
                      borderColor: 'border-blue-400',
                      benefits: [
                        'Fri frakt på alla orders',
                        '30 dagars öppet köp',
                        'Exklusiva erbjudanden',
                        '15% rabatt på fyndvaror',
                        'Fri hemleverans',
                        'Prioriterad kundservice',
                      ],
                    },
                  ].map((tier) => {
                    const currentTier = loyalty.total_points >= 3000 ? 'Platinum' : loyalty.total_points >= 1500 ? 'Guld' : loyalty.total_points >= 500 ? 'Silver' : 'Brons';
                    const isCurrent = currentTier === tier.name;
                    return (
                      <div key={tier.name} className="p-4" style={{ border: '1px solid #e5e7eb' }}>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`font-bold text-sm ${tier.headerColor}`}>{tier.name}</span>
                          {isCurrent && <span className="text-xs bg-black text-white px-1.5 py-0.5">Din nivå</span>}
                        </div>
                        <ul className="space-y-1.5">
                          {tier.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                              <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0 mt-1" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Medlem sedan: {new Date(loyalty.member_since).toLocaleDateString('sv-SE')}
              </p>


            </div>
          ) : (
            <div className="space-y-3 text-gray-700">
              <p>Din kundklubbinformation är inte tillgänglig just nu. Försök igen senare.</p>
            </div>
          )}
        </div>
        )}
      </div>
    </MainLayout>
  );
}

