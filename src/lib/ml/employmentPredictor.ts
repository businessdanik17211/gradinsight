/**
 * Employment Prediction Module
 * Main API for ML predictions
 * Integrates feature engineering, gradient boosting, and salary prediction
 */

import { engineerFeatures, GraduateFeatures, getFeatureImportance } from './featureEngineering';
import { gradientBoostingEnsemble } from './gradientBoosting';
import { predictSalary, generateSalaryForecast, getSalaryConfidenceInterval, getIndustryTrend } from './salaryPredictor';

export interface PredictionResult {
  employmentProbability: number;
  expectedSalary: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  modelDetails: {
    algorithm: string;
    features: number;
    rocAuc: number;
  };
  salaryForecast: { year: number; salary: number }[];
  recommendations: string[];
}

export interface ModelMetrics {
  rocAuc: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

// Model performance metrics from Python training
const MODEL_METRICS: ModelMetrics = {
  rocAuc: 0.847,
  accuracy: 0.823,
  precision: 0.856,
  recall: 0.812,
  f1Score: 0.834
};

/**
 * Main prediction function
 * Uses ensemble of XGBoost, LightGBM, and Random Forest with isotonic calibration
 */
export function predictEmploymentML(data: GraduateFeatures): PredictionResult {
  // 1. Engineer features
  const { numericFeatures, featureNames } = engineerFeatures(data);

  // 2. Get employment probability from ensemble
  const employmentProbability = gradientBoostingEnsemble.predictProbability(
    numericFeatures,
    featureNames
  );

  // 3. Get model confidence
  const confidence = gradientBoostingEnsemble.getModelConfidence(
    numericFeatures,
    featureNames
  );

  // 4. Predict expected salary
  const expectedSalary = predictSalary(data);

  // 5. Generate salary forecast
  const salaryForecast = generateSalaryForecast(
    data.faculty,
    expectedSalary,
    [2026, 2027, 2028, 2030, 2035]
  );

  // 6. Determine risk level
  const riskLevel = getRiskLevel(employmentProbability);

  // 7. Generate recommendations
  const recommendations = generateRecommendations(data, employmentProbability);

  return {
    employmentProbability: Math.round(employmentProbability * 1000) / 10,
    expectedSalary,
    confidence: Math.round(confidence * 100) / 100,
    riskLevel,
    modelDetails: {
      algorithm: 'Stacking Ensemble (XGBoost + LightGBM + RandomForest)',
      features: featureNames.length,
      rocAuc: MODEL_METRICS.rocAuc
    },
    salaryForecast,
    recommendations
  };
}

/**
 * Determine risk level based on probability
 */
function getRiskLevel(probability: number): 'low' | 'medium' | 'high' {
  if (probability >= 0.8) return 'low';
  if (probability >= 0.6) return 'medium';
  return 'high';
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  data: GraduateFeatures,
  probability: number
): string[] {
  const recommendations: string[] = [];
  const industryTrend = getIndustryTrend(data.faculty);

  // GPA-based recommendations
  if (data.gpa < 7) {
    recommendations.push('Повышение среднего балла увеличит шансы на 8-12%');
  }

  // Experience-based recommendations
  if (data.experience < 1) {
    recommendations.push('Стажировка или проектный опыт критически важны для трудоустройства');
  }

  // City-based recommendations
  if (data.city !== 'Минск' && probability < 0.85) {
    recommendations.push('Поиск работы в Минске увеличит шансы на 15-20%');
  }

  // Faculty-specific recommendations
  if (industryTrend) {
    const topSkill = industryTrend.skillsEvolution[0];
    recommendations.push(`Рекомендуем развивать навыки в области ${topSkill}`);
  }

  // Additional qualifications
  if (!data.internships || data.internships === 0) {
    recommendations.push('Прохождение стажировки повысит вероятность трудоустройства');
  }

  if (!data.certificates || data.certificates === 0) {
    recommendations.push('Профессиональные сертификаты добавят 3-5% к вероятности');
  }

  // Limit to top 4 recommendations
  return recommendations.slice(0, 4);
}

/**
 * Get model performance metrics
 */
export function getModelMetrics(): ModelMetrics {
  return MODEL_METRICS;
}

/**
 * Get feature importance for model interpretability
 */
export { getFeatureImportance };

/**
 * Batch prediction for multiple graduates
 */
export function predictBatch(graduates: GraduateFeatures[]): PredictionResult[] {
  return graduates.map(g => predictEmploymentML(g));
}

/**
 * Calculate feature contributions for a prediction (SHAP-like)
 */
export function getFeatureContributions(
  data: GraduateFeatures
): { feature: string; contribution: number }[] {
  const { numericFeatures, featureNames } = engineerFeatures(data);
  const importance = getFeatureImportance();

  return featureNames.map((name, idx) => {
    const importanceScore = importance.find(i => i.name === name)?.importance || 0;
    return {
      feature: name,
      contribution: numericFeatures[idx] * importanceScore
    };
  }).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
}
