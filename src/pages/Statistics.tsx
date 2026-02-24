import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { FooterSection } from '@/components/sections/FooterSection';
import { VacancyAnalyticsSection } from '@/components/sections/VacancyAnalyticsSection';
import { SalaryStatisticsSection } from '@/components/sections/SalaryStatisticsSection';
import { MarketSection } from '@/components/sections/MarketSection';
import { AnalysisSection } from '@/components/sections/AnalysisSection';
import { DataMethodologySection } from '@/components/sections/DataMethodologySection';
import { BarChart3, TrendingUp, Brain, Database } from 'lucide-react';

interface StatisticsProps {
  isChatOpen?: boolean;
  onChatToggle?: (open: boolean) => void;
}

const Statistics = ({ isChatOpen = false }: StatisticsProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header chatOpen={isChatOpen} />
      
      <motion.main
        animate={{
          marginRight: isChatOpen ? '450px' : '0px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="pt-20 relative"
      >
        {/* Page Header */}
        <section className="py-12 sm:py-16 bg-card border-b border-border">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
                <span className="text-sm text-primary uppercase tracking-wider font-semibold">
                  Аналитика и статистика
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-4">
                Данные о рынке труда
              </h1>
              <p className="text-muted-foreground text-lg">
                Полная аналитика вакансий, зарплат и прогнозы на основе машинного обучения. 
                Все данные получены из открытых источников.
              </p>
            </motion.div>

            {/* Quick Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
            >
              <a href="#vacancies" className="p-4 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Вакансии</span>
              </a>
              <a href="#salaries" className="p-4 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Зарплаты</span>
              </a>
              <a href="#analysis" className="p-4 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors text-center">
                <Brain className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">ML-анализ</span>
              </a>
              <a href="#methodology" className="p-4 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors text-center">
                <Database className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Методология</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Vacancy Analytics */}
        <div id="vacancies">
          <VacancyAnalyticsSection />
        </div>

        {/* Salary Statistics */}
        <div id="salaries" className="bg-card">
          <SalaryStatisticsSection />
        </div>

        {/* Market Analysis */}
        <div id="market">
          <MarketSection />
        </div>

        {/* ML Analysis */}
        <div id="analysis" className="bg-card">
          <AnalysisSection />
        </div>

        {/* Data Methodology */}
        <div id="methodology">
          <DataMethodologySection />
        </div>
      </motion.main>

      <FooterSection />
    </div>
  );
};

export default Statistics;
