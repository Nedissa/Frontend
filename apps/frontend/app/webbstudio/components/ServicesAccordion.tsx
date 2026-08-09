'use client';
import { useState } from 'react';

const ITALIC = { fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontStyle: 'italic' } as const;
const PLACEHOLDER_GRADIENT = 'radial-gradient(circle at 30% 20%, #e8c547 0%, #d9d9d9 55%, #f0f0f0 100%)';

type Row = { title: string; text?: string };

// Vänsterlista med rubriker, en rad expanderad åt gången till ett vitt kort (text + knapp).
// Höger: en gemensam bild för hela sektionen (byts inte per rad — vi saknar en bild per rad).
// Expanderat innehåll renderas alltid (ingen mount/unmount) — bara dess grid-rad-höjd
// animeras mellan 0fr och 1fr, så layouten aldrig hoppar och övergången blir mjuk.
export function ServicesAccordion({ rows }: { rows: Row[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="grid gap-16 items-start" style={{ gridTemplateColumns: '1fr 1fr' }}>
      <div className="flex flex-col">
        {rows.map((row, i) => {
          const isActive = i === activeIndex;
          return (
            <div key={row.title} className="border-t border-[#ddd] last:border-b">
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                className="w-full text-left bg-transparent border-0 cursor-pointer py-6"
              >
                <span className="text-[26px] font-normal tracking-[-0.02em]" style={ITALIC}>
                  {row.title}
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500"
                style={{ gridTemplateRows: isActive ? '1fr' : '0fr', transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
              >
                <div className="overflow-hidden">
                  <div className="bg-white rounded-[20px] p-8 mb-4 flex flex-col gap-4">
                    <p className="text-sm leading-[1.7] text-[#555] m-0">{row.text}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full rounded-[20px] aspect-[4/3]" style={{ background: PLACEHOLDER_GRADIENT }} />
    </div>
  );
}
