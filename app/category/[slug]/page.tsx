import { notFound } from 'next/navigation';
import CategoryFilters from '@/app/components/CategoryFilters';
import ProductCard from '@/app/components/ProductCard';
import Breadcrumb from '@/app/components/Breadcrumb';
import MobileFilters from '@/app/components/MobileFilters';
import {
  featuredProducts,
  desktopProducts,
  monitorProducts,
  accessoriesProducts,
  smartphoneProducts,
  cameraProducts,
  gadgetProducts,
} from '@/app/data/dummyData';

// Map category slugs to their data
type ProductType = {
  id: string;
  name: string;
  price: number;
  image: string;
  originalPrice?: number;
  discount?: number;
  badge?: string;
  rating?: number;
  inStock?: boolean;
};

const categoryData: Record<string, {
  name: string;
  products: ProductType[];
  filters: Array<{ title: string; options: string[] }>;
}> = {
  'smartphones': {
    name: 'Smartphones',
    products: smartphoneProducts,
    filters: [
      { title: 'Brand', options: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Realme'] },
      { title: 'Price Range', options: ['Under ৳50,000', '৳50,000 - ৳80,000', '৳80,000 - ৳120,000', 'Above ৳120,000'] },
      { title: 'Storage', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
      { title: 'RAM', options: ['4GB', '6GB', '8GB', '12GB', '16GB'] },
      { title: 'Display Size', options: ['Below 6"', '6" - 6.5"', '6.5" - 7"', 'Above 7"'] },
      { title: 'Battery Capacity', options: ['Below 4000mAh', '4000-5000mAh', 'Above 5000mAh'] },
    ],
  },
  'home-appliances': {
    name: 'Home Appliances',
    products: [...desktopProducts, ...monitorProducts],
    filters: [
      { title: 'Brand', options: ['LG', 'Samsung', 'Whirlpool', 'Haier', 'Panasonic', 'Sony'] },
      { title: 'Price Range', options: ['Under ৳30,000', '৳30,000 - ৳60,000', '৳60,000 - ৳100,000', 'Above ৳100,000'] },
      { title: 'Warranty', options: ['1 Year', '2 Years', '3 Years', '5 Years'] },
      { title: 'Energy Rating', options: ['3 Star', '4 Star', '5 Star'] },
    ],
  },
  'gadgets': {
    name: 'Gadgets',
    products: gadgetProducts,
    filters: [
      { title: 'Brand', options: ['Apple', 'Samsung', 'Sony', 'JBL', 'DJI', 'Amazon'] },
      { title: 'Price Range', options: ['Under ৳20,000', '৳20,000 - ৳50,000', '৳50,000 - ৳80,000', 'Above ৳80,000'] },
      { title: 'Type', options: ['Smart Watch', 'Fitness Band', 'Drone', 'E-Reader', 'Speaker'] },
    ],
  },
  'networking': {
    name: 'Networking & Accessories',
    products: accessoriesProducts,
    filters: [
      { title: 'Brand', options: ['TP-Link', 'Netgear', 'ASUS', 'D-Link', 'Linksys'] },
      { title: 'Price Range', options: ['Under ৳5,000', '৳5,000 - ৳15,000', '৳15,000 - ৳30,000', 'Above ৳30,000'] },
      { title: 'Type', options: ['Router', 'Switch', 'Access Point', 'Network Adapter', 'Cable'] },
    ],
  },
  'kitchen-appliances': {
    name: 'Kitchen Appliances',
    products: [...accessoriesProducts.slice(0, 3), ...featuredProducts.slice(0, 2)],
    filters: [
      { title: 'Brand', options: ['Philips', 'Prestige', 'Bajaj', 'Morphy Richards', 'Inalsa'] },
      { title: 'Price Range', options: ['Under ৳10,000', '৳10,000 - ৳25,000', '৳25,000 - ৳50,000', 'Above ৳50,000'] },
      { title: 'Type', options: ['Mixer Grinder', 'Air Fryer', 'Blender', 'Rice Cooker', 'Toaster'] },
    ],
  },
  'washing-machines': {
    name: 'Washing Machines',
    products: desktopProducts,
    filters: [
      { title: 'Brand', options: ['LG', 'Samsung', 'Whirlpool', 'Haier', 'IFB'] },
      { title: 'Price Range', options: ['Under ৳30,000', '৳30,000 - ৳50,000', '৳50,000 - ৳80,000', 'Above ৳80,000'] },
      { title: 'Type', options: ['Front Load', 'Top Load', 'Semi-Automatic', 'Fully Automatic'] },
      { title: 'Capacity', options: ['6kg', '7kg', '8kg', '9kg', '10kg', '12kg'] },
    ],
  },
  'refrigerators': {
    name: 'Refrigerators',
    products: monitorProducts,
    filters: [
      { title: 'Brand', options: ['LG', 'Samsung', 'Whirlpool', 'Haier', 'Godrej'] },
      { title: 'Price Range', options: ['Under ৳40,000', '৳40,000 - ৳70,000', '৳70,000 - ৳120,000', 'Above ৳120,000'] },
      { title: 'Type', options: ['Single Door', 'Double Door', 'Side by Side', 'French Door'] },
      { title: 'Capacity', options: ['Below 200L', '200-300L', '300-400L', 'Above 400L'] },
    ],
  },
  'television': {
    name: 'Television',
    products: [...monitorProducts, ...featuredProducts.slice(0, 2)],
    filters: [
      { title: 'Brand', options: ['Samsung', 'LG', 'Sony', 'TCL', 'Xiaomi', 'OnePlus'] },
      { title: 'Price Range', options: ['Under ৳30,000', '৳30,000 - ৳60,000', '৳60,000 - ৳100,000', 'Above ৳100,000'] },
      { title: 'Screen Size', options: ['32"', '43"', '50"', '55"', '65"', '75"'] },
      { title: 'Display Type', options: ['LED', 'QLED', 'OLED', '4K UHD', '8K UHD'] },
      { title: 'Smart TV', options: ['Yes', 'No'] },
    ],
  },
  'electronics': {
    name: 'Electronics & Appliances',
    products: [...desktopProducts, ...monitorProducts, ...accessoriesProducts],
    filters: [
      { title: 'Brand', options: ['LG', 'Samsung', 'Sony', 'Panasonic', 'Whirlpool'] },
      { title: 'Price Range', options: ['Under ৳20,000', '৳20,000 - ৳50,000', '৳50,000 - ৳100,000', 'Above ৳100,000'] },
      { title: 'Category', options: ['Air Conditioners', 'Refrigerators', 'Microwaves', 'Washing Machines'] },
    ],
  },
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryData[slug];

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: category.name },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <CategoryFilters filters={category.filters} />
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {category.products.length} products
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Mobile Filter Button */}
                  <MobileFilters filters={category.filters} />
                  <select className="flex-1 sm:flex-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                    <option>Rating: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Load More / Pagination */}
            <div className="mt-8 text-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Load More Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

