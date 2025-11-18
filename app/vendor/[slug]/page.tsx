import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import Breadcrumb from '@/app/components/Breadcrumb';

// Mock vendor data - in real app, this would come from API/database
type ProductType = {
  id: string;
  name: string;
  price: number;
  image: string;
  originalPrice?: number;
  discount?: number;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  soldBy?: string;
};

const vendorData: Record<string, {
  name: string;
  description: string;
  rating: number;
  totalProducts: number;
  products: ProductType[];
}> = {
  'philips-official': {
    name: 'Philips Official',
    description: 'Official Philips store with authentic products and warranty',
    rating: 4.9,
    totalProducts: 16,
    products: [
      {
        id: '1',
        name: 'Philips 4.2 Liters 1700W Air Fryer (NA221/00)',
        price: 13990,
        originalPrice: 24500,
        image: 'https://images.unsplash.com/photo-1608039829570-587539b5532e?w=400&h=400&fit=crop',
        discount: 35,
        badge: 'Official Warranty',
        rating: 4.5,
        reviewCount: 1,
        inStock: true,
        soldBy: 'Philips Official',
      },
      {
        id: '2',
        name: 'Philips 650W Hand Blender (HL1600/00)',
        price: 6690,
        originalPrice: 6990,
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d42f?w=400&h=400&fit=crop',
        discount: 4,
        badge: 'Official Warranty',
        rating: 4.3,
        inStock: true,
        soldBy: 'Philips Official',
      },
      {
        id: '3',
        name: 'Philips 250W Hand Blender (HL1655/02)',
        price: 4290,
        originalPrice: 6900,
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d42f?w=400&h=400&fit=crop',
        discount: 27,
        badge: 'Official Warranty',
        rating: 4.4,
        inStock: true,
        soldBy: 'Philips Official',
      },
      {
        id: '4',
        name: 'Philips XL Sized Sandwich Maker (HD2288/00)',
        price: 6690,
        originalPrice: 9200,
        image: 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=400&h=400&fit=crop',
        discount: 27,
        badge: 'Official Warranty',
        rating: 4.2,
        inStock: true,
        soldBy: 'Philips Official',
      },
      {
        id: '5',
        name: 'Philips 250W Hand Blender (HR1351/90)',
        price: 4490,
        originalPrice: 5890,
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d42f?w=400&h=400&fit=crop',
        discount: 24,
        badge: 'Official Warranty',
        rating: 4.3,
        inStock: true,
        soldBy: 'Philips Official',
      },
      {
        id: '6',
        name: 'Philips 1000W Compact Hair Dryer (HP8100/46)',
        price: 1690,
        originalPrice: 2990,
        image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop',
        discount: 43,
        badge: '2 Years Official Warranty',
        rating: 4.6,
        reviewCount: 19,
        inStock: true,
        soldBy: 'Philips Official',
      },
      {
        id: '7',
        name: 'Philips 1000W 3 Jars Mixer Grinder with PowerPro Motor (HL7713/01)',
        price: 8990,
        originalPrice: 12200,
        image: 'https://images.unsplash.com/photo-1464120458734-6010a2856b14?w=400&h=400&fit=crop',
        discount: 26,
        badge: 'Official Warranty',
        rating: 4.5,
        inStock: false,
        soldBy: 'Philips Official',
      },
      {
        id: '8',
        name: 'Philips 1000W Electric Drip Coffee Maker (HD7430/90)',
        price: 4990,
        originalPrice: 6900,
        image: 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=400&h=400&fit=crop',
        discount: 27,
        badge: 'Official Warranty',
        rating: 4.4,
        inStock: false,
        soldBy: 'Philips Official',
      },
      {
        id: '9',
        name: 'Philips 750W 3 Jars Mixer Grinder (HL7757)-Blue',
        price: 5990,
        originalPrice: 10450,
        image: 'https://images.unsplash.com/photo-1464120458734-6010a2856b14?w=400&h=400&fit=crop',
        discount: 43,
        badge: 'Official Warranty',
        rating: 4.5,
        reviewCount: 5,
        inStock: false,
        soldBy: 'Philips Official',
      },
      {
        id: '10',
        name: 'Philips 1000W 3 Jars Mixer Grinder with PowerPro Motor (HL7713)',
        price: 8990,
        originalPrice: 12200,
        image: 'https://images.unsplash.com/photo-1464120458734-6010a2856b14?w=400&h=400&fit=crop',
        discount: 26,
        badge: 'Official Warranty',
        rating: 4.5,
        inStock: false,
        soldBy: 'Philips Official',
      },
      {
        id: '11',
        name: 'Philips 1000W 4 Jar Juicer Mixer Grinder (HL7704/00)',
        price: 10990,
        originalPrice: 15300,
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d42f?w=400&h=400&fit=crop',
        discount: 28,
        badge: 'Official Warranty',
        rating: 4.4,
        reviewCount: 4,
        inStock: false,
        soldBy: 'Philips Official',
      },
      {
        id: '12',
        name: 'Philips 1000W Compact Hair Dryer (HP8100/60)',
        price: 1790,
        originalPrice: 2990,
        image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop',
        discount: 41,
        badge: '2 Years Official Warranty',
        rating: 4.6,
        inStock: false,
        soldBy: 'Philips Official',
      },
      {
        id: '13',
        name: 'Philips 4.2L Air Fryer (NA120/00)',
        price: 12990,
        originalPrice: 21400,
        image: 'https://images.unsplash.com/photo-1608039829570-587539b5532e?w=400&h=400&fit=crop',
        discount: 39,
        badge: 'Official Warranty',
        rating: 4.7,
        reviewCount: 19,
        inStock: false,
        soldBy: 'Philips Official',
      },
      {
        id: '14',
        name: 'Philips 500W Juicer (HL7566/00)',
        price: 4990,
        originalPrice: 5990,
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d42f?w=400&h=400&fit=crop',
        discount: 17,
        badge: 'Official Warranty',
        rating: 4.3,
        inStock: false,
        soldBy: 'Philips Official',
      },
      {
        id: '15',
        name: 'Philips 1200W Handheld Garment Steamer (GC360/30)',
        price: 3990,
        originalPrice: 5290,
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop',
        discount: 24,
        badge: 'Official Warranty',
        rating: 4.4,
        inStock: false,
        soldBy: 'Philips Official',
      },
      {
        id: '16',
        name: 'Philips 2400W Easy-Speed Plus Steam Iron (GC2147/30)',
        price: 3490,
        originalPrice: 4890,
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop',
        discount: 28,
        badge: 'Official Warranty',
        rating: 4.5,
        reviewCount: 1,
        inStock: false,
        soldBy: 'Philips Official',
      },
    ],
  },
  'official-store': {
    name: 'Official Store',
    description: 'Authentic products with official warranty',
    rating: 4.8,
    totalProducts: 8,
    products: [
      {
        id: 'store-1',
        name: 'Samsung Galaxy S24 Ultra 5G',
        price: 125000,
        originalPrice: 135000,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
        discount: 7,
        rating: 4.9,
        soldBy: 'Official Store',
      },
      {
        id: 'store-2',
        name: 'Apple iPhone 15 Pro Max',
        price: 145000,
        originalPrice: 155000,
        image: 'https://images.unsplash.com/photo-1592286927505-53369c45188e?w=400&h=400&fit=crop',
        discount: 6,
        rating: 4.9,
        soldBy: 'Official Store',
      },
    ],
  },
};

export default async function VendorPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const vendor = vendorData[slug];

  if (!vendor) {
    notFound();
  }

  // Pagination logic
  const currentPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;
  const productsPerPage = 12; // Show 12 products per page (3 rows of 4)
  const totalPages = Math.ceil(vendor.products.length / productsPerPage);
  const validPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = vendor.products.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: vendor.name },
          ]}
        />

        {/* Products Grid */}
        <div className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Link
              href={`/vendor/${slug}${validPage > 1 ? `?page=${validPage - 1}` : ''}`}
              className={`px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${
                validPage === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              &lt;
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/vendor/${slug}${page > 1 ? `?page=${page}` : ''}`}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                  page === validPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </Link>
            ))}
            <Link
              href={`/vendor/${slug}?page=${validPage + 1}`}
              className={`px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${
                validPage === totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              &gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

