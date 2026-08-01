import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const LeaveApprovals = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      if (!currentUser) {
        setRequests([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('employee_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setRequests(data);
      } else {
        setRequests([]);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [currentUser]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Aprobado':
      case 'Aprobada':
        return {
          bg: 'bg-green-700 text-white border border-green-500',
          icon: <CheckCircle2 size={20} className="text-white mr-1.5" />
        };
      case 'Pendiente':
        return {
          bg: 'bg-[#1c2c4c] text-[#d4af37] border border-[#d4af37]/40',
          icon: <Clock size={20} className="text-[#d4af37] mr-1.5" />
        };
      case 'Denegado':
      case 'Rechazada':
        return {
          bg: 'bg-red-700 text-white border border-red-500',
          icon: <XCircle size={20} className="text-white mr-1.5" />
        };
      default:
        return {
          bg: 'bg-[#1c2c4c] text-white',
          icon: null
        };
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-16">
      <div className="p-4 w-full max-w-3xl pt-8">
        
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="p-2 text-[#1c2c4c] hover:bg-gray-200 rounded-full mr-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-[#1c2c4c]">Mis Solicitudes & Estatus</h1>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs text-gray-400">Cargando solicitudes...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
            <Clock size={36} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-700 text-base">No hay solicitudes registradas</h3>
            <p className="text-xs text-gray-400 mt-1">Aquí aparecerá el estatus de tus solicitudes de permisos y vacaciones.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {requests.map((req) => {
              const statusConfig = getStatusConfig(req.status);
              
              return (
                <div key={req.id} className="relative bg-white rounded-2xl p-6 shadow-md border border-gray-100 mt-6">
                  
                  {/* Badge Flotante */}
                  <div className={`absolute -top-5 left-1/2 -translate-x-1/2 flex items-center px-4 py-1.5 rounded-full font-bold text-xs shadow-md ${statusConfig.bg}`}>
                    {statusConfig.icon}
                    {req.status}
                  </div>

                  <div className="text-center mt-3 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#1c2c4c] mb-1">{req.type} ({req.total_days} Días)</h2>
                    <p className="text-xs text-gray-600">Período: {req.start_date} al {req.end_date}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Solicitado el: {new Date(req.created_at || Date.now()).toLocaleDateString('es-DO')}
                    </p>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-bold text-[#1c2c4c] text-xs mb-1">Motivo</h3>
                    <p className="text-gray-700 text-xs leading-relaxed">
                      {req.reason || 'Sin observaciones.'}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApprovals;
