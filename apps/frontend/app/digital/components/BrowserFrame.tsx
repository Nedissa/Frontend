function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
    </div>
  );
}

function UrlField({ website, showLock }: { website?: string; showLock: boolean }) {
  return (
    <div className="browser-frame-url flex-1 flex items-center gap-1.5 bg-white border border-black/10 rounded-md px-3 py-1 text-[#8a8a86] min-w-0">
      {showLock && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z" /></svg>
      )}
      <span className="text-xs truncate block min-w-0">{website}</span>
    </div>
  );
}

export function BrowserFrame({ src, alt, website, className, imgClassName }: { src: string; alt: string; website?: string; className?: string; imgClassName?: string }) {
  return (
    <div className={`inline-flex flex-col border border-black/20 bg-white overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] ${className ?? ''}`}>
      {/* Mobil: bara trafikljus + adress, inga övriga ikoner */}
      <div className="browser-frame-topbar flex md:hidden items-center gap-3 px-4 py-2.5 bg-[#f0f0ee] border-b border-black/10">
        <TrafficLights />
        <UrlField website={website} showLock={false} />
      </div>

      {/* Surfplatta: trafikljus + lås-ikon i adressfältet, inga navigationsikoner */}
      <div className="browser-frame-topbar hidden md:flex lg:hidden items-center gap-3 px-4 py-2.5 bg-[#f0f0ee] border-b border-black/10">
        <TrafficLights />
        <UrlField website={website} showLock={true} />
      </div>

      {/* Desktop: full topbar med navigation och fönster-ikoner */}
      <div className="browser-frame-topbar hidden lg:flex items-center gap-3 px-4 py-2.5 bg-[#f0f0ee] border-b border-black/10">
        <TrafficLights />

        <div className="browser-frame-nav-icons-left flex items-center gap-3 shrink-0 text-[#5c5c58]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 6 9 12 15 18" /></svg>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
        </div>

        <UrlField website={website} showLock={true} />

        <div className="browser-frame-nav-icons-right flex items-center gap-3 shrink-0 text-[#5c5c58]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="browser-frame-icon-fullscreen"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="browser-frame-icon-duplicate"><rect x="3" y="3" width="13" height="13" rx="2" /><rect x="8" y="8" width="13" height="13" rx="2" /></svg>
        </div>
      </div>

      <img src={src} alt={alt} className={imgClassName ?? 'w-auto h-auto max-w-full block'} />
    </div>
  );
}
