import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, X, FileText, BadgeCheck, ShieldAlert, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const AdminVerifications = () => {
  const navigate = useNavigate();
  const { employees, refreshEmployees } = useEmployees();
  
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'verified'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('verification_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setRequests(data);
    } else {
      setRequests([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'Pendiente' || r.status === 'pending');
  const verifiedEmployees = employees.filter(e => e.verification_status === 'verificado' || e.is_admin);

  // Aprobar con tipo de insignia (Azul o Dorada)
  const handleApprove = async (req, badgeType = 'azul') => {
    if (!window.confirm(`¿Estás seguro de otorgar la Verificación ${badgeType === 'dorada' ? 'Dorada' : 'Azul'} a ${req.employee_name}?`)) return;

    setIsProcessing(true);

    // 1. Actualizar estado de solicitud
    await supabase
      .from('verification_requests')
      .update({ status: 'Aprobado', badge_type: badgeType })
      .eq('id', req.id);

    // 2. Actualizar empleado en Supabase
    await supabase
      .from('employees')
      .update({ 
        verification_status: 'verificado',
        verification_type: badgeType
      })
      .eq('id', req.employee_id);

    // 3. Crear notificación
    await supabase.from('notifications').insert([{
      user_id: req.employee_id,
      title: '¡Cuenta Verificada!',
      message: `Tus documentos han sido aprobados por Recursos Humanos. Se te ha asignado la Insignia ${badgeType === 'dorada' ? 'Dorada' : 'Azul'}.`,
      type: 'success',
      created_at: new Date().toISOString()
    }]);

    await fetchRequests();
    if (refreshEmployees) await refreshEmployees();
    setSelectedRequest(null);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectComment.trim() || !selectedRequest) {
      alert("Debes ingresar el motivo de rechazo.");
      return;
    }

    setIsProcessing(true);

    // 1. Actualizar solicitud
    await supabase
      .from('verification_requests')
      .update({ status: 'Rechazado', comment: rejectComment })
      .eq('id', selectedRequest.id);

    // 2. Notificación
    await supabase.from('notifications').insert([{
      user_id: selectedRequest.employee_id,
      title: 'Solicitud de Verificación Rechazada',
      message: `Tu solicitud fue rechazada. Motivo: ${rejectComment}`,
      type: 'warning',
      created_at: new Date().toISOString()
    }]);

    await fetchRequests();
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectComment('');
    setIsProcessing(false);
  };

  const handleRevoke = async (emp) => {
    if (!window.confirm(`¿Revocar la verificación a ${emp.name}?`)) return;

    await supabase
      .from('employees')
      .update({ verification_status: 'no_verificado', verification_type: null })
      .eq('id', emp.id);

    if (refreshEmployees) await refreshEmployees();
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-24 font-sans text-gray-800">
      <div className="w-full max-w-4xl flex flex-col">
        
        {/* Header */}
        <div className="bg-[#1c2c4c] text-white pt-10 pb-6 px-4 rounded-b-[2rem] shadow-sm mb-6">
          <div className="flex items-center">
            <button onClick={() => navigate('/admin')} className="p-2 text-white hover:bg-white/10 rounded-full mr-2">
              <ChevronLeft size={22} />
            </button>
            <h2 className="font-bold text-lg flex-1 text-center pr-8">Gestión de Verificaciones</h2>
          </div>
        </div>

        <div className="px-4">
          
          {/* Tabs: Pendientes vs Verificados */}
          <div className="flex gap-3 mb-6">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all ${
                activeTab === 'pending' 
                  ? 'bg-[#1c2c4c] text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              Pendientes ({pendingRequests.length})
            </button>
            
            <button 
              onClick={() => setActiveTab('verified')}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all ${
                activeTab === 'verified' 
                  ? 'bg-[#1c2c4c] text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              Verificados ({verifiedEmployees.length})
            </button>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            
            {/* TAB PENDIENTES */}
            {activeTab === 'pending' && (
              <>
                <h3 className="font-bold text-[#1c2c4c] mb-4 text-base">Solicitudes Pendientes de Revisión</h3>

                {loading ? (
                  <p className="text-center text-xs text-gray-400 py-10">Cargando solicitudes...</p>
                ) : pendingRequests.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <FileText size={40} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs">No hay solicitudes de verificación pendientes.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map(req => (
                      <div key={req.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-[#1c2c4c] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            {req.employee_name ? req.employee_name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1c2c4c] text-sm">{req.employee_name}</h4>
                            <p className="text-xs text-gray-500">{req.employee_email}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Enviado: {new Date(req.created_at || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button 
                            onClick={() => { setSelectedRequest(req); setShowRejectModal(true); }}
                            className="bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition flex items-center gap-1 border border-red-200"
                          >
                            <X size={14} /> Rechazar
                          </button>
                          
                          <button 
                            onClick={() => handleApprove(req, 'azul')}
                            className="bg-blue-50 text-[#1d9bf0] border border-blue-200 px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1"
                          >
                            <BadgeCheck size={16} className="text-[#1d9bf0]" /> Insignia Azul
                          </button>

                          <button 
                            onClick={() => handleApprove(req, 'dorada')}
                            className="bg-[#1c2c4c] text-[#d4af37] border border-[#d4af37]/40 px-3 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90 transition flex items-center gap-1 shadow-sm"
                          >
                            <BadgeCheck size={16} className="text-[#d4af37]" /> Insignia Dorada
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* TAB VERIFICADOS */}
            {activeTab === 'verified' && (
              <>
                <h3 className="font-bold text-[#1c2c4c] mb-4 text-base">Personal con Insignia Activa</h3>

                {verifiedEmployees.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <BadgeCheck size={40} className="mx-auto mb-2 opacity-20 text-[#d4af37]" />
                    <p className="text-xs">No hay cuentas verificadas en este momento.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {verifiedEmployees.map(emp => {
                      const isGold = emp.verification_type === 'dorada' || emp.is_admin;
                      
                      return (
                        <div key={emp.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/60 flex items-center justify-between">
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] bg-[#1c2c4c] p-[2px] shrink-0">
                              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                                {emp.avatar ? (
                                  <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover scale-[1.35]" />
                                ) : (
                                  <span className="font-bold text-xs text-[#1c2c4c]">{emp.name.charAt(0)}</span>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-bold text-[#1c2c4c] text-xs flex items-center gap-1">
                                <span>{emp.name}</span>
                                <BadgeCheck size={16} className={isGold ? "text-[#d4af37] fill-[#1c2c4c]" : "text-[#1d9bf0] fill-[#1c2c4c]"} />
                              </h4>
                              <p className="text-[11px] text-gray-500">{emp.role} • Insignia {isGold ? 'Dorada' : 'Azul'}</p>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleRevoke(emp)}
                            className="text-xs text-red-500 font-bold hover:underline"
                          >
                            Revocar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

          </div>
        </div>

      </div>

      {/* Modal Rechazar */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl space-y-4">
            <h3 className="font-bold text-base text-[#1c2c4c]">Motivo de Rechazo</h3>
            <p className="text-xs text-gray-500">Escribe la razón para informar a {selectedRequest.employee_name}:</p>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none h-28 resize-none"
              placeholder="Ej: La imagen del documento no es legible..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => { setShowRejectModal(false); setSelectedRequest(null); }}
                className="px-4 py-2 text-xs text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
              >
                Cancelar
              </button>
              <button 
                disabled={isProcessing}
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 disabled:opacity-50"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminVerifications;
