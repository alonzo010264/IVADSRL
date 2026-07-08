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
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { client_name, client_email, client_phone, total_amount, items, card_info, id } = req.body;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return res.status(500).json({ error: 'Resend API key is not configured' });
  }

  const orderId = id ? id.substring(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 10).toUpperCase();
  const dateStr = new Date().toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate Subtotal & Tax
  let subtotal = 0;
  items.forEach(item => {
    subtotal += Number(item.price) * Number(item.qty);
  });
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  // Build items rows
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
        <img src="${item.img}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; margin-right: 10px; display: inline-block; vertical-align: middle;">
        <span style="font-weight: 600; color: #2d3748; display: inline-block; vertical-align: middle; max-width: 250px;">${item.title}</span>
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #4a5568; font-weight: 500;">
        ${item.qty}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #2d3748; font-weight: 600;">
        RD$ ${(Number(item.price) * Number(item.qty)).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
    </tr>
  `).join('');

  // Dynamically resolve logo URL from Vercel deployment or default to public repository file
  const host = req.headers.host || 'ivadsrl.com';
  const logoUrl = `https://${host}/logo_transparent.png`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmación de Pedido - IVAD</title>
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
          <h2 style="color: #2d3748; margin-top: 0; margin-bottom: 10px; font-size: 1.5rem; text-align: center;">¡Gracias por tu compra!</h2>
          <p style="color: #718096; font-size: 0.95rem; text-align: center; margin-bottom: 30px; line-height: 1.5;">
            Hola <strong>${client_name}</strong>. Tu pago ha sido verificado con éxito y tu pedido está en camino. Aquí tienes los detalles de tu compra.
          </p>

          <!-- Order Meta Info -->
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 15px 20px; margin-bottom: 25px; border: 1px solid #edf2f7;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
              <tr>
                <td style="padding: 5px 0; color: #718096; font-weight: 500;">No. Pedido:</td>
                <td style="padding: 5px 0; color: #2d3748; font-weight: bold; text-align: right;">#${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #718096; font-weight: 500;">Fecha:</td>
                <td style="padding: 5px 0; color: #2d3748; text-align: right;">${dateStr}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #718096; font-weight: 500;">Método de Pago:</td>
                <td style="padding: 5px 0; color: #2d3748; text-align: right; font-weight: 500;">${card_info || 'Tarjeta bancaria'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #718096; font-weight: 500;">Teléfono:</td>
                <td style="padding: 5px 0; color: #2d3748; text-align: right;">${client_phone || 'N/A'}</td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <h3 style="color: #2d3748; font-size: 1.1rem; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin-bottom: 15px;">Productos</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <thead>
              <tr style="font-size: 0.85rem; color: #718096; text-transform: uppercase;">
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #edf2f7;">Detalle</th>
                <th style="padding: 8px; text-align: center; border-bottom: 2px solid #edf2f7; width: 60px;">Cant.</th>
                <th style="padding: 8px; text-align: right; border-bottom: 2px solid #edf2f7; width: 100px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="width: 100%; margin-left: auto; max-width: 250px; font-size: 0.95rem; line-height: 1.8;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #718096; font-weight: 500;">Subtotal:</td>
                <td style="color: #2d3748; text-align: right; font-weight: 600;">RD$ ${subtotal.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td style="color: #718096; font-weight: 500;">ITBIS (18%):</td>
                <td style="color: #2d3748; text-align: right; font-weight: 600;">RD$ ${tax.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr style="border-top: 2px solid #edf2f7;">
                <td style="color: #2d3748; font-weight: bold; font-size: 1.1rem; padding-top: 5px;">Total:</td>
                <td style="color: #2e7d32; text-align: right; font-weight: bold; font-size: 1.1rem; padding-top: 5px;">RD$ ${total.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #22252a; padding: 25px; text-align: center; color: #a0aec0; font-size: 0.8rem; border-top: 1px solid #2d3748;">
          <p style="margin: 0 0 8px 0; color: #ffffff; font-weight: 600;">IVAD Home & Goods</p>
          <p style="margin: 0 0 15px 0;">Calidad y Diseño en cada Detalle</p>
          <p style="margin: 0; font-size: 0.75rem; color: #718096;">Este es un recibo automático por su compra. Si tiene alguna pregunta, contáctenos en facturacion@ivadsrl.com.</p>
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
        from: 'Facturación IVAD <facturacion@ivadsrl.com>',
        to: [client_email],
        subject: `Recibo de Compra #${orderId} - IVAD Home & Goods`,
        html: htmlContent
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Error from Resend:', data);
      return res.status(response.status).json({ error: data });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Exception sending email:', error);
    return res.status(500).json({ error: error.message });
  }
}
