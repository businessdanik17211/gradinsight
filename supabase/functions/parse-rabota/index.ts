import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ParsedVacancy {
  title: string;
  company: string | null;
  city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  experience_required: string | null;
  employment_type: string | null;
  source_url: string | null;
  description: string | null;
}

// User agents for rotation
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

// Sleep function for delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get random user agent
function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Parse salary string
function parseSalary(salaryStr: string): { min: number | null; max: number | null; currency: string } {
  const result = { min: null as number | null, max: null as number | null, currency: 'BYN' };
  
  if (!salaryStr) return result;
  
  if (salaryStr.includes('USD') || salaryStr.includes('$')) {
    result.currency = 'USD';
  } else if (salaryStr.includes('EUR') || salaryStr.includes('€')) {
    result.currency = 'EUR';
  }
  
  const normalized = salaryStr.replace(/\s/g, '').toLowerCase();
  
  const fromMatch = normalized.match(/от(\d+)/);
  if (fromMatch) {
    result.min = parseInt(fromMatch[1]);
  }
  
  const toMatch = normalized.match(/до(\d+)/);
  if (toMatch) {
    result.max = parseInt(toMatch[1]);
  }
  
  const rangeMatch = normalized.match(/(\d+)[–\-\−](\d+)/);
  if (rangeMatch) {
    result.min = parseInt(rangeMatch[1]);
    result.max = parseInt(rangeMatch[2]);
  }
  
  if (!result.min && !result.max) {
    const singleMatch = salaryStr.match(/(\d[\d\s]*\d|\d)/);
    if (singleMatch) {
      const num = parseInt(singleMatch[1].replace(/\s/g, ''));
      result.min = num;
      result.max = num;
    }
  }
  
  return result;
}

// Extract vacancies from markdown
function extractVacanciesFromMarkdown(markdown: string, category: string): ParsedVacancy[] {
  const vacancies: ParsedVacancy[] = [];
  const lines = markdown.split('\n');
  let currentVacancy: Partial<ParsedVacancy> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.length < 5 || line.startsWith('![') || line.includes('cookie') || 
        line.includes('Войти') || line.includes('Создать резюме') ||
        line.includes('Произошла ошибка')) {
      continue;
    }
    
    const vacancyLinkMatch = line.match(/\[([^\]]+)\]\((https?:\/\/rabota\.by\/vacancy\/\d+[^\)]*)\)/);
    if (vacancyLinkMatch) {
      if (currentVacancy && currentVacancy.title) {
        vacancies.push(normalizeVacancy(currentVacancy));
      }
      
      currentVacancy = {
        title: vacancyLinkMatch[1].trim(),
        source_url: vacancyLinkMatch[2],
      };
      continue;
    }
    
    if (!currentVacancy && (line.startsWith('**') || line.match(/^[A-ZА-ЯЁ][^.!?]{10,60}$/))) {
      const titleMatch = line.match(/^\*\*([^*]+)\*\*/) || line.match(/^#+\s*(.+)$/);
      if (titleMatch && !titleMatch[1].includes('Специализации') && 
          !titleMatch[1].includes('вакансии') && !titleMatch[1].includes('Работа')) {
        currentVacancy = {
          title: titleMatch[1].trim(),
        };
        continue;
      }
    }
    
    if (currentVacancy) {
      const salaryPatterns = [
        /(\d{3,}[\d\s]*)\s*(BYN|USD|EUR|руб|бел\.?\s*руб)/i,
        /(от|до)\s*(\d{3,}[\d\s]*)\s*(BYN|USD|EUR)?/i,
      ];
      
      for (const pattern of salaryPatterns) {
        if (pattern.test(line) && !currentVacancy.salary_min) {
          const salary = parseSalary(line);
          if ((salary.min && salary.min >= 100) || (salary.max && salary.max >= 100)) {
            currentVacancy.salary_min = salary.min;
            currentVacancy.salary_max = salary.max;
            currentVacancy.salary_currency = salary.currency;
            break;
          }
        }
      }
      
      const companyMatch = line.match(/\[([^\]]+)\]\(https?:\/\/rabota\.by\/employer\/\d+/);
      if (companyMatch && !currentVacancy.company) {
        currentVacancy.company = companyMatch[1].trim();
      }
      
      const cities = ['Минск', 'Гомель', 'Гродно', 'Брест', 'Витебск', 'Могилёв', 'Могилев'];
      if (!currentVacancy.city) {
        for (const city of cities) {
          if (line.includes(city)) {
            currentVacancy.city = city;
            break;
          }
        }
      }
      
      const expPatterns = [
        /(без опыта)/i,
        /(от \d+ года?)/i,
        /(от \d+ лет)/i,
        /(\d+[-–]\d+ года?)/i,
        /(\d+[-–]\d+ лет)/i,
        /(опыт.*\d+)/i
      ];
      
      if (!currentVacancy.experience_required) {
        for (const pattern of expPatterns) {
          const match = line.match(pattern);
          if (match) {
            currentVacancy.experience_required = match[1];
            break;
          }
        }
      }
      
      if (line.startsWith('---') || line.startsWith('___')) {
        if (currentVacancy.title) {
          vacancies.push(normalizeVacancy(currentVacancy));
        }
        currentVacancy = null;
      }
    }
  }
  
  if (currentVacancy && currentVacancy.title) {
    vacancies.push(normalizeVacancy(currentVacancy));
  }
  
  return vacancies;
}

function normalizeVacancy(v: Partial<ParsedVacancy>): ParsedVacancy {
  return {
    title: v.title || 'Unknown',
    company: v.company || null,
    city: v.city || 'Минск',
    salary_min: v.salary_min || null,
    salary_max: v.salary_max || null,
    salary_currency: v.salary_currency || 'BYN',
    experience_required: v.experience_required || null,
    employment_type: v.employment_type || null,
    source_url: v.source_url || null,
    description: v.description || null,
  };
}

// Check if vacancy is duplicate
async function isDuplicate(
  supabase: any,
  vacancy: ParsedVacancy
): Promise<boolean> {
  // Check by URL if exists
  if (vacancy.source_url) {
    const { data } = await supabase
      .from('vacancies')
      .select('id')
      .eq('source_url', vacancy.source_url)
      .limit(1);
    if (data?.length > 0) return true;
  }
  
  // Check by title + company + city within last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from('vacancies')
    .select('id')
    .eq('title', vacancy.title)
    .eq('company', vacancy.company)
    .eq('city', vacancy.city)
    .gte('parsed_at', sevenDaysAgo)
    .limit(1);
  
  return data?.length > 0;
}

// Update parsing session progress
async function updateProgress(
  supabase: any,
  sessionId: number,
  currentPage: number,
  totalFound: number,
  newVacancies: number,
  duplicatesSkipped: number
): Promise<void> {
  await supabase
    .from('parsing_sessions')
    .update({
      current_page: currentPage,
      total_found: totalFound,
      new_vacancies: newVacancies,
      duplicates_skipped: duplicatesSkipped
    })
    .eq('id', sessionId);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { category, session_id } = await req.json();
    
    // Create parsing session
    const { data: sessionData, error: sessionError } = await supabase
      .from('parsing_sessions')
      .insert({
        source: 'rabota.by',
        category: category || 'Все',
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Failed to create parsing session:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create parsing session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sessionId = session_id || sessionData.id;
    
    const categoryText: Record<string, string> = {
      'ИТ': 'программист',
      'Медицина': 'врач',
      'Инженерия': 'инженер',
      'Экономика': 'бухгалтер',
      'Педагогика': 'учитель',
      'Юриспруденция': 'юрист',
    };

    const searchText = encodeURIComponent(categoryText[category] || 'работа');
    
    // Pagination variables
    const allVacancies: ParsedVacancy[] = [];
    let page = 0; // rabota.by uses 0-based pagination
    let hasMorePages = true;
    const MAX_PAGES = 100;
    let totalNewVacancies = 0;
    let totalDuplicates = 0;
    let consecutiveEmptyPages = 0;
    
    console.log(`Starting parsing for category: ${category}, session: ${sessionId}`);

    while (hasMorePages && page < MAX_PAGES) {
      const url = `https://rabota.by/search/vacancy?text=${searchText}&area=1002&page=${page}`;
      
      console.log(`Parsing page ${page + 1}: ${url}`);
      
      try {
        // Add random delay (2500-3500ms)
        const delay = 3000 + Math.floor(Math.random() * 1000) - 500;
        await sleep(delay);
        
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            formats: ['markdown'],
            onlyMainContent: true,
            headers: {
              'User-Agent': getRandomUserAgent()
            }
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Page ${page + 1} error:`, errorData);
          // Continue to next page on error
          page++;
          continue;
        }

        const data = await response.json();
        const markdown = data.data?.markdown || data.markdown || '';
        
        // Check for "no results" or empty page
        if (markdown.includes('не найдено') || 
            markdown.includes('по вашему запросу ничего не найдено') ||
            markdown.includes('Нет подходящих вакансий') ||
            markdown.length < 500) {
          consecutiveEmptyPages++;
          console.log(`Page ${page + 1} appears empty (consecutive: ${consecutiveEmptyPages})`);
          
          // Stop if 2 consecutive empty pages
          if (consecutiveEmptyPages >= 2) {
            hasMorePages = false;
            break;
          }
          page++;
          continue;
        }
        
        consecutiveEmptyPages = 0;
        
        const vacancies = extractVacanciesFromMarkdown(markdown, category);
        console.log(`Page ${page + 1}: found ${vacancies.length} vacancies`);
        
        if (vacancies.length === 0) {
          consecutiveEmptyPages++;
          if (consecutiveEmptyPages >= 2) {
            hasMorePages = false;
            break;
          }
        } else {
          // Check for duplicates and filter
          const newVacancies: ParsedVacancy[] = [];
          for (const vacancy of vacancies) {
            const isDup = await isDuplicate(supabase, vacancy);
            if (isDup) {
              totalDuplicates++;
            } else {
              newVacancies.push(vacancy);
            }
          }
          
          allVacancies.push(...newVacancies);
          totalNewVacancies += newVacancies.length;
        }
        
        // Update progress every 5 pages
        if (page % 5 === 0 || !hasMorePages) {
          await updateProgress(
            supabase,
            sessionId,
            page + 1,
            allVacancies.length + totalDuplicates,
            totalNewVacancies,
            totalDuplicates
          );
        }
        
        page++;
        
      } catch (pageError) {
        console.error(`Error on page ${page + 1}:`, pageError);
        // Log error but continue
        page++;
        continue;
      }
    }

    // Save all new vacancies in batches
    let savedCount = 0;
    if (allVacancies.length > 0) {
      const BATCH_SIZE = 50;
      
      for (let i = 0; i < allVacancies.length; i += BATCH_SIZE) {
        const batch = allVacancies.slice(i, i + BATCH_SIZE).map(v => ({
          title: v.title,
          company: v.company,
          city: v.city,
          category: category || 'Другое',
          salary_min: v.salary_min,
          salary_max: v.salary_max,
          salary_currency: v.salary_currency,
          experience_required: v.experience_required,
          employment_type: v.employment_type,
          source_url: v.source_url,
          description: v.description,
          parsed_at: new Date().toISOString(),
        }));

        try {
          const { error: insertError } = await supabase
            .from('vacancies')
            .insert(batch);

          if (!insertError) {
            savedCount += batch.length;
          } else {
            console.error('Batch insert error:', insertError);
          }
        } catch (e) {
          console.error('Insert exception:', e);
        }
        
        // Small delay between batches
        await sleep(100);
      }
    }

    // Update session as completed
    await supabase
      .from('parsing_sessions')
      .update({
        status: 'completed',
        total_pages: page,
        current_page: page,
        total_found: allVacancies.length + totalDuplicates,
        new_vacancies: savedCount,
        duplicates_skipped: totalDuplicates,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    const parseResult = {
      category: category || 'Все',
      session_id: sessionId,
      total_pages_parsed: page,
      total_found: allVacancies.length + totalDuplicates,
      new_vacancies: savedCount,
      duplicates_skipped: totalDuplicates,
      vacancies: allVacancies.slice(0, 10),
      parsed_at: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: parseResult,
        message: `Парсинг завершен. Страниц: ${page}, Найдено: ${allVacancies.length + totalDuplicates}, Сохранено: ${savedCount}, Дубликатов: ${totalDuplicates}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error parsing rabota.by:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Try to update session with error if we have session_id
    try {
      const { session_id } = await req.json();
      if (session_id) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('parsing_sessions')
          .update({
            status: 'error',
            error_message: errorMessage,
            completed_at: new Date().toISOString()
          })
          .eq('id', session_id);
      }
    } catch (e) {
      // Ignore error in error handler
    }
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
