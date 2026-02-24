import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { UniversitiesSection } from '@/components/sections/UniversitiesSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, GraduationCap, Users, TrendingUp } from 'lucide-react';

interface IndexProps {
  isChatOpen?: boolean;
  onChatToggle?: (open: boolean) => void;
}

const Index = ({ isChatOpen = false }: IndexProps) => {
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();
  
  const sectionsRef = {
    overview: useRef<HTMLDivElement>(null),
    universities: useRef<HTMLDivElement>(null),
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    
    const ref = sectionsRef[section as keyof typeof sectionsRef];
    if (ref?.current) {
      const offset = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      Object.entries(sectionsRef).forEach(([key, ref]) => {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(key);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickLinks = [
    {
      title: 'Для абитуриентов',
      description: 'Проходные баллы, специальности, сроки подачи документов',
      icon: GraduationCap,
      path: '/applicants',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Для студентов',
      description: 'Рынок труда, зарплаты, требования к опыту',
      icon: Users,
      path: '/students',
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Статистика',
      description: 'Вакансии, зарплаты, ML-анализ рынка труда',
      icon: BarChart3,
      path: '/statistics',
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Поступление',
      description: 'Баллы прошлых лет, статистика зачислений',
      icon: TrendingUp,
      path: '/admission-stats',
      color: 'bg-orange-500/10 text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={handleNavigate} chatOpen={isChatOpen} />
      
      <motion.main
        animate={{
          marginRight: isChatOpen ? '450px' : '0px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative"
      >
        {/* Hero / Overview */}
        <div ref={sectionsRef.overview}>
          <HeroSection onNavigate={handleNavigate} />
        </div>

        {/* Quick Navigation Cards */}
        <section className="py-12 sm:py-16 bg-card">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-foreground mb-2">
                Выбери свой путь
              </h2>
              <p className="text-muted-foreground">
                Данные и инструменты для принятия решений
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(link.path)}
                  className="cursor-pointer"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center mb-4`}>
                        <link.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Universities */}
        <div ref={sectionsRef.universities}>
          <UniversitiesSection />
        </div>
      </motion.main>

      <FooterSection onNavigate={handleNavigate} />
    </div>
  );
};

export default Index;
