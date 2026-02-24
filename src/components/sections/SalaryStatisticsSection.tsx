import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSalaryStatistics } from '@/hooks/useSalaryStatistics';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ArrowUpDown, 
  Filter, 
  X, 
  TrendingUp, 
  TrendingDown,
  ExternalLink,
  Wallet
} from 'lucide-react';

type SortField = 'year' | 'region_name' | 'industry_name' | 'avg_salary';
type SortDirection = 'asc' | 'desc';

export function SalaryStatisticsSection() {
  const {
    data,
    loading,
    filters,
    years,
    regions,
    industries,
    categories,
    summary,
    setFilter,
    clearFilters,
  } = useSalaryStatistics();

  const [sortField, setSortField] = useState<SortField>('year');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (aVal === null || aVal === undefined) aVal = '';
    if (bVal === null || bVal === undefined) bVal = '';

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }

    return sortDirection === 'asc' 
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const activeFiltersCount = Object.values(filters).filter(v => v !== null && v !== undefined).length;

  if (loading) {
    return (
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-[400px]" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Статистика заработных плат
          </h2>
          <p className="text-muted-foreground">
            Официальные данные Белстата • {data.length} записей
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Средняя зарплата</span>
            </div>
            <p className="text-3xl font-bold text-primary">
              {summary.avgSalary > 0 ? summary.avgSalary.toLocaleString('ru-RU') : '—'}
            </p>
            <p className="text-muted-foreground text-sm">BYN</p>
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
              <span className="text-muted-foreground text-sm">Максимальная</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {summary.maxSalary > 0 ? summary.maxSalary.toLocaleString('ru-RU') : '—'}
            </p>
            <p className="text-muted-foreground text-sm">BYN</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground text-sm">Минимальная</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {summary.minSalary > 0 ? summary.minSalary.toLocaleString('ru-RU') : '—'}
            </p>
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
                <Filter className="w-5 h-5 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Записей</span>
            </div>
            <p className="text-3xl font-bold text-primary">{summary.count}</p>
            <p className="text-muted-foreground text-sm">после фильтрации</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-4 mb-6"
        >
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm text-muted-foreground mb-1.5 block">Год</label>
              <Select 
                value={filters.year ? String(filters.year) : 'all'} 
                onValueChange={(v) => setFilter('year', v === 'all' ? null : Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все годы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все годы</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-sm text-muted-foreground mb-1.5 block">Область/Город</label>
              <Select 
                value={filters.region || 'all'} 
                onValueChange={(v) => setFilter('region', v === 'all' ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все регионы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все регионы</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-sm text-muted-foreground mb-1.5 block">Категория</label>
              <Select 
                value={filters.category || 'all'} 
                onValueChange={(v) => setFilter('category', v === 'all' ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-sm text-muted-foreground mb-1.5 block">Отрасль</label>
              <Select 
                value={filters.industry || 'all'} 
                onValueChange={(v) => setFilter('industry', v === 'all' ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все отрасли" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все отрасли</SelectItem>
                  {industries.map(ind => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Сбросить ({activeFiltersCount})
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-elevated overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 bg-secondary/50">
                  <TableHead className="cursor-pointer hover:bg-secondary/80" onClick={() => handleSort('year')}>
                    <div className="flex items-center gap-1">
                      Год
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-secondary/80" onClick={() => handleSort('region_name')}>
                    <div className="flex items-center gap-1">
                      Регион
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-secondary/80" onClick={() => handleSort('industry_name')}>
                    <div className="flex items-center gap-1">
                      Отрасль
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-secondary/80" onClick={() => handleSort('avg_salary')}>
                    <div className="flex items-center gap-1">
                      Средняя зарплата
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Источник</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      Нет данных, соответствующих выбранным фильтрам
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((stat) => (
                    <TableRow 
                      key={stat.id}
                      className="border-border/30 hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell className="font-medium">{stat.year}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{stat.region_name}</span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {stat.region_type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{stat.industry_name}</span>
                          {stat.industry_category && (
                            <span className="text-xs text-muted-foreground">
                              {stat.industry_category}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">
                            {stat.avg_salary?.toLocaleString('ru-RU') || '—'} BYN
                          </span>
                          {(stat.min_salary || stat.max_salary) && (
                            <span className="text-xs text-muted-foreground">
                              {stat.min_salary?.toLocaleString('ru-RU') || '0'} - {stat.max_salary?.toLocaleString('ru-RU') || '0'}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {stat.source_url ? (
                          <a 
                            href={stat.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            {stat.source || 'Источник'}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">{stat.source || '—'}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border/50"
        >
          <p className="text-sm text-muted-foreground text-center">
            Данные предоставлены Национальным статистическим комитетом Республики Беларусь (Белстат) и порталом MyFin.by
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            <a 
              href="https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
