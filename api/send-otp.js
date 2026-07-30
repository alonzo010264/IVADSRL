const https = require('https');

// In-memory OTP store (resets on cold start — fine for Vercel serverless)
// Key: email (lowercase), Value: { code, expiresAt }
if (!global._ivadOtpStore) global._ivadOtpStore = {};
const OTP_STORE = global._ivadOtpStore;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY environment variable is not set!');
}
const LOGO_URL = 'https://rbtdahmhaksdvupsmkma.supabase.co/storage/v1/object/public/product-images/logo_transparent.png';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendResendEmail(payload) {
  const postData = JSON.stringify(payload);
  const options = {
    hostname: 'api.resend.com',
    path: '/emails',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
          else reject(new Error(`Resend error ${res.statusCode}: ${body}`));
        } catch (e) {
          reject(new Error(`JSON parse error: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Correo inválido' });
  }

  const key = email.toLowerCase().trim();
  const code = generateOTP();
  OTP_STORE[key] = { code, expiresAt: Date.now() + OTP_TTL_MS };

  // Build HTML email
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
    <body style="font-family:'Segoe UI',Arial,sans-serif;background:#f7fafc;margin:0;padding:20px;">
      <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);border:1px solid #e2e8f0;">
        <!-- Header -->
        <div style="background:#22252a;padding:28px 30px;text-align:center;border-bottom:3px solid #bfa687;">
          <img src="${LOGO_URL}" alt="IVAD" style="height:80px;width:auto;display:block;margin:0 auto 10px;">
          <span style="color:#bfa687;font-size:0.8rem;letter-spacing:2.5px;text-transform:uppercase;font-weight:600;">Seguridad de Cuenta</span>
        </div>

        <!-- Body -->
        <div style="padding:36px 32px;text-align:center;">
          <div style="width:64px;height:64px;background:linear-gradient(135deg,#bfa687,#a8906f);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:1.8rem;">🔐</span>
          </div>
          <h2 style="color:#22252a;margin:0 0 8px;font-size:1.4rem;font-weight:700;">Tu código de verificación</h2>
          <p style="color:#718096;font-size:0.95rem;line-height:1.6;margin:0 0 28px;">
            Recibimos una solicitud para acceder a tu cuenta IVAD.<br>Usa este código para continuar:
          </p>

          <!-- OTP Box -->
          <div style="background:linear-gradient(135deg,#f8f4f0,#fdf9f6);border:2px solid #bfa687;border-radius:12px;padding:24px 20px;margin:0 auto 28px;display:inline-block;min-width:220px;">
            <div style="font-size:2.4rem;font-weight:800;letter-spacing:12px;color:#313f4a;font-family:'Courier New',monospace;">${code}</div>
            <div style="font-size:0.75rem;color:#a0aec0;margin-top:8px;letter-spacing:0.5px;">Válido por 10 minutos</div>
          </div>

          <div style="background:#fff8f3;border:1px solid #fde8d4;border-radius:8px;padding:12px 16px;margin-bottom:24px;font-size:0.82rem;color:#c05621;">
            ⚠️ Si no solicitaste este código, ignora este correo. Tu cuenta sigue segura.
          </div>

          <p style="color:#a0aec0;font-size:0.78rem;margin:0;">
            Por razones de seguridad, este código expira en <strong>10 minutos</strong>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#22252a;padding:20px;text-align:center;color:#718096;font-size:0.78rem;">
          <p style="margin:0 0 4px;color:#fff;font-weight:600;">IVAD Home &amp; Goods</p>
          <p style="margin:0;">Calidad y Diseño en cada Detalle · Est. 1996</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendResendEmail({
      from: 'IVAD Seguridad <facturacion@ivadsrl.com>',
      to: [key],
      subject: `${code} — Tu código de verificación IVAD`,
      html: htmlContent
    });

    return res.status(200).json({ success: true, message: 'Código enviado correctamente' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ error: 'Error al enviar el correo. Intenta de nuevo.' });
  }
};
