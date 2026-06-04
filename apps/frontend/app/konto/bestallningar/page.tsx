'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MainLayout } from '../../components/MainLayout';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  trackingNumber?: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: '#12345',
    date: '2024-05-01',
    total: 24998,
    status: 'delivered',
    items: 2,
    trackingNumber: 'SE123456789',
  },
  {
    id: '#12340',
    date: '2024-04-15',
    total: 14999,
    status: 'delivered',
    items: 1,
    trackingNumber: 'SE123456788',
  },
  {
    id: '#12335',
    date: '2024-03-22',
    total: 5499,
    status: 'delivered',
    items: 1,
    trackingNumber: 'SE123456787',
  },
  {
    id: '#12330',
    date: '2024-03-10',
    total: 1499,
    status: 'delivered',
    items: 1,
    trackingNumber: 'SE123456786',
  },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  'processing': { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Bearbetas' },
  'shipped': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Skickad' },
  'delivered': { bg: 'bg-green-50', text: 'text-green-700', label: 'Levererad' },
  'cancelled': { bg: 'bg-red-50', text: 'text-red-700', label: 'Avbruten' },
};

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  return (
    <MainLayout bordered={false}>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-2">Mina beställningar</h1>
        <p className="text-gray-600 mb-8">Du har {MOCK_ORDERS.length} beställningar</p>
        {MOCK_ORDERS.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Du har inga beställningar ännu</h2>
            <Link href="/produkter" className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800">
              Börja shoppning
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_ORDERS.map((order) => {
              const statusInfo = statusColors[order.status];
              const isExpanded = expandedOrder === order.id;

              return (
                <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Order Summary */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full px-6 py-4 hover:bg-gray-50 flex justify-between items-center"
                  >
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-bold text-lg">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                          {statusInfo.label}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{order.total} SEK</p>
                      <p className="text-sm text-gray-600">{order.items} artikel</p>
                    </div>
                    <span className="ml-4 text-gray-400 text-xl">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {/* Order Details */}
                  {isExpanded && (
                    <div className="px-6 py-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Ordernummer</p>
                          <p className="font-semibold">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Orderdatum</p>
                          <p className="font-semibold">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Spårningsnummer</p>
                          <p className="font-semibold">{order.trackingNumber}</p>
                        </div>
                      </div>

                      {/* Status Timeline */}
                      <div className="mb-6 pb-6 border-b">
                        <p className="font-semibold mb-4">Orderstatus</p>
                        <div className="space-y-3">
                          {order.status === 'delivered' && (
                            <>
                              <div className="flex items-center gap-3">
                                <span className="text-green-600 text-lg">✓</span>
                                <p className="text-gray-700">Levererad den 2024-05-04</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-green-600 text-lg">✓</span>
                                <p className="text-gray-700">Skickad den 2024-05-02</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-green-600 text-lg">✓</span>
                                <p className="text-gray-700">Beställning bekräftad</p>
                              </div>
                            </>
                          )}
                          {order.status === 'shipped' && (
                            <>
                              <div className="flex items-center gap-3">
                                <span className="text-blue-600 text-lg">→</span>
                                <p className="text-gray-700">På väg - Beräknad leverans 2024-05-10</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-green-600 text-lg">✓</span>
                                <p className="text-gray-700">Skickad</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-6">
                        <p className="font-semibold mb-4">Produkter</p>
                        <div className="bg-white rounded p-4 space-y-3">
                          {order.items === 2 ? (
                            <>
                              <div className="flex justify-between">
                                <span>ASUS ROG Gaming Laptop 16"</span>
                                <span className="font-semibold">14999 SEK</span>
                              </div>
                              <div className="flex justify-between border-b pb-3">
                                <span>NVIDIA RTX 4080</span>
                                <span className="font-semibold">11999 SEK</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-between border-b pb-3">
                              <span>Köpt produkt</span>
                              <span className="font-semibold">{order.total} SEK</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-lg">
                            <span>Totalt</span>
                            <span>{order.total} SEK</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4">
                        <button className="flex-1 px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-100 font-semibold">
                          Spåra paket
                        </button>
                        <button className="flex-1 px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-100 font-semibold">
                          Skriv ut faktura
                        </button>
                        <button className="flex-1 px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-100 font-semibold">
                          Returera produkt
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
