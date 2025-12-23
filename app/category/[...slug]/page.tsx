'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import Breadcrumb from '@/app/components/Breadcrumb';
import { useGetProductsQuery } from '@/app/store/api/productsApi';
import { useGetCategoriesQuery } from '@/app/store/api/categoriesApi';
import { useGetBrandsQuery } from '@/app/store/api/brandsApi';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';

type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

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
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [filtersOpen, setFiltersOpen] = useState({
    price: false,
    brand: false,
    subcategories: false,
  });

  // Fetch categories to find the current category
  const { data: categoriesData } = useGetCategoriesQuery({ with_children: true });
  
  // Find current category by slug
  const currentCategory = categoriesData?.data?.find(cat => cat.slug === slug);
  
  // Fetch products for this category
  const { data: productsData, isLoading: isLoadingProducts, error: productsError } = useGetProductsQuery({
    page: currentPage,
    per_page: 20,
    category_id: selectedCategoryId || currentCategory?.id,
    min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
    max_price: priceRange[1] < 300000 ? priceRange[1] : undefined,
    brand_id: selectedBrandId,
    sort: sortBy,
  });

  // Fetch brands for filter
  const { data: brandsData } = useGetBrandsQuery();

  // Update selected category when slug changes
  useEffect(() => {
    if (currentCategory) {
      setSelectedCategoryId(currentCategory.id);
    }
  }, [currentCategory]);

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleBrandChange = (brandId: number) => {
    setSelectedBrandId(selectedBrandId === brandId ? undefined : brandId);
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (categoryId: number) => {
    setSelectedCategoryId(selectedCategoryId === categoryId ? currentCategory?.id : categoryId);
    setCurrentPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setPriceRange([0, 300000]);
    setSelectedBrandId(undefined);
    setSelectedCategoryId(currentCategory?.id);
    setSortBy('latest');
    setCurrentPage(1);
  };

  const products = productsData?.data || [];
  const meta = productsData?.meta;
  const brands = brandsData?.data || [];
  const subcategories = currentCategory?.children || [];

  // Show loading while finding category
  if (!currentCategory && categoriesData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Category not found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: currentCategory?.name || 'Category', href: `/category/${slug}` },
            ]}
          />
        </div>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3">
            {currentCategory && (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-3xl text-white shadow-lg">
                  {currentCategory.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{currentCategory.name}</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {meta ? `${meta.total} products available` : 'Loading products...'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm sticky top-20">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Filters</h3>
                {(selectedBrandId || priceRange[0] > 0 || priceRange[1] < 300000 || selectedCategoryId !== currentCategory?.id) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Subcategories Filter */}
              {subcategories.length > 0 && (
                <FilterSection
                  title="Subcategories"
                  isOpen={filtersOpen.subcategories}
                  onToggle={() => setFiltersOpen(prev => ({ ...prev, subcategories: !prev.subcategories }))}
                >
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {subcategories.map((subcat) => (
                      <label key={subcat.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategoryId === subcat.id}
                          onChange={() => handleSubcategoryChange(subcat.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{subcat.name}</span>
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
                      onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden h-96 animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : productsError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <p className="text-red-600 font-medium">Failed to load products. Please try again later.</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Clear Filters
                </button>
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
                      inStock={!product.is_out_of_stock}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                  <div className="flex items-center justify-center gap-2 bg-white rounded-lg shadow-sm p-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
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
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium ${
                              currentPage === page
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
                      onClick={() => setCurrentPage(prev => Math.min(meta.last_page, prev + 1))}
                      disabled={currentPage === meta.last_page}
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

            <div className="p-4">
              <div className="space-y-4">
                {(selectedBrandId || priceRange[0] > 0 || priceRange[1] < 300000) && (
                  <button
                    onClick={() => {
                      clearFilters();
                      setShowMobileFilters(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
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

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}

