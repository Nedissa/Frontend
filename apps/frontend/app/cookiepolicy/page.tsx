'use client';

import { MainLayout } from '@/app/components/MainLayout';
import { InfoPageLayout } from '@/app/components/PageHero';

export default function CookiePolicyPage() {
  return (
    <MainLayout>
      <InfoPageLayout title="Cookiepolicy" description="Hur vi använder cookies för att ge dig en bättre shoppingupplevelse." updatedDate="6 juni 2026" version="1.0">
        <div className="space-y-8">

          <section>
            <h2 className="font-bold mb-4">1. Vad är cookies?</h2>
            <p>Cookies är små textfiler som lagras på din enhet när du besöker techpilots.se. De hjälper oss att komma ihåg din varukorg, dina inloggningsuppgifter och dina preferenser så att du slipper fylla i dem igen vid nästa besök.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">2. Vilka cookies använder vi?</h2>

            <h3 className="font-bold mb-2">Nödvändiga cookies</h3>
            <p className="mb-3">Krävs för att webbutiken ska fungera. Kan inte stängas av.</p>
            <ul className="mb-6">
              <li><strong>Inloggning:</strong> Håller dig inloggad på ditt konto under besöket</li>
              <li><strong>Varukorg:</strong> Sparar produkter du lagt i varukorgen</li>
              <li><strong>Checkout:</strong> Bevarar din beställningsinformation under köpprocessen</li>
              <li><strong>Säkerhet:</strong> Skyddar mot obehörig åtkomst och CSRF-attacker</li>
            </ul>

            <h3 className="font-bold mb-2">Funktionella cookies</h3>
            <p className="mb-3">Förbättrar din shoppingupplevelse. Aktiveras endast efter ditt samtycke.</p>
            <ul className="mb-6">
              <li><strong>Tidio:</strong> Live-chat för kundservice</li>
              <li><strong>Önskelista:</strong> Sparar produkter i din önskelista</li>
              <li><strong>Filtreringsinställningar:</strong> Kommer ihåg dina valda filter i produktlistor</li>
            </ul>

            <h3 className="font-bold mb-2">Analytiska cookies</h3>
            <p className="mb-3">Hjälper oss förstå hur webbplatsen används. Aktiveras endast efter ditt samtycke. Vi planerar att implementera Google Analytics för anonym besöksanalys.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">3. Hur länge sparas cookies?</h2>
            <ul>
              <li><strong>Sessionscookies (varukorg, inloggning):</strong> Raderas när du stänger webbläsaren</li>
              <li><strong>Funktionella cookies (önskelista, filter):</strong> Sparas i upp till 30 dagar</li>
              <li><strong>Analytiska cookies:</strong> Sparas i upp till 26 månader när dessa aktiveras</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">4. Samtycke och återkallelse</h2>
            <p className="mb-3">När du besöker techpilots.se visas en cookie-banner där du kan välja att acceptera eller avvisa icke-nödvändiga cookies. Ditt val sparas och du behöver inte ta ställning igen vid nästa besök.</p>
            <p>Du kan när som helst återkalla ditt samtycke genom att rensa webbläsarens cookies eller kontakta oss på support@techpilots.se.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">5. Hur hanterar du cookies i webbläsaren?</h2>
            <p className="mb-3">Du kan hantera eller blockera cookies i din webbläsare. Observera att om du blockerar nödvändiga cookies kan du inte lägga produkter i varukorgen eller slutföra ett köp.</p>
            <ul>
              <li><strong>Chrome:</strong> Inställningar → Sekretess och säkerhet → Cookies</li>
              <li><strong>Firefox:</strong> Inställningar → Sekretess och säkerhet → Cookies</li>
              <li><strong>Safari:</strong> Inställningar → Sekretess → Hantera webbplatsdata</li>
              <li><strong>Edge:</strong> Inställningar → Cookies och webbplatsbehörigheter</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">6. Tredjepartscookies</h2>
            <p className="mb-3">Följande tredjepartstjänster kan sätta cookies på techpilots.se:</p>
            <ul>
              <li><strong>Tidio:</strong> Live-chat för kundservice, aktiveras endast vid samtycke</li>
              <li><strong>Betalningsleverantörer:</strong> Nödvändigt för att genomföra betalningar</li>
            </ul>
            <p className="mt-3">Dessa tjänsters egna integritetspolicyer gäller för deras cookies.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">7. Kontakt</h2>
            <p className="mb-1"><strong>E-post:</strong> support@techpilots.se</p>
            <p className="mb-1"><strong>Telefon:</strong> +46 10 880 09 81</p>
            <p><strong>Öppettider:</strong> Mån-Fre 09:00–17:00</p>
          </section>

        </div>
      </InfoPageLayout>
    </MainLayout>
  );
}
