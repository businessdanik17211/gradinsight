import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CITY_STATS } from '@/data/belarusData';

const COLORS = ['#3B82F6', '#14B8A6', '#A855F7', '#F59E0B', '#EF4444', '#6366F1'];

export function GeographyChart() {
  const data = CITY_STATS.map(c => ({
    name: c.name,
    value: c.graduates,
    employmentRate: c.employmentRate,
    avgSalary: c.avgSalary
  }));

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="chart-container"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Распределение выпускников по городам</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value: number, _name: string, props: any) => [
              <div key="tooltip">
                <p>Выпускников: {value.toLocaleString()}</p>
                <p>Трудоустройство: {props.payload.employmentRate}%</p>
                <p>Ср. зарплата: {props.payload.avgSalary} BYN</p>
              </div>,
              props.payload.name
            ]}
          />
          <Legend 
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
