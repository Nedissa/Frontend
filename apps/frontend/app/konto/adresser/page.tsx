'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MainLayout } from '../../components/MainLayout';
import { InputWithCheck } from '../../components/InputWithCheck';

interface Address {
  id: string;
  name: string;
  street: string;
  zipCode: string;
  city: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: 'billing' | 'shipping';
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    name: 'Johan Andersson',
    street: 'Storgatan 1',
    zipCode: '123 45',
    city: 'Stockholm',
    country: 'Sverige',
    phone: '+46 70 123 45 67',
    isDefault: true,
    type: 'shipping',
  },
  {
    id: '2',
    name: 'Johan Andersson',
    street: 'Företagsgatan 10',
    zipCode: '456 78',
    city: 'Stockholm',
    country: 'Sverige',
    phone: '+46 70 123 45 67',
    isDefault: false,
    type: 'billing',
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    zipCode: '',
    city: '',
    country: 'Sverige',
    phone: '',
    type: 'shipping' as 'billing' | 'shipping',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(addr =>
        addr.id === editingId ? { ...addr, ...formData } : addr
      ));
      setEditingId(null);
    } else {
      setAddresses([...addresses, {
        ...formData,
        id: Math.random().toString(),
        isDefault: addresses.length === 0,
      }]);
    }
    setFormData({ name: '', street: '', zipCode: '', city: '', country: 'Sverige', phone: '', type: 'shipping' });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  const handleEdit = (address: Address) => {
    setFormData({
      name: address.name,
      street: address.street,
      zipCode: address.zipCode,
      city: address.city,
      country: address.country,
      phone: address.phone,
      type: address.type,
    });
    setEditingId(address.id);
    setShowAddForm(true);
  };

  return (
    <MainLayout bordered={false}>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mina adresser</h1>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-black text-white px-6 py-2 font-bold hover:bg-gray-800"
            >
              Lägg till adress
            </button>
          )}
        </div>
        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="p-8 rounded-lg border border-gray-200 mb-12" style={{ backgroundColor: '#f5f5f5' }}>
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Redigera adress' : 'Lägg till ny adress'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Namn</label>
                  <InputWithCheck
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Johan Andersson"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Telefon</label>
                  <InputWithCheck
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+46 70 123 45 67"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Gatuadress</label>
                <InputWithCheck
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Storgatan 1"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Postnummer</label>
                  <InputWithCheck
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="123 45"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Stad</label>
                  <InputWithCheck
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Stockholm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Land</label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 pr-10 focus:outline-none border-2 border-transparent focus:border-black"
                    style={{ backgroundColor: '#f5f5f5' }}
                    >
                      <option>Sverige</option>
                      <option>Norge</option>
                      <option>Danmark</option>
                      <option>Finland</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Adresstyp</label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 pr-10 focus:outline-none border-2 border-transparent focus:border-black"
                    style={{ backgroundColor: '#f5f5f5' }}
                  >
                    <option value="shipping">Leveransadress</option>
                    <option value="billing">Fakturaadress</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-800"
                >
                  {editingId ? 'Uppdatera adress' : 'Lägg till adress'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({ name: '', street: '', zipCode: '', city: '', country: 'Sverige', phone: '', type: 'shipping' });
                  }}
                  className="flex-1 border-2 border-black text-black py-2 rounded-lg font-bold hover:bg-gray-50"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Du har ingen sparad adress ännu</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-block bg-black text-white px-8 py-2 rounded-lg font-bold hover:bg-gray-800"
              >
                Lägg till första adress
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="border border-gray-200 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{address.name}</h3>
                      {address.isDefault && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                          Standardadress
                        </span>
                      )}
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        address.type === 'shipping'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {address.type === 'shipping' ? 'Leverans' : 'Faktura'}
                      </span>
                    </div>
                    <p className="text-gray-700">{address.street}</p>
                    <p className="text-gray-700">{address.zipCode} {address.city}</p>
                    <p className="text-gray-700">{address.country}</p>
                    <p className="text-gray-600 text-sm mt-2">{address.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm"
                    >
                      Redigera
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 font-semibold text-sm"
                    >
                      Radera
                    </button>
                  </div>
                </div>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-blue-600 hover:underline text-sm font-semibold"
                  >
                    Ställ in som standardadress
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
