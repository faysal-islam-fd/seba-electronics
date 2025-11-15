import { notFound } from 'next/navigation';
import ProductGallery from '@/app/components/ProductGallery';
import ProductInfo from '@/app/components/ProductInfo';
import ProductTabs from '@/app/components/ProductTabs';
import RelatedProducts from '@/app/components/RelatedProducts';
import Breadcrumb from '@/app/components/Breadcrumb';

// Mock product data - in real app, this would come from API/database
const getProduct = (id: string) => {
  const products: any = {
    '1': {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
      brand: 'Apple',
      price: 145000,
      originalPrice: 155000,
      discount: 6,
      rating: 4.9,
      reviewCount: 234,
      inStock: true,
      stockCount: 15,
      sku: 'IPH15PM-256-NT',
      images: [
        'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1696446702721-306907ea4c5b?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&h=800&fit=crop',
      ],
      description: 'The iPhone 15 Pro Max features a strong and light titanium design with a textured matte glass back. It also features a Ceramic Shield front that\'s tougher than any smartphone glass. And it\'s splash, water, and dust resistant.',
      specifications: {
        'Display': '6.7-inch Super Retina XDR display',
        'Chip': 'A17 Pro chip with 6-core CPU',
        'Camera': '48MP Main | Ultra Wide | Telephoto',
        'Battery': 'Up to 29 hours video playback',
        'Storage': '256GB',
        'RAM': '8GB',
        'OS': 'iOS 17',
        'SIM': 'Dual SIM (nano-SIM and eSIM)',
        'Connectivity': '5G, WiFi 6E, Bluetooth 5.3',
        'Weight': '221 grams',
      },
      features: [
        'Titanium Design - Lightweight and Durable',
        'A17 Pro Chip - Fastest iPhone Ever',
        'Pro Camera System - 48MP Main Camera',
        'Action Button - Customizable Quick Actions',
        'USB-C Connector - Universal Charging',
        'Emergency SOS via Satellite',
        'Crash Detection',
        'Face ID',
      ],
      warranty: '1 Year Official Apple Warranty',
      shipping: 'Free Delivery in Dhaka (3-5 Days)',
    },
  };

  return products[id] || null;
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6 max-w-7xl mx-auto w-full">
            {/* Breadcrumb */}
            <Breadcrumb 
              items={[
                { label: 'Products', href: '/products' },
                { label: product.brand, href: `/brand/${product.brand.toLowerCase()}` },
                { label: product.name },
              ]}
            />

            {/* Product Main Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Left - Image Gallery */}
                <div className="overflow-visible">
                  <ProductGallery images={product.images} productName={product.name} />
                </div>

                {/* Right - Product Info */}
                <ProductInfo product={product} />
              </div>
            </div>

            {/* Product Details Tabs */}
            <ProductTabs 
              description={product.description}
              specifications={product.specifications}
              features={product.features}
              warranty={product.warranty}
              shipping={product.shipping}
            />

            {/* Related Products */}
            <RelatedProducts currentProductId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

