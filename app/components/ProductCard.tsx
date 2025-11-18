'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';
import { useState } from 'react';

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
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) return;
    
    setIsAdding(true);
    addToCart({
      id,
      name,
      image,
      seller: 'Official Store',
      price,
      originalPrice,
      discount,
      quantity: 1,
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200 relative flex flex-col h-full">
      {/* Top badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 text-xs font-bold">
        {discount && (
          <span className="bg-red-500 text-white px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {badge && (
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col gap-4 p-4 flex-1">
        {/* Image */}
        <Link href={`/product/${id}`} className="flex-shrink-0">
          <div className="relative w-full h-36 sm:w-28 sm:h-28 md:w-full md:h-56 bg-gray-50 rounded-xl flex items-center justify-center">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-2 sm:p-0"
              unoptimized
            />
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-2">
          <Link href={`/product/${id}`}>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-blue-600">
              {name}
            </h3>
          </Link>

          {rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-yellow-500">
              <div>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</div>
              <span className="text-gray-500">({rating})</span>
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-blue-600">৳{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ৳{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="text-xs font-medium text-green-600">
            {inStock ? 'In Stock' : <span className="text-red-500">Out of Stock</span>}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAdding}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <FiShoppingCart size={16} />
              {isAdding ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="md:hidden border-t border-gray-100 px-4 py-3 flex justify-end">
        <button
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
          className="bg-blue-600 text-white text-xs font-semibold px-5 py-2 rounded-full flex items-center gap-2 disabled:bg-gray-300"
        >
          <FiShoppingCart size={14} />
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  );
}

