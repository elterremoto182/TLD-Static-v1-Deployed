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
      className={cn('flex items-start sm:items-center text-sm min-h-[2.5rem] sm:min-h-[1.5rem]', className)}
    >
      <ol 
        className="flex items-start sm:items-center space-x-1 md:space-x-2 flex-wrap gap-y-1" 
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li
              key={item.href}
              className="flex items-center min-h-[1.25rem] sm:min-h-[1.5rem]"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <span
                  className={cn(
                    'font-medium truncate max-w-[200px] sm:max-w-none',
                    isLight ? 'text-white' : 'text-gray-900'
                  )}
                  itemProp="name"
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'transition-colors duration-200 truncate max-w-[120px] sm:max-w-none',
                    isLight 
                      ? 'text-white/80 hover:text-white' 
                      : 'text-gray-600 hover:text-primary'
                  )}
                  itemProp="item"
                  title={item.label}
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {!isLast && (
                <ChevronRight 
                  className={cn(
                    'w-3 h-3 md:w-4 md:h-4 mx-1 md:mx-2 flex-shrink-0',
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

