'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import Breadcrumb from '@/app/components/Breadcrumb';
import { 
  featuredProducts, 
  desktopProducts, 
  monitorProducts, 
  accessoriesProducts, 
  smartphoneProducts, 
  cameraProducts, 
  gadgetProducts 
} from '@/app/data/dummyData';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Combine all products
const allProducts = [
  ...featuredProducts,
  ...desktopProducts,
  ...monitorProducts,
  ...accessoriesProducts,
  ...smartphoneProducts,
  ...cameraProducts,
  ...gadgetProducts,
];

// Category mapping
const categoryMap: Record<string, { name: string; icon: string; products: typeof allProducts }> = {
  'smartphones': {
    name: 'Smartphones',
    icon: '📱',
    products: smartphoneProducts,
  },
  'computers': {
    name: 'Computers',
    icon: '💻',
    products: [...featuredProducts, ...desktopProducts],
  },
  'computer-accessories': {
    name: 'Computer Accessories',
    icon: '⌨️',
    products: [...accessoriesProducts, ...monitorProducts],
  },
  'electronics': {
    name: 'Electronics & Appliances',
    icon: '🔌',
    products: [...desktopProducts, ...monitorProducts, ...accessoriesProducts],
  },
  'television': {
    name: 'Television',
    icon: '📺',
    products: monitorProducts,
  },
  'washing-machine': {
    name: 'Washing Machine',
    icon: '🧺',
    products: [...desktopProducts, ...monitorProducts].slice(0, 8),
  },
  'mobile-accessories': {
    name: 'Mobile Accessories',
    icon: '🎧',
    products: accessoriesProducts,
  },
  'lifestyle': {
    name: 'Lifestyle',
    icon: '⌚',
    products: gadgetProducts,
  },
};

// Get unique brands from products
const getBrands = (products: typeof allProducts) => {
  const brands = new Set<string>();
  products.forEach(product => {
    const brand = product.name.split(' ')[0];
    if (brand) brands.add(brand);
  });
  return Array.from(brands).sort();
};

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm">{title}</span>
        {isOpen ? (
          <FiChevronUp size={18} className="text-gray-500" />
        ) : (
          <FiChevronDown size={18} className="text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

function CategoryPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const slug = (params?.slug as string) || '';
  
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedDisplaySize, setSelectedDisplaySize] = useState<string[]>([]);
  const [selectedRAM, setSelectedRAM] = useState<string[]>([]);
  const [selectedProcessor, setSelectedProcessor] = useState<string[]>([]);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  
  // Filter section open/close states - All closed by default
  const [filtersOpen, setFiltersOpen] = useState({
    price: false,
    brand: false,
    displaySize: false,
    ram: false,
    processor: false,
    expressDelivery: false,
    color: false,
  });

  const normalizedCategory = slug.toLowerCase().trim();
  const category = categoryMap[normalizedCategory] || {
    name: slug || 'All Products',
    icon: '📦',
    products: allProducts,
  };

  const brands = getBrands(category.products);

  // Filter products - Show ALL products for the category (no subcategory filtering)
  const filteredProducts = useMemo(() => {
    let filtered = category.products;

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => {
        const productBrand = product.name.split(' ')[0];
        return selectedBrands.includes(productBrand);
      });
    }

    // Express delivery filter (just show in stock items)
    if (expressDelivery) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    return sorted;
  }, [category.products, sortBy, priceRange, selectedBrands, expressDelivery]);

  const maxPrice = Math.max(...category.products.map(p => p.price), 300000);
  const minPrice = Math.min(...category.products.map(p => p.price), 0);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb - Hidden on mobile */}
        <div className="hidden md:block mb-4">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Categories', href: '/categories' },
              { label: category.name },
            ]}
          />
        </div>

        <div className="flex gap-4 sm:gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm sticky top-24">
              {/* Price Filter */}
              <FilterSection
                title="Price"
                isOpen={filtersOpen.price}
                onToggle={() => setFiltersOpen(prev => ({ ...prev, price: !prev.price }))}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      min={minPrice}
                      max={maxPrice}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      min={minPrice}
                      max={maxPrice}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </FilterSection>

              {/* Brand Filter */}
              <FilterSection
                title="Brand"
                isOpen={filtersOpen.brand}
                onToggle={() => setFiltersOpen(prev => ({ ...prev, brand: !prev.brand }))}
              >
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Display Size Filter */}
              <FilterSection
                title="Display Size (Inches)"
                isOpen={filtersOpen.displaySize}
                onToggle={() => setFiltersOpen(prev => ({ ...prev, displaySize: !prev.displaySize }))}
              >
                <div className="space-y-2">
                  {['13', '14', '15', '16', '17', '24', '27', '32'].map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDisplaySize.includes(size)}
                        onChange={() => setSelectedDisplaySize(prev =>
                          prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                        )}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{size}"</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* RAM Filter */}
              <FilterSection
                title="RAM(GB)"
                isOpen={filtersOpen.ram}
                onToggle={() => setFiltersOpen(prev => ({ ...prev, ram: !prev.ram }))}
              >
                <div className="space-y-2">
                  {['4', '8', '16', '32'].map((ram) => (
                    <label key={ram} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRAM.includes(ram)}
                        onChange={() => setSelectedRAM(prev =>
                          prev.includes(ram) ? prev.filter(r => r !== ram) : [...prev, ram]
                        )}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{ram}GB</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Processor Filter */}
              <FilterSection
                title="Processor"
                isOpen={filtersOpen.processor}
                onToggle={() => setFiltersOpen(prev => ({ ...prev, processor: !prev.processor }))}
              >
                <div className="space-y-2">
                  {['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7', 'M1', 'M2'].map((processor) => (
                    <label key={processor} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProcessor.includes(processor)}
                        onChange={() => setSelectedProcessor(prev =>
                          prev.includes(processor) ? prev.filter(p => p !== processor) : [...prev, processor]
                        )}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{processor}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Express Delivery Filter */}
              <FilterSection
                title="Express Delivery"
                isOpen={filtersOpen.expressDelivery}
                onToggle={() => setFiltersOpen(prev => ({ ...prev, expressDelivery: !prev.expressDelivery }))}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expressDelivery}
                    onChange={(e) => setExpressDelivery(e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Express Delivery Available</span>
                </label>
              </FilterSection>

              {/* Color Filter */}
              <FilterSection
                title="Color"
                isOpen={filtersOpen.color}
                onToggle={() => setFiltersOpen(prev => ({ ...prev, color: !prev.color }))}
              >
                <div className="space-y-2">
                  {['Black', 'White', 'Silver', 'Blue', 'Red', 'Gold'].map((color) => (
                    <label key={color} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => setSelectedColors(prev =>
                          prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
                        )}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{color}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Sort Dropdown */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer pr-8"
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-low">Sort by: Price Low to High</option>
                  <option value="price-high">Sort by: Price High to Low</option>
                  <option value="rating">Sort by: Rating</option>
                  <option value="newest">Sort by: Newest</option>
                </select>
                <FiChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  discount={product.discount}
                  badge={product.badge || 'OFFICIAL WARRANTY'}
                  rating={product.rating}
                  inStock={product.inStock}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors"
                  >
                    &lt;
                  </button>
                )}
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors"
                  >
                    &gt;
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}

