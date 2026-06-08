'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/MainLayout';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  thumbnail?: string;
}

interface Order {
  id: string;
  display_id: number;
  created_at: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  total: number;
  items: OrderItem[];
  shipping_address?: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postal_code: string;
  };
  fulfillments?: Array<{
    tracking_numbers?: string[];
  }>;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
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

function getStatusInfo(order: Order) {
  const key = order.fulfillment_status || order.status;
  return statusColors[key] || { bg: 'bg-gray-50', text: 'text-gray-700', label: key };
}

function getTrackingNumber(order: Order): string | null {
  const numbers = order.fulfillments?.flatMap(f => f.tracking_numbers || []);
  return numbers && numbers.length > 0 ? numbers[0] : null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sv-SE');
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrders(data.orders || []);
        }
      })
      .catch(() => setError('Kunde inte hämta beställningar'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout bordered={false}>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-2">Mina beställningar</h1>

        {loading && (
          <p className="text-gray-500 mt-8">Hämtar beställningar...</p>
        )}

        {error && (
          <p className="text-red-500 mt-8">{error}</p>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Du har inga beställningar ännu</h2>
            <Link href="/produkter" className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800">
              Börja shoppning
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <>
            <p className="text-gray-600 mb-8">Du har {orders.length} beställning{orders.length !== 1 ? 'ar' : ''}</p>
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order);
                const isExpanded = expandedOrder === order.id;
                const trackingNumber = getTrackingNumber(order);

                return (
                  <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full px-6 py-4 hover:bg-gray-50 flex justify-between items-center"
                    >
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-bold text-lg">#{order.display_id}</p>
                            <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                            {statusInfo.label}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{(order.total / 100).toFixed(0)} SEK</p>
                        <p className="text-sm text-gray-600">{order.items?.length || 0} artikel{(order.items?.length || 0) !== 1 ? 'ar' : ''}</p>
                      </div>
                      <span className="ml-4 text-gray-400 text-xl">
                        {isExpanded ? '−' : '+'}
                      </span>
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
                            <p className="font-semibold">{formatDate(order.created_at)}</p>
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
                            {order.items?.map((item) => (
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
                                <span className="font-semibold">{((item.unit_price * item.quantity) / 100).toFixed(0)} SEK</span>
                              </div>
                            ))}
                            <div className="flex justify-between font-bold text-lg pt-2">
                              <span>Totalt</span>
                              <span>{(order.total / 100).toFixed(0)} SEK</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          {trackingNumber ? (
                            <a
                              href={`https://www.postnord.se/vara-verktyg/spara-brev-paket-och-pall?shipmentId=${trackingNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-100 font-semibold text-center"
                            >
                              Spåra paket
                            </a>
                          ) : (
                            <button disabled className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-400 rounded-lg font-semibold cursor-not-allowed">
                              Spåra paket
                            </button>
                          )}
                          <Link
                            href="/reklamation"
                            className="flex-1 px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-100 font-semibold text-center"
                          >
                            Returera produkt
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
