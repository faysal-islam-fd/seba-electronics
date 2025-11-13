import ProductCard from './ProductCard';

const relatedProducts = [
  {
    id: '2',
    name: 'iPhone 15 Pro 128GB - Blue Titanium',
    price: 125000,
    originalPrice: 135000,
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop',
    discount: 7,
    rating: 4.8,
    inStock: true,
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24 Ultra 256GB',
    price: 135000,
    originalPrice: 145000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    discount: 7,
    rating: 4.8,
    inStock: true,
  },
  {
    id: '4',
    name: 'Google Pixel 8 Pro 128GB',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '5',
    name: 'OnePlus 12 5G 256GB',
    price: 75000,
    originalPrice: 82000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    discount: 9,
    rating: 4.6,
    inStock: true,
  },
];

interface RelatedProductsProps {
  currentProductId: string;
}

export default function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {relatedProducts
          .filter((product) => product.id !== currentProductId)
          .map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              discount={product.discount}
              rating={product.rating}
              inStock={product.inStock}
            />
          ))}
      </div>
    </div>
  );
}

