'use client';

import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import CategoryFilters from './CategoryFilters';

interface FilterSection {
  title: string;
  options: string[];
}

interface MobileFiltersProps {
  filters: FilterSection[];
}

export default function MobileFilters({ filters }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-md transition-colors"
      >
        <FiFilter size={18} />
        <span>Filters</span>
      </button>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Filter Panel */}
          <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden overflow-y-auto shadow-2xl">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close filters"
                >
                  <FiX size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Filters - Remove extra styling for mobile */}
              <div className="[&>aside]:shadow-none [&>aside]:rounded-none [&>aside]:p-0">
                <CategoryFilters filters={filters} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

