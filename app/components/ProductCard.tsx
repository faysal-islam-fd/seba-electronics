'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuickViewModal from './QuickViewModal';
import { useCheckWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/app/store/api/wishlistApi';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import { useGetProductReviewsQuery } from '@/app/store/api/reviewsApi';

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
  type?: string; // 'simple' or 'variable'
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
  soldBy,
  type
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Convert id to number for API calls
  const productId = typeof id === 'string' ? parseInt(id, 10) : id;

  // Check if product is in wishlist
  const { data: wishlistCheck } = useCheckWishlistQuery(productId, { skip: !isLoggedIn });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  // Fetch product reviews to get real rating
  const { data: reviewsData, isLoading: isLoadingReviews } = useGetProductReviewsQuery(
    { productId, per_page: 1 },
    { skip: !productId }
  );

  // Extract rating and review count from reviews data
  const ratingSummary = reviewsData?.summary || reviewsData?.rating_summary;

  // Get rating from API if available
  let apiRating: number | null = null;
  let apiReviewCount: number | null = null;

  if (ratingSummary) {
    if ('average_rating' in ratingSummary && ratingSummary.average_rating !== undefined) {
      apiRating = parseFloat(String(ratingSummary.average_rating));
    } else if ('average' in ratingSummary && ratingSummary.average !== undefined) {
      apiRating = parseFloat(String(ratingSummary.average));
    }
    if ('total_reviews' in ratingSummary && ratingSummary.total_reviews !== undefined) {
      apiReviewCount = ratingSummary.total_reviews;
    }
  }

  // Use prop rating as default, only override with API data if API has actual rating data (> 0)
  // This ensures immediate display with prop, then updates with real data from API when available
  const displayRating = (!isLoadingReviews && apiRating !== null && apiRating > 0)
    ? apiRating
    : (rating !== undefined && rating !== null ? rating : 0);
  const displayReviewCount = (!isLoadingReviews && apiReviewCount !== null && apiReviewCount > 0)
    ? apiReviewCount
    : (reviewCount !== undefined && reviewCount !== null ? reviewCount : 0);

  // Show rating if we have a rating > 0 (from prop or API) or if we have review count > 0
  const shouldShowRating = displayRating > 0 || displayReviewCount > 0;

  const isWishlisted = wishlistCheck?.in_wishlist || false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return;

    // For variable products, redirect to product details page
    if (type === 'variable') {
      router.push(`/product/${id}`);
      return;
    }

    setIsAdding(true);
    // Extract product_id - convert string id to number if needed
    const productId = typeof id === 'string' ? parseInt(id, 10) : id;

    addToCart({
      id,
      name,
      image,
      seller: soldBy || 'Official Store',
      price,
      originalPrice,
      discount,
      quantity: 1,
      product_id: productId,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      // Redirect to login if not logged in
      router.push('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId).unwrap();
        showSuccess('Removed from wishlist');
      } else {
        const result = await addToWishlist({ product_id: productId }).unwrap();
        showSuccess('Added to wishlist');
        // Force refetch to ensure data is up to date
        setTimeout(() => {
          // Small delay to ensure API has processed
        }, 100);
      }
    } catch (error: any) {
      console.error('Failed to update wishlist:', error);
      const errorMessage = error?.data?.message || 'Failed to update wishlist. Please try again.';
      showError(errorMessage);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const savings = originalPrice ? originalPrice - price : 0;
  const savingsPercentage = originalPrice ? Math.round((savings / originalPrice) * 100) : 0;

  // Render stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-[10px] sm:text-xs" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-[10px] sm:text-xs" />);
    }
    const emptyStars = 5 - Math.ceil(displayRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 text-[10px] sm:text-xs" />);
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
      <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 z-20 flex flex-col gap-1 sm:gap-2">
        {discount && (
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold shadow-md">
            -{discount}%
          </span>
        )}
        {badge && (
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold shadow-md">
            {badge}
          </span>
        )}
      </div>

      {/* Quick action buttons - visible on hover */}
      <div className={`absolute top-1.5 sm:top-3 right-1.5 sm:right-3 z-20 flex flex-col gap-1 sm:gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
        <button
          onClick={handleWishlist}
          className={`p-1.5 sm:p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${isWishlisted
            ? 'bg-red-500 text-white'
            : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
            }`}
          aria-label="Add to wishlist"
        >
          <FiHeart size={14} className="sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={handleQuickView}
          className="p-1.5 sm:p-2 rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm hover:bg-blue-500 hover:text-white transition-all duration-200"
          aria-label="Quick view"
        >
          <FiEye size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative w-full h-36 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <Link href={`/product/${id}`} className="block w-full h-full">
          <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
            <Image
              src={image}
              alt={name}
              fill
              className={`object-contain transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
                }`}
              unoptimized
            />
          </div>
        </Link>

        {/* Stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-red-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col gap-1.5 sm:gap-2.5 p-2 sm:p-4">
        <Link href={`/product/${id}`}>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-blue-600 transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {shouldShowRating && (
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex items-center gap-0.5">
              {renderStars()}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-500">
              {displayReviewCount > 0
                ? `(${displayReviewCount})`
                : displayRating > 0
                  ? `(${displayRating.toFixed(1)})`
                  : ''}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-xl font-bold text-gray-900">৳{price.toLocaleString()}</span>
            {originalPrice && (
              <>
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  ৳{originalPrice.toLocaleString()}
                </span>
                {savings > 0 && (
                  <span className="text-[10px] sm:text-xs font-medium text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 rounded">
                    Save ৳{savings.toLocaleString()}
                  </span>
                )}
              </>
            )}
          </div>
          {originalPrice && savingsPercentage > 0 && (
            <span className="text-[10px] sm:text-xs text-gray-500">
              You save {savingsPercentage}%
            </span>
          )}
        </div>

        {/* Stock Status */}
        {inStock && (
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] sm:text-xs font-medium text-green-600">In Stock</span>
          </div>
        )}

        {/* Desktop Add to Cart Button */}
        <div className="hidden md:block mt-auto pt-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${isAdding
              ? 'bg-blue-400 text-white cursor-wait'
              : inStock
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            <FiShoppingCart size={16} />
            {isAdding ? 'Adding...' : inStock ? (type === 'variable' ? 'Select Options' : 'Add to Cart') : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Mobile Add to Cart Button */}
      <div className="md:hidden border-t border-gray-100 px-2.5 sm:px-4 py-2 sm:py-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
          className={`w-full py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 ${isAdding
            ? 'bg-blue-400 text-white cursor-wait'
            : inStock
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          <FiShoppingCart size={14} className="sm:w-4 sm:h-4" />
          {isAdding ? 'Adding...' : inStock ? (type === 'variable' ? 'Select Options' : 'Add to Cart') : 'Out of Stock'}
        </button>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={{
          id,
          name,
          price,
          originalPrice,
          image,
          discount,
          badge,
          rating: displayRating,
          reviewCount: displayReviewCount,
          inStock,
          soldBy,
        }}
      />
    </div>
  );
}

