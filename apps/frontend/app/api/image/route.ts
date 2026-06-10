const ALLOWED_HOSTS = [
  'api.techpilots.se',
  'techpilots.se',
  'localhost',
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return new Response('Invalid url', { status: 400 });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return new Response('Invalid url', { status: 400 });
    }

    if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
      return new Response('Invalid url', { status: 400 });
    }

    const response = await fetch(imageUrl, {
      next: { revalidate: 86400 }
    });

    if (!response.ok) {
      return new Response('Failed to fetch image', { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/webp';

    if (!contentType.startsWith('image/')) {
      return new Response('Invalid content type', { status: 400 });
    }

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch {
    return new Response('Internal server error', { status: 500 });
  }
}
