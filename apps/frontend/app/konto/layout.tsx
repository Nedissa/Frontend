import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import KontoPageClient from './page.client';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

async function fetchKontoData(token: string) {
  try {
    const [meRes, ordersRes, complaintsRes, loyaltyRes, addressesRes, favoritesRes] = await Promise.allSettled([
      fetch(`${MEDUSA_URL}/store/customers/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': PUBLISHABLE_KEY || '',
        },
      }),
      fetch(`${MEDUSA_URL}/store/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': PUBLISHABLE_KEY || '',
        },
      }),
      fetch('http://localhost:3000/api/complaints', {
        headers: { 'Authorization': `Bearer ${token}` },
      }),
      fetch('http://localhost:3000/api/loyalty', {
        headers: { 'Authorization': `Bearer ${token}` },
      }),
      fetch('http://localhost:3000/api/auth/addresses', {
        headers: { 'Authorization': `Bearer ${token}` },
      }),
      fetch('http://localhost:3000/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` },
      }),
    ]);

    const data: any = {};

    if (meRes.status === 'fulfilled' && meRes.value.ok) {
      const meData = await meRes.value.json();
      const customer = meData.customer || meData;
      data.profile = {
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        phone: customer.phone,
      };
    }

    if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
      const ordersData = await ordersRes.value.json();
      data.orders = ordersData.orders || [];
    } else {
      data.orders = [];
    }

    if (complaintsRes.status === 'fulfilled' && complaintsRes.value.ok) {
      const complaintsData = await complaintsRes.value.json();
      data.complaints = complaintsData.complaints || [];
    } else {
      data.complaints = [];
    }

    if (loyaltyRes.status === 'fulfilled' && loyaltyRes.value.ok) {
      const loyaltyData = await loyaltyRes.value.json();
      data.loyalty = loyaltyData.loyalty || {};
    } else {
      data.loyalty = {};
    }

    if (addressesRes.status === 'fulfilled' && addressesRes.value.ok) {
      const addressesData = await addressesRes.value.json();
      data.addresses = addressesData.addresses || [];
    } else {
      data.addresses = [];
    }

    if (favoritesRes.status === 'fulfilled' && favoritesRes.value.ok) {
      const favoritesData = await favoritesRes.value.json();
      data.favoriteProducts = favoritesData.favorites || [];
    } else {
      data.favoriteProducts = [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching konto data:', error);
    return null;
  }
}

export default async function KontoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('medusa_token')?.value;

  if (!authToken) {
    redirect('/inlogg');
  }

  const kontoData = await fetchKontoData(authToken);

  if (!kontoData) {
    redirect('/inlogg');
  }

  return (
    <KontoPageClient initialData={kontoData}>
      {children}
    </KontoPageClient>
  );
}
