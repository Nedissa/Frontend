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
    image: '/digital/projekt/sagateatern/full-size.avif',
    cardImage: '/digital/projekt/sagateatern/original-hero.avif',
    conclusionImage: '/digital/projekt/sagateatern/full-size.avif',
    website: 'sagateatern.nu',
    accentColor: '#B33A3A',
    stripeBaseColor: '#0a0a0a',
    tagline: 'Där scenkonst möter mat och gemenskap',
    description: 'Sagateatern i Borås är en kulturarena där scenkonst möter mat och gemenskap. Med ny regi och tydlig vision behövdes en digital plattform som speglar teaterns identitet och gör det enkelt att boka bord, hitta evenemang och hyra lokal.',
    challenge: 'Ny regi, ny vision, men ingen digital plattform som visade det. Sagateatern behövde en webbnärvaro som speglade en kulturarena där mat och scenkonst möts. Besökare skulle enkelt kunna boka bord, hitta evenemang och hyra lokal, allt på samma ställe, utan att känslan av teatern gick förlorad.',
    challengeTitle: 'Ny digital närvaro',
    solution: 'Vi byggde en webbplats kring ett tydligt bokningsflöde där varje steg känns självklart för besökaren. Det visuella uttrycket förenar teaterns kulturella arv med en varm, inbjudande känsla som matchar den nya regin. Resultatet blev en plattform som är lika enkel att navigera som den är vacker att se.',
    solutionTitle: 'Lättnavigerad webbplats',
    result: 'En digital scen som speglar Sagateatern som den faktiskt är idag, inte som den var. Besökare hittar snabbt rätt evenemang, bokar bord utan krångel och känner teaterns identitet redan på startsidan. Det har gjort skillnad både för gäster och för teamet bakom kulisserna.',
    resultTitle: 'Speglar Sagateatern idag',
    technologies: ['Framer', 'Framer CMS', 'React', 'TypeScript'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', uxImprovements: ['Varm', 'Kulturell'] },
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
    image: '/digital/projekt/crownmatch/hela-sidan.avif',
    cardImage: '/digital/projekt/crownmatch/original-hero.avif',
    conclusionImage: '/digital/projekt/crownmatch/hela-sidan.avif',
    website: 'crownmatch.se',
    accentColor: '#E8C547',
    stripeBaseColor: '#4B5563',
    tagline: 'Rusta och matcha, vägen till jobb och framtid',
    description: 'Vi har fått i uppdrag att utveckla en webbplats för CrownMatch, leverantör av Arbetsförmedlingens tjänst Rusta & Matcha. Efter att ha träffat teamet för att förstå deras vision och behov skapar vi en modern, lättnavigerad plattform som gör det enkelt för arbetssökande att hitta information, ta del av tjänsterna samt komma i kontakt. Webbplatsen speglar varumärket CrownMatch och underlättar kommunikationen mellan kandidater och arbetsgivare på ett engagerande sätt.',
    challenge: 'Som huvudleverantör till Arbetsförmedlingen för Rusta och Matcha behövde CrownMatch en plattform som löste två saker samtidigt. Den skulle förenkla resan för arbetssökande och samtidigt attrahera nya underleverantörer till nätverket. Utmaningen låg i sekretessen: inga bilder på riktiga deltagare fick användas, men plattformen skulle ändå kännas mänsklig och trygg.',
    challengeTitle: 'Multifunktionell digital plattform',
    solution: 'Vi byggde en konverteringsdriven webbplats i Framer med skräddarsydda flöden för både arbetssökande och underleverantörer. Intuitiv UX/UI-design och ett smidigt CMS gjorde innehållet enkelt att förvalta. AI-genererade bilder löste sekretessutmaningen utan att plattformen kändes kall eller opersonlig.',
    solutionTitle: 'Konverteringsdriven webbplats',
    result: 'En trygg och högkonverterande plattform som sänker tröskeln till kontakt för både kandidater och arbetsgivare. Intaget av nya underleverantörer går snabbare, och CrownMatch har fått en professionell digital närvaro som överträffar Arbetsförmedlingens krav. Resultatet talar för sig själv i både trafik och konvertering.',
    resultTitle: 'Högkonverterande plattform',
    technologies: ['Framer', 'Framer CMS', 'React', 'TypeScript'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', uxImprovement: 'Modernare design', uxImprovements: ['Modernare', 'Tydligare'] },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.', uxImprovement: 'Enklare navigering', uxImprovements: ['Enklare', 'Bättre struktur', 'Responsiv'] },
      { title: 'Matchningar', description: 'Statistik och matchningsdata presenteras tydligt så användaren ser sin utveckling.', uxImprovement: 'Tydligare uppmaningar (CTA)', uxImprovements: ['Tydligare', 'Datavisualisering', 'Konvertering'] },
    ],
    beforeAfter: 'Från en otydlig, svårnavigerad sida till en tydlig plattform som guider besökaren rätt.',
  },
  {
    slug: 'wastgota-bil',
    title: 'Wästgöta Bil AB',
    category: 'Bilhandel',
    year: '2026',
    status: 'Lanserad',
    image: '/digital/projekt/wastgota-bil/original-full-size.avif',
    cardImage: '/digital/projekt/wastgota-bil/original-desktop-hero.avif',
    conclusionImage: '/digital/projekt/wastgota-bil/original-full-size.avif',
    website: 'wastgotabil.se',
    accentColor: '#B33A3A',
    stripeBaseColor: '#0a0a0a',
    tagline: 'Pålitlighet och passion för bilar',
    description: 'Vi har fått i uppdrag att utveckla en ny webbplats för Wästgöta Bil AB, en välkänd bilhandlare i Kinna med fokus på begagnade kvalitetsbilar. Målet är att skapa en modern och tydlig plattform som speglar företagets pålitlighet och passion för bilar. Den nya webbplatsen lyfter fram fordonen på ett inspirerande sätt och gör det enkelt för kunder att hitta sin nästa bil.',
    challenge: 'Wästgöta Bil är en välkänd bilhandlare i Kinna med fokus på begagnade kvalitetsbilar, men den gamla webbplatsen speglade varken pålitligheten eller passionen bakom varumärket. Sortimentet fanns redan på Blocket, men kunder som landade på webbplatsen hade ingen tydlig väg dit. Det behövdes en plattform som byggde förtroende och sedan guidade besökaren rakt in i lagret.',
    challengeTitle: 'Pålitlighet och passion',
    solution: 'Vi skapade en modern och tydlig plattform som lyfter fram fordonen på ett inspirerande sätt, bild för bild. Navigeringen är byggd för att leda kunden vidare till Blocket-annonserna utan omvägar eller förvirring. Designen andas kvalitet på samma sätt som bilarna själva gör.',
    solutionTitle: 'Modern och tydlig plattform',
    result: 'En webbplats som gör det enkelt för kunder att hitta sin nästa bil, och som sömlöst tar dem vidare till rätt annons på Blocket. Förtroendet för varumärket stärks redan i det första intrycket, innan sortimentet ens visas. Wästgöta Bil har nu en digital närvaro som matchar deras rykte på riktigt.',
    resultTitle: 'Stärker förtroendet',
    technologies: ['Framer', 'Framer CMS', 'React', 'TypeScript'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', uxImprovements: ['Fordon', 'Modern'] },
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
    image: '/digital/projekt/pistolero-studio/full-size.avif',
    cardImage: '/digital/projekt/pistolero-studio/desktop-hero.webp',
    conclusionImage: '/digital/projekt/pistolero-studio/full-size.avif',
    accentColor: '#4B5563',
    stripeBaseColor: '#0a0a0a',
    tagline: 'Ny studio, förnyad identitet',
    description: 'När våra kunder tar nästa steg får vi ofta vara med på resan. Nu öppnar Pistolero en ny studio på Stora Brogatan 37 i Borås och vi har haft förtroendet att ta fram deras nya webbplats. I samband med flytten förnyas den lokala profilen med tydligare identitet och ny energi som vi hjälper till att skapa.',
    challenge: 'Pistolero öppnar en ny studio på Stora Brogatan 37 i Borås, och flytten krävde en förnyad digital profil. Identiteten skulle spegla hela bredden av studions stil, från tatuering till skönhetsbehandlingar. Den gamla webbplatsen höll varken visuellt eller funktionellt för den nya energin i lokalen.',
    challengeTitle: 'Förnyad digital profil',
    solution: 'Vi skapade en design som är både snygg och funktionell, lyhörd för studions unika uttryck. Varje detalj är byggd för att fånga känslan av den nya lokalen och den energi som följer med flytten. Resultatet blev en webbplats som känns lika personlig som ett besök i studion.',
    solutionTitle: 'Snygg och funktionell design',
    result: 'En webbplats som matchar studion på riktigt, med en personlig känsla och helhet genom hela upplevelsen. Kunden är supernöjd med resultatet, och det syns redan i hur besökare rör sig på sidan. Pistolero har nu en digital identitet som lever upp till den nya studion.',
    resultTitle: 'Personlig känsla och helhet',
    technologies: ['Framer', 'Framer CMS', 'React', 'TypeScript'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', uxImprovements: ['Personlig', 'Funktionell'] },
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
    image: '/digital/projekt/ljuva-hem-i-mark/full-size.avif',
    cardImage: '/digital/projekt/ljuva-hem-i-mark/desktop-front-page.avif',
    conclusionImage: '/digital/projekt/ljuva-hem-i-mark/full-size.avif',
    website: 'ljuvahemimark.se',
    accentColor: '#E8A5B0',
    stripeBaseColor: '#f5e8ea',
    tagline: 'Kvalitet, noggrannhet och personlig service',
    description: 'Vi har haft förtroendet att ta fram den nya webbplatsen åt Ljuva Hem i Mark, en städfirma med fokus på kvalitet, noggrannhet och personlig service. Målet var att skapa en modern och förtroendeingivande webbplats som tydligt presenterar deras tjänster. Resultatet är en ljus, ren och lättnavigerad design som speglar deras professionalism och känsla för ordning.',
    challenge: 'Ljuva Hem i Mark är en städfirma med fokus på kvalitet, noggrannhet och personlig service, men webbplatsen förmedlade ingetdera. Tjänsterna behövde presenteras tydligt så att kunder snabbt förstod vad de fick. Förtroende skulle byggas redan från första klick, inte först efter ett möte.',
    challengeTitle: 'Förtroendeingivande webbplats',
    solution: 'Vi skapade en ljus, ren och lättnavigerad design som lyfter fram tjänsterna på ett tydligt sätt. Varje sida speglar företagets professionalism och känsla för ordning, från struktur till typografi. Designen känns lika omsorgsfull som städningen den säljer.',
    solutionTitle: 'Ljus och ren design',
    result: 'En webbplats som stärker förtroendet för varumärket redan innan första kontakten. Kunder hittar och bokar rätt tjänst snabbt, utan att behöva fråga sig fram. Ljuva Hem i Mark har nu en digital närvaro som matchar kvaliteten i deras arbete.',
    resultTitle: 'Stärker förtroendet',
    technologies: ['Framer', 'Framer CMS', 'React', 'TypeScript'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', uxImprovements: ['Ljus', 'Förtroende'] },
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
    image: '/digital/projekt/techpilots/original-full-size.avif',
    cardImage: '/digital/projekt/techpilots/desktop-projekt.webp',
    conclusionImage: '/digital/projekt/techpilots/original-full-size.avif',
    website: 'techpilots.se',
    accentColor: '#0a0a0a',
    stripeBaseColor: '#ffffff',
    challenge: 'Vi ville visa vår tekniska nivå på riktigt, inte bara berätta om den. Plattformen behövde vara snabb och stabil från dag ett, samtidigt byggd för att växa med sortimentet. Prestanda fick aldrig tappas när fler produkter, kategorier och besökare tillkommer över tid.',
    challengeTitle: 'Snabb och skalbar e-handel',
    solution: 'Vi byggde en skräddarsydd lösning med Next.js på frontend, Medusa som backend på egen VPS och Payload CMS för innehållet. Varje val i stacken gjordes för snabba sidladdningar och enkel förvaltning över tid. Resultatet är en arkitektur som är lika snabb att utveckla i som den är att besöka.',
    solutionTitle: 'Modern teknikstack',
    result: 'En webshop som fungerar som vårt eget referensprojekt, snabb, pålitlig och byggd för att skalas. Den är en tydlig representation av vår kompetens inom fullstack-utveckling, från frontend till drift på egen server. Techpilots Webshop är helt enkelt vårt eget visitkort, i produktion varje dag.',
    resultTitle: 'Vår egen visitkort',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Medusa', 'Payload CMS', 'PostgreSQL', 'Stripe', 'Framer Motion'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', uxImprovements: ['Snabb', 'Tydlig'] },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.', uxImprovements: ['Navigering', 'Produktpresentation', 'Responsiv'] },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.', uxImprovements: ['Varumärke', 'Skalbar', 'Finslipad'] },
    ],
  },
];
