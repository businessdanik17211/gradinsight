import { Users, Briefcase, TrendingUp, Wallet } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { EmploymentByFacultyChart } from '@/components/charts/EmploymentByFacultyChart';
import { SalaryByFacultyChart } from '@/components/charts/SalaryByFacultyChart';
import { TrendsChart } from '@/components/charts/TrendsChart';
import { ExportButton } from '@/components/export/ExportButton';

export function OverviewSection() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Обзор</h2>
        <ExportButton type="full" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Всего выпускников"
          value="103,000"
          subtitle="2025 год"
          icon={Users}
          trend="up"
          trendValue="+2.3%"
          delay={0.1}
        />
        <StatCard
          title="Уровень трудоустройства"
          value="89.2%"
          subtitle="В среднем по стране"
          icon={Briefcase}
          trend="up"
          trendValue="+1.5%"
          delay={0.2}
        />
        <StatCard
          title="Средняя зарплата"
          value="1,980 BYN"
          subtitle="Для молодых специалистов"
          icon={Wallet}
          trend="up"
          trendValue="+7.2%"
          delay={0.3}
        />
        <StatCard
          title="Рост вакансий"
          value="+8.5%"
          subtitle="По сравнению с 2024"
          icon={TrendingUp}
          trend="up"
          trendValue="IT сектор"
          delay={0.4}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <EmploymentByFacultyChart />
        <SalaryByFacultyChart />
      </div>

      {/* Trends */}
      <TrendsChart />
    </div>
  );
}
