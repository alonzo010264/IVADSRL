// Configuración de Supabase para IVAD Home & Goods
// Reemplaza TU_SUPABASE_ANON_KEY con la clave publicable de tu proyecto.

const SUPABASE_URL = "https://rbtdahmhaksdvupsmkma.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_GP8roaav6iIHoQfFp7ncBg_slCdxC7S";

var supabaseClient = null;

// Si la librería Supabase está cargada y tenemos URL y clave válidas, inicializamos el cliente.
if (typeof supabase !== "undefined" && SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase inicializado correctamente.");
} else {
    console.warn("Supabase no está configurado o la librería no se ha cargado. Se usará modo de simulación.");
}
