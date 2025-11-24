'use client';

import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiMenu, FiChevronRight, FiUser, FiChevronDown, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

const categories = [
  { 
    name: 'Smartphones', 
    href: '/category/smartphones', 
    icon: '📱',
    subcategories: [
      { name: 'iPhone', items: ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14', 'iPhone SE'] },
      { name: 'Samsung', items: ['Galaxy S24', 'Galaxy Z Fold', 'Galaxy A Series', 'Galaxy M Series'] },
      { name: 'OnePlus', items: ['OnePlus 12', 'OnePlus 11', 'OnePlus Nord'] },
    ]
  },
  { 
    name: 'Electronics & Appliances', 
    href: '/category/electronics', 
    icon: '🔌',
    subcategories: [
      { name: 'Air Conditioners', items: ['Split AC', 'Window AC', 'Portable AC'] },
      { name: 'Refrigerators', items: ['Double Door', 'Single Door', 'Side by Side'] },
    ]
  },
  { 
    name: 'Television', 
    href: '/category/television', 
    icon: '📺',
    subcategories: [
      { name: 'Smart TV', items: ['4K Smart TV', 'Full HD Smart TV', 'Android TV'] },
      { name: 'LED TV', items: ['32 inch', '43 inch', '55 inch', '65 inch'] },
    ]
  },
  { 
    name: 'Washing Machine', 
    href: '/category/washing-machine', 
    icon: '🧺',
    subcategories: [
      { name: 'Front Load', items: ['7kg', '8kg', '9kg', '10kg'] },
      { name: 'Top Load', items: ['Semi-Automatic', 'Fully Automatic'] },
    ]
  },
  { 
    name: 'Mobile Accessories', 
    href: '/category/mobile-accessories', 
    icon: '🎧',
    subcategories: [
      { name: 'Audio', items: ['Earbuds', 'Headphones', 'Speakers', 'Airpods'] },
      { name: 'Power', items: ['Power Bank', 'Chargers', 'Cables'] },
    ]
  },
  { 
    name: 'Computers', 
    href: '/category/computers', 
    icon: '💻',
    subcategories: [
      { name: 'Laptops', items: ['Gaming Laptops', 'Business Laptops', 'Ultrabooks'] },
      { name: 'Desktops', items: ['Gaming PC', 'All-in-One', 'Workstation'] },
    ]
  },
  { 
    name: 'Computer Accessories', 
    href: '/category/computer-accessories', 
    icon: '⌨️',
    subcategories: [
      { name: 'Input Devices', items: ['Keyboards', 'Mouse', 'Webcams'] },
      { name: 'Storage', items: ['SSD', 'HDD', 'External HDD'] },
    ]
  },
  { 
    name: 'Lifestyle', 
    href: '/category/lifestyle', 
    icon: '⌚',
    subcategories: [
      { name: 'Wearables', items: ['Smart Watch', 'Fitness Bands', 'Smart Glasses'] },
      { name: 'Gaming', items: ['Consoles', 'Controllers', 'Gaming Chairs'] },
    ]
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const { getCartCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const cartItemCount = getCartCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
                                  key={category.href}
                                  className="relative"
                                  onMouseEnter={() => setHoveredCategory(category.name)}
                                >
                                  <Link
                                    href={category.href}
                                    className="flex items-center justify-between px-4 py-3.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl transition-transform duration-200 group-hover:scale-110">
                                        {category.icon}
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

                                  {hoveredCategory === category.name && category.subcategories && (
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
                                          {category.subcategories.map((subcategory, idx) => (
                                            <div key={idx} className="space-y-2">
                                              <h3 className="font-bold text-sm text-gray-900 mb-3 pb-2 border-b border-gray-200">
                                                {subcategory.name}
                                              </h3>
                                              <ul className="space-y-1.5">
                                                {subcategory.items.map((item, itemIdx) => (
                                                  <li key={itemIdx}>
                                                    <Link
                                                      href={{
                                                        pathname: category.href,
                                                        query: { subcategory: slugify(item) },
                                                      }}
                                                      className="text-sm text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all block"
                                                    >
                                                      {item}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
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

              <div className="hidden lg:flex flex-1 max-w-3xl mx-4">
                <form className="relative w-full" onSubmit={handleSearch}>
                  <FiSearch
                    size={16}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                      <span className="font-medium">My Account</span>
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
                          href="/account/reviews"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          My Reviews
                        </Link>
                        <div className="border-t border-gray-200 my-1" />
                        <button
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            logout();
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
                <Link
                  href={isLoggedIn ? '/account' : '/login'}
                  className="text-white hover:text-gray-200 transition-colors"
                  aria-label="Account"
                >
                  <div className="bg-white/20 border border-white/30 rounded-full p-1.5 sm:p-2">
                    <FiUser size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                </Link>
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

            <div className="lg:hidden">
              <form className="relative w-full" onSubmit={handleSearch}>
                <FiSearch
                  size={16}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                <h3 className="font-bold text-base sm:text-lg">Categories</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <FiX size={20} className="sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>
              <nav className="space-y-1.5 sm:space-y-2">
                {categories.map((item) => {
                  const isExpanded = mobileExpandedCategory === item.name;
                  return (
                    <div key={item.href} className="border border-gray-100 rounded-lg">
                      <button
                        onClick={() =>
                          setMobileExpandedCategory(isExpanded ? null : item.name)
                        }
                        className="w-full flex items-center justify-between gap-2 sm:gap-3 py-1.5 sm:py-2 px-2.5 sm:px-3 text-left"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-lg sm:text-xl">{item.icon}</span>
                          <span className="font-medium text-sm sm:text-base text-gray-800">{item.name}</span>
                        </div>
                        <FiChevronRight
                          size={16}
                          className={`text-gray-500 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {isExpanded && item.subcategories && (
                        <div className="bg-gray-50 px-3 sm:px-5 py-2 sm:py-3 space-y-1.5 sm:space-y-2">
                          {item.subcategories.map((sub) => (
                            <div key={sub.name} className="space-y-1">
                              <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">
                                {sub.name}
                              </p>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {sub.items.map((subItem) => (
                                  <Link
                                    key={subItem}
                                    href={{
                                      pathname: item.href,
                                      query: { subcategory: slugify(subItem) },
                                    }}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-full px-2 sm:px-3 py-0.5 sm:py-1"
                                  >
                                    {subItem}
                                  </Link>
                                ))}
                              </div>
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

