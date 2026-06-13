import { cookies } from "next/headers"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendComplaintEmails(customerName: string, customerEmail: string, orderId: string, description: string) {
  const caseId = `RK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const customerHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;">
      <div style="background:#ffffff;padding:20px 40px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;gap:4px;">
        <img src="https://techpilots.se/logo.png" alt="Techpilots" width="32" height="32" style="display:inline-block;" />
        <span style="font-size:1.3rem;font-weight:800;color:#000;letter-spacing:-0.5px;">Techpilots</span>
      </div>
      <div style="background:#ffffff;padding:40px;">
        <h1 style="font-size:1.4rem;font-weight:800;color:#000;margin:0 0 8px;">Vi har tagit emot din reklamation</h1>
        <p style="font-size:0.95rem;color:#555;line-height:1.7;margin:0 0 24px;">Hej ${customerName}! Vi har tagit emot ditt ärende och återkommer inom 1 till 2 arbetsdagar med mer information.</p>
        <div style="background:#f4f4f4;border-radius:8px;padding:24px;margin:0 0 24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Ärendenummer</td></tr>
            <tr><td style="padding:0 0 16px;font-size:1rem;font-weight:700;color:#000;">#${caseId}</td></tr>
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Ordernummer</td></tr>
            <tr><td style="padding:0 0 16px;font-size:0.9rem;color:#333;">${orderId}</td></tr>
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Status</td></tr>
            <tr><td style="padding:0;font-size:0.9rem;font-weight:600;color:#000;">Mottagen, granskas av vårt team</td></tr>
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
      <div style="background:#ffffff;padding:20px 40px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;gap:4px;">
        <img src="https://techpilots.se/logo.png" alt="Techpilots" width="32" height="32" style="display:inline-block;" />
        <span style="font-size:1.3rem;font-weight:800;color:#000;letter-spacing:-0.5px;">Techpilots</span>
      </div>
      <div style="background:#ffffff;padding:40px;">
        <h1 style="font-size:1.3rem;font-weight:800;color:#000;margin:0 0 24px;">Ny reklamation inkommen</h1>
        <div style="background:#f4f4f4;border-radius:8px;padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Ärendenummer</td></tr>
            <tr><td style="padding:0 0 16px;font-size:1rem;font-weight:700;color:#000;">#${caseId}</td></tr>
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Kund</td></tr>
            <tr><td style="padding:0 0 4px;font-size:0.9rem;font-weight:600;color:#000;">${customerName}</td></tr>
            <tr><td style="padding:0 0 16px;font-size:0.9rem;color:#555;">${customerEmail}</td></tr>
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Ordernummer</td></tr>
            <tr><td style="padding:0 0 16px;font-size:0.9rem;font-weight:700;color:#000;">${orderId}</td></tr>
            <tr><td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Beskrivning</td></tr>
            <tr><td style="padding:0;font-size:0.9rem;color:#333;line-height:1.6;">${description}</td></tr>
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
        to: [{ email: customerEmail, name: customerName }],
        subject: `Reklamation mottagen #${caseId} - Techpilots`,
        htmlContent: customerHtml,
      }),
    }),
    fetch(BREVO_API_URL, {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Techpilots Reklamation', email: 'info@techpilots.se' },
        to: [{ email: 'info@techpilots.se', name: 'Techpilots' }],
        subject: `Ny reklamation #${caseId} från ${customerName}`,
        htmlContent: storeHtml,
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
    const customerId = meData.customer?.id || meData.id

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

    const customerName = `${meData.customer?.first_name || ''} ${meData.customer?.last_name || ''}`.trim()
    const customerEmail = meData.customer?.email || ''
    sendComplaintEmails(customerName, customerEmail, order_id, description).catch(() => {})

    return Response.json({ complaint: data.complaint }, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
