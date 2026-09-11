'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV = [
  {
    id: 'villkor',
    label: 'Villkor',
    links: [
      { id: 'affarsvillkor', label: 'Affärsvillkor' },
      { id: 'integritet', label: 'Integritetspolicy' },
      { id: 'cookies', label: 'Cookiepolicy' },
    ],
  },
  {
    id: 'ansvar',
    label: 'Ansvar & säkerhet',
    links: [
      { id: 'miljoansvar', label: 'Miljöansvar' },
      { id: 'kryptering', label: 'Kryptering' },
      { id: 'tillganglighet', label: 'Tillgänglighet' },
    ],
  },
];

function Sidebar({ active, navigate }: { active: string; navigate: (id: string) => void }) {
  const [open, setOpen] = useState<string | null>(NAV[0].id);
  const [prevActive, setPrevActive] = useState(active);

  // Öppna rätt sektion under render (inte i effect) när active ändras utifrån
  if (active !== prevActive) {
    setPrevActive(active);
    const parentCat = NAV.find(cat => cat.links.some(l => l.id === active))?.id;
    if (parentCat) setOpen(parentCat);
  }

  const toggle = (id: string) => setOpen(prev => prev === id ? null : id);

  return (
    <aside className="w-full md:w-[220px] md:flex-shrink-0" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <nav>
        {NAV.map(cat => {
          const isOpen = open === cat.id;
          return (
            <div key={cat.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <button
                onClick={() => toggle(cat.id)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: 600, color: '#111', textAlign: 'left',
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                {cat.label}
                <span style={{ fontSize: '0.7rem', color: '#999' }}>{isOpen ? '▲' : '▼'}</span>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ paddingBottom: '8px' }}>
                    {cat.links.map(link => {
                      const isActive = active === link.id;
                      return (
                        <div
                          key={link.id}
                          style={{
                            borderLeft: isActive ? '2px solid #000' : '2px solid transparent',
                            transition: 'border-color 150ms ease',
                          }}
                        >
                          <button
                            onClick={() => navigate(link.id)}
                            style={{
                              display: 'block', width: '100%', textAlign: 'left',
                              padding: '7px 10px 7px 10px', fontSize: '0.82rem',
                              color: isActive ? '#000' : '#555',
                              fontWeight: isActive ? 700 : 400,
                              background: 'none', border: 'none', outline: 'none',
                              cursor: 'pointer',
                              fontFamily: "'Manrope', sans-serif",
                              transition: 'color 150ms ease',
                            }}
                          >
                            {link.label}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

const SUBTITLES: Record<string, string> = {
  affarsvillkor: 'Våra affärsvillkor för uppdrag och samarbeten.',
  integritet: 'Hur vi hanterar och skyddar personuppgifter.',
  cookies: 'Information om cookies och hur vi använder dem.',
  miljoansvar: 'Hur vi tar ansvar för miljön i vårt arbete.',
  kryptering: 'Hur vi skyddar er data och er webbplats.',
  tillganglighet: 'Hur vi arbetar med digital tillgänglighet enligt WCAG.',
};

export default function WebstudioCustomerServicePage() {
  const [active, setActive] = useState('affarsvillkor');
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const seg = window.location.pathname.split('/digital/villkor/')[1];
    // eslint-disable-next-line react-hooks/set-state-in-effect -- läser URL-path vid mount, kan inte beräknas server-side
    if (seg) setActive(seg);
  }, []);

  const navigate = (id: string) => {
    setActive(id);
    setAnimKey(k => k + 1);
    window.history.pushState(null, '', `/digital/villkor/${id}`);
    // På mobil är sidomenyn ovanför innehållet — glid ner till texten direkt
    // vid val, annars ser det ut som att inget hände förrän man scrollar själv.
    // Väntar två rAF-cykler så React hinner rendera det nya innehållet (och
    // Sidebar hunnit expandera/kollapsa sina kategorier) innan vi mäter var
    // elementet faktiskt hamnar — annars scrollar vi mot gammal layout.
    if (window.innerWidth < 768) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById('villkor-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ background: '#fff', fontFamily: "'Manrope', sans-serif" }}>
      <style>{`
        @keyframes ks-fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ks-content { animation: ks-fade 0.22s ease forwards; }
        .ks-content h2 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; color: #000; }
        .ks-content h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.4rem; margin-top: 1.2rem; color: #000; }
        .ks-content p  { font-size: 0.9rem; line-height: 1.75; margin-bottom: 0.5rem; color: #000; }
      `}</style>

      <div className="flex flex-col md:flex-row" style={{ maxWidth: '1100px', margin: '0 auto', padding: '160px 24px 100px', gap: '48px', alignItems: 'flex-start' }}>

        <Sidebar active={active} navigate={navigate} />

        <div id="villkor-content" style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#000', marginBottom: '6px' }}>
            {NAV.flatMap(c => c.links).find(l => l.id === active)?.label ?? 'Villkor'}
          </h1>
          <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '20px' }}>{SUBTITLES[active]}</p>

          <div key={animKey} className="ks-content" style={{ padding: '32px 40px', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

            {active === 'affarsvillkor' && (
              <div>
                <h2>Allmänna Villkor</h2>
                <p>Gäller från 1 januari 2025. Dessa villkor reglerar avtal mellan Techpilots AB, org.nr 559385-5346 (&quot;Techpilots&quot;), och kund som anlitar företagets tjänster.</p>

                <h3>1. Allmänna Bestämmelser</h3>
                <p>1.1 Dessa allmänna villkor gäller för alla tjänster som tillhandahålls av Techpilots som webbyrå och reglerar förhållandet mellan företaget och kunden.</p>
                <p>1.2 Genom att anlita företagets tjänster accepterar kunden dessa villkor i sin helhet. Eventuella avvikelser från dessa villkor kräver skriftligt godkännande från båda parter.</p>
                <p>1.3 Dessa villkor kan komma att ändras av Techpilots. Ändringar gäller för nya avtal från publiceringsdatum. Pågående uppdrag löper på de villkor som gällde vid avtalets ingående, om inget annat överenskommits.</p>

                <h3>2. Tjänster</h3>
                <p>2.1 Techpilots erbjuder olika typer av digitala tjänster och webblösningar, inklusive men inte begränsat till:</p>
                <p>Webbdesign och utveckling av hemsidor.</p>
                <p>UX/UI-design och prototypframtagning.</p>
                <p>Webbutveckling i CMS-plattformar som Wordpress, Webflow, Framer &amp; Shopify.</p>
                <p>E-handelsutveckling och integrationer.</p>
                <p>Digital marknadsföring och sökmotoroptimering (SEO).</p>
                <p>Underhåll, hosting och supporttjänster.</p>
                <p>Strategisk rådgivning kring digitala lösningar.</p>
                <p>2.2 Företaget strävar efter att tillhandahålla tjänster av hög kvalitet och i tid, men tider för färdigställande kan variera beroende på projektets omfattning och kundens specifika behov.</p>
                <p>2.3 Specifika tjänster kan anpassas efter kundens krav och önskemål, vilket kan medföra ytterligare kostnader som då kommer att kommuniceras och faktureras separat.</p>

                <h3>3. Priser och Betalning</h3>
                <p>3.1 Priser för tjänster anges i offerten och inkluderar moms om inget annat anges. Priserna kan baseras på antingen timtaxa eller fasta priser beroende på avtal. MOMS-NR: SE870101109301</p>
                <p>3.2 Faktura skickas efter avslutat arbete eller enligt överenskommelse. Betalning ska ske inom 14 dagar efter fakturadatum, om inget annat överenskommits.</p>
                <p>3.3 Om betalning inte sker inom förfallodagen tillkommer dröjsmålsränta enligt räntelagen (SFS 1975:635), vilket innebär referensräntan fastställd av Riksbanken plus 8 procentenheter.</p>
                <p>3.4 Vid utebliven betalning efter påminnelse har företaget rätt att ta ut påminnelseavgift och vid behov vidta inkassoåtgärder.</p>
                <p>3.5 Vid förskottsbetalning eller delbetalningsöverenskommelser ska dessa avtalas och bekräftas skriftligen.</p>
                <p>3.6 Betalning kan ske via faktura, kort eller Swish enligt överenskommelse i offert. Vid delbetalning faktureras normalt 50 procent vid projektstart och resterande belopp vid godkänd leverans.</p>

                <h3>4. Kundens Ansvar</h3>
                <p>4.1 Kunden ansvarar för att tillhandahålla korrekt och fullständig information om projektets omfattning och krav för att Techpilots ska kunna utföra tjänsterna effektivt.</p>
                <p>4.2 Kunden ska tillhandahålla nödvändigt material, såsom logotyper, texter och bilder, i tid för att företaget ska kunna hålla projektets tidsplan.</p>
                <p>4.3 Kunden ansvarar för att granska och godkänna design och funktionalitet innan lansering. Eventuella ändringar efter godkänd leverans kan medföra ytterligare kostnader.</p>
                <p>4.4 Kunden ska själv ansvara för att säkerhetskopiera befintlig data och innehåll innan Techpilots påbörjar arbete på webbplatsen.</p>

                <h3>5. Immaterialrätt</h3>
                <p>5.1 Kunden erhåller full äganderätt till det slutgiltiga, godkända och fullt betalda arbetsresultatet, såsom design, kod och innehåll som tagits fram specifikt för kunden, om inget annat avtalats.</p>
                <p>5.2 Techpilots behåller äganderätten till egna verktyg, ramverk, komponenter och metoder som utvecklats innan eller oberoende av uppdraget, samt till generella lösningar som återanvänds mellan kunder. Kunden erhåller en icke-exklusiv nyttjanderätt till sådant material i den levererade lösningen.</p>
                <p>5.3 Material som tillhandahålls av tredje part, exempelvis premiumteman, typsnitt, bildbanksbilder eller pluginlicenser, omfattas av respektive leverantörs licensvillkor. Techpilots ansvarar inte för begränsningar i sådana licenser.</p>
                <p>5.4 Techpilots förbehåller sig rätten att omnämna genomförda uppdrag i sin portfölj och marknadsföring, inklusive skärmbilder av levererat arbete, om inget annat skriftligen överenskommits.</p>

                <h3>6. Ansvarsbegränsning</h3>
                <p>6.1 Techpilots ansvarar för att levererat arbete uppfyller den specifikation som avtalats i offert eller projektplan.</p>
                <p>6.2 Techpilots ansvarar inte för indirekta skador eller följdskador, såsom utebliven vinst, förlorad data eller driftavbrott, som uppstår genom användning av den levererade produkten.</p>
                <p>6.3 Techpilots totala skadeståndsansvar för ett enskilt uppdrag är begränsat till det belopp kunden har betalat för uppdraget, om inte skadan orsakats av grov vårdslöshet eller uppsåt.</p>
                <p>6.4 Techpilots ansvarar inte för fel eller skador som uppstår till följd av ändringar som kunden eller tredje part gjort i den levererade lösningen efter godkänd leverans.</p>

                <h3>7. Garanti och Reklamation</h3>
                <p>7.1 Techpilots garanterar att levererat arbete vid leveranstillfället är fritt från väsentliga fel i förhållande till avtalad specifikation.</p>
                <p>7.2 Kunden ska reklamera fel inom skälig tid efter det att felet upptäckts eller borde ha upptäckts. Fel som fanns vid leveranstillfället och reklameras i tid åtgärdas kostnadsfritt av Techpilots.</p>
                <p>7.3 Är kunden näringsidkare gäller allmän preskriptionstid enligt preskriptionslagen (SFS 1981:130), om inte kortare reklamationsfrist avtalats i offert eller separat avtal. Är kunden konsument gäller konsumenttjänstlagens tvingande bestämmelser om reklamationsrätt.</p>
                <p>7.4 Garantin omfattar inte fel som uppstått på grund av kundens egna ändringar, tredjepartsintegrationer, bristande underhåll eller normal teknisk utveckling hos externa plattformar och webbläsare.</p>
                <p>7.5 Löpande underhåll, säkerhetsuppdateringar och support utöver garantin regleras i separat avtal där sådant tecknats.</p>

                <h3>8. Underleverantörer</h3>
                <p>8.1 Techpilots har rätt att anlita underleverantörer och frilansande specialister för att utföra delar av ett uppdrag.</p>
                <p>8.2 Techpilots ansvarar gentemot kunden för underleverantörers arbete som för eget arbete.</p>
                <p>8.3 Underleverantörer omfattas av samma krav på sekretess och dataskydd som gäller för Techpilots enligt dessa villkor och gällande lag.</p>

                <h3>9. Uppsägning av Avtal</h3>
                <p>9.1 Löpande avtal, såsom underhåll och hosting, kan sägas upp av endera part med en uppsägningstid om 30 dagar, om inget annat avtalats.</p>
                <p>9.2 Enskilda projektuppdrag kan avbrytas i förtid av kunden mot ersättning för nedlagt arbete och kostnader fram till avbrottsdagen.</p>
                <p>9.3 Techpilots har rätt att avsluta ett uppdrag med omedelbar verkan om kunden är i väsentligt dröjsmål med betalning eller på annat sätt väsentligt bryter mot dessa villkor.</p>
                <p>9.4 Vid uppsägning av hostingavtal ansvarar kunden själv för att i tid begära ut och flytta sitt material till annan leverantör.</p>

                <h3>10. Force Majeure</h3>
                <p>10.1 Techpilots är befriad från ansvar för förlust, skada eller försening som uppstår på grund av omständigheter utanför företagets kontroll, inklusive men inte begränsat till naturkatastrofer, krig, pandemier, strejker, brand, explosioner, myndighetsbeslut eller omfattande tekniska fel.</p>
                <p>10.2 Vid force majeure-situationer har företaget rätt att förlänga leveranstiden eller i vissa fall avsluta avtalet utan att bli skadeståndsskyldigt.</p>
                <p>10.3 Om force majeure-förhållanden varar längre än tre månader har båda parter rätt att häva avtalet.</p>

                <h3>11. Tvistelösning</h3>
                <p>11.1 Vid tvist mellan Techpilots och kunden ska parterna i första hand försöka lösa tvisten genom förhandling. Om en lösning inte nås ska tvisten avgöras av svensk domstol med tillämpning av svensk rätt. Är kunden konsument kan tvisten även prövas av Allmänna reklamationsnämnden, Box 174, 101 23 Stockholm, arn.se.</p>

                <h3>12. Kontakt</h3>
                <p>Techpilots AB · Skogshyddegatan 37, 506 31 Borås · +46 10 880 09 81 · info@techpilots.se</p>
              </div>
            )}

            {active === 'cookies' && (
              <div>
                <h2>Cookiepolicy</h2>
                <p>Denna policy förklarar hur Techpilots AB använder cookies och liknande tekniker på techpilots.se, i enlighet med lagen om elektronisk kommunikation.</p>

                <h3>Vad är cookies?</h3>
                <p>Cookies är små textfiler som lagras i din webbläsare. De används för att webbplatsen ska fungera korrekt och för att vi ska förstå hur besökare använder sajten.</p>

                <h3>Nödvändiga cookies</h3>
                <p>Krävs för grundläggande funktioner, t.ex. navigering och formulär. Rättslig grund: berättigat intresse att tillhandahålla en fungerande webbplats. Kan inte stängas av. Lagras normalt under sessionen eller upp till 1 år.</p>

                <h3>Analyscookies</h3>
                <p>Vi använder Google Analytics för att föra statistik över besök och användning i syfte att förbättra webbplatsen. Rättslig grund: samtycke. Lagringstid upp till 14 månader. Du kan när som helst dra tillbaka ditt samtycke.</p>

                <h3>Tredjepartscookies</h3>
                <p>Vissa cookies sätts av tredje part (t.ex. Google) i samband med analys. Dessa parter kan behandla uppgifterna enligt sina egna integritetspolicyer.</p>

                <h3>Hantera dina val</h3>
                <p>Du kan ge, ändra eller återkalla ditt samtycke via vår cookiebanner, eller blockera cookies i din webbläsares inställningar. Observera att vissa funktioner kan sluta fungera om nödvändiga cookies blockeras.</p>

                <h3>Kontakt</h3>
                <p>Frågor om denna policy? Kontakta oss på info@techpilots.se.</p>
              </div>
            )}

            {active === 'kryptering' && (
              <div>
                <h2>Kryptering och säkerhet</h2>
                <h3>SSL-kryptering</h3>
                <p>Alla webbplatser vi bygger och driftar levereras med SSL-kryptering (HTTPS) som standard, vilket innebär att all kommunikation mellan besökaren och servern är krypterad och skyddad.</p>
                <h3>Säker hosting</h3>
                <p>Vi driftar våra kunders webbplatser på övervakad infrastruktur med regelbundna säkerhetsuppdateringar och backup-rutiner.</p>
                <h3>Betalningslösningar</h3>
                <p>I projekt där betalningsfunktioner ingår integrerar vi certifierade, PCI DSS-kompatibla betalningsleverantörer. Techpilots lagrar aldrig kortuppgifter på egna servrar.</p>
                <h3>Er data</h3>
                <p>Vi delar aldrig kunddata med tredje part utan samtycke, förutom vad som krävs för att leverera tjänsten eller enligt lag.</p>
              </div>
            )}

            {active === 'integritet' && (
              <div>
                <h2>Techpilots skyddar dina personuppgifter</h2>
                <p>Techpilots är personuppgiftsansvarig för behandlingen av personuppgifter som beskrivs i denna integritetspolicy. Här förklarar vi vilken typ av personuppgifter vi samlar in och hur vi behandlar dem. Denna integritetspolicy gäller för Techpilots.se.</p>

                <h3>Personuppgiftsansvarig</h3>
                <p>Techpilots AB, org.nr 559385-5346, Skogshyddegatan 37, 506 31 Borås.</p>

                <h3>Personuppgifter som vi samlar in och behandlar</h3>
                <p>Vi behandlar följande kategorier av personuppgifter:</p>
                <p>Grundläggande information: namn, födelsedatum</p>
                <p>Kontaktinformation: adress, telefonnummer, e-postadress</p>
                <p>Konto- och profilinformation: inställningar, preferenser</p>
                <p>Betalningsinformation: transaktionsinformation, betalningsmedel</p>
                <p>Kundhistorik och kundengagemang: beställnings- och leveransinformation, kundvagnsrörelser, rabattkoder, lojalitetsprograminformation</p>
                <p>Aktiva produkter och avtal: produkter och tjänster som du använder, samt historik om tidigare användning</p>
                <p>Kundaktivitet: läs- och handlingshistorik från appen, webbplatser eller elektronisk kommunikation vi skickar ut</p>
                <p>Teknisk information: om enheter du använder</p>
                <p>Cookies: se vår <Link href="/digital/villkor/cookies" style={{ color: '#000', textDecoration: 'underline' }}>cookiepolicy</Link>.</p>

                <h3>Hur vi använder personuppgifter</h3>

                <h3>I samband med leverans av tjänst/avtal</h3>
                <p>Vi använder dina personuppgifter för att uppfylla våra avtal med dig, till exempel när du har beställt en produkt eller tjänst från oss. Behandlingen är nödvändig för att fullfölja avtalet.</p>

                <h3>Hantering av kundrelationer</h3>
                <p>Vi använder personuppgifter för att hantera vår kundrelation, såsom kundtjänst, klagomålshantering och felsökning. Behandlingen är nödvändig för att fullfölja avtalet.</p>

                <h3>Analys och affärsutveckling</h3>
                <p>Vi analyserar personuppgifter, som kundaktivitet och historik, för att förbättra våra tjänster och produkter. Behandlingen baseras på vårt berättigade intresse att utveckla verksamheten.</p>

                <h3>Anpassad användarupplevelse</h3>
                <p>Vi använder personuppgifter för att anpassa din upplevelse och kommunikation utifrån din kundrelation. Behandlingen baseras på vårt berättigade intresse.</p>

                <h3>Försäljning och marknadsföring</h3>
                <p>Vi använder dina personuppgifter för att marknadsföra våra produkter och tjänster, till exempel genom e-postkommunikation. Du kan reservera dig från delar av denna behandling, som att få e-post från oss. Vi kan även be om samtycke för profilering, där vi använder dina uppgifter för att skapa mer relevant marknadsföring.</p>

                <h3>Systemövervakning och felsökning</h3>
                <p>Vi övervakar våra system för att identifiera fel och problem, vilket kan innebära behandling av personuppgifter. Detta görs för att säkerställa systemens funktionalitet och är baserat på vårt berättigade intresse.</p>

                <h3>Säkerhet och skydd mot bedrägeri</h3>
                <p>Vi behandlar personuppgifter för att skydda våra användare och oss själva mot bedrägerier, missbruk och annan kriminell verksamhet. Behandlingen baseras på vårt berättigade intresse.</p>

                <h3>Följa rättsliga åtaganden</h3>
                <p>I vissa fall är vi skyldiga att behandla personuppgifter för att följa rättsliga åtaganden, exempelvis enligt bokföringslagen. Behandlingen baseras på att det är nödvändigt för att uppfylla rättsliga krav.</p>

                <h3>Dina rättigheter</h3>
                <p>Om du vill utöva någon av dina rättigheter, vänligen kontakta oss på info@techpilots.se.</p>

                <h3>Rätt till insyn i egna uppgifter</h3>
                <p>Du kan begära en kopia av alla uppgifter vi behandlar om dig. Kontakta oss för att utnyttja din insynsrätt.</p>

                <h3>Rätt till rättelse av personuppgifter</h3>
                <p>Du har rätt att begära att vi rättar eller kompletterar felaktiga eller vilseledande uppgifter.</p>

                <h3>Rätt till radering av personuppgifter</h3>
                <p>Du har rätt att få dina personuppgifter raderade utan dröjsmål. Vänligen notera att vi kan vara skyldiga att behålla viss information enligt andra rättsliga åtaganden (t.ex. bokföringslagen).</p>

                <h3>Begränsning av behandling av personuppgifter</h3>
                <p>I vissa situationer kan du begära att vi begränsar behandlingen av dina personuppgifter.</p>

                <h3>Protestera mot behandling av personuppgifter</h3>
                <p>Om vi behandlar uppgifter baserat på vårt berättigade intresse eller en intresseavvägning, har du rätt att protestera mot vår behandling.</p>

                <h3>Dataportabilitet</h3>
                <p>Du har rätt att få ut dina personuppgifter i ett strukturerat, allmänt använt och maskinläsbart format. Kontakta oss för att erhålla detta.</p>

                <h3>Klagomål på vår behandling av personuppgifter</h3>
                <p>Om du anser att vi inte följer dataskyddsförordningen (GDPR), ber vi dig att i första hand kontakta oss. Du har även rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY), imy.se.</p>

                <h3>Lagringstid</h3>
                <p>Vi sparar personuppgifter så länge det behövs för respektive ändamål. Uppgifter kopplade till avtal och fakturering sparas i 7 år enligt bokföringslagen. Uppgifter från kontaktformulär utan efterföljande uppdrag gallras normalt inom 24 månader.</p>

                <p>Tack för att du väljer Techpilots! Vi är här för att skydda dina personuppgifter och säkerställa att dina rättigheter respekteras.</p>
              </div>
            )}

            {active === 'miljoansvar' && (
              <div>
                <h2>Miljöansvar</h2>
                <h3>Vår syn på miljö</h3>
                <p>Vi strävar efter att bygga webbplatser som är resurseffektiva, både i utveckling och i drift.</p>
                <h3>Effektiv kod</h3>
                <p>Vi optimerar bilder, kod och hosting för lägre energiförbrukning per sidvisning.</p>
                <h3>Digitalt först</h3>
                <p>Genom att digitalisera processer hjälper vi våra kunder minska pappersanvändning och fysisk logistik.</p>
              </div>
            )}

            {active === 'tillganglighet' && (
              <div>
                <h2>Tillgänglighet</h2>
                <h3>Vår ambition</h3>
                <p>Vi strävar efter att webbplatser vi bygger ska vara tillgängliga för alla, oavsett funktionsvariation. Vi arbetar mot WCAG 2.1 nivå AA.</p>
                <h3>Vad är WCAG?</h3>
                <p>WCAG (Web Content Accessibility Guidelines) är riktlinjer framtagna av W3C, indelade i nivåerna A, AA och AAA. Nivå AA är standard för de flesta webbplatser och lagkrav för offentliga aktörer inom EU.</p>
                <h3>Vad vi gör</h3>
                <p>Vi arbetar med kontrast, tangentbordsnavigering, skärmläsarkompatibilitet och tydliga textalternativ i alla projekt vi levererar.</p>
                <h3>Rapportera problem</h3>
                <p>Upplever du tillgänglighetsproblem på en webbplats vi byggt? Kontakta oss på info@techpilots.se.</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
