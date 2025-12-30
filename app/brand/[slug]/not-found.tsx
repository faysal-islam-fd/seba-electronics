import Link from 'next/link';
import { FiTag, FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

export default function BrandNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
            <FiTag className="text-white w-12 h-12 sm:w-16 sm:h-16" />
          </div>
        </div>

        {/* 404 Number */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-3 sm:mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Brand Not Found
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-2">
          Sorry, we couldn't find the brand you're looking for. It may have been removed 
          or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            href="/brands"
            className="group inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <FiSearch size={18} className="sm:w-5 sm:h-5" />
            Browse Brands
          </Link>
          
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <FiHome size={18} className="sm:w-5 sm:h-5" />
            Go Home
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Looking for a specific brand?</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors text-xs sm:text-sm"
          >
            <FiSearch size={16} className="sm:w-[18px] sm:h-[18px]" />
            Search for products by brand
          </Link>
        </div>
      </div>
    </div>
  );
}

