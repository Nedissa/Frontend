import React from 'react';
import Image from 'next/image';

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  items?: MenuItem[];
}

export interface MenuSection {
  id: string;
  title: string;
  url: string;
  items?: MenuItem[];
}

export interface MenuCategory {
  id: string;
  title: string;
  url: string;
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
}

export const MENU_DATA: MenuCategory[] = [
  {
    id: 'datorer-och-tillbehor',
    title: 'Datorer',
    url: '/kategori/datorer-tillbehor',
    items: [
      {
        id: 'barbara',
        title: 'Bärbara',
        url: '/kategori/barbara',
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
        items: [
          { id: 'mini-pc', title: 'Mini-PC', url: '/kategori/stationara' },
          { id: 'allt-i-ett', title: 'Allt-i-ett-datorer', url: '/kategori/stationara' },
          { id: 'arbetsdatorer', title: 'Arbetsdatorer', url: '/kategori/stationara' },
        ],
      },
      {
        id: 'datortillbehor',
        title: 'Tillbehör',
        url: '/kategori/datortillbehor',
        items: [
          { id: 'bildskarm', title: 'Bildskärmar', url: '/kategori/datortillbehor' },
          { id: 'tangentbord', title: 'Tangentbord', url: '/kategori/datortillbehor' },
          { id: 'moss', title: 'Möss', url: '/kategori/datortillbehor' },
        ],
      },
    ],
  },
  {
    id: 'komponenter',
    title: 'Komponenter',
    url: '/kategori/datorkomponenter',
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
        id: 'gaming-laptops',
        title: 'Bärbara',
        url: '/kategori/gaming-laptops',
        items: [
          { id: 'high-end', title: 'High-End', url: '/kategori/gaming-laptops' },
          { id: 'mid-range', title: 'Mid-Range', url: '/kategori/gaming-laptops' },
        ],
      },
      {
        id: 'gaming-pc',
        title: 'Datorer',
        url: '/kategori/gaming-pc',
        items: [
          { id: 'budget', title: 'Budget', url: '/kategori/gaming-pc' },
          { id: 'pro', title: 'Pro', url: '/kategori/gaming-pc' },
        ],
      },
      {
        id: 'gaming-peripherals',
        title: 'Tillbehör',
        url: '/kategori/gaming-tillbehor',
        items: [
          { id: 'gaming-mus', title: 'Gaming Möss', url: '/kategori/gaming-tillbehor' },
          { id: 'gaming-tangentbord', title: 'Gaming Tangentbord', url: '/kategori/gaming-tillbehor' },
          { id: 'gaming-headset', title: 'Gaming Headset', url: '/kategori/gaming-tillbehor' },
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
        id: 'smartphones',
        title: 'Smartphones',
        url: '/kategori/smartphones',
        items: [
          { id: 'flagship', title: 'Flaggskepp', url: '/kategori/smartphones' },
          { id: 'mid-range-phone', title: 'Mid-Range', url: '/kategori/smartphones' },
          { id: 'budget-phone', title: 'Budget', url: '/kategori/smartphones' },
        ],
      },
      {
        id: 'mobil-tillbehor',
        title: 'Mobil tillbehör',
        url: '/kategori/mobil-tillbehor',
        items: [
          { id: 'skal', title: 'Skal & Skydd', url: '/kategori/mobil-tillbehor' },
          { id: 'laddare', title: 'Laddare', url: '/kategori/mobil-tillbehor' },
          { id: 'screenprotectors', title: 'Skärmskydd', url: '/kategori/mobil-tillbehor' },
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
    title: 'TV & HiFi',
    url: '/kategori/tv-hifi',
    items: [
      {
        id: 'tv',
        title: 'TV',
        url: '/kategori/tv',
        items: [
          { id: 'oled-tv', title: 'OLED', url: '/kategori/oled-tv' },
          { id: 'qled-tv', title: 'QLED', url: '/kategori/qled-tv' },
          { id: 'mini-led-tv', title: 'Mini-LED', url: '/kategori/mini-led-tv' },
          { id: 'led-tv', title: 'LED', url: '/kategori/led-tv' },
        ],
      },
      {
        id: 'ljud',
        title: 'Ljud & HiFi',
        url: '/kategori/ljud-hifi',
        items: [
          { id: 'hemmabio', title: 'Hemmabio', url: '/kategori/hemmabio' },
          { id: 'horlur', title: 'Hörlurar', url: '/kategori/horlur' },
          { id: 'soundbar', title: 'Soundbar', url: '/kategori/soundbar' },
        ],
      },
      {
        id: 'tillbehor-tv',
        title: 'TV Tillbehör',
        url: '/kategori/tv-tillbehor',
        items: [
          { id: 'montering', title: 'Montering', url: '/kategori/tv-tillbehor' },
          { id: 'soundbar', title: 'Soundbar', url: '/kategori/tv-tillbehor' },
        ],
      },
    ],
  },
];

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
  'natwerk':               <Image src="/icons/categories/natverk.webp" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />,
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
