import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Проверяем, что пользователь пришел по ссылке из email
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      toast({
        title: 'Ошибка',
        description: 'Недействительная или просроченная ссылка для сброса пароля',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен содержать минимум 6 символов',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const { error } = await updatePassword(password);

    if (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setIsSuccess(true);
      toast({
        title: 'Успех!',
        description: 'Ваш пароль успешно изменен.',
      });
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card-elevated p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="font-serif text-2xl font-semibold mb-2">
              Пароль изменен
            </h1>
            <p className="text-muted-foreground mb-6">
              Ваш пароль успешно обновлен. Теперь вы можете войти с новым паролем.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="w-full btn-primary"
            >
              Войти
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к входу
        </Button>

        <div className="card-elevated p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-semibold">
              Новый пароль
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Придумайте новый пароль для вашего аккаунта
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Новый пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Минимум 6 символов
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading ? (
                'Обновление...'
              ) : (
                'Установить новый пароль'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
