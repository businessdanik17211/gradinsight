// University to city mapping for Belarus
// Each university is located in a specific city

export interface UniversityInfo {
  name: string;
  shortName: string;
  city: string;
  specializations: string[];
}

export const UNIVERSITY_LOCATIONS: Record<string, UniversityInfo> = {
  'БГУ': {
    name: 'Белорусский государственный университет',
    shortName: 'БГУ',
    city: 'Минск',
    specializations: ['ИТ', 'Экономика', 'Юриспруденция']
  },
  'БГУИР': {
    name: 'Белорусский государственный университет информатики и радиоэлектроники',
    shortName: 'БГУИР',
    city: 'Минск',
    specializations: ['ИТ', 'Инженерия']
  },
  'БНТУ': {
    name: 'Белорусский национальный технический университет',
    shortName: 'БНТУ',
    city: 'Минск',
    specializations: ['Инженерия', 'ИТ']
  },
  'БГМУ': {
    name: 'Белорусский государственный медицинский университет',
    shortName: 'БГМУ',
    city: 'Минск',
    specializations: ['Медицина']
  },
  'БГЭУ': {
    name: 'Белорусский государственный экономический университет',
    shortName: 'БГЭУ',
    city: 'Минск',
    specializations: ['Экономика', 'Юриспруденция']
  },
  'БГПУ': {
    name: 'Белорусский государственный педагогический университет',
    shortName: 'БГПУ',
    city: 'Минск',
    specializations: ['Педагогика']
  },
  'ГрГУ': {
    name: 'Гродненский государственный университет имени Янки Купалы',
    shortName: 'ГрГУ',
    city: 'Гродно',
    specializations: ['Экономика', 'Педагогика', 'Юриспруденция']
  },
  'ВГУ': {
    name: 'Витебский государственный университет имени П.М. Машерова',
    shortName: 'ВГУ',
    city: 'Витебск',
    specializations: ['Педагогика', 'Юриспруденция']
  },
  'ГГТУ': {
    name: 'Гомельский государственный технический университет имени П.О. Сухого',
    shortName: 'ГГТУ',
    city: 'Гомель',
    specializations: ['Инженерия']
  },
  'ПГУ': {
    name: 'Полоцкий государственный университет имени Евфросинии Полоцкой',
    shortName: 'ПГУ',
    city: 'Витебск',
    specializations: ['Инженерия', 'Экономика']
  }
};

export function getCityByUniversity(universityShortName: string): string {
  return UNIVERSITY_LOCATIONS[universityShortName]?.city || 'Минск';
}

export function getUniversityFullName(shortName: string): string {
  return UNIVERSITY_LOCATIONS[shortName]?.name || shortName;
}

export function getUniversitySpecializations(shortName: string): string[] {
  return UNIVERSITY_LOCATIONS[shortName]?.specializations || [];
}
