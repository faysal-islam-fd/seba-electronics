import Link from 'next/link';
import ProductCard from './ProductCard';
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
}

interface CategorySectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  icon?: string;
}

export default function CategorySection({
  title,
  products,
  viewAllLink = '#',
  icon
}: CategorySectionProps) {
  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {icon && <span className="text-3xl">{icon}</span>}
          {title}
        </h2>
        <Link
          href={viewAllLink}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm group"
        >
          See All
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

