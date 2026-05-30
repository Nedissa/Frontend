import { cookies } from "next/headers"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

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
    return Response.json({ complaint: data.complaint }, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
