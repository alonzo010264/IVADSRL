import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, Clock, XCircle, MessageSquare, User, Calendar, Check, X, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const AdminPermisos = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [tempComment, setTempComment] = useState('');

  const mockRequests = [
    {
      id: 'perm-1',
      employee_name: 'María Rodríguez',
      type: 'Permiso Personal',
      dateRange: '15 Oct - 17 Oct',
      requestedAt: '01 Oct',
      status: 'Aprobado',
      reviewer: 'María Rodríguez',
      reviewerRole: 'Recursos Humanos',
      reviewerImg: 'https://i.pravatar.cc/150?img=5',
      comments: 'Aprobado según política. Disfruta de tus días libres, María.'
    },
    {
      id: 'perm-2',
      employee_name: 'Roberto Gómez',
      type: 'Vacaciones',
      dateRange: '20 Nov - 30 Nov',
      requestedAt: '10 Oct',
      status: 'Pendiente',
      reviewer: currentUser?.name || 'Administración Central',
      reviewerRole: 'Recursos Humanos',
      reviewerImg: currentUser?.avatar || 'https://i.pravatar.cc/150?img=11',
      comments: ''
    },
    {
      id: 'perm-3',
      employee_name: 'Laura Fernández',
      type: 'Licencia Médica',
      dateRange: '05 Sep - 07 Sep',
      requestedAt: '04 Sep',
      status: 'Denegado',
      reviewer: 'Laura Fernández',
      reviewerRole: 'Coordinadora RRHH',
      reviewerImg: 'https://i.pravatar.cc/150?img=9',
      comments: 'Falta adjuntar el certificado médico original. Por favor, realiza una nueva solicitud con el documento adjunto.'
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

  const handleResolveRequest = async (id, newStatus, customComment) => {
    const reviewerName = currentUser?.name || 'Administración IVAD';
    const reviewerRole = currentUser?.role || 'Recursos Humanos';
    const reviewerImg = currentUser?.avatar || 'https://i.pravatar.cc/150?img=68';
    const commentText = customComment !== undefined ? customComment : (tempComment || (newStatus === 'Aprobado' ? 'Aprobado según política corporativa.' : 'Solicitud no procedente.'));

    try {
      await supabase.from('leave_requests').update({ 
        status: newStatus,
        reviewer: reviewerName,
        reviewer_role: reviewerRole,
        reviewer_img: reviewerImg,
        comments: commentText
      }).eq('id', id);
    } catch (e) {
      console.log('Update status local:', e);
    }

    setRequests(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: newStatus,
          reviewer: reviewerName,
          reviewerRole: reviewerRole,
          reviewerImg: reviewerImg,
          comments: commentText
        };
      }
      return r;
    }));

    setActiveCommentId(null);
    setTempComment('');
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Aprobado':
        return {
          bg: 'bg-[#1c2c4c] text-[#d4af37] border border-[#d4af37]/40 shadow-sm',
          icon: <CheckCircle2 size={16} className="text-[#d4af37] mr-1.5" />
        };
      case 'Pendiente':
        return {
          bg: 'bg-[#1c2c4c]/90 text-amber-300 border border-amber-400/30 shadow-sm',
          icon: <Clock size={16} className="text-amber-300 mr-1.5" />
        };
      case 'Denegado':
        return {
          bg: 'bg-gray-800 text-gray-200 border border-gray-600 shadow-sm',
          icon: <XCircle size={16} className="text-red-400 mr-1.5" />
        };
      default:
        return {
          bg: 'bg-[#1c2c4c] text-white',
          icon: null
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 font-sans">
      {/* Header */}
      <div className="bg-[#1c2c4c] text-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-md relative">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin')} className="p-2 absolute left-4 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Solicitudes de Permisos</h1>
            <p className="text-sm text-[#d4af37]">Evaluación & Comentarios de Administración</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        
        {loading ? (
          <p className="text-center py-12 text-gray-400">Cargando solicitudes de permisos...</p>
        ) : requests.length === 0 ? (
          <p className="text-center py-12 text-gray-400">No hay solicitudes registradas.</p>
        ) : (
          <div className="space-y-10">
            {requests.map((req) => {
              const badge = getBadgeStyle(req.status);
              const isEditingComment = activeCommentId === req.id;

              return (
                <div key={req.id} className="relative bg-white rounded-2xl p-6 shadow-md border border-gray-100 mt-6">
                  
                  {/* Badge Flotante Superior (Estilo Tarjeta de Permiso IVAD - Sin Verde) */}
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 flex items-center px-4 py-1.5 rounded-full font-bold text-xs ${badge.bg}`}>
                    {badge.icon}
                    {req.status}
                  </div>

                  {/* Detalle del Permiso */}
                  <div className="text-center mt-3 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-[#1c2c4c] mb-1">{req.type || req.tipo}</h2>
                    <p className="text-xs font-semibold text-gray-500">Solicitado por: <span className="text-[#1c2c4c] font-bold">{req.employee_name}</span></p>
                    <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-600">
                      <span>Fecha: <strong className="text-gray-900">{req.dateRange || req.fecha_inicio}</strong></span>
                      <span>•</span>
                      <span>Solicitado el: <strong className="text-gray-900">{req.requestedAt || 'Recientemente'}</strong></span>
                    </div>
                  </div>

                  {/* Revisado por */}
                  <div className="py-4 border-b border-gray-100">
                    <h3 className="font-bold text-[#1c2c4c] text-sm mb-3">Revisado por</h3>
                    <div className="flex items-center gap-3">
                      <img 
                        src={req.reviewerImg || 'https://i.pravatar.cc/150?img=68'} 
                        alt={req.reviewer || 'Revisor'} 
                        className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-[#d4af37]/30"
                      />
                      <div>
                        <p className="font-bold text-gray-800 text-sm leading-tight">{req.reviewer || currentUser?.name || 'Administración IVAD'}</p>
                        <p className="text-xs text-[#d4af37] font-semibold">{req.reviewerRole || 'Recursos Humanos'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Comentarios de Administración */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-[#1c2c4c] text-sm flex items-center gap-1.5">
                        <MessageSquare size={15} className="text-[#d4af37]" />
                        Comentarios
                      </h3>
                      {!isEditingComment && (
                        <button 
                          onClick={() => {
                            setActiveCommentId(req.id);
                            setTempComment(req.comments || '');
                          }}
                          className="text-xs text-[#1c2c4c] font-bold hover:underline flex items-center gap-1"
                        >
                          <Edit3 size={12} /> {req.comments ? 'Editar comentario' : 'Añadir comentario'}
                        </button>
                      )}
                    </div>

                    {isEditingComment ? (
                      <div className="space-y-3 mt-2">
                        <textarea
                          rows="3"
                          value={tempComment}
                          onChange={(e) => setTempComment(e.target.value)}
                          placeholder="Escribe un comentario explicativo para el empleado..."
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none resize-none"
                        ></textarea>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolveRequest(req.id, 'Aprobado', tempComment)}
                            className="flex-1 py-2.5 bg-[#1c2c4c] text-[#d4af37] font-bold text-xs rounded-xl hover:bg-opacity-90 transition flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Check size={14} /> Aprobar con comentario
                          </button>
                          <button
                            onClick={() => handleResolveRequest(req.id, 'Denegado', tempComment)}
                            className="flex-1 py-2.5 bg-gray-800 text-gray-200 font-bold text-xs rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-1 shadow-sm"
                          >
                            <X size={14} /> Denegar con comentario
                          </button>
                          <button
                            onClick={() => setActiveCommentId(null)}
                            className="py-2.5 px-3 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-200 transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-xs leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                        {req.comments || 'Sin comentarios registrados aún.'}
                      </p>
                    )}
                  </div>

                  {/* Acciones directas si está en pendiente y no editando */}
                  {req.status === 'Pendiente' && !isEditingComment && (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => {
                          setActiveCommentId(req.id);
                          setTempComment('Aprobado según política. Disfruta de tus días libres.');
                        }}
                        className="flex-1 py-2.5 bg-[#1c2c4c] text-[#d4af37] font-bold text-xs rounded-xl hover:bg-opacity-90 transition flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Check size={14} /> Aprobar Solicitud
                      </button>
                      <button
                        onClick={() => {
                          setActiveCommentId(req.id);
                          setTempComment('Solicitud no aprobada por necesidades operativas.');
                        }}
                        className="flex-1 py-2.5 bg-gray-800 text-gray-200 font-bold text-xs rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-1 shadow-sm"
                      >
                        <X size={14} /> Denegar Solicitud
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPermisos;
