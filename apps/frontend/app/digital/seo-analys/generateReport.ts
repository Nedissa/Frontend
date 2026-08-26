import { jsPDF } from 'jspdf';

type Result = {
  url: string;
  scores: { performance: number; seo: number; accessibility: number; bestPractices: number };
  metrics: { lcp: string | null; cls: string | null; fcp: string | null };
};

const GOLD = '#e8c547';
const DARK = '#030303';
const GRAY = '#686963';

type Recommendation = { label: string; text: string };

function recommendationFor(category: string, score: number): Recommendation {
  const good: Record<string, string> = {
    Prestanda: 'Sidan laddar snabbt. Fortsätt hålla koll på bildstorlekar och tredjepartsskript vid framtida uppdateringar.',
    SEO: 'Grundläggande SEO-struktur är på plats. Fortsatt arbete med innehåll och länkbygge stärker positionen ytterligare.',
    Tillgänglighet: 'Sidan är väl anpassad för skärmläsare och andra hjälpmedel.',
    'Best practices': 'Sidan följer moderna webbstandarder för säkerhet och kodkvalitet.',
  };
  const okay: Record<string, string> = {
    Prestanda: 'Det finns utrymme att förbättra laddtiden, t.ex. genom bildoptimering och minskad JavaScript-belastning.',
    SEO: 'Grunderna finns, men strukturerad data, metataggar eller innehållsdjup kan förbättras för bättre synlighet.',
    Tillgänglighet: 'Vissa tillgänglighetsförbättringar rekommenderas, t.ex. kontrast eller alt-texter.',
    'Best practices': 'Några mindre avvikelser från best practices, t.ex. föråldrade bibliotek eller saknade säkerhetsheaders.',
  };
  const bad: Record<string, string> = {
    Prestanda: 'Sidan laddar långsamt, vilket påverkar både användarupplevelse och sökrankning. Detta är ofta den enskilt viktigaste faktorn att åtgärda.',
    SEO: 'Flera grundläggande SEO-faktorer saknas eller är felaktiga, vilket gör det svårare att synas i sökresultat.',
    Tillgänglighet: 'Sidan har tillgänglighetsproblem som kan utestänga besökare som använder hjälpmedel.',
    'Best practices': 'Flera moderna webbstandarder följs inte, vilket kan påverka säkerhet och långsiktig underhållbarhet.',
  };

  const set = score >= 90 ? good : score >= 50 ? okay : bad;
  return { label: category, text: set[category] };
}

export function generateSeoReport(result: Result) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 24;

  doc.setFillColor(DARK);
  doc.rect(0, 0, pageWidth, 38, 'F');
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Techpilots', margin, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(GOLD);
  doc.text('SEO-rapport', margin, 27);

  y = 50;
  doc.setTextColor(DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Resultat för', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(result.url, margin, y + 7);

  const dateStr = new Date().toLocaleDateString('sv-SE');
  doc.setFontSize(10);
  doc.setTextColor(GRAY);
  doc.text(`Analyserad: ${dateStr}`, pageWidth - margin, y, { align: 'right' });

  y += 20;

  const scores: [string, number][] = [
    ['Prestanda', result.scores.performance],
    ['SEO', result.scores.seo],
    ['Tillgänglighet', result.scores.accessibility],
    ['Best practices', result.scores.bestPractices],
  ];

  const colWidth = (pageWidth - margin * 2) / 4;
  scores.forEach(([label, score], i) => {
    const x = margin + colWidth * i + colWidth / 2;
    const color = score >= 90 ? '#3fb950' : score >= 50 ? '#c99a2e' : '#e5484d';
    doc.setDrawColor(color);
    doc.setLineWidth(1.2);
    doc.circle(x, y, 12, 'S');
    doc.setTextColor(color);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(String(score), x, y + 4, { align: 'center' });
    doc.setTextColor(GRAY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(label, x, y + 20, { align: 'center' });
  });

  y += 36;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  doc.setTextColor(DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Mätvärden', margin, y);
  y += 8;

  const metrics: [string, string | null][] = [
    ['Largest Contentful Paint', result.metrics.lcp],
    ['Cumulative Layout Shift', result.metrics.cls],
    ['First Contentful Paint', result.metrics.fcp],
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  metrics.forEach(([label, value]) => {
    doc.setTextColor(GRAY);
    doc.text(label, margin, y);
    doc.setTextColor(DARK);
    doc.text(value ?? '—', pageWidth - margin, y, { align: 'right' });
    y += 7;
  });

  y += 8;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  doc.setTextColor(DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Rekommendationer', margin, y);
  y += 9;

  scores.forEach(([label, score]) => {
    const rec = recommendationFor(label, score);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(DARK);
    doc.text(rec.label, margin, y);
    y += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(GRAY);
    const lines = doc.splitTextToSize(rec.text, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 4.5 + 6;
  });

  y += 6;
  doc.setFillColor(DARK);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 2, 2, 'F');
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Vill ni förbättra dessa siffror?', margin + 8, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text('Boka en kostnadsfri genomgång: techpilots.se/digital/kontakt', margin + 8, y + 19);

  doc.save(`seo-rapport-${result.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}.pdf`);
}
