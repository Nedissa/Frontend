import { Stripe } from 'stripe';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://api.techpilots.se';
const MEDUSA_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
const REGION_ID = 'reg_01KTHS2MPSXRTVGRHVJRA8P703';

async function createMedusaOrder(session: Stripe.Checkout.Session) {
  const meta = session.metadata || {};
  const email = session.customer_email || '';
  const cartItemsRaw = meta.cartItems ? JSON.parse(meta.cartItems) : [];

  if (!cartItemsRaw.length) return null;

  // 1. Skapa cart
  const cartRes = await fetch(`${MEDUSA_URL}/store/carts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': MEDUSA_KEY },
    body: JSON.stringify({ region_id: REGION_ID, email }),
  });
  if (!cartRes.ok) return null;
  const { cart } = await cartRes.json();

  // 2. Lägg till produkter
  for (const item of cartItemsRaw) {
    if (!item.variantId) continue;
    await fetch(`${MEDUSA_URL}/store/carts/${cart.id}/line-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': MEDUSA_KEY },
      body: JSON.stringify({ variant_id: item.variantId, quantity: item.quantity }),
    });
  }

  // 3. Sätt leveransadress
  await fetch(`${MEDUSA_URL}/store/carts/${cart.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': MEDUSA_KEY },
    body: JSON.stringify({
      shipping_address: {
        first_name: meta.firstName || '',
        last_name: meta.lastName || '',
        address_1: meta.address || '',
        postal_code: meta.postalCode || '',
        city: meta.city || '',
        country_code: (meta.country || 'SE').toLowerCase(),
        phone: meta.phone || '',
      },
      email,
    }),
  });

  // 4. Slutför cart till order
  const completeRes = await fetch(`${MEDUSA_URL}/store/carts/${cart.id}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': MEDUSA_KEY },
  });
  if (!completeRes.ok) return null;
  const result = await completeRes.json();
  return result.order || result.cart;
}

async function sendOrderConfirmation(session: Stripe.Checkout.Session) {
  const meta = session.metadata || {};
  const email = session.customer_email || '';
  const name = `${meta.firstName || ''} ${meta.lastName || ''}`.trim();
  const address = `${meta.address || ''}, ${meta.postalCode || ''} ${meta.city || ''}`;
  const total = session.amount_total ? (session.amount_total / 100).toLocaleString('sv-SE') : '0';
  const orderId = session.id.slice(-8).toUpperCase();

  const customerHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-bottom:1px solid #e5e7eb;"><tr><td align="center" style="padding:20px 40px;">
        <img src="https://techpilots.se/logo.png" alt="" width="28" height="28" style="vertical-align:middle;display:inline-block;" /><span style="font-size:1.2rem;font-weight:800;color:#000;letter-spacing:-0.5px;vertical-align:middle;"> Techpilots</span>
      </td></tr></table>
      <div style="background:#ffffff;padding:40px;">
        <h1 style="font-size:1.4rem;font-weight:800;color:#000;margin:0 0 8px;">Tack för din beställning!</h1>
        <p style="font-size:0.95rem;color:#555;line-height:1.7;margin:0 0 24px;">Hej ${name}! Vi har tagit emot din order och packar den så snart som möjligt. Leverans sker normalt inom 2 till 5 arbetsdagar. Du får ett nytt mail med spårningsnummer när paketet är på väg.</p>
        <div style="background:#f4f4f4;border-radius:8px;padding:24px;margin:0 0 24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Ordernummer</td></tr>
            <tr><td style="padding:0 0 16px;font-size:1rem;font-weight:700;color:#000;">#${orderId}</td></tr>
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Leveransadress</td></tr>
            <tr><td style="padding:0 0 16px;font-size:0.9rem;color:#333;">${address}</td></tr>
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Totalt</td></tr>
            <tr><td style="padding:0;font-size:1.1rem;font-weight:800;color:#000;">${total} kr</td></tr>
          </table>
        </div>
        <p style="font-size:0.9rem;color:#555;line-height:1.7;margin:0 0 24px;">Har du frågor? Hör av dig till <a href="mailto:support@techpilots.se" style="color:#000;font-weight:600;">support@techpilots.se</a> eller ring 010-880 09 81.</p>
        <p style="font-size:0.9rem;color:#555;line-height:1.7;margin:0;">Med vänliga hälsningar,<br/><strong style="color:#000;">Teamet på Techpilots</strong></p>
      </div>
      <div style="padding:24px 40px;text-align:center;font-size:0.75rem;color:#aaa;border-top:1px solid #e5e7eb;">
        Techpilots AB &bull; Skogshyddegatan 37, 506 31 Borås &bull; support@techpilots.se
      </div>
    </div>
  `;

  const storeHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-bottom:1px solid #e5e7eb;"><tr><td align="center" style="padding:20px 40px;">
        <img src="https://techpilots.se/logo.png" alt="" width="28" height="28" style="vertical-align:middle;display:inline-block;" /><span style="font-size:1.2rem;font-weight:800;color:#000;letter-spacing:-0.5px;vertical-align:middle;"> Techpilots</span>
      </td></tr></table>
      <div style="background:#ffffff;padding:40px;">
        <h1 style="font-size:1.3rem;font-weight:800;color:#000;margin:0 0 24px;">Ny order inkommen</h1>
        <div style="background:#f4f4f4;border-radius:8px;padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Ordernummer</td></tr>
            <tr><td style="padding:0 0 16px;font-size:1rem;font-weight:700;color:#000;">#${orderId}</td></tr>
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Kund</td></tr>
            <tr><td style="padding:0 0 4px;font-size:0.9rem;font-weight:600;color:#000;">${name}</td></tr>
            <tr><td style="padding:0 0 16px;font-size:0.9rem;color:#555;">${email}</td></tr>
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Leveransadress</td></tr>
            <tr><td style="padding:0 0 16px;font-size:0.9rem;color:#333;">${address}</td></tr>
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Totalt</td></tr>
            <tr><td style="padding:0;font-size:1.2rem;font-weight:800;color:#000;">${total} kr</td></tr>
          </table>
        </div>
      </div>
    </div>
  `;

  await Promise.all([
    fetch(BREVO_API_URL, {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Techpilots', email: 'info@techpilots.se' },
        to: [{ email, name }],
        subject: `Orderbekräftelse #${orderId} - Techpilots`,
        htmlContent: customerHtml,
      }),
    }),
    fetch(BREVO_API_URL, {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Techpilots Order', email: 'info@techpilots.se' },
        to: [{ email: 'info@techpilots.se', name: 'Techpilots' }],
        subject: `Ny order #${orderId} - ${total} kr`,
        htmlContent: storeHtml,
      }),
    }),
  ]);
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === 'paid') {
      await Promise.all([
        sendOrderConfirmation(session),
        createMedusaOrder(session).catch(() => {}),
      ]);
    }
  }

  return Response.json({ received: true });
}
