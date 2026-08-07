export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  status: string;
  description: string;
  image?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: 'sagateatern',
    title: 'Sagateatern',
    category: 'Webb & Varumärke',
    year: '2025',
    status: 'Lanserad',
    description: 'Sagateatern i Borås är en kulturarena där scenkonst möter mat och gemenskap. Med ny regi och tydlig vision behövdes en digital plattform som speglar teaterns identitet och gör det enkelt att boka bord, hitta evenemang och hyra lokal.',
  },
  {
    slug: 'crownmatch',
    title: 'Crownmatch',
    category: 'Webb & Varumärke',
    year: '2025',
    status: 'Lanserad',
    description: 'Vi har fått i uppdrag att utveckla en webbplats för CrownMatch, leverantör av Arbetsförmedlingens tjänst Rusta & Matcha. Efter att ha träffat teamet för att förstå deras vision och behov skapar vi en modern, lättnavigerad plattform som gör det enkelt för arbetssökande att hitta information, ta del av tjänsterna samt komma i kontakt. Webbplatsen speglar varumärket CrownMatch och underlättar kommunikationen mellan kandidater och arbetsgivare på ett engagerande sätt.',
  },
  {
    slug: 'wastgota-bil',
    title: 'Wästgöta Bil AB',
    category: 'Webb & Varumärke',
    year: '2025',
    status: 'Lanserad',
    description: 'Vi har fått i uppdrag att utveckla en ny webbplats för Wästgöta Bil AB, en välkänd bilhandlare i Kinna med fokus på begagnade kvalitetsbilar. Målet är att skapa en modern och tydlig plattform som speglar företagets pålitlighet och passion för bilar. Den nya webbplatsen lyfter fram fordonen på ett inspirerande sätt och gör det enkelt för kunder att hitta sin nästa bil.',
  },
  {
    slug: 'pistolero-studio',
    title: 'Pistolero Studio',
    category: 'Design & UX',
    year: '2025',
    status: 'Lanserad',
    description: 'När våra kunder tar nästa steg får vi ofta vara med på resan. Nu öppnar Pistolero en ny studio på Stora Brogatan 37 i Borås och vi har haft förtroendet att ta fram deras nya webbplats. I samband med flytten förnyas den lokala profilen med tydligare identitet och ny energi som vi hjälper till att skapa.',
  },
  {
    slug: 'ljuva-hem-i-mark',
    title: 'Ljuva Hem i Mark',
    category: 'Webb & Varumärke',
    year: '2025',
    status: 'Lanserad',
    description: 'Vi har haft förtroendet att ta fram den nya webbplatsen åt Ljuva Hem i Mark, en städfirma med fokus på kvalitet, noggrannhet och personlig service. Målet var att skapa en modern och förtroendeingivande webbplats som tydligt presenterar deras tjänster. Resultatet är en ljus, ren och lättnavigerad design som speglar deras professionalism och känsla för ordning.',
  },
];
