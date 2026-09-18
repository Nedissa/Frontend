import { Product, getBreadcrumbTrail } from '@/app/lib/products';

export function getProductJsonLd(product: Product, url: string) {
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || `Köp ${product.title} hos Techpilots.`,
    image: images,
    sku: product.id,
    url,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'SEK',
      price: product.price,
      availability: product.stock === 'Slut i lager'
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  if (product.brand) {
    jsonLd.brand = { '@type': 'Brand', name: product.brand };
  }

  if (product.rating && product.reviews) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    };
  }

  return jsonLd;
}

export function getBreadcrumbJsonLd(
  breadcrumbTrail: ReturnType<typeof getBreadcrumbTrail>,
  product: Product,
  baseUrl: string,
  productUrl: string,
) {
  const items: { name: string; url: string }[] = [
    { name: 'Hem', url: baseUrl },
  ];

  if (breadcrumbTrail) {
    items.push({
      name: breadcrumbTrail.mainCategoryTitle,
      url: `${baseUrl}/kategori/${breadcrumbTrail.mainCategorySlug}`,
    });
    items.push({
      name: breadcrumbTrail.subcategoryTitle,
      url: `${baseUrl}/kategori/${breadcrumbTrail.subcategorySlug}`,
    });
    if ('seriesSlug' in breadcrumbTrail && breadcrumbTrail.seriesSlug) {
      items.push({
        name: breadcrumbTrail.seriesTitle,
        url: `${baseUrl}/kategori/${breadcrumbTrail.seriesSlug}`,
      });
    }
  }

  items.push({ name: product.title, url: productUrl });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
