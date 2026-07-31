import { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Check, X, Clock, User, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const AdminPermisos = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockRequests = [
    {
      id: 'perm-1',
      employee_name: 'Laura Martínez',
      tipo: 'Permiso Médico',
      motivo: 'Cita médica especialista con gastroenterólogo.',
      fecha_inicio: '2026-08-05',
      fecha_fin: '2026-08-05',
      status: 'pending',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'perm-2',
      employee_name: 'Roberto Gómez',
      tipo: 'Vacaciones',
      motivo: 'Solicitud de vacaciones anuales reglamentarias.',
      fecha_inicio: '2026-08-15',
      fecha_fin: '2026-08-22',
      status: 'approved',
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setRequests(data);
      } else {
        setRequests(mockRequests);
      }
    } catch (e) {
      setRequests(mockRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await supabase.from('leave_requests').update({ status }).eq('id', id);
    } catch (e) {
      console.log('Update status:', e);
    }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Header */}
      <div className="bg-[#1c2c4c] text-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-md relative">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin')} className="p-2 absolute left-4 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Solicitudes de Permisos</h1>
            <p className="text-sm text-[#d4af37]">Aprobaciones de RRHH / Administración</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1c2c4c] rounded-full flex items-center justify-center text-[#d4af37]">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1c2c4c]">Permisos y Vacaciones</h2>
                <p className="text-xs text-gray-500">Gestión de permisos recibidos de colaboradores</p>
              </div>
            </div>
            <span className="bg-[#1c2c4c] text-[#d4af37] font-bold text-xs px-3 py-1 rounded-full">
              {requests.length} solicitudes
            </span>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-400">Cargando solicitudes...</p>
          ) : requests.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No hay solicitudes pendientes.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#1c2c4c] text-base">{req.employee_name || 'Empleado'}</h4>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1c2c4c] border border-blue-100">
                        {req.tipo}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        req.status === 'approved' ? 'bg-blue-100 text-[#1c2c4c]' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status === 'approved' ? 'Aprobado' : req.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{req.motivo}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1"><Calendar size={13} className="text-[#d4af37]" /> {req.fecha_inicio} al {req.fecha_fin}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'approved')}
                          className="px-4 py-2 bg-[#1c2c4c] text-[#d4af37] text-xs font-bold rounded-xl hover:bg-opacity-90 transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Check size={14} /> Aprobar
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'rejected')}
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-300 transition flex items-center gap-1.5"
                        >
                          <X size={14} /> Rechazar
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">
                        Estado: {req.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </span>
                    )}
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

export default AdminPermisos;
