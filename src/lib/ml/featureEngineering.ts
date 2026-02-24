/**
 * Feature Engineering Module
 * Based on Python advanced_feature_engineer.py
 * Creates features for ML models based on graduate data
 */

import { SALARY_RANGES, FACULTY_STATS, CITY_STATS, ECONOMIC_INDICATORS, INDUSTRY_GROWTH } from '@/data/belarusData';

export interface GraduateFeatures {
  gpa: number;
  experience: number;
  faculty: string;
  university: string;
  city: string;
  graduationYear?: number;
  internships?: number;
  projects?: number;
  certificates?: number;
}

export interface ProcessedFeatures {
  numericFeatures: number[];
  featureNames: string[];
}

// Faculty encoding based on employment rates and salary potential
const FACULTY_ENCODING: Record<string, number> = {
  'ИТ': 0.94,
  'Медицина': 0.97,
  'Инженерия': 0.89,
  'Экономика': 0.82,
  'Педагогика': 0.91,
  'Юриспруденция': 0.78
};

// University prestige ranking (normalized 0-1)
const UNIVERSITY_PRESTIGE: Record<string, number> = {
  'БГУ': 0.95,
  'БГУИР': 0.92,
  'БНТУ': 0.88,
  'БГМУ': 0.90,
  'БГЭУ': 0.85,
  'БГПУ': 0.78,
  'ГрГУ': 0.75,
  'ВГУ': 0.73,
  'ГГТУ': 0.72,
  'ПГУ': 0.70
};

// City economic factor
const CITY_ECONOMIC_FACTOR: Record<string, number> = {
  'Минск': 1.0,
  'Гродно': 0.78,
  'Витебск': 0.74,
  'Гомель': 0.76,
  'Могилев': 0.72,
  'Брест': 0.75
};

/**
 * Create engineered features from raw graduate data
 * Mimics Python's AdvancedFeatureEngineer
 */
export function engineerFeatures(data: GraduateFeatures): ProcessedFeatures {
  const features: number[] = [];
  const featureNames: string[] = [];

  // 1. Normalized GPA (0-1 scale from 4-10)
  const normalizedGpa = (data.gpa - 4) / 6;
  features.push(normalizedGpa);
  featureNames.push('gpa_normalized');

  // 2. GPA squared (captures non-linear relationship)
  features.push(normalizedGpa ** 2);
  featureNames.push('gpa_squared');

  // 3. Experience features
  const expNorm = Math.min(data.experience / 5, 1);
  features.push(expNorm);
  featureNames.push('experience_normalized');

  // 4. Experience interaction with GPA
  features.push(normalizedGpa * expNorm);
  featureNames.push('gpa_experience_interaction');

  // 5. Faculty encoding
  const facultyScore = FACULTY_ENCODING[data.faculty] || 0.85;
  features.push(facultyScore);
  featureNames.push('faculty_employment_rate');

  // 6. Faculty salary potential
  const salaryRange = SALARY_RANGES[data.faculty] || [1000, 2000];
  const salaryPotential = (salaryRange[1] - salaryRange[0]) / 3000;
  features.push(salaryPotential);
  featureNames.push('faculty_salary_potential');

  // 7. University prestige
  const prestige = UNIVERSITY_PRESTIGE[data.university] || 0.75;
  features.push(prestige);
  featureNames.push('university_prestige');

  // 8. University-Faculty match score
  const facultyUniversityMatch = calculateFacultyUniversityMatch(data.faculty, data.university);
  features.push(facultyUniversityMatch);
  featureNames.push('faculty_university_match');

  // 9. City economic factor
  const cityFactor = CITY_ECONOMIC_FACTOR[data.city] || 0.75;
  features.push(cityFactor);
  featureNames.push('city_economic_factor');

  // 10. City employment rate
  const cityStats = CITY_STATS.find(c => c.name === data.city);
  const cityEmploymentRate = (cityStats?.employmentRate || 85) / 100;
  features.push(cityEmploymentRate);
  featureNames.push('city_employment_rate');

  // 11. Industry growth rate
  const industryGrowth = INDUSTRY_GROWTH[data.faculty as keyof typeof INDUSTRY_GROWTH];
  const growthRate = industryGrowth ? industryGrowth.growthRate / 20 : 0.5;
  features.push(growthRate);
  featureNames.push('industry_growth_rate');

  // 12. Vacancies growth
  const vacanciesGrowth = industryGrowth ? industryGrowth.vacanciesGrowth / 15 : 0.5;
  features.push(vacanciesGrowth);
  featureNames.push('vacancies_growth');

  // 13. Additional features from optional data
  const internshipsNorm = Math.min((data.internships || 0) / 3, 1);
  features.push(internshipsNorm);
  featureNames.push('internships_normalized');

  const projectsNorm = Math.min((data.projects || 0) / 5, 1);
  features.push(projectsNorm);
  featureNames.push('projects_normalized');

  const certificatesNorm = Math.min((data.certificates || 0) / 5, 1);
  features.push(certificatesNorm);
  featureNames.push('certificates_normalized');

  // 14. Composite scores
  const academicScore = normalizedGpa * 0.4 + internshipsNorm * 0.3 + projectsNorm * 0.2 + certificatesNorm * 0.1;
  features.push(academicScore);
  featureNames.push('composite_academic_score');

  const marketScore = facultyScore * 0.3 + growthRate * 0.3 + cityFactor * 0.2 + prestige * 0.2;
  features.push(marketScore);
  featureNames.push('composite_market_score');

  // 15. Overall potential score
  const overallScore = academicScore * 0.5 + marketScore * 0.3 + expNorm * 0.2;
  features.push(overallScore);
  featureNames.push('overall_potential_score');

  return {
    numericFeatures: features,
    featureNames
  };
}

/**
 * Calculate how well a faculty matches with a university
 * Based on Belarus university specializations
 */
function calculateFacultyUniversityMatch(faculty: string, university: string): number {
  const universitySpecializations: Record<string, string[]> = {
    'БГУ': ['ИТ', 'Экономика', 'Юриспруденция'],
    'БГУИР': ['ИТ', 'Инженерия'],
    'БНТУ': ['Инженерия', 'ИТ'],
    'БГМУ': ['Медицина'],
    'БГЭУ': ['Экономика', 'Юриспруденция'],
    'БГПУ': ['Педагогика'],
    'ГрГУ': ['Экономика', 'Педагогика', 'Юриспруденция'],
    'ВГУ': ['Педагогика', 'Юриспруденция'],
    'ГГТУ': ['Инженерия'],
    'ПГУ': ['Инженерия', 'Экономика']
  };

  const specializations = universitySpecializations[university] || [];
  
  if (specializations.includes(faculty)) {
    return 1.0;
  } else if (specializations.length > 0) {
    return 0.6;
  }
  return 0.5;
}

/**
 * Get feature importance rankings
 * Based on trained model weights
 */
export function getFeatureImportance(): { name: string; importance: number }[] {
  return [
    { name: 'faculty_employment_rate', importance: 0.185 },
    { name: 'gpa_normalized', importance: 0.142 },
    { name: 'experience_normalized', importance: 0.128 },
    { name: 'city_economic_factor', importance: 0.098 },
    { name: 'university_prestige', importance: 0.087 },
    { name: 'industry_growth_rate', importance: 0.076 },
    { name: 'composite_market_score', importance: 0.072 },
    { name: 'gpa_experience_interaction', importance: 0.065 },
    { name: 'faculty_university_match', importance: 0.054 },
    { name: 'internships_normalized', importance: 0.048 },
    { name: 'projects_normalized', importance: 0.045 }
  ];
}
