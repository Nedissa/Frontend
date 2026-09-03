import { jsPDF } from 'jspdf';
import { type SeoResult, recommendationFor } from './shared';

const GOLD = '#e8c547';
const DARK = '#030303';
const GRAY = '#686963';
const BORDER = [225, 225, 221] as const;
const CARD_BG = [250, 250, 249] as const;

function sectionHeading(doc: jsPDF, title: string, margin: number, y: number): number {
  doc.setFillColor(GOLD);
  doc.rect(margin, y - 3.5, 3, 3, 'F');
  doc.setTextColor(DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(title.toUpperCase(), margin + 6, y);
  return y + 8;
}

function drawScoreRing(doc: jsPDF, cx: number, cy: number, radius: number, score: number, color: string) {
  const lineWidth = 3.6;
  const segments = 64;
  const startAngle = -Math.PI / 2;

  doc.setDrawColor(...BORDER);
  doc.setLineWidth(lineWidth);
  doc.setLineCap('round');
  drawArc(doc, cx, cy, radius, 0, 2 * Math.PI, segments);

  if (score > 0) {
    doc.setDrawColor(color);
    const sweep = (score / 100) * 2 * Math.PI;
    drawArc(doc, cx, cy, radius, startAngle, startAngle + sweep, Math.max(2, Math.round((score / 100) * segments)));
  }
  doc.setLineCap('butt');
}

function drawArc(doc: jsPDF, cx: number, cy: number, radius: number, start: number, end: number, segments: number) {
  const step = (end - start) / segments;
  for (let i = 0; i < segments; i++) {
    const a1 = start + step * i;
    const a2 = start + step * (i + 1);
    doc.line(cx + radius * Math.cos(a1), cy + radius * Math.sin(a1), cx + radius * Math.cos(a2), cy + radius * Math.sin(a2));
  }
}

function divider(doc: jsPDF, margin: number, pageWidth: number, y: number): number {
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  return y + 12;
}

function checkPageBreak(doc: jsPDF, y: number, needed: number, margin: number): number {
  if (y + needed > 270) {
    doc.addPage();
    return margin + 4;
  }
  return y;
}

function drawFooter(doc: jsPDF, margin: number, pageWidth: number, pageHeight: number) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(GRAY);
    doc.text('Techpilots', margin, pageHeight - 9);
    doc.text(`${i} / ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
  }
}

export function generateSeoReport(result: SeoResult) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 24;

  // Header
  doc.setTextColor(DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.text('Techpilots', margin, 17);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor('#b8933a');
  doc.text('SEO-rapport', margin, 25.5);
  doc.setFontSize(8);
  doc.setTextColor(GRAY);
  doc.text('Vad rapporten visar och varför det spelar roll för er verksamhet', margin, 32);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.4);
  doc.line(margin, 38, pageWidth - margin, 38);

  y = 50;
  doc.setTextColor(DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.text(result.url, margin, y);

  const dateStr = new Date().toLocaleDateString('sv-SE');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(GRAY);
  doc.text(`Analyserad ${dateStr}`, pageWidth - margin, y, { align: 'right' });

  y += 13;

  // Poäng
  y = sectionHeading(doc, 'Helhetsbetyg', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(GRAY);
  const scoreIntro = doc.splitTextToSize('Google mäter fyra områden på en skala 0–100. Höga poäng betyder snabbare sidor, bättre synlighet i sökresultat och en smidigare upplevelse för besökarna.', pageWidth - margin * 2);
  doc.text(scoreIntro, margin, y);
  y += scoreIntro.length * 4 + 12;

  const scores: [string, number][] = [
    ['Prestanda', result.scores.performance],
    ['SEO', result.scores.seo],
    ['Tillgänglighet', result.scores.accessibility],
    ['Best practice', result.scores.bestPractices],
  ];

  const colWidth = (pageWidth - margin * 2) / 4;
  scores.forEach(([label, score], i) => {
    const x = margin + colWidth * i + colWidth / 2;
    const color = score >= 90 ? '#3fb950' : score >= 50 ? '#c99a2e' : '#e5484d';
    drawScoreRing(doc, x, y, 9, score, color);
    doc.setTextColor(color);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.text(String(score), x, y + 1.3, { align: 'center', baseline: 'middle' });
    doc.setTextColor(DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(label.toUpperCase(), x, y + 14, { align: 'center' });
  });

  y += 24;

  const avg = Math.round((result.scores.performance + result.scores.seo + result.scores.accessibility + result.scores.bestPractices) / 4);
  const weakest = scores.reduce((a, b) => (b[1] < a[1] ? b : a));
  const summaryText = avg >= 90
    ? `Sidan presterar mycket bra överlag med ett snitt på ${avg} av 100. Grunden är stabil inom samtliga områden.`
    : avg >= 70
      ? `Sidan presterar bra överlag med ett snitt på ${avg} av 100. Största förbättringsutrymmet finns inom ${weakest[0].toLowerCase()} (${weakest[1]} poäng).`
      : `Sidan har ett snitt på ${avg} av 100, vilket lämnar betydande utrymme för förbättring. Störst påverkan ger arbete med ${weakest[0].toLowerCase()} (${weakest[1]} poäng).`;
  doc.setFillColor(...CARD_BG);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.4);
  const summaryLines = doc.splitTextToSize(summaryText, pageWidth - margin * 2 - 10);
  const summaryHeight = 8 + summaryLines.length * 4.2;
  doc.roundedRect(margin, y, pageWidth - margin * 2, summaryHeight, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(DARK);
  doc.text(summaryLines, margin + 5, y + 6);
  y += summaryHeight + 12;

  y = divider(doc, margin, pageWidth, y);

  // Laddningsupplevelse
  y = sectionHeading(doc, 'Laddningsupplevelse', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(GRAY);
  const loadIntro = doc.splitTextToSize('Långsamma sidor gör att besökare lämnar innan de hunnit se innehållet, och Google sänker rankningen för sidor som laddar långsamt.', pageWidth - margin * 2);
  doc.text(loadIntro, margin, y);
  y += loadIntro.length * 4 + 8;

  const metrics: [string, string, string | null][] = [
    ['Tid till huvudinnehållet syns', 'Hur lång tid det tar innan det viktigaste innehållet syns. Under 2,5 s är bra.', result.metrics.lcp],
    ['Visuell stabilitet', 'Hur mycket sidan hoppar till medan den laddar. 0 betyder helt stilla.', result.metrics.cls],
    ['Tid till första intryck', 'Hur snabbt besökaren ser något alls på skärmen. Under 1,8 s är bra.', result.metrics.fcp],
  ];
  const cardGap = 6;
  const cardWidth = (pageWidth - margin * 2 - cardGap * 2) / 3;
  const cardHeights = metrics.map(([, desc]) => 22 + doc.splitTextToSize(desc, cardWidth - 9).length * 3.5);
  const cardHeight = Math.max(...cardHeights);

  metrics.forEach(([label, desc, value], i) => {
    const x = margin + (cardWidth + cardGap) * i;
    const lines = doc.splitTextToSize(desc, cardWidth - 9);

    doc.setFillColor(...CARD_BG);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    doc.setFillColor(GOLD);
    doc.rect(x, y, 2, cardHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(GRAY);
    const labelLines = doc.splitTextToSize(label.toUpperCase(), cardWidth - 9);
    doc.text(labelLines, x + 5, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(DARK);
    doc.text(value ?? '—', x + 5, y + 6 + labelLines.length * 3.5 + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.3);
    doc.setTextColor(GRAY);
    doc.text(lines, x + 5, y + 6 + labelLines.length * 3.5 + 11);
  });

  y += cardHeight + 12;
  y = divider(doc, margin, pageWidth, y);

  // GEO
  if (result.geo) {
    doc.addPage();
    y = margin + 4;
    y = sectionHeading(doc, 'Synlighet för AI-assistenter', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(GRAY);
    const geoIntro = doc.splitTextToSize('Allt fler söker svar via ChatGPT, Claude och liknande verktyg istället för Google. Det här visar om er sida kan hittas och citeras av dem.', pageWidth - margin * 2);
    doc.text(geoIntro, margin, y);
    y += geoIntro.length * 4 + 10;

    const geoChecks: [boolean, string, string][] = [
      [
        result.geo.blockedCrawlers.length === 0,
        result.geo.blockedCrawlers.length === 0 ? 'Sidan är inte blockerad för AI' : `${result.geo.blockedCrawlers.join(', ')} är blockerade`,
        result.geo.blockedCrawlers.length === 0
          ? 'ChatGPT, Claude och liknande AI-tjänster kan besöka och läsa sidan när de svarar på frågor.'
          : 'Dessa AI-tjänster nekas åtkomst helt, vilket betyder att er sida aldrig kan nämnas i deras svar, oavsett hur bra innehållet är.',
      ],
      [
        result.geo.visibleWithoutJs,
        result.geo.visibleWithoutJs ? 'AI ser samma innehåll som besökare' : 'AI kan se en tom sida',
        result.geo.visibleWithoutJs
          ? 'Texten finns tillgänglig direkt, så AI-tjänster kan läsa den utan problem, precis som en vanlig besökare.'
          : 'Vissa AI-tjänster laddar inte in innehåll som kräver JavaScript, och kan då missa allt som står på sidan.',
      ],
      [
        result.geo.hasStructuredData,
        result.geo.hasStructuredData ? 'Sidan förklarar sig själv för AI' : 'AI måste gissa vad sidan handlar om',
        result.geo.hasStructuredData
          ? 'Sidan har en maskinläsbar beskrivning av vad den handlar om, vilket minskar risken att AI missförstår eller feltolkar innehållet.'
          : 'Utan denna beskrivning måste AI-tjänster själva tolka sidans innehåll, vilket ökar risken för felaktig eller ofullständig information i deras svar.',
      ],
    ];

    geoChecks.forEach(([ok, title, desc], i) => {
      const lines = doc.splitTextToSize(desc, pageWidth - margin * 2 - 10);
      const blockHeight = 5 + 5 + lines.length * 3.8 + 5;
      y = checkPageBreak(doc, y, blockHeight, margin);

      const markColor = ok ? '#3fb950' : '#e5484d';
      doc.setFillColor(markColor);
      doc.circle(margin + 2, y - 1.3, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(DARK);
      doc.text(title, margin + 8, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.3);
      doc.setTextColor(GRAY);
      doc.text(lines, margin + 8, y);
      y += lines.length * 3.8 + (i < geoChecks.length - 1 ? 6 : 0);
    });

    y += 8;
    y = divider(doc, margin, pageWidth, y);
  }

  // Rekommendationer
  y = checkPageBreak(doc, y, 40, margin);
  y = sectionHeading(doc, 'Rekommendationer', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(GRAY);
  const recIntro = doc.splitTextToSize('Konkreta förbättringsområden baserat på resultatet ovan, i prioritetsordning efter vad som påverkar mest.', pageWidth - margin * 2);
  doc.text(recIntro, margin, y);
  y += recIntro.length * 4 + 10;

  scores.forEach(([label, score], i) => {
    const rec = recommendationFor(label, score);
    const lines = doc.splitTextToSize(rec.text, pageWidth - margin * 2 - 4);
    const blockHeight = 5.5 + lines.length * 4.2 + 6;
    y = checkPageBreak(doc, y, blockHeight, margin);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(DARK);
    doc.text(rec.label, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(GRAY);
    doc.text(lines, margin, y);
    y += lines.length * 4.2 + (i < scores.length - 1 ? 6 : 0);
  });

  // CTA
  y = checkPageBreak(doc, y, 32, margin);
  y += 6;
  doc.setFillColor(...CARD_BG);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 2, 2, 'FD');
  doc.setFillColor(GOLD);
  doc.rect(margin, y, 2, 26, 'F');
  doc.setTextColor(DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('Vill ni förbättra dessa siffror?', margin + 8, y + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(GRAY);
  doc.text('Boka en kostnadsfri genomgång: techpilots.se/digital/kontakt', margin + 8, y + 18.5);

  drawFooter(doc, margin, pageWidth, pageHeight);

  doc.save(`seo-rapport-${result.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}.pdf`);
}
