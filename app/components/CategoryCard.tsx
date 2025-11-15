import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  image: string;
  description: string;
  href: string;
}

export default function CategoryCard({ name, image, description, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
        {/* Image Container */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{description}</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 text-sm">
            {name}
          </button>
        </div>
      </div>
    </Link>
  );
}

