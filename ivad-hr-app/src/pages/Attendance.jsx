import { ChevronLeft, Calendar as CalendarIcon, Clock, PlugZap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-10">
      <div className="w-full max-w-3xl flex flex-col h-screen">
        
        {/* Header */}
        <div className="bg-[#1c2c4c] text-white p-4 sticky top-0 z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-1 mr-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold text-lg flex-1">Control de Asistencia</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Info Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#d4af37]/30 mb-2 flex items-center gap-3">
            <div className="bg-[#1c2c4c] rounded-full p-2 shrink-0">
              <PlugZap size={18} className="text-[#d4af37]" />
            </div>
            <p className="text-sm text-gray-600">
              Los datos de asistencia se actualizarán <span className="font-bold text-[#1c2c4c]">automáticamente</span> al conectar el sistema de ponche.
            </p>
          </div>

          {/* Gráfico Resumen */}
          <div className="bg-[#1c2c4c] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            
            <h3 className="font-bold text-lg mb-6 relative z-10">Resumen del Mes</h3>
            
            <div className="flex justify-center items-center relative z-10">
              {/* Donut 0% */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" fill="transparent" stroke="#334155" strokeWidth="12" />
                  <circle cx="56" cy="56" r="46" fill="transparent" stroke="#d4af37" strokeWidth="12" strokeDasharray="289" strokeDashoffset="289" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="text-center">
                  <span className="text-2xl font-bold block">0%</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-300">Puntualidad</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historial vacío */}
          <h3 className="font-bold text-[#1c2c4c] text-lg mt-6 mb-2 px-2">Historial Reciente</h3>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <CalendarIcon size={26} className="text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700 text-sm">Sin registros aún</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Los registros aparecerán aquí automáticamente una vez que se conecte el sistema de ponche.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Attendance;
