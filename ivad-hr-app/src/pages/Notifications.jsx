import React, { useState, useEffect } from 'react';
import { ChevronLeft, BellOff, CheckCheck, Bell, Megaphone, ClipboardList, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

// Ícono según el tipo de notificación
const NotifIcon = ({ type }) => {
  const base = "w-8 h-8 rounded-full flex items-center justify-center shrink-0";
  if (type === 'anuncio')    return <div className={`${base} bg-blue-50`}><Megaphone size={15} className="text-blue-500" /></div>;
  if (type === 'tarea')      return <div className={`${base} bg-purple-50`}><ClipboardList size={15} className="text-purple-500" /></div>;
  if (type === 'solicitud')  return <div className={`${base} bg-amber-50`}><Calendar size={15} className="text-amber-500" /></div>;
  if (type === 'nomina')     return <div className={`${base} bg-green-50`}><DollarSign size={15} className="text-green-500" /></div>;
  return <div className={`${base} bg-[#1c2c4c]/10`}><Bell size={15} className="text-[#1c2c4c]" /></div>;
};

// Tiempo relativo compacto
const relativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)     return 'ahora';
  if (diff < 3600)   return `${Math.floor(diff / 60)}m`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      if (!currentUser) { setNotifications([]); setLoading(false); return; }

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${currentUser.id},user_id.eq.all`)
        .order('created_at', { ascending: false });

      setNotifications(data || []);
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

  const handleMarkOne = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      
      {/* Header compacto */}
      <div className="bg-[#1c2c4c] text-white px-4 pt-10 pb-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-1 mr-2 text-white hover:bg-white/10 rounded-full transition">
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-base leading-none">Notificaciones</h2>
            {unreadCount > 0 && (
              <p className="text-[11px] text-[#d4af37] mt-0.5">{unreadCount} sin leer</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-[#d4af37] flex items-center gap-1 hover:opacity-80 transition"
            >
              <CheckCheck size={13} /> Marcar leídas
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      <div className="max-w-3xl mx-auto px-4 pt-3 space-y-1">
        {loading ? (
          <div className="text-center py-16 text-xs text-gray-400">Cargando...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <BellOff size={22} />
            </div>
            <h3 className="font-bold text-gray-700 text-sm">Sin notificaciones</h3>
            <p className="text-[11px] text-gray-400 mt-1">Aquí aparecerán tus alertas de solicitudes, avisos y tareas.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => !notif.read && handleMarkOne(notif.id)}
              className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                notif.read ? 'bg-white/60' : 'bg-white shadow-sm'
              }`}
            >
              {/* Ícono tipo */}
              <NotifIcon type={notif.type} />

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs leading-snug truncate ${notif.read ? 'text-gray-500' : 'font-semibold text-[#1c2c4c]'}`}>
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-gray-400 shrink-0 mt-px">{relativeTime(notif.created_at)}</span>
                </div>
                {notif.message && (
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{notif.message}</p>
                )}
              </div>

              {/* Punto de no leída */}
              {!notif.read && (
                <span className="w-2 h-2 bg-[#d4af37] rounded-full shrink-0 mt-1.5"></span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
