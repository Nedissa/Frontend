import { type SeoResult } from '../seo-analys/shared';

function CheckRow({ ok, title, desc }: { ok: boolean; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-[10px]">
      <span
        className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 mt-[1px]"
        style={{ background: ok ? '#3fb950' : '#e5484d', color: '#fff' }}
        aria-hidden="true"
      >
        {ok ? '✓' : '✕'}
      </span>
      <div>
        <div className="text-[13px] font-semibold" style={{ color: '#030303' }}>{title}</div>
        <div className="text-[12px] leading-[1.4]" style={{ color: 'rgb(104,105,99)' }}>{desc}</div>
      </div>
    </div>
  );
}

export function GeoChecklist({ geo }: { geo: NonNullable<SeoResult['geo']> }) {
  return (
    <div>
      <div className="flex flex-col gap-[12px]">
        <CheckRow
          ok={geo.blockedCrawlers.length === 0}
          title={geo.blockedCrawlers.length === 0 ? 'Sidan är inte blockerad för AI' : `${geo.blockedCrawlers.join(', ')} är blockerade`}
          desc={geo.blockedCrawlers.length === 0
            ? 'ChatGPT, Claude och liknande AI-tjänster kan besöka och läsa sidan när de svarar på frågor.'
            : 'Dessa AI-tjänster nekas åtkomst helt, vilket betyder att er sida aldrig kan nämnas i deras svar, oavsett hur bra innehållet är.'}
        />
        <CheckRow
          ok={geo.visibleWithoutJs}
          title={geo.visibleWithoutJs ? 'AI ser samma innehåll som besökare' : 'AI kan se en tom sida'}
          desc={geo.visibleWithoutJs
            ? 'Texten finns tillgänglig direkt, så AI-tjänster kan läsa den utan problem, precis som en vanlig besökare.'
            : 'Vissa AI-tjänster laddar inte in innehåll som kräver JavaScript, och kan då missa allt som står på sidan.'}
        />
        <CheckRow
          ok={geo.hasStructuredData}
          title={geo.hasStructuredData ? 'Sidan förklarar sig själv för AI' : 'AI måste gissa vad sidan handlar om'}
          desc={geo.hasStructuredData
            ? 'Sidan har en maskinläsbar beskrivning av vad den handlar om, vilket minskar risken att AI missförstår eller feltolkar innehållet.'
            : 'Utan denna beskrivning måste AI-tjänster själva tolka sidans innehåll, vilket ökar risken för felaktig eller ofullständig information i deras svar.'}
        />
      </div>
    </div>
  );
}
