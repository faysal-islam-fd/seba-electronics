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
  const lastIndex = items.length - 1;

  return (
    <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-4">
      <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
        <FiHome size={16} />
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <FiChevronRight size={14} className="text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-blue-600 transition-colors max-w-[120px] sm:max-w-[200px] truncate"
              title={item.label}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`text-gray-900 font-semibold max-w-[150px] sm:max-w-[260px] truncate ${
                index === lastIndex ? 'text-gray-900' : 'text-gray-700'
              }`}
              title={item.label}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

