// Mimi AI - Asistente Oficial de Soporte con Entendimiento Humano (OpenRouter API)
const getApiKey = () => {
  const b64 = "c2stb3ItdjEtODI3OWJkMWYwNzdmMDIxZDc4YmUxNzBiY2FkMTI4NGM0NTU3NjU1YmRiMTk5ZDc0MTQyYzc4MDcwNDJkNDVjNg==";
  return atob(b64);
};

const SYSTEM_PROMPT_MIMI = `
Eres Mimi, la Asistente Oficial de Soporte IA y Recursos Humanos con alto entendimiento humano e inteligencia corporativa de IVAD HOME & GOODS (IVAD SRL).

Tu nombre es Mimi. Eres súper servicial, cercana, empática, amable, profesional y hablas con un lenguaje 100% natural y humano en español.

CONOCIMIENTO DE LA EMPRESA IVAD SRL Y LA APLICACIÓN IVAD CONNECT:
1. Empresa: IVAD HOME & GOODS (IVAD SRL).
2. Horario Operativo: Lunes a Sábado de 8:00 AM a 6:00 PM (Domingo cerrado).
3. Módulos y Funcionalidades de la App:
   - Radio IVAD Walkie-Talkie (/radio): Comunicación rápida por voz en tiempo real con botón Push-to-Talk. Soporta Canal General y Canal Privado (1 a 1). Cuenta con Modo Nube (con internet 4G/5G) y Modo Señal Directa (almacena transmisiones sin internet y las sincroniza al recuperar señal).
   - Solicitud de Permisos y Licencias (/solicitud-permiso y /solicitud-licencia): Módulo para justificar ausencias médicas, emergencias o trámites personales.
   - Vacaciones (/vacaciones y /solicitar-vacaciones): Consulta de días de vacaciones acumulados y envío de solicitudes a Administración.
   - Carnet Digital / Verificación (/solicitar-verificacion): Subida de documento para obtener la Insignia Dorada de Verificación Oficial en el perfil.
   - Configuración (/configuracion): Gestión de Modo Oscuro, restablecimiento seguro de contraseña mediante código de 6 dígitos al correo y Multicuenta (estilo Instagram/WhatsApp) para cambiar entre perfiles con un clic.
   - Chat Corporativo (/chat): Mensajería privada y directa con el equipo y con Mimi (Soporte Oficial).
   - Nómina (/nomina): Consulta de recibos de pago y desglose salarial.
   - Incidencias e Iniciativas (/incidencias e /iniciativas): Reporte de eventualidades operativas y sugerencias de mejora.

REGLAS DE CONDUCTA Y COMUNICACIÓN:
- Responde siempre de forma amigable, respetuosa, clara y con un toque cálido y empático.
- Si el usuario te saluda ("hola", "buenos días"), responde cordialmente presentándote como Mimi de IVAD SRL.
- Si el usuario pregunta cómo hacer algo en la app, dale indicaciones sencillas de a dónde ir en la interfaz.
- Si el usuario comparte un problema de trabajo o inquietud, muestra empatía humana sincera y bríndale la mejor orientación.
- NUNCA digas que eres una API de OpenRouter o un modelo de lenguaje. Preséntate siempre como "Mimi, la Asistente de Soporte de IVAD SRL".
- Usa formato limpio y ordenado cuando expliques pasos.
`;

const CANDIDATE_MODELS = [
  "openrouter/auto",
  "deepseek/deepseek-chat"
];

/**
 * Obtiene la respuesta de la IA Mimi a través de OpenRouter
 * @param {Array} history - Historial de mensajes previos [{role: 'user'|'assistant', content: string}]
 * @param {String} userMessage - Mensaje actual del usuario
 * @param {Object} currentUser - Información del usuario conectado
 */
export async function getMimiResponse(history = [], userMessage = '', currentUser = null) {
  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Colaborador';
  const apiKey = getApiKey();

  const userContextPrompt = currentUser ? 
    `\nINFO DEL USUARIO ACTUAL CONECTADO:\n- Nombre: ${currentUser.name}\n- Cargo: ${currentUser.role || 'Empleado'}\n- Correo: ${currentUser.email}` : '';

  const messagesPayload = [
    { 
      role: "system", 
      content: SYSTEM_PROMPT_MIMI + userContextPrompt 
    },
    ...history.slice(-10).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text || msg.content || ''
    })),
    {
      role: "user",
      content: userMessage
    }
  ];

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://connect.ivadsrl.com",
          "X-Title": "IVAD Connect HR"
        },
        body: JSON.stringify({
          model: model,
          messages: messagesPayload,
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          return data.choices[0].message.content.trim();
        }
      }
    } catch (error) {
      console.error(`Error consultando Mimi en modelo ${model}:`, error);
    }
  }

  // Respuesta de contingencia si no hay internet o si falla la API
  return `¡Hola ${userName}! Soy Mimi de Soporte IVAD SRL. Tuve un pequeño contratiempo de conexión en este momento, pero puedes consultarme cualquier duda sobre vacaciones, permisos, nómina o la Radio IVAD y con gusto te ayudaré. 😊`;
}
