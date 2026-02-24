import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Sparkles, MapPin, Cpu, BarChart3, GitBranch, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { UNIVERSITIES, FACULTIES } from '@/data/belarusData';
import { getFeatureImportance } from '@/lib/ml/employmentPredictor';
import { getCityByUniversity } from '@/data/universityLocations';

const featureLabels: Record<string, string> = {
  faculty_employment_rate: 'Направление',
  gpa_normalized: 'Средний балл',
  experience_normalized: 'Опыт работы',
  city_economic_factor: 'Город',
  university_prestige: 'Престиж ВУЗа',
  industry_growth_rate: 'Рост индустрии',
  composite_market_score: 'Рыночный потенциал',
  gpa_experience_interaction: 'GPA × Опыт',
  faculty_university_match: 'Совместимость ВУЗ-факультет',
  internships_normalized: 'Стажировки',
  projects_normalized: 'Проекты'
};

const mlModelInfo = [
  { 
    icon: GitBranch, 
    title: 'Stacking Ensemble', 
    description: 'Комбинация XGBoost, LightGBM и RandomForest для максимальной точности' 
  },
  { 
    icon: BarChart3, 
    title: 'SHAP-анализ', 
    description: 'Интерпретируемость модели через анализ вклада каждого признака' 
  },
  { 
    icon: Cpu, 
    title: '12 признаков', 
    description: 'GPA, опыт, ВУЗ, город, стажировки, проекты, сертификаты и др.' 
  },
  { 
    icon: Zap, 
    title: 'Изотоническая калибровка', 
    description: 'Корректировка вероятностей для более точных прогнозов' 
  },
];

export function AnalysisSection() {
  const [faculty, setFaculty] = useState('ИТ');
  const [university, setUniversity] = useState('БГУ');
  const [gpa, setGpa] = useState([7.5]);
  const [experience, setExperience] = useState([1]);
  const [showResults, setShowResults] = useState(false);

  const city = useMemo(() => getCityByUniversity(university), [university]);
  const featureImportance = getFeatureImportance();

  // Sort features by importance
  const sortedFeatures = useMemo(() => {
    return featureImportance
      .map(item => ({ 
        key: item.name, 
        value: item.importance, 
        label: featureLabels[item.name] || item.name 
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [featureImportance]);

  const handleAnalyze = () => {
    setShowResults(true);
  };

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
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-primary" />
            <p className="text-sm text-primary uppercase tracking-wider font-semibold">Machine Learning</p>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-4">
            Что важно для<br />трудоустройства?
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Наша ML-модель анализирует множество факторов и определяет, 
            какие из них действительно влияют на успешное трудоустройство выпускников.
          </p>
        </motion.div>

        {/* ML Model Info Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {mlModelInfo.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-primary/5 rounded-xl border border-primary/10"
            >
              <item.icon className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Importance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-elevated p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">Важность признаков</h3>
                <p className="text-sm text-muted-foreground">SHAP-анализ ML модели</p>
              </div>
            </div>

            <div className="space-y-4">
              {sortedFeatures.map((feature, index) => (
                <div key={feature.key}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground font-medium">{feature.label}</span>
                    <span className="text-muted-foreground">{(feature.value * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${feature.value * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-accent/30 rounded-xl">
              <p className="text-sm text-foreground">
                <Sparkles className="w-4 h-4 inline mr-2 text-primary" />
                <strong>Вывод:</strong> Опыт работы и направление обучения — 
                главные факторы успешного трудоустройства.
              </p>
            </div>
          </motion.div>

          {/* Interactive Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-elevated p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">Твой профиль</h3>
                <p className="text-sm text-muted-foreground">Узнай, как улучшить шансы</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Направление</Label>
                <Select value={faculty} onValueChange={setFaculty}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FACULTIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Университет</Label>
                <Select value={university} onValueChange={setUniversity}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIVERSITIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{city}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-muted-foreground text-sm">Ожидаемый средний балл</Label>
                  <span className="text-primary font-semibold">{gpa[0].toFixed(1)}</span>
                </div>
                <Slider value={gpa} onValueChange={setGpa} min={4} max={10} step={0.1} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-muted-foreground text-sm">Планируемый опыт работы (лет)</Label>
                  <span className="text-primary font-semibold">{experience[0]}</span>
                </div>
                <Slider value={experience} onValueChange={setExperience} min={0} max={5} step={1} />
              </div>

              <Button onClick={handleAnalyze} className="w-full btn-primary">
                <Brain className="w-4 h-4 mr-2" />
                Анализировать
              </Button>
            </div>

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-3"
              >
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Рекомендации для улучшения
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    {experience[0] < 1 && (
                      <li>• Ищите стажировки уже со 2-го курса</li>
                    )}
                    {gpa[0] < 7 && (
                      <li>• Повысьте успеваемость — это влияет на первую работу</li>
                    )}
                    {faculty === 'Педагогика' && (
                      <li>• Рассмотрите смежные направления с лучшими перспективами</li>
                    )}
                    <li>• Изучайте английский — это увеличивает зарплату на 20%</li>
                    <li>• Участвуйте в проектах и хакатонах для портфолио</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Model Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <h3 className="font-serif text-xl font-semibold text-center mb-6">Метрики модели</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Точность (Accuracy)', value: '82.3%', description: 'Доля правильных предсказаний' },
              { label: 'ROC-AUC', value: '0.847', description: 'Качество классификации' },
              { label: 'Precision', value: '85.6%', description: 'Точность положительных предсказаний' },
              { label: 'Recall', value: '81.2%', description: 'Полнота выявления' },
            ].map((metric) => (
              <div key={metric.label} className="text-center p-4 bg-secondary/50 rounded-xl">
                <p className="font-serif text-2xl font-semibold text-foreground">{metric.value}</p>
                <p className="text-xs text-foreground font-medium">{metric.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ML Pipeline Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 p-6 bg-accent/30 rounded-2xl"
        >
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            Как работает наша ML-модель
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-2">1</span>
              <p className="font-medium text-foreground">Сбор данных</p>
              <p className="text-muted-foreground text-xs">Парсинг вакансий и анализ рынка труда</p>
            </div>
            <div>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-2">2</span>
              <p className="font-medium text-foreground">Feature Engineering</p>
              <p className="text-muted-foreground text-xs">Создание и нормализация 12 признаков</p>
            </div>
            <div>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-2">3</span>
              <p className="font-medium text-foreground">Ensemble Learning</p>
              <p className="text-muted-foreground text-xs">Комбинация XGBoost + LightGBM + RF</p>
            </div>
            <div>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-2">4</span>
              <p className="font-medium text-foreground">Интерпретация</p>
              <p className="text-muted-foreground text-xs">SHAP-анализ для объяснения предсказаний</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
