export type ProjectStep = {
  title: string;
  description: string;
  image?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  status: string;
  description: string;
  image?: string;
  website?: string;
  challenge?: string;
  solution?: string;
  result?: string;
  technologies?: string[];
  steps?: ProjectStep[];
  mobileImage?: string;
  tabletImage?: string;
  conclusionImage?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: 'sagateatern',
    title: 'Sagateatern',
    category: 'Webb & Varumärke',
    year: '2025',
    status: 'Lanserad',
    website: 'sagateatern.nu',
    description: 'Sagateatern i Borås är en kulturarena där scenkonst möter mat och gemenskap. Med ny regi och tydlig vision behövdes en digital plattform som speglar teaterns identitet och gör det enkelt att boka bord, hitta evenemang och hyra lokal.',
    challenge: 'Sagateatern behövde en digital närvaro som speglade den nya visionen, en plats där mat och scenkonst möts, samtidigt som besökare enkelt skulle kunna boka bord, hitta evenemang och hyra lokal.',
    solution: 'Vi byggde en modern, lättnavigerad webbplats med tydlig bokningsflöde och ett visuellt uttryck som förenar teaterns kulturella identitet med en varm, inbjudande känsla.',
    result: 'En webbplats som speglar vad Sagateatern faktiskt är idag och som gör det enklare för besökare att hitta rätt, boka bord och delta i evenemang.',
    technologies: ['Next.js', 'Payload CMS', 'Stripe'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.' },
    ],
  },
  {
    slug: 'crownmatch',
    title: 'Crownmatch',
    category: 'Webb & Varumärke',
    year: '2025',
    status: 'Lanserad',
    image: '/tjanster/projekt/crownmatch/laptop-mockup.png',
    description: 'Vi har fått i uppdrag att utveckla en webbplats för CrownMatch, leverantör av Arbetsförmedlingens tjänst Rusta & Matcha. Efter att ha träffat teamet för att förstå deras vision och behov skapar vi en modern, lättnavigerad plattform som gör det enkelt för arbetssökande att hitta information, ta del av tjänsterna samt komma i kontakt. Webbplatsen speglar varumärket CrownMatch och underlättar kommunikationen mellan kandidater och arbetsgivare på ett engagerande sätt.',
    challenge: 'CrownMatch behövde en digital plattform som gör det enkelt för arbetssökande att hitta information om Rusta & Matcha-tjänsten och komma i kontakt med rätt person.',
    solution: 'En modern, lättnavigerad webbplats med tydlig struktur som speglar varumärket CrownMatch och underlättar kommunikationen mellan kandidater och arbetsgivare.',
    result: 'En plattform som gör det enklare för arbetssökande att ta del av tjänsterna och komma i kontakt, med ett engagerande och professionellt uttryck.',
    technologies: ['Next.js', 'Payload CMS'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.', image: '/tjanster/projekt/crownmatch/mobile-mockup.png' },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.', image: '/tjanster/projekt/crownmatch/mobile-mockup.png' },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.', image: '/tjanster/projekt/crownmatch/mobile-mockup.png' },
    ],
  },
  {
    slug: 'wastgota-bil',
    title: 'Wästgöta Bil AB',
    category: 'Webb & Varumärke',
    year: '2025',
    status: 'Lanserad',
    description: 'Vi har fått i uppdrag att utveckla en ny webbplats för Wästgöta Bil AB, en välkänd bilhandlare i Kinna med fokus på begagnade kvalitetsbilar. Målet är att skapa en modern och tydlig plattform som speglar företagets pålitlighet och passion för bilar. Den nya webbplatsen lyfter fram fordonen på ett inspirerande sätt och gör det enkelt för kunder att hitta sin nästa bil.',
    challenge: 'Wästgöta Bil behövde en webbplats som speglar deras pålitlighet och passion för bilar, samtidigt som den gör det enkelt för kunder att hitta och utforska bilarna i lager.',
    solution: 'En modern och tydlig plattform som lyfter fram fordonen på ett inspirerande sätt, med enkel navigering och sökfunktion för att hitta rätt bil.',
    result: 'En webbplats som gör det enkelt för kunder att hitta sin nästa bil och som stärker förtroendet för varumärket.',
    technologies: ['Next.js', 'Payload CMS'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.' },
    ],
  },
  {
    slug: 'pistolero-studio',
    title: 'Pistolero Studio',
    category: 'Design & UX',
    year: '2025',
    status: 'Lanserad',
    description: 'När våra kunder tar nästa steg får vi ofta vara med på resan. Nu öppnar Pistolero en ny studio på Stora Brogatan 37 i Borås och vi har haft förtroendet att ta fram deras nya webbplats. I samband med flytten förnyas den lokala profilen med tydligare identitet och ny energi som vi hjälper till att skapa.',
    challenge: 'I samband med flytten till en ny studio behövde Pistolero en förnyad digital profil med tydligare identitet som speglar deras stil, från tatuering till skönhetsbehandlingar.',
    solution: 'Vi skapade en design som är både snygg och funktionell, lyhörd för studions unika stil och den nya energin i den nya lokalen.',
    result: 'En webbplats som matchar studion, med en personlig känsla och helhet som kunden är supernöjd med.',
    technologies: ['Next.js', 'Payload CMS'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.' },
    ],
  },
  {
    slug: 'ljuva-hem-i-mark',
    title: 'Ljuva Hem i Mark',
    category: 'Webb & Varumärke',
    year: '2025',
    status: 'Lanserad',
    description: 'Vi har haft förtroendet att ta fram den nya webbplatsen åt Ljuva Hem i Mark, en städfirma med fokus på kvalitet, noggrannhet och personlig service. Målet var att skapa en modern och förtroendeingivande webbplats som tydligt presenterar deras tjänster. Resultatet är en ljus, ren och lättnavigerad design som speglar deras professionalism och känsla för ordning.',
    challenge: 'Ljuva Hem i Mark behövde en förtroendeingivande webbplats som tydligt presenterar deras städtjänster och speglar deras kvalitet och noggrannhet.',
    solution: 'En ljus, ren och lättnavigerad design som lyfter fram tjänsterna på ett tydligt sätt och speglar företagets professionalism.',
    result: 'En webbplats som stärker förtroendet för varumärket och gör det enkelt för kunder att hitta och boka rätt tjänst.',
    technologies: ['Next.js', 'Payload CMS'],
    steps: [
      { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
      { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
      { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.' },
    ],
  },
];
