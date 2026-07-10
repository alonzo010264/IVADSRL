const https = require('https');

module.exports = async function handler(req, res) {
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

  const resendApiKey = process.env.RESEND_API_KEY || "re_ENozXFAk_4NkvyYsRjcRHE3CCRFQtJjma";
  
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

  // Permanent public Supabase URL for guaranteed loading in email clients
  const logoUrl = "https://rbtdahmhaksdvupsmkma.supabase.co/storage/v1/object/public/product-images/logo_transparent.png";

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
    // 1. Send receipt email to client using native https
    const clientPostData = JSON.stringify({
      from: 'Facturación IVAD <facturacion@ivadsrl.com>',
      to: [client_email],
      subject: `Recibo de Compra #${orderId} - IVAD Home & Goods`,
      html: htmlContent
    });

    const clientOptions = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Length': Buffer.byteLength(clientPostData)
      }
    };

    const clientData = await new Promise((resolve, reject) => {
      const clientReq = https.request(clientOptions, (clientRes) => {
        let responseBody = '';
        clientRes.on('data', chunk => responseBody += chunk);
        clientRes.on('end', () => {
          try {
            const parsedData = responseBody ? JSON.parse(responseBody) : {};
            if (clientRes.statusCode >= 200 && clientRes.statusCode < 300) {
              resolve(parsedData);
            } else {
              reject(new Error(`Resend receipt error status ${clientRes.statusCode}: ${JSON.stringify(parsedData)}`));
            }
          } catch (e) {
            reject(new Error(`JSON Parse Error: ${e.message}. Body: ${responseBody}`));
          }
        });
      });
      clientReq.on('error', e => reject(e));
      clientReq.write(clientPostData);
      clientReq.end();
    });

    // 2. Send notification email to Admin (anotasy@gmail.com) using native https
    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nueva Orden Recibida - IVAD</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <div style="background-color: #22252a; padding: 25px; text-align: center; border-bottom: 3px solid #bfa687;">
            <img src="${logoUrl}" alt="IVAD Home & Goods" style="height: 90px; width: auto; display: block; margin: 0 auto 10px;">
            <span style="color: #bfa687; font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; display: block;">Calidad y Diseño en cada Detalle</span>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #22252a; border-bottom: 2px solid #bfa687; padding-bottom: 10px; margin-top: 0; font-size: 1.4rem;">🚨 Nueva Orden Recibida</h2>
            <p style="color: #4a5568; line-height: 1.5;">Se ha registrado una nueva orden exitosamente en la tienda en línea de IVAD.</p>
          
          <h3 style="color: #2d3748; font-size: 1.1rem; margin-top: 20px; margin-bottom: 10px;">Detalles de la Transacción</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem; margin-bottom: 25px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #718096; border-bottom: 1px solid #e2e8f0;">No. Pedido:</td>
              <td style="padding: 8px 12px; color: #2d3748; font-weight: bold; border-bottom: 1px solid #e2e8f0;">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #718096; border-bottom: 1px solid #e2e8f0;">Cliente:</td>
              <td style="padding: 8px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${client_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #718096; border-bottom: 1px solid #e2e8f0;">Correo Electrónico:</td>
              <td style="padding: 8px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${client_email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #718096; border-bottom: 1px solid #e2e8f0;">Teléfono:</td>
              <td style="padding: 8px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${client_phone || 'No especificado'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #718096; border-bottom: 1px solid #e2e8f0;">Fecha:</td>
              <td style="padding: 8px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${dateStr}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #718096; border-bottom: 1px solid #e2e8f0;">Método de Pago:</td>
              <td style="padding: 8px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${card_info || 'Tarjeta bancaria'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #718096;">Total Cobrado:</td>
              <td style="padding: 8px 12px; color: #2e7d32; font-weight: bold; font-size: 1.05rem;">RD$ ${total.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </table>

          <h3 style="color: #2d3748; font-size: 1.1rem; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin-bottom: 15px;">Productos Adquiridos</h3>
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

          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #edf2f7; text-align: center; font-size: 0.8rem; color: #a0aec0;">
            <p>IVAD Home & Goods - Panel Administrativo</p>
          </div>
        </div>
      </div>
    </body>
      </html>
    `;

    const adminPostData = JSON.stringify({
      from: 'Notificaciones IVAD <facturacion@ivadsrl.com>',
      to: ['anotasy@gmail.com'],
      subject: `🚨 Nueva Orden Recibida #${orderId} - ${client_name}`,
      html: adminHtmlContent
    });

    const adminOptions = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Length': Buffer.byteLength(adminPostData)
      }
    };

    const adminData = await new Promise((resolve, reject) => {
      const adminReq = https.request(adminOptions, (adminRes) => {
        let responseBody = '';
        adminRes.on('data', chunk => responseBody += chunk);
        adminRes.on('end', () => {
          try {
            const parsedData = responseBody ? JSON.parse(responseBody) : {};
            if (adminRes.statusCode >= 200 && adminRes.statusCode < 300) {
              resolve(parsedData);
            } else {
              reject(new Error(`Resend admin notification error status ${adminRes.statusCode}: ${JSON.stringify(parsedData)}`));
            }
          } catch (e) {
            reject(new Error(`JSON Parse Error: ${e.message}. Body: ${responseBody}`));
          }
        });
      });
      adminReq.on('error', e => reject(e));
      adminReq.write(adminPostData);
      adminReq.end();
    });

    return res.status(200).json({ success: true, client_receipt: clientData, admin_notification: adminData });
  } catch (error) {
    console.error('Exception sending email:', error);
    return res.status(500).json({ error: error.message });
  }
}
