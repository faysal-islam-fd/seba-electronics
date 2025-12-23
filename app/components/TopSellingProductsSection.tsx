'use client';

import { useGetTopSellingProductsQuery } from '@/app/store/api/productsApi';
import CategorySection from './CategorySection';

interface TopSellingProductsSectionProps {
  title: string;
  viewAllLink?: string;
  limit?: number;
}

export default function TopSellingProductsSection({ 
  title, 
  viewAllLink = '/category/top-selling', 
  limit = 8 
}: TopSellingProductsSectionProps) {
  const { data, isLoading, error } = useGetTopSellingProductsQuery({ limit });

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden h-96 animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !data?.success) {
    return (
      <section className="mb-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Failed to load products. Please try again later.</p>
        </div>
      </section>
    );
  }

  const products = data.data.map((product) => ({
    id: product.id.toString(),
    name: product.title,
    price: product.final_price,
    originalPrice: product.price !== product.final_price ? product.price : undefined,
    image: product.thumbnail,
    discount: product.discount_percentage ? Math.round(product.discount_percentage) : undefined,
    badge: product.is_top_selling ? 'Top Selling' : undefined,
    rating: 4.5, // Default rating since API doesn't provide it
    inStock: !product.is_out_of_stock,
  }));

  return <CategorySection title={title} products={products} viewAllLink={viewAllLink} />;
}

