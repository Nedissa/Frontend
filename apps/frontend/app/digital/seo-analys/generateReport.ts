import { jsPDF } from 'jspdf';
import { type SeoResult, recommendationFor } from './shared';

const GOLD = '#e8c547';
const DARK = '#030303';
const GRAY = '#686963';
const LIGHT_GRAY = [245, 245, 243] as const;

function sectionHeading(doc: jsPDF, title: string, margin: number, y: number): number {
  doc.setFillColor(GOLD);
  doc.rect(margin, y - 4, 3, 3, 'F');
  doc.setTextColor(DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(title.toUpperCase(), margin + 6, y);
  return y + 9;
}

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 275) {
    doc.addPage();
    return 24;
  }
  return y;
}

export function generateSeoReport(result: SeoResult) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 24;

  // Header
  doc.setFillColor(DARK);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Techpilots', margin, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(GOLD);
  doc.text('SEO-rapport', margin, 27);
  doc.setFontSize(8.5);
  doc.setTextColor(200, 200, 200);
  doc.text('Vad rapporten visar och varför det spelar roll för er verksamhet', margin, 34);

  y = 52;
  doc.setTextColor(DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(result.url, margin, y);

  const dateStr = new Date().toLocaleDateString('sv-SE');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(GRAY);
  doc.text(`Analyserad ${dateStr}`, pageWidth - margin, y, { align: 'right' });

  y += 16;

  // Poäng
  y = sectionHeading(doc, 'Helhetsbetyg', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(GRAY);
  const scoreIntro = doc.splitTextToSize('Google mäter fyra områden på en skala 0–100. Höga poäng betyder snabbare sidor, bättre synlighet i sökresultat och en smidigare upplevelse för besökarna.', pageWidth - margin * 2);
  doc.text(scoreIntro, margin, y);
  y += scoreIntro.length * 4.2 + 10;

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
    doc.circle(x, y, 13, 'S');
    doc.setTextColor(color);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(String(score), x, y + 4.5, { align: 'center' });
    doc.setTextColor(DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, x, y + 22, { align: 'center' });
  });

  y += 34;
  doc.setDrawColor(230, 230, 228);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 14;

  // Laddningsupplevelse
  y = sectionHeading(doc, 'Laddningsupplevelse', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(GRAY);
  const loadIntro = doc.splitTextToSize('Långsamma sidor gör att besökare lämnar innan de hunnit se innehållet — och Google sänker rankningen för sidor som laddar långsamt.', pageWidth - margin * 2);
  doc.text(loadIntro, margin, y);
  y += loadIntro.length * 4.2 + 8;

  const metrics: [string, string, string | null][] = [
    ['Tid till huvudinnehållet syns', 'Hur lång tid det tar innan det viktigaste innehållet syns. Under 2,5 s är bra.', result.metrics.lcp],
    ['Visuell stabilitet', 'Hur mycket sidan hoppar till medan den laddar. 0 betyder helt stilla.', result.metrics.cls],
    ['Tid till första intryck', 'Hur snabbt besökaren ser något alls på skärmen. Under 1,8 s är bra.', result.metrics.fcp],
  ];
  const cardWidth = (pageWidth - margin * 2 - 12) / 3;
  metrics.forEach(([label, desc, value], i) => {
    const x = margin + (cardWidth + 6) * i;
    const lines = doc.splitTextToSize(desc, cardWidth - 8);
    const cardHeight = 20 + lines.length * 3.6;

    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(x, y, cardWidth, cardHeight, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(DARK);
    const labelLines = doc.splitTextToSize(label, cardWidth - 8);
    doc.text(labelLines, x + 4, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(DARK);
    doc.text(value ?? '—', x + 4, y + 6 + labelLines.length * 3.6 + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(GRAY);
    doc.text(lines, x + 4, y + 6 + labelLines.length * 3.6 + 10);
  });

  y += 20 + Math.max(...metrics.map(([, desc]) => doc.splitTextToSize(desc, cardWidth - 8).length)) * 3.6 + 14;
  doc.setDrawColor(230, 230, 228);
  doc.line(margin, y, pageWidth - margin, y);
  y += 14;

  // GEO
  if (result.geo) {
    y = checkPageBreak(doc, y, 60);
    y = sectionHeading(doc, 'Synlighet för AI-assistenter', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(GRAY);
    const geoIntro = doc.splitTextToSize('Allt fler söker svar via ChatGPT, Claude och liknande verktyg istället för Google. Det här visar om er sida kan hittas och citeras av dem.', pageWidth - margin * 2);
    doc.text(geoIntro, margin, y);
    y += geoIntro.length * 4.2 + 9;

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

    geoChecks.forEach(([ok, title, desc]) => {
      const lines = doc.splitTextToSize(desc, pageWidth - margin * 2 - 10);
      y = checkPageBreak(doc, y, 6 + lines.length * 4 + 6);

      const markColor = ok ? '#3fb950' : '#e5484d';
      doc.setFillColor(markColor);
      doc.circle(margin + 2, y - 1.5, 2.2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(DARK);
      doc.text(title, margin + 8, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(GRAY);
      doc.text(lines, margin + 8, y);
      y += lines.length * 4 + 6;
    });

    y += 2;
    doc.setDrawColor(230, 230, 228);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;
  }

  // Rekommendationer
  y = checkPageBreak(doc, y, 40);
  y = sectionHeading(doc, 'Rekommendationer', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(GRAY);
  const recIntro = doc.splitTextToSize('Konkreta förbättringsområden baserat på resultatet ovan, i prioritetsordning efter vad som påverkar mest.', pageWidth - margin * 2);
  doc.text(recIntro, margin, y);
  y += recIntro.length * 4.2 + 9;

  scores.forEach(([label, score]) => {
    const rec = recommendationFor(label, score);
    const lines = doc.splitTextToSize(rec.text, pageWidth - margin * 2);
    y = checkPageBreak(doc, y, 6 + lines.length * 4.5 + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(DARK);
    doc.text(rec.label, margin, y);
    y += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(GRAY);
    doc.text(lines, margin, y);
    y += lines.length * 4.5 + 7;
  });

  // CTA
  y = checkPageBreak(doc, y, 32);
  y += 4;
  doc.setFillColor(DARK);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 2, 2, 'F');
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Vill ni förbättra dessa siffror?', margin + 8, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text('Boka en kostnadsfri genomgång: techpilots.se/digital/kontakt', margin + 8, y + 20);

  doc.save(`seo-rapport-${result.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}.pdf`);
}
