'use client';

import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiMenu, FiChevronRight, FiUser, FiChevronDown, FiX, FiHeart } from 'react-icons/fi';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useGetCategoriesQuery } from '@/app/store/api/categoriesApi';
import { useGetProductsQuery } from '@/app/store/api/productsApi';
import { useGetWishlistQuery } from '@/app/store/api/wishlistApi';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

// Icon mapping for categories
const getCategoryIcon = (name: string) => {
  const iconMap: Record<string, string> = {
    'smartphones': '📱',
    'electronics': '🔌',
    'television': '📺',
    'washing': '🧺',
    'mobile': '🎧',
    'computers': '💻',
    'computer': '⌨️',
    'accessories': '🎧',
    'lifestyle': '⌚',
    'gaming': '🎮',
    'audio': '🔊',
    'camera': '📷',
    'appliances': '🏠',
  };
  
  const nameLower = name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (nameLower.includes(key)) return icon;
  }
  return '📦'; // Default icon
};

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileProfileDropdownOpen, setMobileProfileDropdownOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const { getCartCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const cartItemCount = getCartCount();
  
  // Get wishlist count
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isLoggedIn });
  const wishlistCount = wishlistData?.data?.length || 0;

  // Fetch categories from API
  const { data: categoriesData } = useGetCategoriesQuery({ with_children: true });
  const categories = categoriesData?.data || [];

  // Fetch products for search suggestions
  const { data: productsData } = useGetProductsQuery({ per_page: 50 });
  const allProducts = productsData?.data || [];

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !allProducts.length) return [];
    return allProducts
      .filter((product) => product.title.toLowerCase().includes(q))
      .slice(0, 8)
      .map(product => ({
        id: product.id.toString(),
        name: product.title,
        price: product.final_price,
      }));
  }, [searchQuery, allProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-[9998]">
      <div className="bg-blue-600">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 lg:flex-none">
                <div className="relative hidden lg:block">
                  <div
                    onMouseEnter={() => setCategoriesOpen(true)}
                    onMouseLeave={() => {
                      setCategoriesOpen(false);
                      setHoveredCategory(null);
                    }}
                    className="relative"
                  >
                    <button
                      className="flex items-center gap-2 text-white px-3 py-2.5 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                      aria-label="Categories"
                    >
                      <FiMenu size={25} />
                    </button>

                    {categoriesOpen && (
                      <>
                        <div
                          className="absolute left-0 top-full w-64 h-6 z-[10001]"
                          onMouseEnter={() => setCategoriesOpen(true)}
                        />
                        <div
                          className="absolute left-0 top-full mt-3"
                          onMouseEnter={() => setCategoriesOpen(true)}
                          onMouseLeave={() => {
                            setCategoriesOpen(false);
                            setHoveredCategory(null);
                          }}
                        >
                          <div className="w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] overflow-visible">
                            <div className="divide-y divide-gray-100">
                              {categories.map((category) => (
                                <div
                                  key={category.id}
                                  className="relative"
                                  onMouseEnter={() => setHoveredCategory(category.name)}
                                >
                                  <Link
                                    href={`/category/${category.slug}`}
                                    className="flex items-center justify-between px-4 py-3.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl transition-transform duration-200 group-hover:scale-110">
                                        {getCategoryIcon(category.name)}
                                      </span>
                                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                      </span>
                                    </div>
                                    <FiChevronRight
                                      className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200"
                                      size={16}
                                    />
                                  </Link>

                                  {hoveredCategory === category.name && category.children && category.children.length > 0 && (
                                    <>
                                      <div
                                        className="absolute left-full top-0 w-4 h-full z-[10001] -ml-2"
                                        onMouseEnter={() => setHoveredCategory(category.name)}
                                      />
                                      <div
                                        className="absolute left-full top-0 ml-2 w-[520px] bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-[10000]"
                                        onMouseEnter={() => setHoveredCategory(category.name)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                      >
                                        <div className="grid grid-cols-2 gap-6">
                                          {category.children.map((subcategory) => (
                                            <div key={subcategory.id} className="space-y-2">
                                              <Link
                                                href={`/category/${subcategory.slug}`}
                                                className="font-bold text-sm text-gray-900 mb-3 pb-2 border-b border-gray-200 block hover:text-blue-600 transition-colors"
                                              >
                                                {subcategory.name}
                                              </Link>
                                              {subcategory.children && subcategory.children.length > 0 && (
                                              <ul className="space-y-1.5">
                                                  {subcategory.children.map((item) => (
                                                    <li key={item.id}>
                                                    <Link
                                                        href={`/category/${item.slug}`}
                                                      className="text-sm text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all block"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white hover:text-gray-200 transition-colors lg:hidden p-1"
                  aria-label="Toggle menu"
                >
                  <FiMenu size={20} className="sm:w-6 sm:h-6" />
                </button>

                <Link href="/" className="flex-shrink-0">
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white lowercase">
                    Sheba
                  </div>
                </Link>
              </div>

              {/* Desktop search bar */}
              <div className="hidden lg:flex flex-1 max-w-3xl mx-4">
                <div className="relative w-full">
                  <form className="relative w-full" onSubmit={handleSearch}>
                    <FiSearch
                      size={16}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => suggestions.length && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      placeholder="Search for products, brands and more"
                      className="w-full bg-white text-gray-900 placeholder:text-gray-500 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5 pl-9 sm:pl-11 pr-10 sm:pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Search"
                    >
                      <FiSearch size={16} className="text-gray-600" />
                    </button>
                  </form>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-[10002] max-h-80 overflow-y-auto">
                      <ul className="py-2">
                        {suggestions.map((product) => (
                          <li key={product.id}>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setShowSuggestions(false);
                                setSearchQuery(product.name);
                                router.push(`/product/${product.id}`);
                              }}
                              className="w-full flex items-start gap-3 px-3 sm:px-4 py-2.5 hover:bg-gray-50 text-left"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  ৳{product.price?.toLocaleString('en-BD') ?? ''}
                                </p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      onBlur={() => setTimeout(() => setAccountDropdownOpen(false), 200)}
                      className="flex items-center gap-2 text-white hover:text-gray-100 transition-colors"
                    >
                      <div className="bg-white rounded-full p-1.5">
                        <FiUser className="text-blue-600" size={20} />
                      </div>
                      <span className="font-medium">{user?.name || 'My Account'}</span>
                      <FiChevronDown size={16} />
                    </button>

                    {accountDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[10001]">
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/account/wishlist"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          <FiHeart size={14} />
                          My Wishlist
                        </Link>
                        <Link
                          href="/account/reviews"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          My Reviews
                        </Link>
                        <div className="border-t border-gray-200 my-1" />
                        <button
                          onClick={async () => {
                            setAccountDropdownOpen(false);
                            await logout();
                            router.push('/');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all px-6 py-2 rounded-lg font-semibold"
                  >
                    Login
                  </Link>
                )}

                {isLoggedIn && (
                  <Link href="/account/wishlist" className="text-white hover:text-gray-200 transition-colors relative">
                    <FiHeart size={25} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link href="/cart" className="text-white hover:text-gray-200 transition-colors relative">
                  <FiShoppingCart size={25} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setMobileProfileDropdownOpen(!mobileProfileDropdownOpen)}
                      className="text-white hover:text-gray-200 transition-colors relative"
                      aria-label="Account"
                    >
                      <div className="bg-white/20 border border-white/30 rounded-full p-1.5 sm:p-2">
                        <FiUser size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                    </button>
                    {mobileProfileDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[10001] lg:hidden"
                          onClick={() => setMobileProfileDropdownOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[10002]">
                          <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-xs text-gray-500 mb-0.5">Logged in as</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.name || user?.email || 'My Account'}
                            </p>
                          </div>
                          <Link
                            href="/account"
                            onClick={() => setMobileProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiUser size={18} className="text-gray-500" />
                            My Account
                          </Link>
                          <Link
                            href="/account/orders"
                            onClick={() => setMobileProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiShoppingCart size={18} className="text-gray-500" />
                            My Orders
                          </Link>
                          <Link
                            href="/account/wishlist"
                            onClick={() => setMobileProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiHeart size={18} className="text-gray-500" />
                            My Wishlist
                            {wishlistCount > 0 && (
                              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                                {wishlistCount > 99 ? '99+' : wishlistCount}
                              </span>
                            )}
                          </Link>
                          <Link
                            href="/account/reviews"
                            onClick={() => setMobileProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiUser size={18} className="text-gray-500" />
                            My Reviews
                          </Link>
                          <div className="border-t border-gray-200 my-1" />
                          <button
                            onClick={async () => {
                              setMobileProfileDropdownOpen(false);
                              await logout();
                              router.push('/');
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                          >
                            <FiX size={18} />
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-white hover:text-gray-200 transition-colors"
                    aria-label="Login"
                  >
                    <div className="bg-white/20 border border-white/30 rounded-full p-1.5 sm:p-2">
                      <FiUser size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                  </Link>
                )}
                {isLoggedIn && (
                  <Link href="/account/wishlist" className="text-white hover:text-gray-200 transition-colors relative">
                    <FiHeart size={20} className="sm:w-6 sm:h-6" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] sm:text-[10px] rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center font-bold">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link href="/cart" className="text-white hover:text-gray-200 transition-colors relative">
                  <FiShoppingCart size={20} className="sm:w-6 sm:h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] sm:text-[10px] rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center font-bold">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile search bar */}
            <div className="lg:hidden">
              <div className="relative w-full">
                <form className="relative w-full" onSubmit={handleSearch}>
                  <FiSearch
                    size={16}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => suggestions.length && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder="Search for products, brands and more"
                    className="w-full bg-white text-gray-900 placeholder:text-gray-500 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5 pl-9 sm:pl-11 pr-10 sm:pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Search"
                  >
                    <FiSearch size={16} className="text-gray-600" />
                  </button>
                </form>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-[10002] max-h-80 overflow-y-auto">
                    <ul className="py-2">
                      {suggestions.map((product) => (
                        <li key={product.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setShowSuggestions(false);
                              setSearchQuery(product.name);
                              router.push(`/product/${product.id}`);
                            }}
                            className="w-full flex items-start gap-3 px-3 sm:px-4 py-2.5 hover:bg-gray-50 text-left"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                ৳{product.price?.toLocaleString('en-BD') ?? ''}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-white w-full h-full shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-bold text-base sm:text-lg">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <FiX size={20} className="sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>


              <div className="mb-3 sm:mb-4">
                <h4 className="font-bold text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">Categories</h4>
              </div>
              <nav className="space-y-1.5 sm:space-y-2">
                {categories.map((item) => {
                  const isExpanded = mobileExpandedCategory === item.name;
                  return (
                    <div key={item.id} className="border border-gray-100 rounded-lg">
                      <button
                        onClick={() =>
                          setMobileExpandedCategory(isExpanded ? null : item.name)
                        }
                        className="w-full flex items-center justify-between gap-2 sm:gap-3 py-1.5 sm:py-2 px-2.5 sm:px-3 text-left"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-lg sm:text-xl">{getCategoryIcon(item.name)}</span>
                          <span className="font-medium text-sm sm:text-base text-gray-800">{item.name}</span>
                        </div>
                        <FiChevronRight
                          size={16}
                          className={`text-gray-500 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {isExpanded && item.children && item.children.length > 0 && (
                        <div className="bg-gray-50 px-3 sm:px-5 py-2 sm:py-3 space-y-1.5 sm:space-y-2">
                          {item.children.map((sub) => (
                            <div key={sub.id} className="space-y-1">
                              <Link
                                href={`/category/${sub.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase block hover:text-blue-600"
                              >
                                {sub.name}
                              </Link>
                              {sub.children && sub.children.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                  {sub.children.map((subItem) => (
                                  <Link
                                      key={subItem.id}
                                      href={`/category/${subItem.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                      className="text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                                  >
                                      {subItem.name}
                                  </Link>
                                ))}
                              </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

