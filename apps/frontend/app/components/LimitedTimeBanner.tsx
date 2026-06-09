'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function LimitedTimeBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/promotions')
      .then((r) => r.json())
      .then((data) => {
        const campaign = (data.campaigns || []).find((c: any) => c.ends_at);
        if (campaign?.ends_at) {
          setEndDate(new Date(campaign.ends_at));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!endDate) return;
    const calc = () => {
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return (
    <div className="flex justify-center">
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .banner-animated-bg {
          background: linear-gradient(135deg, #1e3048, #4a7faa, #223344, #2e5880, #1e3048);
          background-size: 300% 300%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>
      <div className="max-w-[1280px] w-full px-6">
        <div className="flex flex-row h-[400px] overflow-hidden">
          {/* Left — animated */}
          <div className="banner-animated-bg flex flex-col items-center justify-center gap-3 px-10 w-[45%] h-full">
            <div className="flex gap-3">
              {[
                { value: timeLeft.days, label: 'Dagar' },
                { value: timeLeft.hours, label: 'Timmar' },
                { value: timeLeft.minutes, label: 'Minuter' },
                { value: timeLeft.seconds, label: 'Sekunder' },
              ].map((unit) => (
                <div key={unit.label} className="flex flex-col items-center gap-1 rounded-lg px-3 py-2" style={{ backgroundColor: '#1a2d42', minWidth: '52px' }}>
                  <span className="text-xl font-bold text-white tabular-nums">{String(unit.value).padStart(2, '0')}</span>
                  <span className="text-[10px] text-gray-400">{unit.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Begränsad tid</h2>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                  Uppgradera ditt ljud. Exklusiva priser på utvalda högtalare just nu.
                </p>
              </div>
              <Link href="/erbjudanden" className="bg-white text-black font-semibold px-8 py-2.5 rounded-full hover:bg-gray-100 transition-colors text-sm">
                Shoppa rea ↗
              </Link>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative w-[55%] h-full overflow-hidden" style={{ backgroundColor: '#f0f0ee' }}>
            <img
              src="/assets/kampanj-speaker.png"
              alt="Kampanj"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
