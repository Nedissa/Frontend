import { Stripe } from 'stripe';

// Order confirmation emails are sent by the backend order-placed subscriber (templateId: 1).
// This webhook only needs to validate the Stripe signature and acknowledge the event.

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET saknas');
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[webhook] ogiltig signatur:', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  return Response.json({ received: true });
}
