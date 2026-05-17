'use client';

// components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-accent to-emerald-500 text-white hover:from-accent-hover hover:to-emerald-600',
  secondary: 'bg-bg-subtle text-text-primary hover:bg-bg-subtle/80',
  outline: 'border border-accent text-accent hover:bg-accent/10',
  ghost: 'bg-transparent text-accent hover:bg-accent/10',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeClasses = {
  sm: 'px-3 py-1 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  asChild = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const Comp = asChild ? Slot : motion.button;
  const motionProps = asChild ? {} : { whileTap: { scale: 0.95 } };

  return (
    <Comp
      {...motionProps}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={loading || rest.disabled}
      {...(rest as any)}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      ) : (
        <>
          {icon && <span className="inline-flex">{icon}</span>}
          {children}
        </>
      )}
    </Comp>
  );
}

