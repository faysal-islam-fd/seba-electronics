'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProductCard from '@/app/components/ProductCard';
import Breadcrumb from '@/app/components/Breadcrumb';
import { ProductsResponse, BrandsResponse } from '@/app/lib/api';
import { isProductInStock } from '@/app/utils/stockUtils';
import { FiSearch, FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';

type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

interface SearchPageClientProps {
  initialProducts: ProductsResponse;
  initialBrands: BrandsResponse;
  initialQuery: string;
  initialPage: number;
  initialSort: SortOption;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialBrandId?: number;
}

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

export default function SearchPageClient({
  initialProducts,
  initialBrands,
  initialQuery,
  initialPage,
  initialSort,
  initialMinPrice,
  initialMaxPrice,
  initialBrandId,
}: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialMinPrice || 0,
    initialMaxPrice || 300000
  ]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>(initialBrandId);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState({
    price: false,
    brand: false,
  });

  const products = initialProducts.data || [];
  const meta = initialProducts.meta;
  const brands = initialBrands.data || [];

  const updateURL = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 0 || value === 300000) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      updateURL({ q: searchInput.trim(), page: 1 });
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    updateURL({ sort: newSort, page: 1 });
  };

  const handleBrandChange = (brandId: number) => {
    const newBrandId = selectedBrandId === brandId ? undefined : brandId;
    setSelectedBrandId(newBrandId);
    updateURL({ brand_id: newBrandId, page: 1 });
  };

  const handlePriceChange = () => {
    updateURL({
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 300000 ? priceRange[1] : undefined,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage });
  };

  const clearFilters = () => {
    setPriceRange([0, 300000]);
    setSelectedBrandId(undefined);
    setSortBy('latest');
    router.push(`/search?q=${searchInput}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="hidden md:block mb-4">
          <Breadcrumb
            items={[
              { label: 'Search', href: initialQuery ? `/search?q=${encodeURIComponent(initialQuery)}` : '/search' },
              ...(initialQuery ? [{ label: initialQuery }] : []),
            ]}
          />
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Search</span>
              <FiSearch className="sm:hidden" size={18} />
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm sticky top-20">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Filters</h3>
                {(selectedBrandId || priceRange[0] > 0 || priceRange[1] < 300000) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Price Filter */}
              <FilterSection
                title="Price Range"
                isOpen={filtersOpen.price}
                onToggle={() => setFiltersOpen(prev => ({ ...prev, price: !prev.price }))}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <button
                    onClick={handlePriceChange}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    Apply
                  </button>
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
                    <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrandId === brand.id}
                        onChange={() => handleBrandChange(brand.id)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {initialQuery ? `Search Results for "${initialQuery}"` : 'All Products'}
                </h2>
                {meta && (
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {((meta.current_page - 1) * meta.per_page) + 1} - {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} products
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <FiFilter size={16} />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">Latest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FiSearch size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id.toString()}
                      name={product.title}
                      price={product.final_price}
                      originalPrice={product.price !== product.final_price ? product.price : undefined}
                      image={product.thumbnail}
                      discount={product.discount_percentage ? Math.round(product.discount_percentage) : undefined}
                      badge={product.is_featured ? 'Featured' : undefined}
                      rating={4.5}
                      inStock={isProductInStock(product.stock, product.is_out_of_stock)}
                      type={product.type || 'simple'}
                      shipping_in_dhaka={product.shipping_in_dhaka}
                      shipping_outside_dhaka={product.shipping_outside_dhaka}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                  <div className="flex items-center justify-center gap-2 bg-white rounded-lg shadow-sm p-4">
                    <button
                      onClick={() => handlePageChange(Math.max(1, initialPage - 1))}
                      disabled={initialPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {[...Array(Math.min(5, meta.last_page))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium ${initialPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(meta.last_page, initialPage + 1))}
                      disabled={initialPage === meta.last_page}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <FiChevronDown size={24} className="rotate-180" />
              </button>
            </div>

            <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


