import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const CalendarView = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const daysOfWeek = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // Días del mes
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Obtener el día de la semana del primer día (0 = Domingo, 1 = Lunes...)
  let startDayOfWeek = firstDayOfMonth.getDay();
  if (startDayOfWeek === 0) startDayOfWeek = 7; // Convertir Domingo a 7 (LUN-DOM)

  const daysInMonth = lastDayOfMonth.getDate();
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Días de relleno del mes anterior
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthPadding = startDayOfWeek - 1;
  const prevMonthDays = Array.from({ length: prevMonthPadding }, (_, i) => prevMonthLastDay - prevMonthPadding + i + 1);

  // Cargar eventos reales desde Supabase (Permisos aprobados y anuncios)
  useEffect(() => {
    const fetchRealEvents = async () => {
      setLoading(true);

      const { data: leaveData } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('status', 'Aprobada');

      const realEvents = [];

      if (leaveData) {
        leaveData.forEach(item => {
          realEvents.push({
            id: item.id,
            title: `Vacaciones: ${item.employee_name}`,
            dept: `Días aprobados: ${item.total_days}`,
            time: `Del ${item.start_date} al ${item.end_date}`,
            type: 'leave'
          });
        });
      }

      setEvents(realEvents);
      setLoading(false);
    };

    fetchRealEvents();
  }, [currentMonthDate]);

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="bg-white min-h-screen flex justify-center pb-16 font-sans text-gray-800">
      <div className="w-full max-w-3xl">
        
        {/* Header Superior */}
        <div className="bg-[#1c2c4c] text-white p-4 pt-10 sticky top-0 z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-1 mr-2 text-white hover:bg-white/10 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold text-lg flex-1">Calendario de Actividades IVAD</h2>
          </div>
        </div>

        {/* Navegación del mes */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex justify-between items-center mb-6 px-2">
            <button onClick={handlePrevMonth} className="text-[#1c2c4c] p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
            <h2 className="text-base font-bold text-[#1c2c4c]">
              {monthNames[month]} {year}
            </h2>
            <button onClick={handleNextMonth} className="text-[#1c2c4c] p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>
          </div>
          
          {/* Días de la semana */}
          <div className="grid grid-cols-7 mb-4 text-center">
            {daysOfWeek.map(day => (
              <div key={day} className="text-[10px] text-gray-400 font-bold tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid de días dinámico */}
          <div className="grid grid-cols-7 gap-y-3 text-center">
            {prevMonthDays.map(date => (
              <div key={`prev-${date}`} className="h-9 flex items-center justify-center text-gray-300 font-medium text-xs">
                {date}
              </div>
            ))}

            {currentMonthDays.map(date => {
              const isToday = date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

              return (
                <div key={`cur-${date}`} className="h-9 flex items-center justify-center">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isToday 
                      ? 'bg-[#1c2c4c] text-[#d4af37] shadow-md border-2 border-[#d4af37]' 
                      : 'text-[#1c2c4c] hover:bg-gray-100'
                  }`}>
                    {date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Próximos eventos reales */}
        <div className="px-6 mt-6">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <h3 className="font-bold text-[#1c2c4c] text-sm flex items-center gap-2">
              <CalendarIcon size={18} className="text-[#d4af37]" />
              Eventos & Vacaciones Programadas
            </h3>
          </div>

          {loading ? (
            <p className="text-center text-xs text-gray-400 py-8">Cargando actividades...</p>
          ) : events.length === 0 ? (
            <div className="text-center py-10 px-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-400 font-medium">No hay eventos ni vacaciones programadas para este mes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-[#1c2c4c] text-xs mb-0.5">{evt.title}</h4>
                    <p className="text-[11px] text-gray-500">{evt.dept}</p>
                    <p className="text-[10px] text-[#d4af37] font-bold mt-1">{evt.time}</p>
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

export default CalendarView;
