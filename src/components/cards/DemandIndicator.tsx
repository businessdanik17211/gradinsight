import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { DemandLevel } from '@/types/professions';
import { cn } from '@/lib/utils';

interface DemandIndicatorProps {
  level: DemandLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const demandConfig: Record<DemandLevel, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}> = {
  high: {
    label: 'Высокий спрос',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: <TrendingUp className="w-4 h-4" />,
  },
  medium: {
    label: 'Средний спрос',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    icon: <Minus className="w-4 h-4" />,
  },
  low: {
    label: 'Низкий спрос',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: <TrendingDown className="w-4 h-4" />,
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
};

export function DemandIndicator({ level, showLabel = true, size = 'md' }: DemandIndicatorProps) {
  const config = demandConfig[level];
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      config.color,
      config.bgColor,
      sizeClasses[size]
    )}>
      {config.icon}
      {showLabel && config.label}
    </span>
  );
}
