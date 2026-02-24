import { motion } from 'framer-motion';
import { VacanciesByCategoryChart } from '@/components/charts/VacanciesByCategoryChart';
import { SalaryByCategoryChart } from '@/components/charts/SalaryByCategoryChart';
import { AllVacanciesTable } from '@/components/AllVacanciesTable';
import { useVacancyStats } from '@/hooks/useVacancyStats';
import { Briefcase, TrendingUp, Wallet, Building2, MapPin } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function VacancyAnalyticsSection() {
  const { stats, loading } = useVacancyStats();

  // Calculate totals
  const totalVacancies = stats.reduce((sum, s) => sum + s.count, 0);
  const totalCategories = stats.length;
  
  // Find top category
  const topCategory = stats.length > 0 ? stats[0] : null;
  
  // Calculate overall average salary
  const categoriesWithSalary = stats.filter(s => s.avgSalary > 0);
  const overallAvgSalary = categoriesWithSalary.length > 0
    ? Math.round(categoriesWithSalary.reduce((sum, s) => sum + s.avgSalary, 0) / categoriesWithSalary.length)
    : 0;

  if (loading) {
    return (
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Аналитика рынка труда
          </h2>
          <p className="text-muted-foreground">
            Данные с rabota.by • Обновлено: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Всего вакансий</span>
            </div>
            <p className="text-3xl font-bold text-primary">{totalVacancies.toLocaleString('ru-RU')}</p>
            <p className="text-muted-foreground text-sm">по {totalCategories} категориям</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <span className="text-muted-foreground text-sm">Топ направление</span>
            </div>
            <p className="text-xl font-bold text-foreground truncate">{topCategory?.category || 'Нет данных'}</p>
            <p className="text-accent font-semibold">{topCategory?.count.toLocaleString('ru-RU') || 0} вакансий</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground text-sm">Средняя зарплата</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{overallAvgSalary.toLocaleString('ru-RU')}</p>
            <p className="text-muted-foreground text-sm">BYN</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Категорий</span>
            </div>
            <p className="text-3xl font-bold text-primary">{totalCategories}</p>
            <p className="text-muted-foreground text-sm">направлений</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <VacanciesByCategoryChart />
          <SalaryByCategoryChart />
        </div>

        {/* Detailed Table */}
        {stats.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="card-elevated p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Детальная статистика по направлениям
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-muted-foreground">Категория</TableHead>
                    <TableHead className="text-muted-foreground text-right">Вакансий</TableHead>
                    <TableHead className="text-muted-foreground text-right">Ср. зарплата</TableHead>
                    <TableHead className="text-muted-foreground text-right">Диапазон</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.map((stat) => (
                    <TableRow 
                      key={stat.category}
                      className="border-border/30 hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground">{stat.category}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {stat.count.toLocaleString('ru-RU')}
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        {stat.avgSalary > 0 
                          ? `${stat.avgSalary.toLocaleString('ru-RU')} BYN`
                          : '—'
                        }
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {stat.avgSalaryMin > 0 && stat.avgSalaryMax > 0
                          ? `${stat.avgSalaryMin.toLocaleString('ru-RU')} - ${stat.avgSalaryMax.toLocaleString('ru-RU')}`
                          : '—'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* All Vacancies Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Все вакансии
          </h3>
          <AllVacanciesTable />
        </motion.div>
      </div>
    </section>
  );
}
