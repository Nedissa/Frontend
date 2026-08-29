'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/app/components/layout/MainLayout';

const NAV = [
  {
    id: 'kundservice',
    label: 'Kundservice',
    links: [
      { id: 'kontakt', label: 'Kontakta oss' },
      { id: 'support', label: 'Support' },
      { id: 'vanliga-fragor', label: 'Vanliga frågor' },
    ],
  },
  {
    id: 'handla',
    label: 'Handla',
    links: [
      { id: 'produktinfo', label: 'Produktinformation' },
    ],
  },
  {
    id: 'leverans',
    label: 'Leverans',
    links: [
      { id: 'leverans', label: 'Frakt och leverans' },
      { id: 'betalning', label: 'Betalning' },
      { id: 'spara-leverans', label: 'Spåra din leverans' },
    ],
  },
  {
    id: 'oppet-kop',
    label: 'Öppet köp',
    links: [
      { id: 'returer', label: 'Returer' },
    ],
  },
  {
    id: 'retur',
    label: 'Felanmälan',
    links: [
      { id: 'reklamation', label: 'Reklamation' },
      { id: 'byten', label: 'Byten' },
      { id: 'felanmalan-support', label: 'Serviceärenden' },
    ],
  },
  {
    id: 'villkor',
    label: 'Villkor',
    links: [
      { id: 'villkor', label: 'Försäljningsvillkor' },
      { id: 'medlemsvillkor', label: 'Medlemsvillkor' },
      { id: 'integritet', label: 'Integritetspolicy' },
      { id: 'cookies', label: 'Cookiepolicy' },
    ],
  },
  {
    id: 'om-oss',
    label: 'Om oss',
    links: [
      { id: 'om-oss', label: 'Vår historia' },
      { id: 'miljoansvar', label: 'Miljöansvar' },
      { id: 'kryptering', label: 'Kryptering' },
      { id: 'tillganglighet', label: 'Tillgänglighet' },
    ],
  },
];

function Sidebar({ active, navigate }: { active: string; navigate: (id: string) => void }) {
  const [open, setOpen] = useState<string | null>(NAV[0].id);

  useEffect(() => {
    const parentCat = NAV.find(cat => cat.links.some(l => l.id === active))?.id;
    if (parentCat) setOpen(parentCat);
  }, [active]);

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
  kontakt: 'Ring, maila eller fyll i formuläret. Vi svarar inom 24 timmar.',
  support: 'Teknisk hjälp och felsökning för dina produkter.',
  'vanliga-fragor': 'Svar på de vanligaste frågorna om beställning, leverans och retur.',
  produktinfo: 'Information om våra produkter, specifikationer och kompatibilitet.',
  leverans: 'Leveranstider, fraktkostnader och spårning av paket.',
  betalning: 'Betalningsalternativ, faktura och delbetalning.',
  'spara-leverans': 'Spåra ditt paket i realtid.',
  medlemsvillkor: 'Villkor för medlemskap hos Techpilots.',
  returer: 'Hur du returnerar en vara. 14 dagars ångerrätt.',
  byten: 'Hur du byter en vara mot en annan.',
  reklamation: 'Reklamation av felaktig vara eller garanti.',
  'felanmalan-support': 'Serviceärenden och kontakt med tillverkarens support.',
  villkor: 'Våra försäljningsvillkor och köpeavtal.',
  integritet: 'Hur vi hanterar och skyddar dina personuppgifter.',
  cookies: 'Information om cookies och hur vi använder dem.',
  'om-oss': 'Lär känna Techpilots och vår historia.',
  miljoansvar: 'Hur vi tar ansvar för miljön.',
  kryptering: 'Hur vi skyddar din data och dina betalningar.',
  tillganglighet: 'Hur vi arbetar med digital tillgänglighet enligt WCAG.',
};

export default function CustomerServicePage() {
  const [active, setActive] = useState('kontakt');
  const [animKey, setAnimKey] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const seg = window.location.pathname.split('/kundservice/')[1];
    if (seg) {
      setActive(seg);
      if (window.innerWidth < 768) {
        setTimeout(() => {
          document.getElementById('ks-content')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const navigate = (id: string) => {
    setActive(id);
    setAnimKey(k => k + 1);
    window.history.pushState(null, '', `/kundservice/${id}`);
    // På mobil är sidomenyn ovanför innehållet — glid ner till texten direkt
    // vid val, annars ser det ut som att inget hände förrän man scrollar själv.
    // Väntar två rAF-cykler så React hinner rendera det nya innehållet innan
    // vi mäter var elementet faktiskt hamnar — annars scrollar vi mot gammal layout.
    if (window.innerWidth < 768) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById('ks-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject: `[${topic}] ${subject}`, message, recipientEmail: 'info@techpilots.se' }),
      });
      if (res.ok) {
        setIsSuccess(true);
        setName(''); setEmail(''); setSubject(''); setTopic(''); setMessage('');
      } else {
        setErrorMessage('Ett fel uppstod. Försök igen senare.');
      }
    } catch {
      setErrorMessage('Ett fel uppstod. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', fontSize: '0.875rem',
    background: '#f5f5f5', border: '1px solid #e5e7eb', color: '#111',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', borderRadius: '4px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#333', marginBottom: '5px',
  };

  return (
    <MainLayout>
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

      <div className="min-h-screen w-full" style={{ background: '#fff', fontFamily: "'Manrope', sans-serif" }}>
        <div className="content-container flex flex-col md:flex-row px-4 md:px-6" style={{ padding: '24px 0 40px', gap: '48px', alignItems: 'flex-start' }}>

          <Sidebar active={active} navigate={navigate} />

          <div id="ks-content" style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#000', marginBottom: '6px' }}>
              {NAV.flatMap(c => c.links).find(l => l.id === active)?.label ?? 'Kundservice'}
            </h1>
            <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '20px' }}>{SUBTITLES[active] ?? 'Vi hjälper dig med order, leverans, returer och allt däremellan.'}</p>

            <div key={animKey} className="ks-content" style={{ padding: '32px 40px', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

              {active === 'kontakt' && (
                <div>
                  <h2>Kontakta oss</h2>
                  <p><strong>Telefon:</strong> +46 10 880 09 81. Mån till Fre 09:00 till 17:00</p>
                  <p><strong>E-post:</strong> support@techpilots.se. Svar inom 24 timmar</p>
                  {errorMessage && <div style={{ padding: '12px 16px', background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', fontSize: '0.875rem', borderRadius: '4px', marginBottom: '20px' }}>{errorMessage}</div>}
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '560px', marginTop: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                      <div><label style={labelStyle}>Ditt namn</label><input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} /></div>
                      <div><label style={labelStyle}>Din e-post *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} /></div>
                    </div>
                    <div>
                      <label style={labelStyle}>Ämne</label>
                      <select value={topic} onChange={e => setTopic(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="">Välj kategori...</option>
                        <option value="Order">Order & leverans</option>
                        <option value="Retur">Retur & byte</option>
                        <option value="Reklamation">Reklamation</option>
                        <option value="Produkt">Produktfråga</option>
                        <option value="Annat">Annat</option>
                      </select>
                    </div>
                    <div><label style={labelStyle}>Rubrik *</label><input type="text" value={subject} onChange={e => setSubject(e.target.value)} required style={inputStyle} /></div>
                    <div><label style={labelStyle}>Ditt meddelande *</label><textarea rows={5} value={message} onChange={e => setMessage(e.target.value)} required style={{ ...inputStyle, resize: 'vertical' }} /></div>
                    <button type="submit" disabled={isLoading || isSuccess} style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 32px', fontSize: '0.9rem', fontWeight: 700, borderRadius: '4px', cursor: isLoading || isSuccess ? 'not-allowed' : 'pointer', opacity: isLoading || isSuccess ? 0.6 : 1, alignSelf: 'flex-start' }}>
                      {isSuccess ? 'Tackar!' : isLoading ? 'Skickar...' : 'Skicka meddelandet'}
                    </button>
                  </form>
                </div>
              )}

              {active === 'support' && (
                <div>
                  <h2>Support</h2>
                  <h3>Teknisk support</h3>
                  <p>Har du problem med en produkt du köpt hos oss? Vi hjälper dig att felsöka och hitta en lösning. Kontakta oss på support@techpilots.se med ordernummer och en beskrivning av problemet.</p>
                  <h3>Telefonsupport</h3>
                  <p>Ring oss på <strong>+46 10 880 09 81</strong>, mån-fre 09:00–17:00. Vi svarar så snart vi kan.</p>
                  <h3>E-postsupport</h3>
                  <p>Maila oss på <strong>support@techpilots.se</strong>. Vi svarar inom 24 timmar på vardagar.</p>
                  <h3>Vad behöver du ha redo?</h3>
                  <p>För snabbast möjliga hjälp, ha ditt ordernummer, produktnamn och en beskrivning av problemet till hands när du kontaktar oss.</p>
                </div>
              )}

              {active === 'vanliga-fragor' && (
                <div>
                  <h2>Vanliga frågor</h2>
                  <h3>Hur gör jag en beställning?</h3>
                  <p>Lägg produkter i din varukorg, gå till kassan, fyll i dina uppgifter och välj betalningsmetod. Du får omedelbar orderbekräftelse via e-mail.</p>
                  <h3>Kan jag ändra min beställning?</h3>
                  <p>Om din beställning inte redan skickats kan vi hjälpa dig. Kontakta omedelbart support@techpilots.se eller ring +46 10 880 09 81.</p>
                  <h3>Måste jag ha ett konto för att beställa?</h3>
                  <p>Ja, du behöver registrera dig. Det tar bara några minuter och gör det enkelt att spåra dina beställningar.</p>
                  <h3>Hur lång tid tar leveransen?</h3>
                  <p>Fri frakt på beställningar över 499 kr. Leveranstid visas vid kassan baserat på produkt och lagerstatus.</p>
                  <h3>Hur spårar jag min beställning?</h3>
                  <p>Du får ett spårningsnummer via e-mail när din beställning skickas. Du kan även logga in på Mina sidor för att se status.</p>
                  <h3>Vilka betalningsmetoder accepterar ni?</h3>
                  <p>Vi accepterar kreditkort (Visa, Mastercard), Apple Pay och Klarna. Alla betalningar är SSL-krypterade.</p>
                  <h3>Kan jag returnera en produkt?</h3>
                  <p>Ja, du har 14 dagars ångerrätt på alla köp. Produkten ska vara oanvänd och i originalskick. Återbetalning sker inom 14 dagar efter godkänd retur.</p>
                  <h3>Har produkterna garanti?</h3>
                  <p>Ja, alla produkter har tillverkarens garanti (normalt 2 år). Du har även lagstadgad reklamationsrätt i 3 år.</p>
                </div>
              )}

              {active === 'produktinfo' && (
                <div>
                  <h2>Produktinformation</h2>
                  <h3>Produktbeskrivningar</h3>
                  <p>Vi strävar efter att ha så detaljerade och korrekta produktbeskrivningar som möjligt. Specifikationer, bilder och beskrivningar tillhandahålls av tillverkaren och kan skilja sig något från den faktiska produkten.</p>
                  <h3>Kompatibilitet</h3>
                  <p>Är du osäker på om en produkt passar ditt system eller din enhet? Kontakta oss på support@techpilots.se så hjälper vi dig att hitta rätt.</p>
                  <h3>Lagerstatus</h3>
                  <p>Lagerstatus uppdateras i realtid. Om en produkt visas som tillgänglig finns den i lager och kan skickas samma eller nästa vardag.</p>
                  <h3>Prisgaranti</h3>
                  <p>Hittar du samma produkt billigare hos en annan svensk återförsäljare? Kontakta oss så gör vi vårt bästa för att matcha priset.</p>
                </div>
              )}

              {active === 'betalning' && (
                <div>
                  <h2>Betalning</h2>
                  <h3>Betalningsmetoder</h3>
                  <p>Vi accepterar kreditkort (Visa, Mastercard), Apple Pay och Klarna.</p>
                  <h3>Säker betalning</h3>
                  <p>Vi använder SSL-kryptering och är PCI DSS-certifierade. Vi lagrar aldrig dina fullständiga betalningsuppgifter.</p>
                  <h3>Varför blev min betalning nekad?</h3>
                  <p>Kontrollera att ditt betalningsmedel är giltigt och att beloppet finns tillgängligt. Kontakta din bank eller försök med en annan metod.</p>
                </div>
              )}

              {active === 'spara-leverans' && (
                <div>
                  <h2>Spåra din leverans</h2>
                  <h3>Spårningsnummer</h3>
                  <p>När din order skickas får du ett spårningsnummer via e-post. Använd det för att följa ditt paket i realtid hos respektive fraktbolag.</p>
                  <h3>PostNord</h3>
                  <p>Spåra ditt paket på postnord.se med ditt spårningsnummer.</p>
                  <h3>DHL</h3>
                  <p>Spåra ditt paket på dhl.se med ditt spårningsnummer.</p>
                  <h3>Kontakta oss</h3>
                  <p>Har du inte fått något spårningsnummer inom 2 arbetsdagar efter beställning? Kontakta oss på support@techpilots.se med ditt ordernummer.</p>
                </div>
              )}

              {active === 'leverans' && (
                <div>
                  <h2>Leverans & Frakt</h2>
                  <h3>Frakt</h3>
                  <p>Fri frakt på beställningar över 499 kr. Leveranstid visas vid kassan baserat på produkt och lagerstatus.</p>
                  <h3>Leveransområden</h3>
                  <p>Vi skickar till hela Sverige utan extra kostnad. För leverans till övriga Norden kan vi erbjuda priser på förfrågan. Kontakta oss på support@techpilots.se.</p>
                  <h3>Spåra din beställning</h3>
                  <p>Du får ett spårningsnummer via e-mail när din beställning skickas. Du kan även logga in på Mina sidor för att se status.</p>
                  <h3>Skadat paket?</h3>
                  <p>Inspektera omedelbart, dokumentera med bilder och kontakta oss på support@techpilots.se inom 48 timmar med ditt ordernummer.</p>
                </div>
              )}

              {active === 'returer' && (
                <div>
                  <h2>Returer & Ångerrätt</h2>
                  <h3>Ångerrätt</h3>
                  <p>Du har 14 dagars ångerrätt från det att du mottagit din order. Returfrakten bekostas av kunden.</p>
                  <h3>Krav vid retur</h3>
                  <p>Originalemballaget måste sparas. Tydlig beskrivning av felet krävs. Varan ska skickas in inom 14 dagar efter godkänd retur.</p>
                  <h3>Så gör du en retur</h3>
                  <p>Kontakta oss på support@techpilots.se med ordernummer och anledning. Vi skickar instruktioner inom 24 timmar. Återbetalning sker inom 5–7 arbetsdagar efter godkänd retur.</p>
                  <h3>Byten</h3>
                  <p>Du har rätt att byta en vara inom 14 dagar från att du mottagit din order, förutsatt att den är oanvänd och i originalskick. Kontakta oss på support@techpilots.se med ordernummer och vilken produkt du vill byta till.</p>
                  <h3>Fraktkostnad vid byte</h3>
                  <p>Returfrakten vid byte bekostas av kunden. Vi skickar den nya varan utan extra fraktkostnad.</p>
                  <h3>Undantag</h3>
                  <p>Gäller ej förbrukningsvaror, öppna produkter, kroppsnära produkter (t.ex. in-ear hörlurar), spel och digitala produkter där licens aktiverats, specialbeställda varor eller presentkort.</p>
                </div>
              )}

              {active === 'byten' && (
                <div>
                  <h2>Byten</h2>
                  <h3>Byta en vara</h3>
                  <p>Du har rätt att byta en vara inom 14 dagar från att du mottagit din order, förutsatt att den är oanvänd och i originalskick.</p>
                  <h3>Så gör du ett byte</h3>
                  <p>Kontakta oss på support@techpilots.se med ordernummer och vilken produkt du vill byta till. Vi hjälper dig med resten.</p>
                  <h3>Fraktkostnad vid byte</h3>
                  <p>Returfrakten vid byte bekostas av kunden. Vi skickar den nya varan utan extra fraktkostnad.</p>
                  <h3>Undantag</h3>
                  <p>Gäller ej förbrukningsvaror, öppna produkter, kroppsnära produkter, spel och digitala produkter där licens aktiverats, specialbeställda varor eller presentkort.</p>
                </div>
              )}

              {active === 'reklamation' && (
                <div>
                  <h2>Garanti & Reklamation</h2>
                  <h3>Reklamationsrätt</h3>
                  <p>Du har lagstadgad reklamationsrätt i 3 år från köpdatum.</p>
                  <h3>Vad täcks?</h3>
                  <p>Tillverkningsfel, materialfel och komponenter som inte fungerar som utlovat.</p>
                  <h3>Vad täcks inte?</h3>
                  <p>Fysisk skada, vattenskada, normalt slitage och felaktig användning.</p>
                  <h3>Så gör du en felanmälan</h3>
                  <p>Maila support@techpilots.se med ordernummer, produktnamn och beskrivning av felet. Bifoga gärna bilder. Vi återkommer inom 24 timmar.</p>
                  <h3>Vad händer sen?</h3>
                  <p>Vi bedömer ärendet inom 3 arbetsdagar. Vid godkänd reklamation erbjuder vi reparation, byte eller återbetalning. Vi betalar alltid returfrakten.</p>
                  <h3>Tvist</h3>
                  <p>Vid tvist kan du vända dig till Allmänna reklamationsnämnden, Box 174, 101 23 Stockholm eller via arn.se.</p>
                </div>
              )}

              {active === 'felanmalan-support' && (
                <div>
                  <h2>Serviceärenden</h2>
                  <h3>Serviceärenden</h3>
                  <p>Har din produkt ett fel som kräver reparation? Vi hjälper dig att komma i kontakt med rätt serviceinstans.</p>
                  <h3>Tillverkarservice</h3>
                  <p>För produkter från stora varumärken (Asus, HP, Samsung, Lenovo m.fl.) hänvisar vi dig direkt till tillverkarens service för snabbast möjlig hjälp.</p>
                  <h3>Kontakta oss</h3>
                  <p>Maila support@techpilots.se med ordernummer och en beskrivning av felet. Vi återkommer inom 24 timmar med instruktioner.</p>
                  <h3>Garantiservice</h3>
                  <p>Om felet täcks av garanti eller reklamationsrätt betalar vi alltid frakten för serviceärendet.</p>
                </div>
              )}

              {active === 'villkor' && (
                <div>
                  <h2>Försäljningsvillkor</h2>
                  <h3>1. Tillämplighet</h3>
                  <p>Gäller från 1 januari 2025. Kund som beställer varor av Techpilots AB accepterar dessa villkor.</p>
                  <h3>2. Priser</h3>
                  <p>Samtliga priser inkl. moms (25%), exkl. frakt om inget annat anges. Vi reserverar oss för prisfel och prisändringar.</p>
                  <h3>3. Beställning</h3>
                  <p>Beställning genomförs via webbplatsen med godkänd betalning. Orderbekräftelse skickas per e-post.</p>
                  <h3>4. Betalning</h3>
                  <p>Vi accepterar Visa, Mastercard, Apple Pay och Klarna med PCI DSS-certifierade betalningslösningar.</p>
                  <h3>5. Frakt och leverans</h3>
                  <p>Fri frakt på beställningar över 499 kr. Leveranstid visas vid kassan. Ej uthämtat paket debiteras 249 kr inkl. moms.</p>
                  <h3>6. Ångerrätt</h3>
                  <p>14 dagars ångerrätt enligt distansavtalslagen. Gäller ej förbrukningsvaror, kroppsnära produkter, spel, digitala produkter eller presentkort. Återbetalning inom 14 dagar.</p>
                  <h3>7. Garanti och reklamation</h3>
                  <p>Reklamationsrätt i 3 år. Reklamation ska göras inom 2 månader från att felet upptäcktes.</p>
                  <h3>8. Dataskydd</h3>
                  <p>Vi behandlar personuppgifter enligt GDPR. Data delas aldrig utan samtycke, förutom vid leverans och betalning.</p>
                  <h3>9. Tvister</h3>
                  <p>Regleras av svensk lag. Tvist via ARN, Box 174, 101 23 Stockholm eller europa.eu/consumers/odr.</p>
                  <h3>10. Kontakt</h3>
                  <p>Techpilots AB · Skogshyddegatan 37, 506 31 Borås · +46 10 880 09 81 · support@techpilots.se</p>
                </div>
              )}

              {active === 'medlemsvillkor' && (
                <div>
                  <h2>Medlemsvillkor</h2>
                  <h3>Medlemskap</h3>
                  <p>Medlemskap hos Techpilots är gratis och ger dig tillgång till orderhistorik, snabbare checkout och exklusiva erbjudanden.</p>
                  <h3>Registrering</h3>
                  <p>Du registrerar dig med din e-postadress och ett valfritt lösenord.</p>
                  <h3>Dina uppgifter</h3>
                  <p>Vi behandlar dina personuppgifter enligt vår integritetspolicy och GDPR. Du kan när som helst begära att ditt konto raderas via support@techpilots.se.</p>
                  <h3>Avsluta medlemskap</h3>
                  <p>Du kan när som helst avsluta ditt medlemskap genom att kontakta oss på support@techpilots.se.</p>
                </div>
              )}

              {active === 'integritet' && (
                <div>
                  <h2>Integritetspolicy</h2>
                  <h3>Personuppgiftsansvarig</h3>
                  <p>Techpilots AB, org.nr 559385-5346, Skogshyddegatan 37, 506 31 Borås.</p>
                  <h3>Vilka uppgifter vi samlar in</h3>
                  <p>Namn, e-post, leveransadress, telefonnummer och betalningsinformation vid köp. Tekniska uppgifter via cookies.</p>
                  <h3>Varför vi behandlar dina uppgifter</h3>
                  <p>För att genomföra köp och leverans, skicka orderbekräftelser och förbättra vår webbplats.</p>
                  <h3>Hur länge vi sparar uppgifterna</h3>
                  <p>Orderuppgifter 7 år (bokföringslagen). Nyhetsbrev tills avregistrering. Tekniska loggar raderas efter 12 månader.</p>
                  <h3>Dina rättigheter</h3>
                  <p>Rätt att begära tillgång, rätta, radera eller begränsa behandlingen. Kontakta info@techpilots.se.</p>
                  <h3>Klagomål</h3>
                  <p>Kan lämnas till Integritetsskyddsmyndigheten (IMY), imy.se.</p>
                </div>
              )}

              {active === 'cookies' && (
                <div>
                  <h2>Cookiepolicy</h2>
                  <h3>Vad är cookies?</h3>
                  <p>Små textfiler som lagras i din webbläsare för att webbplatsen ska fungera och för att förstå hur besökare använder sajten.</p>
                  <h3>Nödvändiga cookies</h3>
                  <p>Krävs för att webbplatsen ska fungera, inklusive varukorg och inloggning. Kan inte stängas av.</p>
                  <h3>Analyscookies</h3>
                  <p>Vi använder Google Analytics för statistik. Du kan tacka nej via vår cookiebanner.</p>
                  <h3>Hantera dina val</h3>
                  <p>Ändra cookie-inställningar via vår cookiebanner eller i din webbläsares inställningar när som helst.</p>
                </div>
              )}

              {active === 'om-oss' && (
                <div>
                  <h2>Vår historia</h2>
                  <h3>Elektronik utan krångel</h3>
                  <p>Vi startade Techpilots med en enkel idé: näthandel med elektronik ska vara enkel, pålitlig och prisvärd. Varje produkt i vårt sortiment är noggrant utvald. Vi prioriterar kvalitet framför kvantitet.</p>
                  <p>Oavsett vad du letar efter finns vi här för att navigera dig till rätt produkt.</p>
                  <h3>Därför Techpilots</h3>
                  <p>Techpilots drivs av personer med erfarenhet från både tillverkare och detaljhandelskedjor inom teknikbranschen. Vi har arbetslivserfarenhet från företag som Intel, LG Electronics, MSI, Dyson, MediaMarkt, Elgiganten och Netonnet.</p>
                  <p>Vi fokuserar inte på att erbjuda flest produkter, utan på att erbjuda produkter vi tror på och kan rekommendera med gott samvete.</p>
                  <p>Till skillnad från många återförsäljare bygger och driftar vi själva webbplatser, servrar och e-handelslösningar. Teknik är inte bara produkterna vi säljer. Det är vårt dagliga arbete.</p>
                  <p>När du kontaktar oss möter du inte ett automatiserat supportsystem. Du får hjälp av personer med praktisk erfarenhet av produkterna vi säljer.</p>
                  <h3>Kvalitet</h3>
                  <p>Vi säljer bara produkter vi själva tror på, noggrant utvalda från etablerade varumärken med fullständig garanti.</p>
                  <h3>Snabb leverans</h3>
                  <p>Fri frakt på beställningar över 499 kr. Leveranstid visas vid kassan.</p>
                  <h3>Vår ambition</h3>
                  <p>Vi vill göra det lika enkelt att köpa elektronik online som att gå in och prata med någon som verkligen kan sitt jobb. Tydlig information, ärliga priser och snabb hjälp när något krånglar.</p>
                </div>
              )}

              {active === 'miljoansvar' && (
                <div>
                  <h2>Miljöansvar</h2>
                  <h3>Vår syn på miljö</h3>
                  <p>Vi på Techpilots tar miljöansvar på allvar. Det handlar inte bara om vad vi säljer utan hur vi driver vår verksamhet.</p>
                  <h3>Förpackningar</h3>
                  <p>Vi minimerar onödigt förpackningsmaterial och använder i möjligaste mån återvinningsbart material vid frakt.</p>
                  <h3>Produktlivslängd</h3>
                  <p>Vi prioriterar produkter med lång livslängd och god garanti. En produkt som håller länge är alltid bättre för miljön än en som behöver bytas ut.</p>
                  <h3>Elektronikåtervinning</h3>
                  <p>Uttjänad elektronik ska alltid lämnas till en godkänd återvinningsstation. Kontakta din kommun för närmaste mottagning.</p>
                </div>
              )}

              {active === 'kryptering' && (
                <div>
                  <h2>Kryptering och säkerhet</h2>
                  <h3>SSL-kryptering</h3>
                  <p>Vår webbplats använder SSL-kryptering (HTTPS) vilket innebär att all kommunikation mellan din webbläsare och vår server är krypterad och skyddad.</p>
                  <h3>Säkra betalningar</h3>
                  <p>Alla betalningar hanteras via certifierade betalningsleverantörer. Vi lagrar aldrig dina kortuppgifter på våra servrar.</p>
                  <h3>PCI DSS</h3>
                  <p>Vår betalningslösning är PCI DSS-certifierad, vilket är branschstandarden för säker kortbetalning. Vi lagrar aldrig dina kortuppgifter.</p>
                  <h3>Dina uppgifter</h3>
                  <p>Vi delar aldrig dina personuppgifter med tredje part utan ditt samtycke, förutom vad som krävs för leverans och betalning.</p>
                </div>
              )}

              {active === 'tillganglighet' && (
                <div>
                  <h2>Tillgänglighet</h2>
                  <h3>Vår ambition</h3>
                  <p>Vi strävar efter att vår webbplats ska vara tillgänglig för alla, oavsett funktionsvariation. Vi arbetar mot WCAG 2.1 nivå AA, den internationella standarden för digital tillgänglighet.</p>
                  <h3>Vad är WCAG?</h3>
                  <p>WCAG (Web Content Accessibility Guidelines) är riktlinjer framtagna av W3C. De är indelade i tre nivåer: A (grundläggande), AA (standard) och AAA (högsta). Nivå AA är den nivå som rekommenderas för de flesta webbplatser och är lagkrav för offentliga aktörer inom EU.</p>
                  <h3>Vad vi gör</h3>
                  <p>Vi arbetar kontinuerligt med kontrast, tangentbordsnavigering, skärmläsarkompatibilitet och tydliga textalternativ för bilder.</p>
                  <h3>Rapportera problem</h3>
                  <p>Upplever du tillgänglighetsproblem på vår webbplats? Kontakta oss på support@techpilots.se så åtgärdar vi det så snart vi kan.</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
