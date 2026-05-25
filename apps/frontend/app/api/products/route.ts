export async function GET() {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || 'reg_01KR9R4SFABTKM0CVFN7AVZ4RW';

    if (!publishableKey) {
      return Response.json(
        { error: 'Medusa publishable key not configured' },
        { status: 500 }
      );
    }

    // Fetch products with publishable API key
    const response = await fetch(
      `${medusaUrl}/store/products?limit=100&region_id=${regionId}&fields=*variants.prices`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': publishableKey,
        },
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to fetch from Medusa' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const products = data.products || [];

    const transformedProducts = products.map((product: any) => {
      const backendHost = new URL(medusaUrl).host;

      // Fix image URLs - replace localhost with configured backend
      let imageUrl = product.images?.[0]?.url || product.thumbnail || '';
      if (imageUrl && imageUrl.includes('localhost:9000')) {
        imageUrl = imageUrl.replace('localhost:9000', backendHost);
      }
      const image = imageUrl;

      // Get price from variant prices array
      let price = 0;
      let originalPrice: number | undefined = undefined;

      // Get price from first variant's prices
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];

        // Try calculated_price first, then fall back to prices array
        if (firstVariant.calculated_price) {
          const calcPrice = firstVariant.calculated_price;
          if (calcPrice.calculated_amount !== undefined) {
            price = calcPrice.calculated_amount;
          } else if (calcPrice.amount) {
            price = calcPrice.amount;
          }
        } else if (firstVariant.prices && firstVariant.prices.length > 0) {
          // Use the first price in the array
          const priceObj = firstVariant.prices[0];
          price = priceObj.amount || 0;
        }
      }

      // Get sectionCategory from product.collection.title
      let sectionCategory = '';
      const collectionTitle = product.collection?.title || '';
      if (collectionTitle === 'Populära produkter') sectionCategory = 'popular';
      else if (collectionTitle === 'Rekommenderade produkter') sectionCategory = 'recommended';
      else if (collectionTitle === 'Nya produkter') sectionCategory = 'new';
      else if (collectionTitle === 'Relaterade produkter') sectionCategory = 'also-like';

      // Calculate discount percentage if we have both prices
      let discountPercent = undefined;
      if (originalPrice && price) {
        discountPercent = Math.floor(((originalPrice - price) / originalPrice) * 100);
      }

      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        price: price,
        originalPrice: originalPrice,
        image: image,
        images: (product.images?.map((img: any) => {
          let url = img.url;
          if (url && url.includes('localhost:9000')) {
            url = url.replace('localhost:9000', backendHost);
          }
          return url;
        }) || []).slice(0, 3),
        category: collectionTitle,
        brand: product.brand || '',
        colors: product.colors || [],
        stock: product.stock || 'I lager',
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        features: product.features || [],
        isNew: product.isNew || false,
        discountPercent: discountPercent,
        sectionCategory: sectionCategory,
      };
    });

    return Response.json({ products: transformedProducts }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error in /api/products:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
