import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useVacancyStats } from '@/hooks/useVacancyStats';
import { Skeleton } from '@/components/ui/skeleton';

// Rainbow color palette for salary chart
const COLORS = ['#3B82F6', '#14B8A6', '#A855F7', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#8B5CF6'];

export function SalaryByCategoryChart() {
  const { stats, loading } = useVacancyStats();

  // Prepare data for chart - show ALL categories with salary data
  const data = stats
    .filter(stat => stat.avgSalary > 0)
    .map(stat => ({
      category: stat.category,
      avgMin: stat.avgSalaryMin,
      avgMax: stat.avgSalaryMax,
      avg: stat.avgSalary,
    }));

  if (loading) {
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
        <h3 className="font-serif text-lg font-semibold text-foreground mb-6">
          Средняя зарплата по направлениям
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (rabota.by)
          </span>
        </h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="mb-2">Нет данных о зарплатах</p>
            <p className="text-sm">Данные появятся после парсинга вакансий с указанной зарплатой</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="card-elevated p-6"
    >
      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
        Средняя зарплата по направлениям
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        BYN • Данные с rabota.by
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="category" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `${value.toLocaleString('ru-RU')}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                'avgMin': 'Минимальная',
                'avgMax': 'Максимальная',
                'avg': 'Средняя'
              };
              return [`${value.toLocaleString('ru-RU')} BYN`, labels[name] || name];
            }}
          />
          <Legend 
            formatter={(value) => {
              const labels: Record<string, string> = {
                'avgMin': 'Минимальная',
                'avgMax': 'Максимальная',
                'avg': 'Средняя'
              };
              return labels[value] || value;
            }}
          />
          <Bar dataKey="avgMin" name="avgMin" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-min-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.6} />
            ))}
          </Bar>
          <Bar dataKey="avg" name="avg" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-avg-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
