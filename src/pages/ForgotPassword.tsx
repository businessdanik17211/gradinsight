import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setIsSent(true);
      toast({
        title: 'Письмо отправлено',
        description: 'Проверьте вашу почту для сброса пароля.',
      });
    }

    setIsLoading(false);
  };

  if (isSent) {
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

          <div className="card-elevated p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="font-serif text-2xl font-semibold mb-2">
              Проверьте почту
            </h1>
            <p className="text-muted-foreground mb-6">
              Мы отправили ссылку для сброса пароля на адрес {email}
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="w-full btn-primary"
            >
              Вернуться к входу
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
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-semibold">
              Восстановление пароля
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Введите ваш email, и мы отправим ссылку для сброса пароля
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading ? (
                'Отправка...'
              ) : (
                'Отправить ссылку для сброса'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Вспомнили пароль?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary hover:underline font-medium"
              >
                Войти
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
