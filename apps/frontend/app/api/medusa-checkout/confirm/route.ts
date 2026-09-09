const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const MEDUSA_PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

const h = {
  'Content-Type': 'application/json',
  'x-publishable-api-key': MEDUSA_PUB_KEY,
};

export async function POST(request: Request) {
  try {
    const { cartId, formData, total } = await request.json();

    if (!cartId) {
      return Response.json({ error: 'Saknar cartId' }, { status: 400 });
    }

    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, {
      method: 'POST',
      headers: h,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[medusa-confirm] complete failed:', err);
      return Response.json({ error: 'Kunde inte slutföra order' }, { status: 500 });
    }

    const data = await res.json();
    const order = data.order || data.data;
    const orderId = order?.display_id || order?.id?.slice(-8).toUpperCase() || 'N/A';
    const orderTotal = total || order?.total || 0;

    // Add loyalty points: 1 point per 20 kr spent
    const cookies = request.headers.get('cookie') || '';
    const tokenMatch = cookies.match(/medusa_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (token && orderTotal > 0) {
      try {
        const pointsEarned = Math.floor(orderTotal / 20);
        if (pointsEarned > 0) {
          const meRes = await fetch(`${MEDUSA_URL}/store/customers/me`, {
            headers: { 'Authorization': `Bearer ${token}`, 'x-publishable-api-key': MEDUSA_PUB_KEY },
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            const customer = meData.customer || meData;
            const currentPoints = customer.metadata?.loyalty?.total_points || 0;
            const memberSince = customer.metadata?.loyalty?.member_since || new Date().toISOString();
            await fetch(`${MEDUSA_URL}/store/customers/me`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-publishable-api-key': MEDUSA_PUB_KEY },
              body: JSON.stringify({ metadata: { loyalty: { total_points: currentPoints + pointsEarned, member_since: memberSince } } }),
            });
          }
        }
      } catch {}
    }

    return Response.json({ order });
  } catch (error) {
    console.error('[medusa-confirm] error:', error);
    return Response.json({ error: 'Internt fel' }, { status: 500 });
  }
}
