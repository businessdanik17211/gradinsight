import { motion } from 'framer-motion';
import { VacanciesChart } from '@/components/charts/VacanciesChart';
import { ExportButton } from '@/components/export/ExportButton';
import { useVacancyStats } from '@/hooks/useVacancyStats';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, TrendingUp, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function VacanciesSection() {
  const { stats, loading } = useVacancyStats();

  // Вычисляем статистику из реальных данных
  const totalVacancies = stats.reduce((sum, s) => sum + s.count, 0);
  const topCategory = stats.length > 0 ? stats[0] : null; // Самая большая категория (уже отсортирована)
  const avgSalary = stats.length > 0
    ? stats.reduce((sum, s) => sum + s.avgSalary, 0) / stats.length
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Анализ вакансий</h2>
        <ExportButton type="vacancies" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Всего вакансий</span>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl sm:text-3xl font-bold text-primary">{totalVacancies.toLocaleString()}</p>
          )}
          <p className="text-muted-foreground text-xs sm:text-sm">активных</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Топ категория</span>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{topCategory?.category || '—'}</p>
              <p className="text-accent font-semibold text-sm">{topCategory?.count.toLocaleString() || 0} вакансий</p>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Средняя зарплата</span>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{Math.round(avgSalary).toLocaleString()}</p>
          )}
          <p className="text-muted-foreground text-xs sm:text-sm">BYN</p>
        </motion.div>
      </div>

      {/* Chart */}
      <VacanciesChart />

      {/* Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="chart-container overflow-hidden"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">Детальная статистика вакансий</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : stats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Данные появятся после парсинга вакансий</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-muted-foreground">Категория</TableHead>
                  <TableHead className="text-muted-foreground text-right">Вакансий</TableHead>
                  <TableHead className="text-muted-foreground text-right">Ср. зарплата</TableHead>
                  <TableHead className="text-muted-foreground text-right">Доля</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((stat) => {
                  const percent = totalVacancies > 0 
                    ? ((stat.count / totalVacancies) * 100).toFixed(1) 
                    : '0.0';
                  return (
                    <TableRow 
                      key={stat.category}
                      className="border-border/30 hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground">{stat.category}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {stat.count.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        {stat.avgSalary > 0 ? `${stat.avgSalary.toLocaleString()} BYN` : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "font-semibold",
                          Number(percent) >= 20 ? "text-accent" : 
                          Number(percent) >= 10 ? "text-primary" : "text-muted-foreground"
                        )}>
                          {percent}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
