'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiX, FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
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
  };
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  // Reset quantity when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    setIsAdding(true);
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      seller: product.soldBy || 'Official Store',
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      quantity: quantity,
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      onClose();
      router.push('/cart');
    }, 500);
  };

  const handleViewDetails = () => {
    onClose();
    router.push(`/product/${product.id}`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const savingsPercentage = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0;

  // Render stars
  const renderStars = () => {
    const rating = product.rating || 0;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-xs sm:text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-xs sm:text-sm" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 text-xs sm:text-sm" />);
    }
    return stars;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-2 sm:p-4" 
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <FiX size={18} className="sm:w-5 sm:h-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left Side - Product Image */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="relative w-full h-48 sm:h-64 md:h-80">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="w-full md:w-1/2 overflow-y-auto bg-white p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.discount && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold">
                    -{product.discount}%
                  </span>
                )}
                {product.badge && (
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h3>

              {/* Rating */}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-0.5">
                    {renderStars()}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {product.rating.toFixed(1)}
                    {product.reviewCount !== undefined && ` (${product.reviewCount} reviews)`}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                  <span className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm sm:text-lg text-gray-400 line-through">
                        ৳{product.originalPrice.toLocaleString()}
                      </span>
                      {savings > 0 && (
                        <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                          Save ৳{savings.toLocaleString()}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {product.originalPrice && savingsPercentage > 0 && (
                  <span className="text-xs sm:text-sm text-gray-500">
                    You save {savingsPercentage}%
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {product.inStock ? (
                  <>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm font-medium text-green-600">In Stock</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-red-600">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-1 sm:gap-2 border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-100 transition-colors text-gray-700 font-semibold text-sm sm:text-base"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900 font-semibold min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-100 transition-colors text-gray-700 font-semibold text-sm sm:text-base"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:gap-3 pt-1 sm:pt-2">
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAdding}
                    className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 ${
                      isAdding
                        ? 'bg-blue-400 text-white cursor-wait'
                        : product.inStock
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FiShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 ${
                      isWishlisted
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <FiHeart size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock || isAdding}
                  className={`w-full py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ${
                    product.inStock
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Buy Now
                </button>
                <button
                  onClick={handleViewDetails}
                  className="w-full py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  View Full Details
                </button>
              </div>

              {/* Seller Info */}
              {product.soldBy && (
                <div className="pt-1.5 sm:pt-2 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Sold by: <span className="font-medium text-gray-900">{product.soldBy}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

