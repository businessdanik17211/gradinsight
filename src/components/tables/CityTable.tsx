import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CITY_STATS } from '@/data/belarusData';
import { cn } from '@/lib/utils';

export function CityTable() {
  const sortedCities = [...CITY_STATS].sort((a, b) => b.graduates - a.graduates);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="chart-container overflow-hidden"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Статистика по городам</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-muted-foreground">Город</TableHead>
              <TableHead className="text-muted-foreground text-right">Выпускников</TableHead>
              <TableHead className="text-muted-foreground text-right">Трудоустройство</TableHead>
              <TableHead className="text-muted-foreground text-right">Ср. зарплата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCities.map((city) => (
              <TableRow 
                key={city.name}
                className="border-border/30 hover:bg-secondary/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground">{city.name}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {city.graduates.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    "font-semibold",
                    city.employmentRate >= 90 ? "text-accent" : 
                    city.employmentRate >= 85 ? "text-primary" : "text-muted-foreground"
                  )}>
                    {city.employmentRate}%
                  </span>
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {city.avgSalary.toLocaleString()} BYN
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
