'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const promoDeals = [
  {
    id: 1,
    bgColor: 'from-blue-400 to-blue-600',
    badge: '11.11',
    discount: '50%',
    title: 'ছাড় ৫০%\nডিসকাউন্টে ডিল',
  },
  {
    id: 2,
    bgColor: 'from-green-500 to-green-700',
    badge: '11.11',
    number: '11',
    title: 'টাকা ১১ ভিসা',
  },
  {
    id: 3,
    bgColor: 'from-purple-500 to-purple-700',
    badge: '11.11',
    title: 'UNDER',
    price: '৳999',
    subtitle: '৯৯৯ ভিসা',
  },
  {
    id: 4,
    bgColor: 'from-pink-500 to-pink-700',
    badge: '11.11',
    price: '৳300',
    title: 'বিনামূল্যে মেট্রো\nকার্গো কামাইশর',
  },
  {
    id: 5,
    bgColor: 'from-orange-500 to-orange-700',
    badge: '10%',
    title: 'কার্ড পেমেন্টে\n১০% এক্সট্রা ছাড়',
    subtitle: '৳২০০ পর্যন্ত\nবিশেষ ক্যাশব্যাক',
  },
];

export default function PromoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Scroll left"
      >
        <FiChevronLeft size={24} className="text-gray-700" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {promoDeals.map((deal) => (
          <div
            key={deal.id}
            className="flex-shrink-0 w-[240px] md:w-[260px] h-[160px] md:h-[180px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <div className={`relative w-full h-full bg-gradient-to-br ${deal.bgColor} p-4 md:p-6 flex flex-col justify-between`}>
              {/* Decorative circles */}
              <div className="absolute top-2 right-2 w-16 md:w-20 h-16 md:h-20 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-2 left-2 w-12 md:w-16 h-12 md:h-16 bg-white/10 rounded-full"></div>
              
              {/* Badge */}
              {deal.badge && (
                <div className="inline-block w-fit bg-white text-[10px] md:text-xs font-black px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg">
                  {deal.badge === '11.11' ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {deal.badge}
                    </span>
                  ) : (
                    <span className="text-orange-600">{deal.badge}</span>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 text-white">
                {deal.discount && (
                  <div className="text-4xl md:text-5xl font-black mb-1 md:mb-2">{deal.discount}</div>
                )}
                {deal.number && (
                  <div className="text-5xl md:text-6xl font-black mb-1 md:mb-2">{deal.number}</div>
                )}
                {deal.price && (
                  <div className="text-3xl md:text-4xl font-black mb-1 md:mb-2">{deal.price}</div>
                )}
                <div className="text-sm md:text-base font-bold whitespace-pre-line leading-tight">
                  {deal.title}
                </div>
                {deal.subtitle && (
                  <div className="text-xs md:text-sm font-medium mt-1 opacity-90 whitespace-pre-line">
                    {deal.subtitle}
                  </div>
                )}
              </div>

              {/* Payment Icons (for some cards) */}
              {(deal.id === 4 || deal.id === 5) && (
                <div className="relative z-10 flex gap-1.5 md:gap-2 mt-2">
                  <div className="bg-white rounded px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold">
                    <span className="text-blue-600">VISA</span>
                  </div>
                  <div className="bg-white rounded px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold">
                    <span className="text-orange-600">MC</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Scroll right"
      >
        <FiChevronRight size={24} className="text-gray-700" />
      </button>
    </div>
  );
}

