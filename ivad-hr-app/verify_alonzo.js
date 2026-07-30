import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wvkmbqnzukwuicnnrxww.supabase.co';
const supabaseKey = 'sb_publishable_pwmnyELEaGhi9V9N6TIhYQ_iMK-hIqT';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAlonzo() {
  const { data, error } = await supabase
    .from('employees')
    .update({ verification_status: 'verified' })
    .eq('email', 'anotasy@gmail.com')
    .select();

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success! Updated employee:", data);
  }
}

verifyAlonzo();
