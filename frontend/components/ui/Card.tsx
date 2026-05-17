'use client';

// components/ui/Card.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  href?: string;
  imgSrc?: string;
  imgAlt?: string;
  className?: string;
}

export default function Card({
  children,
  href,
  imgSrc,
  imgAlt = '',
  className,
}: CardProps) {
  const Container = href ? 'a' : 'div';
  const containerProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
      className={cn(
        'bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-shadow duration-200',
        className,
      )}
    >
      <Container {...containerProps} className="block h-full w-full">
        {imgSrc && (
          <img src={imgSrc} alt={imgAlt} className="w-full h-48 object-cover" />
        )}
        <div className="p-4">{children}</div>
      </Container>
    </motion.div>
  );
}
