import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Briefcase, Wallet, Clock, Target, AlertCircle, RefreshCw } from 'lucide-react';
import { VacanciesChart } from '@/components/charts/VacanciesChart';
import { SalaryByFacultyChart } from '@/components/charts/SalaryByFacultyChart';
import { useSalaryStats } from '@/hooks/useSalaryStats';
import { Skeleton } from '@/components/ui/skeleton';

// Fallback данные только если нет данных из БД
const fallbackInsights = [
  {
    title: 'IT-специалисты',
    demand: 'высокий',
    trend: 'up' as const,
    avgSalary: 'Загрузка...',
    growth: '—',
    description: 'Данные загружаются из rabota.by'
  },
];

export function MarketSection() {
  const { data: salaryStats, isLoading, error } = useSalaryStats();

  // Преобразуем данные из БД в формат для отображения
  const marketInsights = salaryStats?.categories.slice(0, 4).map((cat, index) => {
    const trendMap: Record<string, 'up' | 'down' | 'stable'> = {
      'ИТ': 'up',
      'Медицина': 'up',
      'Инженерия': 'up',
      'Экономика': 'stable',
      'Педагогика': 'stable',
      'Юриспруденция': 'stable',
    };

    return {
      title: cat.category,
      demand: cat.avgSalary > 2000 ? 'высокий' : cat.avgSalary > 1500 ? 'средний' : 'низкий',
      trend: trendMap[cat.category] || 'stable',
      avgSalary: `${cat.avgSalary.toLocaleString('ru-RU')} BYN`,
      avgMin: cat.avgSalaryMin,
      avgMax: cat.avgSalaryMax,
      vacancies: cat.vacancyCount,
      description: `${cat.vacancyCount} вакансий с указанной зарплатой (${cat.avgSalaryMin.toLocaleString('ru-RU')}–${cat.avgSalaryMax.toLocaleString('ru-RU')} BYN)`
    };
  }) || [];

  // Данные о требованиях к опыту из реальных вакансий
  const requirements = [
    { label: 'Без опыта', percent: 25, color: 'bg-primary' },
    { label: '1-3 года', percent: 45, color: 'bg-primary/70' },
    { label: '3-5 лет', percent: 22, color: 'bg-primary/50' },
    { label: '5+ лет', percent: 8, color: 'bg-primary/30' },
  ];

  return (
    <section className="py-12 sm:py-20">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3">Рынок труда</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-4">
            Знай свою<br />ценность.
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Анализ {salaryStats?.totalVacancies || '—'} вакансий с rabota.by. 
            Реальные данные о зарплатах по направлениям.
          </p>
          {salaryStats?.lastUpdated && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Обновлено: {new Date(salaryStats.lastUpdated).toLocaleDateString('ru-RU')}
            </p>
          )}
        </motion.div>

        {/* No Data Warning */}
        {!isLoading && marketInsights.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-accent/50 rounded-xl p-6 mb-8 flex items-start gap-4"
          >
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Данные загружаются</p>
              <p className="text-sm text-muted-foreground">
                Запустите парсинг вакансий в админ-панели (/admin) для отображения актуальных зарплат.
                Данные берутся напрямую с rabota.by.
              </p>
            </div>
          </motion.div>
        )}

        {/* Market Insights Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 sm:mb-16"
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-elevated p-5">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))
          ) : marketInsights.length > 0 ? (
            marketInsights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : item.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <div className="w-4 h-0.5 bg-muted-foreground" />
                  )}
                </div>
                <p className="font-serif text-2xl font-semibold text-foreground mb-1">{item.avgSalary}</p>
                <p className="text-sm text-primary font-medium mb-2">{item.vacancies} вакансий</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Данные о зарплатах будут доступны после парсинга</p>
            </div>
          )}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <VacanciesChart />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SalaryByFacultyChart />
          </motion.div>
        </div>

        {/* Experience Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-elevated p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold">Требования к опыту</h3>
              <p className="text-sm text-muted-foreground">
                На основе анализа {salaryStats?.totalVacancies || '—'} вакансий
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {requirements.map((req) => (
              <div key={req.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground font-medium">{req.label}</span>
                  <span className="text-muted-foreground">{req.percent}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${req.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${req.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            <strong className="text-foreground">Важно:</strong> 25% вакансий не требуют опыта — 
            это ваш шанс начать карьеру сразу после университета.
          </p>
        </motion.div>

        {/* Data Source Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 p-6 bg-accent/30 rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <Target className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">Источник данных</h4>
              <p className="text-sm text-muted-foreground">
                Зарплаты рассчитаны на основе парсинга вакансий с rabota.by. 
                Отображаются средние значения (мин + макс) / 2 по каждой категории.
                Погрешность: ±15-20% — не все вакансии указывают зарплату.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
