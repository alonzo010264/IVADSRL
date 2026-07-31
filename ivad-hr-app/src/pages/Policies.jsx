import React, { useState } from 'react';
import { ChevronLeft, ShieldCheck, FileText, Bookmark, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Policies = () => {
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState(0);

  const sheets = [
    {
      id: 'cuentas',
      sheetNumber: 'Hoja 1 de 5',
      code: 'REG-APP-001/2026',
      title: 'Acceso, Autenticación & Seguridad de Cuenta',
      subtitle: 'Términos de uso de usuarios y dispositivos en la plataforma digital.',
      content: [
        {
          article: 'Regla 1.1 — Uso de Credenciales Personales',
          body: 'El acceso a IVAD Connect es estrictamente personal. Cada empleado es responsable del cuidado y confidencialidad de su correo corporativo y contraseña asignada.'
        },
        {
          article: 'Regla 1.2 — Dispositivos de Confianza (Periodo de 30 Días)',
          body: 'Al seleccionar la opción "Confiar en este dispositivo por 30 días", la sesión permanecerá activa y recordará el correo para un inicio rápido. Se recomienda activar esta opción únicamente en dispositivos móviles o equipos de uso personal.'
        },
        {
          article: 'Regla 1.3 — Verificación y Recuperación de Contraseña',
          body: 'El proceso de recuperación mediante código OTP de 6 dígitos enviado por correo electrónico es el medio oficial de validación. Queda prohibido compartir los códigos de verificación con terceros.'
        }
      ]
    },
    {
      id: 'chat',
      sheetNumber: 'Hoja 2 de 5',
      code: 'REG-APP-002/2026',
      title: 'Uso del Chat Interno & Canales de Soporte',
      subtitle: 'Normas de comunicación y atención mediante agentes oficiales.',
      content: [
        {
          article: 'Regla 2.1 — Comunicación Oficial y Profesional',
          body: 'El módulo de Chat Interno / Ayuda está destinado de forma exclusiva a consultas operativas, dudas sobre la plataforma y asistencia corporativa.'
        },
        {
          article: 'Regla 2.2 — Interacción con Agentes de Soporte',
          body: 'Los agentes de soporte asignados atenderán las inquietudes en horario laboral. Toda conversación queda registrada para garantizar la calidad y transparencia del servicio.'
        },
        {
          article: 'Regla 2.3 — Prohibición de Mensajes No Deseados',
          body: 'Queda terminantemente prohibido el envío de contenido ofensivo, publicidad, archivos ejecutables no autorizados o spam a través del chat de la app.'
        }
      ]
    },
    {
      id: 'permisos-digitales',
      sheetNumber: 'Hoja 3 de 5',
      code: 'REG-APP-003/2026',
      title: 'Gestión Digital de Solicitudes & Permisos',
      subtitle: 'Flujo de tramitación, consulta de estatus y comentarios oficiales.',
      content: [
        {
          article: 'Regla 3.1 — Tramitación de Permisos y Licencias',
          body: 'Todas las solicitudes de permiso de ausencia o vacaciones deben enviarse a través del formulario digital del portal. No se procesarán solicitudes verbales no registradas.'
        },
        {
          article: 'Regla 3.2 — Consulta de Estatus Oficiales',
          body: 'Los colaboradores pueden darle seguimiento en tiempo real al estatus de sus solicitudes (Aprobado, Pendiente o Denegado), identificados con los distintivos corporativos oficiales.'
        },
        {
          article: 'Regla 3.3 — Comentarios y Observaciones del Revisor',
          body: 'La Administración Central incluirá comentarios y justificaciones en el detalle de la solicitud. Dichos comentarios son de carácter vinculante e informativo para el usuario.'
        }
      ]
    },
    {
      id: 'incidencias-iniciativas',
      sheetNumber: 'Hoja 4 de 5',
      code: 'REG-APP-004/2026',
      title: 'Reporte de Incidencias & Propuesta de Iniciativas',
      subtitle: 'Mapeo de problemas operativos y envío de sugerencias de mejora.',
      content: [
        {
          article: 'Regla 4.1 — Veracidad en Reportes de Incidencias',
          body: 'Los reportes de daños, averías o problemas operativos sometidos en la app deben corresponder a hechos verídicos y detallados para su pronta atención por los supervisores.'
        },
        {
          article: 'Regla 4.2 — Propuesta de Iniciativas Corporativas',
          body: 'El formulario de Proponer Iniciativas permite a cualquier colaborador aportar ideas para optimizar el servicio o la convivencia en IVAD SRL. Las iniciativas destacadas serán evaluadas por la gerencia.'
        },
        {
          article: 'Regla 4.3 — Notificaciones y Alertas del Sistema',
          body: 'El usuario debe revisar la sección de notificaciones para mantenerse al tanto sobre las respuestas a sus incidencias e iniciativas en trámite.'
        }
      ]
    },
    {
      id: 'comprobantes-pwa',
      sheetNumber: 'Hoja 5 de 5',
      code: 'REG-APP-005/2026',
      title: 'Comprobantes Digitales & Uso Web Responsivo',
      subtitle: 'Emisión de documentos, distintivo de verificación y uso móvil.',
      content: [
        {
          article: 'Regla 5.1 — Descarga de Volantes y Comprobantes',
          body: 'Los volantes de pago de nómina y certificaciones generados en la app cuentan con el Sello Digital Oficial de IVAD SRL. Su contenido no debe ser alterado.'
        },
        {
          article: 'Regla 5.2 — Insignia de Verificación de Perfil',
          body: 'Los perfiles validados por la empresa cuentan con el distintivo o check oficial. La Administración gestiona y aprueba el estatus de verificación de los usuarios registrados.'
        },
        {
          article: 'Regla 5.3 — Acceso Web e Instalación como Acceso Directo',
          body: 'IVAD Connect es una aplicación web 100% responsiva. Se puede instalar como acceso directo en el inicio del teléfono móvil para disfrutar de la experiencia completa con animación de inicio.'
        }
      ]
    }
  ];

  const currentSheet = sheets[activeSheet];

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans text-gray-800">
      
      {/* Header Superior Azul IVAD */}
      <div className="bg-[#1c2c4c] text-white pt-10 pb-16 px-4 rounded-b-[2rem] shadow-lg relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          
          <div className="text-center flex-1 mx-2">
            <h1 className="text-xl font-bold tracking-tight">Reglas de IVAD Connect</h1>
            <p className="text-xs text-[#d4af37] font-medium mt-0.5">Términos & Normativa de Uso de la Aplicación</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Contenedor Principal Documento */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        
        {/* Pestañas de Hojas */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-2">
          {sheets.map((sheet, index) => (
            <button
              key={sheet.id}
              onClick={() => setActiveSheet(index)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all shadow-sm ${
                activeSheet === index 
                  ? 'bg-[#1c2c4c] text-[#d4af37] border-2 border-[#d4af37]' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <FileText size={15} />
              <span>{sheet.sheetNumber}</span>
            </button>
          ))}
        </div>

        {/* HOJA DE REGLAS DE LA APP CON SELLO OFICIAL Y MARCA DE AGUA */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-200 relative overflow-hidden">
          
          {/* Marca de Agua Transparente de Fondo con /sello-ivad.png */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none">
            <img src="/sello-ivad.png" alt="Sello de agua IVAD" className="w-[420px] h-[420px] object-contain" />
          </div>

          {/* Sello Oficial /sello-ivad.png en la esquina superior derecha */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex flex-col items-center">
            <img src="/sello-ivad.png" alt="Sello Oficial IVAD Connect" className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-md" />
            <span className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Reglas Oficiales</span>
          </div>

          {/* Encabezado del Documento */}
          <div className="border-b-2 border-[#1c2c4c] pb-6 mb-8 pr-28 sm:pr-32">
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="IVAD" className="w-8 h-8 object-contain" />
              <span className="text-xs font-bold text-[#1c2c4c] tracking-widest uppercase">IVAD SRL • Portal Digital</span>
            </div>
            <span className="inline-block bg-[#1c2c4c]/10 text-[#1c2c4c] font-mono text-[11px] font-bold px-2.5 py-1 rounded-md mb-2">
              {currentSheet.code} • {currentSheet.sheetNumber}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#1c2c4c] leading-tight">{currentSheet.title}</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{currentSheet.subtitle}</p>
          </div>

          {/* Artículos de las Reglas */}
          <div className="space-y-6 mb-10 relative z-10">
            {currentSheet.content.map((sec, idx) => (
              <div key={idx} className="bg-[#fcfdfe] p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs hover:border-[#d4af37]/40 transition-colors">
                <h3 className="font-bold text-[#1c2c4c] text-sm sm:text-base flex items-center gap-2 mb-2">
                  <Bookmark size={16} className="text-[#d4af37] shrink-0" />
                  {sec.article}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* Pie de página con verificación de autenticidad */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 bg-gray-50/50 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1c2c4c] text-[#d4af37] flex items-center justify-center font-bold text-xs shrink-0">
                APP
              </div>
              <div>
                <p className="text-xs font-bold text-[#1c2c4c]">Reglamento Oficial de la App</p>
                <p className="text-[10px] text-gray-500">IVAD Connect • República Dominicana</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] text-gray-400 block">Normativa de Uso Digital</span>
              <span className="text-xs font-mono font-bold text-[#d4af37]">VERIFICADO EN IVAD CONNECT</span>
            </div>
          </div>

          {/* Navegación entre Hojas */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
            <button
              disabled={activeSheet === 0}
              onClick={() => setActiveSheet(prev => prev - 1)}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-all"
            >
              <ChevronLeft size={16} /> Hoja Anterior
            </button>

            <span className="text-xs font-bold text-[#1c2c4c]">
              {activeSheet + 1} de {sheets.length}
            </span>

            <button
              disabled={activeSheet === sheets.length - 1}
              onClick={() => setActiveSheet(prev => prev + 1)}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-[#1c2c4c] text-[#d4af37] hover:bg-opacity-95 disabled:opacity-40 transition-all"
            >
              Siguiente Hoja <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Policies;
