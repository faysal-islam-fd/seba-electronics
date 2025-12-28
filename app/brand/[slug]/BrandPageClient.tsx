'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ProductCard from '@/app/components/ProductCard';
import Breadcrumb from '@/app/components/Breadcrumb';
import { ProductsResponse, CategoriesResponse, Brand } from '@/app/lib/api';
import { isProductInStock } from '@/app/utils/stockUtils';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';
import Image from 'next/image';

type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

interface BrandPageClientProps {
  currentBrand: Brand;
  initialProducts: ProductsResponse;
  initialCategories: CategoriesResponse;
  initialPage: number;
  initialSort: SortOption;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialCategoryId?: number;
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

export default function BrandPageClient({
  currentBrand,
  initialProducts,
  initialCategories,
  initialPage,
  initialSort,
  initialMinPrice,
  initialMaxPrice,
  initialCategoryId,
}: BrandPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialMinPrice || 0,
    initialMaxPrice || 300000
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(initialCategoryId);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [filtersOpen, setFiltersOpen] = useState({
    price: false,
    categories: false,
  });

  const products = initialProducts.data || [];
  const meta = initialProducts.meta;
  const categories = initialCategories.data || [];

  const updateURL = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 0 || value === 300000) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    
    router.push(`/brand/${currentBrand.slug}?${params.toString()}`);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    updateURL({ sort: newSort, page: 1 });
  };

  const handleCategoryChange = (categoryId: number) => {
    const newCategoryId = selectedCategoryId === categoryId ? undefined : categoryId;
    setSelectedCategoryId(newCategoryId);
    updateURL({ category_id: newCategoryId, page: 1 });
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
    setSelectedCategoryId(undefined);
    setSortBy('latest');
    router.push(`/brand/${currentBrand.slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb 
            items={[
              { label: 'Brands', href: '/brands' },
              { label: currentBrand.name },
            ]}
          />
        </div>

        {/* Brand Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            {currentBrand.logo ? (
              <div className="w-20 h-20 relative bg-white rounded-xl border border-gray-200 p-2 flex-shrink-0">
                <Image
                  src={currentBrand.logo}
                  alt={currentBrand.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-3xl text-white shadow-lg flex-shrink-0">
                {currentBrand.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{currentBrand.name}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {meta ? `${meta.total} products available` : 'Loading products...'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm sticky top-20">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Filters</h3>
                {(selectedCategoryId || priceRange[0] > 0 || priceRange[1] < 300000) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories Filter */}
              {categories.length > 0 && (
                <FilterSection
                  title="Categories"
                  isOpen={filtersOpen.categories}
                  onToggle={() => setFiltersOpen(prev => ({ ...prev, categories: !prev.categories }))}
                >
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategoryId === cat.id}
                          onChange={() => handleCategoryChange(cat.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              )}

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
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                {meta && (
                  <p className="text-sm text-gray-600">
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
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">No products available for this brand yet.</p>
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
                            className={`w-10 h-10 rounded-lg text-sm font-medium ${
                              initialPage === page
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

