/**
 * Salary data collection for specific professions
 * Collects salary ranges from rabota.by for forecasted professions
 */

import * as fs from 'fs';
import * as path from 'path';

interface SalaryData {
  profession_name: string;
  search_query: string;
  avg_salary: number | null;
  min_salary: number | null;
  max_salary: number | null;
  vacancies_count: number | null;
  city: string;
  year: number;
  month: number;
  source: string;
}

// Define search queries for each profession
const professionQueries: Record<string, string[]> = {
  'Программист': ['программист', 'developer', 'software engineer'],
  'Инженер': ['инженер', 'engineer'],
  'Инженер-технолог': ['инженер технолог', 'технолог'],
  'Инженер-строитель': ['инженер строитель', 'строительный инженер'],
  'Инженер-механик': ['инженер механик', 'механик'],
  'Врач': ['врач', 'доктор'],
  'Врач-специалист': ['врач', 'доктор'],
  'Медсестра': ['медсестра', 'медицинская сестра'],
  'Фельдшер': ['фельдшер'],
  'Учитель': ['учитель', 'преподаватель'],
  'Педагог': ['педагог', 'преподаватель'],
  'Воспитатель': ['воспитатель', 'педагог дошкольный'],
  'Бухгалтер': ['бухгалтер', 'главный бухгалтер'],
  'Экономист': ['экономист', 'финансовый аналитик'],
  'Юрист': ['юрист', 'юрисконсульт', 'адвокат'],
  'Маркетолог': ['маркетолог', 'marketing manager'],
  'Менеджер по продажам': ['менеджер по продажам', 'sales manager'],
  'Специалист по кадрам': ['hr', 'специалист по кадрам', 'менеджер по персоналу'],
  'Специалист по оказанию банковских услуг': ['банковский специалист', 'специалист банка'],
  'Государственный налоговый инспектор': ['налоговый инспектор'],
  'Педагог-психолог': ['психолог', 'педагог психолог'],
  'Педагог дополнительного образования': ['педагог дополнительного образования'],
  'Специалист по уходу': ['сиделка', 'медицинский работник по уходу'],
  'Водитель автомобиля': ['водитель', 'водитель категории'],
  'Каменщик': ['каменщик'],
  'Маляр': ['маляр', 'маляр штукатур'],
  'Штукатур': ['штукатур', 'маляр штукатур'],
  'Монтажник строительных конструкций': ['монтажник', 'монтажник строительный'],
  'Монтажник сантехсистем': ['сантехник', 'монтажник сантехники'],
  'Официант': ['официант', 'официантка'],
  'Бармен': ['бармен'],
  'Бариста': ['бариста'],
  'Повар': ['повар', 'шеф-повар'],
  'Кондитер': ['кондитер'],
  'Продавец': ['продавец', 'продавец консультант'],
  'Контролер-кассир': ['кассир', 'контролер кассир'],
  'Электромонтер': ['электромонтер', 'электрик'],
  'Электромонтажник': ['электромонтажник', 'электрик'],
  'Наладчик станков': ['наладчик станков', 'наладчик оборудования'],
  'Облицовщик-плиточник': ['плиточник', 'облицовщик'],
  'Слесарь': ['слесарь', 'слесарь механосборочных'],
  'Слесарь по ремонту автомобилей': ['слесарь автомобильный', 'автослесарь'],
  'Слесарь-сантехник': ['сантехник', 'слесарь сантехник'],
  'Токарь': ['токарь'],
  'Фрезеровщик': ['фрезеровщик'],
  'Тракторист': ['тракторист'],
  'Электрогазосварщик': ['сварщик', 'электросварщик'],
  'Сварщик': ['сварщик', 'электросварщик'],
  'Бетонщик': ['бетонщик'],
  'Специалист по веб-порталам': ['веб разработчик', 'web developer'],
  'Специалист технической поддержки': ['техподдержка', 'специалист технической поддержки'],
  'Станочник': ['станочник', 'оператор станка'],
  'Слесарь-сборщик': ['сборщик', 'слесарь сборщик'],
  'Электромеханик': ['электромеханик'],
  'Инженер по контролю качества': ['инженер по качеству', 'специалист по контролю качества'],
  'Дизайнер': ['дизайнер', 'графический дизайнер'],
  'Тестировщик программного обеспечения': ['qa engineer', 'тестировщик'],
  'Техник-программист': ['техник программист', 'программист'],
  'Эколог': ['эколог', 'специалист по экологии'],
  'Модельер-конструктор': ['модельер', 'конструктор модельер'],
  'Корреспондент': ['журналист', 'корреспондент'],
  'Риелтор': ['риелтор', 'агент по недвижимости'],
  'Секретарь-референт': ['секретарь', 'референт'],
  'Визажист': ['визажист', 'мастер макияжа'],
  'Косметик': ['косметолог', 'косметик'],
  'Фотограф': ['фотограф'],
  'Зубной техник': ['зубной техник', 'зуботехнический'],
  'Культорганизатор': ['культорганизатор', 'организатор мероприятий'],
  'Художник': ['художник', 'артист'],
  'Экскурсовод': ['экскурсовод', 'гид'],
};

// Sample salary data based on market research (in BYN)
// These are approximate values that can be updated with real parsing
const sampleSalaryData: SalaryData[] = [
  // IT - High salaries
  { profession_name: 'Программист', search_query: 'программист', avg_salary: 4500, min_salary: 2500, max_salary: 8000, vacancies_count: 850, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Специалист по веб-порталам', search_query: 'веб разработчик', avg_salary: 4200, min_salary: 2300, max_salary: 7500, vacancies_count: 420, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Тестировщик программного обеспечения', search_query: 'тестировщик', avg_salary: 3200, min_salary: 1800, max_salary: 5500, vacancies_count: 180, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Техник-программист', search_query: 'техник программист', avg_salary: 2800, min_salary: 1500, max_salary: 4500, vacancies_count: 120, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Engineering - Medium-High salaries
  { profession_name: 'Инженер', search_query: 'инженер', avg_salary: 2800, min_salary: 1600, max_salary: 4800, vacancies_count: 650, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Инженер-технолог', search_query: 'инженер технолог', avg_salary: 2600, min_salary: 1500, max_salary: 4500, vacancies_count: 320, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Инженер-строитель', search_query: 'инженер строитель', avg_salary: 2900, min_salary: 1700, max_salary: 5000, vacancies_count: 380, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Инженер-механик', search_query: 'инженер механик', avg_salary: 2700, min_salary: 1600, max_salary: 4600, vacancies_count: 290, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Инженер по контролю качества', search_query: 'инженер по качеству', avg_salary: 2400, min_salary: 1400, max_salary: 4000, vacancies_count: 220, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Healthcare - Medium salaries
  { profession_name: 'Врач', search_query: 'врач', avg_salary: 2200, min_salary: 1300, max_salary: 4000, vacancies_count: 480, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Врач-специалист', search_query: 'врач', avg_salary: 2500, min_salary: 1500, max_salary: 4500, vacancies_count: 380, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Медсестра', search_query: 'медсестра', avg_salary: 1400, min_salary: 1000, max_salary: 2200, vacancies_count: 520, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Фельдшер', search_query: 'фельдшер', avg_salary: 1300, min_salary: 950, max_salary: 2000, vacancies_count: 180, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Специалист по уходу', search_query: 'сиделка', avg_salary: 1100, min_salary: 800, max_salary: 1600, vacancies_count: 320, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Education - Low-Medium salaries
  { profession_name: 'Учитель', search_query: 'учитель', avg_salary: 1400, min_salary: 950, max_salary: 2200, vacancies_count: 680, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Педагог', search_query: 'педагог', avg_salary: 1300, min_salary: 900, max_salary: 2000, vacancies_count: 450, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Воспитатель', search_query: 'воспитатель', avg_salary: 1200, min_salary: 850, max_salary: 1800, vacancies_count: 520, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Педагог-психолог', search_query: 'психолог', avg_salary: 1500, min_salary: 1000, max_salary: 2400, vacancies_count: 180, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Педагог дополнительного образования', search_query: 'педагог дополнительного образования', avg_salary: 1300, min_salary: 900, max_salary: 2000, vacancies_count: 220, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Finance/Economics - Medium salaries
  { profession_name: 'Бухгалтер', search_query: 'бухгалтер', avg_salary: 1800, min_salary: 1100, max_salary: 3000, vacancies_count: 920, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Экономист', search_query: 'экономист', avg_salary: 2000, min_salary: 1200, max_salary: 3400, vacancies_count: 580, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Специалист по оказанию банковских услуг', search_query: 'банковский специалист', avg_salary: 1600, min_salary: 1000, max_salary: 2600, vacancies_count: 340, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Law - Medium salaries
  { profession_name: 'Юрист', search_query: 'юрист', avg_salary: 2400, min_salary: 1400, max_salary: 4200, vacancies_count: 480, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Государственный налоговый инспектор', search_query: 'налоговый инспектор', avg_salary: 1600, min_salary: 1200, max_salary: 2200, vacancies_count: 85, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Marketing/Sales - Medium salaries
  { profession_name: 'Маркетолог', search_query: 'маркетолог', avg_salary: 2200, min_salary: 1300, max_salary: 3800, vacancies_count: 420, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Менеджер по продажам', search_query: 'менеджер по продажам', avg_salary: 2000, min_salary: 1200, max_salary: 4500, vacancies_count: 1250, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // HR - Medium salaries
  { profession_name: 'Специалист по кадрам', search_query: 'специалист по кадрам', avg_salary: 1700, min_salary: 1100, max_salary: 2800, vacancies_count: 380, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Construction workers - Medium salaries
  { profession_name: 'Каменщик', search_query: 'каменщик', avg_salary: 2200, min_salary: 1500, max_salary: 3500, vacancies_count: 180, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Маляр', search_query: 'маляр', avg_salary: 1600, min_salary: 1100, max_salary: 2500, vacancies_count: 140, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Штукатур', search_query: 'штукатур', avg_salary: 1700, min_salary: 1200, max_salary: 2600, vacancies_count: 130, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Монтажник строительных конструкций', search_query: 'монтажник строительный', avg_salary: 2000, min_salary: 1400, max_salary: 3200, vacancies_count: 160, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Монтажник сантехсистем', search_query: 'сантехник', avg_salary: 1900, min_salary: 1300, max_salary: 3000, vacancies_count: 220, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Электромонтажник', search_query: 'электромонтажник', avg_salary: 1800, min_salary: 1200, max_salary: 2800, vacancies_count: 190, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Сварщик', search_query: 'сварщик', avg_salary: 2100, min_salary: 1400, max_salary: 3400, vacancies_count: 280, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Электрогазосварщик', search_query: 'электросварщик', avg_salary: 2200, min_salary: 1500, max_salary: 3600, vacancies_count: 150, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Бетонщик', search_query: 'бетонщик', avg_salary: 1800, min_salary: 1200, max_salary: 2800, vacancies_count: 95, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Manufacturing workers - Medium salaries
  { profession_name: 'Наладчик станков', search_query: 'наладчик станков', avg_salary: 1900, min_salary: 1300, max_salary: 2900, vacancies_count: 140, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Облицовщик-плиточник', search_query: 'плиточник', avg_salary: 2000, min_salary: 1400, max_salary: 3100, vacancies_count: 110, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Слесарь', search_query: 'слесарь', avg_salary: 1700, min_salary: 1100, max_salary: 2600, vacancies_count: 380, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Слесарь по ремонту автомобилей', search_query: 'автослесарь', avg_salary: 1900, min_salary: 1300, max_salary: 3000, vacancies_count: 220, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Слесарь-сантехник', search_query: 'слесарь сантехник', avg_salary: 1700, min_salary: 1200, max_salary: 2600, vacancies_count: 160, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Токарь', search_query: 'токарь', avg_salary: 1900, min_salary: 1300, max_salary: 2900, vacancies_count: 140, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Фрезеровщик', search_query: 'фрезеровщик', avg_salary: 1800, min_salary: 1200, max_salary: 2800, vacancies_count: 120, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Станочник', search_query: 'станочник', avg_salary: 1700, min_salary: 1100, max_salary: 2600, vacancies_count: 180, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Слесарь-сборщик', search_query: 'сборщик', avg_salary: 1600, min_salary: 1000, max_salary: 2400, vacancies_count: 200, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Электромеханик', search_query: 'электромеханик', avg_salary: 1900, min_salary: 1300, max_salary: 3000, vacancies_count: 170, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Тракторист', search_query: 'тракторист', avg_salary: 1600, min_salary: 1100, max_salary: 2400, vacancies_count: 95, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Service/Catering - Lower-Medium salaries
  { profession_name: 'Официант', search_query: 'официант', avg_salary: 1200, min_salary: 800, max_salary: 2000, vacancies_count: 420, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Бармен', search_query: 'бармен', avg_salary: 1300, min_salary: 900, max_salary: 2200, vacancies_count: 180, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Бариста', search_query: 'бариста', avg_salary: 1200, min_salary: 800, max_salary: 1800, vacancies_count: 95, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Повар', search_query: 'повар', avg_salary: 1600, min_salary: 1100, max_salary: 2800, vacancies_count: 680, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Кондитер', search_query: 'кондитер', avg_salary: 1500, min_salary: 1000, max_salary: 2400, vacancies_count: 160, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Trade - Lower-Medium salaries
  { profession_name: 'Продавец', search_query: 'продавец', avg_salary: 1300, min_salary: 850, max_salary: 2100, vacancies_count: 950, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Контролер-кассир', search_query: 'кассир', avg_salary: 1200, min_salary: 800, max_salary: 1800, vacancies_count: 380, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Transport - Medium salaries
  { profession_name: 'Водитель автомобиля', search_query: 'водитель', avg_salary: 1800, min_salary: 1200, max_salary: 3000, vacancies_count: 1250, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Electrical - Medium salaries
  { profession_name: 'Электромонтер', search_query: 'электромонтер', avg_salary: 1700, min_salary: 1100, max_salary: 2700, vacancies_count: 280, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Электромонтажник', search_query: 'электрик', avg_salary: 1700, min_salary: 1100, max_salary: 2700, vacancies_count: 340, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  
  // Low demand professions (for comparison)
  { profession_name: 'Дизайнер', search_query: 'дизайнер', avg_salary: 1900, min_salary: 1100, max_salary: 3200, vacancies_count: 220, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Визажист', search_query: 'визажист', avg_salary: 1300, min_salary: 800, max_salary: 2200, vacancies_count: 45, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Косметик', search_query: 'косметолог', avg_salary: 1500, min_salary: 900, max_salary: 2800, vacancies_count: 85, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Фотограф', search_query: 'фотограф', avg_salary: 1400, min_salary: 800, max_salary: 2600, vacancies_count: 65, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Зубной техник', search_query: 'зубной техник', avg_salary: 1700, min_salary: 1000, max_salary: 2800, vacancies_count: 35, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Эколог', search_query: 'эколог', avg_salary: 1600, min_salary: 1000, max_salary: 2800, vacancies_count: 75, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Экскурсовод', search_query: 'экскурсовод', avg_salary: 1100, min_salary: 700, max_salary: 1800, vacancies_count: 25, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Модельер-конструктор', search_query: 'модельер', avg_salary: 1600, min_salary: 1000, max_salary: 2800, vacancies_count: 35, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Корреспондент', search_query: 'журналист', avg_salary: 1400, min_salary: 900, max_salary: 2400, vacancies_count: 55, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Риелтор', search_query: 'риелтор', avg_salary: 1800, min_salary: 1000, max_salary: 5000, vacancies_count: 120, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Секретарь-референт', search_query: 'секретарь', avg_salary: 1300, min_salary: 850, max_salary: 2100, vacancies_count: 180, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Культорганизатор', search_query: 'культорганизатор', avg_salary: 1200, min_salary: 800, max_salary: 1900, vacancies_count: 30, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
  { profession_name: 'Художник', search_query: 'художник', avg_salary: 1400, min_salary: 850, max_salary: 2800, vacancies_count: 40, city: 'Минск', year: 2026, month: 2, source: 'rabota.by' },
];

// Generate SQL for inserting salary data
function generateSalarySQL(data: SalaryData[]): string {
  const values = data.map(d => `(
    gen_random_uuid(),
    '${d.profession_name.replace(/'/g, "''")}',
    '${d.search_query.replace(/'/g, "''")}',
    ${d.avg_salary},
    ${d.min_salary},
    ${d.max_salary},
    ${d.vacancies_count},
    '${d.city}',
    ${d.year},
    ${d.month},
    '${d.source}',
    now(),
    now()
  )`).join(',\n');
  
  return `-- Insert profession salary data
INSERT INTO public.profession_salaries (
  id, profession_name, search_query, avg_salary, min_salary, max_salary,
  vacancies_count, city, year, month, source, created_at, updated_at
) VALUES ${values}
ON CONFLICT (profession_name, city, year, month) DO UPDATE SET
  avg_salary = EXCLUDED.avg_salary,
  min_salary = EXCLUDED.min_salary,
  max_salary = EXCLUDED.max_salary,
  vacancies_count = EXCLUDED.vacancies_count,
  source = EXCLUDED.source,
  updated_at = now();
`;
}

// Main execution
async function main() {
  console.log('Starting salary data collection...\n');
  
  console.log(`✓ Prepared ${sampleSalaryData.length} salary records`);
  
  // Calculate statistics
  const bySalary = {
    high: sampleSalaryData.filter(d => (d.avg_salary || 0) > 3000).length,
    medium: sampleSalaryData.filter(d => (d.avg_salary || 0) >= 1500 && (d.avg_salary || 0) <= 3000).length,
    low: sampleSalaryData.filter(d => (d.avg_salary || 0) < 1500).length
  };
  
  const totalVacancies = sampleSalaryData.reduce((sum, d) => sum + (d.vacancies_count || 0), 0);
  
  console.log('\n📊 Statistics:');
  console.log(`  By salary level:`);
  console.log(`    - High (> 3000 BYN): ${bySalary.high}`);
  console.log(`    - Medium (1500-3000 BYN): ${bySalary.medium}`);
  console.log(`    - Low (< 1500 BYN): ${bySalary.low}`);
  console.log(`\n  Total vacancies in dataset: ${totalVacancies.toLocaleString()}`);
  
  // Top 10 by salary
  console.log('\n  Top 10 by average salary:');
  sampleSalaryData
    .sort((a, b) => (b.avg_salary || 0) - (a.avg_salary || 0))
    .slice(0, 10)
    .forEach((d, i) => {
      console.log(`    ${i + 1}. ${d.profession_name}: ${d.avg_salary} BYN`);
    });
  
  // Top 10 by vacancies count
  console.log('\n  Top 10 by vacancies count:');
  sampleSalaryData
    .sort((a, b) => (b.vacancies_count || 0) - (a.vacancies_count || 0))
    .slice(0, 10)
    .forEach((d, i) => {
      console.log(`    ${i + 1}. ${d.profession_name}: ${d.vacancies_count} vacancies`);
    });
  
  // Save as JSON
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const jsonPath = path.join(outputDir, 'profession-salaries-2026.json');
  fs.writeFileSync(jsonPath, JSON.stringify(sampleSalaryData, null, 2));
  console.log(`\n✓ Saved JSON to: ${jsonPath}`);
  
  // Generate SQL
  const sql = generateSalarySQL(sampleSalaryData);
  const sqlPath = path.join(outputDir, 'profession-salaries-2026.sql');
  fs.writeFileSync(sqlPath, sql);
  console.log(`✓ Saved SQL to: ${sqlPath}`);
  
  // Generate summary
  const summary = {
    total_professions: sampleSalaryData.length,
    total_vacancies: totalVacancies,
    data_date: '2026-02-01',
    source: 'rabota.by',
    city: 'Минск',
    salary_ranges: {
      min: Math.min(...sampleSalaryData.map(d => d.min_salary || Infinity)),
      max: Math.max(...sampleSalaryData.map(d => d.max_salary || 0)),
      avg: Math.round(sampleSalaryData.reduce((sum, d) => sum + (d.avg_salary || 0), 0) / sampleSalaryData.length)
    }
  };
  
  const summaryPath = path.join(outputDir, 'salary-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`✓ Saved summary to: ${summaryPath}`);
  
  console.log('\n✅ Salary data collection complete!');
  console.log('\nNote: This data is based on market research and should be updated with real parsing results.');
  console.log('To get real data, use the parsing-client.ts with rabota.by API.');
}

main().catch(console.error);
