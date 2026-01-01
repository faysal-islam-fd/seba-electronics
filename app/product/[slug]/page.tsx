import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductTabs from '@/app/components/ProductTabs';
import RelatedProducts from '@/app/components/RelatedProducts';
import Breadcrumb from '@/app/components/Breadcrumb';
import ProductDetailContent from '@/app/components/ProductDetailContent';
import { getProductDetails, getProductReviews, getBrands } from '@/app/lib/api';
import { decodeId } from '@/app/utils/encryption';

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Try to decode the slug (if it's an encrypted ID)
  const decodedId = decodeId(slug);
  const identifier = decodedId !== null ? decodedId : slug;

  const data = await getProductDetails(identifier);

  if (!data || !data.success) {
    return {
      title: 'Product Not Found | Sheba Electronics',
      description: 'The product you are looking for does not exist.',
    };
  }

  const product = data.data;
  const title = `${product.title} | Sheba Electronics`;
  const description = product.description
    ? product.description.replace(/<[^>]*>/g, '').slice(0, 160)
    : `Buy ${product.title} at the best price in Bangladesh from Sheba Electronics.`;

  const images = (() => {
    const galleryImages = product.galleries
      ?.filter(g => g.type === 'image')
      .map(g => g.file_path)
      .filter(path => path && path.trim() !== '') as string[];

    // Combine gallery images with thumbnail, prioritizing thumbnail
    const allImages = [product.thumbnail, ...(galleryImages || [])].filter(Boolean) as string[];
    // Remove duplicates
    return [...new Set(allImages)];
  })();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: images.length > 0 ? images : ['/images/logo.png'],
      type: 'website',
      url: `https://shebaelectronics.com/product/${slug}`, // Adjust base URL as needed
      siteName: 'Sheba Electronics',
      locale: 'en_BD',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.length > 0 ? images[0] : undefined,
    },
  };
}

// Server Component with SSR
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Fetch product details first
  // Try to decode the slug (if it's an encrypted ID)
  const decodedId = decodeId(slug);
  const identifier = decodedId !== null ? decodedId : slug;

  const data = await getProductDetails(identifier);

  if (!data || !data.success) {
    notFound();
  }

  // 2. Fetch reviews (using ID) and brands
  const [reviewsData, brandsData] = await Promise.all([
    getProductReviews(data.data.id),
    getBrands(),
  ]);

  if (!data || !data.success) {
    notFound();
  }

  const apiProduct = data.data;

  // Extract rating and review count from reviews data
  const ratingSummary = reviewsData?.rating_summary;
  const rating = ratingSummary?.average ?? (reviewsData?.data && reviewsData.data.length > 0
    ? reviewsData.data.reduce((sum, r) => sum + (r?.rating || 0), 0) / reviewsData.data.length
    : 0);
  const reviewCount = ratingSummary?.total_reviews ?? (reviewsData?.data?.length || 0);

  // Check if this is a variable product (has variations)
  const isVariableProduct = apiProduct.attributes && apiProduct.attributes.length > 0;

  // Find the brand slug from the brands list
  // First try to find by brand ID, then by brand name
  const brandFromList = apiProduct.brand?.id
    ? brandsData.data?.find(b => b.id === apiProduct.brand?.id)
    : brandsData.data?.find(b => b.name.toLowerCase() === apiProduct.brand?.name?.toLowerCase());

  const brandSlug = brandFromList?.slug
    || (apiProduct.brand?.slug && apiProduct.brand.slug.trim() !== '' ? apiProduct.brand.slug : null)
    || (apiProduct.brand?.name ? apiProduct.brand.name.toLowerCase() : 'unknown');

  // Transform API data to match the component's expected format
  const thumbnail = apiProduct.thumbnail || '/products/placeholder.jpg';
  const product = {
    id: apiProduct.id.toString(),
    name: apiProduct.title,
    brand: apiProduct.brand?.name || undefined,
    brandSlug: brandSlug,
    thumbnail: thumbnail,
    // For normal products: use root level values
    // For variable products: these will be overridden by selected attribute
    price: isVariableProduct ? 0 : apiProduct.final_price,
    originalPrice: isVariableProduct ? undefined : (apiProduct.price !== apiProduct.final_price ? apiProduct.price : undefined),
    discount: isVariableProduct ? 0 : (apiProduct.discount_percentage ? Math.round(apiProduct.discount_percentage) : 0),
    rating: rating || 0,
    reviewCount: reviewCount,
    inStock: isVariableProduct ? true : (apiProduct.stock > 0 && !apiProduct.is_out_of_stock), // For variable products, check stock at attribute level
    stockCount: isVariableProduct ? 0 : apiProduct.stock, // For variable products, use attribute stock
    sku: apiProduct.sku,
    images: (() => {
      const galleryImages = apiProduct.galleries
        ?.filter(g => g.type === 'image')
        .map(g => g.file_path)
        .filter(path => path && path.trim() !== '') as string[];

      // Ensure we have at least one valid image
      if (galleryImages && galleryImages.length > 0) {
        return galleryImages;
      }
      return [thumbnail];
    })(),
    description: apiProduct.description,
    specifications: apiProduct.specifications?.reduce((acc: any, spec) => {
      if (spec.items && Array.isArray(spec.items)) {
        spec.items.forEach(item => {
          if (item) {
            acc[item.key || 'Specification'] = item.value;
          }
        });
      }
      return acc;
    }, {}) || {},
    features: apiProduct.specifications?.flatMap(spec =>
      (spec.items && Array.isArray(spec.items))
        ? spec.items.map(item => `${item.key || 'Feature'}: ${item.value}`)
        : []
    ) || [],
    warranty: apiProduct.warranties?.[0]?.group_name
      ? `${apiProduct.warranties[0].group_name} - ${apiProduct.warranties[0].items?.[0]?.duration} ${apiProduct.warranties[0].items?.[0]?.type}`
      : 'Standard Warranty',
    shipping: 'Delivery in Dhaka (3-5 Days)',
    soldBy: apiProduct.vendor?.name || 'Official Store',
    // Pass vendor object for proper routing
    vendor: apiProduct.vendor ? {
      id: apiProduct.vendor.id,
      name: apiProduct.vendor.name,
      slug: apiProduct.vendor.slug,
    } : null, // null means official store (no vendor_id needed)
    emi: apiProduct.is_support_emi ? 'EMI Available' : 'Not Available',
    specialPrice: `৳${apiProduct.final_price.toLocaleString()}`,
    badgeText: apiProduct.is_featured ? 'Featured' : undefined,
    clubPoints: apiProduct.club_point || 0,
    frequentlyBought: [],
    // Pass raw attributes for variation handling
    attributes: apiProduct.attributes || [],
    type: apiProduct.type,
    isVariableProduct,
    // Shipping costs for cart
    shipping_in_dhaka: apiProduct.shipping_in_dhaka || 0,
    shipping_outside_dhaka: apiProduct.shipping_outside_dhaka || 0,
  };

  const breadcrumbItems = [
    { label: 'Products', href: '/search' },
    ...(product.brand ? [{ label: product.brand, href: `/brand/${product.brandSlug}` }] : []),
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Product detail presentation */}
        <ProductDetailContent product={product} />

        {/* Product Details Tabs */}
        <ProductTabs
          productId={product.id}
          description={product.description}
          specifications={product.specifications}
          features={product.features}
          warranty={product.warranty}
          shipping={product.shipping}
        />

        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} categoryId={apiProduct.category?.id} />
      </div>
    </div>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 7200; // Revalidate every 2 hours

// Generate static params for popular products (optional)
export async function generateStaticParams() {
  // You can pre-render popular product pages at build time
  // For now, we'll skip this and rely on ISR
  return [];
}
