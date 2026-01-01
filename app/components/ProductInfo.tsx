'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiStar, FiHeart, FiShare2, FiShoppingCart, FiCheck, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';
import { useCheckWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/app/store/api/wishlistApi';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import { useAddToCompareMutation, useRemoveFromCompareMutation, useGetComparisonListQuery } from '@/app/store/api/compareApi';

interface Product {
  id: string;
  name: string;
  brand: string;
  brandSlug?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  sku: string;
  images?: string[];
  // Shipping fields - come as strings from API
  shipping_in_dhaka?: string | number;
  shipping_outside_dhaka?: string | number;
}

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // Convert id to number for API calls
  const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;

  // Check if product is in wishlist
  const { data: wishlistCheck } = useCheckWishlistQuery(productId, { skip: !isLoggedIn });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isWishlisted = wishlistCheck?.in_wishlist || false;

  // Compare logic
  const { data: comparisonList } = useGetComparisonListQuery();
  const [addToCompare] = useAddToCompareMutation();
  const [removeFromCompare] = useRemoveFromCompareMutation();

  const isCompared = comparisonList?.data?.some(item => item.id === productId);

  const handleCompare = async () => {
    try {
      if (isCompared) {
        await removeFromCompare(productId).unwrap();
        showSuccess('Removed from comparison');
      } else {
        if (comparisonList?.data && comparisonList.data.length >= 4) {
          showError('You can only compare up to 4 products.');
          return;
        }
        await addToCompare(productId).unwrap();
        showSuccess('Added to comparison');
      }
    } catch (error: any) {
      console.error('Failed to update comparison:', error);
      showError(error?.data?.message || 'Failed to update comparison');
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stockCount) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    // Extract product_id - convert string id to number if needed
    const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;

    addToCart({
      id: product.id,
      name: product.name,
      image: product.images?.[0] || '/products/placeholder.jpg',
      seller: `${product.brand} Official`,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      quantity: quantity,
      product_id: productId,
      // Pass shipping info
      shipping_in_dhaka: product.shipping_in_dhaka,
      shipping_outside_dhaka: product.shipping_outside_dhaka,
    });

    // Show feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      router.push('/cart');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      <div>
        <Link href={`/brand/${product.brandSlug || product.brand.toLowerCase()}`} className="text-blue-600 hover:underline font-medium text-sm">
          {product.brand}
        </Link>
      </div>

      {/* Product Name */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={18}
                className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {product.rating}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          ({product.reviewCount} Reviews)
        </span>
        <span className="text-sm text-gray-400">|</span>
        <span className="text-sm text-gray-500">SKU: {product.sku}</span>
      </div>

      {/* Price Section */}
      <div className="bg-blue-50 border-2 border-blue-100 rounded-lg p-4">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl md:text-4xl font-black text-blue-600">
            ৳{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xl text-gray-400 line-through">
              ৳{product.originalPrice.toLocaleString()}
            </span>
          )}
          {product.discount && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{product.discount}%
            </span>
          )}
        </div>
        {product.originalPrice && (
          <p className="text-sm text-green-600 font-medium">
            You Save: ৳{(product.originalPrice - product.price).toLocaleString()}
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.inStock ? (
          <>
            <div className="flex items-center gap-2 text-green-600">
              <FiCheck size={20} />
              <span className="font-semibold">In Stock</span>
            </div>
            <span className="text-sm text-gray-500">
              ({product.stockCount} units available)
            </span>
          </>
        ) : (
          <div className="text-red-600 font-semibold">Out of Stock</div>
        )}
      </div>

      {/* Quantity Selector */}
      {product.inStock && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Quantity:</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-lg"
              >
                −
              </button>
              <span className="px-6 py-2 font-semibold border-x-2 border-gray-300">
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                disabled={quantity >= product.stockCount}
                className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
        >
          <FiShoppingCart size={22} />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
        <button
          onClick={async () => {
            if (!isLoggedIn) {
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
              }
            } catch (error: any) {
              console.error('Failed to update wishlist:', error);
              const errorMessage = error?.data?.message || 'Failed to update wishlist. Please try again.';
              showError(errorMessage);
            }
          }}
          className={`border-2 ${isWishlisted ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-700'
            } hover:border-red-500 hover:text-red-500 font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          <FiHeart size={22} className={isWishlisted ? 'fill-current' : ''} />
        </button>
        <button className="border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
          <FiShare2 size={22} />
        </button>
        <button
          onClick={handleCompare}
          className={`border-2 ${isCompared ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-gray-300 text-gray-700'} hover:border-blue-500 hover:text-blue-500 font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          <FiRefreshCw size={22} />
        </button>
      </div>

      {/* Buy Now Button */}
      {product.inStock && (
        <button
          onClick={handleBuyNow}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
        >
          Buy Now
        </button>
      )}

      {/* Benefits/Features */}
      <div className="border-t pt-6 space-y-3">
        <div className="flex items-start gap-3">
          <FiTruck className="text-green-600 mt-1 flex-shrink-0" size={22} />
          <div>
            <p className="font-semibold text-gray-900">Fast Delivery</p>
            <p className="text-sm text-gray-600">Reliable shipping to your doorstep</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FiShield className="text-blue-600 mt-1 flex-shrink-0" size={22} />
          <div>
            <p className="font-semibold text-gray-900">Official Warranty</p>
            <p className="text-sm text-gray-600">1 Year Brand Warranty</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FiRefreshCw className="text-purple-600 mt-1 flex-shrink-0" size={22} />
          <div>
            <p className="font-semibold text-gray-900">7 Days Return</p>
            <p className="text-sm text-gray-600">Easy return within 7 days</p>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="font-semibold text-gray-900 mb-3">Payment Options:</p>
        <div className="flex flex-wrap gap-2">
          <div className="bg-white border border-gray-200 rounded px-3 py-2 text-sm font-medium">
            SSL Commerz
          </div>
          <div className="bg-white border border-gray-200 rounded px-3 py-2 text-sm font-medium">
            Cash on Delivery
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          SSL Commerz supports: Visa, Mastercard, Amex, bKash, Nagad & EMI
        </p>
      </div>
    </div>
  );
}

