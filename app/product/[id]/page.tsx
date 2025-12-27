import { notFound } from 'next/navigation';
import ProductTabs from '@/app/components/ProductTabs';
import RelatedProducts from '@/app/components/RelatedProducts';
import Breadcrumb from '@/app/components/Breadcrumb';
import ProductDetailContent from '@/app/components/ProductDetailContent';
import { getProductDetails, getProductReviews } from '@/app/lib/api';

// Server Component with SSR
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch product data and reviews on the server
  const [data, reviewsData] = await Promise.all([
    getProductDetails(id),
    getProductReviews(id),
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

  // Transform API data to match the component's expected format
  const product = {
    id: apiProduct.id.toString(),
    name: apiProduct.title,
    brand: apiProduct.brand?.name || 'Unknown Brand',
    brandSlug: apiProduct.brand?.slug || apiProduct.brand?.name.toLowerCase() || 'unknown',
    thumbnail: apiProduct.thumbnail,
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
        .filter(path => path && path.trim() !== '') || [];
      return galleryImages.length > 0 ? galleryImages : [apiProduct.thumbnail];
    })(),
    description: apiProduct.description,
    specifications: apiProduct.specifications?.reduce((acc: any, spec) => {
      spec.items.forEach(item => {
        acc[item.key || 'Specification'] = item.value;
      });
      return acc;
    }, {}) || {},
    features: apiProduct.specifications?.flatMap(spec =>
      spec.items.map(item => `${item.key || 'Feature'}: ${item.value}`)
    ) || [],
    warranty: apiProduct.warranties?.[0]?.group_name
      ? `${apiProduct.warranties[0].group_name} - ${apiProduct.warranties[0].items?.[0]?.duration} ${apiProduct.warranties[0].items?.[0]?.type}`
      : 'Standard Warranty',
    shipping: 'Free Delivery in Dhaka (3-5 Days)',
    soldBy: apiProduct.vendor?.name || 'Official Store',
    emi: apiProduct.is_support_emi ? 'EMI Available' : 'Not Available',
    specialPrice: `৳${apiProduct.final_price.toLocaleString()}`,
    badgeText: apiProduct.is_featured ? 'Featured' : undefined,
    clubPoints: 0,
    frequentlyBought: [],
    // Pass raw attributes for variation handling
    attributes: apiProduct.attributes || [],
    type: apiProduct.type,
    isVariableProduct,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Products', href: '/search' },
            { label: product.brand, href: `/brand/${product.brandSlug}` },
            { label: product.name },
          ]}
        />

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
