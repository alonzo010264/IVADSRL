import React from 'react';
import { ChevronLeft, Calendar, Palmtree, Clock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';

const Vacaciones = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();

  const empName = currentUser?.name || 'Empleado IVAD';
  const hireDateStr = currentUser?.hire_date || currentUser?.created_at || '2023-05-15';
  
  // Calcular fecha sugerida de vacaciones (1 año después de ingreso o próximo aniversario)
  const hireDate = new Date(hireDateStr);
  const currentYear = new Date().getFullYear();
  const nextVacationDate = new Date(currentYear, hireDate.getMonth(), hireDate.getDate());
  
  // Si la fecha ya pasó este año, poner la del próximo año
  if (nextVacationDate < new Date()) {
    nextVacationDate.setFullYear(currentYear + 1);
  }

  const formattedSuggestedDate = nextVacationDate.toLocaleDateString('es-DO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Cálculo estimado de días devengados segun Código de Trabajo RD (14 días por año)
  const daysAvailable = currentUser?.vacation_days || 14;
  const daysTaken = currentUser?.vacation_taken || 0;
  const daysRemaining = daysAvailable - daysTaken;

  const vacationHistory = [
    { period: `${currentYear} - ${currentYear + 1}`, days: 14, status: 'Devengado (Disponible)', suggested: formattedSuggestedDate },
    { period: `${currentYear - 1} - ${currentYear}`, days: 14, status: 'Tomado y Disfrutado', suggested: '15 de Mayo de 2025' }
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

          <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
            <Palmtree size={20} />
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="w-full max-w-xl px-4 -mt-10 relative z-20 space-y-5">
        
        {/* Resumen de Días Disponibles */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1c2c4c] text-[#d4af37] flex items-center justify-center shadow-md">
                <Palmtree size={24} />
              </div>
              <div>
                <h2 className="font-bold text-[#1c2c4c] text-base">{empName}</h2>
                <p className="text-xs text-gray-500">Balance de Vacaciones Ley Laboral RD</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-[#1c2c4c] text-[#d4af37] px-3 py-1 rounded-full border border-[#d4af37]/30">
              Activo
            </span>
          </div>

          {/* Grid de Días */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Correspondientes</span>
              <span className="text-lg font-black text-[#1c2c4c]">{daysAvailable} Días</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Disfrutados</span>
              <span className="text-lg font-black text-gray-500">{daysTaken} Días</span>
            </div>

            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-700 block uppercase">Disponibles</span>
              <span className="text-lg font-black text-[#1c2c4c]">{daysRemaining} Días</span>
            </div>
          </div>
        </div>

        {/* Recomendación de Fecha Sugerida para Tomar Vacaciones */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#1c2c4c]/10 text-[#1c2c4c] rounded-full flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c2c4c]">Fecha Sugerida de Próximas Vacaciones</h3>
              <p className="text-xs text-gray-600 mt-1">
                De acuerdo con tu fecha de ingreso a IVAD SRL, se recomienda programar tus vacaciones a partir del:
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#1c2c4c] text-white rounded-2xl border border-[#d4af37]/40 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-wider block">Período Recomendado</span>
              <span className="text-base font-bold">{formattedSuggestedDate}</span>
            </div>
            <span className="bg-[#d4af37] text-[#1c2c4c] text-xs font-black px-3 py-1 rounded-full">
              Sugerido
            </span>
          </div>

          {/* Botón directo para solicitar las vacaciones */}
          <button
            onClick={() => navigate('/solicitud-permiso')}
            className="w-full bg-[#1c2c4c] text-[#d4af37] font-bold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all border border-[#d4af37]/30 mt-2"
          >
            <span>Solicitar Programación de Vacaciones</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Historial de Períodos Anuales */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-[#1c2c4c]">Historial de Períodos de Vacaciones</h3>

          <div className="space-y-3">
            {vacationHistory.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1c2c4c] text-sm block">Período {item.period}</span>
                  <span className="text-gray-500">Fecha asignada: {item.suggested}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                    item.status.includes('Disponible') 
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
