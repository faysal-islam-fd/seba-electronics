import { getProducts, getFeaturedProducts, getTopSellingProducts, getCategories, getBrands } from '@/app/lib/api';

export default async function ApiTestPage() {
  // Test all endpoints
  const [products, featured, topSelling, categories, brands] = await Promise.all([
    getProducts({ per_page: 5 }),
    getFeaturedProducts(5),
    getTopSellingProducts(5),
    getCategories(true),
    getBrands(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">API Integration Test</h1>

        {/* Products Endpoint */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            GET /products
            <span className={`ml-3 px-3 py-1 rounded-full text-sm ${products.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {products.success ? '✅ Success' : '❌ Failed'}
            </span>
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Total Products: {products.meta?.total || 0}</p>
            <p className="text-sm text-gray-600">Current Page: {products.meta?.current_page || 0}</p>
            <p className="text-sm text-gray-600">Per Page: {products.meta?.per_page || 0}</p>
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-700">View Response</summary>
              <pre className="mt-2 bg-gray-50 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(products, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Featured Products Endpoint */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            GET /products/featured
            <span className={`ml-3 px-3 py-1 rounded-full text-sm ${featured.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {featured.success ? '✅ Success' : '❌ Failed'}
            </span>
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Products Returned: {featured.data?.length || 0}</p>
            {featured.data && featured.data.length > 0 && (
              <div className="mt-4 grid gap-2">
                {featured.data.slice(0, 3).map((p) => (
                  <div key={p.id} className="text-sm bg-gray-50 p-3 rounded">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-gray-600">Price: ৳{p.final_price}</p>
                  </div>
                ))}
              </div>
            )}
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-700">View Response</summary>
              <pre className="mt-2 bg-gray-50 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(featured, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Top Selling Products Endpoint */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            GET /products/top-selling
            <span className={`ml-3 px-3 py-1 rounded-full text-sm ${topSelling.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {topSelling.success ? '✅ Success' : '❌ Failed'}
            </span>
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Products Returned: {topSelling.data?.length || 0}</p>
            {topSelling.data && topSelling.data.length > 0 && (
              <div className="mt-4 grid gap-2">
                {topSelling.data.slice(0, 3).map((p) => (
                  <div key={p.id} className="text-sm bg-gray-50 p-3 rounded">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-gray-600">Price: ৳{p.final_price}</p>
                  </div>
                ))}
              </div>
            )}
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-700">View Response</summary>
              <pre className="mt-2 bg-gray-50 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(topSelling, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Categories Endpoint */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            GET /categories
            <span className={`ml-3 px-3 py-1 rounded-full text-sm ${categories.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {categories.success ? '✅ Success' : '❌ Failed'}
            </span>
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Categories Returned: {categories.data?.length || 0}</p>
            {categories.data && categories.data.length > 0 && (
              <div className="mt-4 grid gap-2">
                {categories.data.slice(0, 5).map((c) => (
                  <div key={c.id} className="text-sm bg-gray-50 p-3 rounded">
                    <p className="font-semibold">{c.name} (ID: {c.id})</p>
                    <p className="text-gray-600">Slug: {c.slug}</p>
                    <p className="text-gray-600">Children: {c.children?.length || 0}</p>
                  </div>
                ))}
              </div>
            )}
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-700">View Response</summary>
              <pre className="mt-2 bg-gray-50 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(categories, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Brands Endpoint */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            GET /brands
            <span className={`ml-3 px-3 py-1 rounded-full text-sm ${brands.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {brands.success ? '✅ Success' : '❌ Failed'}
            </span>
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Brands Returned: {brands.data?.length || 0}</p>
            {brands.data && brands.data.length > 0 && (
              <div className="mt-4 grid gap-2">
                {brands.data.slice(0, 5).map((b) => (
                  <div key={b.id} className="text-sm bg-gray-50 p-3 rounded">
                    <p className="font-semibold">{b.name} (ID: {b.id})</p>
                    <p className="text-gray-600">Slug: {b.slug}</p>
                  </div>
                ))}
              </div>
            )}
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-700">View Response</summary>
              <pre className="mt-2 bg-gray-50 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(brands, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* API Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">API Base URL</h3>
          <code className="text-sm text-blue-700">https://seba.rangpurit.com/api/v1</code>
          
          <div className="mt-4 space-y-1 text-sm text-blue-800">
            <p>✅ If endpoints show success: API is working</p>
            <p>❌ If endpoints show failed: Check if API server is running or endpoints exist</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 0; // Always fetch fresh data for testing


