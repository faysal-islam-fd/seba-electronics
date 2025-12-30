'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiX, FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';
import { useGetProductDetailsQuery } from '@/app/store/api/productsApi';
import { useCheckWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/app/store/api/wishlistApi';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import { useAlert } from '@/app/context/AlertContext';

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
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { showSuccess, showError } = useToast();
  const { showWarning, showError: showAlertError } = useAlert();
  const router = useRouter();
  
  // Convert id to number for API calls
  const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;
  
  // Check if product is in wishlist
  const { data: wishlistCheck } = useCheckWishlistQuery(productId, { skip: !isLoggedIn || !isOpen });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  
  const isWishlisted = wishlistCheck?.in_wishlist || false;

  // Fetch full product details when modal opens
  const { data: productDetailsData, isLoading: isLoadingDetails } = useGetProductDetailsQuery(
    product.id,
    { skip: !isOpen } // Only fetch when modal is open
  );

  const fullProduct = productDetailsData?.data;

  // Check if this is a variable product
  const isVariableProduct = fullProduct?.attributes && fullProduct.attributes.length > 0;

  // Extract all unique variations from attributes (for variable products)
  const variations = useMemo(() => {
    if (!isVariableProduct || !fullProduct?.attributes) return [];
    
    const variationsMap: Record<string, Set<string>> = {};
    
    fullProduct.attributes.forEach((attr: any) => {
      attr.values?.forEach((val: any) => {
        const variationName = val.variation?.name;
        const variationValue = val.variation_value?.value;
        
        if (variationName && variationValue) {
          if (!variationsMap[variationName]) {
            variationsMap[variationName] = new Set();
          }
          variationsMap[variationName].add(variationValue);
        }
      });
    });
    
    return Object.entries(variationsMap).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [fullProduct?.attributes, isVariableProduct]);

  // Find selected attribute based on selected variations (for variable products)
  const selectedAttribute = useMemo(() => {
    if (!isVariableProduct || !fullProduct?.attributes) return null;
    
    const selectedKeys = Object.keys(selectedVariations);
    if (selectedKeys.length === 0) return fullProduct.attributes[0];
    
    return fullProduct.attributes.find((attr: any) => {
      return attr.values?.every((val: any) => {
        const varName = val.variation?.name;
        const varValue = val.variation_value?.value;
        return selectedVariations[varName] === varValue;
      });
    }) || fullProduct.attributes[0];
  }, [selectedVariations, fullProduct?.attributes, isVariableProduct]);

  // Get current product details based on type
  const currentPrice = useMemo(() => {
    if (isVariableProduct && selectedAttribute) {
      return parseFloat(selectedAttribute.price);
    }
    return fullProduct?.final_price || product.price;
  }, [isVariableProduct, selectedAttribute, fullProduct?.final_price, product.price]);

  const currentStock = useMemo(() => {
    if (isVariableProduct && selectedAttribute) {
      return selectedAttribute.stock || 0;
    }
    return fullProduct?.stock || (product.inStock ? 100 : 0);
  }, [isVariableProduct, selectedAttribute, fullProduct?.stock, product.inStock]);

  const currentDiscount = useMemo(() => {
    if (isVariableProduct && selectedAttribute?.discount) {
      return parseFloat(selectedAttribute.discount);
    }
    return fullProduct?.discount_percentage || product.discount || 0;
  }, [isVariableProduct, selectedAttribute, fullProduct?.discount_percentage, product.discount]);

  const currentDiscountType = useMemo(() => {
    if (isVariableProduct && selectedAttribute) {
      return selectedAttribute.discount_type;
    }
    return fullProduct?.discount_type || 'percent';
  }, [isVariableProduct, selectedAttribute, fullProduct?.discount_type]);

  const currentSku = useMemo(() => {
    if (isVariableProduct && selectedAttribute) {
      return selectedAttribute.sku;
    }
    return fullProduct?.sku || '';
  }, [isVariableProduct, selectedAttribute, fullProduct?.sku]);
  
  // Calculate final price with discount
  const finalPrice = useMemo(() => {
    if (!currentDiscount || currentDiscount === 0) return currentPrice;
    
    if (currentDiscountType === 'percent') {
      return currentPrice - (currentPrice * currentDiscount / 100);
    }
    return currentPrice - currentDiscount;
  }, [currentPrice, currentDiscount, currentDiscountType]);

  const originalPrice = useMemo(() => {
    if (currentDiscount > 0) {
      return currentPrice;
    }
    const price = fullProduct?.price || product.originalPrice;
    return price ? (typeof price === 'string' ? parseFloat(price) : price) : undefined;
  }, [currentPrice, currentDiscount, fullProduct?.price, product.originalPrice]);

  // Initialize selected variations (for variable products)
  useEffect(() => {
    if (isOpen && isVariableProduct && variations.length > 0 && Object.keys(selectedVariations).length === 0) {
      const initial: Record<string, string> = {};
      variations.forEach(variation => {
        if (variation.values.length > 0) {
          initial[variation.name] = variation.values[0];
        }
      });
      setSelectedVariations(initial);
    }
  }, [isOpen, isVariableProduct, variations]);

  // Reset quantity when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedVariations({});
    }
  }, [isOpen]);

  const handleVariationChange = (variationName: string, value: string) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationName]: value,
    }));
    setQuantity(1); // Reset quantity when variation changes
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1 || value > currentStock) return;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (currentStock === 0) return;
    
    // For variable products, add variation info to name
    let productName = fullProduct?.title || product.name;
    if (isVariableProduct && Object.keys(selectedVariations).length > 0) {
      const variationText = Object.entries(selectedVariations)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      productName = `${productName} (${variationText})`;
    }
    
    // For variable products, ensure a variation is selected
    if (isVariableProduct && !selectedAttribute) {
      showWarning('Please select a product variation before adding to cart', 'Variation Required');
      setIsAdding(false);
      return;
    }
    
    // Extract product_id - convert string id to number if needed
    const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;
    
    // Extract product_attribute_id for variable products
    // Try multiple possible field names for the attribute ID
    let attributeId: number | undefined;
    if (isVariableProduct && selectedAttribute) {
      // Try different possible field names for the attribute ID
      attributeId = (selectedAttribute as any).id || 
                    (selectedAttribute as any).attribute_id || 
                    (selectedAttribute as any).product_attribute_id ||
                    (selectedAttribute as any).product_attribute?.id ||
                    undefined;
      
      // Debug logging to help identify the correct field name
      if (!attributeId) {
        console.warn('Attribute ID not found in expected fields. Attribute structure:', selectedAttribute);
        console.warn('Available keys:', Object.keys(selectedAttribute || {}));
      }
    }
    
    // For variable products, product_attribute_id is required
    if (isVariableProduct && !attributeId) {
      console.error('Variable product attribute ID not found. Selected attribute:', selectedAttribute);
      showAlertError('Unable to add product to cart. Please try selecting the variation again or contact support.', 'Add to Cart Failed');
      setIsAdding(false);
      return;
    }
    
    setIsAdding(true);
    addToCart({
      id: isVariableProduct && currentSku ? `${product.id}-${currentSku}` : product.id,
      name: productName,
      image: fullProduct?.thumbnail || product.image,
      seller: fullProduct?.vendor?.name || product.soldBy || 'Official Store',
      price: finalPrice,
      originalPrice: currentDiscount > 0 ? originalPrice : undefined,
      discount: currentDiscount,
      quantity: quantity,
      product_id: productId,
      product_attribute_id: attributeId,
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

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      onClose();
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
  };

  const savings = originalPrice && finalPrice < originalPrice ? originalPrice - finalPrice : 0;
  const savingsPercentage = originalPrice && finalPrice < originalPrice 
    ? Math.round((savings / originalPrice) * 100) 
    : 0;

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

  if (!isOpen) return null;

  const displayImage = fullProduct?.thumbnail || product.image;
  const displayName = fullProduct?.title || product.name;
  const isOutOfStock = currentStock === 0;

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
        {isLoadingDetails ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading product details...</div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Side - Product Image */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
              <div className="relative w-full h-48 sm:h-64 md:h-80">
                <Image
                  src={displayImage}
                  alt={displayName}
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
                  {currentDiscount > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold">
                      -{currentDiscountType === 'percent' ? `${currentDiscount}%` : `৳${currentDiscount}`}
                    </span>
                  )}
                  {product.badge && (
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold">
                      {product.badge}
                    </span>
                  )}
                  {fullProduct?.is_featured && (
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold">
                      Featured
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                  {displayName}
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
                      ৳{finalPrice.toLocaleString()}
                    </span>
                    {originalPrice && originalPrice > finalPrice && (
                      <>
                        <span className="text-sm sm:text-lg text-gray-400 line-through">
                          ৳{originalPrice.toLocaleString()}
                        </span>
                        {savings > 0 && (
                          <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            Save ৳{savings.toLocaleString()}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {originalPrice && originalPrice > finalPrice && savingsPercentage > 0 && (
                    <span className="text-xs sm:text-sm text-gray-500">
                      You save {savingsPercentage}%
                    </span>
                  )}
                  {currentSku && (
                    <p className="text-xs text-gray-500">SKU: {currentSku}</p>
                  )}
                </div>

                {/* Variations Selector - For Variable Products */}
                {isVariableProduct && variations.length > 0 && (
                  <div className="space-y-3 sm:space-y-4 pt-2 border-t border-gray-200">
                    {variations.map((variation) => (
                      <div key={variation.name} className="space-y-2">
                        <label className="text-xs sm:text-sm font-semibold text-gray-700 block">
                          {variation.name}:
                          {selectedVariations[variation.name] && (
                            <span className="ml-2 text-blue-600 font-normal">
                              {selectedVariations[variation.name]}
                            </span>
                          )}
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {variation.values.map((value) => (
                            <button
                              key={value}
                              onClick={() => handleVariationChange(variation.name, value)}
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 border-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                                selectedVariations[variation.name] === value
                                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                                  : 'border-gray-300 text-gray-700 hover:border-blue-400'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stock Status */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {!isOutOfStock ? (
                    <>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm font-medium text-green-600">
                        {currentStock > 0 ? `${currentStock} items in stock` : 'In Stock'}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs sm:text-sm font-medium text-red-600">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center gap-1 sm:gap-2 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-100 transition-colors text-gray-700 font-semibold text-sm sm:text-base"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900 font-semibold min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-100 transition-colors text-gray-700 font-semibold text-sm sm:text-base"
                        disabled={quantity >= currentStock}
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
                      disabled={isOutOfStock || isAdding}
                      className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 ${
                        isAdding
                          ? 'bg-blue-400 text-white cursor-wait'
                          : !isOutOfStock
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                      {isAdding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
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
                    disabled={isOutOfStock || isAdding}
                    className={`w-full py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ${
                      !isOutOfStock
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
                {(fullProduct?.vendor?.name || product.soldBy) && (
                  <div className="pt-1.5 sm:pt-2 border-t border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Sold by: <span className="font-medium text-gray-900">
                        {fullProduct?.vendor?.name || product.soldBy}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
