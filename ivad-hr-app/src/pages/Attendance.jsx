import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
  const navigate = useNavigate();

  const attendanceData = [
    { date: '28 May 2024', timeIn: '08:00 AM', status: 'on-time' },
    { date: '27 May 2024', timeIn: '08:15 AM', status: 'late' },
    { date: '24 May 2024', timeIn: '07:55 AM', status: 'on-time' },
    { date: '23 May 2024', timeIn: '08:02 AM', status: 'on-time' },
    { date: '22 May 2024', timeIn: '08:30 AM', status: 'late' },
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
            <h2 className="font-bold text-lg flex-1">Control de Asistencia</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Info Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-2">
            <p className="text-sm text-gray-500 text-center">
              Estos datos son actualizados manualmente por el departamento de Recursos Humanos.
            </p>
          </div>

          {/* Grafico Resumen */}
          <div className="bg-[#1c2c4c] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            
            <h3 className="font-bold text-lg mb-6 relative z-10">Resumen del Mes (Mayo)</h3>
            
            <div className="flex justify-around items-center relative z-10">
              {/* Fake Donut Chart via CSS border */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Background circle */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" fill="transparent" stroke="#334155" strokeWidth="12" />
                  {/* Progress circle (aprox 80%) */}
                  <circle cx="56" cy="56" r="46" fill="transparent" stroke="#d4af37" strokeWidth="12" strokeDasharray="289" strokeDashoffset="57" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="text-center">
                  <span className="text-2xl font-bold block">80%</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-300">Puntualidad</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#d4af37]"></div>
                  <div>
                    <p className="text-xs text-gray-300">A tiempo</p>
                    <p className="font-bold">16 días</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                  <div>
                    <p className="text-xs text-gray-300">Tardanzas</p>
                    <p className="font-bold">4 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historial */}
          <h3 className="font-bold text-[#1c2c4c] text-lg mt-6 mb-2 px-2">Historial Reciente</h3>
          
          <div className="space-y-3">
            {attendanceData.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${item.status === 'on-time' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {item.status === 'on-time' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 flex items-center gap-1">
                      <CalendarIcon size={14} className="text-gray-400" /> {item.date}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock size={14} className="text-gray-400" /> Hora de registro: <span className="font-medium text-gray-700">{item.timeIn}</span>
                    </p>
                  </div>
                </div>
                
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.status === 'on-time' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.status === 'on-time' ? 'A tiempo' : 'Tarde'}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Attendance;
