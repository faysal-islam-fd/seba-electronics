'use client';

import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main Header */}
      <div className="bg-blue-600">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-gray-200 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <FiMenu size={28} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="text-2xl md:text-3xl font-bold text-white lowercase">
                pickaboo
              </div>
            </Link>

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
            <div className="flex items-center gap-3">
              {/* Login Button */}
              <Link 
                href="/login" 
                className="hidden md:block border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all px-6 py-2 rounded-lg font-semibold"
              >
                Login
              </Link>

              {/* Cart */}
              <Link href="/cart" className="text-white hover:text-gray-200 transition-colors relative">
                <FiShoppingCart size={28} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  0
                </span>
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
            className="bg-white w-64 h-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <nav className="space-y-2">
                {[
                  { name: 'Smartphones', href: '/category/smartphones' },
                  { name: 'Laptop', href: '/category/laptops' },
                  { name: 'Desktop', href: '/category/desktops' },
                  { name: 'Monitor', href: '/category/monitors' },
                  { name: 'Accessories', href: '/category/accessories' },
                  { name: 'TV & Audio', href: '/category/tv' },
                  { name: 'Camera', href: '/category/camera' },
                  { name: 'Gadgets', href: '/category/gadget' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2 px-3 hover:bg-blue-50 rounded transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
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

