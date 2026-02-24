import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Users, Building2, GraduationCap } from 'lucide-react';
import { ProfessionService } from '@/services/professionService';
import type { ProfessionAnalytics, ProfessionStats, DemandLevel, ProfessionCategory } from '@/types/professions';
import { ProfessionCard } from '@/components/cards/ProfessionCard';
import { DemandIndicator } from '@/components/cards/DemandIndicator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const demandFilters: { value: DemandLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'high', label: 'Высокий спрос' },
  { value: 'medium', label: 'Средний спрос' },
  { value: 'low', label: 'Низкий спрос' },
];

const categoryFilters: { value: ProfessionCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Все категории' },
  { value: 'worker', label: 'Рабочие' },
  { value: 'employee', label: 'Служащие' },
  { value: 'specialist', label: 'Специалисты' },
];

export function ProfessionsSection() {
  const [professions, setProfessions] = useState<ProfessionAnalytics[]>([]);
  const [stats, setStats] = useState<ProfessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDemand, setSelectedDemand] = useState<DemandLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ProfessionCategory | 'all'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [professionsData, statsData] = await Promise.all([
        ProfessionService.getProfessions(),
        ProfessionService.getStats(),
      ]);
      
      setProfessions(professionsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading professions:', err);
      setError('Не удалось загрузить данные о профессиях. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessions = professions.filter((profession) => {
    const matchesSearch = !searchQuery || 
      profession.profession_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profession.description && profession.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDemand = selectedDemand === 'all' || profession.demand_level === selectedDemand;
    const matchesCategory = selectedCategory === 'all' || profession.category === selectedCategory;
    
    return matchesSearch && matchesDemand && matchesCategory;
  });

  const topProfessions = professions.slice(0, 5);

  if (loading) {
    return (
      <section className="py-16">
        <div className="section-container">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="section-container">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={loadData} className="mt-4">
            Попробовать снова
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-card">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Востребованные профессии 2026
            </h2>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Прогноз востребованности профессий в Беларуси на 2026 год на основе данных 
            Минтруда, Мингорисполкома и анализа рынка труда.
          </p>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground">профессий в базе</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">{stats.byDemand.high}</p>
                <p className="text-sm text-muted-foreground">с высоким спросом</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">{stats.avgSalary.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">средняя зарплата (BYN)</p>
              </div>
              <div className="bg-amber-500/10 rounded-lg p-4">
                <p className="text-2xl font-bold text-amber-600">{stats.byDemand.low}</p>
                <p className="text-sm text-muted-foreground">с низким спросом</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Top Professions Quick View */}
        {topProfessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Топ профессий по рейтингу
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {topProfessions.map((profession, index) => (
                <div
                  key={profession.id}
                  className="bg-background border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <DemandIndicator level={profession.demand_level} showLabel={false} size="sm" />
                  </div>
                  <p className="font-medium text-foreground line-clamp-2">
                    {profession.profession_name}
                  </p>
                  {profession.avg_salary && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {profession.avg_salary.toLocaleString()} BYN
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Поиск профессии..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {demandFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={selectedDemand === filter.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDemand(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {categoryFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedCategory === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Найдено профессий: <span className="font-medium text-foreground">{filteredProfessions.length}</span>
          </p>
        </div>

        {/* Professions Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProfessions.map((profession) => (
            <ProfessionCard
              key={profession.id}
              profession={profession}
              onClick={(p) => console.log('Clicked:', p.profession_name)}
            />
          ))}
        </motion.div>

        {filteredProfessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
