import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  delay = 0 
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card rounded-2xl p-4 sm:p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            trend === 'up' && "bg-accent/20 text-accent",
            trend === 'down' && "bg-destructive/20 text-destructive",
            trend === 'stable' && "bg-muted text-muted-foreground"
          )}>
            <TrendIcon className="w-3 h-3" />
            {trendValue}
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground text-xs sm:text-sm mb-1">{title}</p>
      <p className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">{value}</p>
      {subtitle && (
        <p className="text-muted-foreground text-xs sm:text-sm mt-1 sm:mt-2">{subtitle}</p>
      )}
    </motion.div>
  );
}
