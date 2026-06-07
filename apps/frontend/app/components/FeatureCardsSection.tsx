'use client';

import { useState, useEffect, useRef } from 'react';

interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
}

export function FeatureCardsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const features: FeatureCard[] = [
    {
      id: '1',
      title: 'Otrolig Prestanda',
      subtitle: 'Nästa generation datorer på dina fingertoppar',
      image: '/assets/Produkt bilder/LAPTOP/1978563_1.webp',
      bgColor: 'from-pink-500 to-purple-600',
    },
    {
      id: '2',
      title: 'Cutting Edge Teknik',
      subtitle: 'Ta dina bilder och videor till nästa nivå',
      image: '/assets/Produkt bilder/LAPTOP/1978563_2.webp',
      bgColor: 'from-yellow-500 to-orange-600',
    },
    {
      id: '3',
      title: 'Framtidsteknik',
      subtitle: 'Få aldrig tidigare sedd kraft',
      image: '/assets/Produkt bilder/LAPTOP/1978563_3.webp',
      bgColor: 'from-gray-900 to-black',
    },
    {
      id: '4',
      title: 'Säkerhet First',
      subtitle: 'Skyddande funktioner. För säkerhetens skull.',
      image: '/assets/Produkt bilder/STATIONÄR/1.webp',
      bgColor: 'from-teal-600 to-cyan-700',
    },
    {
      id: '5',
      title: 'Premium Design',
      subtitle: 'Elegant och modern teknologi',
      image: '/assets/Produkt bilder/STATIONÄR/6907594_t7dv07.webp',
      bgColor: 'from-indigo-600 to-purple-700',
    },
    {
      id: '6',
      title: 'Längsta Batteritid',
      subtitle: 'Arbeta hela dagen utan stress',
      image: '/assets/Produkt bilder/LAPTOP/6907594_v5urxz.webp',
      bgColor: 'from-green-600 to-emerald-700',
    },
  ];

  const scrollLeft = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const scrollRight = () => {
    setCurrentIndex(Math.min(features.length - 1, currentIndex + 1));
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = 280 + 16; // card width + gap
      scrollContainerRef.current.scrollLeft = currentIndex * cardWidth;
    }
  }, [currentIndex]);

  return (
    <div className="w-full bg-white py-4">
      <div className="px-4 sm:px-6 overflow-hidden group relative">
        {/* Left Chevron */}
        <button
          onClick={scrollLeft}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 sm:w-14 h-10 sm:h-14 flex items-center justify-center text-gray-900 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed bg-white rounded-full shadow-md"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-hidden transition-all duration-500"
        >
          {features.map((feature, idx) => (
            <div
              key={feature.id}
              className={`flex-shrink-0 w-64 sm:w-72 h-80 sm:h-96 rounded-3xl bg-gradient-to-br ${feature.bgColor} p-5 sm:p-6 flex flex-col justify-between text-white overflow-hidden relative cursor-pointer`}
            >
              <div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.subtitle}</p>
              </div>
              <div className="absolute right-0 bottom-0 w-48 h-48 flex items-center justify-center">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-contain opacity-80"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Chevron */}
        <button
          onClick={scrollRight}
          disabled={currentIndex === features.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 sm:w-14 h-10 sm:h-14 flex items-center justify-center text-gray-900 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed bg-white rounded-full shadow-md"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      </div>

      {/* Progress bar at bottom */}
      <div className="px-6 mt-8">
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 transition-all duration-500 ease-out"
            style={{
              width: `${((currentIndex + 1) / features.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
