'use client';

import { MainLayout } from '@/app/components/MainLayout';
import { InfoPageLayout } from '@/app/components/PageHero';

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <InfoPageLayout title="Integritetspolicy" description="Hur vi samlar in, använder och skyddar dina personuppgifter när du handlar elektronik hos oss." updatedDate="6 juni 2026" version="1.0">
        <div className="space-y-8">

          <section>
            <h2 className="font-bold mb-4">1. Personuppgiftsansvarig</h2>
            <p className="mb-1"><strong>Techpilots AB</strong></p>
            <p className="mb-1">Skogshyddegatan 37, 506 31 Borås, Sverige</p>
            <p className="mb-1"><strong>E-post:</strong> support@techpilots.se</p>
            <p><strong>Telefon:</strong> +46 10 880 09 81</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">2. Vilka uppgifter samlar vi in?</h2>
            <p className="mb-3">När du skapar ett konto, lägger en beställning eller kontaktar oss samlar vi in:</p>
            <ul>
              <li><strong>Identitetsuppgifter:</strong> För- och efternamn</li>
              <li><strong>Kontaktuppgifter:</strong> E-postadress, telefonnummer och leveransadress</li>
              <li><strong>Betalningsuppgifter:</strong> Vald betalningsmetod — vi lagrar aldrig dina kortuppgifter</li>
              <li><strong>Orderuppgifter:</strong> Beställda produkter, ordernummer, leveransstatus och köphistorik</li>
              <li><strong>Garantiärenden:</strong> Uppgifter om reklamationer och garantiärenden på elektronikprodukter</li>
              <li><strong>Tekniska uppgifter:</strong> IP-adress, webbläsartyp och enhetsinformation</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">3. Varför behandlar vi dina uppgifter?</h2>
            <ul>
              <li><strong>Genomföra köp:</strong> Hantera beställningar av datorer, komponenter och tillbehör</li>
              <li><strong>Leverans:</strong> Skicka din beställning via PostNord till angiven adress</li>
              <li><strong>Garanti och reklamation:</strong> Hantera garantiärenden och defekta produkter inom 3 år</li>
              <li><strong>Kundservice:</strong> Besvara frågor om produkter, leveranser och returer</li>
              <li><strong>Bokföring:</strong> Uppfylla krav enligt bokföringslagen</li>
              <li><strong>Produktrekommendationer:</strong> Visa relevanta produkter baserat på dina köp</li>
              <li><strong>Nyhetsbrev:</strong> Skicka erbjudanden på elektronik om du har samtyckt</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">4. Rättslig grund</h2>
            <ul>
              <li><strong>Avtal:</strong> Nödvändigt för att genomföra ditt köp och hantera leverans</li>
              <li><strong>Rättslig förpliktelse:</strong> Bokföringslag, konsumentköplag och distansavtalslag</li>
              <li><strong>Berättigat intresse:</strong> Förhindra bedrägerier och förbättra vår webbutik</li>
              <li><strong>Samtycke:</strong> Nyhetsbrev och personanpassad marknadsföring</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">5. Hur länge sparar vi dina uppgifter?</h2>
            <ul>
              <li><strong>Orderhistorik:</strong> 7 år (krav enligt bokföringslagen)</li>
              <li><strong>Garantiärenden:</strong> 3 år från köpdatum (reklamationsrätt)</li>
              <li><strong>Kundkonto:</strong> Tills du avslutar ditt konto</li>
              <li><strong>Nyhetsbrev:</strong> Tills du avregistrerar dig</li>
              <li><strong>Tekniska loggar:</strong> 90 dagar</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">6. Delar vi dina uppgifter?</h2>
            <p className="mb-3">Vi delar dina uppgifter endast med partners som är nödvändiga för att driva vår webbutik:</p>
            <ul>
              <li><strong>PostNord:</strong> Namn och leveransadress för att skicka din beställning</li>
              <li><strong>Klarna / Stripe:</strong> Betalningsuppgifter för att genomföra betalningen</li>
              <li><strong>Leverantörer:</strong> Vid direktleverans från tillverkare av elektronik</li>
              <li><strong>IT-leverantörer:</strong> Hosting och tekniska system för webbutiken</li>
            </ul>
            <p className="mt-3">Vi säljer aldrig dina personuppgifter till tredje part.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">7. Dina rättigheter</h2>
            <p className="mb-3">Enligt GDPR har du rätt att:</p>
            <ul>
              <li><strong>Tillgång:</strong> Begära ett utdrag av alla uppgifter vi har om dig</li>
              <li><strong>Rättelse:</strong> Korrigera felaktig leveransadress eller kontaktuppgifter</li>
              <li><strong>Radering:</strong> Begära att ditt konto och dina uppgifter raderas</li>
              <li><strong>Begränsning:</strong> Begära att vi slutar använda dina uppgifter</li>
              <li><strong>Dataportabilitet:</strong> Få ut din orderhistorik i maskinläsbart format</li>
              <li><strong>Invändning:</strong> Invända mot marknadsföring och produktrekommendationer</li>
              <li><strong>Återkalla samtycke:</strong> Avregistrera dig från nyhetsbrev när som helst</li>
            </ul>
            <p className="mt-3">Kontakta oss på support@techpilots.se för att utöva dina rättigheter. Vi svarar inom 30 dagar.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">8. Klagomål</h2>
            <p>Om du anser att vi behandlar dina personuppgifter felaktigt har du rätt att lämna klagomål till <strong>Integritetsskyddsmyndigheten (IMY)</strong>, Box 8114, 104 20 Stockholm, imy.se.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">9. Kontakt</h2>
            <p className="mb-1"><strong>E-post:</strong> support@techpilots.se</p>
            <p className="mb-1"><strong>Telefon:</strong> +46 10 880 09 81</p>
            <p><strong>Öppettider:</strong> Mån-Fre 09:00–17:00</p>
          </section>

        </div>
      </InfoPageLayout>
    </MainLayout>
  );
}
