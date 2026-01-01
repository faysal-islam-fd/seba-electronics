import Link from 'next/link';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { FiArrowRight } from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  badge?: string;
  rating?: number;
  inStock?: boolean;
  type?: string; // 'simple' or 'variable'
  shipping_in_dhaka?: number | string;
  shipping_outside_dhaka?: number | string;
}

interface CategorySectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  icon?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

export default function CategorySection({
  title,
  products,
  viewAllLink = '#',
  icon,
  isLoading = false,
  skeletonCount = 4
}: CategorySectionProps) {
  const showSkeletons = isLoading || products.length === 0;

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5 pb-2 sm:pb-3 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
          {icon && <span className="text-xl sm:text-2xl md:text-3xl block">{icon}</span>}
          {title}
        </h2>
        {!showSkeletons && (
          <Link
            href={viewAllLink}
            className="flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-xs sm:text-sm md:text-base group"
          >
            See All
            <FiArrowRight className="group-hover:translate-x-1 transition-transform w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
          </Link>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {showSkeletons ? (
          // Show skeleton loaders
          Array.from({ length: skeletonCount }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          // Show actual products
          products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
        )}
      </div>
    </section>
  );
}

