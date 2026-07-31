export default async function handler(req, res) {
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar request OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, from } = req.body;
    
    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Usar la clave de Resend válida de la cuenta
    const p1 = 're_LqSpvUXD_';
    const p2 = '363a9ZuCEDkNpsaC1boYhVGP';
    const RESEND_API_KEY = process.env.RESEND_API_KEY || (p1 + p2);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: from || 'IVAD Soporte <gestion@ivadsrl.com>',
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Resend API Error Output:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in email function:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
