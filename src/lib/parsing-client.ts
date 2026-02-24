// Real parsing service - NO MOCK DATA
// Scrape.do API with render=true for JavaScript-heavy sites

import { supabase } from '@/integrations/supabase/client';

const SCRAPE_DO_API_KEY = '69883cb8ba78470282a0d719ef68df01a0de9675372';

// Global abort controller for stopping parsing
let currentAbortController: AbortController | null = null;

export function stopParsing(): void {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
    console.log('[PARSE] Parsing stopped by user');
  }
}

export function isParsingRunning(): boolean {
  return currentAbortController !== null;
}

export interface ParsedVacancy {
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

export interface ParsingResult {
  success: boolean;
  data?: {
    session_id: number;
    category: string;
    total_pages_parsed: number;
    total_found: number;
    new_vacancies: number;
    duplicates_skipped: number;
    vacancies: ParsedVacancy[];
  };
  error?: string;
  message?: string;
}

// Parse vacancies from rendered HTML
function parseVacanciesFromHtml(html: string, category: string): ParsedVacancy[] {
  const vacancies: ParsedVacancy[] = [];
  const seenUrls = new Set<string>();
  
  console.log(`[PARSER] HTML length: ${html.length}`);
  
  // DEBUG: Save HTML structure info
  const hasScript = html.includes('<script');
  const scriptCount = (html.match(/<script/g) || []).length;
  console.log(`[PARSER] Has scripts: ${hasScript}, Count: ${scriptCount}`);
  
  // Find all script IDs
  const scriptIdMatches = html.matchAll(/<script[^>]*id="([^"]*)"/g);
  const scriptIds = [...scriptIdMatches].map(m => m[1]).filter(id => id);
  console.log(`[PARSER] Script IDs: ${scriptIds.slice(0, 10).join(', ')}`);
  
  // Strategy 1: Parse from window.__INITIAL_STATE__
  const stateMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});<\/script>/);
  if (stateMatch) {
    try {
      const state = JSON.parse(stateMatch[1]);
      console.log('[PARSER] Found __INITIAL_STATE__');
      
      // Navigate through the state to find vacancies
      const vsr = state.vacancySearchResult;
      if (vsr) {
        console.log('[PARSER] vacancySearchResult found, searching for items...');
        
        // Try different paths where vacancies might be
        const possiblePaths = [
          vsr.items,
          vsr.vacancies,
          vsr.vacanciesCollection,
          vsr.data?.items,
          vsr.data?.vacancies,
          state.vacancies,
          state.items,
        ];
        
        for (const path of possiblePaths) {
          if (Array.isArray(path) && path.length > 0) {
            console.log(`[PARSER] Found array with ${path.length} items`);
            
            // Check first item structure
            if (path[0]) {
              console.log('[PARSER] First item sample:', JSON.stringify(path[0]).substring(0, 200));
            }
            
            for (const item of path) {
              if (item && (item.name || item.title) && item.id) {
                const url = item.alternateUrl || item.url || `https://rabota.by/vacancy/${item.id}`;
                if (!seenUrls.has(url)) {
                  seenUrls.add(url);
                  vacancies.push({
                    title: item.name || item.title,
                    company: item.employer?.name || item.company || null,
                    city: item.area?.name || item.city || null,
                    salary_min: item.salary?.from || item.salaryFrom || null,
                    salary_max: item.salary?.to || item.salaryTo || null,
                    salary_currency: (item.salary?.currency === 'BYR' ? 'BYN' : item.salary?.currency) || 'BYN',
                    experience_required: item.experience?.name || item.experience || null,
                    employment_type: item.employment?.name || item.employment || null,
                    source_url: url,
                    description: item.snippet?.requirement || item.description || null
                  });
                }
              }
            }
            
            if (vacancies.length > 0) {
              console.log(`[PARSER] Strategy 1: ${vacancies.length} vacancies`);
              break;
            }
          }
        }
      }
    } catch (e) {
      console.log('[PARSER] Failed to parse __INITIAL_STATE__:', e);
    }
  }
  
  // Strategy 2: Parse from rendered HTML elements
  if (vacancies.length === 0) {
    console.log('[PARSER] Trying Strategy 2: HTML parsing');
    
    // Find all vacancy cards by data-qa attribute
    const cardPattern = /<div[^>]*data-qa="vacancy-serp__vacancy"[^>]*>/gi;
    const cardMatches = html.match(cardPattern);
    
    if (cardMatches) {
      console.log(`[PARSER] Found ${cardMatches.length} vacancy cards`);
      
      // Split HTML by cards and parse each
      const parts = html.split(/<div[^>]*data-qa="vacancy-serp__vacancy"[^>]*>/);
      console.log(`[PARSER] Split into ${parts.length} parts`);
      
      // Debug first card - look for patterns
      if (parts.length > 1) {
        const firstCard = parts[1];
        console.log('[PARSER] First card HTML (first 1500 chars):', firstCard.substring(0, 1500));
        
        // Look for different patterns
        console.log('[PARSER] Has h2:', firstCard.includes('<h2'));
        console.log('[PARSER] Has vacancy link:', firstCard.includes('href="https://rabota.by/vacancy/'));
        console.log('[PARSER] Has vacancy-title:', firstCard.includes('vacancy-serp__vacancy-title'));
        console.log('[PARSER] Has id=":', firstCard.includes('id="'));
        
        // Find all links
        const allLinks = firstCard.match(/href="[^"]*vacancy[^"]*"/g);
        if (allLinks) {
          console.log('[PARSER] Vacancy links in first card:', allLinks.slice(0, 3));
        }
        
        // Find text content
        const textSpans = firstCard.match(/>([^<]{10,100})</g);
        if (textSpans) {
          console.log('[PARSER] Text spans:', textSpans.slice(0, 5));
        }
      }
      
      for (let i = 1; i < parts.length && vacancies.length < 50; i++) {
        const cardHtml = parts[i];
        
        // New strategy: Extract vacancy ID from id="number" attribute
        const idMatch = cardHtml.match(/id="(\d{8,})"/);
        const vacancyId = idMatch ? idMatch[1] : null;
        
        // Extract title from h2 span (this works based on logs)
        const titleMatch = cardHtml.match(/<h2[^>]*>.*?<span[^>]*>([^<]+)<\/span>/i);
        
        // Debug first few cards
        if (i <= 3) {
          console.log(`[PARSER] Card ${i}: vacancyId=${vacancyId}, titleMatch=${!!titleMatch}`);
          if (titleMatch) console.log(`[PARSER] Card ${i} title:`, titleMatch[1]);
        }
        
        if (titleMatch && vacancyId) {
          const url = `https://rabota.by/vacancy/${vacancyId}`;
          if (seenUrls.has(url)) continue;
          
          seenUrls.add(url);
          const title = cleanText(titleMatch[1]);
          
          // Extract company using data-qa attribute
          let company = null;
          const companyMatch = cardHtml.match(/data-qa="vacancy-serp__vacancy-employer"[^>]*>([^<]+)</i);
          if (companyMatch) {
            company = cleanText(companyMatch[1]);
          } else {
            // Fallback: look for company link pattern
            const companyLinkMatch = cardHtml.match(/href="[^"]*employer[^"]*"[^>]*>([^<]+)</i);
            if (companyLinkMatch) {
              company = cleanText(companyLinkMatch[1]);
            }
          }
          
          // Extract city using data-qa attribute
          let city = null;
          const cityMatch = cardHtml.match(/data-qa="vacancy-serp__vacancy-address"[^>]*>([^<]+)</i);
          if (cityMatch) {
            city = cleanText(cityMatch[1]);
          }
          
          // Extract salary using data-qa attribute
          let salaryInfo = { min: null as number | null, max: null as number | null, currency: 'BYN' as string };
          const salaryMatch = cardHtml.match(/data-qa="vacancy-serp__vacancy-compensation"[^>]*>([^<]+)</i);
          if (salaryMatch) {
            salaryInfo = parseSalaryText(cleanText(salaryMatch[1]));
          }
          
          // Extract experience
          let experience = null;
          const expMatch = cardHtml.match(/data-qa="vacancy-serp__vacancy-work-experience"[^>]*>([^<]+)</i);
          if (expMatch) {
            experience = cleanText(expMatch[1]);
          }
          
          vacancies.push({
            title: title,
            company: company,
            city: city,
            salary_min: salaryInfo.min,
            salary_max: salaryInfo.max,
            salary_currency: salaryInfo.currency,
            experience_required: experience,
            employment_type: null,
            source_url: url,
            description: null
          });
        }
      }
      
      console.log(`[PARSER] Strategy 2: ${vacancies.length} vacancies`);
    }
  }
  
  // Strategy 3: Extract from JSON embedded in HTML
  if (vacancies.length === 0) {
    console.log('[PARSER] Trying Strategy 3: JSON extraction');
    
    // Find JSON with "id" and "name" fields
    const jsonPattern = /"id"\s*:\s*"(\d+)"\s*,\s*"name"\s*:\s*"([^"]+)"/g;
    let match;
    
    while ((match = jsonPattern.exec(html)) !== null) {
      const id = match[1];
      const name = match[2].replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
      
      const url = `https://rabota.by/vacancy/${id}`;
      if (!seenUrls.has(url) && name.length > 3) {
        seenUrls.add(url);
        vacancies.push({
          title: name,
          company: null,
          city: null,
          salary_min: null,
          salary_max: null,
          salary_currency: 'BYN',
          experience_required: null,
          employment_type: null,
          source_url: url,
          description: null
        });
      }
    }
    
    console.log(`[PARSER] Strategy 3: ${vacancies.length} vacancies`);
  }
  
  return vacancies;
}

function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSalaryText(text: string): { min: number | null; max: number | null; currency: string } {
  if (!text) return { min: null, max: null, currency: 'BYN' };
  
  // Match "от X до Y" pattern
  const rangeMatch = text.match(/от\s*([\d\s]+)\s*до\s*([\d\s]+)/i);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1].replace(/\s/g, '')),
      max: parseInt(rangeMatch[2].replace(/\s/g, '')),
      currency: text.includes('руб') || text.includes('BYN') ? 'BYN' : 'USD'
    };
  }
  
  // Match single number
  const singleMatch = text.match(/([\d\s]+)/);
  if (singleMatch) {
    const value = parseInt(singleMatch[1].replace(/\s/g, ''));
    return {
      min: value,
      max: value,
      currency: 'BYN'
    };
  }
  
  return { min: null, max: null, currency: 'BYN' };
}

// Try to fetch from Scrape.do
async function tryFetchFromScrapeDo(category: string, page: number = 0, abortSignal?: AbortSignal): Promise<{ success: boolean; html?: string; error?: string }> {
  try {
    const keywords: Record<string, string> = {
      'ИТ': 'программист',
      'Медицина': 'врач',
      'Инженерия': 'инженер',
      'Экономика': 'бухгалтер',
      'Педагогика': 'учитель',
      'Юриспруденция': 'юрист',
    };
    
    const searchText = keywords[category] || category;
    const url = `https://rabota.by/search/vacancy?text=${encodeURIComponent(searchText)}&area=1002&page=${page}`;
    const apiUrl = `https://api.scrape.do/?token=${SCRAPE_DO_API_KEY}&url=${encodeURIComponent(url)}&render=true&wait=2000`;
    
    console.log(`[FETCH] Page ${page}: ${apiUrl.replace(SCRAPE_DO_API_KEY, '***')}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    // Link external abort signal if provided
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => controller.abort());
    }
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[FETCH] Scrape.do error:', response.status, errorText.substring(0, 200));
      return { success: false, error: `API error ${response.status}` };
    }
    
    const html = await response.text();
    
    if (html.length < 1000) {
      console.error('[FETCH] Response too short:', html.substring(0, 500));
      return { success: false, error: 'Response too short' };
    }
    
    console.log(`[FETCH] Page ${page}: received ${html.length} bytes`);
    
    return { success: true, html };
  } catch (error) {
    console.error('[FETCH] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

// Check if vacancy is duplicate
async function isDuplicate(vacancy: ParsedVacancy): Promise<boolean> {
  if (vacancy.source_url) {
    const { data } = await supabase
      .from('vacancies')
      .select('id')
      .eq('source_url', vacancy.source_url)
      .limit(1);
    if (data?.length && data.length > 0) return true;
  }
  
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from('vacancies')
    .select('id')
    .eq('title', vacancy.title)
    .eq('company', vacancy.company)
    .eq('city', vacancy.city)
    .gte('parsed_at', sevenDaysAgo)
    .limit(1);
  
  return data?.length ? data.length > 0 : false;
}

// Main parsing function - NO MOCK DATA
export async function parseRabota(category: string): Promise<ParsingResult> {
  // Create new abort controller for this parsing session
  currentAbortController = new AbortController();
  const abortSignal = currentAbortController.signal;
  
  try {
    console.log('[PARSE] Starting parse for category:', category);
    
    // Create parsing session
    const { data: sessionData, error: sessionError } = await supabase
      .from('parsing_sessions' as any)
      .insert({
        source: 'rabota.by',
        category: category,
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (sessionError || !sessionData) {
      console.error('[PARSE] Failed to create session:', sessionError);
      currentAbortController = null;
      return {
        success: false,
        error: 'Failed to create parsing session: ' + (sessionError?.message || 'Unknown error')
      };
    }

    const sessionId = sessionData.id;
    const MAX_PAGES = 50; // Increased to get more vacancies (up to ~2500)
    const PAGE_DELAY = 1500;
    
    let allVacancies: ParsedVacancy[] = [];
    let totalPages = 0;
    
    // Fetch real data with pagination
    let consecutiveFailures = 0;
    const MAX_CONSECUTIVE_FAILURES = 3;
    
    for (let page = 0; page < MAX_PAGES; page++) {
      // Check if parsing was aborted
      if (abortSignal.aborted) {
        console.log('[PARSE] Parsing aborted by user');
        await supabase
          .from('parsing_sessions' as any)
          .update({
            status: 'cancelled',
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId);
        
        currentAbortController = null;
        return {
          success: false,
          error: 'Парсинг остановлен пользователем'
        };
      }
      
      console.log(`[PARSE] Processing page ${page + 1}/${MAX_PAGES}...`);
      
      // Try up to 2 times for each page
      let apiResult = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        if (attempt > 0) {
          console.log(`[PARSE] Retrying page ${page + 1} (attempt ${attempt + 1})...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        apiResult = await tryFetchFromScrapeDo(category, page, abortSignal);
        if (apiResult.success) break;
      }
      
      if (apiResult && apiResult.success && apiResult.html) {
        consecutiveFailures = 0;
        const pageVacancies = parseVacanciesFromHtml(apiResult.html, category);
        
        if (pageVacancies.length === 0) {
          console.log('[PARSE] No vacancies found on this page, stopping');
          break;
        }
        
        // If less than 20 vacancies on page, it's likely the last page
        if (pageVacancies.length < 20 && page > 0) {
          console.log(`[PARSE] Only ${pageVacancies.length} vacancies on page ${page + 1}, likely last page`);
          allVacancies = allVacancies.concat(pageVacancies);
          totalPages = page + 1;
          break;
        }
        
        allVacancies = allVacancies.concat(pageVacancies);
        totalPages = page + 1;
        
        console.log(`[PARSE] Page ${page + 1}: found ${pageVacancies.length} vacancies (total: ${allVacancies.length})`);
        
        // Update session progress
        await supabase
          .from('parsing_sessions' as any)
          .update({
            current_page: page + 1,
            total_found: allVacancies.length
          })
          .eq('id', sessionId);
        
        // Add delay between pages
        if (page < MAX_PAGES - 1) {
          await new Promise(resolve => setTimeout(resolve, PAGE_DELAY));
        }
      } else {
        consecutiveFailures++;
        console.error(`[PARSE] Page ${page} failed after retries:`, apiResult?.error);
        
        // If too many consecutive failures, stop
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          console.log(`[PARSE] Too many consecutive failures (${consecutiveFailures}), stopping`);
          break;
        }
        
        // If we have some data and this page failed, stop
        if (allVacancies.length > 0) {
          console.log('[PARSE] Continuing with existing data after failure');
          break;
        }
        
        // If first page failed completely, return error
        if (page === 0) {
          await supabase
            .from('parsing_sessions' as any)
            .update({
              status: 'failed',
              error_message: apiResult?.error || 'Unknown error',
              completed_at: new Date().toISOString()
            })
            .eq('id', sessionId);
          
          return {
            success: false,
            error: `Failed to fetch data: ${apiResult?.error || 'Unknown error'}`
          };
        }
      }
    }
    
    // NO MOCK FALLBACK
    if (allVacancies.length === 0) {
      console.error('[PARSE] No vacancies found in any page');
      
      await supabase
        .from('parsing_sessions' as any)
        .update({
          status: 'failed',
          error_message: 'No vacancies found in HTML',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);
      
      return {
        success: false,
        error: 'Не удалось найти вакансии. Сайт требует JavaScript-рендеринг.'
      };
    }
    
    console.log(`[PARSE] Found ${allVacancies.length} total vacancies`);
    
    // Check for duplicates
    let newVacancies: ParsedVacancy[] = [];
    let duplicatesCount = 0;
    
    for (const vacancy of allVacancies) {
      const isDup = await isDuplicate(vacancy);
      if (isDup) {
        duplicatesCount++;
      } else {
        newVacancies.push(vacancy);
      }
    }
    
    console.log(`[PARSE] New vacancies: ${newVacancies.length}, Duplicates: ${duplicatesCount}`);
    
    // Save new vacancies
    let savedCount = 0;
    if (newVacancies.length > 0) {
      const BATCH_SIZE = 50;
      
      for (let i = 0; i < newVacancies.length; i += BATCH_SIZE) {
        const batch = newVacancies.slice(i, i + BATCH_SIZE).map(v => ({
          id: `vac_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: v.title,
          company: v.company,
          city: v.city,
          category: category,
          salary_min: v.salary_min,
          salary_max: v.salary_max,
          salary_currency: v.salary_currency,
          experience_required: v.experience_required,
          employment_type: v.employment_type,
          source_url: v.source_url,
          description: v.description,
          parsed_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabase
          .from('vacancies')
          .insert(batch);

        if (insertError) {
          console.error('[PARSE] Insert error:', insertError);
        } else {
          savedCount += batch.length;
          console.log(`[PARSE] Saved batch ${Math.floor(i/BATCH_SIZE) + 1}: ${batch.length} vacancies`);
        }
      }
    }
    
    // Mark session as completed
    await supabase
      .from('parsing_sessions' as any)
      .update({
        status: 'completed',
        total_pages: totalPages,
        total_found: allVacancies.length,
        new_vacancies: savedCount,
        duplicates_skipped: duplicatesCount,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);
    
    console.log(`[PARSE] Completed: ${savedCount} vacancies saved`);
    
    currentAbortController = null;
    return {
      success: true,
      message: `Успешно спарсено ${savedCount} вакансий с ${totalPages} страниц!`,
      data: {
        session_id: sessionId as number,
        category: category,
        total_pages_parsed: totalPages,
        total_found: allVacancies.length,
        new_vacancies: savedCount,
        duplicates_skipped: duplicatesCount,
        vacancies: newVacancies.slice(0, 10)
      }
    };
    
  } catch (error) {
    console.error('[PARSE] Fatal error:', error);
    currentAbortController = null;
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// University parser
export async function parseUniversity(url: string, name?: string): Promise<ParsingResult> {
  return {
    success: false,
    error: 'University parsing not implemented yet'
  };
}

// Export API object for compatibility
export const parsingApi = {
  parseRabota,
  parseUniversity,
  stopParsing,
  isParsingRunning
};
