export function SectionHeader({ num, label, extra, hasVisibleHeading, noBorder }: { num: string; label: string; extra?: string; hasVisibleHeading?: boolean; noBorder?: boolean }) {
  return (
    <>
      {/* Visuellt dold h2 för sektioner som saknar en egen synlig rubrik längre
          ner (ProcessStatsSection, PlatformsSection, FaqSection) — annars hoppar
          DOM-hierarkin rakt till h3/h4 utan en föregående h2. Sektioner som redan
          har en synlig <h2> skickar hasVisibleHeading för att undvika dubblett. */}
      {!hasVisibleHeading && <h2 className="sr-only">{label}</h2>}
      {/* noBorder: sektioner med egen fullbredds-bakgrund lägger sin egen border-t
          på den yttre full-bredd-diven istället, så linjen matchar bakgrundens
          faktiska bredd snarare än den här content-bredda diven. */}
      {!noBorder && <div style={{ borderBottom: '1px solid rgb(230,230,230)' }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', marginBottom: '60px', fontSize: '14px', color: 'rgb(104,105,99)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', background: '#030303', display: 'inline-block', transform: 'rotate(45deg)' }} />
          ({num})
        </span>
        <span>({label})</span>
        {extra && <span>{extra}</span>}
      </div>
    </>
  );
}
