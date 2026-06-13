const MEDUSA_URL = 'https://api.techpilots.se';
const MEDUSA_PUB_KEY = 'pk_be1d32dae17bd54fa1b82b443354fc250d222284107fd067a30caf3cf2f49b8f';

const h = {
  'Content-Type': 'application/json',
  'x-publishable-api-key': MEDUSA_PUB_KEY,
};

export async function POST(request: Request) {
  try {
    const { cartId } = await request.json();

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

    return Response.json({ order });
  } catch (error) {
    console.error('[medusa-confirm] error:', error);
    return Response.json({ error: 'Internt fel' }, { status: 500 });
  }
}
