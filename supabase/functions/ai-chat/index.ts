// OpenRouter AI Chat Edge Function
// Minimal working version for university admissions assistant

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const MODEL = "google/gemini-flash-1.5"; // Fast and cheap model

// University data context
const UNIVERSITY_CONTEXT = `
Ты - AI-консультант для абитуриентов университетов Беларуси.

ДАННЫЕ УНИВЕРСИТЕТОВ (2024-2025):

Проходные баллы по университетам:
- БГМУ (Минск): 364 балла - медицинские специальности
- БГУИЯ (Минск): 358 баллов - лингвистика, переводы
- Академия управления (Минск): 361 балл - государственное управление
- БГУ (Минск): 349 баллов - широкий выбор специальностей
- БГУИР (Минск): 342 балла - IT, программирование, радиоэлектроника
- БГЭУ (Минск): 340 баллов - экономика, финансы, менеджмент
- БГАА (Минск): 332 балла - авиация
- БГУКИ (Минск): 309 баллов - культура, искусство
- БГУФК (Минск): 301 балл - физкультура, спорт
- БГПУ (Минск): 290 баллов - педагогика
- БНТУ (Минск): 284 балла - инженерия, технические специальности
- БрГУ (Брест): 287 баллов
- ГрГУ (Гродно): 278 баллов
- ГГТУ (Гомель): 272 балла
- ВГУ (Витебск): 267 баллов
- Академия МВД (Минск): 261 балл
- ПГУ (Новополоцк): 245 баллов

ТОП НАПРАВЛЕНИЯ ПО ВОСТРЕБОВАННОСТИ:
1. IT и программирование (94.2% трудоустройства, зарплата от 2500 BYN)
2. Медицина (97.8% трудоустройства, зарплата от 1700 BYN)
3. Инженерия (89.5% трудоустройства, зарплата от 1900 BYN)
4. Экономика и финансы (82.3% трудоустройства, зарплата от 1600 BYN)
5. Педагогика (91.2% трудоустройства, зарплата от 1050 BYN)
6. Юриспруденция (78.6% трудоустройства, зарплата от 1800 BYN)

ОСОБЕННОСТИ:
- В Минске больше всего вакансий и выше зарплаты (в среднем на 25-30%)
- IT-сфера показывает наибольший рост вакансий (+8.5% в год)
- Медицина - стабильная сфера с гарантированным трудоустройством
- Педагогика - дефицит кадров, легко найти работу

ЗАДАЧА:
Помоги абитуриенту выбрать университет и специальность на основе:
1. Его баллов ЦТ (централизованное тестирование)
2. Интересов и склонностей
3. Желаемого города
4. Перспектив трудоустройства

Отвечай кратко, конкретно, с реальными цифрами. Максимум 2-3 варианта университета в ответе.
`;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  message: string;
  history?: Message[];
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenRouter API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body: RequestBody = await req.json();
    const { message, history = [] } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build messages array with context
    const messages: Message[] = [
      { role: "system", content: UNIVERSITY_CONTEXT },
      ...history,
      { role: "user", content: message },
    ];

    console.log("[AI-CHAT] Sending request to OpenRouter");
    console.log("[AI-CHAT] User message:", message);

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://gradpath-analytics.com", // Your domain
        "X-Title": "GradPath Analytics",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[AI-CHAT] OpenRouter error:", errorData);
      return new Response(
        JSON.stringify({ error: "AI service error", details: errorData }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return new Response(
        JSON.stringify({ error: "Empty response from AI" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("[AI-CHAT] Received response from AI");

    return new Response(
      JSON.stringify({
        response: aiResponse,
        model: MODEL,
        usage: data.usage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[AI-CHAT] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
