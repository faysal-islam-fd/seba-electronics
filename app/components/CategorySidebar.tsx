'use client';

import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useGetCategoriesQuery } from '@/app/store/api/categoriesApi';

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

export default function CategorySidebar() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const categoryRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const sidebarRef = useRef<HTMLElement>(null);
  
  // Fetch categories from API
  const { data: categoriesData, isLoading } = useGetCategoriesQuery({ with_children: true });
  const categories = categoriesData?.data || [];

  // Update menu position when hovering
  useEffect(() => {
    if (hoveredCategory && sidebarRef.current) {
      const category = categories.find(cat => cat.name === hoveredCategory);
      if (category) {
        const element = categoryRefs.current.get(category.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const sidebarRect = sidebarRef.current.getBoundingClientRect();
          setMenuPosition({
            top: rect.top - sidebarRect.top,
            left: sidebarRect.width + 8
          });
        }
      }
    } else {
      setMenuPosition(null);
    }
  }, [hoveredCategory, categories]);

  if (isLoading) {
    return (
      <aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm h-[350px] md:h-[450px] lg:h-[550px] flex flex-col">
        <div className="p-4 border-b border-gray-200 animate-pulse flex-shrink-0">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside ref={sidebarRef} className="w-full lg:w-64 bg-white rounded-lg shadow-sm h-[350px] md:h-[450px] lg:h-[550px] flex flex-col relative">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Browse Categories</h2>
        </div>
        <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
          {categories.map((category) => (
            <div 
              key={category.id}
              ref={(el) => {
                if (el) categoryRefs.current.set(category.id, el);
                else categoryRefs.current.delete(category.id);
              }}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
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
                {category.children && category.children.length > 0 && (
                  <FiChevronRight 
                    className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200"
                    size={16}
                  />
                )}
              </Link>
            </div>
          ))}
        </div>
      </aside>

      {/* Mega Menu - rendered outside scrollable container to avoid clipping */}
      {hoveredCategory && menuPosition && (() => {
        const category = categories.find(cat => cat.name === hoveredCategory);
        if (!category || !category.children || category.children.length === 0) return null;
        
        return (
          <div 
            className="fixed w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-[10000] pointer-events-auto"
            style={{
              top: sidebarRef.current 
                ? `${sidebarRef.current.getBoundingClientRect().top + menuPosition.top}px`
                : '0',
              left: sidebarRef.current 
                ? `${sidebarRef.current.getBoundingClientRect().left + menuPosition.left}px`
                : '0'
            }}
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              {category.name}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {category.children.map((subcategory) => (
                <div key={subcategory.id} className="space-y-2">
                  <Link
                    href={`/category/${category.slug}/${subcategory.slug}`}
                    className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors block mb-3"
                  >
                    {subcategory.name}
                  </Link>
                  {subcategory.children && subcategory.children.length > 0 && (
                    <ul className="space-y-1.5">
                      {subcategory.children.slice(0, 5).map((item) => (
                        <li key={item.id}>
                          <Link
                            href={`/category/${category.slug}/${subcategory.slug}/${item.slug}`}
                            className="text-sm text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all block"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      {subcategory.children.length > 5 && (
                        <li>
                          <Link
                            href={`/category/${category.slug}/${subcategory.slug}`}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View all →
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </>
  );
}
