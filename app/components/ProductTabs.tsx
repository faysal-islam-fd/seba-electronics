'use client';

import { useState } from 'react';

interface ProductTabsProps {
  description: string;
  specifications: Record<string, string>;
  features: string[];
  warranty: string;
  shipping: string;
}

export default function ProductTabs({ description, specifications, features, warranty, shipping }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Tab Headers */}
      <div className="border-b">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap transition-colors relative text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Product Description</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{description}</p>
            </div>

            {features.length > 0 && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <span className="text-blue-600 mt-1 flex-shrink-0">✓</span>
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-2">Warranty Information</h4>
                <p className="text-xs sm:text-sm text-gray-700">{warranty}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-2">Shipping & Delivery</h4>
                <p className="text-xs sm:text-sm text-gray-700">{shipping}</p>
              </div>
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Technical Specifications</h3>
            <div className="border rounded-lg overflow-hidden">
              {Object.entries(specifications).map(([key, value], index) => (
                <div
                  key={key}
                  className={`grid grid-cols-1 sm:grid-cols-3 p-3 sm:p-4 gap-2 sm:gap-0 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="font-semibold text-sm sm:text-base text-gray-900">{key}</div>
                  <div className="sm:col-span-2 text-sm sm:text-base text-gray-700">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Customer Reviews</h3>
            
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">4.9</div>
                <div className="flex gap-1 mb-2 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg sm:text-xl">★</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Based on 234 reviews</p>
              </div>
              <div className="flex-1 space-y-2 w-full">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-gray-600 w-10 sm:w-12">{star} Star</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${star === 5 ? 75 : star === 4 ? 20 : 5}%` }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 w-10 sm:w-12">{star === 5 ? 175 : star === 4 ? 47 : 12}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((review) => (
                <div key={review} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-gray-900">Customer {review}</div>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm sm:text-base">★</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">2 days ago</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700">
                    Great product! Highly recommended. The quality is excellent and delivery was fast.
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base">
              Write a Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

