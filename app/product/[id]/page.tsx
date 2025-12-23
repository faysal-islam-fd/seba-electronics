import { notFound } from 'next/navigation';
import ProductTabs from '@/app/components/ProductTabs';
import RelatedProducts from '@/app/components/RelatedProducts';
import Breadcrumb from '@/app/components/Breadcrumb';
import ProductDetailContent from '@/app/components/ProductDetailContent';
import { getProductDetails } from '@/app/lib/api';

// Server Component with SSR
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch product data on the server
  const data = await getProductDetails(id);

  if (!data || !data.success) {
    notFound();
  }

  const apiProduct = data.data;

  // Transform API data to match the component's expected format
  const product = {
    id: apiProduct.id.toString(),
    name: apiProduct.title,
    brand: apiProduct.brand?.name || 'Unknown Brand',
    price: apiProduct.final_price,
    originalPrice: apiProduct.price !== apiProduct.final_price ? apiProduct.price : undefined,
    discount: apiProduct.discount_percentage ? Math.round(apiProduct.discount_percentage) : undefined,
    rating: 4.5, // Default since API doesn't provide ratings
    reviewCount: 0,
    inStock: !apiProduct.is_out_of_stock,
    stockCount: apiProduct.stock,
    sku: apiProduct.sku,
    images: apiProduct.galleries?.filter(g => g.type === 'image').map(g => g.file_path || '') || [apiProduct.thumbnail],
    colors: [], // API doesn't provide color variants in this format
    description: apiProduct.description,
    specifications: apiProduct.specifications?.reduce((acc: any, spec) => {
      spec.items.forEach(item => {
        acc[item.key] = item.value;
      });
      return acc;
    }, {}) || {},
    features: apiProduct.specifications?.flatMap(spec => 
      spec.items.map(item => `${item.key}: ${item.value}`)
    ) || [],
    warranty: apiProduct.warranties?.[0]?.title || 'Standard Warranty',
    shipping: 'Free Delivery in Dhaka (3-5 Days)',
    soldBy: apiProduct.vendor?.name || 'Official Store',
    emi: apiProduct.is_support_emi ? 'EMI Available' : undefined,
    specialPrice: `৳${apiProduct.final_price.toLocaleString()}`,
    badgeText: apiProduct.is_featured ? 'Featured' : undefined,
    clubPoints: 0,
    frequentlyBought: [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Products', href: '/products' },
            { label: product.brand, href: `/brand/${product.brand.toLowerCase()}` },
            { label: product.name },
          ]}
        />

        {/* Product detail presentation */}
        <ProductDetailContent product={product} />

        {/* Product Details Tabs */}
        <ProductTabs 
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
