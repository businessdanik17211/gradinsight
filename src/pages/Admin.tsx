import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Play, RefreshCw, Database, Globe, CheckCircle2, XCircle, Clock, Shield, LogOut, BarChart3, Square } from 'lucide-react';
import { parsingApi, stopParsing } from '@/lib/parsing-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ParseLog {
  id: string;
  type: 'rabota' | 'university';
  status: 'pending' | 'success' | 'error';
  message: string;
  timestamp: Date;
  data?: any;
}

interface ParsingProgress {
  sessionId: number | null;
  currentPage: number;
  totalPages: number;
  totalFound: number;
  newVacancies: number;
  duplicatesSkipped: number;
  status: 'running' | 'completed' | 'error' | 'idle';
  eta: string;
}

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  
  const [isParsingRabota, setIsParsingRabota] = useState(false);
  const [isParsingUniversity, setIsParsingUniversity] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [universityUrl, setUniversityUrl] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [parseLogs, setParseLogs] = useState<ParseLog[]>([]);
  
  // Progress tracking
  const [progress, setProgress] = useState<ParsingProgress>({
    sessionId: null,
    currentPage: 0,
    totalPages: 0,
    totalFound: 0,
    newVacancies: 0,
    duplicatesSkipped: 0,
    status: 'idle',
    eta: ''
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Poll for progress updates
  const pollProgress = useCallback(async (sessionId: number) => {
    try {
      const { data, error } = await supabase
        .from('parsing_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error || !data) return;

      // Calculate ETA
      let eta = '';
      if (data.status === 'running' && data.current_page > 0) {
        const avgTimePerPage = 3.5; // seconds (3s delay + 0.5s processing)
        const remainingPages = Math.max(0, 100 - data.current_page);
        const remainingSeconds = remainingPages * avgTimePerPage;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = Math.floor(remainingSeconds % 60);
        eta = minutes > 0 ? `~${minutes} мин ${seconds} сек` : `~${seconds} сек`;
      }

      setProgress({
        sessionId,
        currentPage: data.current_page || 0,
        totalPages: data.total_pages || 100,
        totalFound: data.total_found || 0,
        newVacancies: data.new_vacancies || 0,
        duplicatesSkipped: data.duplicates_skipped || 0,
        status: data.status as ParsingProgress['status'],
        eta
      });

      // Continue polling if still running
      if (data.status === 'running') {
        setTimeout(() => pollProgress(sessionId), 2000);
      }
    } catch (error) {
      console.error('Error polling progress:', error);
    }
  }, []);

  const categories = [
    { value: 'ИТ', label: 'IT / Информационные технологии' },
    { value: 'Медицина', label: 'Медицина' },
    { value: 'Инженерия', label: 'Инженерия' },
    { value: 'Экономика', label: 'Экономика / Финансы' },
    { value: 'Педагогика', label: 'Педагогика / Образование' },
    { value: 'Юриспруденция', label: 'Юриспруденция' },
  ];

  const addLog = (log: Omit<ParseLog, 'id' | 'timestamp'>) => {
    setParseLogs(prev => [{
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }, ...prev].slice(0, 50));
  };

  const resetProgress = () => {
    setProgress({
      sessionId: null,
      currentPage: 0,
      totalPages: 0,
      totalFound: 0,
      newVacancies: 0,
      duplicatesSkipped: 0,
      status: 'idle',
      eta: ''
    });
  };

  const handleStopParsing = async () => {
    stopParsing();
    setIsParsingRabota(false);
    
    addLog({
      type: 'rabota',
      status: 'error',
      message: 'Парсинг остановлен пользователем'
    });
    
    toast({
      title: 'Парсинг остановлен',
      description: 'Парсинг был прерван пользователем'
    });
  };

  const handleParseRabota = async () => {
    if (!isAdmin) {
      toast({
        title: 'Доступ запрещён',
        description: 'Только администраторы могут запускать парсинг',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: 'Выберите категорию',
        description: 'Необходимо выбрать категорию вакансий для парсинга',
        variant: 'destructive'
      });
      return;
    }

    setIsParsingRabota(true);
    resetProgress();
    
    addLog({
      type: 'rabota',
      status: 'pending',
      message: `Начат парсинг вакансий категории "${selectedCategory}"...`
    });

    try {
      const result = await parsingApi.parseRabota(selectedCategory);
      
      if (result.success && result.data?.session_id) {
        // Start polling for progress
        setProgress(prev => ({ ...prev, sessionId: result.data.session_id, status: 'running' }));
        pollProgress(result.data.session_id);
        
        addLog({
          type: 'rabota',
          status: 'success',
          message: result.message || `Парсинг запущен (сессия #${result.data.session_id})`,
          data: result.data
        });
        
        toast({
          title: 'Парсинг запущен',
          description: `Собираем данные по категории "${selectedCategory}". Это может занять 5-30 минут.`
        });
      } else {
        addLog({
          type: 'rabota',
          status: 'error',
          message: result.error || 'Неизвестная ошибка'
        });
        toast({
          title: 'Ошибка парсинга',
          description: result.error,
          variant: 'destructive'
        });
        setIsParsingRabota(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка соединения';
      addLog({
        type: 'rabota',
        status: 'error',
        message: errorMessage
      });
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive'
      });
      setIsParsingRabota(false);
    }
  };

  const handleParseUniversity = async () => {
    if (!isAdmin) {
      toast({
        title: 'Доступ запрещён',
        description: 'Только администраторы могут запускать парсинг',
        variant: 'destructive'
      });
      return;
    }

    if (!universityUrl) {
      toast({
        title: 'Введите URL',
        description: 'Необходимо указать URL сайта университета',
        variant: 'destructive'
      });
      return;
    }

    setIsParsingUniversity(true);
    addLog({
      type: 'university',
      status: 'pending',
      message: `Начат парсинг университета: ${universityName || universityUrl}...`
    });

    try {
      const result = await parsingApi.parseUniversity(universityUrl, universityName);
      
      if (result.success) {
        addLog({
          type: 'university',
          status: 'success',
          message: result.message || `Парсинг завершён успешно`,
          data: result.data
        });
        toast({
          title: 'Парсинг завершён',
          description: result.message
        });
      } else {
        addLog({
          type: 'university',
          status: 'error',
          message: result.error || 'Неизвестная ошибка'
        });
        toast({
          title: 'Ошибка парсинга',
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка соединения';
      addLog({
        type: 'university',
        status: 'error',
        message: errorMessage
      });
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsParsingUniversity(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusIcon = (status: ParseLog['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  // Check if parsing is still running when component mounts
  useEffect(() => {
    const checkRunningSessions = async () => {
      const { data } = await supabase
        .from('parsing_sessions')
        .select('*')
        .eq('status', 'running')
        .order('started_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setIsParsingRabota(true);
        pollProgress(data[0].id);
      }
    };

    if (isAdmin) {
      checkRunningSessions();
    }
  }, [isAdmin, pollProgress]);

  // Watch for progress completion
  useEffect(() => {
    if (progress.status === 'completed' || progress.status === 'error') {
      setIsParsingRabota(false);
      
      if (progress.status === 'completed') {
        addLog({
          type: 'rabota',
          status: 'success',
          message: `Парсинг завершён! Найдено: ${progress.totalFound}, Сохранено: ${progress.newVacancies}, Дубликатов: ${progress.duplicatesSkipped}`,
        });
        toast({
          title: 'Парсинг завершён',
          description: `Собрано ${progress.newVacancies} новых вакансий`
        });
      }
    }
  }, [progress.status, progress.totalFound, progress.newVacancies, progress.duplicatesSkipped]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const progressPercent = progress.totalPages > 0 
    ? Math.min((progress.currentPage / progress.totalPages) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                  Панель администратора
                </h1>
                <p className="text-muted-foreground">
                  Управление парсингом данных с внешних источников
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className={`w-5 h-5 ${isAdmin ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm">
                    {isAdmin ? (
                      <Badge className="bg-primary">Администратор</Badge>
                    ) : (
                      <Badge variant="secondary">Пользователь</Badge>
                    )}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Вы вошли как: {user.email}
            </p>
          </motion.div>

          {!isAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-6 bg-accent/50 rounded-2xl border border-border"
            >
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Доступ ограничен</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Для запуска парсинга необходимы права администратора. 
                    Свяжитесь с администратором системы для получения доступа.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ваш ID пользователя: <code className="bg-muted px-1 rounded">{user.id}</code>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Rabota.by Parsing */}
            <Card className={!isAdmin ? 'opacity-60' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Парсинг вакансий (rabota.by)
                </CardTitle>
                <CardDescription>
                  Получение актуальных данных о вакансиях и зарплатах по категориям
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Категория</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={!isAdmin || isParsingRabota}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию вакансий" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Progress Bar */}
                {isParsingRabota && progress.status === 'running' && (
                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Прогресс парсинга</span>
                      <span className="text-muted-foreground">
                        Страница {progress.currentPage} / {progress.totalPages || '?'}
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <div className="text-xs text-muted-foreground text-center">
                      Осталось: {progress.eta || 'вычисляется...'}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                {(isParsingRabota || progress.status === 'completed') && progress.totalFound > 0 && (
                  <div className="grid grid-cols-3 gap-2 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{progress.totalFound}</div>
                      <div className="text-xs text-muted-foreground">Найдено</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{progress.newVacancies}</div>
                      <div className="text-xs text-muted-foreground">Новых</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">{progress.duplicatesSkipped}</div>
                      <div className="text-xs text-muted-foreground">Дубликатов</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleParseRabota} 
                    disabled={isParsingRabota || !selectedCategory || !isAdmin}
                    className="flex-1"
                  >
                    {isParsingRabota ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Парсинг {progress.currentPage > 0 && `(стр. ${progress.currentPage})`}...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Запустить парсинг
                      </>
                    )}
                  </Button>
                  
                  {isParsingRabota && (
                    <Button 
                      onClick={handleStopParsing}
                      variant="destructive"
                      className="px-4"
                      title="Остановить парсинг"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Стоп
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  ⚠️ Парсит все доступные страницы (~5-30 минут). Используется защита от блокировки (3 сек между запросами).
                </p>
              </CardContent>
            </Card>

            {/* University Parsing */}
            <Card className={!isAdmin ? 'opacity-60' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Парсинг университетов
                </CardTitle>
                <CardDescription>
                  Сбор информации о факультетах и специальностях с сайтов вузов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">URL сайта</label>
                  <Input 
                    value={universityUrl}
                    onChange={(e) => setUniversityUrl(e.target.value)}
                    placeholder="https://bsu.by"
                    disabled={!isAdmin}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Название (опционально)</label>
                  <Input 
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                    placeholder="БГУ"
                    disabled={!isAdmin}
                  />
                </div>
                <Button 
                  onClick={handleParseUniversity} 
                  disabled={isParsingUniversity || !universityUrl || !isAdmin}
                  className="w-full"
                >
                  {isParsingUniversity ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Парсинг...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Запустить парсинг
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Парсинг ищет страницы для абитуриентов и извлекает структуру факультетов.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Parse Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Журнал операций
                </span>
                {parseLogs.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setParseLogs([])}
                  >
                    Очистить
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {parseLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Журнал пуст. {isAdmin ? 'Запустите парсинг для просмотра результатов.' : 'Для запуска парсинга нужны права администратора.'}
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {parseLogs.map(log => (
                    <div 
                      key={log.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      {getStatusIcon(log.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={log.type === 'rabota' ? 'default' : 'secondary'}>
                            {log.type === 'rabota' ? 'Вакансии' : 'Университет'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{log.message}</p>
                        {log.data && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              Показать данные
                            </summary>
                            <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto max-h-40">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <FooterSection onNavigate={() => {}} />
    </div>
  );
};

export default Admin;
