import { useState, useEffect } from 'react';
import { ChevronLeft, Lightbulb, User, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const AdminIniciativas = () => {
  const navigate = useNavigate();
  const [iniciativas, setIniciativas] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockIniciativas = [
    {
      id: 'ini-1',
      employee_name: 'Ana María Ruiz',
      titulo: 'Servicio de empaque ecológico para eventos',
      descripcion: 'Implementar combos de empaques biodegradables con descuentos especiales para salones de eventos y organizadores.',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'under_review'
    },
    {
      id: 'ini-2',
      employee_name: 'David Ortiz',
      titulo: 'Etiquetado rápido en almacén por código QR',
      descripcion: 'Agilizar la búsqueda de cajas de vasos foam mediante etiquetas QR escaneables con el móvil.',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: 'approved'
    }
  ];

  const fetchIniciativas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('iniciativas')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setIniciativas(data);
      } else {
        setIniciativas(mockIniciativas);
      }
    } catch (e) {
      setIniciativas(mockIniciativas);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIniciativas();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await supabase.from('iniciativas').update({ status }).eq('id', id);
    } catch (e) {
      console.log('Update iniciativa status:', e);
    }
    setIniciativas(prev => prev.map(item => item.id === id ? { ...item, status } : item));
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
            <h1 className="text-xl font-bold">Propuestas e Iniciativas</h1>
            <p className="text-sm text-[#d4af37]">Ideas sugeridas por colaboradores</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1c2c4c] rounded-full flex items-center justify-center text-[#d4af37]">
                <Lightbulb size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1c2c4c]">Buzón de Iniciativas</h2>
                <p className="text-xs text-gray-500">Propuestas recibidas desde la app</p>
              </div>
            </div>
            <span className="bg-[#1c2c4c] text-[#d4af37] font-bold text-xs px-3 py-1 rounded-full">
              {iniciativas.length} iniciativas
            </span>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-400">Cargando propuestas...</p>
          ) : iniciativas.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No hay propuestas registradas aún.</p>
          ) : (
            <div className="space-y-4">
              {iniciativas.map((item) => (
                <div key={item.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#1c2c4c] text-base">{item.titulo}</h4>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'approved' ? 'bg-blue-100 text-[#1c2c4c]' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status === 'approved' ? 'Aprobada' : 'En Evaluación'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.descripcion}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                      <span className="flex items-center gap-1"><User size={12} /> {item.employee_name || 'Empleado'}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(item.created_at).toLocaleDateString('es-DO')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {item.status !== 'approved' ? (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'approved')}
                        className="px-4 py-2 bg-[#1c2c4c] text-[#d4af37] text-xs font-bold rounded-xl hover:bg-opacity-90 transition flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle size={14} /> Aprobar Idea
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-[#1c2c4c] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 flex items-center gap-1">
                        <CheckCircle size={14} className="text-[#d4af37]" /> Seleccionada
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

export default AdminIniciativas;
