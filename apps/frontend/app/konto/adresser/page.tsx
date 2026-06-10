'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/MainLayout';

interface Address {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  postal_code: string;
  city: string;
  country_code: string;
  phone?: string;
}

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  address_1: '',
  postal_code: '',
  city: '',
  phone: '',
  country_code: 'se',
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saveError, setSaveError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      const res = await fetch('/api/auth/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch {
      // keep empty state
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');

    try {
      let res: Response;
      if (editingId) {
        res = await fetch(`/api/auth/addresses/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/auth/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error || 'Kunde inte spara adress');
        return;
      }

      await loadAddresses();
      setFormData(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      setSaveMessage(editingId ? 'Adress uppdaterad' : 'Adress sparad');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveError('Ett fel uppstod');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/auth/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses(prev => prev.filter(a => a.id !== id));
      }
    } catch {
      // ignore
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      first_name: address.first_name || '',
      last_name: address.last_name || '',
      address_1: address.address_1 || '',
      postal_code: address.postal_code || '',
      city: address.city || '',
      phone: address.phone || '',
      country_code: address.country_code || 'se',
    });
    setEditingId(address.id);
    setShowForm(true);
    setSaveError('');
  };

  return (
    <MainLayout bordered={false}>
      <div className="w-full max-w-4xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Mina adresser</h1>
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setFormData(EMPTY_FORM); setSaveError(''); }}
              className="px-6 py-2 bg-black text-white font-semibold hover:bg-gray-800"
            >
              Lägg till adress
            </button>
          )}
        </div>

        {saveMessage && (
          <div className="mb-4 p-4 bg-green-50 text-green-700">{saveMessage}</div>
        )}

        {showForm && (
          <div className="p-6 mb-8" style={{ border: '1px solid #e5e7eb' }}>
            <h2 className="text-lg font-bold mb-4">{editingId ? 'Redigera adress' : 'Ny adress'}</h2>
            {saveError && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm">{saveError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Förnamn</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 focus:outline-none focus:border-black border-2 border-transparent"
                    style={{ border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Efternamn</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 focus:outline-none focus:border-black border-2 border-transparent"
                    style={{ border: '1px solid #e5e7eb' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Gatuadress</label>
                <input
                  type="text"
                  name="address_1"
                  value={formData.address_1}
                  onChange={handleChange}
                  required
                  placeholder="Gata och husnummer"
                  className="w-full px-4 py-2 focus:outline-none focus:border-black border-2 border-transparent"
                  style={{ border: '1px solid #e5e7eb' }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Postnummer</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                    placeholder="12345"
                    className="w-full px-4 py-2 focus:outline-none focus:border-black border-2 border-transparent"
                    style={{ border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Stad</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Stockholm"
                    className="w-full px-4 py-2 focus:outline-none focus:border-black border-2 border-transparent"
                    style={{ border: '1px solid #e5e7eb' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Telefon (valfritt)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+46 70 123 45 67"
                  className="w-full px-4 py-2 focus:outline-none focus:border-black border-2 border-transparent"
                  style={{ border: '1px solid #e5e7eb' }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-2 bg-black text-white font-semibold hover:bg-gray-800">
                  {editingId ? 'Spara ändringar' : 'Lägg till'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); setSaveError(''); }}
                  className="px-6 py-2 border border-gray-300 font-semibold hover:bg-gray-50"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Laddar adresser...</p>
        ) : addresses.length === 0 ? (
          <div className="p-8 text-center text-gray-500" style={{ border: '1px solid #e5e7eb' }}>
            <p className="mb-4">Du har inga sparade adresser</p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-black text-white font-semibold hover:bg-gray-800"
              >
                Lägg till adress
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="p-6 flex justify-between items-start" style={{ border: '1px solid #e5e7eb' }}>
                <div>
                  <p className="font-semibold">{address.first_name} {address.last_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{address.address_1}</p>
                  <p className="text-sm text-gray-600">{address.postal_code} {address.city}</p>
                  {address.phone && <p className="text-sm text-gray-500 mt-1">{address.phone}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="px-4 py-1.5 text-sm border border-gray-300 font-semibold hover:bg-gray-50"
                  >
                    Redigera
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="px-4 py-1.5 text-sm border border-red-300 text-red-600 font-semibold hover:bg-red-50"
                  >
                    Radera
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
