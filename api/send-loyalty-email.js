// Vercel Serverless Function to send Loyalty Credentials using Resend API
// Endpoint: /api/send-loyalty-email

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

  const { client_name, client_email, card_code, temp_password } = req.body;

  if (!client_name || !client_email || !card_code || !temp_password) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const resendApiKey = process.env.RESEND_API_KEY || "re_ENozXFAk_4NkvyYsRjcRHE3CCRFQtJjma";

  const host = req.headers.host || 'ivadsrl.com';
  const loginUrl = `https://${host}/fidelizacion/index.html`;
  const logoUrl = "https://rbtdahmhaksdvupsmkma.supabase.co/storage/v1/object/public/product-images/logo_transparent.png";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tu Tarjeta de Fidelización IVAD</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7fafc; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <!-- Header -->
        <div style="background-color: #22252a; padding: 25px; text-align: center; border-bottom: 3px solid #bfa687;">
          <img src="${logoUrl}" alt="IVAD Home & Goods" style="height: 90px; width: auto; display: block; margin: 0 auto 10px;">
          <span style="color: #bfa687; font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; display: block;">Calidad y Diseño en cada Detalle</span>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="color: #2d3748; margin-top: 0; margin-bottom: 10px; font-size: 1.5rem; text-align: center;">¡Bienvenido al Club de Fidelización!</h2>
          <p style="color: #4a5568; font-size: 0.95rem; text-align: center; margin-bottom: 25px; line-height: 1.5;">
            Hola <strong>${client_name}</strong>. Hemos creado tu Tarjeta de Fidelización Digital en **IVAD Home & Goods**. Ya puedes comenzar a acumular puntos en tus compras para canjearlos por increíbles premios.
          </p>

          <!-- Credentials Box -->
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #edf2f7;">
            <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 15px; font-size: 1.05rem; text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Tus Credenciales de Acceso</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #718096; width: 45%;">Código de Tarjeta:</td>
                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-family: monospace; font-size: 1.05rem;">${card_code}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #718096;">Usuario (Email):</td>
                <td style="padding: 6px 0; color: #2d3748;">${client_email}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #718096;">Clave Temporal:</td>
                <td style="padding: 6px 0; color: #2e7d32; font-weight: bold; font-family: monospace; font-size: 1.05rem;">${temp_password}</td>
              </tr>
            </table>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${loginUrl}" style="background-color: #bfa687; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 0.95rem; display: inline-block; box-shadow: 0 4px 6px rgba(191, 166, 135, 0.2); transition: background-color 0.2s;">
              Acceder a mi Tarjeta Digital
            </a>
          </div>

          <!-- Instructions -->
          <h4 style="color: #2d3748; margin-top: 0; margin-bottom: 10px; font-size: 1rem; border-bottom: 1px solid #edf2f7; padding-bottom: 6px;">¿Cómo funciona?</h4>
          <ul style="color: #718096; font-size: 0.88rem; padding-left: 20px; line-height: 1.6; margin-top: 0;">
            <li style="margin-bottom: 6px;"><strong>Identifícate</strong>: Cuando realices una compra en IVAD, indícale al cajero tu **Código de Tarjeta** o muéstrale el QR de tu panel.</li>
            <li style="margin-bottom: 6px;"><strong>Acumula Puntos</strong>: El equipo te registrará la venta y sumarás puntos directamente.</li>
            <li style="margin-bottom: 6px;"><strong>Gana Premios</strong>: Al completar tus 10 puntos, podrás canjearlos de inmediato por tu recompensa.</li>
          </ul>
        </div>

        <!-- Footer -->
        <div style="background-color: #22252a; padding: 25px; text-align: center; color: #a0aec0; font-size: 0.8rem; border-top: 1px solid #2d3748;">
          <p style="margin: 0 0 8px 0; color: #ffffff; font-weight: 600;">IVAD Home & Goods</p>
          <p style="margin: 0 0 15px 0;">Calidad y Diseño en cada Detalle</p>
          <p style="margin: 0; font-size: 0.75rem; color: #718096;">Este es un correo automatizado. Por favor no respondas a este mensaje.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Fidelización IVAD <facturacion@ivadsrl.com>',
        to: [client_email],
        subject: `💳 Tu Tarjeta de Fidelización Digital IVAD - ${card_code}`,
        html: htmlContent
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Error from Resend (Loyalty Credentials):', data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Exception sending loyalty credentials email:', error);
    return res.status(500).json({ error: error.message });
  }
}
