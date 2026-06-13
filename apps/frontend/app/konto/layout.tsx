import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Mitt konto | Techpilots',
  description: 'Hantera ditt konto, se orderhistorik, favoriter och dina uppgifter hos Techpilots.',
  robots: { index: false, follow: false },
};
import { redirect } from 'next/navigation';
import { KontoProvider, type KontoData } from './konto-context';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

async function fetchKontoData(token: string): Promise<KontoData | null> {
  const storeHeaders = {
    'Authorization': `Bearer ${token}`,
    'x-publishable-api-key': PUBLISHABLE_KEY,
  };

  // Fetch customer + orders in parallel
  const [meRes, ordersRes] = await Promise.allSettled([
    fetch(`${MEDUSA_URL}/store/customers/me?fields=*metadata`, { headers: storeHeaders }),
    fetch(`${MEDUSA_URL}/store/orders?limit=5`, { headers: storeHeaders }),
  ]);

  if (meRes.status !== 'fulfilled' || !meRes.value.ok) return null;

  const meData = await meRes.value.json();
  const customer = meData.customer || meData;
  const customerId = customer.id;
  const metadata = customer.metadata || {};

  // Fetch complaints from store endpoint (stored in customer metadata via backend)
  const complaintsRes = await fetch(
    `${MEDUSA_URL}/store/complaints?customer_id=${customerId}`,
    { headers: storeHeaders }
  );

  const data: KontoData = {
    profile: {
      id: customerId,
      firstName: customer.first_name || '',
      lastName: customer.last_name || '',
      email: customer.email || '',
      phone: customer.phone || '',
    },
    orders: [],
    complaints: [],
    loyalty: metadata.loyalty || {
      current_tier: 'Brons',
      total_points: 0,
      points_to_next_tier: 500,
      lifetime_orders: 0,
      lifetime_spend: 0,
      member_since: new Date().toISOString(),
    },
    addresses: customer.addresses || [],
    favoriteProducts: metadata.wishlist || [],
  };

  if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
    const d = await ordersRes.value.json();
    data.orders = d.orders || [];
  }

  if (complaintsRes.ok) {
    const d = await complaintsRes.json();
    data.complaints = d.complaints || [];
  }

  return data;
}

export default async function KontoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('medusa_token')?.value;

  if (!token) {
    redirect('/inlogg');
  }

  const kontoData = await fetchKontoData(token);

  if (!kontoData) {
    redirect('/inlogg');
  }

  return (
    <KontoProvider initialData={kontoData}>
      {children}
    </KontoProvider>
  );
}
