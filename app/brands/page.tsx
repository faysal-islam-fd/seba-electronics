import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/app/components/Breadcrumb';
import { getBrands } from '@/app/lib/api';

// Server Component with SSR
export default async function BrandsPage() {
  const brandsData = await getBrands();
  const brands = brandsData.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Brands' },
            ]}
          />
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Brands</h1>
          <p className="text-sm text-gray-600 mt-2">
            Browse products from {brands.length} top brands
          </p>
        </div>

        {/* Brands Grid */}
        {brands.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-600">Brands will appear here once added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
              >
                <div className="aspect-square relative mb-3 flex items-center justify-center">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Enable ISR
export const revalidate = 86400; // 24 hours (brands don't change often)

