export default function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative w-full h-36 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br from-gray-200 to-gray-300">
        {/* Badge skeleton */}
        <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 z-10">
          <div className="h-4 sm:h-5 w-12 sm:w-14 bg-gray-400 rounded"></div>
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className="flex-1 flex flex-col gap-1.5 sm:gap-2.5 p-2 sm:p-4">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-3 sm:h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-3 sm:h-4 bg-gray-300 rounded w-4/5"></div>
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-2.5 sm:h-3 w-2.5 sm:w-3 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-2.5 sm:h-3 w-8 sm:w-10 bg-gray-300 rounded"></div>
        </div>

        {/* Price Skeleton */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <div className="flex items-baseline gap-2">
            <div className="h-5 sm:h-6 w-24 sm:w-32 bg-gray-300 rounded"></div>
            <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-300 rounded"></div>
            <div className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-300 rounded"></div>
          </div>
          <div className="h-2.5 sm:h-3 w-28 sm:w-36 bg-gray-300 rounded"></div>
        </div>

        {/* Stock Status Skeleton */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full"></div>
          <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-gray-300 rounded"></div>
        </div>

        {/* Button Skeleton - Desktop */}
        <div className="hidden md:block mt-auto pt-2">
          <div className="h-10 bg-gray-300 rounded-lg"></div>
        </div>
      </div>

      {/* Button Skeleton - Mobile */}
      <div className="md:hidden border-t border-gray-100 px-2.5 sm:px-4 py-2 sm:py-3">
        <div className="h-9 sm:h-10 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
}

