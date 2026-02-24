import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { universityUrl, universityName } = await req.json();
    
    if (!universityUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'University URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scraping university:', universityUrl);

    // First, map the site to discover relevant pages
    const mapResponse = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: universityUrl,
        search: 'факультет специальность абитуриент поступление',
        limit: 50,
      }),
    });

    const mapData = await mapResponse.json();
    const links = mapData.links || [];

    // Filter for admission-related pages
    const admissionLinks = links.filter((link: string) => 
      link.includes('abiturient') || 
      link.includes('admission') || 
      link.includes('faculty') ||
      link.includes('fakult') ||
      link.includes('specialty') ||
      link.includes('special')
    ).slice(0, 5);

    console.log('Found admission-related links:', admissionLinks.length);

    // Scrape the main page for general info
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: universityUrl,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    const scrapeData = await scrapeResponse.json();
    const mainContent = scrapeData.data?.markdown || scrapeData.markdown || '';

    // Store results
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const parseResult = {
      university: universityName || universityUrl,
      source_url: universityUrl,
      pages_found: links.length,
      admission_pages: admissionLinks,
      main_content: mainContent.substring(0, 3000),
      parsed_at: new Date().toISOString(),
    };

    console.log('University parse complete');

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: parseResult,
        message: `Найдено страниц: ${links.length}, связанных с поступлением: ${admissionLinks.length}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error parsing university:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
