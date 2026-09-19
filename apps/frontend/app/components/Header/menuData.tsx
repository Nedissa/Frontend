import React from 'react';
import Image from 'next/image';

// categoryHandles: Medusas product_category-handles som denna menynod
// motsvarar. Används för att koppla ihop meny, kategorisidor och
// produktfiltrering utan att dubblera kategoridata på flera ställen.
export interface MenuItem {
  id: string;
  title: string;
  url: string;
  categoryHandles?: string[];
  items?: MenuItem[];
}

export interface MenuSection {
  id: string;
  title: string;
  url: string;
  categoryHandles?: string[];
  items?: MenuItem[];
}

export interface MenuCategory {
  id: string;
  title: string;
  url: string;
  categoryHandles?: string[];
  items?: MenuSection[];
}

export interface SearchProduct {
  id: string;
  variantId?: string;
  title: string;
  handle?: string;
  image: string;
  category: string;
  price: number;
  rating?: number;
  reviews?: number;
  sku?: string;
  manufacturerSku?: string;
}

export const MENU_DATA: MenuCategory[] = [
  {
    id: 'datorer-och-tillbehor',
    title: 'Datorer',
    url: '/kategori/datorer-tillbehor',
    categoryHandles: ['datorer', 'laptops', 'laptop-tillbehor', 'stationardator-tillbehor', 'vaskor', 'blackpatroner', 'kablar', 'batterier', 'monitorarm', 'tangentbord'],
    items: [
      {
        id: 'barbara',
        title: 'Bärbara',
        url: '/kategori/barbara',
        categoryHandles: ['laptops'],
        items: [
          { id: 'ultrabooks', title: 'Ultrabooks', url: '/kategori/barbara' },
          { id: 'gaming-barbara', title: 'Gaming bärbara', url: '/kategori/barbara' },
          { id: 'kontor-barbara', title: 'Kontor', url: '/kategori/barbara' },
        ],
      },
      {
        id: 'stationara',
        title: 'Stationära',
        url: '/kategori/stationara',
        categoryHandles: ['datorer'],
        items: [
          { id: 'mini-pc', title: 'Mini-PC', url: '/kategori/stationara' },
          { id: 'allt-i-ett', title: 'Allt-i-ett-datorer', url: '/kategori/stationara' },
          { id: 'arbetsdatorer', title: 'Arbetsdatorer', url: '/kategori/stationara' },
        ],
      },
      {
        id: 'skarmar-tillbehor',
        title: 'Skärm Tillbehör',
        url: '/kategori/datortillbehor',
        categoryHandles: ['monitorarm'],
        items: [
          { id: 'bildskarm', title: 'Bildskärmar', url: '/kategori/datortillbehor' },
          { id: 'monitorarm', title: 'Monitorarm', url: '/kategori/monitorarm', categoryHandles: ['monitorarm'] },
        ],
      },
      {
        id: 'tangentbord-moss',
        title: 'Tangentbord & Möss',
        url: '/kategori/datortillbehor',
        categoryHandles: ['tangentbord'],
        items: [
          { id: 'tangentbord', title: 'Tangentbord', url: '/kategori/tangentbord', categoryHandles: ['tangentbord'] },
          { id: 'moss', title: 'Möss', url: '/kategori/datortillbehor' },
        ],
      },
      {
        id: 'kablar-laddning',
        title: 'Kablar & Laddning',
        url: '/kategori/kablar',
        categoryHandles: ['kablar', 'dockningsstationer'],
        items: [
          { id: 'kablar', title: 'Laddning', url: '/kategori/kablar', categoryHandles: ['kablar'] },
          { id: 'dockningsstationer', title: 'Dockningsstationer', url: '/kategori/dockningsstationer', categoryHandles: ['dockningsstationer'] },
        ],
      },
      {
        id: 'kontor-forvaring',
        title: 'Kontor & Förvaring',
        url: '/kategori/datortillbehor',
        categoryHandles: ['vaskor', 'blackpatroner', 'batterier'],
        items: [
          { id: 'vaskor', title: 'Väskor & Fodral', url: '/kategori/vaskor', categoryHandles: ['vaskor'] },
          { id: 'blackpatroner', title: 'Bläckpatroner & Toners', url: '/kategori/blackpatroner', categoryHandles: ['blackpatroner'] },
          { id: 'batterier', title: 'Batterier', url: '/kategori/batterier', categoryHandles: ['batterier'] },
        ],
      },
    ],
  },
  {
    id: 'komponenter',
    title: 'Komponenter',
    url: '/kategori/datorkomponenter',
    categoryHandles: ['grafikkort', 'grafikkort-tillbehor', 'kylar', 'kylare-tillbehor'],
    items: [
      {
        id: 'processorer',
        title: 'Processorer',
        url: '/kategori/processorer',
        items: [
          { id: 'intel', title: 'Intel', url: '/kategori/processorer' },
          { id: 'amd', title: 'AMD', url: '/kategori/processorer' },
        ],
      },
      {
        id: 'moderkort',
        title: 'Moderkort',
        url: '/kategori/moderkort',
        items: [
          { id: 'intel-socket', title: 'Intel', url: '/kategori/moderkort' },
          { id: 'amd-socket', title: 'AMD', url: '/kategori/moderkort' },
        ],
      },
      {
        id: 'grafikkort',
        title: 'Grafikkort',
        url: '/kategori/grafikkort',
        categoryHandles: ['grafikkort', 'grafikkort-tillbehor'],
        items: [
          { id: 'nvidia', title: 'NVIDIA', url: '/kategori/grafikkort' },
          { id: 'amd-gpu', title: 'AMD', url: '/kategori/grafikkort' },
        ],
      },
      {
        id: 'ram',
        title: 'RAM-minne',
        url: '/kategori/ram',
        items: [
          { id: 'ddr5', title: 'DDR5', url: '/kategori/ram' },
          { id: 'ddr4', title: 'DDR4', url: '/kategori/ram' },
        ],
      },
      {
        id: 'lagringsenhet',
        title: 'Lagring',
        url: '/kategori/lagring',
        items: [
          { id: 'ssd-nvme', title: 'SSD NVMe', url: '/kategori/lagring' },
          { id: 'ssd-sata', title: 'SSD SATA', url: '/kategori/lagring' },
          { id: 'hdd', title: 'Hårddiskar', url: '/kategori/lagring' },
        ],
      },
      {
        id: 'natlagring',
        title: 'Nätaggregat',
        url: '/kategori/natagregat',
        items: [
          { id: 'modular', title: 'Modulärt', url: '/kategori/natagregat' },
          { id: 'semi-modular', title: 'Semi-modulärt', url: '/kategori/natagregat' },
        ],
      },
    ],
  },
  {
    id: 'gaming',
    title: 'Gaming',
    url: '/kategori/gaming',
    items: [
      {
        id: 'gaming-mus-tangentbord',
        title: 'Mus & Tangentbord',
        url: '/kategori/gaming-tillbehor',
        categoryHandles: ['moss', 'gaming-tangentbord'],
        items: [
          { id: 'gaming-mus', title: 'Gaming Möss', url: '/kategori/moss', categoryHandles: ['moss'] },
          { id: 'gaming-tangentbord', title: 'Gaming Tangentbord', url: '/kategori/gaming-tangentbord', categoryHandles: ['gaming-tangentbord'] },
        ],
      },
      {
        id: 'gaming-headset-sektion',
        title: 'Headset',
        url: '/kategori/gaming-headset',
        categoryHandles: ['gaming-headset'],
        items: [
          { id: 'gaming-headset', title: 'Gaming Headset', url: '/kategori/gaming-headset', categoryHandles: ['gaming-headset'] },
        ],
      },
      {
        id: 'gaming-mobler',
        title: 'Möbler',
        url: '/kategori/gaming-tillbehor',
        categoryHandles: ['gaming-stolar', 'gaming-bord'],
        items: [
          { id: 'gaming-stolar', title: 'Gaming Stolar', url: '/kategori/gaming-stolar', categoryHandles: ['gaming-stolar'] },
          { id: 'gaming-bord', title: 'Gaming Bord', url: '/kategori/gaming-bord', categoryHandles: ['gaming-bord'] },
        ],
      },
      {
        id: 'gaming-streaming',
        title: 'Streaming',
        url: '/kategori/mikrofoner',
        categoryHandles: ['mikrofoner'],
        items: [
          { id: 'mikrofoner', title: 'Mikrofoner', url: '/kategori/mikrofoner', categoryHandles: ['mikrofoner'] },
        ],
      },
    ],
  },
  {
    id: 'mobiltelefoner',
    title: 'Mobiltelefoner',
    url: '/kategori/mobiltelefoner',
    items: [
      {
        id: 'mobil-laddning',
        title: 'Laddning',
        url: '/kategori/mobil-laddare',
        categoryHandles: ['mobil-laddare'],
        items: [
          { id: 'mobil-laddare', title: 'Adaptrar', url: '/kategori/mobil-laddare', categoryHandles: ['mobil-laddare'] },
        ],
      },
    ],
  },
  {
    id: 'natverk',
    title: 'Nätverk',
    url: '/kategori/natverk',
    items: [
      {
        id: 'accesspunkter',
        title: 'Accesspunkter',
        url: '/kategori/accesspunkter',
        items: [
          { id: 'wifi6', title: 'WiFi 6', url: '/kategori/accesspunkter' },
          { id: 'wifi7', title: 'WiFi 7', url: '/kategori/accesspunkter' },
        ],
      },
      {
        id: 'natsverksforlangarе',
        title: 'Nätverksförlängare',
        url: '/kategori/natverksforlangare',
        items: [
          { id: 'wifi-forlangarе', title: 'WiFi', url: '/kategori/natverksforlangare' },
          { id: 'mesh-forlangarе', title: 'Mesh', url: '/kategori/natverksforlangare' },
        ],
      },
      {
        id: 'routrar',
        title: 'Routrar',
        url: '/kategori/routrar',
        items: [
          { id: 'wifi6-routrar', title: 'WiFi 6', url: '/kategori/routrar' },
          { id: 'wifi7-routrar', title: 'WiFi 7', url: '/kategori/routrar' },
          { id: 'gaming-routrar', title: 'Gaming', url: '/kategori/routrar' },
        ],
      },
      {
        id: 'mesh',
        title: 'Mesh Nätverk',
        url: '/kategori/mesh-natverk',
        items: [
          { id: 'mesh-wifi6', title: 'WiFi 6', url: '/kategori/mesh-natverk' },
          { id: 'mesh-wifi7', title: 'WiFi 7', url: '/kategori/mesh-natverk' },
        ],
      },
    ],
  },
  {
    id: 'tv-hifi',
    title: 'Ljud & Bild',
    url: '/kategori/tv-hifi',
    items: [
      {
        id: 'tv-montering',
        title: 'Montering',
        url: '/kategori/tv-tillbehor',
        categoryHandles: ['tv-vaggfasten', 'tv-golvstativ'],
        items: [
          { id: 'tv-vaggfasten', title: 'Väggfästen', url: '/kategori/tv-vaggfasten', categoryHandles: ['tv-vaggfasten'] },
          { id: 'tv-golvstativ', title: 'Golvstativ', url: '/kategori/tv-golvstativ', categoryHandles: ['tv-golvstativ'] },
        ],
      },
      {
        id: 'tv-hemmabio',
        title: 'Hemmabio',
        url: '/kategori/tv-tillbehor',
        categoryHandles: ['tv-projektorer', 'tv-projektordukar'],
        items: [
          { id: 'tv-projektorer', title: 'Projektorer', url: '/kategori/tv-projektorer', categoryHandles: ['tv-projektorer'] },
          { id: 'tv-projektordukar', title: 'Projektordukar', url: '/kategori/tv-projektordukar', categoryHandles: ['tv-projektordukar'] },
        ],
      },
      {
        id: 'horlur-sektion',
        title: 'Hörlurar',
        url: '/kategori/horlur',
        categoryHandles: ['horlur'],
        items: [
          { id: 'horlur', title: 'Hörlurar', url: '/kategori/horlur', categoryHandles: ['horlur'] },
        ],
      },
    ],
  },
  {
    id: 'kontor',
    title: 'Kontor',
    url: '/kategori/kontor',
    categoryHandles: ['skrivbordsramar', 'skrivbordsskivor'],
    items: [
      {
        id: 'kontorsmobler',
        title: 'Skrivbord',
        url: '/kategori/kontor',
        categoryHandles: ['skrivbordsramar', 'skrivbordsskivor'],
        items: [
          { id: 'skrivbordsramar', title: 'Skrivbordsramar', url: '/kategori/skrivbordsramar', categoryHandles: ['skrivbordsramar'] },
          { id: 'skrivbordsskivor', title: 'Skrivbordsskivor', url: '/kategori/skrivbordsskivor', categoryHandles: ['skrivbordsskivor'] },
        ],
      },
    ],
  },
];

// Tar bort menyposter utan koppling till en kategori som faktiskt har
// produkter, rekursivt nerifrån och upp. En post är giltig om den själv har
// en categoryHandle med produkter, ELLER minst ett giltigt barn efter
// filtrering. Ett blad utan categoryHandles och utan barn är alltid ogiltigt
// (det representerar ingen riktig produktkategori) - varje löv i menyn ska
// ha sin egen categoryHandle kopplad till Medusa, aldrig ärva förälderns status.
function filterMenuItems(items: MenuItem[] | undefined, activeHandles: Set<string>): MenuItem[] | undefined {
  if (!items) return items;
  return items
    .map((item) => ({ ...item, items: filterMenuItems(item.items, activeHandles) }))
    .filter((item) => {
      const hasActiveHandle = item.categoryHandles?.some((h) => activeHandles.has(h));
      const hasChildren = (item.items?.length ?? 0) > 0;
      return hasActiveHandle || hasChildren;
    });
}

export function filterActiveMenu(menu: MenuCategory[], activeHandles: string[]): MenuCategory[] {
  const activeSet = new Set(activeHandles);
  return menu
    .map((category) => ({ ...category, items: filterMenuItems(category.items, activeSet) as MenuSection[] | undefined }))
    .filter((category) => {
      const hasActiveHandle = category.categoryHandles?.some((h) => activeSet.has(h));
      const hasChildren = (category.items?.length ?? 0) > 0;
      return hasActiveHandle || hasChildren;
    });
}

export const SECTION_IMAGES: Record<string, string> = {
  barbara: '/assets/mega-barbara-menu.webp',
  stationara: '/assets/mega-stationara-menu.webp',
  datortillbehor: '/assets/mega-datortillbehor-menu.webp',
  processorer: '/assets/mega-processorer-menu.webp',
  moderkort: '/assets/mega-moderkort-menu.webp',
  grafikkort: '/assets/mega-grafikkort-menu.webp',
  ram: '/assets/mega-ram-menu.webp',
  lagringsenhet: '/assets/mega-lagring-menu.webp',
  natlagring: '/assets/mega-natlaggregat-menu.webp',
  'gaming-laptops': '/assets/mega-gaming-laptop-menu.webp',
  'gaming-pc': '/assets/mega-gaming-pc-menu.webp',
  'gaming-peripherals': '/assets/mega-gaming-tillbehor-menu.webp',
  smartphones: '/assets/mega-smartphones-menu.webp',
  'mobil-tillbehor': '/assets/mega-mobil-tillbehor-menu.webp',
  accesspunkter: '/assets/mega-accesspunkter-menu.webp',
  kontorsmobler: '/assets/mega-bordsben-menu.webp',
  'skarmar-tillbehor': '/assets/mega-skarmar-tillbehor-menu.webp',
  'tangentbord-moss': '/assets/mega-tangentbord-moss-menu.webp',
  'kablar-laddning': '/assets/mega-kablar-laddning-menu.webp',
  'kontor-forvaring': '/assets/mega-kontor-forvaring-menu.webp',
  'gaming-mus-tangentbord': '/assets/mega-gaming-mus-tangentbord-menu.webp',
  'gaming-headset-sektion': '/assets/mega-gaming-headset-sektion-menu.webp',
  'gaming-mobler': '/assets/mega-gaming-mobler-menu.webp',
  'gaming-streaming': '/assets/mega-gaming-streaming-menu.webp',
  'tv-montering': '/assets/mega-tv-montering-menu.webp',
  'tv-hemmabio': '/assets/mega-tv-hemmabio-menu.webp',
  'mobil-laddning': '/assets/mega-mobil-tillbehor-menu.webp',
  'horlur-sektion': '/assets/mega-horlur-sektion-menu.webp',
  natsverksforlangarе: '/assets/mega-natverksforlangare-menu.webp',
  routrar: '/assets/mega-routrar-menu.webp',
  mesh: '/assets/mega-mesh-menu.webp',
  tv: '/assets/mega-tv-menu.webp',
  ljud: '/assets/mega-ljud-menu.webp',
  'tillbehor-tv': '/assets/mega-tv-tillbehor-menu.webp',
};

export const OFFERS_CAMPAIGNS = [
  { id: 'veckans-deals', title: 'Veckans deals', bg: 'bg-gray-900', url: '/erbjudanden/veckans-deals', image: '/assets/erbjudanden-1.webp' },
  { id: 'rea', title: 'Rea upp till 50%', bg: 'bg-red-700', url: '/erbjudanden/rea', image: '/assets/erbjudanden-2.webp' },
  { id: 'paketpris', title: 'Paketpris', bg: 'bg-blue-900', url: '/erbjudanden/paketpris', image: '/assets/erbjudanden-3.webp' },
  { id: 'lagertomning', title: 'Lagertömning', bg: 'bg-gray-800', url: '/erbjudanden/lagertomning', image: '/assets/erbjudanden-4.webp' },
];

export const OFFERS_DATA: MenuCategory = {
  id: 'erbjudanden',
  title: 'Erbjudanden',
  url: '/erbjudanden',
  items: [],
};

export const MOBILE_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'datorer-och-tillbehor': <Image src="/icons/categories/datorer.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'datorer-tillbehor':     <Image src="/icons/categories/datorer.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'komponenter':           <Image src="/icons/categories/datorkomponenter.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'datorkomponenter':      <Image src="/icons/categories/datorkomponenter.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'gaming':                <Image src="/icons/categories/gaming.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'mobiltelefoner':        <Image src="/icons/categories/mobiltelefoner.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'natverk':               <Image src="/icons/categories/natverk.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'tv-hifi':               <Image src="/icons/categories/tv-hifi.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
};

export const MOBILE_SECTION_ICONS: Record<string, React.ReactNode> = {
  'barbara':              <Image src="/icons/mobile/barbara-datorer.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'stationara':           <Image src="/icons/mobile/stationara-datorer.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'datortillbehor':       <Image src="/icons/mobile/datortillbehor.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'processorer':          <Image src="/icons/mobile/processorer.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'moderkort':            <Image src="/icons/mobile/moderkort.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'grafikkort':           <Image src="/icons/mobile/grafikkort.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'ram':                  <Image src="/icons/mobile/ram.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'lagringsenhet':        <Image src="/icons/mobile/lagring.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'natlagring':           <Image src="/icons/mobile/nataggregat.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'gaming-laptops':       <Image src="/icons/mobile/gaming-laptop.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'gaming-pc':            <Image src="/icons/mobile/gaming-pc.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'gaming-peripherals':   <Image src="/icons/mobile/gaming-tillbehor.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'smartphones':          <Image src="/icons/mobile/smartphones.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'mobil-tillbehor':      <Image src="/icons/mobile/mobil-tillbehor.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'accesspunkter':        <Image src="/icons/mobile/accesspunkter.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'natsverksforlangarе':  <Image src="/icons/mobile/natverksforlangare.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'routrar':              <Image src="/icons/mobile/routrar.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'mesh':                 <Image src="/icons/mobile/mesh.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'tv':                   <Image src="/icons/mobile/tv.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'ljud':                 <Image src="/icons/mobile/ljud.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
  'tillbehor-tv':         <Image src="/icons/mobile/tillbehor-tv.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
};
