import { motion } from 'framer-motion';
import { ArrowUpRight, GraduationCap, Briefcase, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  // Fetch real data from database
  const { data: universityCount } = useQuery({
    queryKey: ['university-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('universities')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: vacancyCount } = useQuery({
    queryKey: ['vacancy-count-hero'],
    queryFn: async () => {
      const { count } = await supabase
        .from('vacancies')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const quickStats = [
    { 
      label: 'ВУЗов', 
      value: universityCount !== undefined ? String(universityCount) : '...',
    },
    { 
      label: 'Вакансий в базе', 
      value: vacancyCount !== undefined ? String(vacancyCount) : '...',
    },
    { 
      label: 'Источников данных', 
      value: '3+',
    },
  ];

  return (
    <section className="min-h-[80vh] flex flex-col justify-center pt-20 pb-12">
      <div className="section-container">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-foreground leading-tight mb-6">
            Всё о высшем
            <br />
            образовании
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Справочник для абитуриентов и студентов: университеты, специальности, 
            проходные баллы и реальные данные о рынке труда
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl sm:text-3xl font-serif font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate('universities')}
              className="btn-primary flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              Выбрать ВУЗ
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a 
              href="/applicants"
              className="btn-outline flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Для абитуриентов
            </a>
            <a 
              href="/statistics"
              className="btn-outline flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Аналитика
            </a>
          </div>
        </motion.div>

        {/* Data Source Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground"
        >
          Данные получены из открытых источников: rabota.by, сайты ВУЗов
        </motion.p>
      </div>
    </section>
  );
}
