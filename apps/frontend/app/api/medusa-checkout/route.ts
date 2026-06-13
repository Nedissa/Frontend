const MEDUSA_URL = 'https://api.techpilots.se';
const MEDUSA_PUB_KEY = 'pk_be1d32dae17bd54fa1b82b443354fc250d222284107fd067a30caf3cf2f49b8f';
const REGION_ID = 'reg_01KTHS2MPSXRTVGRHVJRA8P703';

const countryCodeMap: Record<string, string> = {
  'sverige': 'se', 'sweden': 'se',
  'norge': 'no', 'norway': 'no',
  'danmark': 'dk', 'denmark': 'dk',
  'finland': 'fi',
};

function toCountryCode(country: string): string {
  const lower = country.toLowerCase();
  return countryCodeMap[lower] || lower.slice(0, 2);
}

const h = {
  'Content-Type': 'application/json',
  'x-publishable-api-key': MEDUSA_PUB_KEY,
};

export async function POST(request: Request) {
  try {
    const { cartItems, formData, shippingOptionId } = await request.json();

    if (!cartItems?.length || !formData?.email) {
      return Response.json({ error: 'Saknar produkter eller e-post' }, { status: 400 });
    }

    // 1. Skapa cart
    const cartRes = await fetch(`${MEDUSA_URL}/store/carts`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ region_id: REGION_ID }),
    });
    if (!cartRes.ok) {
      const err = await cartRes.text();
      console.error('[medusa-checkout] cart create failed:', err);
      return Response.json({ error: 'Kunde inte skapa order' }, { status: 500 });
    }
    const { cart } = await cartRes.json();
    const cartId = cart.id;

    // 2. Lägg till produkter
    for (const item of cartItems) {
      const r = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
        method: 'POST',
        headers: h,
        body: JSON.stringify({ variant_id: item.variantId, quantity: item.quantity }),
      });
      if (!r.ok) console.error('[medusa-checkout] line-item failed:', item.variantId, await r.text());
    }

    // 3. Sätt email och leveransadress
    const updateRes = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({
        email: formData.email,
        shipping_address: {
          first_name: formData.firstName || '',
          last_name: formData.lastName || '',
          address_1: formData.address || '',
          postal_code: formData.postalCode || '',
          city: formData.city || '',
          country_code: toCountryCode(formData.country || 'sverige'),
          phone: formData.phone || '',
        },
      }),
    });
    if (!updateRes.ok) console.error('[medusa-checkout] cart update failed:', await updateRes.text());

    // 4. Välj fraktmetod
    if (shippingOptionId) {
      const sr = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/shipping-methods`, {
        method: 'POST',
        headers: h,
        body: JSON.stringify({ option_id: shippingOptionId }),
      });
      if (!sr.ok) console.error('[medusa-checkout] shipping failed:', await sr.text());
    }

    // 5. Skapa payment collection och initiera Stripe session
    const pcRes = await fetch(`${MEDUSA_URL}/store/payment-collections`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ cart_id: cartId }),
    });
    if (!pcRes.ok) {
      console.error('[medusa-checkout] payment-collection failed:', await pcRes.text());
      return Response.json({ error: 'Kunde inte initiera betalning' }, { status: 500 });
    }
    const { payment_collection } = await pcRes.json();

    // 6. Initiera payment session för Stripe
    const psRes = await fetch(
      `${MEDUSA_URL}/store/payment-collections/${payment_collection.id}/payment-sessions`,
      {
        method: 'POST',
        headers: h,
        body: JSON.stringify({ provider_id: 'pp_stripe_stripe' }),
      }
    );
    if (!psRes.ok) {
      console.error('[medusa-checkout] payment-session failed:', await psRes.text());
      return Response.json({ error: 'Kunde inte initiera Stripe' }, { status: 500 });
    }
    const psData = await psRes.json();
    const paymentSession = psData.payment_collection?.payment_sessions?.[0];
    const clientSecret = paymentSession?.data?.client_secret;

    if (!clientSecret) {
      console.error('[medusa-checkout] no client_secret in:', JSON.stringify(psData));
      return Response.json({ error: 'Ingen Stripe client secret' }, { status: 500 });
    }

    return Response.json({ clientSecret, cartId, paymentCollectionId: payment_collection.id });
  } catch (error) {
    console.error('[medusa-checkout] error:', error);
    return Response.json({ error: 'Internt fel' }, { status: 500 });
  }
}
