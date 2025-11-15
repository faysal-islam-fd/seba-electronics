'use client';

import Link from 'next/link';
import CategoryCard from './CategoryCard';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useRef } from 'react';

interface Category {
  name: string;
  image: string;
  description: string;
  href: string;
}

interface CategoryCardSectionProps {
  title: string;
  categories: Category[];
  viewAllLink?: string;
}

export default function CategoryCardSection({
  title,
  categories,
  viewAllLink = '#',
}: CategoryCardSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          href={viewAllLink}
          className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm"
        >
          View All
        </Link>
      </div>

      {/* Categories Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Scroll left"
        >
          <FiArrowLeft size={20} className="text-gray-600" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-12"
        >
          {categories.map((category, index) => (
            <div key={index} className="flex-shrink-0 w-64">
              <CategoryCard {...category} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Scroll right"
        >
          <FiArrowRight size={20} className="text-gray-600" />
        </button>
      </div>
    </section>
  );
}

