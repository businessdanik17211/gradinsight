import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus, GraduationCap, Users, Award, BookOpen, Filter, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface AdmissionStatsProps {
  isChatOpen?: boolean;
  onChatToggle?: (open: boolean) => void;
}

const AdmissionStats = ({ isChatOpen = false }: AdmissionStatsProps) => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Fetch universities
  const { data: universities } = useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('universities')
        .select('id, short_name, full_name')
        .order('short_name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch faculties based on selected university
  const { data: faculties } = useQuery({
    queryKey: ['faculties', selectedUniversity],
    queryFn: async () => {
      let query = supabase
        .from('faculties')
        .select('id, name, university_id')
        .order('name');
      
      if (selectedUniversity !== 'all') {
        query = query.eq('university_id', selectedUniversity);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch admission stats
  const { data: admissionStats, isLoading } = useQuery({
    queryKey: ['admission-stats', selectedUniversity, selectedYear, selectedFaculty],
    queryFn: async () => {
      let query = supabase
        .from('admission_stats')
        .select(`
          *,
          specialties:specialty_id (
            name,
            code,
            faculties:faculty_id (
              name,
              universities:university_id (
                id,
                short_name
              )
            )
          )
        `)
        .order('year', { ascending: false });

      if (selectedYear !== 'all') {
        query = query.eq('year', parseInt(selectedYear));
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Filter by university and faculty
      let filtered = data;
      if (selectedUniversity !== 'all') {
        filtered = filtered?.filter(stat => 
          stat.specialties?.faculties?.universities?.id === selectedUniversity
        );
      }
      
      if (selectedFaculty !== 'all') {
        filtered = filtered?.filter(stat => 
          (stat.specialties as any)?.faculties?.id === selectedFaculty || 
          faculties?.find(f => f.id === selectedFaculty && stat.specialties?.faculties?.name === f.name)
        );
      }
      
      return filtered;
    }
  });

  // Get unique cities from universities
  const cities = ['Минск', 'Гомель', 'Гродно', 'Брест', 'Витебск', 'Могилёв'];

  // Calculate aggregated stats
  const aggregatedStats = admissionStats?.reduce((acc, stat) => {
    acc.totalBudgetPlaces += stat.budget_places || 0;
    acc.totalPaidPlaces += stat.paid_places || 0;
    acc.totalApplications += stat.applications_count || 0;
    acc.totalEnrolled += stat.enrolled_count || 0;
    if (stat.avg_score) {
      acc.avgScores.push(Number(stat.avg_score));
    }
    if (stat.min_score) {
      acc.minScores.push(Number(stat.min_score));
    }
    return acc;
  }, {
    totalBudgetPlaces: 0,
    totalPaidPlaces: 0,
    totalApplications: 0,
    totalEnrolled: 0,
    avgScores: [] as number[],
    minScores: [] as number[]
  });

  const avgScore = aggregatedStats?.avgScores.length 
    ? (aggregatedStats.avgScores.reduce((a: number, b: number) => a + b, 0) / aggregatedStats.avgScores.length).toFixed(1)
    : 'Н/Д';

  const minScore = aggregatedStats?.minScores.length
    ? Math.min(...aggregatedStats.minScores).toFixed(1)
    : 'Н/Д';

  const competition = aggregatedStats && aggregatedStats.totalBudgetPlaces > 0
    ? (aggregatedStats.totalApplications / aggregatedStats.totalBudgetPlaces).toFixed(1)
    : 'Н/Д';

  // Prepare chart data by grouping stats by year for comparison
  const prepareChartData = () => {
    if (!admissionStats) return [];
    
    const yearData: Record<string, any> = {};
    
    admissionStats.forEach(stat => {
      const year = stat.year.toString();
      if (!yearData[year]) {
        yearData[year] = {
          year,
          budgetPlaces: 0,
          paidPlaces: 0,
          applications: 0,
          avgScores: [] as number[],
          minScores: [] as number[]
        };
      }
      yearData[year].budgetPlaces += stat.budget_places || 0;
      yearData[year].paidPlaces += stat.paid_places || 0;
      yearData[year].applications += stat.applications_count || 0;
      if (stat.avg_score) yearData[year].avgScores.push(Number(stat.avg_score));
      if (stat.min_score) yearData[year].minScores.push(Number(stat.min_score));
    });
    
    return Object.values(yearData).map((item: any) => ({
      ...item,
      avgScore: item.avgScores.length 
        ? (item.avgScores.reduce((a: number, b: number) => a + b, 0) / item.avgScores.length).toFixed(1)
        : null,
      minScore: item.minScores.length 
        ? Math.min(...item.minScores).toFixed(1)
        : null
    })).sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year));
  };

  const chartDataArray = prepareChartData();

  const years = ['2025', '2024', '2023', '2022', '2021', '2020'];

  return (
    <div className="min-h-screen bg-background">
      <Header chatOpen={isChatOpen} />
      
      <motion.main
        animate={{
          marginRight: isChatOpen ? '450px' : '0px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="pt-24 pb-16 relative"
      >
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  Статистика поступления
                </h1>
                <p className="text-muted-foreground">
                  Проходные баллы, конкурс и количество мест по годам
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Год" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все годы</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedUniversity} onValueChange={(v) => {
                  setSelectedUniversity(v);
                  setSelectedFaculty('all'); // Reset faculty when university changes
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Университет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все университеты</SelectItem>
                    {universities?.map(uni => (
                      <SelectItem key={uni.id} value={uni.id}>{uni.short_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Факультет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все факультеты</SelectItem>
                    {faculties?.map(fac => (
                      <SelectItem key={fac.id} value={fac.id}>
                        {fac.name.length > 30 ? fac.name.substring(0, 30) + '...' : fac.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedUniversity !== 'all' || selectedFaculty !== 'all' || selectedYear !== 'all') && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Активные фильтры:</span>
                {selectedYear !== 'all' && (
                  <Badge variant="secondary">{selectedYear} год</Badge>
                )}
                {selectedUniversity !== 'all' && (
                  <Badge variant="secondary">
                    {universities?.find(u => u.id === selectedUniversity)?.short_name}
                  </Badge>
                )}
                {selectedFaculty !== 'all' && (
                  <Badge variant="secondary">
                    {faculties?.find(f => f.id === selectedFaculty)?.name?.substring(0, 25)}...
                  </Badge>
                )}
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Бюджетных мест</p>
                      <p className="text-2xl font-bold">{aggregatedStats?.totalBudgetPlaces || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <BookOpen className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Платных мест</p>
                      <p className="text-2xl font-bold">{aggregatedStats?.totalPaidPlaces || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Award className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Средний балл</p>
                      <p className="text-2xl font-bold">{avgScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Users className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Конкурс (чел/место)</p>
                      <p className="text-2xl font-bold">{competition}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="table" className="space-y-6">
              <TabsList>
                <TabsTrigger value="table">Таблица</TabsTrigger>
                <TabsTrigger value="charts">Графики</TabsTrigger>
              <TabsTrigger value="comparison">Сравнение по годам</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
                <Card>
                  <CardHeader>
                    <CardTitle>Детальная статистика по специальностям</CardTitle>
                    <CardDescription>
                      Данные о проходных баллах и количестве мест
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : admissionStats && admissionStats.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Специальность</TableHead>
                              <TableHead>Университет</TableHead>
                              <TableHead className="text-center">Год</TableHead>
                              <TableHead className="text-right">Бюджет</TableHead>
                              <TableHead className="text-right">Платное</TableHead>
                              <TableHead className="text-right">Мин. балл</TableHead>
                              <TableHead className="text-right">Ср. балл</TableHead>
                              <TableHead className="text-right">Заявок</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {admissionStats.map((stat) => (
                              <TableRow key={stat.id}>
                                <TableCell className="font-medium max-w-[200px]">
                                  <div className="truncate" title={stat.specialties?.name}>
                                    {stat.specialties?.name || 'Н/Д'}
                                  </div>
                                  {stat.specialties?.code && (
                                    <span className="text-xs text-muted-foreground">
                                      {stat.specialties.code}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {stat.specialties?.faculties?.universities?.short_name || 'Н/Д'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">{stat.year}</TableCell>
                                <TableCell className="text-right">{stat.budget_places ?? '—'}</TableCell>
                                <TableCell className="text-right">{stat.paid_places ?? '—'}</TableCell>
                                <TableCell className="text-right">
                                  {stat.min_score ? parseFloat(String(stat.min_score)).toFixed(1) : '—'}
                                </TableCell>
                                <TableCell className="text-right">
                                  {stat.avg_score ? parseFloat(String(stat.avg_score)).toFixed(1) : '—'}
                                </TableCell>
                                <TableCell className="text-right">{stat.applications_count ?? '—'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>Нет данных для отображения.</p>
                        <p className="text-sm mt-2">
                          Данные загружаются из базы. Убедитесь, что таблица admission_stats заполнена.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="charts">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Динамика количества мест</CardTitle>
                      <CardDescription>Бюджетные и платные места по годам</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {chartDataArray.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartDataArray}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="year" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="budgetPlaces" name="Бюджет" fill="hsl(var(--primary))" />
                            <Bar dataKey="paidPlaces" name="Платное" fill="hsl(var(--muted-foreground))" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                          Нет данных для графика
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Динамика проходных баллов</CardTitle>
                      <CardDescription>Средний проходной балл по годам</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {chartDataArray.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartDataArray}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="year" className="text-xs" />
                            <YAxis domain={['auto', 'auto']} className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="avgScore" 
                              name="Средний балл"
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--primary))' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                          Нет данных для графика
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Минимальные проходные баллы</CardTitle>
                      <CardDescription>Динамика минимальных баллов по годам</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {chartDataArray.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartDataArray}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="year" className="text-xs" />
                            <YAxis domain={['auto', 'auto']} className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="minScore" 
                              name="Мин. балл"
                              stroke="hsl(var(--accent))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--accent))' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="avgScore" 
                              name="Средний балл"
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--primary))' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                          Нет данных для графика
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="comparison">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Сравнение проходных баллов по годам
                    </CardTitle>
                    <CardDescription>
                      Выберите специальность для детального сравнения показателей за разные годы
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chartDataArray.length > 1 ? (
                      <div className="space-y-6">
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={chartDataArray}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="year" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="budgetPlaces" name="Бюджет" fill="hsl(var(--primary))" />
                            <Bar dataKey="paidPlaces" name="Платное" fill="hsl(var(--muted-foreground))" />
                            <Bar dataKey="applications" name="Заявки" fill="hsl(var(--accent))" />
                          </BarChart>
                        </ResponsiveContainer>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {chartDataArray.map((yearData: any) => (
                            <Card key={yearData.year} className="bg-muted/30">
                              <CardContent className="pt-4">
                                <h4 className="text-lg font-bold mb-2">{yearData.year}</h4>
                                <div className="space-y-1 text-sm">
                                  <p>Бюджет: <span className="font-medium">{yearData.budgetPlaces}</span></p>
                                  <p>Платное: <span className="font-medium">{yearData.paidPlaces || 0}</span></p>
                                  <p>Ср. балл: <span className="font-medium">{yearData.avgScore || 'Н/Д'}</span></p>
                                  <p>Мин. балл: <span className="font-medium">{yearData.minScore || 'Н/Д'}</span></p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                        <p>Для сравнения нужны данные за несколько лет</p>
                        <p className="text-sm mt-2">Выберите "Все годы" в фильтре для просмотра сравнения</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Data Source Notice */}
            <Card className="mt-6 bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Источник данных:</strong> Статистика загружается из базы данных. 
                  Для обновления данных используйте парсинг в панели администратора или 
                  добавьте данные вручную. Отображаются только реальные данные из таблицы admission_stats.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.main>

      <FooterSection onNavigate={() => {}} />
    </div>
  );
};

export default AdmissionStats;
