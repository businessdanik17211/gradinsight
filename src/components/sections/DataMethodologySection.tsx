import { motion } from 'framer-motion';
import { Database, Brain, AlertTriangle, ExternalLink, BarChart3, Search } from 'lucide-react';

const dataSources = [
  {
    name: 'rabota.by',
    type: 'Парсинг вакансий',
    description: 'Автоматический сбор данных о вакансиях, зарплатах и требованиях работодателей',
    reliability: 'высокая',
    icon: Search,
  },
  {
    name: 'Сайты университетов',
    type: 'Парсинг информации',
    description: 'Данные о факультетах, специальностях и проходных баллах с официальных сайтов ВУЗов',
    reliability: 'высокая',
    icon: Database,
  },
  {
    name: 'ML-модели',
    type: 'Прогнозирование',
    description: 'Ансамбль моделей (XGBoost, LightGBM, RandomForest) для анализа факторов трудоустройства',
    reliability: 'средняя',
    icon: Brain,
  },
];

const mlMethodology = [
  {
    step: 1,
    title: 'Сбор данных',
    description: 'Парсинг вакансий с rabota.by, данных о выпускниках и статистики трудоустройства',
  },
  {
    step: 2,
    title: 'Feature Engineering',
    description: 'Создание 12 признаков: направление, ВУЗ, город, GPA, опыт, стажировки, проекты и др.',
  },
  {
    step: 3,
    title: 'Обучение ансамбля',
    description: 'Stacking Ensemble из XGBoost + LightGBM + RandomForest с изотонической калибровкой',
  },
  {
    step: 4,
    title: 'SHAP-анализ',
    description: 'Определение важности каждого признака для интерпретируемости модели',
  },
];

export function DataMethodologySection() {
  return (
    <section className="py-12 sm:py-20 bg-card">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3">Методология</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-4">
            Откуда берутся данные?
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Мы используем только открытые источники данных и прозрачные методы машинного обучения.
            Ниже — полное описание нашей методологии.
          </p>
        </motion.div>

        {/* Data Sources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {dataSources.map((source, index) => (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-elevated p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <source.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{source.name}</h3>
                  <p className="text-xs text-muted-foreground">{source.type}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{source.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Надёжность:</span>
                <span className={`text-xs font-medium ${
                  source.reliability === 'высокая' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {source.reliability}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ML Methodology */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="card-elevated p-6 sm:p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold">ML Pipeline</h3>
              <p className="text-sm text-muted-foreground">Как работает наша модель</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mlMethodology.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {step.step}
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">{step.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground pl-11">{step.description}</p>
                {index < mlMethodology.length - 1 && (
                  <div className="hidden lg:block absolute top-4 left-[calc(100%-8px)] w-8 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Salary Calculation Explanation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="card-elevated p-6 sm:p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold">Расчёт средних зарплат</h3>
              <p className="text-sm text-muted-foreground">Как определяются зарплаты по направлениям</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">1. Источник данных:</strong> Зарплаты рассчитываются на основе 
              парсинга вакансий с rabota.by. Мы извлекаем минимальные и максимальные значения из описаний вакансий.
            </p>
            <p>
              <strong className="text-foreground">2. Категоризация:</strong> Вакансии автоматически распределяются 
              по категориям (ИТ, Медицина, Инженерия и т.д.) на основе ключевых слов в названии и описании.
            </p>
            <p>
              <strong className="text-foreground">3. Агрегация:</strong> Средняя зарплата = (мин + макс) / 2 
              по всем вакансиям категории. Медиана используется для устранения выбросов.
            </p>
            <p>
              <strong className="text-foreground">4. Корректировка:</strong> Учитываются региональные коэффициенты 
              (Минск +28%, области от -12% до -17%) и уровень позиции (junior/middle/senior).
            </p>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-accent/30 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">Ограничения и погрешности</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  <strong>Погрешность зарплат:</strong> ±15-20%. Не все вакансии указывают зарплату, 
                  а указанные могут отличаться от фактических предложений.
                </li>
                <li>
                  <strong>Данные о трудоустройстве:</strong> Основаны на анализе рынка труда и 
                  открытых статистических данных. Индивидуальные результаты могут отличаться.
                </li>
                <li>
                  <strong>ML-прогнозы:</strong> Модель обучена на ограниченной выборке. ROC-AUC 0.85 
                  означает, что в 15% случаев прогноз может быть неточным.
                </li>
                <li>
                  <strong>Актуальность:</strong> Данные обновляются через парсинг. Рекомендуем 
                  сверять с актуальными вакансиями и официальными источниками.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Data Sources Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">Основные источники данных:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://rabota.by" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              rabota.by <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://bsu.by" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              bsu.by <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://bsuir.by" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              bsuir.by <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
