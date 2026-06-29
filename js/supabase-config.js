// Configuración de Supabase para IVAD Home & Goods
// Reemplaza TU_SUPABASE_ANON_KEY con la clave publicable de tu imagen.

const SUPABASE_URL = "https://rbtdahmhaksdvupsmkma.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_GP8roaav6iIHoQfFp7ncBg_slCdxC7S";

let supabaseClient = null;

// Intentar inicializar el cliente si se ha proporcionado la clave publicable
if (typeof supabase !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY !== "TU_SUPABASE_ANON_KEY") {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase inicializado correctamente.");
} else {
    console.log("Supabase no configurado. Usando modo de simulación local (localStorage).");
}
