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

  const geo = await analyzeGeo(targetUrl);

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
    geo,
  });
}

const AI_CRAWLERS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];
// Under denna textmängd i rå HTML räknas sidan som huvudsakligen JS-renderad —
// AI-agenter som inte kör JavaScript ser då i praktiken en tom sida.
const MIN_TEXT_LENGTH_WITHOUT_JS = 200;

async function analyzeGeo(targetUrl: string) {
  const origin = new URL(targetUrl).origin;

  const [robotsResult, htmlResult] = await Promise.allSettled([
    fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(10_000) }),
    fetch(targetUrl, { signal: AbortSignal.timeout(15_000), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechpilotsSeoBot/1.0)' } }),
  ]);

  let blockedCrawlers: string[] = [];
  if (robotsResult.status === 'fulfilled' && robotsResult.value.ok) {
    const robotsText = await robotsResult.value.text();
    blockedCrawlers = findBlockedCrawlers(robotsText);
  }

  let visibleWithoutJs = true;
  let hasStructuredData = false;
  if (htmlResult.status === 'fulfilled' && htmlResult.value.ok) {
    const html = await htmlResult.value.text();
    const textLength = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim().length;
    visibleWithoutJs = textLength >= MIN_TEXT_LENGTH_WITHOUT_JS;
    hasStructuredData = /application\/ld\+json/i.test(html);
  }

  return { blockedCrawlers, visibleWithoutJs, hasStructuredData };
}

function findBlockedCrawlers(robotsText: string): string[] {
  const blocked: string[] = [];
  const lines = robotsText.split('\n').map((l) => l.trim());
  let currentAgent: string | null = null;

  for (const line of lines) {
    const agentMatch = line.match(/^User-agent:\s*(.+)$/i);
    if (agentMatch) {
      currentAgent = agentMatch[1].trim();
      continue;
    }
    const disallowMatch = line.match(/^Disallow:\s*(.+)$/i);
    if (disallowMatch && currentAgent && disallowMatch[1].trim() === '/') {
      const matchedBot = AI_CRAWLERS.find((bot) => bot.toLowerCase() === currentAgent!.toLowerCase());
      if (matchedBot && !blocked.includes(matchedBot)) blocked.push(matchedBot);
    }
  }

  return blocked;
}
