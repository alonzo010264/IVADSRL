import React, { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Download, CheckCircle2, ShieldCheck, Search, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const CompanyPolicies = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [readConfirmed, setReadConfirmed] = useState({});

  const companyPoliciesList = [
    {
      id: 1,
      title: 'Código de Ética y Conducta',
      category: 'Normativa General',
      updated: '10 de Enero de 2024',
      articles: [
        { num: 'Art. 1', text: 'Respeto e Integridad: Todo colaborador de IVAD SRL debe mantener una conducta profesional basada en la honestidad, transparencia y respeto mutuo entre compañeros y clientes.' },
        { num: 'Art. 2', text: 'Confidencialidad: Queda estrictamente prohibida la divulgación de información financiera, comercial o de clientes de IVAD Home & Goods a terceros no autorizados.' },
        { num: 'Art. 3', text: 'Uso de Recursos Corporativos: Los equipos, instalaciones y herramientas de trabajo propiedad de la empresa deben ser utilizados únicamente para fines laborales y de negocio.' }
      ]
    },
    {
      id: 2,
      title: 'Reglamento Interno de Trabajo',
      category: 'Operaciones & Horarios',
      updated: '20 de Noviembre de 2023',
      articles: [
        { num: 'Art. 1', text: 'Puntualidad y Asistencia: La jornada laboral inicia puntualmente a la hora establecida en el contrato. Se contempla un margen máximo de 5 minutos de gracia por causa justificada.' },
        { num: 'Art. 2', text: 'Uso del Uniforme Institucional: El personal de atención y almacén debe portar el uniforme oficial completo en óptimas condiciones de higiene y presentación.' },
        { num: 'Art. 3', text: 'Pausas de Almuerzo: La hora de almuerzo debe respetarse conforme al cronograma establecido para evitar la desatención de la sala de ventas o área operativa.' }
      ]
    },
    {
      id: 3,
      title: 'Política Disciplinaria y Sanciones',
      category: 'Recursos Humanos',
      updated: '15 de Febrero de 2024',
      articles: [
        { num: 'Art. 1', text: 'Clasificación de Faltas: Las infracciones se clasifican en leves, graves y muy graves conforme a lo establecido en el Código de Trabajo de la República Dominicana.' },
        { num: 'Art. 2', text: 'Amonestaciones Escritas: Incurrir en tres tardanzas no justificadas en un mismo mes calendario generará una amonestación escrita con copia a la carpeta de RRHH.' },
        { num: 'Art. 3', text: 'Ausencias Injustificadas: Faltar al trabajo dos días consecutivos sin notificación médica o causa de fuerza mayor autorizada dará lugar a las acciones legales correspondientes.' }
      ]
    },
    {
      id: 4,
      title: 'Política de Facturación y Caja',
      category: 'Finanzas & Ventas',
      updated: '05 de Marzo de 2024',
      articles: [
        { num: 'Art. 1', text: 'Cuadre Diario de Caja: Todos los cajeros y ejecutivos deben realizar el arqueo de caja físico al finalizar el turno, reportando cualquier sobrante o faltante de inmediato.' },
        { num: 'Art. 2', text: 'Comprobantes Fiscales: Es obligatorio emitir la factura con el comprobante fiscal correcto solicitado por el cliente antes de procesar el pago.' }
      ]
    }
  ];

  const currentPolicy = companyPoliciesList[activeTab];

  const toggleConfirmRead = (policyId) => {
    setReadConfirmed(prev => ({
      ...prev,
      [policyId]: !prev[policyId]
    }));
  };

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans text-gray-800">
      
      {/* Header Superior Azul IVAD */}
      <div className="bg-[#1c2c4c] text-white pt-10 pb-16 px-4 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          
          <div className="text-center flex-1 mx-2">
            <h1 className="text-xl font-bold tracking-tight">Políticas de la Empresa</h1>
            <p className="text-xs text-[#d4af37] font-medium mt-0.5">Normativa Laboral e Institucional IVAD SRL</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
            <Scale size={20} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20 space-y-6">
        
        {/* Selector de Políticas (Tabs Horizontales) */}
        <div className="bg-white rounded-3xl p-3 shadow-xl border border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
          {companyPoliciesList.map((policy, idx) => (
            <button
              key={policy.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === idx 
                  ? 'bg-[#1c2c4c] text-[#d4af37] shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {policy.title}
            </button>
          ))}
        </div>

        {/* Documento Oficial de la Política */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 relative overflow-hidden space-y-6">
          
          {/* Marca de agua institucional */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <img src="/sello-ivad.png" alt="Sello Agua" className="w-[350px] h-[350px] object-contain" />
          </div>

          {/* Encabezado del Documento */}
          <div className="border-b-2 border-[#1c2c4c] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <img src="/sello-ivad.png" alt="Sello Oficial" className="w-12 h-12 object-contain" />
              <div>
                <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider block">IVAD HOME & GOODS SRL</span>
                <h2 className="text-lg font-black text-[#1c2c4c]">{currentPolicy.title}</h2>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="bg-[#1c2c4c] text-white text-[10px] font-bold px-3 py-1 rounded-full border border-[#d4af37]/30 inline-block">
                {currentPolicy.category}
              </span>
              <p className="text-[11px] text-gray-400 mt-1">Última revisión: {currentPolicy.updated}</p>
            </div>
          </div>

          {/* Artículos y Cláusulas */}
          <div className="space-y-4 relative z-10">
            {currentPolicy.articles.map((art, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-xs font-bold text-[#d4af37] block uppercase">{art.num}</span>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">{art.text}</p>
              </div>
            ))}
          </div>

          {/* Confirmación de Lectura */}
          <div className="border-t border-gray-200 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={!!readConfirmed[currentPolicy.id]}
                onChange={() => toggleConfirmRead(currentPolicy.id)}
                className="w-5 h-5 text-[#1c2c4c] rounded focus:ring-[#1c2c4c] border-gray-300"
              />
              <span className="text-xs font-bold text-[#1c2c4c]">
                He leído y me comprometo a cumplir esta normativa corporativa
              </span>
            </label>

            <button 
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 bg-[#1c2c4c] text-white text-xs font-bold px-4 py-3 rounded-2xl hover:bg-opacity-95 transition-all border border-[#d4af37]/30"
            >
              <Download size={14} className="text-[#d4af37]" />
              <span>Imprimir / PDF</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CompanyPolicies;
