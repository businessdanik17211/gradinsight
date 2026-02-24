import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

interface FooterSectionProps {
  onNavigate: (section: string) => void;
}

export function FooterSection({ onNavigate }: FooterSectionProps) {
  return (
    <footer className="py-12 border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-semibold text-foreground">
              GradInsight
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Беларусь</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <button 
              onClick={() => onNavigate('overview')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Статистика
            </button>
            <button 
              onClick={() => onNavigate('universities')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ВУЗы
            </button>
            <button 
              onClick={() => onNavigate('market')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Рынок труда
            </button>
            <button 
              onClick={() => onNavigate('analysis')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ML анализ
            </button>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 GradInsight
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Данные на основе анализа rabota.by и открытых источников • 
            ML-модели обучены на данных 1200+ выпускников
          </p>
        </div>
      </div>
    </footer>
  );
}
