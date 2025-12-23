'use client';

import ProductCard from './ProductCard';
import { useGetProductsQuery } from '@/app/store/api/productsApi';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: number;
}

export default function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  // Fetch related products - same category, excluding current product
  const { data, isLoading } = useGetProductsQuery({
    per_page: 8,
    category_id: categoryId,
  });

  const relatedProducts = data?.data?.filter(p => p.id.toString() !== currentProductId).slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden h-80 animate-pulse">
              <div className="w-full h-40 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
        {relatedProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            id={product.id.toString()}
            name={product.title}
            price={product.final_price}
            originalPrice={product.price !== product.final_price ? product.price : undefined}
            image={product.thumbnail}
            discount={product.discount_percentage ? Math.round(product.discount_percentage) : undefined}
            rating={4.5}
            inStock={!product.is_out_of_stock}
          />
        ))}
      </div>
    </div>
  );
}
