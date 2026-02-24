import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FACULTY_STATS } from '@/data/belarusData';

const COLORS = ['#3B82F6', '#14B8A6', '#A855F7', '#F59E0B', '#EF4444', '#6366F1'];

export function EmploymentByFacultyChart() {
  const data = FACULTY_STATS.map(f => ({
    name: f.name,
    rate: f.employmentRate,
    salary: f.avgSalary
  }));

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="chart-container"
    >
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Уровень трудоустройства по факультетам</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            domain={[0, 100]} 
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
            formatter={(value: number) => [`${value}%`, 'Трудоустройство']}
          />
          <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
