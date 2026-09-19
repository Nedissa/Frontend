import { cookies } from "next/headers"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

export async function POST(req: Request) {
  try {
    const { order_id, tracking_number } = await req.json()

    if (!order_id || !tracking_number) {
      return Response.json({ error: "Order ID and tracking number are required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("medusa_token")?.value

    if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 })

    const res = await fetch(`${MEDUSA_URL}/store/orders/${order_id}/return-tracking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ tracking_number }),
    })

    if (!res.ok) {
      const error = await res.text()
      return Response.json({ error: error || "Failed to save return tracking number" }, { status: res.status })
    }

    const data = await res.json()
    return Response.json({ order: data.order })
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
