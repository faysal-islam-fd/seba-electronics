'use client';

import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';

const categories = [
  { 
    name: 'Smartphones', 
    href: '/category/smartphones', 
    icon: '📱',
    subcategories: [
      { name: 'iPhone', items: ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14', 'iPhone SE'] },
      { name: 'Samsung', items: ['Galaxy S24', 'Galaxy Z Fold', 'Galaxy A Series', 'Galaxy M Series'] },
      { name: 'OnePlus', items: ['OnePlus 12', 'OnePlus 11', 'OnePlus Nord'] },
      { name: 'Xiaomi', items: ['Xiaomi 14', 'Redmi Note', 'POCO Series'] },
      { name: 'Google Pixel', items: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a'] },
    ]
  },
  { 
    name: 'Electronics & Appliances', 
    href: '/category/electronics', 
    icon: '🔌',
    subcategories: [
      { name: 'Air Conditioners', items: ['Split AC', 'Window AC', 'Portable AC', 'Inverter AC'] },
      { name: 'Refrigerators', items: ['Double Door', 'Single Door', 'Side by Side', 'Mini Fridge'] },
      { name: 'Microwaves', items: ['Solo', 'Grill', 'Convection'] },
      { name: 'Kitchen Appliances', items: ['Blender', 'Rice Cooker', 'Air Fryer', 'Toaster'] },
    ]
  },
  { 
    name: 'Television', 
    href: '/category/television', 
    icon: '📺',
    subcategories: [
      { name: 'Smart TV', items: ['4K Smart TV', 'Full HD Smart TV', 'Android TV'] },
      { name: 'LED TV', items: ['32 inch', '43 inch', '55 inch', '65 inch'] },
      { name: 'Brands', items: ['Samsung', 'Sony', 'LG', 'TCL', 'Xiaomi'] },
    ]
  },
  { 
    name: 'Washing Machine', 
    href: '/category/washing-machine', 
    icon: '🧺',
    subcategories: [
      { name: 'Front Load', items: ['7kg', '8kg', '9kg', '10kg'] },
      { name: 'Top Load', items: ['Semi-Automatic', 'Fully Automatic'] },
      { name: 'Brands', items: ['LG', 'Samsung', 'Whirlpool', 'Haier'] },
    ]
  },
  { 
    name: 'Mobile Accessories', 
    href: '/category/mobile-accessories', 
    icon: '🎧',
    subcategories: [
      { name: 'Audio', items: ['Earbuds', 'Headphones', 'Speakers', 'Airpods'] },
      { name: 'Power', items: ['Power Bank', 'Chargers', 'Cables', 'Wireless Charger'] },
      { name: 'Protection', items: ['Cases', 'Screen Protectors', 'Covers'] },
      { name: 'Storage', items: ['Memory Cards', 'OTG Drives', 'Card Readers'] },
    ]
  },
  { 
    name: 'Computers', 
    href: '/category/computers', 
    icon: '💻',
    subcategories: [
      { name: 'Laptops', items: ['Gaming Laptops', 'Business Laptops', 'Ultrabooks', 'Budget Laptops'] },
      { name: 'Desktops', items: ['Gaming PC', 'All-in-One', 'Workstation', 'Mini PC'] },
      { name: 'Brands', items: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS'] },
    ]
  },
  { 
    name: 'Computer Accessories', 
    href: '/category/computer-accessories', 
    icon: '⌨️',
    subcategories: [
      { name: 'Input Devices', items: ['Keyboards', 'Mouse', 'Webcams', 'Graphics Tablet'] },
      { name: 'Storage', items: ['SSD', 'HDD', 'External HDD', 'Pen Drives'] },
      { name: 'Networking', items: ['Routers', 'WiFi Adapters', 'Switches'] },
      { name: 'Monitors', items: ['Gaming Monitors', 'Professional', '4K Monitors'] },
    ]
  },
  { 
    name: 'Lifestyle', 
    href: '/category/lifestyle', 
    icon: '⌚',
    subcategories: [
      { name: 'Wearables', items: ['Smart Watch', 'Fitness Bands', 'Smart Glasses'] },
      { name: 'Gaming', items: ['Consoles', 'Controllers', 'Gaming Chairs', 'VR Headsets'] },
      { name: 'Cameras', items: ['DSLR', 'Mirrorless', 'Action Cameras', 'Instant Cameras'] },
      { name: 'Smart Home', items: ['Smart Lights', 'Smart Plugs', 'Security Cameras'] },
    ]
  },
];

export default function CategorySidebar() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm h-fit relative">
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
              className="flex items-center justify-between px-4 py-3.5 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{category.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {category.name}
                </span>
              </div>
              <FiChevronRight className="text-gray-400 group-hover:text-blue-600" size={16} />
            </Link>

            {/* Mega Menu Flyout - Only on Desktop */}
            {hoveredCategory === category.name && category.subcategories && (
              <div className="hidden lg:block absolute left-full top-0 ml-1 w-[600px] bg-white rounded-lg shadow-2xl border border-gray-100 z-50 p-6">
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
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

