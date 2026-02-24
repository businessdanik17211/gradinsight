import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';
import { UniversitiesSection } from '@/components/sections/UniversitiesSection';
import { ProfessionsSection } from '@/components/sections/ProfessionsSection';
import { SpecialtiesComparisonTable } from '@/components/tables/SpecialtiesComparisonTable';
import { GraduationCap, BookOpen, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ApplicantsProps {
  isChatOpen?: boolean;
  onChatToggle?: (open: boolean) => void;
}

const Applicants = ({ isChatOpen = false }: ApplicantsProps) => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} chatOpen={isChatOpen} />
      
      <motion.main
        animate={{
          marginRight: isChatOpen ? '450px' : '0px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative"
      >
        {/* Hero Section for Applicants */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <GraduationCap className="w-5 h-5" />
                <span className="text-sm font-medium">Для абитуриентов</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Выбери своё будущее осознанно
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Сравни университеты, специальности и узнай реальные перспективы трудоустройства. 
                Принимай решение на основе данных, а не догадок.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="card-elevated p-6 text-left">
                  <BookOpen className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">10 университетов</h3>
                  <p className="text-sm text-muted-foreground">
                    Детальная информация о ведущих вузах Беларуси
                  </p>
                </div>
                
                <div className="card-elevated p-6 text-left">
                  <TrendingUp className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Рынок труда</h3>
                  <p className="text-sm text-muted-foreground">
                    Анализ вакансий и востребованности специальностей
                  </p>
                </div>
                
                <div className="card-elevated p-6 text-left">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Спрос на рынке</h3>
                  <p className="text-sm text-muted-foreground">
                    Анализ востребованности специальностей
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Specialties Comparison */}
        <section className="py-16 bg-card">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-2 text-center">
                Сравнение специальностей
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Востребованность специальностей и карьерный рост по направлениям
              </p>
              
              <Alert className="mb-6 bg-muted/50 border-primary/20">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>О данных на странице</AlertTitle>
                <AlertDescription className="text-sm">
                  Данные о зарплатах получены на основе анализа вакансий с rabota.by и представляют 
                  предлагаемые работодателями зарплаты, а не зарплаты выпускников. Реальные зарплаты 
                  после выпуска зависят от опыта, навыков и конкретного работодателя.
                </AlertDescription>
              </Alert>
              
              <SpecialtiesComparisonTable />
            </motion.div>
          </div>
        </section>

        {/* In-Demand Professions */}
        <ProfessionsSection />

        {/* Universities */}
        <UniversitiesSection />
      </motion.main>

      <FooterSection onNavigate={() => {}} />
    </div>
  );
};

export default Applicants;
