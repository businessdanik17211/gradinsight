import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, User, LogOut, LogIn, Shield, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  chatOpen?: boolean;
}

const navItems = [
  { id: '/', label: 'Главная', isRoute: true },
  { id: '/applicants', label: 'Абитуриентам', isRoute: true },
  { id: '/students', label: 'Студентам', isRoute: true },
  { id: '/statistics', label: 'Аналитика', isRoute: true },
  { id: '/admission-stats', label: 'Поступление', isRoute: true },
];

export function Header({ activeSection, onSectionChange, chatOpen = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();

  const handleNavClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    setMobileOpen(false);
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из аккаунта.',
    });
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300"
      style={{ marginRight: chatOpen ? '450px' : '0px' }}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
                GradInsight
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.id}
                  className={cn(
                    "text-sm font-medium transition-colors relative py-2",
                    isActiveRoute(item.id)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {isActiveRoute(item.id) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Actions */}
          {!isMobile && (
            <div className="flex items-center gap-4">
              {user ? (
                // Меню авторизованного пользователя
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="hidden lg:inline text-sm font-medium">
                        {user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.email}
                    </div>
                    {isAdmin && (
                      <div className="px-2 py-1 text-xs text-primary">
                        <Shield className="w-3 h-3 inline mr-1" />
                        Администратор
                      </div>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <UserCircle className="w-4 h-4 mr-2" />
                      Профиль
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="w-4 h-4 mr-2" />
                        Админ-панель
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Кнопка входа для неавторизованных
                <Button
                  variant="outline"
                  onClick={handleSignIn}
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden lg:inline">Войти</span>
                </Button>
              )}

              {/* CTA Button - hidden when chat is open */}
              {!chatOpen && (
                <Link to="/applicants">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    Выбрать профессию
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-background border-b border-border overflow-hidden"
          >
            <nav className="section-container py-4 space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.id}
                  onClick={() => setMobileOpen(false)}
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl transition-colors text-base font-medium",
                      isActiveRoute(item.id)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              ))}

              {/* Мобильное меню пользователя */}
              {user ? (
                <>
                  <div className="border-t border-border my-3" />
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="px-4 py-2"
                  >
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                    {isAdmin && (
                      <p className="text-xs text-primary mt-1">
                        <Shield className="w-3 h-3 inline mr-1" />
                        Администратор
                      </p>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => {
                      navigate('/profile');
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl transition-colors text-base font-medium text-muted-foreground hover:bg-secondary cursor-pointer"
                  >
                    <UserCircle className="w-4 h-4 inline mr-2" />
                    Профиль
                  </motion.div>
                  {isAdmin && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      onClick={() => {
                        navigate('/admin');
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl transition-colors text-base font-medium text-muted-foreground hover:bg-secondary cursor-pointer"
                    >
                      <Shield className="w-4 h-4 inline mr-2" />
                      Админ-панель
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => {
                      handleSignOut();
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl transition-colors text-base font-medium text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Выйти
                  </motion.div>
                </>
              ) : (
                <>
                  <div className="border-t border-border my-3" />
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    onClick={() => {
                      navigate('/login');
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl transition-colors text-base font-medium bg-primary text-primary-foreground cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 inline mr-2" />
                    Войти
                  </motion.div>
                </>
              )}

              <div className="pt-3">
                <Link to="/applicants" onClick={() => setMobileOpen(false)}>
                  <button className="w-full btn-primary flex items-center justify-center gap-2">
                    Выбрать профессию
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
