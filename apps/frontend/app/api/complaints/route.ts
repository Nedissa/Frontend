import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("medusa_token")?.value

    if (!authToken) {
      return Response.json({ complaints: [] })
    }

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    const customerRes = await fetch(`${backendUrl}/store/customers/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-publishable-api-key": publishableKey!,
      },
    })

    if (!customerRes.ok) return Response.json({ complaints: [] })

    const customerData = await customerRes.json()
    const customerId = customerData.customer?.id || customerData.id

    const complaintsRes = await fetch(
      `${backendUrl}/store/complaints?customer_id=${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-publishable-api-key": publishableKey!,
        },
      }
    )

    if (!complaintsRes.ok) return Response.json({ complaints: [] })

    const data = await complaintsRes.json()
    return Response.json({ complaints: data.complaints || [] })
  } catch (error) {
    return Response.json({ complaints: [] })
  }
}

export async function POST(req: Request) {
  try {
    const { order_id, description } = await req.json()

    if (!order_id || !description) {
      return Response.json(
        { error: "Order ID and description are required" },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const authToken = cookieStore.get("medusa_token")?.value

    if (!authToken) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (!backendUrl || !publishableKey) {
      return Response.json(
        { error: "Backend configuration missing" },
        { status: 500 }
      )
    }

    // Get customer info
    const getResponse = await fetch(
      `${backendUrl}/store/customers/me`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-publishable-api-key": publishableKey,
        },
      }
    )

    if (!getResponse.ok) {
      return Response.json(
        { error: "Failed to authenticate" },
        { status: 401 }
      )
    }

    const customerData = await getResponse.json()
    const customerId = customerData.customer?.id || customerData.id

    // Save complaint via Store API
    const complaintResponse = await fetch(
      `${backendUrl}/store/complaints`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          "x-publishable-api-key": publishableKey,
        },
        body: JSON.stringify({
          customer_id: customerId,
          order_id,
          description,
        }),
      }
    )

    if (!complaintResponse.ok) {
      return Response.json(
        { error: "Failed to save complaint" },
        { status: complaintResponse.status }
      )
    }

    const complaintData = await complaintResponse.json()
    return Response.json({ complaint: complaintData.complaint }, { status: 201 })
  } catch (error) {
    console.error("Complaint API error:", error)
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
