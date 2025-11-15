'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FilterSection {
  title: string;
  options: string[];
  type?: 'checkbox' | 'radio' | 'range';
}

interface CategoryFiltersProps {
  filters: FilterSection[];
}

export default function CategoryFilters({ filters }: CategoryFiltersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleFilterChange = (sectionTitle: string, option: string) => {
    setSelectedFilters(prev => {
      const current = prev[sectionTitle] || [];
      const updated = current.includes(option)
        ? current.filter(item => item !== option)
        : [...current, option];
      
      return {
        ...prev,
        [sectionTitle]: updated
      };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm p-4 h-fit lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h3 className="font-bold text-lg text-gray-900">Filters</h3>
        {Object.keys(selectedFilters).length > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filters.map((section, index) => {
          const isOpen = openSections[section.title] === true; // Default to closed
          
          return (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between text-left mb-3 font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                <span>{section.title}</span>
                {isOpen ? (
                  <FiChevronUp size={18} className="text-gray-500" />
                ) : (
                  <FiChevronDown size={18} className="text-gray-500" />
                )}
              </button>

              {isOpen && (
                <div className="space-y-2">
                  {section.options.map((option, optIndex) => {
                    const isSelected = selectedFilters[section.title]?.includes(option) || false;
                    
                    return (
                      <label
                        key={optIndex}
                        className="flex items-center gap-2 cursor-pointer group hover:text-blue-600 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleFilterChange(section.title, option)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

