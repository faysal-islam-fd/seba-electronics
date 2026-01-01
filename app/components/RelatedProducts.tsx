'use client';

import ProductCard from './ProductCard';
import { useGetProductsQuery } from '@/app/store/api/productsApi';
import { isProductInStock } from '@/app/utils/stockUtils';

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
      <div className="mt-6">
        <h2 className="text-2xl  font-bold text-gray-900 mb-6">Related Products</h2>
        <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    <div className="mt-6 -mx-3 sm:mx-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 px-3 sm:px-0">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 px-1 sm:px-0 auto-rows-fr">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            name={product.title}
            price={product.final_price ? (typeof product.final_price === 'string' ? parseFloat(product.final_price) : product.final_price) : 0}
            originalPrice={product.price && product.price !== product.final_price
              ? (typeof product.price === 'string' ? parseFloat(product.price) : product.price)
              : undefined}
            image={product.thumbnail || '/products/placeholder.jpg'}
            discount={product.discount_percentage ? Math.round(product.discount_percentage) : undefined}
            rating={4.5}
            inStock={isProductInStock(product.stock, product.is_out_of_stock)}
          />
        ))}
      </div>
    </div>
  );
}
