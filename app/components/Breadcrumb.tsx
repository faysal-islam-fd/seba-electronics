import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
        <FiHome size={16} />
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <FiChevronRight size={14} className="text-gray-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-blue-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

