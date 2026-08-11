import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Mitt konto | Techpilots',
  description: 'Hantera ditt konto, se orderhistorik, favoriter och dina uppgifter hos Techpilots.',
  robots: { index: false, follow: false },
};
import { redirect } from 'next/navigation';
import { AccountProvider, type AccountData } from './account-context';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

async function fetchAccountData(token: string): Promise<AccountData | null> {
  const storeHeaders = {
    'Authorization': `Bearer ${token}`,
    'x-publishable-api-key': PUBLISHABLE_KEY,
  };

  // Fetch customer, orders and complaints in parallel. /store/complaints
  // identifies the customer via auth_context, so it no longer needs to
  // wait for the /customers/me response to resolve customerId first.
  const [meRes, ordersRes, complaintsRes] = await Promise.allSettled([
    fetch(`${MEDUSA_URL}/store/customers/me?fields=+metadata`, { headers: storeHeaders }),
    fetch(`${MEDUSA_URL}/store/orders?limit=5&fields=*items,*items.variant,*items.variant.product,*items.variant.product.images,*shipping_methods,*payment_collections,*payment_collections.payments`, { headers: storeHeaders }),
    fetch(`${MEDUSA_URL}/store/complaints`, { headers: storeHeaders }),
  ]);

  if (meRes.status !== 'fulfilled' || !meRes.value.ok) return null;

  const meData = await meRes.value.json();
  const customer = meData.customer || meData;
  const customerId = customer.id;

  const metadata = customer.metadata || {};

  const data: AccountData = {
    profile: {
      id: customerId,
      firstName: customer.first_name || '',
      lastName: customer.last_name || '',
      email: customer.email || '',
      phone: customer.phone || '',
    },
    orders: [],
    complaints: [],
    loyalty: (() => {
      const pts = metadata.loyalty?.total_points || 0;
      const tier = pts >= 2000 ? 'Platinum' : pts >= 1000 ? 'Guld' : pts >= 500 ? 'Silver' : 'Brons';
      const next = tier === 'Brons' ? 500 : tier === 'Silver' ? 1000 : tier === 'Guld' ? 2000 : null;
      return {
        current_tier: tier,
        total_points: pts,
        points_to_next_tier: next,
        member_since: metadata.loyalty?.member_since || new Date().toISOString(),
      };
    })(),
    addresses: customer.addresses || [],
    favoriteProducts: metadata.wishlist || [],
  };

  if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
    const d = await ordersRes.value.json();
    data.orders = d.orders || [];
  }

  if (complaintsRes.status === 'fulfilled' && complaintsRes.value.ok) {
    const d = await complaintsRes.value.json();
    data.complaints = d.complaints || [];
  }

  return data;
}

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('medusa_token')?.value;

  if (!token) {
    redirect('/inlogg');
  }

  const accountData = await fetchAccountData(token);

  if (!accountData) {
    redirect('/inlogg');
  }

  return (
    <AccountProvider initialData={accountData}>
      {children}
    </AccountProvider>
  );
}
