import { motion } from 'framer-motion';
import { FacultyTable } from '@/components/tables/FacultyTable';
import { EmploymentByFacultyChart } from '@/components/charts/EmploymentByFacultyChart';
import { SalaryByFacultyChart } from '@/components/charts/SalaryByFacultyChart';
import { ExportButton } from '@/components/export/ExportButton';
import { FACULTY_STATS } from '@/data/belarusData';
import { TrendingUp, Users } from 'lucide-react';

export function FacultySection() {
  const topFaculty = [...FACULTY_STATS].sort((a, b) => b.employmentRate - a.employmentRate)[0];
  const topSalary = [...FACULTY_STATS].sort((a, b) => b.avgSalary - a.avgSalary)[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Статистика по факультетам</h2>
        <ExportButton type="faculty" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Лучшее трудоустройство</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{topFaculty.name}</p>
          <p className="text-accent font-semibold text-sm">{topFaculty.employmentRate}%</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Высшая зарплата</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{topSalary.name}</p>
          <p className="text-primary font-semibold text-sm">{topSalary.avgSalary.toLocaleString()} BYN</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Всего направлений</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{FACULTY_STATS.length}</p>
          <p className="text-muted-foreground text-sm">анализируется</p>
        </motion.div>
      </div>

      {/* Table */}
      <FacultyTable />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <EmploymentByFacultyChart />
        <SalaryByFacultyChart />
      </div>
    </div>
  );
}
