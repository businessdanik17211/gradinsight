import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, GraduationCap, BookOpen, Users } from 'lucide-react';
import { ALL_UNIVERSITIES, UNIVERSITY_AVERAGE_MARKS } from '@/data/universityMarks';

export function UniversitiesSection() {
  // Используем статический список всех университетов
  const universities = ALL_UNIVERSITIES;
  const isLoading = false;

  const universityCount = universities.length;

  // Рассчитываем средний балл по всем университетам
  const averageMark = Math.round(
    Object.values(UNIVERSITY_AVERAGE_MARKS).reduce((a, b) => a + b, 0) / Object.values(UNIVERSITY_AVERAGE_MARKS).length
  );

  return (
    <section className="py-12 sm:py-20">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3">ВУЗы Беларуси</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-4">
            Выбери свой<br />университет.
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Информация о государственных университетах Беларуси.
            Указаны средние проходные баллы за 2025 год.
          </p>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16"
        >
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">В каталоге</span>
            </div>
            <p className="font-serif text-3xl font-semibold">{universityCount}</p>
            <p className="text-sm text-muted-foreground mt-1">университетов</p>
          </div>
          
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Всего в РБ</span>
            </div>
            <p className="font-serif text-3xl font-semibold">~42</p>
            <p className="text-sm text-muted-foreground mt-1">учреждений ВО</p>
          </div>
          
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Средний балл</span>
            </div>
            <p className="font-serif text-3xl font-semibold">{averageMark}</p>
            <p className="text-sm text-muted-foreground mt-1">для поступления</p>
          </div>
        </motion.div>

        {/* Universities Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Загрузка университетов...
          </div>
        ) : universities && universities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {universities.map((uni, index) => (
              <Link key={uni.id} to={`/university/${encodeURIComponent(uni.short_name)}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="card-elevated p-6 hover:shadow-lg transition-shadow group cursor-pointer h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{uni.city}</span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {uni.short_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{uni.full_name}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {uni.average_mark}
                      </p>
                      <p className="text-xs text-muted-foreground">Балл (2025)</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{uni.city}</p>
                      <p className="text-xs text-muted-foreground">Город</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Университеты не найдены.
          </div>
        )}

        {/* Data Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 p-4 bg-accent/30 rounded-xl"
        >
          <p className="text-xs text-muted-foreground">
            <strong>Источники данных:</strong> Средние проходные баллы указаны за 2025 год.
            Данные предоставлены для справки — рекомендуем проверять актуальную информацию на официальных сайтах университетов.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
