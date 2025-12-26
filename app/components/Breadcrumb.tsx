import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  dark?: boolean;
}

export default function Breadcrumb({ items, dark = false }: BreadcrumbProps) {
  const lastIndex = items.length - 1;

  // Colors based on dark/light mode
  const homeColor = dark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600';
  const chevronColor = dark ? 'text-gray-500' : 'text-gray-400';
  const linkColor = dark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600';
  const activeColor = dark ? 'text-white' : 'text-gray-900';

  return (
    <nav className={`flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-4`}>
      <Link href="/" className={`${homeColor} transition-colors flex items-center gap-1`}>
        <FiHome size={16} />
        Home
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <FiChevronRight size={14} className={chevronColor} />
          {item.href ? (
            <Link
              href={item.href}
              className={`${linkColor} transition-colors max-w-[120px] sm:max-w-[200px] truncate`}
              title={item.label}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`${activeColor} font-semibold max-w-[150px] sm:max-w-[260px] truncate`}
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
