'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useGetSlidersQuery } from '@/app/store/api/slidersApi';

// Skeleton Loader Component
function SliderSkeleton() {
  return (
    <div className="relative w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse overflow-hidden rounded-xl">
      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer-animation bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 opacity-30">
          <div className="w-24 h-24 rounded-full bg-white/40 animate-pulse" />
          <div className="h-4 w-48 bg-white/40 rounded animate-pulse" />
          <div className="h-3 w-32 bg-white/30 rounded animate-pulse" />
        </div>
      </div>
      
      {/* Bottom dots skeleton */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-white/50 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroBanner() {
  const { data: slidersData, isLoading, error } = useGetSlidersQuery();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Transform API data to slides format
  const slides = useMemo(() => {
    if (slidersData?.success && slidersData.data && slidersData.data.length > 0) {
      return slidersData.data.map((slider) => ({
        id: slider.id,
        image: slider.image_url,
        alt: slider.target?.name || `Slider ${slider.id}`,
        href: slider.target 
          ? (slider.type === 'category_id' 
              ? `/category/${slider.target.slug}` 
              : slider.target.slug 
                ? `/${slider.target.slug}` 
                : '#')
          : '#',
      }));
    }
    return [];
  }, [slidersData]);

  useEffect(() => {
    if (isHovered || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Show skeleton while loading or if no slides
  if (isLoading || slides.length === 0) {
    return (
      <div className="relative w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] xl:h-[550px] rounded-xl overflow-hidden">
        <SliderSkeleton />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] xl:h-[550px] rounded-xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <Link
            key={slide.id}
            href={slide.href}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1400px"
              unoptimized
            />
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={18} className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <FiChevronRight size={18} className="sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'bg-white w-8 sm:w-10 h-2 sm:h-2.5 shadow-lg'
                  : 'bg-white/50 w-2 sm:w-2.5 h-2 sm:h-2.5 hover:bg-white/75 hover:w-4 sm:hover:w-6'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 z-20">
          <div
            className="h-full bg-white transition-all duration-5000 ease-linear"
            style={{
              width: isHovered ? '0%' : `${((currentSlide + 1) / slides.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
