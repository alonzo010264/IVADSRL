import { useState } from 'react';
import { ChevronLeft, FileText, Download, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CertificateRequest = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('solicitar');
  const [addressedTo, setAddressedTo] = useState('');
  const [includeSalary, setIncludeSalary] = useState(false);
  
  const history = [
    { id: 1, date: '15 May 2024', addressedTo: 'A quien pueda interesar', status: 'Generado', includeSalary: true },
    { id: 2, date: '10 Ene 2024', addressedTo: 'Banco Popular', status: 'Generado', includeSalary: true },
    { id: 3, date: 'Hoy', addressedTo: 'Embajada de Estados Unidos', status: 'En Proceso', includeSalary: false },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Solicitud enviada a Recursos Humanos.');
    setActiveTab('historial');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl flex flex-col h-screen">
        
        {/* Header */}
        <div className="bg-[#1c2c4c] text-white p-4 sticky top-[72px] z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-1 mr-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold text-lg flex-1">Certificado Laboral</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white px-4 pt-4 shadow-sm border-b border-gray-100 flex gap-4">
          <button 
            onClick={() => setActiveTab('solicitar')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'solicitar' ? 'border-[#d4af37] text-[#1c2c4c]' : 'border-transparent text-gray-400'}`}
          >
            Nueva Solicitud
          </button>
          <button 
            onClick={() => setActiveTab('historial')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'historial' ? 'border-[#d4af37] text-[#1c2c4c]' : 'border-transparent text-gray-400'}`}
          >
            Mis Certificados
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          
          {activeTab === 'solicitar' ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="bg-[#e8f3ef] p-4 rounded-full">
                  <FileText size={40} className="text-[#1c2c4c]" />
                </div>
              </div>
              <h3 className="text-center font-bold text-xl text-[#1c2c4c] mb-2">Solicitar Carta</h3>
              <p className="text-center text-sm text-gray-500 mb-6">Completa los datos para generar tu certificado laboral. Las solicitudes son procesadas en un máximo de 24 horas laborables.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirigido a:</label>
                  <input 
                    type="text" 
                    required
                    value={addressedTo}
                    onChange={(e) => setAddressedTo(e.target.value)}
                    placeholder="Ej. Banco BHD, Embajada, A quien pueda interesar..." 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1c2c4c]"
                  />
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-medium text-[#1c2c4c]">Incluir salario</p>
                    <p className="text-xs text-gray-500">Mostrar tus ingresos mensuales en la carta</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={includeSalary} onChange={(e) => setIncludeSalary(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (Opcional):</label>
                  <textarea 
                    rows="2"
                    placeholder="Detalles adicionales para RR.HH."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1c2c4c]"
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-[#1c2c4c] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#152240] transition-colors mt-4">
                  Enviar Solicitud
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-[#1c2c4c]">{item.addressedTo}</h4>
                      <p className="text-xs text-gray-500">Solicitado el {item.date}</p>
                    </div>
                    {item.status === 'Generado' ? (
                      <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        <CheckCircle2 size={12} className="mr-1" /> Completado
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-bold text-[#d4af37] bg-yellow-50 px-2 py-1 rounded-full">
                        <Clock size={12} className="mr-1" /> {item.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Salario: {item.includeSalary ? 'Sí' : 'No'}
                    </span>
                    
                    {item.status === 'Generado' && (
                      <button className="flex items-center text-sm font-bold text-[#1c2c4c] bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors">
                        <Download size={16} className="mr-1" /> Descargar PDF
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CertificateRequest;
