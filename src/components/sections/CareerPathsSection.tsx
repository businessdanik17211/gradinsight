import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CareerPath {
  id: string;
  specialty_category: string;
  level_name: string;
  level_order: number;
  typical_salary_min: number | null;
  typical_salary_max: number | null;
  years_experience: string | null;
  description: string | null;
}

export function CareerPathsSection() {
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ИТ');

  useEffect(() => {
    async function fetchPaths() {
      const { data, error } = await supabase
        .from('career_paths')
        .select('*')
        .order('level_order', { ascending: true });

      if (data) {
        setPaths(data);
      }
      setLoading(false);
    }

    fetchPaths();
  }, []);

  const categories = [...new Set(paths.map(p => p.specialty_category))];
  const filteredPaths = paths.filter(p => p.specialty_category === selectedCategory);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="section-container flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-card">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-display font-bold text-foreground mb-2 text-center">
            Карьерные траектории
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Путь развития в разных профессиях от начала до вершины
          </p>

          {/* Category Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Career Path Visualization */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

            <div className="space-y-6">
              {filteredPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative md:w-[calc(50%-2rem)]",
                    index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                  )}
                >
                  {/* Connection Dot */}
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background"
                    style={{
                      [index % 2 === 0 ? 'right' : 'left']: '-2.5rem'
                    }}
                  />

                  <div className="card-elevated p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold mb-2">
                          {path.level_order}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground">
                          {path.level_name}
                        </h3>
                        {path.years_experience && (
                          <p className="text-sm text-muted-foreground">
                            {path.years_experience}
                          </p>
                        )}
                      </div>
                      {path.typical_salary_min && path.typical_salary_max && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {path.typical_salary_min.toLocaleString()} — {path.typical_salary_max.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">BYN/мес</p>
                        </div>
                      )}
                    </div>
                    
                    {path.description && (
                      <p className="text-sm text-muted-foreground">
                        {path.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {filteredPaths.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Данные о карьерных траекториях для этой категории отсутствуют
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
