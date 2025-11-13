'use client';

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { FiHeart } from 'react-icons/fi';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  return (
    <div className="flex gap-4">
      {/* Thumbnail Gallery - Left Side Vertical */}
      {images.length > 1 && (
        <div className="flex flex-col gap-3 w-20 md:w-24">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                index === selectedImage
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="flex-1 relative">
        <div className="relative bg-gray-50 rounded-lg border border-gray-200">
          {/* Wishlist Button */}
          <button className="absolute top-4 right-4 z-10 bg-white rounded-full p-2.5 shadow-md hover:bg-red-50 transition-colors group">
            <FiHeart className="text-gray-600 group-hover:text-red-500" size={20} />
          </button>

          {/* Main Image with Zoom */}
          <div
            ref={imageRef}
            className="relative aspect-square cursor-crosshair overflow-hidden rounded-lg"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={images[selectedImage]}
              alt={`${productName} - Image ${selectedImage + 1}`}
              fill
              className="object-contain p-8"
              priority
              unoptimized
            />

            {/* Zoom Overlay - Blue magnifying box */}
            {showZoom && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute w-32 h-32 border-2 border-blue-500 bg-white/20 backdrop-blur-[2px]"
                  style={{
                    left: `${zoomPosition.x}%`,
                    top: `${zoomPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
            )}
          </div>

          {/* Image Counter Badge */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
            {selectedImage + 1} / {images.length}
          </div>
        </div>

        {/* Zoomed Image Preview - Appears on hover OUTSIDE the main container */}
        {showZoom && (
          <div className="hidden xl:block absolute left-full top-0 ml-4 w-[400px] h-[400px] bg-white border-2 border-gray-300 rounded-lg shadow-xl overflow-hidden z-[100]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${images[selectedImage]})`,
                backgroundSize: '200%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        )}

        {/* Image Navigation Dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === selectedImage
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

