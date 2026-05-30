'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '../components/MainLayout';
import { ProductCard, type ProductData } from '@/app/components/ProductCard';
import { useKontoData } from './konto-context';

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
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accountTab') || 'profil';
    }
    return 'profil';
  });
  const [isHydrated, setIsHydrated] = useState(true);
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


  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    window.dispatchEvent(new Event('userLogout'));
    router.push('/inlogg');
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
    } catch (error) {
      console.error('Error adding complaint:', error);
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
        console.error('Failed to update profile:', error);
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
              return;
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
            console.error('Failed to create address:', errorData);
            setSaveError(`Kunde inte spara adress: ${errorData.error || 'Okänt fel'}`);
          }
        } catch (error) {
          console.error('Address save error:', error);
          setSaveError('Ett fel uppstod när adressen skulle sparas');
        }
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      setSaveError('Ett fel uppstod när ändringar skulle sparas');
      console.error('Profile update error:', error);
    }
  };




  return (
    <MainLayout bordered={false}>
      <div className="w-full max-w-4xl mx-auto px-6 py-16">
        {/* Welcome Section */}
        <div className="bg-gray-50 p-8  mb-8 shadow-sm flex justify-between items-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <div>
            <h2 className="text-2xl font-bold mb-2 select-none">Välkommen, {firstName && lastName ? firstName : firstName || registerEmail?.split('@')[0] || 'Johan'}!</h2>
            <p className="text-gray-600">Hantera ditt konto och se dina beställningar</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-semibold whitespace-nowrap ml-8"
          >
            Logga ut
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('profil');
              localStorage.setItem('accountTab', 'profil');
            }}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'profil'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Profil
          </button>
          <button
            onClick={() => {
              setActiveTab('orderhistorik');
              localStorage.setItem('accountTab', 'orderhistorik');
            }}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'orderhistorik'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Orderhistorik
          </button>
          <button
            onClick={() => {
              setActiveTab('felanmalan');
              localStorage.setItem('accountTab', 'felanmalan');
            }}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'felanmalan'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Felanmälan
          </button>
          <button
            onClick={() => {
              setActiveTab('favoriter');
              localStorage.setItem('accountTab', 'favoriter');
            }}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'favoriter'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Favoriter
          </button>
          <button
            onClick={() => {
              setActiveTab('kundklubb');
              localStorage.setItem('accountTab', 'kundklubb');
            }}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'kundklubb'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Kundklubb
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profil' && (
        <div className="p-6  shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
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
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
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
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
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
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
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
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
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
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    placeholder="Gata och husnummer"
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
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                      placeholder="00000"
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
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                      placeholder="Stad"
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
        <div className="p-6  shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <h3 className="text-xl font-bold mb-6">Orderhistorik</h3>
          {loadingOrdersError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
              {loadingOrdersError}
            </div>
          )}
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="pb-4 border-b last:border-b-0">
                  <p className="font-semibold">Beställning #{order.display_id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('sv-SE')} • {(order.total / 100).toLocaleString('sv-SE')} SEK
                  </p>
                  <p className={`text-sm font-semibold mt-1 ${order.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                    {order.status === 'completed' ? 'Levererad' : 'Bearbetas'}
                  </p>
                </div>
              ))}
              <Link href="/konto/bestallningar">
                <button className="w-full px-6 py-2 bg-black text-white  hover:bg-gray-800 font-semibold mt-4">
                  Se alla ordrar
                </button>
              </Link>
            </div>
          ) : (
            <div className="text-gray-700">
              <p>Du har inga beställningar än</p>
            </div>
          )}
        </div>
        )}

        {activeTab === 'favoriter' && (
        <div className="p-6  shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
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
                            title: product.title,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            quantity: 1,
                            image: product.image,
                          },
                        });
                        window.dispatchEvent(event);
                      }}
                      className="text-gray-500 hover:text-black transition-colors flex items-center justify-center"
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
                        } catch (error) {
                          console.error('Failed to remove favorite:', error);
                        }
                      }}
                      className="text-gray-500 hover:text-red-500 transition-colors flex items-center justify-center"
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
        <div className="p-6  shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
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
              <p className="text-gray-700">Du har {complaints.length} felanmälningar</p>
              {complaints.map((complaint) => (
                <div key={complaint.id} className="p-4 border border-gray-200">
                  <p className="font-semibold">Beställning #{complaint.order_id}</p>
                  <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                  <p className="text-sm font-semibold mt-2">
                    Status: <span className="text-blue-600">{complaint.status === 'open' ? 'Pågående' : complaint.status === 'closed' ? 'Stängd' : complaint.status}</span>
                  </p>
                </div>
              ))}
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
                <div className="p-4 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ditt ordernummer</label>
                    <input
                      type="text"
                      value={complaintOrderId}
                      onChange={(e) => setComplaintOrderId(e.target.value)}
                      placeholder="Ditt ordernummer"
                      className="w-full px-4 py-2 focus:outline-none"
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Meddelande</label>
                    <textarea
                      value={complaintDescription}
                      onChange={(e) => setComplaintDescription(e.target.value)}
                      placeholder="Beskriv ditt ärende..."
                      rows={4}
                      className="w-full px-4 py-2 focus:outline-none"
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
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
        <div className="p-6  shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
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
                <p className="text-sm text-gray-500 mb-6">Dina poäng: {loyalty.total_points}</p>
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
                    <div className="relative">
                      {/* Track */}
                      <div className="w-full bg-gray-300 h-2 rounded-full mb-2">
                        <div className="h-2 bg-black rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                      {/* Step markers */}
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
                              <span className="text-xs text-gray-400">{tier.threshold === 0 ? '0' : tier.threshold.toLocaleString('sv-SE')} p</span>
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
                      <div key={tier.name} className={`p-4 ${isCurrent ? 'ring-2 ring-black' : ''}`} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
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

              <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} className="p-5">
                <h4 className="font-semibold mb-4">Din aktivitet</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Totala köp</p>
                    <p className="font-semibold text-lg">{loyalty.lifetime_orders} beställningar</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Totalt värde</p>
                    <p className="font-semibold text-lg">{(loyalty.lifetime_spend / 100).toLocaleString('sv-SE')} SEK</p>
                  </div>
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
