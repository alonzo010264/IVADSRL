import React, { useState } from 'react';
import { ChevronLeft, Clock, Utensils, Calendar, CheckCircle2, AlertCircle, Play, Square, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';

const Horarios = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();

  // Estatus de Almuerzo en tiempo real: 'normal' | 'en_almuerzo' | 'completado'
  const [lunchStatus, setLunchStatus] = useState('normal');
  const [lunchStartTime, setLunchStartTime] = useState(null);

  const weeklySchedule = [
    { day: 'Lunes', in: '08:00 AM', lunch: '12:00 PM - 01:00 PM', out: '05:00 PM', hours: '8h', status: 'Turno Regular' },
    { day: 'Martes', in: '08:00 AM', lunch: '12:00 PM - 01:00 PM', out: '05:00 PM', hours: '8h', status: 'Turno Regular' },
    { day: 'Miércoles', in: '08:00 AM', lunch: '12:00 PM - 01:00 PM', out: '05:00 PM', hours: '8h', status: 'Turno Regular' },
    { day: 'Jueves', in: '08:00 AM', lunch: '12:00 PM - 01:00 PM', out: '05:00 PM', hours: '8h', status: 'Turno Regular' },
    { day: 'Viernes', in: '08:00 AM', lunch: '12:00 PM - 01:00 PM', out: '05:00 PM', hours: '8h', status: 'Turno Regular' },
    { day: 'Sábado', in: '08:00 AM', lunch: '01:00 PM - 02:00 PM', out: '02:00 PM', hours: '5h', status: 'Medio Día' },
    { day: 'Domingo', in: '—', lunch: '—', out: '—', hours: '0h', status: 'Día Libre' }
  ];

  const handleStartLunch = () => {
    setLunchStatus('en_almuerzo');
    setLunchStartTime(new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleEndLunch = () => {
    setLunchStatus('completado');
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
            <h1 className="text-xl font-bold tracking-tight">Horarios & Almuerzo</h1>
            <p className="text-xs text-[#d4af37] font-medium mt-0.5">Control de Jornada Laboral</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
            <Clock size={20} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20 space-y-6">
        
        {/* Tarjeta de Estatus de Almuerzo en Vivo */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1c2c4c] text-[#d4af37] flex items-center justify-center shadow-sm">
                <Utensils size={24} />
              </div>
              <div>
                <h2 className="font-bold text-[#1c2c4c] text-base">Registro de Almuerzo</h2>
                <p className="text-xs text-gray-500">Horario asignado hoy: 12:00 PM - 01:00 PM (1 Hora)</p>
              </div>
            </div>

            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
              lunchStatus === 'en_almuerzo' 
                ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse' 
                : lunchStatus === 'completado' 
                ? 'bg-blue-50 text-[#1c2c4c] border-blue-200' 
                : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              {lunchStatus === 'en_almuerzo' ? '🍱 En Almuerzo' : lunchStatus === 'completado' ? '✅ Almuerzo Completado' : '⏳ Pendiente'}
            </span>
          </div>

          {/* Acciones de Almuerzo */}
          {lunchStatus === 'normal' && (
            <button 
              onClick={handleStartLunch}
              className="w-full bg-[#1c2c4c] text-[#d4af37] font-bold py-4 rounded-2xl shadow-md hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 border border-[#d4af37]/30"
            >
              <Play size={20} />
              <span>Registrar Salida a Almuerzo</span>
            </button>
          )}

          {lunchStatus === 'en_almuerzo' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center justify-between">
                <span>Iniciaste almuerzo a las: <strong>{lunchStartTime}</strong></span>
                <span className="font-mono font-bold text-amber-900">1 Hora asignada</span>
              </div>
              <button 
                onClick={handleEndLunch}
                className="w-full bg-[#d4af37] text-[#1c2c4c] font-bold py-4 rounded-2xl shadow-md hover:bg-yellow-600 transition-all flex items-center justify-center gap-2"
              >
                <Square size={20} />
                <span>Registrar Regreso de Almuerzo</span>
              </button>
            </div>
          )}

          {lunchStatus === 'completado' && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-700 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-[#d4af37] shrink-0" />
              <span>Has completado tu hora de almuerzo del día de hoy. ¡Buen trabajo!</span>
            </div>
          )}
        </div>

        {/* Cronograma Semanal de Horarios */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1c2c4c]/10 text-[#1c2c4c] rounded-full flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1c2c4c]">Horario Semanal de Trabajo</h2>
                <p className="text-xs text-gray-500">Programación aprobada por Recursos Humanos</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {weeklySchedule.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.hours === '0h' ? 'bg-gray-400' : 'bg-[#d4af37]'}`} />
                  <div>
                    <h3 className="font-bold text-[#1c2c4c] text-sm">{item.day}</h3>
                    <p className="text-xs text-[#d4af37] font-semibold">{item.status}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200 sm:w-auto">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block font-bold">Entrada</span>
                    <span className="font-bold text-[#1c2c4c]">{item.in}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block font-bold">Almuerzo</span>
                    <span className="font-bold text-[#1c2c4c]">{item.lunch}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block font-bold">Salida</span>
                    <span className="font-bold text-[#1c2c4c]">{item.out}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Horarios;
