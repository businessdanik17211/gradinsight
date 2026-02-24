import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowUpDown, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalaryStats {
  id: string;
  category: string;
  specialty_name: string | null;
  city: string | null;
  avg_salary: number;
  min_salary: number | null;
  max_salary: number | null;
  vacancies_count: number | null;
  demand_level: string | null;
  career_growth_potential: string | null;
}

type SortField = 'specialty_name' | 'avg_salary' | 'vacancies_count' | 'demand_level' | 'career_growth_potential';
type SortOrder = 'asc' | 'desc';

export function SpecialtiesComparisonTable() {
  const [stats, setStats] = useState<SalaryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('avg_salary');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterCity, setFilterCity] = useState<string>('all');

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('salary_stats')
        .select('*')
        .eq('year', 2025)
        .order('avg_salary', { ascending: false });

      if (data) {
        setStats(data);
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedStats = stats
    .filter(s => filterCity === 'all' || s.city === filterCity)
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      aVal = aVal ?? 0;
      bVal = bVal ?? 0;
      
      return sortOrder === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });

  const cities = ['all', ...new Set(stats.map(s => s.city).filter(Boolean))];

  const getDemandBadge = (level: string | null) => {
    switch (level) {
      case 'high':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
          <TrendingUp className="w-3 h-3" /> Высокий
        </span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
          <Minus className="w-3 h-3" /> Средний
        </span>;
      case 'low':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-medium">
          <TrendingDown className="w-3 h-3" /> Низкий
        </span>;
      default:
        return <span className="text-muted-foreground text-xs">—</span>;
    }
  };

  const getCareerBadge = (level: string | null) => {
    switch (level) {
      case 'high':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
          Высокий
        </span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
          Средний
        </span>;
      case 'low':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
          Низкий
        </span>;
      default:
        return <span className="text-muted-foreground text-xs">—</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="card-elevated overflow-hidden"
    >
      {/* Filters */}
      <div className="p-4 border-b border-border/50 flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-2">Город:</span>
        {cities.map(city => (
          <Button
            key={city}
            variant={filterCity === city ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCity(city)}
          >
            {city === 'all' ? 'Все' : city}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('specialty_name')}
              >
                <div className="flex items-center gap-2">
                  Специальность
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Город</TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('avg_salary')}
              >
                <div className="flex items-center justify-end gap-2">
                  Ср. зарплата
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('vacancies_count')}
              >
                <div className="flex items-center justify-end gap-2">
                  Вакансий
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead className="text-center">Спрос</TableHead>
              <TableHead className="text-center">Карьера</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStats.map((stat) => (
              <TableRow 
                key={stat.id}
                className="border-border/30 hover:bg-secondary/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {stat.specialty_name || stat.category}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {stat.category}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {stat.city || '—'}
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold text-foreground">
                    {stat.avg_salary.toLocaleString()} BYN
                  </span>
                  {stat.min_salary && stat.max_salary && (
                    <div className="text-xs text-muted-foreground">
                      {stat.min_salary.toLocaleString()} — {stat.max_salary.toLocaleString()}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {stat.vacancies_count?.toLocaleString() || '—'}
                </TableCell>
                <TableCell className="text-center">
                  {getDemandBadge(stat.demand_level)}
                </TableCell>
                <TableCell className="text-center">
                  {getCareerBadge(stat.career_growth_potential)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedStats.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Нет данных для отображения
        </div>
      )}
    </motion.div>
  );
}
