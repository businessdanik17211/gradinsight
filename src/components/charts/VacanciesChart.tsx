import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useSalaryStats } from '@/hooks/useSalaryStats';
import { Skeleton } from '@/components/ui/skeleton';

// Olive-based color palette
const COLORS = ['hsl(75, 35%, 35%)', 'hsl(75, 30%, 45%)', 'hsl(45, 40%, 50%)', 'hsl(30, 30%, 50%)', 'hsl(75, 25%, 55%)', 'hsl(45, 30%, 45%)'];

export function VacanciesChart() {
  const { data: salaryStats, isLoading } = useSalaryStats();

  const data = salaryStats?.categories.map(cat => ({
    category: cat.category,
    count: cat.vacancyCount,
  })).sort((a, b) => b.count - a.count) || [];

  if (isLoading) {
    return (
      <div className="card-elevated p-6">
        <Skeleton className="h-6 w-48 mb-6" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card-elevated p-6">
        <h3 className="font-serif text-lg font-semibold text-foreground mb-6">Вакансии по категориям</h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Данные появятся после парсинга вакансий
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="card-elevated p-6"
    >
      <h3 className="font-serif text-lg font-semibold text-foreground mb-6">
        Вакансии по категориям
        <span className="text-sm font-normal text-muted-foreground ml-2">
          (rabota.by)
        </span>
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="category" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value: number) => [value.toLocaleString('ru-RU'), 'Вакансий']}
          />
          <Legend />
          <Bar dataKey="count" name="Вакансий" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
