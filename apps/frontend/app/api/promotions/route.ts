const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const MEDUSA_API_KEY = process.env.MEDUSA_ADMIN_API_KEY || '';

export async function GET() {
  try {
    const response = await fetch(`${MEDUSA_URL}/admin/campaigns?limit=100`, {
      headers: {
        'Authorization': `Bearer ${MEDUSA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return Response.json({ campaigns: [] });
    }

    const data = await response.json();
    const campaigns = (data.campaigns || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      starts_at: c.starts_at,
      ends_at: c.ends_at,
    }));

    return Response.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return Response.json({ campaigns: [] });
  }
}
