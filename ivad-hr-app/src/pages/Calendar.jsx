import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from 'lucide-react';

const CalendarView = () => {
  const [currentDate] = useState(new Date(2024, 4, 16)); // Mayo 2024
  
  const daysOfWeek = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  
  // Días de relleno del mes anterior (abril)
  const prevMonthDays = [29, 30];
  // Días del mes actual (mayo)
  const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  // Días de relleno del mes siguiente (junio)
  const nextMonthDays = [1, 2];

  const events = [
    {
      id: 1,
      title: 'Reunión de Equipo',
      dept: 'Departamento de Operaciones',
      time: '16 de mayo, 10:00 a.m.'
    },
    {
      id: 2,
      title: 'Pago de Nómina',
      dept: 'Departamento de Finanzas',
      time: '20 de mayo, 08:00 a.m.'
    },
    {
      id: 3,
      title: 'Capacitación: Seguridad Laboral',
      dept: 'Departamento de Recursos Humanos',
      time: '23 de mayo, 02:00 p.m.'
    },
    {
      id: 4,
      title: 'Cumpleaños de la Empresa',
      dept: 'Todos los colaboradores',
      time: '31 de mayo, Todo el día'
    }
  ];

  return (
    <div className="bg-white min-h-screen flex justify-center pb-8">
      <div className="w-full max-w-3xl">
        
        {/* Calendario Contenedor */}
        <div className="px-6 pt-6 pb-2">
          
          {/* Navegación del mes */}
          <div className="flex justify-between items-center mb-6 px-2">
            <button className="text-[#0b1b3d] p-1">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <h2 className="text-[17px] font-bold text-[#0b1b3d]">Mayo 2024</h2>
            <button className="text-[#0b1b3d] p-1">
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>
          
          {/* Días de la semana */}
          <div className="grid grid-cols-7 mb-4 text-center">
            {daysOfWeek.map(day => (
              <div key={day} className="text-[10px] text-gray-500 font-semibold tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid de días */}
          <div className="grid grid-cols-7 gap-y-4 text-center">
            
            {/* Mes anterior */}
            {prevMonthDays.map(date => (
              <div key={`prev-${date}`} className="h-10 flex items-center justify-center text-gray-300 font-medium text-[15px]">
                {date}
              </div>
            ))}

            {/* Mes actual */}
            {currentMonthDays.map(date => (
              <div key={`cur-${date}`} className="h-10 flex items-center justify-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-[15px] font-medium transition-colors cursor-pointer ${
                  date === 16 
                    ? 'bg-[#0b1b3d] text-white shadow-md' 
                    : 'text-[#0b1b3d] hover:bg-gray-100'
                }`}>
                  {date}
                </div>
              </div>
            ))}

            {/* Mes siguiente */}
            {nextMonthDays.map(date => (
              <div key={`next-${date}`} className="h-10 flex items-center justify-center text-gray-300 font-medium text-[15px]">
                {date}
              </div>
            ))}
            
          </div>
        </div>

        {/* Separador invisible pero necesario para mantener el diseño limpio */}
        <div className="px-6 mt-4">
          
          {/* Próximos eventos Título */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#0b1b3d] text-[15px]">Próximos eventos</h3>
            <button className="text-[13px] font-medium text-[#0b1b3d] flex items-center hover:underline">
              Ver todos <ChevronRightIcon size={16} className="ml-1" />
            </button>
          </div>

          {/* Lista de Eventos */}
          <div className="space-y-0 border-t border-gray-100">
            {events.map((evt, idx) => (
              <div 
                key={evt.id} 
                className={`py-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors ${
                  idx !== events.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div>
                  <h4 className="font-bold text-[#0b1b3d] text-[15px] mb-1">{evt.title}</h4>
                  <p className="text-[13px] text-[#0b1b3d]/80 mb-0.5">{evt.dept}</p>
                  <p className="text-[12px] text-gray-500">{evt.time}</p>
                </div>
                <ChevronRightIcon size={20} className="text-[#0b1b3d]" />
              </div>
            ))}
          </div>

          {/* Banner Mantente al día */}
          <div className="mt-6 mb-8 bg-[#f8f9fc] rounded-2xl p-4 flex justify-between items-center border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="pr-4">
              <h4 className="font-bold text-[#0b1b3d] text-[14px] mb-1">Mantente al día</h4>
              <p className="text-[12px] text-gray-500 leading-tight">
                Recibirás notificaciones de los eventos importantes según tus preferencias.
              </p>
            </div>
            <ChevronRightIcon size={20} className="text-[#0b1b3d] shrink-0" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CalendarView;
