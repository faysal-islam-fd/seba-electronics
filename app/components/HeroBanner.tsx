'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const heroSlides = [
  {
    id: 1,
    bgColor: 'from-red-900 to-red-700',
    badge: '11.11\nBIG SALE',
    title: 'SMARTPHONES',
    subtitle: 'SAVE UP TO',
    price: 'Tk.16,000',
    delivery: 'FREE\nDELIVERY',
    images: [
      'https://images.unsplash.com/photo-1592286927505-53369c45188e',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
    ],
    sponsored: true,
  },
  {
    id: 2,
    bgColor: 'from-blue-900 to-blue-700',
    badge: 'MEGA\nSALE',
    title: 'LAPTOPS',
    subtitle: 'DISCOUNT UP TO',
    price: 'Tk.25,000',
    delivery: 'FREE\nDELIVERY',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
    ],
    sponsored: true,
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div className="relative w-full h-[350px] md:h-[420px] lg:h-[480px] rounded-lg overflow-hidden">
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor}`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-white rotate-45"></div>
        </div>
      </div>

      {/* Sponsored Badge */}
      {slide.sponsored && (
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 z-10">
          <span className="text-yellow-300">⭐</span> Sponsored
        </div>
      )}

      {/* Main Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Side - Text Content */}
            <div className="flex-1 text-white space-y-3 md:space-y-5 text-center md:text-left">
              {/* Badge */}
              <div className="inline-block bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg">
                <div className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight whitespace-pre-line">
                  {slide.badge}
                </div>
              </div>

              {/* Title */}
              <div>
                <div className="text-xs md:text-base lg:text-lg font-medium mb-1 md:mb-2">on</div>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tight drop-shadow-lg">
                  {slide.title}
                </h1>
              </div>

              {/* Price Section */}
              <div className="space-y-1 md:space-y-2">
                <div className="text-sm md:text-lg lg:text-xl font-semibold">{slide.subtitle}</div>
                <div className="bg-yellow-400 text-black inline-block px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg">
                  <div className="text-xl md:text-3xl lg:text-4xl font-black">{slide.price}</div>
                </div>
              </div>

              {/* Free Delivery Badge */}
              <div className="inline-block bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg">
                <div className="text-base md:text-xl lg:text-2xl font-black whitespace-pre-line leading-tight">
                  {slide.delivery}
                </div>
              </div>

              {/* Payment & Warranty Icons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 mt-2 md:mt-4">
                <div className="bg-blue-600 text-white px-2.5 py-1.5 md:px-3 md:py-1.5 rounded text-[10px] md:text-xs font-bold">
                  10% OFF with VISA
                </div>
                <div className="bg-white text-green-600 px-2.5 py-1.5 md:px-3 md:py-1.5 rounded text-[10px] md:text-xs font-bold flex items-center gap-1">
                  <span>✓</span> OFFICIAL WARRANTY
                </div>
              </div>
            </div>

            {/* Right Side - Product Images */}
            <div className="hidden md:flex flex-1 relative h-[300px] lg:h-[350px] w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                {slide.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`absolute transition-all duration-500 ${
                      idx === 0 ? 'z-30 scale-110' : 
                      idx === 1 ? 'z-20 -translate-x-20 lg:-translate-x-28 scale-95 opacity-80' : 
                      idx === 2 ? 'z-20 translate-x-20 lg:translate-x-28 scale-95 opacity-80' : 
                      idx === 3 ? 'z-10 -translate-x-40 lg:-translate-x-56 scale-85 opacity-60' : 
                      'z-10 translate-x-40 lg:translate-x-56 scale-85 opacity-60'
                    }`}
                    style={{
                      width: '140px',
                      height: '200px',
                    }}
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                      <Image
                        src={`${img}?w=140&h=200&fit=crop`}
                        alt={`Product ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

