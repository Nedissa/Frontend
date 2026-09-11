const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.techpilots.se';

export type PagespeedResult = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  geoBlockedCrawlers?: string[];
  geoVisibleWithoutJs?: boolean;
  geoHasStructuredData?: boolean;
  measuredAt: string;
};

export type PagespeedResults = {
  mobile: PagespeedResult | null;
  desktop: PagespeedResult | null;
};

async function fetchPagespeedResult(slug: string, strategy: 'mobile' | 'desktop'): Promise<PagespeedResult | null> {
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/pagespeed-results?where[projectSlug][equals]=${encodeURIComponent(slug)}&where[strategy][equals]=${strategy}&limit=1`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPagespeedResults(slug: string): Promise<PagespeedResults> {
  const [mobile, desktop] = await Promise.all([
    fetchPagespeedResult(slug, 'mobile'),
    fetchPagespeedResult(slug, 'desktop'),
  ]);
  return { mobile, desktop };
}
