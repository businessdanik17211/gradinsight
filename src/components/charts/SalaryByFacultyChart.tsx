import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSalaryStats } from '@/hooks/useSalaryStats';
import { Skeleton } from '@/components/ui/skeleton';

// Olive-based color palette
const COLORS = ['hsl(75, 35%, 35%)', 'hsl(75, 30%, 45%)', 'hsl(45, 40%, 50%)', 'hsl(30, 30%, 50%)', 'hsl(75, 25%, 55%)', 'hsl(45, 30%, 45%)'];

export function SalaryByFacultyChart() {
  const { data: salaryStats, isLoading } = useSalaryStats();

  const data = salaryStats?.categories.map(cat => ({
    name: cat.category,
    salary: cat.avgSalary,
    min: cat.avgSalaryMin,
    max: cat.avgSalaryMax,
  })).sort((a, b) => b.salary - a.salary) || [];

  if (isLoading) {
    return (
      <div className="card-elevated p-6">
        <Skeleton className="h-6 w-64 mb-6" />
        <Skeleton className="h-[250px] w-full" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card-elevated p-6">
        <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
          Средняя зарплата по направлениям (BYN)
        </h3>
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          Данные появятся после парсинга вакансий
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="card-elevated p-6"
    >
      <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
        Средняя зарплата по направлениям (BYN)
        <span className="text-sm font-normal text-muted-foreground ml-2 block sm:inline">
          (данные rabota.by)
        </span>
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ bottom: 20, left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            angle={-15}
            textAnchor="end"
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value: number, name: string, props: any) => {
              const entry = props.payload;
              return [
                `${value.toLocaleString('ru-RU')} BYN (${entry.min.toLocaleString('ru-RU')}–${entry.max.toLocaleString('ru-RU')})`,
                'Средняя зарплата'
              ];
            }}
          />
          <Bar dataKey="salary" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
