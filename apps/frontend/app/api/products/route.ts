function parseMeta(val: any): any[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

export async function GET() {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || '';

    if (!publishableKey) {
      return Response.json(
        { error: 'Medusa publishable key not configured', env: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')) },
        { status: 500 }
      );
    }

    // Fetch products with publishable API key
    const response = await fetch(
      `${medusaUrl}/store/products?limit=100&region_id=${regionId}&fields=*variants.prices,*variants.inventory_quantity,*collection,+metadata,*options,*options.values`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8',
          'x-publishable-api-key': publishableKey,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to fetch from Medusa' },
        { status: response.status }
      );
    }

    const buffer = await response.arrayBuffer();
    const data = JSON.parse(new TextDecoder('utf-8').decode(buffer));
    const products = data.products || [];

    const transformedProducts = products.map((product: any) => {
      // Fix image URLs - replace localhost with api.techpilots.se
      let imageUrl = product.images?.[0]?.url || product.thumbnail || '';
      imageUrl = imageUrl.replace(/^http:\/\/localhost:9000/, 'https://api.techpilots.se').replace(/^http:\/\//, 'https://');
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

      // Hämta sectionCategory från product.collection.title
      let sectionCategory = '';
      const collectionTitle = product.collection?.title || '';
      const collectionHandle = product.collection?.handle || '';
      if (collectionTitle === 'Populära produkter' || collectionHandle === 'populara-produkter') sectionCategory = 'populär';
      else if (collectionTitle === 'Rekommenderade produkter' || collectionHandle === 'rekommenderade-produkter') sectionCategory = 'rekommenderad';
      else if (collectionTitle === 'Nya produkter' || collectionHandle === 'nya-produkter') sectionCategory = 'ny';
      else if (collectionTitle === 'Du kanske också gillar' || collectionHandle === 'du-kanske-ocksa-gillar') sectionCategory = 'också-gillar';
      else if (collectionTitle === 'Relaterade produkter' || collectionHandle === 'relaterade-produkter') sectionCategory = 'relaterad';

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
          let url = img.url || '';
          url = url.replace(/^http:\/\/localhost:9000/, 'https://api.techpilots.se').replace(/^http:\/\//, 'https://');
          return url;
        }) || []),
        category: collectionTitle,
        description: product.description || '',
        metadata: {
          highlights: parseMeta(product.metadata?.highlights),
          specifications: parseMeta(product.metadata?.specifications),
          contents: parseMeta(product.metadata?.contents),
        },
        brand: product.brand || '',
        colors: product.options?.find((o: any) => o.title?.toLowerCase() === 'color' || o.title?.toLowerCase() === 'färg')?.values?.map((v: any) => v.value) || parseMeta(product.metadata?.colors),
        inventoryQuantity: product.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) ?? null,
        stock: (() => {
          const managesInventory = product.variants?.some((v: any) => v.manage_inventory);
          if (!managesInventory) return 'I lager';
          const qty = product.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) || 0;
          return qty > 0 ? 'I lager' : 'Slut i lager';
        })(),
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        features: (() => {
          const explicit = parseMeta(product.metadata?.features);
          if (explicit.length > 0) return explicit;
          const specs = parseMeta(product.metadata?.specifications);
          const short = specs.filter((s: any) => s.value.length <= 15);
          return short.slice(0, 3).map((s: any) => `${s.value}|${s.label}`);
        })(),
        isNew: product.isNew || false,
        discountPercent: discountPercent,
        sectionCategory: sectionCategory,
      };
    });

    return Response.json({ products: transformedProducts }, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    return Response.json(
      { error: 'Internal server error', detail: error?.message, cause: error?.cause?.message },
      { status: 500 }
    );
  }
}
