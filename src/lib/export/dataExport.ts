/**
 * Data Export Module
 * Export data to CSV and Excel formats
 */

import * as XLSX from 'xlsx';
import { 
  FACULTY_STATS, 
  CITY_STATS, 
  YEARLY_TRENDS, 
  VACANCY_DATA,
  generateGraduates,
  Graduate
} from '@/data/belarusData';

export type ExportFormat = 'csv' | 'xlsx';

/**
 * Export faculty statistics
 */
export function exportFacultyStats(format: ExportFormat = 'xlsx'): void {
  const data = FACULTY_STATS.map(f => ({
    'Направление': f.name,
    'Уровень трудоустройства (%)': f.employmentRate,
    'Средняя зарплата (BYN)': f.avgSalary,
    'Количество выпускников': f.graduates,
    'Тренд': f.trend === 'up' ? 'Рост' : f.trend === 'down' ? 'Снижение' : 'Стабильно'
  }));

  downloadData(data, 'faculty_statistics', format);
}

/**
 * Export city statistics
 */
export function exportCityStats(format: ExportFormat = 'xlsx'): void {
  const data = CITY_STATS.map(c => ({
    'Город': c.name,
    'Количество выпускников': c.graduates,
    'Уровень трудоустройства (%)': c.employmentRate,
    'Средняя зарплата (BYN)': c.avgSalary
  }));

  downloadData(data, 'city_statistics', format);
}

/**
 * Export yearly trends
 */
export function exportYearlyTrends(format: ExportFormat = 'xlsx'): void {
  const data = YEARLY_TRENDS.map(t => ({
    'Год': t.year,
    'Уровень трудоустройства (%)': t.employmentRate,
    'Средняя зарплата (BYN)': t.avgSalary,
    'Количество выпускников': t.graduates
  }));

  downloadData(data, 'yearly_trends', format);
}

/**
 * Export vacancy data
 */
export function exportVacancyData(format: ExportFormat = 'xlsx'): void {
  const data = VACANCY_DATA.map(v => ({
    'Категория': v.category,
    'Количество вакансий': v.count,
    'Средняя зарплата (BYN)': v.avgSalary,
    'Рост (%)': v.growth
  }));

  downloadData(data, 'vacancy_data', format);
}

/**
 * Export graduates sample data
 */
export function exportGraduatesData(count: number = 1000, format: ExportFormat = 'xlsx'): void {
  const graduates = generateGraduates(count);
  
  const data = graduates.map(g => ({
    'ID': g.id,
    'Университет': g.university,
    'Направление': g.faculty,
    'Город': g.city,
    'Год выпуска': g.graduationYear,
    'Трудоустроен': g.employed ? 'Да' : 'Нет',
    'Зарплата (BYN)': g.salary,
    'Средний балл': g.gpa.toFixed(1),
    'Опыт работы (лет)': g.experience,
    'Возраст': g.age
  }));

  downloadData(data, 'graduates_data', format);
}

/**
 * Export full report with all data
 */
export function exportFullReport(format: ExportFormat = 'xlsx'): void {
  if (format === 'csv') {
    // For CSV, export each section separately
    exportFacultyStats('csv');
    setTimeout(() => exportCityStats('csv'), 500);
    setTimeout(() => exportYearlyTrends('csv'), 1000);
    setTimeout(() => exportVacancyData('csv'), 1500);
    return;
  }

  // For Excel, create multi-sheet workbook
  const workbook = XLSX.utils.book_new();

  // Faculty stats sheet
  const facultyData = FACULTY_STATS.map(f => ({
    'Направление': f.name,
    'Уровень трудоустройства (%)': f.employmentRate,
    'Средняя зарплата (BYN)': f.avgSalary,
    'Количество выпускников': f.graduates,
    'Тренд': f.trend === 'up' ? 'Рост' : f.trend === 'down' ? 'Снижение' : 'Стабильно'
  }));
  const facultySheet = XLSX.utils.json_to_sheet(facultyData);
  XLSX.utils.book_append_sheet(workbook, facultySheet, 'Факультеты');

  // City stats sheet
  const cityData = CITY_STATS.map(c => ({
    'Город': c.name,
    'Количество выпускников': c.graduates,
    'Уровень трудоустройства (%)': c.employmentRate,
    'Средняя зарплата (BYN)': c.avgSalary
  }));
  const citySheet = XLSX.utils.json_to_sheet(cityData);
  XLSX.utils.book_append_sheet(workbook, citySheet, 'Города');

  // Trends sheet
  const trendsData = YEARLY_TRENDS.map(t => ({
    'Год': t.year,
    'Уровень трудоустройства (%)': t.employmentRate,
    'Средняя зарплата (BYN)': t.avgSalary,
    'Количество выпускников': t.graduates
  }));
  const trendsSheet = XLSX.utils.json_to_sheet(trendsData);
  XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Тренды');

  // Vacancies sheet
  const vacancyDataFormatted = VACANCY_DATA.map(v => ({
    'Категория': v.category,
    'Количество вакансий': v.count,
    'Средняя зарплата (BYN)': v.avgSalary,
    'Рост (%)': v.growth
  }));
  const vacancySheet = XLSX.utils.json_to_sheet(vacancyDataFormatted);
  XLSX.utils.book_append_sheet(workbook, vacancySheet, 'Вакансии');

  // Sample graduates sheet
  const graduates = generateGraduates(500);
  const graduatesData = graduates.map(g => ({
    'Университет': g.university,
    'Направление': g.faculty,
    'Город': g.city,
    'Год выпуска': g.graduationYear,
    'Трудоустроен': g.employed ? 'Да' : 'Нет',
    'Зарплата (BYN)': g.salary,
    'Средний балл': g.gpa.toFixed(1),
    'Опыт (лет)': g.experience
  }));
  const graduatesSheet = XLSX.utils.json_to_sheet(graduatesData);
  XLSX.utils.book_append_sheet(workbook, graduatesSheet, 'Выпускники');

  // Download
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `full_employment_report_${timestamp}.xlsx`);
}

/**
 * Helper function to download data
 */
function downloadData(data: Record<string, any>[], filename: string, format: ExportFormat): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}`;

  if (format === 'csv') {
    // Convert to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const value = row[h];
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(','))
    ].join('\n');

    // Add BOM for UTF-8 support in Excel
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${fullFilename}.csv`);
  } else {
    // Convert to Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${fullFilename}.xlsx`);
  }
}

/**
 * Helper to download a blob
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export prediction result
 */
export function exportPredictionResult(
  prediction: {
    faculty: string;
    university: string;
    city: string;
    gpa: number;
    experience: number;
    probability: number;
    expectedSalary: number;
    confidence: number;
  },
  format: ExportFormat = 'xlsx'
): void {
  const data = [{
    'Направление': prediction.faculty,
    'Университет': prediction.university,
    'Город': prediction.city,
    'Средний балл': prediction.gpa,
    'Опыт работы (лет)': prediction.experience,
    'Вероятность трудоустройства (%)': prediction.probability,
    'Ожидаемая зарплата (BYN)': prediction.expectedSalary,
    'Достоверность модели': prediction.confidence,
    'Дата прогноза': new Date().toLocaleDateString('ru-RU')
  }];

  downloadData(data, 'employment_prediction', format);
}
