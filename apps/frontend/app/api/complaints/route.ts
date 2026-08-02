import { cookies } from "next/headers"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

async function sendComplaintEmails(customerName: string, customerEmail: string, orderId: string) {
  const caseNumber = `RK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const firstName = customerName.split(' ')[0];
  const submittedDate = new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' });

  await Promise.all([
    fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        to: [{ email: customerEmail }],
        templateId: 3,
        params: { firstName, caseNumber, orderNumber: orderId, submittedDate },
      }),
    }),
    fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        to: [{ email: 'info@techpilots.se' }],
        templateId: 6,
        params: {
          senderName: customerName,
          senderEmail: customerEmail,
          subject: `Ny reklamation ${caseNumber}`,
          message: `Order: ${orderId}\nReklamationsnummer: ${caseNumber}`,
        },
      }),
    }),
  ]);
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("medusa_token")?.value

    if (!token) return Response.json({ complaints: [] })

    // Get customer id
    const meRes = await fetch(`${MEDUSA_URL}/store/customers/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
    })

    if (!meRes.ok) return Response.json({ complaints: [] })

    const meData = await meRes.json()
    const customerId = meData.customer?.id || meData.id

    const res = await fetch(`${MEDUSA_URL}/store/complaints?customer_id=${customerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
    })

    if (!res.ok) return Response.json({ complaints: [] })

    const data = await res.json()
    return Response.json({ complaints: data.complaints || [] })
  } catch (error) {
    return Response.json({ complaints: [] })
  }
}

export async function POST(req: Request) {
  try {
    const { order_id, description } = await req.json()

    if (!order_id || !description) {
      return Response.json({ error: "Order ID and description are required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("medusa_token")?.value

    if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 })

    // Get customer id
    const meRes = await fetch(`${MEDUSA_URL}/store/customers/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
    })

    if (!meRes.ok) return Response.json({ error: "Failed to authenticate" }, { status: 401 })

    const meData = await meRes.json()
    const customer = meData.customer || meData
    const customerId = customer.id
    const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    const customerEmail = customer.email || ''

    const res = await fetch(`${MEDUSA_URL}/store/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ customer_id: customerId, order_id, description }),
    })

    if (!res.ok) return Response.json({ error: "Failed to save complaint" }, { status: res.status })

    const data = await res.json()

    if (customerEmail) {
      sendComplaintEmails(customerName, customerEmail, order_id).catch(() => {})
    }

    return Response.json({ complaint: data.complaint }, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
