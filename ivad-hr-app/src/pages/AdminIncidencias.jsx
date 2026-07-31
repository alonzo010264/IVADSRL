import { useState, useEffect } from 'react';
import { ChevronLeft, AlertTriangle, CheckCircle, Clock, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const AdminIncidencias = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const mockReports = [
    {
      id: 'inc-1',
      employee_name: 'Carlos Mendoza',
      tipo: 'accidente',
      tipo_label: 'Accidente en tienda',
      descripcion: 'Caja de productos cayó en el pasillo 3 durante el desempaque. Se acordonó el área.',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      status: 'pending',
      evidencia: null
    },
    {
      id: 'inc-2',
      employee_name: 'María Fernández',
      tipo: 'sistema',
      tipo_label: 'Falla en sistema / POS',
      descripcion: 'El sistema POS de la caja 2 perdió conexión con la impresora de comprobantes.',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'resolved',
      evidencia: null
    }
  ];

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('incidencias')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setReports(data);
      } else {
        setReports(mockReports);
      }
    } catch (err) {
      setReports(mockReports);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await supabase.from('incidencias').update({ status: newStatus }).eq('id', id);
    } catch (e) {
      console.log('Local update:', e);
    }
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
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
            <h1 className="text-xl font-bold">Reportes de Incidencias</h1>
            <p className="text-sm text-[#d4af37]">Administración IVAD Connect</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1c2c4c] rounded-full flex items-center justify-center text-[#d4af37]">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1c2c4c]">Incidencias Reportadas</h2>
                <p className="text-xs text-gray-500">Reportes operativos y fallas enviadas por empleados</p>
              </div>
            </div>
            <span className="bg-[#1c2c4c] text-[#d4af37] font-bold text-xs px-3 py-1 rounded-full">
              {reports.length} reportes
            </span>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-400">Cargando reportes...</p>
          ) : reports.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No hay incidencias reportadas aún.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1c2c4c]/10 text-[#1c2c4c] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#1c2c4c] text-sm">{rep.tipo_label || rep.tipo}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          rep.status === 'resolved' 
                            ? 'bg-blue-100 text-[#1c2c4c]' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rep.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{rep.descripcion}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1"><User size={12} /> {rep.employee_name || 'Empleado'}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(rep.created_at).toLocaleDateString('es-DO')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {rep.status !== 'resolved' ? (
                      <button
                        onClick={() => handleUpdateStatus(rep.id, 'resolved')}
                        className="px-3 py-1.5 bg-[#1c2c4c] text-[#d4af37] text-xs font-bold rounded-xl hover:bg-opacity-90 transition"
                      >
                        Marcar Resuelto
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <CheckCircle size={14} className="text-[#1c2c4c]" /> Atendido
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

export default AdminIncidencias;
