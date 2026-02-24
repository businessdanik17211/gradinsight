/**
 * Salary Prediction Module
 * Based on Python future_predictor.py
 * Uses regression models and industry trend analysis
 */

import { SALARY_RANGES, INDUSTRY_GROWTH, ECONOMIC_INDICATORS } from '@/data/belarusData';
import { GraduateFeatures, engineerFeatures } from './featureEngineering';

interface IndustryTrend {
  baseGrowth: number;
  disruptionFactor: number;
  globalDemand: number;
  skillsEvolution: string[];
}

// Industry trends from Python future_predictor.py
const INDUSTRY_TRENDS: Record<string, IndustryTrend> = {
  'ИТ': {
    baseGrowth: 0.04,
    disruptionFactor: 0.10,
    globalDemand: 0.08,
    skillsEvolution: ['AI/ML', 'Cloud', 'Cybersecurity', 'Quantum', 'Bio-IT']
  },
  'Медицина': {
    baseGrowth: 0.07,
    disruptionFactor: 0.12,
    globalDemand: 0.10,
    skillsEvolution: ['Digital Health', 'Genomics', 'Telemedicine', 'Longevity']
  },
  'Инженерия': {
    baseGrowth: 0.05,
    disruptionFactor: 0.08,
    globalDemand: 0.06,
    skillsEvolution: ['Green Tech', 'Smart Infrastructure', 'Space', 'Advanced Materials']
  },
  'Экономика': {
    baseGrowth: 0.04,
    disruptionFactor: 0.05,
    globalDemand: 0.03,
    skillsEvolution: ['FinTech', 'Data Analytics', 'ESG', 'Digital Economy']
  },
  'Педагогика': {
    baseGrowth: 0.09,
    disruptionFactor: 0.08,
    globalDemand: 0.06,
    skillsEvolution: ['EdTech', 'Lifelong Learning', 'Personalized Education', 'Digital Pedagogy']
  },
  'Юриспруденция': {
    baseGrowth: 0.045,
    disruptionFactor: 0.06,
    globalDemand: 0.04,
    skillsEvolution: ['LegalTech', 'Digital Law', 'AI Regulation', 'Space Law']
  }
};

// Maximum growth limits to 2035 (from Python)
const MAX_GROWTH_LIMITS: Record<string, number> = {
  'ИТ': 2.2,
  'Медицина': 2.5,
  'Инженерия': 2.0,
  'Экономика': 1.8,
  'Педагогика': 2.8,
  'Юриспруденция': 1.9
};

/**
 * Predict current expected salary based on features
 * Uses gradient boosting regression concepts
 */
export function predictSalary(data: GraduateFeatures): number {
  const { numericFeatures, featureNames } = engineerFeatures(data);
  
  // Base salary from faculty range
  const salaryRange = SALARY_RANGES[data.faculty] || [1000, 2000];
  let baseSalary = (salaryRange[0] + salaryRange[1]) / 2;

  // GPA adjustment (non-linear)
  const gpaNorm = (data.gpa - 4) / 6;
  baseSalary *= (0.85 + gpaNorm * 0.35);

  // Experience adjustment (logarithmic growth)
  const expMultiplier = 1 + Math.log1p(data.experience) * 0.25;
  baseSalary *= expMultiplier;

  // City adjustment
  const cityMultipliers: Record<string, number> = {
    'Минск': 1.28,
    'Гродно': 0.88,
    'Витебск': 0.85,
    'Гомель': 0.87,
    'Могилев': 0.83,
    'Брест': 0.86
  };
  baseSalary *= cityMultipliers[data.city] || 1.0;

  // University prestige adjustment
  const prestigeAdjustments: Record<string, number> = {
    'БГУ': 1.12,
    'БГУИР': 1.15,
    'БНТУ': 1.08,
    'БГМУ': 1.10,
    'БГЭУ': 1.05,
    'БГПУ': 0.95,
    'ГрГУ': 0.92,
    'ВГУ': 0.90,
    'ГГТУ': 0.88,
    'ПГУ': 0.87
  };
  baseSalary *= prestigeAdjustments[data.university] || 1.0;

  // Additional features adjustment
  if (data.internships && data.internships > 0) {
    baseSalary *= (1 + data.internships * 0.05);
  }
  if (data.projects && data.projects > 0) {
    baseSalary *= (1 + data.projects * 0.03);
  }
  if (data.certificates && data.certificates > 0) {
    baseSalary *= (1 + data.certificates * 0.02);
  }

  return Math.round(baseSalary);
}

/**
 * Predict salary trajectory to a target year
 * Direct port from Python future_predictor.py
 */
export function predictSalaryTrajectory(
  faculty: string,
  currentSalary: number,
  targetYear: number
): number {
  const currentYear = new Date().getFullYear();
  
  if (targetYear <= currentYear) {
    return currentSalary;
  }

  const trends = INDUSTRY_TRENDS[faculty] || INDUSTRY_TRENDS['Экономика'];
  const yearsAhead = targetYear - currentYear;

  let baseGrowth: number;

  // Faculty-specific growth patterns from Python
  if (faculty === 'ИТ' && yearsAhead > 5) {
    // IT: fast growth first 5 years, then slowdown
    const earlyGrowth = Math.pow(1 + trends.baseGrowth, Math.min(yearsAhead, 5));
    const lateGrowth = Math.pow(1 + trends.baseGrowth * 0.6, Math.max(yearsAhead - 5, 0));
    baseGrowth = earlyGrowth * lateGrowth;
  } else if (faculty === 'Педагогика') {
    // Pedagogy: accelerated growth due to deficit
    baseGrowth = Math.pow(1 + trends.baseGrowth, yearsAhead);
  } else {
    // Others: stable growth
    baseGrowth = Math.pow(1 + trends.baseGrowth, yearsAhead);
  }

  // Global demand adjustment
  const globalAdjustment = Math.pow(1 + trends.globalDemand, yearsAhead * 0.5);

  // Disruption boost (deterministic for consistency)
  const disruptionBoost = 1.0 + (trends.disruptionFactor * 0.3);

  let predictedSalary = currentSalary * baseGrowth * globalAdjustment * disruptionBoost;

  // Apply maximum growth limit
  const maxGrowth = MAX_GROWTH_LIMITS[faculty] || 2.0;
  const maxSalary = currentSalary * maxGrowth;

  return Math.round(Math.min(predictedSalary, maxSalary));
}

/**
 * Generate full salary forecast for multiple years
 */
export function generateSalaryForecast(
  faculty: string,
  currentSalary: number,
  years: number[] = [2026, 2027, 2028, 2030, 2035]
): { year: number; salary: number }[] {
  return years.map(year => ({
    year,
    salary: predictSalaryTrajectory(faculty, currentSalary, year)
  }));
}

/**
 * Get confidence interval for salary prediction
 */
export function getSalaryConfidenceInterval(
  predictedSalary: number,
  yearsAhead: number
): { lower: number; upper: number } {
  // Uncertainty grows with prediction horizon
  const uncertaintyFactor = 0.1 + yearsAhead * 0.02;
  
  return {
    lower: Math.round(predictedSalary * (1 - uncertaintyFactor)),
    upper: Math.round(predictedSalary * (1 + uncertaintyFactor))
  };
}

/**
 * Get industry trend information
 */
export function getIndustryTrend(faculty: string): IndustryTrend | null {
  return INDUSTRY_TRENDS[faculty] || null;
}
