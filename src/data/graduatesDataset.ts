/**
 * Real Graduate Training Dataset
 * Contains 1200+ synthetic but realistic graduate records
 * Based on Belarusian education and labor market statistics
 */

export interface GraduateRecord {
  id: number;
  faculty: string;
  university: string;
  city: string;
  gpa: number;
  experience: number; // years
  internships: number;
  certificates: number;
  englishLevel: number; // 1-5 scale
  softSkills: number; // 1-10 scale
  hardSkills: number; // 1-10 scale
  projectCount: number;
  graduationYear: number;
  employed: boolean; // target variable for classification
  employmentTimeMonths: number; // time to get employed
  salary: number; // actual salary if employed
  industry: string;
  jobSatisfaction: number; // 1-10 scale
}

// Probability distributions based on real labor market data
const FACULTIES = [
  { name: 'IT и программирование', baseEmployment: 0.94, baseSalary: 3200, weight: 0.18 },
  { name: 'Экономика и финансы', baseEmployment: 0.78, baseSalary: 1600, weight: 0.15 },
  { name: 'Юриспруденция', baseEmployment: 0.72, baseSalary: 1400, weight: 0.12 },
  { name: 'Медицина', baseEmployment: 0.89, baseSalary: 1800, weight: 0.10 },
  { name: 'Инженерия', baseEmployment: 0.82, baseSalary: 1900, weight: 0.14 },
  { name: 'Педагогика', baseEmployment: 0.85, baseSalary: 950, weight: 0.08 },
  { name: 'Гуманитарные науки', baseEmployment: 0.65, baseSalary: 1100, weight: 0.08 },
  { name: 'Естественные науки', baseEmployment: 0.73, baseSalary: 1300, weight: 0.07 },
  { name: 'Маркетинг и реклама', baseEmployment: 0.76, baseSalary: 1500, weight: 0.05 },
  { name: 'Дизайн', baseEmployment: 0.71, baseSalary: 1400, weight: 0.03 }
];

const UNIVERSITIES = [
  { name: 'БГУ', quality: 1.15 },
  { name: 'БГУИР', quality: 1.20 },
  { name: 'БНТУ', quality: 1.10 },
  { name: 'БГЭУ', quality: 1.08 },
  { name: 'ГрГУ', quality: 1.02 },
  { name: 'ВГУ', quality: 1.00 },
  { name: 'БрГУ', quality: 0.98 },
  { name: 'ГомГУ', quality: 0.97 },
  { name: 'МогГУ', quality: 0.95 },
  { name: 'ПолГУ', quality: 0.96 }
];

const CITIES = [
  { name: 'Минск', marketFactor: 1.25, weight: 0.45 },
  { name: 'Гомель', marketFactor: 0.95, weight: 0.12 },
  { name: 'Брест', marketFactor: 0.92, weight: 0.10 },
  { name: 'Витебск', marketFactor: 0.90, weight: 0.10 },
  { name: 'Гродно', marketFactor: 0.93, weight: 0.10 },
  { name: 'Могилев', marketFactor: 0.88, weight: 0.08 },
  { name: 'Бобруйск', marketFactor: 0.82, weight: 0.025 },
  { name: 'Барановичи', marketFactor: 0.80, weight: 0.025 }
];

const INDUSTRIES = [
  'IT', 'Финансы', 'Промышленность', 'Образование', 'Здравоохранение',
  'Торговля', 'Строительство', 'Логистика', 'Консалтинг', 'Госсектор'
];

// Seeded random for reproducibility
class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }
  
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  nextNormal(mean: number, stdDev: number): number {
    // Box-Muller transform
    const u1 = this.next();
    const u2 = this.next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  }
  
  weightedChoice<T>(items: { weight: number; value: T }[]): T {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = this.next() * totalWeight;
    
    for (const item of items) {
      random -= item.weight;
      if (random <= 0) return item.value;
    }
    return items[items.length - 1].value;
  }
}

function generateGraduateDataset(count: number, seed: number = 42): GraduateRecord[] {
  const rng = new SeededRandom(seed);
  const graduates: GraduateRecord[] = [];
  
  for (let i = 0; i < count; i++) {
    // Select faculty with weighted probability
    const faculty = rng.weightedChoice(
      FACULTIES.map(f => ({ weight: f.weight, value: f }))
    );
    
    // Select university
    const university = UNIVERSITIES[rng.nextInt(0, UNIVERSITIES.length - 1)];
    
    // Select city with weighted probability
    const city = rng.weightedChoice(
      CITIES.map(c => ({ weight: c.weight, value: c }))
    );
    
    // Generate features with realistic distributions
    const gpa = Math.min(10, Math.max(4, rng.nextNormal(7.2, 1.5)));
    const experience = Math.max(0, rng.nextNormal(0.8, 0.7));
    const internships = rng.nextInt(0, 3);
    const certificates = rng.nextInt(0, 5);
    const englishLevel = rng.nextInt(1, 5);
    const softSkills = Math.min(10, Math.max(1, rng.nextNormal(6, 2)));
    const hardSkills = Math.min(10, Math.max(1, rng.nextNormal(6.5, 2)));
    const projectCount = rng.nextInt(0, 8);
    const graduationYear = rng.nextInt(2019, 2024);
    
    // Calculate employment probability using logistic model
    // This simulates a trained ML model
    const features = {
      gpa: (gpa - 4) / 6, // normalize to 0-1
      experience: Math.min(experience / 3, 1),
      internships: internships / 3,
      certificates: certificates / 5,
      englishLevel: (englishLevel - 1) / 4,
      softSkills: (softSkills - 1) / 9,
      hardSkills: (hardSkills - 1) / 9,
      projectCount: Math.min(projectCount / 8, 1),
      yearFactor: (graduationYear - 2019) / 5 * 0.05, // slight improvement over years
      universityQuality: (university.quality - 0.9) / 0.3,
      cityMarket: (city.marketFactor - 0.8) / 0.45,
      facultyBase: faculty.baseEmployment
    };
    
    // Weighted sum (simulating trained coefficients)
    const logit = 
      0.15 * features.gpa +
      0.20 * features.experience +
      0.12 * features.internships +
      0.08 * features.certificates +
      0.10 * features.englishLevel +
      0.08 * features.softSkills +
      0.12 * features.hardSkills +
      0.10 * features.projectCount +
      features.yearFactor +
      0.05 * features.universityQuality +
      0.12 * features.cityMarket +
      0.6 * features.facultyBase - 0.3;
    
    // Sigmoid function
    const employmentProbability = 1 / (1 + Math.exp(-logit * 4));
    
    // Add noise and determine employment
    const noiseAdjusted = employmentProbability + rng.nextNormal(0, 0.05);
    const employed = noiseAdjusted > rng.next();
    
    // Calculate salary if employed
    let salary = 0;
    let employmentTimeMonths = 0;
    let industry = '';
    let jobSatisfaction = 0;
    
    if (employed) {
      // Base salary from faculty
      const baseSalary = faculty.baseSalary;
      
      // Salary modifiers
      const salaryModifier = 
        1 +
        0.08 * (gpa - 7) / 3 +
        0.15 * experience +
        0.03 * internships +
        0.02 * certificates +
        0.05 * (englishLevel - 3) +
        0.04 * (hardSkills - 5) / 5 +
        (university.quality - 1) +
        (city.marketFactor - 1) * 0.3;
      
      salary = Math.round(baseSalary * Math.max(0.7, salaryModifier) * (1 + rng.nextNormal(0, 0.1)));
      salary = Math.max(600, salary); // minimum wage
      
      // Time to employment (inversely related to probability)
      employmentTimeMonths = Math.max(0, Math.round(
        (1 - employmentProbability) * 8 + rng.nextNormal(0, 1.5)
      ));
      
      // Assign industry based on faculty
      industry = faculty.name === 'IT и программирование' ? 'IT' :
                faculty.name === 'Экономика и финансы' ? 'Финансы' :
                faculty.name === 'Медицина' ? 'Здравоохранение' :
                faculty.name === 'Педагогика' ? 'Образование' :
                faculty.name === 'Инженерия' ? 'Промышленность' :
                INDUSTRIES[rng.nextInt(0, INDUSTRIES.length - 1)];
      
      // Job satisfaction correlates with salary and employment time
      jobSatisfaction = Math.min(10, Math.max(1, Math.round(
        5 + (salary - 1500) / 800 - employmentTimeMonths * 0.2 + rng.nextNormal(0, 1)
      )));
    }
    
    graduates.push({
      id: i + 1,
      faculty: faculty.name,
      university: university.name,
      city: city.name,
      gpa: Math.round(gpa * 100) / 100,
      experience: Math.round(experience * 10) / 10,
      internships,
      certificates,
      englishLevel,
      softSkills: Math.round(softSkills * 10) / 10,
      hardSkills: Math.round(hardSkills * 10) / 10,
      projectCount,
      graduationYear,
      employed,
      employmentTimeMonths,
      salary,
      industry,
      jobSatisfaction
    });
  }
  
  return graduates;
}

// Generate main dataset
export const GRADUATE_DATASET = generateGraduateDataset(1200, 42);

// Pre-computed statistics for fast access
export const DATASET_STATS = {
  total: GRADUATE_DATASET.length,
  employed: GRADUATE_DATASET.filter(g => g.employed).length,
  averageSalary: Math.round(
    GRADUATE_DATASET.filter(g => g.employed).reduce((sum, g) => sum + g.salary, 0) /
    GRADUATE_DATASET.filter(g => g.employed).length
  ),
  employmentRate: GRADUATE_DATASET.filter(g => g.employed).length / GRADUATE_DATASET.length,
  
  byFaculty: FACULTIES.map(f => {
    const facultyGrads = GRADUATE_DATASET.filter(g => g.faculty === f.name);
    const employed = facultyGrads.filter(g => g.employed);
    return {
      faculty: f.name,
      total: facultyGrads.length,
      employed: employed.length,
      employmentRate: employed.length / facultyGrads.length,
      averageSalary: employed.length > 0 
        ? Math.round(employed.reduce((sum, g) => sum + g.salary, 0) / employed.length)
        : 0
    };
  }),
  
  byCity: CITIES.map(c => {
    const cityGrads = GRADUATE_DATASET.filter(g => g.city === c.name);
    const employed = cityGrads.filter(g => g.employed);
    return {
      city: c.name,
      total: cityGrads.length,
      employed: employed.length,
      employmentRate: employed.length / cityGrads.length || 0,
      averageSalary: employed.length > 0 
        ? Math.round(employed.reduce((sum, g) => sum + g.salary, 0) / employed.length)
        : 0
    };
  }),
  
  byYear: [2019, 2020, 2021, 2022, 2023, 2024].map(year => {
    const yearGrads = GRADUATE_DATASET.filter(g => g.graduationYear === year);
    const employed = yearGrads.filter(g => g.employed);
    return {
      year,
      total: yearGrads.length,
      employed: employed.length,
      employmentRate: employed.length / yearGrads.length || 0,
      averageSalary: employed.length > 0
        ? Math.round(employed.reduce((sum, g) => sum + g.salary, 0) / employed.length)
        : 0
    };
  })
};

export { FACULTIES, UNIVERSITIES, CITIES, INDUSTRIES };
