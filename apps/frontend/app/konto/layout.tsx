import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { KontoProvider, type KontoData } from './konto-context';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

async function fetchKontoData(token: string): Promise<KontoData | null> {
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'x-publishable-api-key': PUBLISHABLE_KEY,
  };

  const [meRes, ordersRes, complaintsRes, loyaltyRes, addressesRes, favoritesRes] =
    await Promise.allSettled([
      fetch(`${MEDUSA_URL}/store/customers/me`, { headers: authHeaders }),
      fetch(`${MEDUSA_URL}/store/orders?limit=5`, { headers: authHeaders }),
      fetch(`${MEDUSA_URL}/admin/complaints`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }),
      fetch(`${MEDUSA_URL}/store/customers/me/loyalty`, { headers: authHeaders }),
      fetch(`${MEDUSA_URL}/store/customers/me/addresses`, { headers: authHeaders }),
      fetch(`${MEDUSA_URL}/store/customers/me/favorites`, { headers: authHeaders }),
    ]);

  if (meRes.status !== 'fulfilled' || !meRes.value.ok) {
    return null;
  }

  const meData = await meRes.value.json();
  const customer = meData.customer || meData;

  const data: KontoData = {
    profile: {
      id: customer.id,
      firstName: customer.first_name || '',
      lastName: customer.last_name || '',
      email: customer.email || '',
      phone: customer.phone || '',
    },
    orders: [],
    complaints: [],
    loyalty: null,
    addresses: [],
    favoriteProducts: [],
  };

  if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
    const d = await ordersRes.value.json();
    data.orders = d.orders || [];
  }

  if (complaintsRes.status === 'fulfilled' && complaintsRes.value.ok) {
    const d = await complaintsRes.value.json();
    // complaints endpoint needs customer_id filter
    data.complaints = (d.complaints || []).filter(
      (c: any) => c.customer_id === customer.id
    );
  }

  if (loyaltyRes.status === 'fulfilled' && loyaltyRes.value.ok) {
    const d = await loyaltyRes.value.json();
    data.loyalty = d.loyalty || null;
  }

  if (addressesRes.status === 'fulfilled' && addressesRes.value.ok) {
    const d = await addressesRes.value.json();
    data.addresses = d.addresses || [];
  }

  if (favoritesRes.status === 'fulfilled' && favoritesRes.value.ok) {
    const d = await favoritesRes.value.json();
    data.favoriteProducts = d.favorites || [];
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
