import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';

interface ProductCardProps {
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

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  discount,
  badge,
  rating = 0,
  inStock = true
}: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 group relative h-full flex flex-col">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {discount && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        {badge && (
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
        <FiHeart className="text-gray-600 hover:text-red-500" size={16} />
      </button>

      {/* Product Image */}
      <Link href={`/product/${id}`}>
        <div className="relative w-full h-56 bg-gray-50 flex items-center justify-center p-4">
          <Image
            src={image}
            alt={name}
            width={300}
            height={300}
            className="object-contain max-h-full w-auto group-hover:scale-105 transition-transform duration-200"
            unoptimized
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${id}`}>
          <h3 className="text-sm text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 min-h-[40px] mb-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400 text-xs">
              {'★'.repeat(Math.floor(rating))}
              {'☆'.repeat(5 - Math.floor(rating))}
            </div>
            <span className="text-xs text-gray-500">({rating})</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-orange-600">৳{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ৳{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-3">
          {inStock ? (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={!inStock}
          className="w-full mt-auto bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm"
        >
          <FiShoppingCart size={16} />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

