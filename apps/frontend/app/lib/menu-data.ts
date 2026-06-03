export const CATEGORY_SUBCATEGORIES: Record<string, { id: string; title: string; url: string; icon: string }[]> = {
  'datorer-tillbehor': [
    { id: 'barbara', title: 'Bärbara', url: '/produktserier/barbara', icon: '/icons/barbara-datorer.png' },
    { id: 'stationara', title: 'Stationära', url: '/produktserier/stationara', icon: '/icons/stationara-datorer.png' },
    { id: 'tillbehor', title: 'Tillbehör', url: '/produktserier/datortillbehor', icon: '/icons/datortillbehor.png' },
  ],
  'datorkomponenter': [
    { id: 'processorer', title: 'Processorer', url: '/produktserier/processorer', icon: '/icons/cpu.png' },
    { id: 'moderkort', title: 'Moderkort', url: '/produktserier/moderkort', icon: '/icons/moderkort.png' },
    { id: 'grafikkort', title: 'Grafikkort', url: '/produktserier/grafikkort', icon: '/icons/gpu.png' },
    { id: 'ram', title: 'RAM-minne', url: '/produktserier/ram', icon: '/icons/ram.png' },
    { id: 'lagring', title: 'Lagring', url: '/produktserier/lagring', icon: '/icons/lagring.png' },
    { id: 'nataggregat', title: 'Nätaggregat', url: '/produktserier/nataggregat', icon: '/icons/nataggregat.png' },
  ],
  'gaming': [
    { id: 'gaming-barbara', title: 'Bärbara', url: '/produktserier/gaming-barbara', icon: '/icons/gaming-laptop.png' },
    { id: 'gaming-datorer', title: 'Datorer', url: '/produktserier/gaming-datorer', icon: '/icons/gaming-pc.png' },
    { id: 'gaming-tillbehor', title: 'Tillbehör', url: '/produktserier/gaming-tillbehor', icon: '/icons/gaming-tillbehor.png' },
  ],
  'mobiltelefoner': [
    { id: 'smartphones', title: 'Smartphones', url: '/produktserier/smartphones', icon: '/icons/smartphones.png' },
    { id: 'mobiltillbehor', title: 'Mobil tillbehör', url: '/produktserier/mobiltillbehor', icon: '/icons/mobiltillbehor.png' },
  ],
  'natverk': [
    { id: 'accesspunkter', title: 'Accesspunkter', url: '/produktserier/accesspunkter', icon: '/icons/accesspunkter.png' },
    { id: 'natverksforlangare', title: 'Nätverksförlängare', url: '/produktserier/natverksforlangare', icon: '/icons/natverksforlangare.png' },
    { id: 'routrar', title: 'Routrar', url: '/produktserier/routrar', icon: '/icons/routrar.png' },
    { id: 'mesh', title: 'Mesh Nätverk', url: '/produktserier/mesh', icon: '/icons/mesh.png' },
  ],
  'tv-hifi': [
    { id: 'tv', title: 'TV', url: '/produktserier/tv', icon: '/icons/tv.png' },
    { id: 'ljud-hifi', title: 'Ljud & HiFi', url: '/produktserier/ljud-hifi', icon: '/icons/ljud-hifi.png' },
    { id: 'tv-tillbehor', title: 'TV Tillbehör', url: '/produktserier/tv-tillbehor', icon: '/icons/tv-tillbehor.png' },
  ],
};
