'use client';
import { Truck, Lightning, ShieldCheck, Headset } from '@phosphor-icons/react';

export function PerksBanner() {
  const perks = [
    { label: 'Fri frakt', desc: 'På beställningar över 500 kr', icon: <Truck size={40} weight="thin" /> },
    { label: 'Snabb leverans', desc: '1–3 arbetsdagar', icon: <Lightning size={40} weight="thin" /> },
    { label: 'Säker betalning', desc: 'Krypterad & trygg checkout', icon: <ShieldCheck size={40} weight="thin" /> },
    { label: 'Kundtjänst', desc: 'Vi finns här för dig', icon: <Headset size={40} weight="thin" /> },
  ];

  return (
    <div className="w-full" style={{ backgroundColor: '#fafaf8' }}>
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="flex items-start justify-between">
          {perks.map((perk, i) => (
            <div key={i} className="flex flex-col items-start gap-3">
              <div className="text-black">{perk.icon}</div>
              <div>
                <p className="text-base font-bold text-black">{perk.label}</p>
                <p className="text-sm text-gray-500">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
