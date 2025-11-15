'use client';

import Image from 'next/image';
import { FiMinus, FiPlus, FiTrash2, FiBookmark } from 'react-icons/fi';

interface CartItemProps {
  id: string;
  name: string;
  image: string;
  seller: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onSaveForLater: (id: string) => void;
}

export default function CartItem({
  id,
  name,
  image,
  seller,
  price,
  originalPrice,
  discount,
  quantity,
  onQuantityChange,
  onRemove,
  onSaveForLater,
}: CartItemProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(id, quantity + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
          {/* Gold Shield Badge */}
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <span>🛡️</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{name}</h3>
            <p className="text-sm text-gray-600 mb-3">Sold by: <span className="font-medium">{seller}</span></p>
            
            {/* Pricing */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-bold text-gray-900">৳ {price.toLocaleString()}</span>
              {originalPrice && (
                <>
                  <span className="text-sm text-gray-500 line-through">৳ {originalPrice.toLocaleString()}</span>
                  {discount && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Quantity Control */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={16} />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
            <button
              onClick={() => onSaveForLater(id)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-gray-300"
            >
              <FiBookmark size={16} />
              <span>Save for later</span>
            </button>
            <button
              onClick={() => onRemove(id)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-300"
            >
              <FiTrash2 size={16} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

