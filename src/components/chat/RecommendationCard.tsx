import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp, DollarSign, CheckCircle, XCircle, Heart, Bookmark, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Recommendation } from '@/hooks/useAIChat';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onSave?: (rec: Recommendation) => void;
  isSaved?: boolean;
  onViewDetails?: (rec: Recommendation) => void;
  onCompare?: (rec: Recommendation) => void;
}

export function RecommendationCard({ 
  recommendation, 
  onSave, 
  isSaved = false,
  onViewDetails,
  onCompare 
}: RecommendationCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    if (!saved && onSave) {
      onSave(recommendation);
      setSaved(true);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMatchBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10';
    if (score >= 60) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 overflow-hidden border-2 hover:border-primary/30 transition-colors">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  {recommendation.university}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {recommendation.faculty}
                </p>
              </div>
            </div>
            
            <div className={cn(
              'px-3 py-1 rounded-full text-sm font-semibold',
              getMatchBg(recommendation.matchScore),
              getMatchColor(recommendation.matchScore)
            )}>
              {recommendation.matchScore}% шанс
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Specialty */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{recommendation.specialty}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Проходной балл</p>
              <p className="font-semibold">{recommendation.requiredScore}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Трудоустройство</p>
              <p className="font-semibold">{recommendation.employmentRate}</p>
            </div>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-medium">{recommendation.salaryRange}</span>
          </div>

          {/* Pros & Cons */}
          <div className="space-y-2">
            {recommendation.pros.map((pro, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>{pro}</span>
              </div>
            ))}
            {recommendation.cons.map((con, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{con}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onViewDetails?.(recommendation)}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Подробнее
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onCompare?.(recommendation)}
            >
              <Star className="w-4 h-4 mr-1" />
              Сравнить
            </Button>
            <Button 
              variant={saved ? "default" : "outline"}
              size="sm"
              onClick={handleSave}
              disabled={saved}
            >
              <Heart className={cn("w-4 h-4", saved && "fill-current")} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Компонент для отображения текста с форматированием
export function FormattedMessage({ content }: { content: string }) {
  // Удаляем markdown-звездочки и эмодзи
  const cleanedContent = content
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **жирный** -> жирный
    .replace(/\*([^*]+)\*/g, '$1')       // *курсив* -> курсив
    .replace(/^\s*\*\s+/gm, '')          // Удаляем * в начале строк списков
    .replace(/\*$/gm, '')                // Удаляем * в конце строк
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ''); // Удаляем эмодзи
  
  const lines = cleanedContent.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // Заголовки (начинающиеся с ВАРИАНТ или цифр)
        if (line.match(/^(ВАРИАНТ|\d+\.)/)) {
          return (
            <h4 key={i} className="font-bold text-foreground mt-4 mb-2">
              {line}
            </h4>
          );
        }
        
        // Маркированные списки (без эмодзи)
        if (line.match(/^[-•ПлюсМинус]/)) {
          const isPro = line.toLowerCase().includes('плюс');
          const isCon = line.toLowerCase().includes('минус');
          const text = line.replace(/^[-•]\s*/, '').replace(/^Плюс\s*/i, '').replace(/^Минус\s*/i, '');
          
          return (
            <div key={i} className="flex items-start gap-2 ml-4">
              <span className={isPro ? 'text-green-600 font-medium' : isCon ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                {isPro ? '+' : isCon ? '-' : '·'}
              </span>
              <span>{text}</span>
            </div>
          );
        }
        
        // Пустые строки
        if (!line.trim()) {
          return <br key={i} />;
        }
        
        // Обычный текст
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}
