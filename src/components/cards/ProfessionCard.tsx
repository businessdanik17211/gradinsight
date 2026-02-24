import { Banknote, Briefcase, MapPin, TrendingUp } from 'lucide-react';
import type { ProfessionAnalytics } from '@/types/professions';
import { DemandIndicator } from './DemandIndicator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfessionCardProps {
  profession: ProfessionAnalytics;
  onClick?: (profession: ProfessionAnalytics) => void;
}

export function ProfessionCard({ profession, onClick }: ProfessionCardProps) {
  const formatSalary = (salary?: number) => {
    if (!salary) return '—';
    return salary.toLocaleString() + ' BYN';
  };

  const formatVacancies = (count?: number) => {
    if (!count) return '—';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      worker: 'Рабочая профессия',
      employee: 'Служащий',
      specialist: 'Специалист',
    };
    return labels[category] || category;
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick?.(profession)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {profession.profession_name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {getCategoryLabel(profession.category)}
            </p>
          </div>
          <DemandIndicator level={profession.demand_level} size="sm" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {formatSalary(profession.avg_salary)}
              </p>
              {profession.min_salary && profession.max_salary && (
                <p className="text-xs text-muted-foreground">
                  {profession.min_salary.toLocaleString()} - {profession.max_salary.toLocaleString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {formatVacancies(profession.vacancies_count)}
              </p>
              <p className="text-xs text-muted-foreground">вакансий</p>
            </div>
          </div>
        </div>
        
        {profession.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {profession.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {profession.forecast_city}
          </div>
          
          {profession.overall_rating && (
            <Badge variant="secondary" className="text-xs">
              {profession.overall_rating === 'excellent' && '⭐ Отлично'}
              {profession.overall_rating === 'good' && '👍 Хорошо'}
              {profession.overall_rating === 'average' && '📊 Средне'}
              {profession.overall_rating === 'below_average' && '⚠️ Ниже среднего'}
            </Badge>
          )}
        </div>
        
        {profession.related_specialties && profession.related_specialties.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Связанные специальности:</p>
            <div className="flex flex-wrap gap-1">
              {profession.related_specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {profession.related_specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{profession.related_specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
