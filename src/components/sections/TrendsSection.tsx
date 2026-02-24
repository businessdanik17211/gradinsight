import { motion } from 'framer-motion';
import { TrendsChart } from '@/components/charts/TrendsChart';
import { ExportButton } from '@/components/export/ExportButton';
import { YEARLY_TRENDS, INDUSTRY_GROWTH } from '@/data/belarusData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Calendar, Target } from 'lucide-react';

const COLORS = ['#3B82F6', '#14B8A6', '#A855F7', '#F59E0B', '#EF4444', '#6366F1'];

export function TrendsSection() {
  const growthData = Object.entries(INDUSTRY_GROWTH).map(([name, data]) => ({
    name,
    growthRate: data.growthRate,
    vacanciesGrowth: data.vacanciesGrowth
  })).sort((a, b) => b.growthRate - a.growthRate);

  const latestYear = YEARLY_TRENDS[YEARLY_TRENDS.length - 1];
  const prevYear = YEARLY_TRENDS[YEARLY_TRENDS.length - 2];

  const employmentChange = latestYear.employmentRate - prevYear.employmentRate;
  const salaryChange = ((latestYear.avgSalary - prevYear.avgSalary) / prevYear.avgSalary * 100);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Тренды и динамика</h2>
        <ExportButton type="trends" />
      </div>

      {/* Trend Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Изменение трудоустройства</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-accent">+{employmentChange.toFixed(1)}%</p>
          <p className="text-muted-foreground text-xs sm:text-sm">за год</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Рост зарплат</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-primary">+{salaryChange.toFixed(1)}%</p>
          <p className="text-muted-foreground text-xs sm:text-sm">за год</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Период анализа</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">2020-2025</p>
          <p className="text-muted-foreground text-xs sm:text-sm">{YEARLY_TRENDS.length} лет данных</p>
        </motion.div>
      </div>

      {/* Main Trends Chart */}
      <TrendsChart />

      {/* Industry Growth */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="chart-container"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">Темпы роста отраслей (%)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={growthData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={100}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number, name: string) => [
                `${value}%`, 
                name === 'growthRate' ? 'Рост отрасли' : 'Рост вакансий'
              ]}
            />
            <Bar dataKey="growthRate" name="Рост отрасли" radius={[0, 8, 8, 0]}>
              {growthData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
