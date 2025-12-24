'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductGallery from '@/app/components/ProductGallery';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { FiStar, FiShare2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import EMIModal from '@/app/components/EMIModal';

interface ProductDetailContentProps {
  product: any;
}

export default function ProductDetailContent({ product }: ProductDetailContentProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  // Check if this is a variable product
  const isVariableProduct = product.attributes && product.attributes.length > 0;

  // Extract all unique variations from attributes (for variable products)
  const variations = useMemo(() => {
    if (!isVariableProduct) return [];
    
    const variationsMap: Record<string, Set<string>> = {};
    
    product.attributes.forEach((attr: any) => {
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
  }, [product.attributes, isVariableProduct]);

  // Find selected attribute based on selected variations (for variable products)
  const selectedAttribute = useMemo(() => {
    if (!isVariableProduct) return null;
    
    const selectedKeys = Object.keys(selectedVariations);
    if (selectedKeys.length === 0) return product.attributes[0];
    
    return product.attributes.find((attr: any) => {
      return attr.values?.every((val: any) => {
        const varName = val.variation?.name;
        const varValue = val.variation_value?.value;
        return selectedVariations[varName] === varValue;
      });
    }) || product.attributes[0];
  }, [selectedVariations, product.attributes, isVariableProduct]);

  // Get current product details based on type
  const currentPrice = useMemo(() => {
    if (isVariableProduct && selectedAttribute) {
      return parseFloat(selectedAttribute.price);
    }
    return product.price;
  }, [isVariableProduct, selectedAttribute, product.price]);

  const currentStock = useMemo(() => {
    if (isVariableProduct && selectedAttribute) {
      return selectedAttribute.stock;
    }
    return product.stockCount;
  }, [isVariableProduct, selectedAttribute, product.stockCount]);

  const currentDiscount = useMemo(() => {
    if (isVariableProduct && selectedAttribute?.discount) {
      return parseFloat(selectedAttribute.discount);
    }
    return product.discount || 0;
  }, [isVariableProduct, selectedAttribute, product.discount]);

  const currentDiscountType = useMemo(() => {
    if (isVariableProduct && selectedAttribute) {
      return selectedAttribute.discount_type;
    }
    return product.originalPrice ? 'percent' : 'flat';
  }, [isVariableProduct, selectedAttribute, product.originalPrice]);

  const currentSku = useMemo(() => {
    if (isVariableProduct && selectedAttribute) {
      return selectedAttribute.sku;
    }
    return product.sku;
  }, [isVariableProduct, selectedAttribute, product.sku]);
  
  // Calculate final price with discount
  const finalPrice = useMemo(() => {
    if (!currentDiscount || currentDiscount === 0) return currentPrice;
    
    if (currentDiscountType === 'percent') {
      return currentPrice - (currentPrice * currentDiscount / 100);
    }
    return currentPrice - currentDiscount;
  }, [currentPrice, currentDiscount, currentDiscountType]);

  // Initialize selected variations (for variable products)
  useEffect(() => {
    if (isVariableProduct && variations.length > 0 && Object.keys(selectedVariations).length === 0) {
      const initial: Record<string, string> = {};
      variations.forEach(variation => {
        if (variation.values.length > 0) {
          initial[variation.name] = variation.values[0];
        }
      });
      setSelectedVariations(initial);
    }
  }, [variations, isVariableProduct]);

  const handleQuantityChange = (value: number) => {
    if (value < 1 || value > currentStock) return;
    setQuantity(value);
  };

  const handleVariationChange = (variationName: string, value: string) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationName]: value,
    }));
    setQuantity(1); // Reset quantity when variation changes
  };

  const handleAddToCart = () => {
    // For variable products, add variation info to name
    let productName = product.name;
    if (isVariableProduct && Object.keys(selectedVariations).length > 0) {
      const variationText = Object.entries(selectedVariations)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      productName = `${product.name} (${variationText})`;
    }
    
    addToCart({
      id: isVariableProduct && currentSku ? `${product.id}-${currentSku}` : product.id,
      name: productName,
      image: product.images?.[0] || product.thumbnail,
      seller: product.soldBy || `${product.brand} Official`,
      price: finalPrice,
      originalPrice: currentDiscount > 0 ? currentPrice : undefined,
      discount: currentDiscount,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(400px,1fr)_1fr] xl:grid-cols-[minmax(500px,600px)_1fr_280px] gap-4 md:gap-6">
      {/* Left Column - Product Images */}
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
        <ProductGallery
          images={product.images}
          productName={product.name}
        />
        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
          <button
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            className="bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg py-2.5 md:py-3 text-sm md:text-base hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            {currentStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={currentStock === 0}
            className="bg-blue-700 text-white font-semibold rounded-lg py-2.5 md:py-3 text-sm md:text-base hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-700"
          >
            {currentStock === 0 ? 'OUT OF STOCK' : 'Buy Now'}
          </button>
        </div>
      </div>

      {/* Middle Column - Product Details */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-4 md:space-y-5 relative">
        {/* Wishlist & Share */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3 md:gap-4">
          <button className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Add to wishlist">
            <FiHeart size={18} className="md:w-5 md:h-5" />
          </button>
          <button className="flex items-center gap-1.5 md:gap-2 text-gray-600 hover:text-gray-900 text-xs md:text-sm">
            <FiShare2 size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Product Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 pr-20 sm:pr-24 md:pr-32 leading-tight">
          {product.name}
        </h1>

        {/* Review Link */}
        <div>
          <button className="text-blue-600 font-semibold hover:underline">Add Your Review</button>
        </div>

        {/* Brand and Seller */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
          <div>
            Brand:{' '}
            <Link href={`/brand/${product.brandSlug || product.brand.toLowerCase()}`} className="font-semibold text-blue-600 hover:underline">
              {product.brand}
            </Link>
          </div>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <div>
            Sold by:{' '}
            <Link 
              href={`/vendor/${encodeURIComponent((product.soldBy || 'Official Store').toLowerCase().replace(/\s+/g, '-'))}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {product.soldBy || 'Official Store'}
            </Link>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-blue-600">
              ৳ {finalPrice.toLocaleString()}
            </span>
            {currentDiscount > 0 && (
              <>
                <span className="text-base md:text-lg text-gray-400 line-through">
                  ৳ {currentPrice.toLocaleString()}
                </span>
                <span className="text-xs md:text-sm bg-red-500 text-white px-2 py-1 rounded">
                  -{currentDiscountType === 'percent' ? `${currentDiscount}%` : `৳${currentDiscount}`}
                </span>
              </>
            )}
          </div>
          {currentSku && (
            <p className="text-xs text-gray-500">SKU: {currentSku}</p>
          )}
        </div>

        {/* Variations Selector */}
        {variations.length > 0 && (
          <div className="space-y-4">
            {variations.map((variation) => (
              <div key={variation.name} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {variation.name}:
                  <span className="ml-2 text-blue-600">{selectedVariations[variation.name]}</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {variation.values.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleVariationChange(variation.name, value)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium text-sm transition-all ${
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
        {currentStock > 0 ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">
              {currentStock} items in stock
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Quantity:</label>
          <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-4 py-2 hover:bg-gray-100 disabled:opacity-40"
              disabled={quantity <= 1 || currentStock === 0}
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="w-16 px-4 py-2 text-center font-semibold border-x border-gray-200 focus:outline-none"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-4 py-2 hover:bg-gray-100 disabled:opacity-40"
              disabled={quantity >= currentStock || currentStock === 0}
            >
              +
            </button>
          </div>
        </div>

        {/* EMI Information */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">EMIs from:</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">{product.emi}</p>
          </div>
          <button
            onClick={() => setEmiModalOpen(true)}
            className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm flex items-center gap-1 self-start sm:self-auto"
          >
            Know More <span>&gt;</span>
          </button>
        </div>

        {/* Warranty */}
        <div>
          <p className="text-sm text-gray-600">
            Warranty: <span className="text-gray-900 font-medium">{product.warranty}</span>
          </p>
        </div>

        {/* Pickaboo Assured */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <FiShoppingCart className="text-white" size={18} />
          </div>
          <span className="font-semibold text-sm md:text-base text-gray-900">Pickaboo Assured</span>
          <span className="ml-auto text-gray-400">&gt;</span>
        </div>
      </div>

      {/* Right Sidebar - Available Offer */}
      <div className="space-y-4 lg:col-span-2 xl:col-span-1">
        {/* Club Points - Available Offer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
          <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4">Available Offer</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl md:text-2xl">⭐</span>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Earn</p>
              <p className="text-base md:text-lg font-bold text-blue-600">{product.clubPoints} Club Points</p>
            </div>
          </div>
        </div>

        {/* Frequently bought together */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 md:px-5 py-3 md:py-4 border-b text-sm md:text-base font-semibold text-gray-900">
            Frequently bought together
          </div>
          <div className="divide-y">
            {(product.frequentlyBought || []).map((item: any) => (
              <div key={item.id} className="p-3 md:p-4 flex gap-2 md:gap-3 items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                  <div className="text-xs md:text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-1.5 md:gap-2">
                    <span className="font-semibold text-gray-900">৳{item.price.toLocaleString()}</span>
                    <span className="line-through text-gray-400 text-xs">৳{item.originalPrice.toLocaleString()}</span>
                    <span className="text-orange-500 text-xs font-bold">-{item.discount}%</span>
                  </div>
                </div>
                <button className="bg-blue-50 text-blue-600 text-xs md:text-sm font-semibold px-2 md:px-3 py-1 rounded-lg hover:bg-blue-100 flex-shrink-0">
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EMI Modal */}
      <EMIModal
        isOpen={emiModalOpen}
        onClose={() => setEmiModalOpen(false)}
        productPrice={product.price}
      />
    </div>
  );
}

