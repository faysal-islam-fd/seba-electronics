'use client';

import { useState } from 'react';
import ProductGallery from '@/app/components/ProductGallery';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { FiStar } from 'react-icons/fi';
import Image from 'next/image';

interface ProductDetailContentProps {
  product: any;
}

export default function ProductDetailContent({ product }: ProductDetailContentProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Default');
  const { addToCart } = useCart();
  const router = useRouter();

  const handleQuantityChange = (value: number) => {
    if (value < 1 || value > product.stockCount) return;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.images?.[0],
      seller: product.soldBy || `${product.brand} Official`,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.75fr)_minmax(260px,0.85fr)] gap-6">
      {/* Main Presentation */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1fr)] gap-6">
          {/* Gallery + CTA */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.name}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                className="bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg py-3 hover:bg-blue-50 transition-colors"
              >
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-blue-700 text-white font-semibold rounded-lg py-3 hover:bg-blue-800 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {/* Ratings */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                <FiStar className="fill-current" size={16} />
                <span className="font-semibold">{product.rating}</span>
              </div>
              <span className="text-gray-600">({product.reviewCount} Ratings)</span>
              <span className="text-gray-300">|</span>
              <button className="text-blue-600 font-semibold">Add Your Review</button>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-blue-600">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600">
                EMIs from <span className="font-semibold text-gray-900">{product.emi}</span>
              </div>
            </div>

            {/* Brand and seller */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
              <div>
                Brand:{' '}
                <span className="font-semibold text-gray-900">{product.brand}</span>
              </div>
              <div>
                Sold by:{' '}
                <span className="font-semibold text-gray-900">{product.soldBy || 'Official Store'}</span>
              </div>
            </div>

            {/* Color selector */}
            {product.colors && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Color</p>
                <div className="flex gap-3">
                  {product.colors.map((color: any) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`border rounded-lg p-2 transition-all ${
                        selectedColor === color.name ? 'border-blue-600' : 'border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <Image
                        src={color.image}
                        alt={color.name}
                        width={56}
                        height={56}
                        className="rounded-md object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Quantity</p>
              <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-4 py-2 hover:bg-gray-100 disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 disabled:opacity-40"
                  disabled={quantity >= product.stockCount}
                >
                  +
                </button>
              </div>
            </div>

            {/* Warranty & EMI */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Warranty: <span className="text-gray-900 font-medium">{product.warranty}</span>
              </p>
              <p className="text-sm text-gray-600">
                Delivery: <span className="text-gray-900 font-medium">{product.shipping}</span>
              </p>
            </div>

            {/* Assurance badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border rounded-lg p-3 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Pickaboo Assured</p>
                <p>100% genuine products from authorized sellers</p>
              </div>
              <div className="border rounded-lg p-3 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Express Delivery</p>
                <p>Get GUARANTEED delivery by tomorrow with Express</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Club points */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              CP
            </div>
            <div>
              <p className="text-sm text-gray-600">Club Points</p>
              <p className="text-lg font-bold text-blue-600">Earn {product.clubPoints} Points</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Collect club points on every purchase and redeem exciting rewards.
          </p>
        </div>

        {/* Frequently bought together */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-5 py-4 border-b text-base font-semibold text-gray-900">
            Frequently bought together
          </div>
          <div className="divide-y">
            {(product.frequentlyBought || []).map((item: any) => (
              <div key={item.id} className="p-4 flex gap-3 items-center">
                <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <span className="font-semibold text-gray-900">৳{item.price.toLocaleString()}</span>
                    <span className="line-through text-gray-400 text-xs">৳{item.originalPrice.toLocaleString()}</span>
                    <span className="text-orange-500 text-xs font-bold">-{item.discount}%</span>
                  </div>
                </div>
                <button className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-lg hover:bg-blue-100">
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

