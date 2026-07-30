import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Solicitud de vacaciones aprobada',
      message: 'Tu solicitud de vacaciones del 15 al 30 de agosto ha sido aprobada por la gerencia.',
      time: 'Hace 2 horas',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Nueva política disponible',
      message: 'Se ha actualizado el Código de Ética de la empresa. Por favor, revísalo en la sección de Políticas.',
      time: 'Hace 5 horas',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Recordatorio de evaluación',
      message: 'Tienes una evaluación de desempeño pendiente de completar antes del 30 de mayo.',
      time: 'Ayer',
      read: true
    },
    {
      id: 4,
      type: 'neutral',
      title: 'Reunión de equipo',
      message: 'No olvides la reunión general mañana a las 10:00 AM en la sala principal.',
      time: 'Ayer',
      read: true
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
            <h2 className="font-bold text-lg flex-1">Notificaciones</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-gray-800">Recientes</h3>
            <button className="text-sm font-medium text-[#1c2c4c]">Marcar todas como leídas</button>
          </div>

          {notifications.map((notif) => (
            <div key={notif.id} className={`bg-white rounded-xl p-5 shadow-sm border ${notif.read ? 'border-gray-100' : 'border-[#d4af37]/40'} flex items-start gap-3 relative overflow-hidden transition-colors`}>
              
              {/* Indicador lateral de no leído */}
              {!notif.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d4af37]"></div>
              )}
              
              <div className="flex-1 min-w-0 pl-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-base truncate pr-4 ${notif.read ? 'font-medium text-gray-700' : 'font-bold text-[#1c2c4c]'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs font-medium text-gray-400 shrink-0">{notif.time}</span>
                </div>
                
                <p className={`text-sm leading-relaxed ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Notifications;
