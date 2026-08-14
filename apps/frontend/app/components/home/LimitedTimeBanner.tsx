'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export function LimitedTimeBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (bannerRef.current) observer.observe(bannerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!endDate || !isVisible) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

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
    intervalRef.current = setInterval(calc, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [endDate, isVisible]);

  return (
    <div className="w-full" ref={bannerRef}>
      <div className="w-full">
        <div className="banner-animated-bg flex flex-col-reverse sm:flex-row sm:h-[400px]">
          {/* Left */}
          <div className="flex flex-col items-center justify-center gap-3 px-6 sm:px-10 w-full sm:w-[45%] py-8 sm:py-0 sm:h-full">
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
              <Link href="/erbjudanden" className="font-semibold px-8 py-2.5 rounded-full transition-colors text-sm" style={{ background: '#e8c547', color: '#0a0a0a' }}>
                Shoppa rea ↗
              </Link>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative w-full sm:w-[55%] h-[200px] sm:h-full overflow-hidden">
            <img
              src="/assets/bluetooth-speaker.webp"
              alt="Kampanj"
              className="w-full h-full object-cover"
            />
            {/* Badge */}
            <div className="speaker-badge absolute top-2 right-2 sm:top-4 sm:right-4" style={{
              backgroundColor: '#f5c842',
              color: '#111',
              fontWeight: '700',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              lineHeight: '1.4',
              textAlign: 'center',
            }}>
              ● Sony ●<br />Bluetooth Speaker
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
