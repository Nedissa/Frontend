'use client';

import Link from 'next/link';
import { MainLayout } from '@/app/components/MainLayout';
import { InfoPageLayout } from '@/app/components/PageHero';

export default function TermsPage() {
  return (
    <MainLayout>

      <InfoPageLayout title="Försäljningsvillkor" description="Gäller från 1 januari 2025." updatedDate="6 juni 2026" version="1.0">
        <div className="space-y-8">

          <section>
            <h2 className="font-bold mb-4">1. Tillämplighet</h2>
            <p>
              Techpilots AB:s försäljningsvillkor gäller från och med 1 januari 2025 och ersätter tidigare publicerade försäljningsvillkor. Kund som beställer varor av Techpilots AB accepterar genom sin beställning dessa försäljningsvillkor.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">2. Priser</h2>
            <p className="mb-3">
              Samtliga priser i våra prislistor är angivna inklusive moms (25%). Alla priser är exklusive frakt där inget annat anges. Vi reserverar oss för prisfel och prisändringar på grund av ändrad moms, onormalt stora förändringar i valutaläget, inköpspriser, samt ändringar i eller förekomsten av nya lagstadgade avgifter samt andra förändringar utom vår kontroll.
            </p>
            <p className="mb-3">
              Vid uppenbart felaktigt prissatta varor förbehåller Techpilots AB sig rätten att annullera kundens beställning. Observera att offerter kan innehålla speciella avtal med priser som avviker från våra prislistor.
            </p>
            <p>
              Levererade varor förblir Techpilots AB:s egendom till dess full likvid erlagts.
            </p>
          </section>

          <section id="beställning">
            <h2 className="font-bold mb-4">3. Beställning</h2>
            <p className="mb-3">
              En beställning avlägges genom att fylla i beställningsformuläret på vår webbplats och genomföra en godkänd betalning. Vi skickar en orderbekräftelse per e-post.
            </p>
            <p className="mb-3">
              Vi förbehåller oss rätten att annullera beställning eller del av den om beställd vara är slutsåld.
            </p>
            <p>
              Vi förbehåller oss rätten att vägra beställningar från kunder under 18 år, beställningar med uppenbar felaktig prisinformation, beställningar som verkar misstänkta eller bedrägliga, eller leverans till länder där vi inte erbjuder leverans.
            </p>
          </section>

          <section id="betalning">
            <h2 className="font-bold mb-4">4. Betalning och betalningsvillkor</h2>
            <p className="mb-3">
              För konsumenter sker betalning med betalkort (Visa, Mastercard), Swish, PayPal eller Klarna. Betalningen måste genomföras för att beställningen ska behandlas.
            </p>
            <p className="mb-3">
              Vi använder säkra betalningslösningar som är PCI DSS-certifierade. Vi lagrar aldrig dina fullständiga betalningsuppgifter — alla transaktioner hanteras av tredjepartsbetalningsleverantörer.
            </p>
            <p>
              För försäljning till minderårig krävs målsmans skriftliga godkännande.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">5. Frakt och leverans</h2>
            <p className="mb-3">
              Leverans till konsumenter sker normalt genom PostNord MyPack Collect eller Home beroende på vikt och storlek, fritt vårt lager. Normal leveranstid är 1–3 arbetsdagar.
            </p>
            <p className="mb-3">
              Leveranstiderna är vägledande och inte garanterade. Vi är inte ansvariga för leveransförseningar på grund av force majeure.
            </p>
            <p>
              Risken för produkten övergår till dig när den levereras till den adress du angivit. Om en produkt går förlorad under transporten är den försäkrad för full värde.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">6. Fraktkostnad</h2>
            <p className="mb-3">För leverans debiteras fraktkostnader enligt vår fraktprislista:</p>
            <ul className="mb-3">
              <li>Standardleverans: Gratis</li>
              <li>Express-leverans: 199 SEK (beställ före 12:00)</li>
            </ul>
            <p>
              För försändelser som ej är utlösta debiteras en avgift om 249 kr inklusive moms.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">7. Transportskada</h2>
            <p className="mb-3">
              Det åligger kunden att kontrollera leveransen vid mottagandet. Om godset verkar skadat på grund av skadat emballage, packa alltid upp och kontrollera själva varan.
            </p>
            <p>
              Vid transportskadad vara ska kunden omgående kontakta PostNord och reklamera godset. Kontakta sedan Techpilots AB på +46 10 880 09 81 eller support@techpilots.se och uppge order- eller fakturanummer samt reklamationsnummer från speditören.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">8. Ångerrätt (konsument)</h2>
            <p className="mb-3">
              Techpilots AB tillämpar <strong>30 dagars öppet köp</strong> från det att du mottagit din order. Detta är mer generöst än det lagstadgade minimikravet och gäller alla köp i vår webbutik.
            </p>
            <p className="mb-3">
              En konsument har rätt att öppna och kontrollera varan i den utsträckning som krävs för att bedöma om konsumenten är nöjd med varan. Ångerrätt gäller inte förbrukningsvaror, kroppsnära produkter, hygienartiklar (t.ex. in-ear hörlurar), spel, digitala produkter eller presentkort.
            </p>
            <p className="mb-3">
              För en enklare hantering bör kund innan återsändandet göra en returanmälan via support@techpilots.se varvid kunden erhåller en returfraktsedel. Observera att erhållande av returnummer ej utgör ett godkännande av ångerrätt.
            </p>
            <p>
              Vid fullt godkännande av ångerrätt återbetalas hela beloppet kunden betalt för varan. Återbetalning sker inom 14 dagar. Se vår detaljerade <Link href="/returpolicy" className="underline hover:opacity-70">returpolicy</Link> för fullständiga instruktioner.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">9. Garanti</h2>
            <p className="mb-3">
              Du har som konsument enligt lag rätt att reklamera ursprungliga fel på produkten i upp till tre år. Om din produkt går sönder inom tre år från köpdatumet, kan du vända dig till oss för en bedömning.
            </p>
            <p className="mb-3">
              Under de första två åren är det vi som ansvarar för att bevisa om felet var ursprungligt eller inte. Garantin innebär att vi reparerar eller byter ut en defekt produkt inom garantitiden, förutsatt att felet inte orsakats av yttre påverkan eller handhavandefel.
            </p>
            <p>
              Garantin gäller endast inom Sverige. Vi ansvarar inte för mjukvara eller följdfel som uppstår på grund av defekt eller felaktigt använd programvara.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">10. Reklamation</h2>
            <p className="mb-3">
              I enlighet med svensk lagstiftning har konsumenter rätt att reklamera varor som var felaktiga vid överlämnandet av varan inom 3 år från inköpsdatum. Meddelande om reklamation ska lämnas inom skälig tid (en reklamation som görs inom 2 månader från att felet upptäcktes anses alltid vara gjord i rätt tid).
            </p>
            <p>
              För att hantera ett reklamationsärende bör kund göra en felanmälan på support@techpilots.se med ordernummer och beskrivning av felet.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">11. Ansvar och ansvarsbegränsningar</h2>
            <p className="mb-3">
              Föreligger det fel som Techpilots AB ansvarar för, åtar sig Techpilots AB att avhjälpa felet genom antingen avhjälpande av fel, omleverans eller i vissa fall prisavdrag eller hävning.
            </p>
            <p className="mb-3">
              Techpilots AB:s ansvar gentemot kund är begränsat till det belopp som motsvarar inköpspriset för aktuell vara. Techpilots AB ansvarar inte för indirekta skador eller följdskador.
            </p>
            <p>
              Vid eventuell tvist följer vi beslut från Allmänna Reklamationsnämnden (ARN) eller motsvarande tvistlösningsorgan.
            </p>
          </section>

          <section id="dataskydd">
            <h2 className="font-bold mb-4">12. Dataskydd</h2>
            <p>
              Vi behandlar din personliga data enligt EU:s dataskyddsförordning (GDPR). Din information används endast för att genomföra dina beställningar och förbättra vår service. Vi delar aldrig din personliga data med tredjeparter utan ditt samtycke, förutom vid leverans och betalningshantering.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">13. Immateriell egendom</h2>
            <p>
              All innehåll på Techpilots webbplats, inklusive texter, bilder, logotyper och grafik, är skyddat av upphovsrätt och andra intellektuella rättigheter. Du får inte reproducera, distribuera eller använda något innehåll från vår webbplats utan vårt skriftliga tillstånd.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">14. Force majeure</h2>
            <p>
              Techpilots AB är inte ansvarigt för skada till följd av strejk, eldsvåda, myndighetsutövning, arbetstvister, olyckshändelser, fel eller försening av underleverantör, driftstopp eller andra omständigheter utanför Techpilots AB:s kontroll. Om force majeure kvarstår under en period som överstiger 2 månader har såväl kunden som Techpilots AB rätt att säga upp avtalet utan påföljder.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">15. Tillämplig lag och tvister</h2>
            <p className="mb-3">
              Dessa villkor regleras av svensk lag. Tvist gällande tolkningen eller tillämpningen av dessa villkor ska tolkas i enlighet med svensk rätt.
            </p>
            <p>
              Om en tvist inte kan lösas i samförstånd mellan konsument och Techpilots AB kan konsumenten vända sig till Allmänna Reklamationsnämnden (ARN), Box 174, 101 23 Stockholm, eller online via europa.eu/consumers/odr
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">16. Kontaktinformation</h2>
            <p className="mb-1"><strong>Techpilots AB</strong></p>
            <p className="mb-1">Skogshyddegatan 37, 506 31 Borås, Sverige</p>
            <p className="mb-1"><strong>Telefon:</strong> +46 10 880 09 81</p>
            <p className="mb-1"><strong>E-post:</strong> support@techpilots.se</p>
            <p><strong>Öppettider:</strong> Mån-Fre 09:00 - 17:00</p>
          </section>

        </div>
      </InfoPageLayout>
    </MainLayout>
  );
}
