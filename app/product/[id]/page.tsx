import { notFound } from 'next/navigation';
import ProductTabs from '@/app/components/ProductTabs';
import RelatedProducts from '@/app/components/RelatedProducts';
import Breadcrumb from '@/app/components/Breadcrumb';
import ProductDetailContent from '@/app/components/ProductDetailContent';

// Mock product data - in real app, this would come from API/database
const getProduct = (id: string) => {
  const products: any = {
    '1': {
      id: '1',
      name: 'Philips HL7757 750W 3 Jar Mixer Grinder',
      brand: 'Philips',
      price: 5990,
      originalPrice: 10450,
      discount: 43,
      rating: 4.9,
      reviewCount: 444,
      inStock: true,
      stockCount: 42,
      sku: 'HL7757-750W',
      images: [
        'https://images.unsplash.com/photo-1464120458734-6010a2856b14?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1603808033192-082d6919d42f?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=800&h=800&fit=crop',
      ],
      colors: [
        { name: 'Black', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop' },
        { name: 'Silver', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=200&h=200&fit=crop' },
      ],
      description: 'Philips HL7757 Mixer Grinder delivers superior mixing & grinding performance with 750W turbo power. Ideal for Indian cooking needs with three stainless steel jars.',
      specifications: {
        'Power': '750 Watts Turbo Motor',
        'Jars Included': '3 Stainless Steel Jars',
        'Speed Settings': '3 Speed + Pulse',
        'Blade Type': 'Multipurpose Stainless Steel',
        'Body Material': 'ABS Plastic',
        'Warranty': '2 Years Official Warranty',
        'Cord Length': '1.2 meters',
        'Dimensions': '21 x 39 x 46 cm',
      },
      features: [
        'Special Turbo Motor: 750W powerful motor for toughest grinding',
        'Food Grade Jars: Leak-proof stainless steel jars with handles',
        '3-Speed Control: Variable speeds for customized grinding',
        'Advanced Air Ventilation: Keeps the appliance cool during heavy-duty applications',
        'Easy to Clean: Removable parts for convenient cleaning',
      ],
      warranty: '2 Years Official Warranty',
      shipping: 'Free Delivery in Dhaka (3-5 Days)',
      soldBy: 'Philips Official',
      emi: '৳187.19/month',
      specialPrice: 'Tk.5,990',
      badgeText: 'Official Warranty',
      clubPoints: 106.2,
      frequentlyBought: [
        {
          id: 'iron',
          name: 'Philips GC181/80 Super Heavy Duty Dry Iron',
          price: 2990,
          originalPrice: 3150,
          discount: 5,
          image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&h=200&fit=crop',
        },
        {
          id: 'airfryer',
          name: 'Philips Essential 4.1L Air Fryer (HD9200)',
          price: 8090,
          originalPrice: 14500,
          discount: 44,
          image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=200&h=200&fit=crop',
        },
      ],
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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb 
              items={[
            { label: 'Home', href: '/' },
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
            <RelatedProducts currentProductId={product.id} />
      </div>
    </div>
  );
}

