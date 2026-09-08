import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '@/app/digital/projekt-data';

export const maxDuration = 300;

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.techpilots.se';
const STRATEGIES = ['mobile', 'desktop'] as const;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_PAGESPEED_API_KEY saknas' }, { status: 503 });
  }

  const results: { slug: string; strategy: string; ok: boolean; error?: string }[] = [];

  for (const project of PROJECTS) {
    if (!project.website) continue;
    const targetUrl = project.website.startsWith('http') ? project.website : `https://${project.website}`;

    for (const strategy of STRATEGIES) {
      try {
        const measured = await runPagespeed(targetUrl, strategy, apiKey);
        const geo = strategy === 'mobile' ? await analyzeGeo(targetUrl) : undefined;
        await ingestResult({
          projectSlug: project.slug,
          website: project.website,
          strategy,
          ...measured,
          ...(geo && {
            geoBlockedCrawlers: geo.blockedCrawlers,
            geoVisibleWithoutJs: geo.visibleWithoutJs,
            geoHasStructuredData: geo.hasStructuredData,
          }),
          measuredAt: new Date().toISOString(),
        });
        results.push({ slug: project.slug, strategy, ok: true });
      } catch (err) {
        results.push({
          slug: project.slug,
          strategy,
          ok: false,
          error: err instanceof Error ? err.message : 'Okänt fel',
        });
      }
    }
  }

  return NextResponse.json({ results });
}

async function runPagespeed(targetUrl: string, strategy: 'mobile' | 'desktop', apiKey: string) {
  const psiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  psiUrl.searchParams.set('url', targetUrl);
  psiUrl.searchParams.set('key', apiKey);
  psiUrl.searchParams.set('strategy', strategy);
  psiUrl.searchParams.append('category', 'performance');
  psiUrl.searchParams.append('category', 'seo');
  psiUrl.searchParams.append('category', 'accessibility');
  psiUrl.searchParams.append('category', 'best-practices');

  const res = await fetch(psiUrl.toString(), { signal: AbortSignal.timeout(55_000) });
  if (!res.ok) throw new Error(`PageSpeed API svarade ${res.status} för ${targetUrl} (${strategy})`);

  const data = await res.json();
  const categories = data.lighthouseResult?.categories;
  const audits = data.lighthouseResult?.audits;
  if (!categories) throw new Error(`Kunde inte tolka resultat för ${targetUrl} (${strategy})`);

  return {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((categories['best-practices']?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
    lcp: audits?.['largest-contentful-paint']?.numericValue ?? undefined,
    cls: audits?.['cumulative-layout-shift']?.numericValue ?? undefined,
    tbt: audits?.['total-blocking-time']?.numericValue ?? undefined,
    fcp: audits?.['first-contentful-paint']?.numericValue ?? undefined,
  };
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

async function ingestResult(data: Record<string, unknown>) {
  const res = await fetch(`${PAYLOAD_URL}/api/pagespeed-results/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-cron-secret': process.env.CRON_SECRET || '',
    },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Payload ingest svarade ${res.status}`);
}
