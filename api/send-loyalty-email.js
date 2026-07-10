// Vercel Serverless Function to send Loyalty Credentials using Resend API
// AND save credentials to Supabase loyalty_credentials table
// Endpoint: /api/send-loyalty-email

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = process.env.SUPABASE_URL  || "https://rbtdahmhaksdvupsmkma.supabase.co";
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable_GP8roaav6iIHoQfFp7ncBg_slCdxC7S";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { client_name, client_email, card_code, temp_password, card_id } = req.body;

  if (!client_name || !client_email || !card_code || !temp_password) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const resendApiKey = process.env.RESEND_API_KEY || "re_jJBSfuUS_5yvgas3PvWx23ALeFtDWXKiv";


  const host = req.headers.host || 'ivadsrl.com';
  const loginUrl = `https://${host}/fidelizacion/index.html`;
  const logoUrl = "https://rbtdahmhaksdvupsmkma.supabase.co/storage/v1/object/public/product-images/logo_transparent.png";

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tu Tarjeta de Fidelizacion IVAD</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Arial,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:30px 10px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">

              <!-- HEADER -->
              <tr>
                <td style="background-color:#0c151e;padding:32px 24px 24px;text-align:center;border-bottom:3px solid #bfa687;">
                  <img src="${logoUrl}" alt="IVAD Home y Goods" style="height:80px;width:auto;display:block;margin:0 auto 14px;" />
                  <p style="margin:0;color:#bfa687;font-size:0.78rem;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Club de Fidelizacion</p>
                </td>
              </tr>

              <!-- WELCOME BANNER -->
              <tr>
                <td style="background:linear-gradient(135deg,#0a1628 0%,#0d1f3c 100%);padding:28px 32px;text-align:center;">
                  <p style="margin:0 0 6px;color:rgba(255,255,255,0.5);font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;">Bienvenido al</p>
                  <h1 style="margin:0;color:#ffffff;font-size:1.6rem;font-weight:800;letter-spacing:1px;">Club IVAD</h1>
                  <p style="margin:10px 0 0;color:rgba(191,166,135,0.9);font-size:0.88rem;">Tu tarjeta de fidelizacion digital esta lista</p>
                </td>
              </tr>

              <!-- GREETING -->
              <tr>
                <td style="padding:32px 32px 20px;">
                  <p style="margin:0 0 16px;color:#374151;font-size:1rem;line-height:1.6;">
                    Hola <strong style="color:#0c151e;">${client_name}</strong>,
                  </p>
                  <p style="margin:0;color:#6b7280;font-size:0.9rem;line-height:1.7;">
                    Nos complace informarte que tu Tarjeta de Fidelizacion Digital en <strong style="color:#0c151e;">IVAD Home &amp; Goods</strong> ha sido creada exitosamente. A continuacion encontraras tus credenciales para acceder a tu panel personalizado.
                  </p>
                </td>
              </tr>

              <!-- CREDENTIALS CARD -->
              <tr>
                <td style="padding:0 32px 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                    <tr>
                      <td style="background-color:#0c151e;padding:14px 20px;">
                        <p style="margin:0;color:#bfa687;font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Tus Credenciales de Acceso</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                              <p style="margin:0 0 3px;color:#9ca3af;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Codigo de Tarjeta</p>
                              <p style="margin:0;color:#111827;font-size:1.1rem;font-weight:800;font-family:'Courier New',monospace;letter-spacing:2px;">${card_code}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                              <p style="margin:0 0 3px;color:#9ca3af;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Correo de Acceso</p>
                              <p style="margin:0;color:#374151;font-size:0.95rem;font-weight:600;">${client_email}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0 0;">
                              <p style="margin:0 0 3px;color:#9ca3af;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Clave Temporal</p>
                              <p style="margin:0;color:#1d6f42;font-size:1.1rem;font-weight:800;font-family:'Courier New',monospace;letter-spacing:2px;background:#f0fdf4;display:inline-block;padding:4px 12px;border-radius:6px;border:1px solid #86efac;">${temp_password}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA BUTTON -->
              <tr>
                <td style="padding:0 32px 32px;text-align:center;">
                  <a href="${loginUrl}" style="display:inline-block;background-color:#bfa687;color:#ffffff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:700;font-size:0.9rem;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(191,166,135,0.35);">
                    Acceder a mi Tarjeta Digital
                  </a>
                  <p style="margin:14px 0 0;color:#9ca3af;font-size:0.75rem;">O visita: <a href="${loginUrl}" style="color:#bfa687;text-decoration:none;">${loginUrl}</a></p>
                </td>
              </tr>

              <!-- HOW IT WORKS -->
              <tr>
                <td style="padding:0 32px 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;padding-top:24px;">
                    <tr>
                      <td style="padding-top:24px;">
                        <p style="margin:0 0 18px;color:#111827;font-size:0.92rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Como funciona tu tarjeta</p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="vertical-align:top;padding:0 0 14px;">
                              <p style="margin:0 0 3px;color:#0c151e;font-size:0.88rem;font-weight:700;">1. Identificate en caja</p>
                              <p style="margin:0;color:#6b7280;font-size:0.82rem;line-height:1.5;">Indica tu codigo de tarjeta al cajero o muestra el QR desde tu panel digital.</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="vertical-align:top;padding:0 0 14px;">
                              <p style="margin:0 0 3px;color:#0c151e;font-size:0.88rem;font-weight:700;">2. Acumula puntos</p>
                              <p style="margin:0;color:#6b7280;font-size:0.82rem;line-height:1.5;">Con cada compra acumulas puntos directamente en tu tarjeta digital.</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="vertical-align:top;">
                              <p style="margin:0 0 3px;color:#0c151e;font-size:0.88rem;font-weight:700;">3. Canjea tus premios</p>
                              <p style="margin:0;color:#6b7280;font-size:0.82rem;line-height:1.5;">Al completar tus puntos, canjea tu recompensa en cualquiera de nuestras sucursales.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color:#0c151e;padding:24px 32px;text-align:center;border-top:3px solid #bfa687;">
                  <p style="margin:0 0 4px;color:#ffffff;font-size:0.85rem;font-weight:700;letter-spacing:1px;">IVAD Home &amp; Goods</p>
                  <p style="margin:0 0 12px;color:#bfa687;font-size:0.72rem;letter-spacing:1.5px;text-transform:uppercase;">Calidad y Diseno en cada Detalle</p>
                  <p style="margin:0;color:#4b5563;font-size:0.7rem;">Este es un correo automatizado. Por favor no respondas a este mensaje.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

  // ─── Guardar credenciales en Supabase ──────────────────────────────────
  let supabaseResult = null;
  try {
    if (SUPABASE_URL && SUPABASE_KEY) {
      const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

      // Upsert: si el correo ya existe, actualiza la clave
      const { data, error } = await sb
        .from('loyalty_credentials')
        .upsert({
          card_id:      card_id || null,
          client_email: client_email,
          temp_password: temp_password,
          email_sent:   false           // se actualizará a true si Resend responde OK
        }, { onConflict: 'client_email' })
        .select()
        .single();

      if (error) {
        console.error('Supabase upsert error:', error);
      } else {
        supabaseResult = data;
        console.log('Credenciales guardadas en Supabase:', data.id);
      }
    }
  } catch (sbErr) {
    console.error('Supabase connection error:', sbErr);
    // No bloqueamos el envío de correo si Supabase falla
  }

  // ─── Enviar correo con Resend ───────────────────────────────────────────
  try {

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Fidelizacion IVAD <fidelizacion@ivadsrl.com>',
        to: [client_email],
        subject: `Tu Tarjeta de Fidelizacion Digital IVAD - ${card_code}`,
        html: htmlContent
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Error from Resend (Loyalty Credentials):', data);
      return res.status(response.status).json({ error: data });
    }

    // Marcar email como enviado en Supabase
    if (supabaseResult && SUPABASE_KEY) {
      try {
        const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
        await sb
          .from('loyalty_credentials')
          .update({ email_sent: true, email_sent_at: new Date().toISOString() })
          .eq('id', supabaseResult.id);
      } catch (_) {}
    }

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Exception sending loyalty credentials email:', error);
    return res.status(500).json({ error: error.message });
  }
}
