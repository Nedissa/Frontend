export type ProjectStep = {
  title: string;
  description: string;
  image?: string;
  bullets?: string[];
  accentColor?: string;
  uxImprovement?: string;
  uxImprovements?: string[];
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  status: string;
  tagline: string;
  description: string;
  image?: string;
  cardImage?: string;
  accentColor?: string;
  stripeBaseColor?: string;
  website?: string;
  challenge?: string;
  challengeTitle?: string;
  solution?: string;
  solutionTitle?: string;
  result?: string;
  resultTitle?: string;
  technologies?: string[];
  steps?: ProjectStep[];
  mobileImage?: string;
  tabletImage?: string;
  conclusionImage?: string;
  beforeAfter?: string;
  beforeImage?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: 'sagateatern',
    title: 'Sagateatern',
    category: 'Restaurang & Kultur',
    year: '2026',
    status: 'Lanserad',
    image: '/digital/projekt/sagateatern/original-hero.webp',
    cardImage: '/digital/projekt/sagateatern/original-hero.avif',
    conclusionImage: '/digital/projekt/sagateatern/original-hero.webp',
    website: 'sagateatern.nu',
    accentColor: '#B33A3A',
    stripeBaseColor: '#0a0a0a',
    tagline: 'Där scenkonst möter mat och gemenskap',
    description: 'Sagateatern i Borås är en kulturarena där scenkonst möter mat och gemenskap. Med ny regi och tydlig vision behövdes en digital plattform som speglar teaterns identitet och gör det enkelt att boka bord, hitta evenemang och hyra lokal.',
    challenge: 'Sagateatern behövde en digital närvaro som speglade den nya visionen, en plats där mat och scenkonst möts, samtidigt som besökare enkelt skulle kunna boka bord, hitta evenemang och hyra lokal.',
    challengeTitle: 'Ny digital närvaro',
    solution: 'Vi byggde en modern, lättnavigerad webbplats med tydlig bokningsflöde och ett visuellt uttryck som förenar teaterns kulturella identitet med en varm, inbjudande känsla.',
    solutionTitle: 'Lättnavigerad webbplats',
    result: 'En webbplats som speglar vad Sagateatern faktiskt är idag och som gör det enklare för besökare att hitta rätt, boka bord och delta i evenemang.',
    resultTitle: 'Speglar Sagateatern idag',
    technologies: ['Framer', 'Framer CMS', 'React', 'TypeScript'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', image: '/digital/projekt/sagateatern/original-hero-mobile.webp', uxImprovements: ['Varm', 'Kulturell'] },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.', uxImprovements: ['Tydligt bokningsflöde', 'Enklare navigering', 'Responsiv layout'] },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.', uxImprovements: ['Konsekvent', 'Genomtänkt', 'Finslipad'] },
    ],
  },
  {
    slug: 'crownmatch',
    title: 'Crownmatch',
    category: 'Rekrytering',
    year: '2026',
    status: 'Lanserad',
    image: '/digital/projekt/crownmatch/original-hero.webp',
    cardImage: '/digital/projekt/crownmatch/original-hero.avif',
    conclusionImage: '/digital/projekt/crownmatch/original-hero.webp',
    website: 'crownmatch.se',
    accentColor: '#E8C547',
    stripeBaseColor: '#4B5563',
    tagline: 'Rusta och matcha, vägen till jobb och framtid',
    description: 'Vi har fått i uppdrag att utveckla en webbplats för CrownMatch, leverantör av Arbetsförmedlingens tjänst Rusta & Matcha. Efter att ha träffat teamet för att förstå deras vision och behov skapar vi en modern, lättnavigerad plattform som gör det enkelt för arbetssökande att hitta information, ta del av tjänsterna samt komma i kontakt. Webbplatsen speglar varumärket CrownMatch och underlättar kommunikationen mellan kandidater och arbetsgivare på ett engagerande sätt.',
    challenge: 'Som huvudleverantör till Arbetsförmedlingen för Rusta och Matcha behövde CrownMatch en multifunktionell digital plattform. Utmaningen var dubbel: förenkla resan för arbetssökande och samtidigt attrahera nya underleverantörer, utan att kunna visa bilder på riktiga deltagare.',
    challengeTitle: 'Multifunktionell digital plattform',
    solution: 'En modern, konverteringsdriven webbplats byggd i Framer. Med intuitiv UX/UI-design och smidigt CMS skapades skräddarsydda flöden för både arbetssökande och underleverantörer. AI-genererade bilder löste sekretessutmaningen utan att tappa den mänskliga känslan.',
    solutionTitle: 'Konverteringsdriven webbplats',
    result: 'En trygg och högkonverterande plattform som sänker tröskeln till kontakt, effektiviserar intag av nya underleverantörer och ger CrownMatch en professionell digital närvaro som överträffar Arbetsförmedlingens krav.',
    resultTitle: 'Högkonverterande plattform',
    technologies: ['Framer', 'Framer CMS', 'React', 'TypeScript'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', image: '/digital/projekt/crownmatch/original-blogg.webp', uxImprovement: 'Modernare design', uxImprovements: ['Modernare', 'Tydligare'] },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.', image: '/digital/projekt/crownmatch/original-kontakt.avif', uxImprovement: 'Enklare navigering', uxImprovements: ['Enklare', 'Bättre struktur', 'Responsiv'] },
      { title: 'Matchningar', description: 'Statistik och matchningsdata presenteras tydligt så användaren ser sin utveckling.', image: '/digital/projekt/crownmatch/original-hero.avif', uxImprovement: 'Tydligare uppmaningar (CTA)', uxImprovements: ['Tydligare', 'Datavisualisering', 'Konvertering'] },
    ],
    beforeAfter: 'Från en otydlig, svårnavigerad sida till en tydlig plattform som guider besökaren rätt.',
  },
  {
    slug: 'wastgota-bil',
    title: 'Wästgöta Bil AB',
    category: 'Bilhandel',
    year: '2026',
    status: 'Lanserad',
    image: '/digital/projekt/wastgota-bil/original-desktop-hero.webp',
    cardImage: '/digital/projekt/wastgota-bil/original-desktop-hero.avif',
    conclusionImage: '/digital/projekt/wastgota-bil/original-desktop-hero.webp',
    website: 'wastgotabil.se',
    accentColor: '#B33A3A',
    stripeBaseColor: '#0a0a0a',
    tagline: 'Pålitlighet och passion för bilar',
    description: 'Vi har fått i uppdrag att utveckla en ny webbplats för Wästgöta Bil AB, en välkänd bilhandlare i Kinna med fokus på begagnade kvalitetsbilar. Målet är att skapa en modern och tydlig plattform som speglar företagets pålitlighet och passion för bilar. Den nya webbplatsen lyfter fram fordonen på ett inspirerande sätt och gör det enkelt för kunder att hitta sin nästa bil.',
    challenge: 'Wästgöta Bil behövde en webbplats som speglar deras pålitlighet och passion för bilar, samtidigt som den gör det enkelt för kunder att hitta och utforska bilarna i lager.',
    challengeTitle: 'Pålitlighet och passion',
    solution: 'En modern och tydlig plattform som lyfter fram fordonen på ett inspirerande sätt, med enkel navigering och sökfunktion för att hitta rätt bil.',
    solutionTitle: 'Modern och tydlig plattform',
    result: 'En webbplats som gör det enkelt för kunder att hitta sin nästa bil och som stärker förtroendet för varumärket.',
    resultTitle: 'Stärker förtroendet',
    technologies: ['Framer', 'Framer CMS', 'React', 'TypeScript'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', image: '/digital/projekt/wastgota-bil/original-mobil.webp', uxImprovements: ['Fordon', 'Modern'] },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.', uxImprovements: ['Sökfunktion', 'Lagerpresentation', 'Responsiv'] },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.', uxImprovements: ['Förtroende', 'Konsekvent', 'Finslipad'] },
    ],
  },
  {
    slug: 'pistolero-studio',
    title: 'Pistolero Studio',
    category: 'Skönhet & Tatuering',
    year: '2026',
    status: 'Lanserad',
    website: 'pistolero.se',
    image: '/digital/projekt/pistolero-studio/desktop-hero.webp',
    cardImage: '/digital/projekt/pistolero-studio/desktop-hero.webp',
    conclusionImage: '/digital/projekt/pistolero-studio/full-size.avif',
    accentColor: '#4B5563',
    stripeBaseColor: '#0a0a0a',
    tagline: 'Ny studio, förnyad identitet',
    description: 'När våra kunder tar nästa steg får vi ofta vara med på resan. Nu öppnar Pistolero en ny studio på Stora Brogatan 37 i Borås och vi har haft förtroendet att ta fram deras nya webbplats. I samband med flytten förnyas den lokala profilen med tydligare identitet och ny energi som vi hjälper till att skapa.',
    challenge: 'I samband med flytten till en ny studio behövde Pistolero en förnyad digital profil med tydligare identitet som speglar deras stil, från tatuering till skönhetsbehandlingar.',
    challengeTitle: 'Förnyad digital profil',
    solution: 'Vi skapade en design som är både snygg och funktionell, lyhörd för studions unika stil och den nya energin i den nya lokalen.',
    solutionTitle: 'Snygg och funktionell design',
    result: 'En webbplats som matchar studion, med en personlig känsla och helhet som kunden är supernöjd med.',
    resultTitle: 'Personlig känsla och helhet',
    technologies: ['Framer', 'Framer CMS', 'React', 'TypeScript'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', image: '/digital/projekt/pistolero-studio/mobile.webp', uxImprovements: ['Personlig', 'Funktionell'] },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.', uxImprovements: ['Tjänsteöversikt', 'Navigering', 'Responsiv'] },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.', uxImprovements: ['Unik stil', 'Konsekvent', 'Finslipad'] },
    ],
  },
  {
    slug: 'ljuva-hem-i-mark',
    title: 'Ljuva Hem i Mark',
    category: 'Städtjänst',
    year: '2026',
    status: 'Lanserad',
    image: '/digital/projekt/ljuva-hem-i-mark/desktop.webp',
    cardImage: '/digital/projekt/ljuva-hem-i-mark/desktop-front-page.avif',
    conclusionImage: '/digital/projekt/ljuva-hem-i-mark/desktop.webp',
    website: 'ljuvahemimark.se',
    accentColor: '#E8A5B0',
    stripeBaseColor: '#f5e8ea',
    tagline: 'Kvalitet, noggrannhet och personlig service',
    description: 'Vi har haft förtroendet att ta fram den nya webbplatsen åt Ljuva Hem i Mark, en städfirma med fokus på kvalitet, noggrannhet och personlig service. Målet var att skapa en modern och förtroendeingivande webbplats som tydligt presenterar deras tjänster. Resultatet är en ljus, ren och lättnavigerad design som speglar deras professionalism och känsla för ordning.',
    challenge: 'Ljuva Hem i Mark behövde en förtroendeingivande webbplats som tydligt presenterar deras städtjänster och speglar deras kvalitet och noggrannhet.',
    challengeTitle: 'Förtroendeingivande webbplats',
    solution: 'En ljus, ren och lättnavigerad design som lyfter fram tjänsterna på ett tydligt sätt och speglar företagets professionalism.',
    solutionTitle: 'Ljus och ren design',
    result: 'En webbplats som stärker förtroendet för varumärket och gör det enkelt för kunder att hitta och boka rätt tjänst.',
    resultTitle: 'Stärker förtroendet',
    technologies: ['Framer', 'Framer CMS', 'React', 'TypeScript'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', image: '/digital/projekt/ljuva-hem-i-mark/mobile.webp', uxImprovements: ['Ljus', 'Förtroende'] },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.', uxImprovements: ['Tjänstepresentation', 'Enklare bokning', 'Responsiv'] },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.', uxImprovements: ['Ordning', 'Konsekvent', 'Finslipad'] },
    ],
  },
  {
    slug: 'techpilots',
    title: 'Techpilots Webshop',
    category: 'E-handel',
    year: '2026',
    status: 'Lanserad',
    tagline: 'Vår egen plattform, byggd för prestanda',
    description: 'Vi har byggt vår egen webshop från grunden, en modern e-handelsplattform med fokus på hastighet, stabilitet och skalbarhet. Techpilots Webshop är vårt sätt att visa vad vi kan leverera, med Next.js på frontend och Medusa som backend.',
    image: '/digital/projekt/techpilots/original-desktop-hero.webp',
    cardImage: '/digital/projekt/techpilots/desktop-projekt.webp',
    conclusionImage: '/digital/projekt/techpilots/original-desktop-hero.webp',
    website: 'techpilots.se',
    accentColor: '#0a0a0a',
    stripeBaseColor: '#ffffff',
    challenge: 'Vi behövde en egen plattform som visar vår tekniska nivå, snabb, stabil och byggd för att växa med sortimentet utan att tappa prestanda när fler produkter, kategorier och besökare tillkommer.',
    challengeTitle: 'Snabb och skalbar e-handel',
    solution: 'En skräddarsydd lösning med Next.js för frontend, Medusa som backend på egen VPS och Payload CMS för innehåll, byggd för snabba sidladdningar och enkel förvaltning.',
    solutionTitle: 'Modern teknikstack',
    result: 'En webshop som fungerar som referensprojekt, snabb, pålitlig och en tydlig representation av vår kompetens inom fullstack-utveckling, från frontend till drift.',
    resultTitle: 'Vår egen visitkort',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Medusa', 'Payload CMS', 'PostgreSQL', 'Stripe', 'Framer Motion'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', image: '/digital/projekt/techpilots/original-mobil.webp', uxImprovements: ['Snabb', 'Tydlig'] },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.', image: '/digital/projekt/techpilots/original-desktop-produktinfo.webp', uxImprovements: ['Navigering', 'Produktpresentation', 'Responsiv'] },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.', image: '/digital/projekt/techpilots/original-mobil-kassa.avif', uxImprovements: ['Varumärke', 'Skalbar', 'Finslipad'] },
    ],
  },
];
