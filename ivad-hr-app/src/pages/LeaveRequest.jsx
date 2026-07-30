import { Calendar, Paperclip, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeaveRequest = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center">
      <div className="p-6 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-ivad-blue mb-6">Solicitud de Permiso</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tipo de Permiso */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Tipo de Permiso</label>
            <div className="relative">
              <select className="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent">
                <option>Personal</option>
                <option>Vacaciones</option>
                <option>Médico</option>
                <option>Maternidad/Paternidad</option>
                <option>Luto</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ivad-gold">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Fecha de Inicio</label>
              <div className="relative">
                <input 
                  type="date" 
                  defaultValue="2023-10-24"
                  className="block w-full bg-white border border-ivad-gold rounded-lg py-3 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Fecha de Fin</label>
              <div className="relative">
                <input 
                  type="date" 
                  defaultValue="2023-10-24"
                  className="block w-full bg-white border border-ivad-gold rounded-lg py-3 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Motivo de la solicitud</label>
            <textarea 
              rows="4" 
              placeholder="Escribe el motivo de tu solicitud..."
              className="block w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ivad-blue focus:border-transparent resize-none"
            ></textarea>
          </div>

          {/* Adjuntar Comprobante */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Adjuntar Comprobante</label>
            <button type="button" className="w-full flex items-center justify-center gap-2 bg-white border border-ivad-gold rounded-lg py-3 px-4 text-gray-900 font-medium hover:bg-gray-50 transition-colors">
              <Paperclip size={20} />
              Adjuntar documento
            </button>
          </div>

          {/* Botón Enviar */}
          <div className="pt-4 pb-20">
            <button 
              type="submit" 
              className="w-full bg-ivad-blue text-white rounded-lg py-4 px-4 font-medium hover:bg-opacity-90 transition-colors"
            >
              Enviar Solicitud
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LeaveRequest;
