import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FACULTY_STATS } from '@/data/belarusData';
import { cn } from '@/lib/utils';

export function FacultyTable() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="chart-container overflow-hidden"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Статистика по факультетам</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-muted-foreground">Направление</TableHead>
              <TableHead className="text-muted-foreground text-right">Выпускников</TableHead>
              <TableHead className="text-muted-foreground text-right">Трудоустройство</TableHead>
              <TableHead className="text-muted-foreground text-right">Ср. зарплата</TableHead>
              <TableHead className="text-muted-foreground text-center">Тренд</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FACULTY_STATS.map((faculty, index) => (
              <TableRow 
                key={faculty.name}
                className="border-border/30 hover:bg-secondary/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground">{faculty.name}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {faculty.graduates.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    "font-semibold",
                    faculty.employmentRate >= 90 ? "text-accent" : 
                    faculty.employmentRate >= 80 ? "text-primary" : "text-destructive"
                  )}>
                    {faculty.employmentRate}%
                  </span>
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {faculty.avgSalary.toLocaleString()} BYN
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-full",
                    faculty.trend === 'up' && "bg-accent/20 text-accent",
                    faculty.trend === 'down' && "bg-destructive/20 text-destructive",
                    faculty.trend === 'stable' && "bg-muted text-muted-foreground"
                  )}>
                    {faculty.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                    {faculty.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                    {faculty.trend === 'stable' && <Minus className="w-4 h-4" />}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
