'use client';

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';

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
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
      {/* Thumbnail Gallery - Horizontal on mobile, Vertical on desktop */}
      {images.length > 1 && (
        <div className="flex sm:flex-col gap-2 sm:gap-3 w-full sm:w-20 md:w-24 lg:w-28 flex-shrink-0 overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                index === selectedImage
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
              style={{ minWidth: '60px' }}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-contain p-1.5 sm:p-2"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="flex-1 relative min-w-0">
        <div className="relative bg-white rounded-xl border border-gray-200">
          {/* Main Image with Zoom - Only on desktop */}
          <div
            ref={imageRef}
            className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] cursor-crosshair overflow-hidden rounded-xl bg-white"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={images[selectedImage]}
              alt={`${productName} - Image ${selectedImage + 1}`}
              fill
              className="object-contain p-2 sm:p-4"
              priority
              unoptimized
            />

            {/* Zoom Overlay - Blue magnifying box - Only on desktop */}
            {showZoom && (
              <div className="hidden md:block absolute inset-0 pointer-events-none">
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
        </div>

        {/* Zoomed Image Preview - Appears on hover OUTSIDE the main container - Only on XL screens */}
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

      </div>
    </div>
  );
}

