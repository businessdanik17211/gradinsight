import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut, ArrowLeft, Settings, Sun, Moon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';

export default function Profile() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Проверяем авторизацию
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из аккаунта.',
    });
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <h1 className="font-serif text-xl font-semibold">Профиль</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Информация о пользователе */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{user.email?.split('@')[0]}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Роль</p>
                    <p className="text-sm text-muted-foreground">
                      {isAdmin ? 'Администратор' : 'Пользователь'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">ID пользователя</p>
                    <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Внешний вид</CardTitle>
                <CardDescription>Выберите тему оформления</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-primary' : ''}`}>Светлая</span>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-primary' : ''}`}>Тёмная</span>
                  </button>

                  <button
                    onClick={() => setTheme('high-contrast')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === 'high-contrast'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Eye className={`w-6 h-6 ${theme === 'high-contrast' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${theme === 'high-contrast' ? 'text-primary' : ''}`}>Для слабовидящих</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Перейти в админ-панель
                    </Button>
                  </Link>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/forgot-password')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Изменить пароль
                </Button>

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти из аккаунта
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
