import { useState, useCallback, useEffect } from 'react';
import { ALL_UNIVERSITIES, UNIVERSITY_AVERAGE_MARKS } from '@/data/universityMarks';
import { UNIVERSITIES_FACULTIES_DATA } from '@/data/universityFaculties';

export interface Recommendation {
  university: string;
  faculty: string;
  specialty: string;
  requiredScore: number;
  matchScore: number;
  salaryRange: string;
  employmentRate: string;
  pros: string[];
  cons: string[];
}

export interface ParsedQuery {
  scores: {
    total?: number;
    math?: number;
    physics?: number;
    language?: number;
  };
  interests: string[];
  city: string | null;
  budget: 'free' | 'paid' | null;
  studyForm: 'fulltime' | 'parttime' | null;
  priority: 'salary' | 'prestige' | 'employment' | null;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: Recommendation[];
  parsedQuery?: ParsedQuery;
}

export interface UseAIChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  savedRecommendations: Recommendation[];
  saveRecommendation: (rec: Recommendation) => void;
}

// OpenRouter API (supports many AI models, works from browser)
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = 'google/gemini-2.0-flash-001';

function generateUniversityData(): string {
  const cities: Record<string, string> = {
    'Минск': 'Минск',
    'Гродно': 'Гродно',
    'Витебск': 'Витебск',
    'Гомель': 'Гомель',
    'Брест': 'Брест',
    'Новополоцк': 'Новополоцк'
  };

  let data = 'УНИВЕРСИТЕТЫ БЕЛАРУСИ (2025 год):\n\n';

  for (const [city, cityName] of Object.entries(cities)) {
    const cityUnis = ALL_UNIVERSITIES.filter(u => u.city === city);
    if (cityUnis.length > 0) {
      data += `${cityName}:\n`;
      for (const uni of cityUnis) {
        const avgMark = UNIVERSITY_AVERAGE_MARKS[uni.short_name] || uni.average_mark;
        data += `- ${uni.short_name} (${uni.full_name}) - средний проходной балл: ${avgMark}\n`;
      }
      data += '\n';
    }
  }

  data += 'ФАКУЛЬТЕТЫ И СПЕЦИАЛЬНОСТИ (основные вузы):\n\n';

  for (const [uniName, uniData] of Object.entries(UNIVERSITIES_FACULTIES_DATA)) {
    data += `${uniName}:\n`;
    for (const faculty of uniData.faculties.slice(0, 5)) {
      const facSpecialties = uniData.specialties.filter(s => s.faculty_id === faculty.id).slice(0, 3);
      if (facSpecialties.length > 0) {
        data += `  ${faculty.name} (${faculty.code || ''}):\n`;
        for (const spec of facSpecialties) {
          data += `    - ${spec.name} (код: ${spec.code || 'н/д'})\n`;
        }
      }
    }
    if (uniData.specialties.length > 10) {
      data += `  ... и еще ${uniData.specialties.length - 10} специальностей\n`;
    }
    data += '\n';
  }

  data += `ТОП СПЕЦИАЛЬНОСТЕЙ ПО ВОСТРЕБОВАННОСТИ:
1. IT/Программирование - 94% трудоустройства, 2500-4000 BYN
2. Медицина - 98% трудоустройства, 1700-2500 BYN  
3. Инженерия - 90% трудоустройства, 1900-2800 BYN
4. Педагогика - 91% трудоустройства, 1050-1500 BYN
5. Экономика - 82% трудоустройства, 1600-2200 BYN

ВАЖНО:
- В Минске зарплаты на 25-30% выше чем в регионах
- БГУИР - главный IT-вуз страны, выпускники работают в крупных IT-компаниях
- БГУ - лучший университет Беларуси, 83+ специальности
- Медицина - гарантированное трудоустройство, но долгое обучение
- Педагогика - дефицит кадров, легко найти работу
- При выборе специальности учитывай код специальности (1-XX XX XX)
`;

  return data;
}

const UNIVERSITY_DATA = generateUniversityData();

const SYSTEM_PROMPT = `Ты - эксперт по образованию в Беларуси. Твоя задача - помочь абитуриенту с выбором вуза и специальности.

ВАЖНЕЙШИЕ ПРАВИЛА:
1. Внимательно читай ВСЕ что пишет пользователь - его баллы, предметы, интересы, город
2. Если пользователь указал предметы (например: английский, математика, биология, история) - НИКОГДА не предлагай специальности где нужно сдавать ДРУГИЕ предметы (например: физика, химия)
3. Если недостаточно данных - ОБЯЗАТЕЛЬНО спроси: какие предметы сдает/будет сдавать, сколько баллов, город, бюджет/платно

ПРАВИЛА ОТВЕТА:
1. Отвечай на РУССКОМ языке БЕЗ эмодзи
2. Если вопрос не про поступление - ответь прямо, не предлагай варианты вузов
3. При подборе специальности учитывай ВСЕ что указал пользователь: баллы, предметы, интересы, город
4. Предлагай только те специальности которые соответствуют указанным предметам
5. НЕ предсказывай зарплаты - укажи примерные профессии выпускника

ПРИ ОТВЕТЕ ОБЯЗАТЕЛЬНО:
- Укажи какие предметы нужно сдавать для каждой специальности
- Если пользователь уже указал предметы - проверь соответствие
- Если данных недостаточно - задай уточняющий вопрос

ДАННЫЕ:
${UNIVERSITY_DATA}`;

// Парсинг запроса пользователя
function parseUserQuery(query: string): ParsedQuery {
  const lowerQuery = query.toLowerCase();
  
  // Извлечение баллов
  const scoreMatch = query.match(/(\d{2,3})\s*балл/i);
  const scores: ParsedQuery['scores'] = {};
  if (scoreMatch) {
    scores.total = parseInt(scoreMatch[1]);
  }
  
  // Извлечение интересов
  const interests: string[] = [];
  const interestKeywords: Record<string, string> = {
    'программирование': 'IT',
    'it': 'IT',
    'айти': 'IT',
    'математика': 'математика',
    'физика': 'физика',
    'медицин': 'медицина',
    'врач': 'медицина',
    'экономик': 'экономика',
    'бизнес': 'экономика',
    'инженер': 'инженерия',
    'техник': 'инженерия',
    'педагог': 'педагогика',
    'учител': 'педагогика',
    'юрист': 'юриспруденция',
    'прав': 'юриспруденция',
    'лингвист': 'лингвистика',
    'язык': 'лингвистика',
    'дизайн': 'дизайн',
    'спорт': 'спорт',
    'физкультур': 'спорт',
  };
  
  for (const [keyword, interest] of Object.entries(interestKeywords)) {
    if (lowerQuery.includes(keyword) && !interests.includes(interest)) {
      interests.push(interest);
    }
  }
  
  // Извлечение города
  let city: string | null = null;
  const cities = ['минск', 'гродно', 'витебск', 'гомель', 'брест', 'новополоцк'];
  for (const c of cities) {
    if (lowerQuery.includes(c)) {
      city = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }
  
  // Бюджет
  let budget: 'free' | 'paid' | null = null;
  if (lowerQuery.includes('бюджет') || lowerQuery.includes('бесплатно')) {
    budget = 'free';
  } else if (lowerQuery.includes('платно') || lowerQuery.includes('платный')) {
    budget = 'paid';
  }
  
  // Приоритет
  let priority: ParsedQuery['priority'] = null;
  if (lowerQuery.includes('зарплат') || lowerQuery.includes('деньг')) {
    priority = 'salary';
  } else if (lowerQuery.includes('престиж') || lowerQuery.includes('лучш')) {
    priority = 'prestige';
  } else if (lowerQuery.includes('работ') || lowerQuery.includes('трудоустрой')) {
    priority = 'employment';
  }
  
  return { scores, interests, city, budget, studyForm: null, priority };
}

const STORAGE_KEY = 'gradpath_chat_history';
const RECOMMENDATIONS_KEY = 'gradpath_saved_recommendations';

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRecommendations, setSavedRecommendations] = useState<Recommendation[]>([]);

  // Загрузка истории из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      }
      
      const savedRecs = localStorage.getItem(RECOMMENDATIONS_KEY);
      if (savedRecs) {
        setSavedRecommendations(JSON.parse(savedRecs));
      }
    } catch (e) {
      console.error('Error loading chat history:', e);
    }
  }, []);

  // Сохранение истории в localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const saveRecommendation = useCallback((rec: Recommendation) => {
    setSavedRecommendations(prev => {
      const exists = prev.some(r => 
        r.university === rec.university && r.specialty === rec.specialty
      );
      if (exists) return prev;
      
      const updated = [...prev, rec];
      localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const parsedQuery = parseUserQuery(message);

    const userMessage: Message = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      parsedQuery,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Построение контекста из истории
      const contextMessages = messages.slice(-6).map(m => 
        `${m.role === 'user' ? 'Абитуриент' : 'Консультант'}: ${m.content}`
      ).join('\n');

      const fullPrompt = `${SYSTEM_PROMPT}

КОНТЕКСТ ПРЕДЫДУЩЕГО РАЗГОВОРА:
${contextMessages}

ЗАПРОС: ${message.trim()}`;

      console.log('[AI Chat] Sending to OpenRouter:', message);

      if (!OPENROUTER_API_KEY) {
        throw new Error('API ключ не настроен. Добавьте OPENROUTER_API_KEY в .env');
      }

      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'GradPath Analytics',
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...messages.slice(-6).map(m => ({
                role: m.role,
                content: m.content
              })),
              { role: 'user', content: message.trim() }
            ],
            temperature: 0.7,
            max_tokens: 1024,
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[AI Chat] OpenRouter error:', errorData);
        throw new Error('Ошибка AI сервиса');
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || '';

      if (!aiResponse || aiResponse.length < 10) {
        throw new Error('Пустой или слишком короткий ответ от AI');
      }

      console.log('[AI Chat] Received response');

      const aiMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('[AI Chat] Error:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз или сформулируйте вопрос иначе.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    savedRecommendations,
    saveRecommendation,
  };
}
