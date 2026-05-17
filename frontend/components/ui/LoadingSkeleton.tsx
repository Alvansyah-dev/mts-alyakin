// components/ui/LoadingSkeleton.tsx
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const pulse = {
  animate: { opacity: [0.4, 1, 0.4] },
  transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
};

export const SkeletonCard = ({ className }: { className?: string }) => (
  <motion.div
    className={cn('bg-card rounded-2xl shadow-sm h-48 w-full', className)}
    {...pulse}
  />
);

export const SkeletonText = ({ width = '100%', height = '1rem', className }: { width?: string; height?: string; className?: string }) => (
  <motion.div
    className={cn('bg-card rounded', className)}
    style={{ width, height, marginBottom: '0.5rem' }}
    {...pulse}
  />
);

export const SkeletonImage = ({ className }: { className?: string }) => (
  <motion.div className={cn('bg-card rounded w-full h-64', className)} {...pulse} />
);

export const SkeletonTable = ({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex space-x-2">
        {Array.from({ length: cols }).map((_, c) => (
          <motion.div
            key={c}
            className="bg-card rounded h-6 flex-1"
            {...pulse}
          />
        ))}
      </div>
    ))}
  </div>
);
