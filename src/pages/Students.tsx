import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';
import { MarketSection } from '@/components/sections/MarketSection';
import { AnalysisSection } from '@/components/sections/AnalysisSection';
import { CareerPathsSection } from '@/components/sections/CareerPathsSection';
import { Briefcase, TrendingUp, Target, Award } from 'lucide-react';

interface StudentsProps {
  isChatOpen?: boolean;
  onChatToggle?: (open: boolean) => void;
}

const Students = ({ isChatOpen = false }: StudentsProps) => {
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
        {/* Hero Section for Students */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Briefcase className="w-5 h-5" />
                <span className="text-sm font-medium">Для студентов</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Подготовься к рынку труда
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Узнай, какие навыки востребованы, сколько платят работодатели 
                и как построить успешную карьеру в твоей сфере.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="card-elevated p-6 text-left">
                  <TrendingUp className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Рынок труда</h3>
                  <p className="text-sm text-muted-foreground">
                    Актуальная статистика вакансий и зарплат
                  </p>
                </div>
                
                <div className="card-elevated p-6 text-left">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Важные критерии</h3>
                  <p className="text-sm text-muted-foreground">
                    ML-анализ факторов успешного трудоустройства
                  </p>
                </div>
                
                <div className="card-elevated p-6 text-left">
                  <Award className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Карьерный рост</h3>
                  <p className="text-sm text-muted-foreground">
                    Пути развития в разных профессиях
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Career Paths */}
        <CareerPathsSection />

        {/* Market Analysis */}
        <MarketSection />

        {/* ML Analysis */}
        <div className="bg-card">
          <AnalysisSection />
        </div>
      </motion.main>

      <FooterSection onNavigate={() => {}} />
    </div>
  );
};

export default Students;
