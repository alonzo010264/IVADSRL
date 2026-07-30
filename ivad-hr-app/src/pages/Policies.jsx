import { ChevronLeft, ShieldAlert, Receipt, Scale, FileText, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Policies = () => {
  const navigate = useNavigate();

  const policies = [
    {
      id: 1,
      title: 'Código de Ética y Conducta',
      description: 'Valores, principios y estándares de comportamiento esperados de todos los colaboradores de IVAD.',
      icon: Scale,
      updated: '10 Ene 2024'
    },
    {
      id: 2,
      title: 'Política Disciplinaria',
      description: 'Normas de comportamiento, faltas, sanciones y procedimientos disciplinarios.',
      icon: ShieldAlert,
      updated: '15 Feb 2024'
    },
    {
      id: 3,
      title: 'Política de Facturación',
      description: 'Procedimientos correctos para el manejo de caja, facturación a clientes y devoluciones.',
      icon: Receipt,
      updated: '05 Mar 2024'
    },
    {
      id: 4,
      title: 'Reglamento Interno de Trabajo',
      description: 'Condiciones de trabajo, horarios, descansos y obligaciones generales.',
      icon: FileText,
      updated: '20 Nov 2023'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-10">
      <div className="w-full max-w-3xl flex flex-col h-screen">
        
        {/* Header */}
        <div className="bg-[#1c2c4c] text-white p-4 sticky top-0 z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-1 mr-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold text-lg flex-1">Políticas de la Empresa</h2>
          </div>
        </div>

        {/* Banner Informativo */}
        <div className="p-4 pb-0">
          <div className="bg-gradient-to-r from-[#1c2c4c] to-[#2a406e] rounded-2xl p-6 text-white shadow-md">
            <h3 className="font-bold text-xl mb-2 text-[#d4af37]">Conoce tus normativas</h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              Es responsabilidad de todos los colaboradores de IVAD leer y comprender las políticas de la empresa. Estos documentos garantizan un ambiente de trabajo justo, ético y seguro.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#f8f9fc] p-3 rounded-xl shrink-0">
                  <policy.icon size={28} className="text-[#1c2c4c]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1c2c4c] text-lg leading-tight mb-1">{policy.title}</h4>
                  <p className="text-sm text-gray-500">{policy.description}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-xs font-medium text-gray-400">Actualizado: {policy.updated}</span>
                
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 bg-[#f8f9fc] text-[#1c2c4c] font-semibold text-xs px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Eye size={16} /> Leer
                  </button>
                  <button className="flex items-center gap-1 bg-white border border-gray-200 text-[#1c2c4c] font-semibold text-xs px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download size={16} /> PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Policies;
