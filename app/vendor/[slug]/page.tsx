import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import Breadcrumb from '@/app/components/Breadcrumb';
import { getVendorProducts, VendorType } from '@/app/lib/api';
import { isProductInStock } from '@/app/utils/stockUtils';

// Vendor slug mappings
// "official" slug -> vendor_type=official (no vendor_id needed)
// "seller-{id}" slug -> vendor_type=seller&vendor_id={id}
interface VendorConfig {
  type: VendorType;
  vendorId?: number;
  name: string;
  description: string;
}

// Parse vendor slug to get vendor config
function parseVendorSlug(slug: string): VendorConfig | null {
  // Check if it's the official store
  if (slug === 'official' || slug === 'official-store' || slug === 'seba-electronics') {
    return {
      type: 'official',
      name: 'Seba Electronics Official',
      description: 'Official Seba Electronics store with authentic products and warranty',
    };
  }

  // Check if it's a seller (format: seller-{id} or vendor-{id})
  const sellerMatch = slug.match(/^(?:seller|vendor)-(\d+)$/);
  if (sellerMatch) {
    const vendorId = parseInt(sellerMatch[1], 10);
    return {
      type: 'seller',
      vendorId,
      name: `Seller Store #${vendorId}`,
      description: `Products from seller #${vendorId}`,
    };
  }

  // Legacy support for old vendor slugs like 'philips-official'
  // These will show official products by default
  if (slug.endsWith('-official')) {
    const brandName = slug.replace('-official', '').split('-').map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    return {
      type: 'official',
      name: `${brandName} Official`,
      description: `Official ${brandName} store with authentic products and warranty`,
    };
  }

  return null;
}

export default async function VendorPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  // Parse the vendor slug
  const vendorConfig = parseVendorSlug(slug);

  if (!vendorConfig) {
    notFound();
  }

  // Pagination setup
  const currentPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;
  const productsPerPage = 12;

  // Fetch products from API
  const productsData = await getVendorProducts({
    vendor_type: vendorConfig.type,
    vendor_id: vendorConfig.vendorId,
    page: currentPage,
    per_page: productsPerPage,
  });

  // Transform products for ProductCard component
  const products = productsData.success && productsData.data.length > 0
    ? productsData.data.map(product => ({
      id: product.id.toString(),
      name: product.title,
      price: product.final_price,
      originalPrice: product.price !== product.final_price ? product.price : undefined,
      image: (product as any).thumbnail_image || product.thumbnail || '/products/placeholder.jpg',
      discount: product.discount_percentage ? Math.round(product.discount_percentage) : undefined,
      badge: vendorConfig.type === 'official' ? 'Official Warranty' : undefined,
      rating: 4.5,
      inStock: isProductInStock(product.stock, product.is_out_of_stock),
      soldBy: vendorConfig.name,
    }))
    : [];

  // Calculate pagination
  const totalPages = productsData.meta?.last_page || 1;
  const validPage = Math.max(1, Math.min(currentPage, totalPages));
  const totalProducts = productsData.meta?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: vendorConfig.name },
          ]}
        />

        {/* Vendor Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{vendorConfig.name}</h1>
              <p className="text-gray-600 mt-1">{vendorConfig.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
                <div className="text-sm text-gray-500">Products</div>
              </div>
              {vendorConfig.type === 'official' && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  <span className="font-medium">✓ Verified Official Store</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-6">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Link
                    href={`/vendor/${slug}${validPage > 1 ? `?page=${validPage - 1}` : ''}`}
                    className={`px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${validPage === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                      }`}
                  >
                    &lt;
                  </Link>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    // Show pages around current page
                    let pageNum: number;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (validPage <= 4) {
                      pageNum = i + 1;
                    } else if (validPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = validPage - 3 + i;
                    }
                    return pageNum;
                  }).map((page) => (
                    <Link
                      key={page}
                      href={`/vendor/${slug}${page > 1 ? `?page=${page}` : ''}`}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${page === validPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </Link>
                  ))}
                  <Link
                    href={`/vendor/${slug}?page=${validPage + 1}`}
                    className={`px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${validPage === totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                      }`}
                  >
                    &gt;
                  </Link>
                </div>
              )}

              {/* Results info */}
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing page {validPage} of {totalPages} ({totalProducts} products)
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h2>
              <p className="text-gray-600 mb-6">
                This vendor doesn't have any products available at the moment.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
