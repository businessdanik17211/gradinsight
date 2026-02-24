import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useVacancyStats } from '@/hooks/useVacancyStats';
import { Skeleton } from '@/components/ui/skeleton';

// Extended color palette for many categories
const COLORS = [
  'hsl(75, 35%, 35%)',   // Olive dark
  'hsl(75, 30%, 45%)',   // Olive medium
  'hsl(45, 40%, 50%)',   // Gold
  'hsl(30, 30%, 50%)',   // Brown
  'hsl(75, 25%, 55%)',   // Olive light
  'hsl(45, 30%, 45%)',   // Dark gold
  'hsl(120, 35%, 40%)',  // Green
  'hsl(200, 35%, 45%)',  // Blue
  'hsl(280, 35%, 45%)',  // Purple
  'hsl(0, 35%, 45%)',    // Red
  'hsl(60, 35%, 45%)',   // Yellow
  'hsl(180, 35%, 45%)',  // Cyan
];

export function VacanciesByCategoryChart() {
  const { stats, loading } = useVacancyStats();

  // Prepare data for chart - show ALL categories
  const data = stats.map(stat => ({
    category: stat.category,
    count: stat.count,
  }));

  // Calculate total vacancies
  const totalVacancies = stats.reduce((sum, s) => sum + s.count, 0);

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
          Вакансии по категориям
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (rabota.by)
          </span>
        </h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="mb-2">Данные появятся после парсинга вакансий</p>
            <p className="text-sm">Запустите парсинг в разделе Администрирование</p>
          </div>
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
      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
        Вакансии по категориям
      </h3>
      <p className="text-sm text-muted-foreground mb-2">
        Данные с rabota.by • {stats.length} категорий • {totalVacancies.toLocaleString('ru-RU')} вакансий всего
      </p>
      
      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
        <div className="bg-secondary/50 rounded p-2 text-center">
          <span className="block text-muted-foreground">Категорий</span>
          <span className="font-bold text-lg">{stats.length}</span>
        </div>
        <div className="bg-secondary/50 rounded p-2 text-center">
          <span className="block text-muted-foreground">Всего вакансий</span>
          <span className="font-bold text-lg text-primary">{totalVacancies.toLocaleString('ru-RU')}</span>
        </div>
        <div className="bg-secondary/50 rounded p-2 text-center">
          <span className="block text-muted-foreground">Топ категория</span>
          <span className="font-bold text-lg">{stats[0]?.count || 0}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: data.length > 6 ? 100 : 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="category" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              angle={data.length > 6 ? -60 : -45}
              textAnchor="end"
              height={data.length > 6 ? 100 : 80}
              interval={0}
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
              formatter={(value: number, name: string, props: any) => {
                const total = data.reduce((sum, d) => sum + d.count, 0);
                const percent = ((value / total) * 100).toFixed(1);
                return [
                  `${value.toLocaleString('ru-RU')} вакансий (${percent}%)`,
                  props.payload.category
                ];
              }}
              labelFormatter={() => ''}
            />
            <Bar dataKey="count" name="Вакансий" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
