'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetWishlistQuery, useRemoveFromWishlistMutation, useClearWishlistMutation } from '@/app/store/api/wishlistApi';
import { useCart } from '@/app/context/CartContext';
import { useToast } from '@/app/context/ToastContext';
import { useAuth } from '@/app/context/AuthContext';
import { normalizeImageUrl } from '@/app/utils/imageUtils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FiHeart, FiLoader, FiArrowRight, FiShoppingCart, FiTrash2, FiX } from 'react-icons/fi';

export default function WishlistPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Only fetch wishlist if user is logged in
  const { data, isLoading, error, refetch, isFetching } = useGetWishlistQuery(undefined, {
    // Only refetch on mount, not on every render
    refetchOnMountOrArgChange: false,
    // Skip query if user is not logged in
    skip: !isLoggedIn,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [clearWishlist] = useClearWishlistMutation();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [isClearing, setIsClearing] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Memoize wishlist items to prevent unnecessary re-renders
  const wishlistItems = useMemo(() => {
    return data?.data || [];
  }, [data]);

  // Memoize item count to prevent header blinking
  const itemCount = useMemo(() => {
    return wishlistItems.length;
  }, [wishlistItems.length]);

  const handleRemove = useCallback(async (productId: number) => {
    setRemovingIds(prev => new Set(prev).add(productId));
    try {
      await removeFromWishlist(productId).unwrap();
      showSuccess('Removed from wishlist');
      // Cache invalidation will automatically refetch
    } catch (err: any) {
      console.error('Failed to remove from wishlist:', err);
      const errorMessage = err?.data?.message || 'Failed to remove from wishlist. Please try again.';
      showError(errorMessage);
    } finally {
      setRemovingIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, [removeFromWishlist, showSuccess, showError]);

  const handleClearWishlist = useCallback(async () => {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
      return;
    }
    setIsClearing(true);
    try {
      await clearWishlist().unwrap();
      showSuccess('Wishlist cleared');
      // Cache invalidation will automatically refetch
    } catch (err: any) {
      console.error('Failed to clear wishlist:', err);
      const errorMessage = err?.data?.message || 'Failed to clear wishlist. Please try again.';
      showError(errorMessage);
    } finally {
      setIsClearing(false);
    }
  }, [clearWishlist, showSuccess, showError]);

  const handleAddToCart = useCallback((product: any) => {
    const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;

    // Calculate final price from API response
    const price = parseFloat(product.price || 0);
    const discount = parseFloat(product.discount || 0);
    const discountType = product.discount_type || 'flat';

    let finalPrice = price;
    if (discount > 0) {
      if (discountType === 'percent') {
        finalPrice = price - (price * discount / 100);
      } else {
        finalPrice = price - discount;
      }
    }

    // Use thumbnail_image if available, fallback to thumbnail
    const thumbnail = product.thumbnail_image || product.thumbnail;

    addToCart({
      id: product.id.toString(),
      name: product.title,
      image: normalizeImageUrl(thumbnail),
      seller: product.brand?.name || product.vendor?.name || 'Official Store',
      price: finalPrice,
      originalPrice: discount > 0 ? price : undefined,
      discount: discountType === 'percent' ? discount : (discount / price * 100),
      quantity: 1,
      product_id: productId,
    });
  }, [addToCart]);

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
            <FiHeart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-600" size={24} />
          </div>
          <p className="text-gray-700 font-medium text-lg mt-6">Loading your wishlist...</p>
          <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <FiHeart className="text-red-500" size={32} />
        </div>
        <p className="text-red-600 font-medium mb-2">Failed to load wishlist</p>
        <p className="text-gray-500 text-sm mb-4">Please try again later</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25">
            <FiHeart className="text-white" size={26} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Wishlist</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {itemCount > 0
                ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} saved for later`
                : 'Save your favorite products here'}
            </p>
          </div>
        </div>
        {itemCount > 0 && (
          <button
            onClick={handleClearWishlist}
            disabled={isClearing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiTrash2 size={16} />
            {isClearing ? 'Clearing...' : 'Clear All'}
          </button>
        )}
      </div>

      {itemCount === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-12 md:p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiHeart className="text-gray-400" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start adding products to your wishlist! Click the heart icon on any product to save it for later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
          >
            Start Shopping
            <FiArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {wishlistItems.map((item) => {
            const product = item.product;
            const isRemoving = removingIds.has(item.product_id);

            // Calculate final price from API response
            const price = parseFloat(product.price?.toString() || '0');
            const discount = parseFloat(product.discount?.toString() || '0');
            const discountType = product.discount_type || 'flat';

            let finalPrice = price;
            if (discount > 0) {
              if (discountType === 'percent') {
                finalPrice = price - (price * discount / 100);
              } else {
                finalPrice = price - discount;
              }
            }

            // Use thumbnail_image if available, fallback to thumbnail
            const thumbnail = product.thumbnail_image || product.thumbnail;

            const isOutOfStock = product.is_out_of_stock || product.stock === 0;
            const discountPercentage = discountType === 'percent'
              ? discount
              : (discount > 0 && price > 0 ? (discount / price * 100) : 0);

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-red-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.product_id)}
                  disabled={isRemoving}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-500 hover:text-white text-gray-700 transition-all duration-200 disabled:opacity-50"
                  aria-label="Remove from wishlist"
                >
                  {isRemoving ? (
                    <FiLoader className="animate-spin" size={18} />
                  ) : (
                    <FiX size={18} />
                  )}
                </button>

                {/* Product Image */}
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative w-full h-48 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {thumbnail ? (
                      <Image
                        src={imageErrors.has(product.id) ? '/products/placeholder.jpg' : normalizeImageUrl(thumbnail)}
                        alt={product.title || 'Product'}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                        priority={false}
                        onError={() => {
                          // Fallback to placeholder if image fails to load
                          if (!imageErrors.has(product.id)) {
                            setImageErrors(prev => new Set(prev).add(product.id));
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem]">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-lg font-bold text-gray-900">
                      ৳{finalPrice.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {discount > 0 && price > finalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ৳{price.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    )}
                    {discountPercentage > 0 && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        -{Math.round(discountPercentage)}%
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {!isOutOfStock && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-600">In Stock</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock}
                      className={`flex-1 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${isOutOfStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                        }`}
                    >
                      <FiShoppingCart size={16} />
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

