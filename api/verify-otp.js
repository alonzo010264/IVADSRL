const https = require('https');

// Shared OTP store (same serverless function instance as send-otp.js)
if (!global._ivadOtpStore) global._ivadOtpStore = {};
const OTP_STORE = global._ivadOtpStore;

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rbtdahmhaksdvupsmkma.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, email, code, newPassword } = req.body || {};

  if (!email || !code) {
    return res.status(400).json({ error: 'Correo y código son requeridos' });
  }

  const key = email.toLowerCase().trim();
  const stored = OTP_STORE[key];

  // ── Validate OTP ──────────────────────────────────────────
  if (!stored) {
    return res.status(400).json({ error: 'No hay ningún código pendiente para este correo. Solicita uno nuevo.' });
  }
  if (Date.now() > stored.expiresAt) {
    delete OTP_STORE[key];
    return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' });
  }
  if (stored.code !== code.trim()) {
    return res.status(400).json({ error: 'Código incorrecto. Verifica e intenta de nuevo.' });
  }

  // OTP is valid
  if (action === 'verify_only') {
    // Just confirm the OTP is valid, don't delete yet (user needs it for next step)
    return res.status(200).json({ success: true, message: 'Código verificado correctamente' });
  }

  if (action === 'reset_password') {
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    // Use Supabase Admin API to update password by email
    try {
      // Step 1: Find user by email
      const listUsersResp = await supabaseAdminRequest('GET', `/auth/v1/admin/users?email=${encodeURIComponent(key)}`);
      
      if (!listUsersResp.users || listUsersResp.users.length === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna cuenta con ese correo.' });
      }

      const userId = listUsersResp.users[0].id;

      // Step 2: Update password
      await supabaseAdminRequest('PUT', `/auth/v1/admin/users/${userId}`, { password: newPassword });

      // Clear OTP after successful reset
      delete OTP_STORE[key];

      return res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ error: 'Error al actualizar la contraseña: ' + error.message });
    }
  }

  return res.status(400).json({ error: 'Acción no reconocida. Use "verify_only" o "reset_password".' });
};

// Helper: call Supabase Admin API
function supabaseAdminRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: SUPABASE_URL.replace('https://', '').replace('http://', ''),
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    };

    const req = https.request(options, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          if (resp.statusCode >= 200 && resp.statusCode < 300) resolve(parsed);
          else reject(new Error(`Supabase error ${resp.statusCode}: ${data}`));
        } catch (e) {
          reject(new Error(`JSON parse: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}
