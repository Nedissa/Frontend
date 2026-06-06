'use client';

interface CategoryCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  discount: string;
  image: string;
  bgColor: string;
  link: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: '1',
    title: 'Laptops',
    subtitle: 'Save up to 35% Off',
    description: 'Powerful processors, all-day battery, and sleek designs – save on ultrabooks.',
    discount: '35%',
    image: '/assets/Produkt bilder/LAPTOP/1978563_1.webp',
    bgColor: 'from-teal-600 to-teal-700',
    link: '/kategorier/laptops',
  },
  {
    id: '2',
    title: 'Stationära datorer',
    subtitle: 'Save up to 25% Off',
    description: 'Upgrade your workspace with top-rated brands and powerful performance.',
    discount: '25%',
    image: '/assets/Produkt bilder/STATIONÄR/1.webp',
    bgColor: 'from-blue-700 to-blue-900',
    link: '/kategorier/stationär',
  },
  {
    id: '3',
    title: 'Komponenter',
    subtitle: 'Save up to 15% Off',
    description: 'From note-taking to streaming, find the perfect components for your build.',
    discount: '15%',
    image: '/assets/Produkt bilder/LAPTOP/1978563_2.webp',
    bgColor: 'from-blue-100 to-blue-200',
    link: '/kategorier/komponenter',
  },
  {
    id: '4',
    title: 'Gaming Setup',
    subtitle: 'Save up to $199',
    description: 'Upgrade to cinema-quality performance. Save up to $450 on top brands.',
    discount: '$199',
    image: '/assets/Produkt bilder/STATIONÄR/6907594_jzbn2q.webp',
    bgColor: 'from-cyan-400 to-cyan-500',
    link: '/kategorier/gaming-setup',
  },
  {
    id: '5',
    title: 'Tillbehör',
    subtitle: 'Save up to $99',
    description: 'Immerse yourself from portable Bluetooth speakers to Wi-Fi systems.',
    discount: '$99',
    image: '/assets/Produkt bilder/STATIONÄR/6907594_t7dv07.webp',
    bgColor: 'from-blue-800 to-blue-900',
    link: '/kategorier/tillbehör',
  },
  {
    id: '6',
    title: 'Övrigt',
    subtitle: 'Save up to $299',
    description: 'Enjoy 4K clarity, smart connectivity, and massive screen sizes.',
    discount: '$299',
    image: '/assets/Produkt bilder/LAPTOP/6907594_v5urxz.webp',
    bgColor: 'from-gray-800 to-gray-900',
    link: '/kategorier/övrigt',
  },
];

export function CategoriesSection() {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((category) => (
          <a
            key={category.id}
            href={category.link}
            className={`bg-gradient-to-br ${category.bgColor} rounded-2xl p-4 sm:p-6 flex flex-col justify-between text-white min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] cursor-pointer hover:shadow-lg transition-shadow`}
          >
            {/* Header with discount */}
            <div>
              <p className="text-sm font-semibold opacity-90 mb-1">Save up to</p>
              <h3 className="text-2xl sm:text-4xl font-bold mb-2">{category.discount}</h3>
              <h2 className="text-lg sm:text-2xl font-bold mb-4">{category.title}</h2>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center my-6">
              <img
                src={category.image}
                alt={category.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Description and link */}
            <div>
              <p className="text-sm opacity-90 mb-4 leading-relaxed">
                {category.description}
              </p>
              <a href={category.link} className="text-white font-semibold text-sm underline hover:no-underline">
                Shop now
              </a>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
