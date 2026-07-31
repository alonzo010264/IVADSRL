import React, { useState } from 'react';
import { ChevronLeft, ShieldCheck, FileText, Download, Award, Lock, Scale, Clock, ChevronRight, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Policies = () => {
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState(0);

  const sheets = [
    {
      id: 'etica',
      sheetNumber: 'Hoja 1 de 5',
      code: 'POL-001/2026',
      title: 'Código de Ética, Valores & Conducta Profesional',
      subtitle: 'Principios rectores de la cultura organizacional IVAD Home & Goods.',
      content: [
        {
          article: 'Artículo 1.1 — Valores Fundamentales',
          body: 'Todos los colaboradores de IVAD SRL deben actuar bajo los más altos estándares de honestidad, respeto, compromiso, transparencia e integridad en cada interacción con clientes, proveedores y compañeros de trabajo.'
        },
        {
          article: 'Artículo 1.2 — Ambiente Laboral Inclusivo y de Respeto',
          body: 'Queda estrictamente prohibida cualquier manifestación de discriminación, acoso o conducta irrespetuosa basada en género, raza, religión, nacionalidad o cargo dentro de las instalaciones corporativas y canales digitales.'
        },
        {
          article: 'Artículo 1.3 — Representación de la Marca',
          body: 'Los colaboradores son embajadores de IVAD Home & Goods. Se exige mantener una conducta profesional pulcra tanto dentro como fuera de la empresa al portar la identidad corporativa.'
        }
      ]
    },
    {
      id: 'jornada',
      sheetNumber: 'Hoja 2 de 5',
      code: 'POL-002/2026',
      title: 'Jornada Laboral, Asistencia & Puntualidad',
      subtitle: 'Reglamento de horarios, registro de entradas y descansos oficiales.',
      content: [
        {
          article: 'Artículo 2.1 — Registro de Asistencia',
          body: 'Es obligatorio marcar la asistencia diaria a través del portal IVAD Connect o los sistemas biometricos habilitados al inicio y cierre de cada turno.'
        },
        {
          article: 'Artículo 2.2 — Horarios y Tolerancia',
          body: 'Se establece un margen de tolerancia máximo de 10 minutos al inicio de la jornada. Las llegadas tardías no justificadas acumuladas darán lugar a amonestaciones de acuerdo con el Código de Trabajo.'
        },
        {
          article: 'Artículo 2.3 — Pausas y Tiempo de Almuerzo',
          body: 'Se otorga 1 hora oficial para almuerzo y descansos reglamentarios. La coordinación interna debe garantizar la continuidad operativa de los departamentos.'
        }
      ]
    },
    {
      id: 'permisos',
      sheetNumber: 'Hoja 3 de 5',
      code: 'POL-003/2026',
      title: 'Política de Licencias, Permisos & Vacaciones',
      subtitle: 'Normativa para la solicitud y aprobación de ausencias temporales.',
      content: [
        {
          article: 'Artículo 3.1 — Solicitud Formal de Permisos',
          body: 'Toda solicitud de permiso o ausencia planificada debe ser sometida formalmente a través del portal IVAD Connect con al menos 48 horas de antelación para evaluación de la Administración.'
        },
        {
          article: 'Artículo 3.2 — Licencias Médicas e Incapacidades',
          body: 'En caso de enfermedad, el colaborador debe notificar a Recursos Humanos dentro de las primeras 4 horas de la jornada y adjuntar el certificado médico oficial validado.'
        },
        {
          article: 'Artículo 3.3 — Programación de Vacaciones',
          body: 'El derecho a vacaciones anuales pagadas se otorgará según la antigüedad según la Ley de Trabajo de la República Dominicana, coordinando las fechas en el primer trimestre del año.'
        }
      ]
    },
    {
      id: 'confidencialidad',
      sheetNumber: 'Hoja 4 de 5',
      code: 'POL-004/2026',
      title: 'Confidencialidad, Seguridad & Protección de Datos',
      subtitle: 'Protección de activos de información y secreto profesional.',
      content: [
        {
          article: 'Artículo 4.1 — Protección de Datos del Cliente',
          body: 'Toda la información personal, financiera y de compras de los clientes de IVAD Home & Goods es de carácter estrictamente confidencial. Queda prohibida su divulgación o uso no autorizado.'
        },
        {
          article: 'Artículo 4.2 — Uso Seguro de Cuentas IVAD Connect',
          body: 'Las credenciales de acceso a la plataforma son personales e transferibles. Cada colaborador es responsable de las acciones realizadas desde su usuario.'
        },
        {
          article: 'Artículo 4.3 — Propiedad Intelectual',
          body: 'Todos los desarrollos, manuales, sistemas e inventarios generados en el ejercicio de las funciones pertenecen exclusivamente a IVAD SRL.'
        }
      ]
    },
    {
      id: 'caja',
      sheetNumber: 'Hoja 5 de 5',
      code: 'POL-005/2026',
      title: 'Procedimientos Operativos, Facturación & Caja',
      subtitle: 'Estándares para el manejo de transacciones y devoluciones.',
      content: [
        {
          article: 'Artículo 5.1 — Arqueo e Cuadre de Caja',
          body: 'Los encargados de caja deben realizar el cuadre diario al cierre de operaciones. Cualquier descuadre injustificado deberá ser reportado de inmediato a Finanzas.'
        },
        {
          article: 'Artículo 5.2 — Politica de Devoluciones a Clientes',
          body: 'Las devoluciones o cambios de mercancía se procesarán dentro de los 30 días posteriores a la compra con la presentación de la factura original y el artículo en estado impecable.'
        },
        {
          article: 'Artículo 5.3 — Auditoría de Inventarios',
          body: 'Administración Central realizará auditorías periódicas sorpresa de existencias en almacenes y salas de exhibición.'
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
            <h1 className="text-xl font-bold tracking-tight">Políticas IVAD Connect</h1>
            <p className="text-xs text-[#d4af37] font-medium mt-0.5">Normativas Oficiales Corporativas</p>
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

        {/* HOJA DE DOCUMENTO OFICIAL ESTILO PAPEL CORPORATIVO */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-200 relative overflow-hidden">
          
          {/* Marca de Agua Transparente de Fondo con /sello-ivad.png */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none">
            <img src="/sello-ivad.png" alt="Sello de agua IVAD" className="w-[420px] h-[420px] object-contain" />
          </div>

          {/* Sello Oficial /sello-ivad.png en la esquina superior derecha */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex flex-col items-center">
            <img src="/sello-ivad.png" alt="Sello Oficial IVAD Connect" className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-md" />
            <span className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Documento Oficial</span>
          </div>

          {/* Encabezado del Documento */}
          <div className="border-b-2 border-[#1c2c4c] pb-6 mb-8 pr-28 sm:pr-32">
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="IVAD" className="w-8 h-8 object-contain" />
              <span className="text-xs font-bold text-[#1c2c4c] tracking-widest uppercase">IVAD SRL • Home & Goods</span>
            </div>
            <span className="inline-block bg-[#1c2c4c]/10 text-[#1c2c4c] font-mono text-[11px] font-bold px-2.5 py-1 rounded-md mb-2">
              {currentSheet.code} • {currentSheet.sheetNumber}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#1c2c4c] leading-tight">{currentSheet.title}</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{currentSheet.subtitle}</p>
          </div>

          {/* Artículos de la Hoja */}
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

          {/* Firma Corporativa y Sello al pie de página */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 bg-gray-50/50 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1c2c4c] text-[#d4af37] flex items-center justify-center font-bold text-xs shrink-0">
                HR
              </div>
              <div>
                <p className="text-xs font-bold text-[#1c2c4c]">Dirección de Recursos Humanos</p>
                <p className="text-[10px] text-gray-500">IVAD SRL • República Dominicana</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] text-gray-400 block">Documento Normativo Certificado</span>
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
