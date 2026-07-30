import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wvkmbqnzukwuicnnrxww.supabase.co';
const supabaseKey = 'sb_publishable_pwmnyELEaGhi9V9N6TIhYQ_iMK-hIqT';

export const supabase = createClient(supabaseUrl, supabaseKey);
