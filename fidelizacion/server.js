const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuración de claves
const SUPABASE_URL = "https://rbtdahmhaksdvupsmkma.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_GP8roaav6iIHoQfFp7ncBg_slCdxC7S";
const RESEND_API_KEY = "re_jJBSfuUS_5yvgas3PvWx23ALeFtDWXKiv";

const PORT = 3000;

// Inicializar cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const server = http.createServer(async (req, res) => {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 1. Manejo del endpoint de envío de correos
  if (req.method === 'POST' && req.url === '/api/send-loyalty-email') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { client_name, client_email, card_code, temp_password, card_id } = JSON.parse(body);

        if (!client_name || !client_email || !card_code || !temp_password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Faltan parámetros requeridos' }));
          return;
        }

        // HTML del correo
        // Determinar dinámicamente la URL de acceso basándose en el host del request
        const host = req.headers.host || `localhost:${PORT}`;
        const protocol = req.headers['x-forwarded-proto'] || (host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('192.168.') ? 'http' : 'https');
        const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('192.168.');
        const logoUrl = "https://rbtdahmhaksdvupsmkma.supabase.co/storage/v1/object/public/product-images/logo_transparent.png";
        const loginUrl = isLocal 
          ? `${protocol}://${host}/index.html` 
          : `${protocol}://${host}/fidelizacion/index.html`;

        const htmlContent = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tu Tarjeta de Fidelización IVAD</title>
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
                        <p style="margin:0;color:#bfa687;font-size:0.78rem;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Club de Fidelización</p>
                      </td>
                    </tr>
                    <!-- WELCOME BANNER -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#0a1628 0%,#0d1f3c 100%);padding:28px 32px;text-align:center;">
                        <p style="margin:0 0 6px;color:rgba(255,255,255,0.5);font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;">Bienvenido al</p>
                        <h1 style="margin:0;color:#ffffff;font-size:1.6rem;font-weight:800;letter-spacing:1px;">Club IVAD</h1>
                        <p style="margin:10px 0 0;color:rgba(191,166,135,0.9);font-size:0.88rem;">Tu tarjeta de fidelización digital está lista</p>
                      </td>
                    </tr>
                    <!-- GREETING -->
                    <tr>
                      <td style="padding:32px 32px 20px;">
                        <p style="margin:0 0 16px;color:#374151;font-size:1rem;line-height:1.6;">
                          Hola <strong style="color:#0c151e;">${client_name}</strong>,
                        </p>
                        <p style="margin:0;color:#6b7280;font-size:0.9rem;line-height:1.7;">
                          Nos complace informarte que tu Tarjeta de Fidelización Digital en <strong style="color:#0c151e;">IVAD Home &amp; Goods</strong> ha sido creada exitosamente. A continuación encontrarás tus credenciales para acceder a tu panel personalizado.
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
                                    <p style="margin:0 0 3px;color:#9ca3af;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Código de Tarjeta</p>
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
                      </td>
                    </tr>
                    <!-- FOOTER -->
                    <tr>
                      <td style="background-color:#0c151e;padding:24px 32px;text-align:center;border-top:3px solid #bfa687;">
                        <p style="margin:0 0 4px;color:#ffffff;font-size:0.85rem;font-weight:700;letter-spacing:1px;">IVAD Home &amp; Goods</p>
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

        // 1. Inserción en Supabase
        let supabaseErrorOccurred = false;
        try {
          const { error } = await supabase
            .from('loyalty_credentials')
            .upsert({
              card_id: card_id || null,
              client_email: client_email,
              temp_password: temp_password,
              email_sent: false
            }, { onConflict: 'client_email' });

          if (error) {
            console.error('Error al guardar credenciales en Supabase:', error.message);
            supabaseErrorOccurred = true;
          }
        } catch (err) {
          console.error('Excepción al conectar con Supabase:', err.message);
          supabaseErrorOccurred = true;
        }

        // 2. Envío con Resend (usando fetch nativo o de node)
        try {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
              from: 'Fidelizacion IVAD <fidelizacion@ivadsrl.com>',
              to: [client_email],
              subject: `Tu Tarjeta de Fidelizacion Digital IVAD - ${card_code}`,
              html: htmlContent
            })
          });

          const resendData = await resendResponse.json();

          if (resendResponse.ok) {
            console.log(`Correo enviado con éxito a ${client_email}`);
            // Actualizar estado en Supabase
            if (!supabaseErrorOccurred) {
              await supabase
                .from('loyalty_credentials')
                .update({ email_sent: true, email_sent_at: new Date().toISOString() })
                .eq('client_email', client_email);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: resendData }));
          } else {
            console.error('Error retornado por Resend:', resendData);
            res.writeHead(resendResponse.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: resendData }));
          }
        } catch (resendErr) {
          console.error('Excepción al enviar con Resend:', resendErr.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: resendErr.message }));
        }

      } catch (jsonErr) {
        console.error('Error parsing JSON:', jsonErr.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'JSON inválido' }));
      }
    });
    return;
  }

  // 2. Servir archivos estáticos del panel de fidelización
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // Si no existe en la carpeta fidelizacion, intentar en la carpeta raíz (padre)
  if (!fs.existsSync(filePath)) {
    const parentPath = path.join(__dirname, '..', req.url);
    if (fs.existsSync(parentPath) && fs.statSync(parentPath).isFile()) {
      filePath = parentPath;
    }
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor de Fidelización Corriendo Localmente!`);
  console.log(`👉 Panel de administración: http://localhost:${PORT}/admin.html`);
  console.log(`👉 Vista de clientes: http://localhost:${PORT}/index.html`);
  console.log(`======================================================\n`);
});
