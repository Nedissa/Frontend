import React from 'react';

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
  icon?: React.ReactNode;
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
        icon: <img src="/icons/barbara-datorer.svg" alt="Bärbara datorer" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/stationara-datorer.svg" alt="Stationära datorer" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/datortillbehor.svg" alt="Datortillbehör" style={{ width: '38px', height: '38px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/cpu.svg" alt="CPU" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'intel', title: 'Intel', url: '/kategori/processorer' },
          { id: 'amd', title: 'AMD', url: '/kategori/processorer' },
        ],
      },
      {
        id: 'moderkort',
        title: 'Moderkort',
        url: '/kategori/moderkort',
        icon: <img src="/icons/moderkort.svg" alt="Moderkort" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'intel-socket', title: 'Intel', url: '/kategori/moderkort' },
          { id: 'amd-socket', title: 'AMD', url: '/kategori/moderkort' },
        ],
      },
      {
        id: 'grafikkort',
        title: 'Grafikkort',
        url: '/kategori/grafikkort',
        icon: <img src="/icons/gpu.svg" alt="GPU" style={{ width: '38px', height: '38px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'nvidia', title: 'NVIDIA', url: '/kategori/grafikkort' },
          { id: 'amd-gpu', title: 'AMD', url: '/kategori/grafikkort' },
        ],
      },
      {
        id: 'ram',
        title: 'RAM-minne',
        url: '/kategori/ram',
        icon: <img src="/icons/ram.svg" alt="RAM" style={{ width: '38px', height: '38px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'ddr5', title: 'DDR5', url: '/kategori/ram' },
          { id: 'ddr4', title: 'DDR4', url: '/kategori/ram' },
        ],
      },
      {
        id: 'lagringsenhet',
        title: 'Lagring',
        url: '/kategori/lagring',
        icon: <img src="/icons/lagring.svg" alt="Lagring" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/nataggregat.svg" alt="Nätaggregat" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/gaming-laptop.svg" alt="Gaming Bärbara" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'high-end', title: 'High-End', url: '/kategori/gaming-laptops' },
          { id: 'mid-range', title: 'Mid-Range', url: '/kategori/gaming-laptops' },
        ],
      },
      {
        id: 'gaming-pc',
        title: 'Datorer',
        url: '/kategori/gaming-pc',
        icon: <img src="/icons/gaming-pc.svg" alt="Gaming PC" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'budget', title: 'Budget', url: '/kategori/gaming-pc' },
          { id: 'pro', title: 'Pro', url: '/kategori/gaming-pc' },
        ],
      },
      {
        id: 'gaming-peripherals',
        title: 'Tillbehör',
        url: '/kategori/gaming-tillbehor',
        icon: <img src="/icons/gaming-tillbehor.svg" alt="Gamingtillbehör" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/smartphones.svg" alt="Smartphones" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/mobiltillbehor.svg" alt="Mobiltillbehör" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/accesspunkter.svg" alt="Accesspunkter" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'wifi6', title: 'WiFi 6', url: '/kategori/accesspunkter' },
          { id: 'wifi7', title: 'WiFi 7', url: '/kategori/accesspunkter' },
        ],
      },
      {
        id: 'natsverksforlangarе',
        title: 'Nätverksförlängare',
        url: '/kategori/natverksforlangare',
        icon: <img src="/icons/natverksforlangare.svg" alt="Nätverksförlängare" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'wifi-forlangarе', title: 'WiFi', url: '/kategori/natverksforlangare' },
          { id: 'mesh-forlangarе', title: 'Mesh', url: '/kategori/natverksforlangare' },
        ],
      },
      {
        id: 'routrar',
        title: 'Routrar',
        url: '/kategori/routrar',
        icon: <img src="/icons/routrar.svg" alt="Routrar" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/mesh.svg" alt="Mesh Nätverk" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/tv.svg" alt="TV" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/ljud-hifi.svg" alt="Ljud & HiFi" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
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
        icon: <img src="/icons/tv-tillbehor.svg" alt="TV Tillbehör" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />,
        items: [
          { id: 'montering', title: 'Montering', url: '/kategori/tv-tillbehor' },
          { id: 'soundbar', title: 'Soundbar', url: '/kategori/tv-tillbehor' },
        ],
      },
    ],
  },
];

export const SECTION_IMAGES: Record<string, string> = {
  barbara: '/assets/mega-barbara.svg',
  stationara: '/assets/mega-stationara.svg',
  datortillbehor: '/assets/mega-datortillbehor.svg',
  processorer: '/assets/mega-processorer.svg',
  moderkort: '/assets/mega-moderkort.svg',
  grafikkort: '/assets/mega-grafikkort.svg',
  ram: '/assets/mega-ram.svg',
  lagringsenhet: '/assets/mega-lagring.svg',
  natlagring: '/assets/mega-natlaggregat.svg',
  'gaming-laptops': '/assets/mega-gaming-laptop.svg',
  'gaming-pc': '/assets/mega-gaming-pc.svg',
  'gaming-peripherals': '/assets/mega-gaming-tillbehor.svg',
  smartphones: '/assets/mega-smartphones.svg',
  'mobil-tillbehor': '/assets/mega-mobil-tillbehor.svg',
  accesspunkter: '/assets/mega-accesspunkter.svg',
  natsverksforlangarе: '/assets/mega-natverksforlangare.svg',
  routrar: '/assets/mega-routrar.svg',
  mesh: '/assets/mega-mesh.svg',
  tv: '/assets/mega-tv.svg',
  ljud: '/assets/mega-ljud.svg',
  'tillbehor-tv': '/assets/mega-tv-tillbehor.svg',
};

export const OFFERS_CAMPAIGNS = [
  { id: 'veckans-deals', title: 'Veckans deals', bg: 'bg-gray-900', url: '/erbjudanden/veckans-deals', image: '/assets/erbjudanden-1.png' },
  { id: 'rea', title: 'Rea upp till 50%', bg: 'bg-red-700', url: '/erbjudanden/rea', image: '/assets/erbjudanden-2.png' },
  { id: 'paketpris', title: 'Paketpris', bg: 'bg-blue-900', url: '/erbjudanden/paketpris', image: '/assets/erbjudanden-3.png' },
  { id: 'lagertomning', title: 'Lagertömning', bg: 'bg-gray-800', url: '/erbjudanden/lagertomning', image: '/assets/erbjudanden-4.png' },
];

export const OFFERS_DATA: MenuCategory = {
  id: 'erbjudanden',
  title: 'Erbjudanden',
  url: '/erbjudanden',
  items: [],
};

export const MOBILE_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'datorer-och-tillbehor': <img src="/icons/categories/datorer.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'komponenter':           <img src="/icons/categories/datorkomponenter.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'gaming':                <img src="/icons/categories/gaming.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'mobiltelefoner':        <img src="/icons/categories/mobiltelefoner.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'natverk':               <img src="/icons/categories/natverk.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'tv-hifi':               <img src="/icons/categories/tv-hifi.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
};

export const MOBILE_SECTION_ICONS: Record<string, React.ReactNode> = {
  'barbara':              <img src="/assets/mega-barbara.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'stationara':           <img src="/assets/mega-stationara.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'datortillbehor':       <img src="/assets/mega-datortillbehor.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'processorer':          <img src="/assets/mega-processorer.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'moderkort':            <img src="/assets/mega-moderkort.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'grafikkort':           <img src="/assets/mega-grafikkort.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'ram':                  <img src="/assets/mega-ram.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'lagringsenhet':        <img src="/assets/mega-lagring.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'natlagring':           <img src="/assets/mega-natlaggregat.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'gaming-laptops':       <img src="/assets/mega-gaming-laptop.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'gaming-pc':            <img src="/assets/mega-gaming-pc.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'gaming-peripherals':   <img src="/assets/mega-gaming-tillbehor.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'smartphones':          <img src="/assets/mega-smartphones.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'mobil-tillbehor':      <img src="/assets/mega-mobil-tillbehor.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'accesspunkter':        <img src="/assets/mega-accesspunkter.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'natsverksforlangarе':  <img src="/assets/mega-natverksforlangare.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'routrar':              <img src="/assets/mega-routrar.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'mesh':                 <img src="/assets/mega-mesh.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'tv':                   <img src="/assets/mega-tv.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'ljud':                 <img src="/assets/mega-ljud.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
  'tillbehor-tv':         <img src="/assets/mega-tv-tillbehor.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />,
};
