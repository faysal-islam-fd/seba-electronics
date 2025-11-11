'use client';

import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { useState } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-1.5 text-xs">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FiMapPin size={12} />
              Dhaka, Bangladesh
            </span>
            <span className="hidden md:flex items-center gap-1">
              <FiPhone size={12} />
              +880 1234-567890
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/track-order" className="hover:underline">Track Order</Link>
            <Link href="/help" className="hover:underline">Help</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl font-bold text-blue-600">Pickaboo</div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2.5 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiSearch size={18} />
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Link href="/account" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors">
              <FiUser size={24} />
              <span className="text-xs mt-0.5">Account</span>
            </Link>
            <Link href="/cart" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors relative">
              <FiShoppingCart size={24} />
              <span className="text-xs mt-0.5">Cart</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-6 py-3 text-sm overflow-x-auto">
            {[
              { name: 'Laptop', href: '/category/laptops' },
              { name: 'Desktop', href: '/category/desktops' },
              { name: 'Components', href: '/category/components' },
              { name: 'Monitor', href: '/category/monitors' },
              { name: 'Accessories', href: '/category/accessories' },
              { name: 'Networking', href: '/category/networking' },
              { name: 'TV & Audio', href: '/category/tv' },
              { name: 'Camera', href: '/category/camera' },
              { name: 'Gadgets', href: '/category/gadget' },
              { name: 'Office', href: '/category/office' },
            ].map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="hover:text-blue-600 font-medium whitespace-nowrap transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

