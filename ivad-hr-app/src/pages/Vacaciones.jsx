import React from 'react';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';

const Vacaciones = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();

  const empName = currentUser?.name || 'Empleado IVAD';
  const hireDateStr = currentUser?.hire_date || currentUser?.created_at || '2023-05-15';
  
  // Calcular fecha sugerida de vacaciones (según fecha de ingreso)
  const hireDate = new Date(hireDateStr);
  const currentYear = new Date().getFullYear();
  const nextVacationDate = new Date(currentYear, hireDate.getMonth(), hireDate.getDate());
  
  if (nextVacationDate < new Date()) {
    nextVacationDate.setFullYear(currentYear + 1);
  }

  const formattedSuggestedDate = nextVacationDate.toLocaleDateString('es-DO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const daysAvailable = currentUser?.vacation_days ?? 14;
  const daysTaken = currentUser?.vacation_taken ?? 0;
  const daysRemaining = Math.max(0, daysAvailable - daysTaken);

  const vacationHistory = [
    { period: `${currentYear} - ${currentYear + 1}`, days: 14, status: 'Disponible', suggested: formattedSuggestedDate },
    { period: `${currentYear - 1} - ${currentYear}`, days: 14, status: 'Tomado', suggested: '15 de Mayo de 2025' }
  ];

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans text-gray-800 flex flex-col items-center">
      
      {/* Header Superior Azul IVAD */}
      <div className="w-full bg-[#1c2c4c] text-white pt-10 pb-16 px-4 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          
          <div className="text-center flex-1 mx-2">
            <h1 className="text-xl font-bold tracking-tight">Mis Vacaciones</h1>
            <p className="text-xs text-[#d4af37] font-medium mt-0.5">Control de Días & Programación Anual</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="w-full max-w-xl px-4 -mt-10 relative z-20 space-y-4">
        
        {/* Resumen de Días Disponibles - Diseño Limpio Moderno */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-[#1c2c4c] text-base">{empName}</h2>
              <p className="text-xs text-gray-500">Balance de Vacaciones (Ley Laboral RD)</p>
            </div>
            <span className="text-[11px] font-bold bg-[#1c2c4c] text-[#d4af37] px-3 py-1 rounded-full">
              Estatus Activo
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Correspondientes</span>
              <span className="text-xl font-black text-[#1c2c4c]">{daysAvailable} Días</span>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Disfrutados</span>
              <span className="text-xl font-black text-gray-500">{daysTaken} Días</span>
            </div>

            <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-700 block uppercase mb-1">Disponibles</span>
              <span className="text-xl font-black text-[#1c2c4c]">{daysRemaining} Días</span>
            </div>
          </div>
        </div>

        {/* Recomendación de Fecha Sugerida */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#1c2c4c]">Fecha Sugerida para Próximas Vacaciones</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Calculada según la antigüedad de ingreso del colaborador:
            </p>
          </div>

          <div className="p-4 bg-[#1c2c4c] text-white rounded-2xl border border-[#d4af37]/40 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-wider block">Programación Estimada</span>
              <span className="text-base font-bold">{formattedSuggestedDate}</span>
            </div>
            <span className="bg-[#d4af37] text-[#1c2c4c] text-xs font-black px-3 py-1 rounded-full">
              Sugerido
            </span>
          </div>

          <button
            onClick={() => navigate('/solicitar-vacaciones')}
            className="w-full bg-[#1c2c4c] text-[#d4af37] font-bold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all border border-[#d4af37]/30 mt-2 text-sm"
          >
            <span>Solicitar Vacaciones</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Historial de Períodos Anuales (Limpio) */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-3">
          <h3 className="text-sm font-bold text-[#1c2c4c]">Historial de Períodos</h3>

          <div className="space-y-2.5">
            {vacationHistory.map((item, index) => (
              <div key={index} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1c2c4c] text-sm block">Período {item.period}</span>
                  <span className="text-gray-500">Fecha asignada: {item.suggested}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                    item.status === 'Disponible' 
                      ? 'bg-blue-50 text-[#1c2c4c] border border-blue-200' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                  <span className="block text-gray-600 font-medium mt-1">{item.days} Días</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Vacaciones;
