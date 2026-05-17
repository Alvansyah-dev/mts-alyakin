// components/ui/EmptyState.tsx
import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionHref
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-bg-card rounded-xl border border-dashed border-border min-h-[300px]">
      <div className="w-16 h-16 bg-bg-subtle rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary max-w-sm mb-6">{description}</p>
      
      {actionText && (
        actionHref ? (
          <Button asChild variant="outline">
            <a href={actionHref}>{actionText}</a>
          </Button>
        ) : (
          <Button onClick={onAction} variant="outline">
            {actionText}
          </Button>
        )
      )}
    </div>
  );
}
