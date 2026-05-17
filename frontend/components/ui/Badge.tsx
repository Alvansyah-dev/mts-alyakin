// components/ui/Badge.tsx
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  danger: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
