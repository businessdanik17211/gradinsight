import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { YEARLY_TRENDS } from '@/data/belarusData';

export function TrendsChart() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="chart-container"
    >
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Динамика трудоустройства и зарплат</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={YEARLY_TRENDS}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            yAxisId="left"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            domain={[80, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            domain={[1000, 2500]}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="employmentRate" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2 }}
            name="Трудоустройство (%)"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="avgSalary" 
            stroke="#14B8A6" 
            strokeWidth={3}
            dot={{ fill: '#14B8A6', strokeWidth: 2 }}
            name="Ср. зарплата (BYN)"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
