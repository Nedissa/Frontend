'use client';

import Link from 'next/link';
import { MainLayout } from '@/app/components/MainLayout';
import { InfoPageLayout } from '@/app/components/PageHero';

export default function FAQPage() {
  return (
    <MainLayout>

      <InfoPageLayout title="Vanliga frågor" description="Svar på de mest ställda frågorna." updatedDate="6 juni 2026" version="1.0">
        <div className="space-y-8">

          <section>
            <h2 className="font-bold mb-4">1. Beställning</h2>
            <h3 className="font-bold mb-1">Hur gör jag en beställning?</h3>
            <p className="mb-4">Att beställa hos Techpilots är enkelt. Lägg produkter i din varukorg, gå till kassan, fyll i dina uppgifter och välj betalningsmetod. Du får omedelbar orderbekräftelse via e-mail.</p>
            <h3 className="font-bold mb-1">Kan jag ändra min beställning efter att jag lagt den?</h3>
            <p className="mb-4">Om din beställning inte redan har skickats kan vi hjälpa dig att ändra den. Kontakta omedelbart support@techpilots.se eller ring +46 10 880 09 81 så löser vi det.</p>
            <h3 className="font-bold mb-1">Måste jag ha ett konto för att beställa?</h3>
            <p className="mb-4">Ja, du behöver registrera dig för att kunna beställa hos oss. Det tar bara några minuter och gör det enkelt att spåra dina beställningar.</p>
            <h3 className="font-bold mb-1">Kan jag lägga till eller ta bort produkter från min beställning?</h3>
            <p>Ja, om beställningen inte redan skickats kan vi justera den. Kontakta oss så snabbt som möjligt på +46 10 880 09 81 eller support@techpilots.se.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">2. Leverans & Frakt</h2>
            <h3 className="font-bold mb-1">Hur lång tid tar leveransen?</h3>
            <p className="mb-4">Standard leverans tar normalt 2–5 arbetsdagar. Express-leverans går samma dag eller nästa dag om du beställer före 12:00.</p>
            <h3 className="font-bold mb-1">Är frakt kostnadsfritt?</h3>
            <p className="mb-2">Vi erbjuder fri frakt på alla beställningar inom Sverige. Vi har två leveransalternativ:</p>
            <ul className="mb-4">
              <li><strong>Standardleverans:</strong> Gratis, leverans 2–5 arbetsdagar</li>
              <li><strong>Express-leverans:</strong> 99 kr, leverans 1–2 arbetsdagar</li>
            </ul>
            <h3 className="font-bold mb-1">Hur kan jag spåra min beställning?</h3>
            <p className="mb-4">Du får ett spårningsnummer via e-mail när din beställning skickas. Du kan följa ditt paket på PostNords webbplats.</p>
            <h3 className="font-bold mb-1">Levererar ni utanför Sverige?</h3>
            <p className="mb-4">Vi levererar för närvarande endast till Sverige. Leverans till övriga Norden kan diskuteras på förfrågan.</p>
            <h3 className="font-bold mb-1">Vad gör jag om mitt paket är skadat?</h3>
            <p>Kontakta omedelbart PostNord och reklamera paketet. Dokumentera skadan med bilder och kontakta oss på support@techpilots.se med ordernummer och reklamationsnummer.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">3. Betalning</h2>
            <h3 className="font-bold mb-1">Vilka betalningsmetoder accepterar ni?</h3>
            <p className="mb-4">Vi accepterar kreditkort (Visa, Mastercard), Swish, PayPal och Klarna.</p>
            <h3 className="font-bold mb-1">Är det säkert att betala online?</h3>
            <p className="mb-4">Ja, mycket säkert. Vi använder SSL-kryptering och är PCI DSS-certifierade. Vi lagrar aldrig dina fullständiga betalningsuppgifter.</p>
            <h3 className="font-bold mb-1">Kan jag betala senare?</h3>
            <p className="mb-4">Vi kräver betalning vid beställningstillfället för konsumenter.</p>
            <h3 className="font-bold mb-1">Varför blev min betalning nekad?</h3>
            <p>Kontrollera att ditt betalningsmedel är giltigt, att beloppet är tillgängligt, eller att du fyllt i rätt uppgifter. Kontakta din bank eller försök med en annan betalningsmetod.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">4. Returer & Ångerrätt</h2>
            <h3 className="font-bold mb-1">Kan jag returnera en produkt?</h3>
            <p className="mb-4">Ja! Du har <strong>30 dagars returrätt</strong> på alla köp hos oss. Produkten ska vara oanvänd och i originalskick. Se vår <Link href="/returpolicy" className="underline hover:opacity-70">returpolicy</Link> för fullständig information.</p>
            <h3 className="font-bold mb-1">Betalar jag returfrakten?</h3>
            <p className="mb-4">Ja, du betalar returfrakten själv vid retur. Vi skickar en returfraktsedel så det blir så enkelt som möjligt.</p>
            <h3 className="font-bold mb-1">Hur länge tar det att få återbetalt?</h3>
            <p className="mb-4">Du får återbetalning inom 14 dagar från att vi mottagit och godkänt din retur.</p>
            <h3 className="font-bold mb-1">Kan jag returnera en öppnad produkt?</h3>
            <p className="mb-4">Ja, du kan öppna och inspektera produkten. Om den är oanvänd kan du returnera den.</p>
            <h3 className="font-bold mb-1">Vad gör jag om produkten är defekt?</h3>
            <p>Kontakta support@techpilots.se omedelbart med ordernummer och beskrivning av defekten. Du har rätt att reklamera fel i 3 år från köpet.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">5. Garanti & Reklamation</h2>
            <h3 className="font-bold mb-1">Har produkterna garanti?</h3>
            <p className="mb-4">Ja, alla produkter kommer med tillverkarens garanti (normalt 2 år). Du har även lagstadgad reklamationsrätt i 3 år.</p>
            <h3 className="font-bold mb-1">Hur gör jag ett garantikrav?</h3>
            <p className="mb-4">Kontakta support@techpilots.se med ordernummer och beskrivning av problemet.</p>
            <h3 className="font-bold mb-1">Vad täcker inte garantin?</h3>
            <p className="mb-4">Garantin täcker inte slitage, felaktig användning, olyckor, vattenskador eller skador från felaktig installation.</p>
            <h3 className="font-bold mb-1">Måste produkten skickas för reparation?</h3>
            <p>Det beror på felets karaktär. Vi täcker fraktkostnaden för garantiärenden.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">6. Kontakt</h2>
            <p className="mb-1"><strong>Telefon:</strong> +46 10 880 09 81 (Mån-Fre 09:00–17:00)</p>
            <p className="mb-1"><strong>E-post:</strong> support@techpilots.se</p>
            <p><strong>Webbformulär:</strong> <Link href="/kontakt" className="underline hover:opacity-70">Kontakta oss</Link></p>
          </section>

        </div>
      </InfoPageLayout>
    </MainLayout>
  );
}
