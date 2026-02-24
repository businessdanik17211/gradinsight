// Средние проходные баллы для университетов Беларуси (2025 год)
// Данные предоставлены пользователем

export const UNIVERSITY_AVERAGE_MARKS: Record<string, number> = {
  'БГМУ': 364,
  'БГПУ': 290,
  'ВГУ': 267,
  'ГГТУ': 272,
  'БГУ': 349,
  'БГУИР': 342,
  'БГЭУ': 340,
  'БНТУ': 284,
  'ПГУ': 245,
  'ГрГУ': 278,
  'БГУИЯ': 358,
  'Академия управления': 361,
  'Академия МВД': 261,
  'БрГУ': 287,
  'БГАА': 332,
  'БГУКИ': 309,
  'БГУФК': 301
};

// Интерфейс для университета
export interface University {
  id: string;
  short_name: string;
  full_name: string;
  city: string;
  website?: string;
  average_mark: number;
}

// Полный список университетов с данными
export const ALL_UNIVERSITIES: University[] = [
  {
    id: 'bsu',
    short_name: 'БГУ',
    full_name: 'Белорусский государственный университет',
    city: 'Минск',
    website: 'https://www.bsu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БГУ']
  },
  {
    id: 'bsuir',
    short_name: 'БГУИР',
    full_name: 'Белорусский государственный университет информатики и радиоэлектроники',
    city: 'Минск',
    website: 'https://www.bsuir.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БГУИР']
  },
  {
    id: 'bntu',
    short_name: 'БНТУ',
    full_name: 'Белорусский национальный технический университет',
    city: 'Минск',
    website: 'https://www.bntu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БНТУ']
  },
  {
    id: 'bsmu',
    short_name: 'БГМУ',
    full_name: 'Белорусский государственный медицинский университет',
    city: 'Минск',
    website: 'https://www.bsmu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БГМУ']
  },
  {
    id: 'bseu',
    short_name: 'БГЭУ',
    full_name: 'Белорусский государственный экономический университет',
    city: 'Минск',
    website: 'https://www.bseu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БГЭУ']
  },
  {
    id: 'bspu',
    short_name: 'БГПУ',
    full_name: 'Белорусский государственный педагогический университет',
    city: 'Минск',
    website: 'https://www.bspu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БГПУ']
  },
  {
    id: 'grsu',
    short_name: 'ГрГУ',
    full_name: 'Гродненский государственный университет имени Янки Купалы',
    city: 'Гродно',
    website: 'https://www.grsu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['ГрГУ']
  },
  {
    id: 'vsu',
    short_name: 'ВГУ',
    full_name: 'Витебский государственный университет имени П.М. Машерова',
    city: 'Витебск',
    website: 'https://www.vsu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['ВГУ']
  },
  {
    id: 'gstu',
    short_name: 'ГГТУ',
    full_name: 'Гомельский государственный технический университет имени П.О. Сухого',
    city: 'Гомель',
    website: 'https://www.gstu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['ГГТУ']
  },
  {
    id: 'psu',
    short_name: 'ПГУ',
    full_name: 'Полоцкий государственный университет имени Евфросинии Полоцкой',
    city: 'Новополоцк',
    website: 'https://www.psu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['ПГУ']
  },
  {
    id: 'bsuia',
    short_name: 'БГУИЯ',
    full_name: 'Минский государственный лингвистический университет',
    city: 'Минск',
    website: 'https://www.mslu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БГУИЯ']
  },
  {
    id: 'academy_management',
    short_name: 'Академия управления',
    full_name: 'Академия управления при Президенте Республики Беларусь',
    city: 'Минск',
    website: 'https://www.academy.gov.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['Академия управления']
  },
  {
    id: 'academy_mvd',
    short_name: 'Академия МВД',
    full_name: 'Академия Министерства внутренних дел Республики Беларусь',
    city: 'Минск',
    website: 'https://www.academy.mvd.gov.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['Академия МВД']
  },
  {
    id: 'brsu',
    short_name: 'БрГУ',
    full_name: 'Брестский государственный университет имени А.С. Пушкина',
    city: 'Брест',
    website: 'https://www.brsu.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БрГУ']
  },
  {
    id: 'bsaa',
    short_name: 'БГАА',
    full_name: 'Белорусская государственная академия авиации',
    city: 'Минск',
    website: 'https://www.bsaa.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БГАА']
  },
  {
    id: 'bsuki',
    short_name: 'БГУКИ',
    full_name: 'Белорусский государственный университет культуры и искусств',
    city: 'Минск',
    website: 'https://www.bsuki.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БГУКИ']
  },
  {
    id: 'bsufk',
    short_name: 'БГУФК',
    full_name: 'Белорусский государственный университет физической культуры',
    city: 'Минск',
    website: 'https://www.bsufk.by',
    average_mark: UNIVERSITY_AVERAGE_MARKS['БГУФК']
  }
];

// Получить средний балл по названию университета
export function getAverageMark(universityShortName: string): number {
  return UNIVERSITY_AVERAGE_MARKS[universityShortName] || 0;
}

// Получить университет по сокращенному названию
export function getUniversityByShortName(shortName: string): University | undefined {
  return ALL_UNIVERSITIES.find(u => u.short_name === shortName);
}