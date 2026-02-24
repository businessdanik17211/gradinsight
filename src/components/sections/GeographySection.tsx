import { GeographyChart } from '@/components/charts/GeographyChart';
import { CityTable } from '@/components/tables/CityTable';
import { ExportButton } from '@/components/export/ExportButton';
import { motion } from 'framer-motion';
import { CITY_STATS } from '@/data/belarusData';
import { MapPin, Building2, Users } from 'lucide-react';

export function GeographySection() {
  const totalGraduates = CITY_STATS.reduce((sum, city) => sum + city.graduates, 0);
  const minskShare = ((CITY_STATS.find(c => c.name === 'Минск')?.graduates || 0) / totalGraduates * 100);
  const topCity = [...CITY_STATS].sort((a, b) => b.employmentRate - a.employmentRate)[0];

  return (
    <div className="space-y-8">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">География выпускников</h2>
        <ExportButton type="city" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Доля Минска</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-primary">{minskShare.toFixed(1)}%</p>
          <p className="text-muted-foreground text-xs sm:text-sm">выпускников</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">Лучший город</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{topCity.name}</p>
          <p className="text-accent font-semibold text-sm">{topCity.employmentRate}% трудоустройство</p>
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
            <span className="text-muted-foreground text-xs sm:text-sm">Городов</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{CITY_STATS.length}</p>
          <p className="text-muted-foreground text-xs sm:text-sm">анализируется</p>
        </motion.div>
      </div>

      {/* Charts and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <GeographyChart />
        <CityTable />
      </div>
    </div>
  );
}
