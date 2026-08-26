import { NextRequest, NextResponse } from 'next/server';

// PageSpeed Insights-analysen tar ofta 15-45s — utan detta kapar Vercel Hobby-planen requesten efter 10s.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Ingen URL angavs.' }, { status: 400 });
  }

  let targetUrl: string;
  try {
    targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`).toString();
  } catch {
    return NextResponse.json({ error: 'Ogiltig URL.' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'SEO-analysen är inte konfigurerad ännu.' }, { status: 503 });
  }

  const psiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  psiUrl.searchParams.set('url', targetUrl);
  psiUrl.searchParams.set('key', apiKey);
  psiUrl.searchParams.set('strategy', 'mobile');
  psiUrl.searchParams.append('category', 'performance');
  psiUrl.searchParams.append('category', 'seo');
  psiUrl.searchParams.append('category', 'accessibility');
  psiUrl.searchParams.append('category', 'best-practices');

  let res: Response;
  try {
    res = await fetch(psiUrl.toString(), { signal: AbortSignal.timeout(55_000) });
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return NextResponse.json({ error: 'Analysen tog för lång tid. Försök igen om en liten stund.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Kunde inte nå analystjänsten. Försök igen.' }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: 'Kunde inte analysera sidan. Kontrollera att URL:en är korrekt och publikt tillgänglig.' }, { status: 502 });
  }

  const data = await res.json();
  const categories = data.lighthouseResult?.categories;
  const audits = data.lighthouseResult?.audits;

  if (!categories) {
    return NextResponse.json({ error: 'Kunde inte tolka analysresultatet.' }, { status: 502 });
  }

  return NextResponse.json({
    url: targetUrl,
    scores: {
      performance: Math.round((categories.performance?.score ?? 0) * 100),
      seo: Math.round((categories.seo?.score ?? 0) * 100),
      accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score ?? 0) * 100),
    },
    metrics: {
      lcp: audits?.['largest-contentful-paint']?.displayValue ?? null,
      cls: audits?.['cumulative-layout-shift']?.displayValue ?? null,
      fcp: audits?.['first-contentful-paint']?.displayValue ?? null,
    },
  });
}
