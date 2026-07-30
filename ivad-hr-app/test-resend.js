const apiKey = process.env.RESEND_API_KEY || 're_INSERT_KEY_HERE';
const toEmail = 'anotasy@gmail.com';
const tempPassword = Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 10);

const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credenciales IVAD Connect</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fc; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea; }
      .header { background-color: #1c2c4c; padding: 30px 20px; text-align: center; }
      .logo-text { color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: 4px; margin: 0; }
      .logo-subtext { color: #d4af37; font-size: 12px; letter-spacing: 2px; margin-top: 5px; }
      .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
      .title { font-size: 22px; font-weight: 600; color: #1c2c4c; margin-bottom: 20px; }
      .credentials-box { background-color: #f8f9fc; border-left: 4px solid #d4af37; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
      .credential-row { margin-bottom: 10px; }
      .credential-label { font-weight: 600; color: #555555; display: inline-block; width: 100px; }
      .credential-value { color: #1c2c4c; font-weight: bold; }
      .warning-box { background-color: #fff3f3; border: 1px solid #ffcdd2; border-radius: 8px; padding: 15px 20px; margin-top: 30px; }
      .warning-title { color: #d32f2f; font-weight: bold; font-size: 14px; margin: 0 0 5px 0; }
      .warning-text { color: #555555; font-size: 13px; margin: 0; }
      .footer { background-color: #f8f9fc; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eaeaea; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="logo-text">IVAD</h1>
        <div class="logo-subtext">HOME & GOODS</div>
      </div>
      
      <div class="content">
        <div class="title">Bienvenido/a a IVAD Connect, Alonzo</div>
        
        <p>Tu cuenta ha sido creada exitosamente. A través de este portal podrás gestionar tus solicitudes de permisos, revisar tus comprobantes de pago de nómina, ver el directorio del equipo y acceder a datos empresariales importantes.</p>
        
        <div class="credentials-box">
          <div class="credential-row">
            <span class="credential-label">Correo:</span>
            <span class="credential-value">alonzo@ivadsrl.com</span> <!-- Assuming Alonzo uses a company email, wait, I will just say anotasy@gmail.com -->
          </div>
          <div class="credential-row">
            <span class="credential-label">Contraseña:</span>
            <span class="credential-value">${tempPassword}</span>
          </div>
        </div>
        
        <div class="warning-box">
          <p class="warning-title">⚠️ AVISO DE CONFIDENCIALIDAD ESTRICTA</p>
          <p class="warning-text">Estas credenciales son personales e intransferibles. <strong>Bajo ningún concepto debes compartirlas con nadie.</strong> A través de esta cuenta tendrás acceso a información sensible, datos personales y detalles financieros y de pagos confidenciales.</p>
        </div>
        
        <p style="margin-top: 30px;">Te recomendamos ingresar a la plataforma y actualizar tu foto de perfil desde la sección "Mis Datos Personales" lo antes posible.</p>
        
        <p>Atentamente,<br><strong>Departamento de Recursos Humanos</strong><br>IVAD Home & Goods</p>
      </div>
      
      <div class="footer">
        Este es un correo automático generado por IVAD Connect. Por favor, no respondas a este mensaje.
      </div>
    </div>
  </body>
  </html>
`;

fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    from: 'IVAD Recursos Humanos <gestion@ivadsrl.com>',
    to: [toEmail],
    subject: 'Tus Credenciales de Acceso - IVAD Connect',
    html: htmlContent
  })
}).then(async r => {
  console.log(r.status, await r.json());
  console.log("TEMPORARY PASSWORD FOR ALONZO IS:", tempPassword);
}).catch(console.error);
