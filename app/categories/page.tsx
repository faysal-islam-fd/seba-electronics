import { getCategories } from '@/app/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Categories | Sheba Electronics',
  description: 'Browse all product categories - Electronics, Home Appliances, Gadgets, and more.',
};

export default async function CategoriesPage() {
  const categoriesData = await getCategories(true);
  const categories = categoriesData.success ? categoriesData.data : [];


  // Separate parent categories and their children
  const parentCategories = categories.filter(cat => !cat.parent_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Categories</h1>
          <p className="text-gray-600 mt-2">Browse our wide range of product categories</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-8">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Categories Found</h2>
            <p className="text-gray-600">Check back later for new categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {parentCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300"
              >
                {/* Category Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">📦</span>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Category Info */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {category.name}
                  </h2>

                  {/* Subcategories */}
                  {category.children && category.children.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {category.children.length} Subcategories
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.children.slice(0, 3).map((child) => (
                          <span
                            key={child.id}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                          >
                            {child.name}
                          </span>
                        ))}
                        {category.children.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                            +{category.children.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Products Link */}
                  <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    <span>Browse Products</span>
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* All Categories List (if there are subcategories) */}
        {parentCategories.some(cat => cat.children && cat.children.length > 0) && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Subcategory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {parentCategories.map((parent) => (
                parent.children && parent.children.length > 0 && (
                  <div key={parent.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <Link
                      href={`/category/${parent.slug}`}
                      className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 mb-4"
                    >
                      {parent.name}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <ul className="space-y-2">
                      {parent.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/category/${child.slug}`}
                            className="text-gray-600 hover:text-blue-600 hover:pl-2 transition-all text-sm flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Enable ISR
export const revalidate = 86400; // Revalidate every 24 hours

