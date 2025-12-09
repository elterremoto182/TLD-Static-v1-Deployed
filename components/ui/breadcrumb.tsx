import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: 'default' | 'light';
}

export function Breadcrumb({ items, className, variant = 'default' }: BreadcrumbProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const isLight = variant === 'light';

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm', className)}
    >
      <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li
              key={item.href}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <span
                  className={cn(
                    'font-medium',
                    isLight ? 'text-white' : 'text-gray-900'
                  )}
                  itemProp="name"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'transition-colors duration-200',
                    isLight 
                      ? 'text-white/80 hover:text-white' 
                      : 'text-gray-600 hover:text-primary'
                  )}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {!isLast && (
                <ChevronRight 
                  className={cn(
                    'w-4 h-4 mx-2',
                    isLight ? 'text-white/60' : 'text-gray-400'
                  )} 
                  aria-hidden="true" 
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

