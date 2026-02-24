import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Vacancy {
  id: string;
  title: string;
  company: string | null;
  city: string | null;
  category: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  source_url: string | null;
  parsed_at: string;
}

export function AllVacanciesTable() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchVacancies();
  }, [currentPage]);

  async function fetchVacancies() {
    try {
      setLoading(true);
      
      // Get total count
      const { count } = await supabase
        .from('vacancies')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);
      
      // Get paginated data
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .order('parsed_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
      
      if (error) throw error;
      
      setVacancies(data || []);
    } catch (err) {
      console.error('Error fetching vacancies:', err);
    } finally {
      setLoading(false);
    }
  }

  // Filter by search term
  const filteredVacancies = vacancies.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.company && v.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.city && v.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.category && v.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-4"
    >
      {/* Search and stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию, компании, городу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Всего в базе: <span className="font-semibold text-foreground">{totalCount}</span> вакансий
          {searchTerm && (
            <> • Найдено: <span className="font-semibold text-foreground">{filteredVacancies.length}</span></>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 bg-secondary/50">
                <TableHead className="text-muted-foreground">Вакансия</TableHead>
                <TableHead className="text-muted-foreground">Компания</TableHead>
                <TableHead className="text-muted-foreground">Город</TableHead>
                <TableHead className="text-muted-foreground">Категория</TableHead>
                <TableHead className="text-muted-foreground text-right">Зарплата</TableHead>
                <TableHead className="text-muted-foreground">Источник</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVacancies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    {searchTerm ? 'Нет вакансий, соответствующих поиску' : 'Нет данных'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredVacancies.map((vacancy) => (
                  <TableRow 
                    key={vacancy.id}
                    className="border-border/30 hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{vacancy.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(vacancy.parsed_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vacancy.company || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vacancy.city || '—'}
                    </TableCell>
                    <TableCell>
                      {vacancy.category ? (
                        <Badge variant="secondary" className="text-xs">
                          {vacancy.category}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {vacancy.salary_min || vacancy.salary_max ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">
                            {vacancy.salary_min?.toLocaleString('ru-RU') || '—'} - {vacancy.salary_max?.toLocaleString('ru-RU') || '—'}
                          </span>
                          <span className="text-xs text-muted-foreground">{vacancy.salary_currency}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {vacancy.source_url ? (
                        <a 
                          href={vacancy.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          rabota.by
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            Страница {currentPage} из {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
