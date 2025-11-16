'use client';

import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiMenu, FiChevronRight, FiUser, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';
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

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-[9998]">
      {/* Main Header */}
      <div className="bg-blue-600">
        <div className="container  mx-auto px-4 py-4">
          <div className="flex  items-center justify-between gap-4">
            {/* Categories Hamburger Menu - Desktop (with hover) */}
           <div className="flex items-center gap-4 ">
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
                  className="flex items-center gap-2   text-white px-3 py-2.5 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                  aria-label="Categories"
                >
                  <FiMenu size={25} />
                </button>

                {/* Categories Dropdown - Overlays existing sidebar */}
                {categoriesOpen && (
                  <>
                    {/* Extended hover zone - invisible area connecting button to dropdown */}
                    <div 
                      className="fixed bg-transparent z-[9998]"
                      style={{
                        left: '0',
                        top: '56px',
                        width: '280px',
                        height: '800px'
                      }}
                    />
                    
                    <div 
                      className="fixed w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999] overflow-hidden transition-all duration-200"
                      style={{
                        left: 'max(1rem, calc((100vw - 1280px) / 2 + 1rem))',
                        top: '72px'
                      }}
                    >
                    <div className="divide-y divide-gray-100">
                      {categories.map((category) => (
                        <div
                          key={category.href}
                          className="relative"
                          onMouseEnter={() => setHoveredCategory(category.name)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <Link
                            href={category.href}
                            className="flex items-center justify-between px-4 py-3.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl transition-transform duration-200 group-hover:scale-110">{category.icon}</span>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                {category.name}
                              </span>
                            </div>
                            <FiChevronRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" size={16} />
                          </Link>

                          {/* Subcategories Mega Menu - Shows on hover */}
                          {hoveredCategory === category.name && category.subcategories && (
                            <>
                              {/* Invisible bridge between category and subcategory */}
                              <div 
                                className="fixed h-full w-2 z-[10000]"
                                style={{
                                  left: 'max(16rem, calc((100vw - 1280px) / 2 + 16rem))',
                                  top: '72px',
                                  height: '100vh'
                                }}
                              />
                              
                              <div 
                                className="fixed w-[600px] bg-white rounded-lg shadow-2xl border border-gray-100 z-[10000] p-6"
                                style={{
                                  left: 'max(17rem, calc((100vw - 1280px) / 2 + 17rem))',
                                  top: '72px'
                                }}
                                onMouseEnter={() => setHoveredCategory(category.name)}
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
                                              href={`${category.href}/${item.toLowerCase().replace(/\s+/g, '-')}`}
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
                  </>
                )}
              </div>
            </div>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="text-2xl md:text-3xl font-bold text-white lowercase">
                Sheba
              </div>
            </Link>
           </div>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-gray-200 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <FiMenu size={28} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl">
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more"
                  className="w-full px-4 py-2.5 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label="Search"
                >
                  <FiSearch size={20} />
                </button>
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {/* My Account / Login */}
              {isLoggedIn ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    onBlur={() => setTimeout(() => setAccountDropdownOpen(false), 200)}
                    className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                  >
                    <div className="bg-white rounded-full p-1.5">
                      <FiUser className="text-blue-600" size={20} />
                    </div>
                    <span className="font-medium">My Account</span>
                    <FiChevronDown size={16} />
                  </button>

                  {/* Account Dropdown */}
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
                      <div className="border-t border-gray-200 my-1"></div>
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
                  className="hidden md:block border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all px-6 py-2 rounded-lg font-semibold"
                >
                  Login
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart" className="text-white hover:text-gray-200 transition-colors relative">
                <FiShoppingCart size={28} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getCartCount() > 99 ? '99+' : getCartCount()}
                  </span>
                )}
              </Link>
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
            className="bg-white w-64 h-full shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 py-2 px-3 hover:bg-blue-50 rounded transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

