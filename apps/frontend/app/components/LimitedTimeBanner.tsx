'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const END_DATE = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 59 * 60 * 1000 + 7 * 1000);

export function LimitedTimeBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = END_DATE.getTime() - Date.now();
      if (diff <= 0) return;
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
  }, []);

  return (
    <>
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
      <div className="flex justify-center">
        <div className="max-w-[1280px] w-full px-6">
          <div className="flex flex-col sm:flex-row gap-4" style={{ minHeight: '320px' }}>
            {/* Left — animated */}
            <div className="banner-animated-bg flex flex-col items-center justify-center gap-6 px-6 sm:px-10 py-8 sm:py-10 w-full sm:w-[45%]">
              <div className="flex gap-2 sm:gap-3">
                {[
                  { value: timeLeft.days, label: 'Dagar' },
                  { value: timeLeft.hours, label: 'Timmar' },
                  { value: timeLeft.minutes, label: 'Minuter' },
                  { value: timeLeft.seconds, label: 'Sekunder' },
                ].map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center gap-1 rounded-lg px-2 sm:px-4 py-2 sm:py-3" style={{ backgroundColor: '#1a2d42', minWidth: '56px' }}>
                    <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">{String(unit.value).padStart(2, '0')}</span>
                    <span className="text-[10px] sm:text-[11px] text-gray-400">{unit.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Begränsad tid</h2>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                    Spara 100 kr på beställningar över 500 kr — erbjudandet appliceras automatiskt i kassan.
                  </p>
                </div>
                <Link href="/erbjudanden" className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm">
                  Shoppa rea ↗
                </Link>
              </div>
            </div>

            {/* Right — image */}
            <div className="w-full sm:w-[55%]" style={{ backgroundColor: '#f0f0ee', minHeight: '200px' }}>
              <img
                src="/assets/kampanj-speaker.png"
                alt="Kampanj"
                className="w-full h-full object-cover"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
