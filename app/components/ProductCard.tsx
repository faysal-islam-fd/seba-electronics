'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
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
  reviewCount?: number;
  inStock?: boolean;
  soldBy?: string;
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
  reviewCount,
  inStock = true,
  soldBy
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) return;
    
    setIsAdding(true);
    addToCart({
      id,
      name,
      image,
      seller: soldBy || 'Official Store',
      price,
      originalPrice,
      discount,
      quantity: 1,
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view functionality can be added later
  };

  const savings = originalPrice ? originalPrice - price : 0;
  const savingsPercentage = originalPrice ? Math.round((savings / originalPrice) * 100) : 0;

  // Render stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-xs" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 text-xs" />);
    }
    return stars;
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 relative flex flex-col h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {discount && (
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-md">
            -{discount}%
          </span>
        )}
        {badge && (
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-md">
            {badge}
          </span>
        )}
      </div>

      {/* Quick action buttons - visible on hover */}
      <div className={`absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
        <button
          onClick={handleWishlist}
          className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
          }`}
          aria-label="Add to wishlist"
        >
          <FiHeart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>
        <button
          onClick={handleQuickView}
          className="p-2 rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm hover:bg-blue-500 hover:text-white transition-all duration-200"
          aria-label="Quick view"
        >
          <FiEye size={16} />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <Link href={`/product/${id}`} className="block w-full h-full">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={image}
              alt={name}
              fill
              className={`object-contain transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              unoptimized
            />
          </div>
        </Link>
        
        {/* Stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col gap-2.5 p-4">
        <Link href={`/product/${id}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {renderStars()}
            </div>
            <span className="text-xs text-gray-500">
              {reviewCount !== undefined ? `(${reviewCount})` : `(${rating.toFixed(1)})`}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold text-gray-900">৳{price.toLocaleString()}</span>
            {originalPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ৳{originalPrice.toLocaleString()}
                </span>
                {savings > 0 && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Save ৳{savings.toLocaleString()}
                  </span>
                )}
              </>
            )}
          </div>
          {originalPrice && savingsPercentage > 0 && (
            <span className="text-xs text-gray-500">
              You save {savingsPercentage}%
            </span>
          )}
        </div>

        {/* Stock Status */}
        {inStock && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-600">In Stock</span>
          </div>
        )}

        {/* Desktop Add to Cart Button */}
        <div className="hidden md:block mt-auto pt-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              isAdding
                ? 'bg-blue-400 text-white cursor-wait'
                : inStock
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FiShoppingCart size={16} />
            {isAdding ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Mobile Add to Cart Button */}
      <div className="md:hidden border-t border-gray-100 px-4 py-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            isAdding
              ? 'bg-blue-400 text-white cursor-wait'
              : inStock
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FiShoppingCart size={16} />
          {isAdding ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

