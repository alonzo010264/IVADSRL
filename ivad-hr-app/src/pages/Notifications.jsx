import React, { useState, useEffect } from 'react';
import { ChevronLeft, BellOff, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      if (!currentUser) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${currentUser.id},user_id.eq.all`)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [currentUser]);

  const handleMarkAllRead = async () => {
    if (!currentUser || notifications.length === 0) return;

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    await supabase
      .from('notifications')
      .update({ read: true })
      .or(`user_id.eq.${currentUser.id},user_id.eq.all`);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-16">
      <div className="w-full max-w-3xl flex flex-col h-screen">
        
        {/* Header */}
        <div className="bg-[#1c2c4c] text-white p-4 pt-10 sticky top-0 z-30 shadow-md">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-1 mr-2 text-white hover:bg-white/10 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold text-lg flex-1">Notificaciones</h2>
            {notifications.length > 0 && (
              <button 
                onClick={handleMarkAllRead} 
                className="text-xs font-semibold text-[#d4af37] flex items-center gap-1 hover:underline"
              >
                <CheckCheck size={14} /> Leídas
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-16 text-xs text-gray-400">Cargando notificaciones...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <BellOff size={28} />
              </div>
              <h3 className="font-bold text-gray-700 text-base">No tienes notificaciones</h3>
              <p className="text-xs text-gray-400 mt-1">Aquí verás las alertas de solicitudes, avisos y tareas asignadas.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className={`bg-white rounded-xl p-4 shadow-sm border ${notif.read ? 'border-gray-100' : 'border-[#d4af37]/60'} flex items-start gap-3 relative overflow-hidden transition-colors`}>
                {!notif.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d4af37]"></div>
                )}
                <div className="flex-1 min-w-0 pl-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm truncate pr-4 ${notif.read ? 'font-medium text-gray-700' : 'font-bold text-[#1c2c4c]'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-medium text-gray-400 shrink-0">
                      {new Date(notif.created_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Notifications;
