import { supabase } from '@/integrations/supabase/client';

export interface ParseResult {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export const parsingApi = {
  async parseRabota(category?: string): Promise<ParseResult> {
    const { data, error } = await supabase.functions.invoke('parse-rabota', {
      body: { category },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  async parseUniversity(universityUrl: string, universityName?: string): Promise<ParseResult> {
    const { data, error } = await supabase.functions.invoke('parse-university', {
      body: { universityUrl, universityName },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },
};
