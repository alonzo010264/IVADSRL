import { useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { ChevronLeft, Check, X, Search, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminVerifications = () => {
  const navigate = useNavigate();
  const { employees, verificationRequests, approveVerification, rejectVerification, revokeVerification, fetchVerificationDocument } = useEmployees();
  
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'verified'
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [selectedEmployeeToRevoke, setSelectedEmployeeToRevoke] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const pendingRequests = verificationRequests
    .filter(req => req.status === 'pending')
    .map(req => {
      const emp = employees.find(e => e.id === req.employee_id);
      return { ...req, employee: emp || { name: 'Desconocido', email: 'N/A' } };
    });

  const verifiedEmployees = employees.filter(e => e.verification_status === 'verified');

  const handleApprove = (id) => {
    if (window.confirm("¿Estás seguro de otorgar la Verificación Azul a este empleado?")) {
      approveVerification(id);
      setSelectedRequest(null);
      setDocumentImage(null);
    }
  };

  const handleViewDocumentClick = async (req) => {
    setSelectedRequest(req);
    setIsLoadingDoc(true);
    setDocumentImage(null);
    const docBase64 = await fetchVerificationDocument(req.id);
    setDocumentImage(docBase64);
    setIsLoadingDoc(false);
  };

  const handleRejectClick = (req) => {
    setSelectedRequest(req);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectComment.trim()) {
      alert("Debes escribir un motivo para el rechazo.");
      return;
    }
    rejectVerification(selectedRequest.id, rejectComment);
    setShowRejectModal(false);
    setSelectedRequest(null);
    setDocumentImage(null);
    setRejectComment('');
  };

  const handleRevokeClick = (emp) => {
    setSelectedEmployeeToRevoke(emp);
    setShowRevokeModal(true);
  };

  const confirmRevoke = () => {
    if (!revokeReason.trim()) {
      alert("Debes escribir un motivo para la revocación o suspensión.");
      return;
    }
    revokeVerification(selectedEmployeeToRevoke.id, revokeReason);
    setShowRevokeModal(false);
    setSelectedEmployeeToRevoke(null);
    setRevokeReason('');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-24">
      <div className="w-full max-w-4xl flex flex-col">
        
        {/* Header Específico */}
        <div className="bg-[#1c2c4c] rounded-b-[2rem] shadow-sm h-24 relative mb-6">
          <div className="text-white p-4 flex items-center h-full">
            <button onClick={() => navigate(-1)} className="p-1 mr-2 z-10 hover:bg-white/10 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold text-xl flex-1 text-center z-10 pr-8">Gestión de Verificaciones</h2>
          </div>
        </div>

        <div className="px-4">
          
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 rounded-xl font-bold transition-colors ${activeTab === 'pending' ? 'bg-[#1c2c4c] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
            >
              Pendientes ({pendingRequests.length})
            </button>
            <button 
              onClick={() => setActiveTab('verified')}
              className={`flex-1 py-3 rounded-xl font-bold transition-colors ${activeTab === 'verified' ? 'bg-[#1c2c4c] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
            >
              Verificados ({verifiedEmployees.length})
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {activeTab === 'pending' && (
              <>
                <h3 className="font-bold text-[#1c2c4c] mb-4 text-lg">Solicitudes Pendientes</h3>

                {pendingRequests.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <FileText size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No hay solicitudes de verificación pendientes.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map(req => (
                      <div key={req.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                        
                        <div className="flex items-center gap-4">
                          {req.employee.avatar ? (
                            <img src={req.employee.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                              {req.employee.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-[#1c2c4c]">{req.employee.name}</h4>
                            <p className="text-sm text-gray-500">{req.employee.email}</p>
                            <p className="text-xs text-gray-400 mt-1">Solicitado: {new Date(req.submittedAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-3">
                          <button 
                            onClick={() => handleViewDocumentClick(req)}
                            className="text-sm text-ivad-blue font-medium underline"
                          >
                            Ver Documento
                          </button>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleRejectClick(req)}
                              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition flex items-center gap-1"
                            >
                              <X size={16} /> Rechazar
                            </button>
                            <button 
                              onClick={() => handleApprove(req.id)}
                              className="bg-green-50 text-green-600 px-4 py-2 rounded-lg font-bold hover:bg-green-100 transition flex items-center gap-1"
                            >
                              <Check size={16} /> Aprobar
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'verified' && (
              <>
                <h3 className="font-bold text-[#1c2c4c] mb-4 text-lg">Cuentas Verificadas</h3>

                {verifiedEmployees.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Check size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No hay cuentas verificadas actualmente.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {verifiedEmployees.map(emp => (
                      <div key={emp.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                        
                        <div className="flex items-center gap-4">
                          {emp.avatar ? (
                            <img src={emp.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                              {emp.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-[#1c2c4c]">{emp.name}</h4>
                              <Check size={14} className="bg-blue-500 text-white rounded-full p-[2px]" />
                            </div>
                            <p className="text-sm text-gray-500">{emp.email}</p>
                            <p className="text-xs text-gray-400 mt-1">{emp.role}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleRevokeClick(emp)}
                          className="bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition flex items-center gap-1"
                        >
                          Suspender / Revocar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      {/* Modal para ver documento */}
      {selectedRequest && !showRejectModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-[#1c2c4c]">Documento de Identidad</h3>
              <button onClick={() => { setSelectedRequest(null); setDocumentImage(null); }} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto bg-gray-100 flex items-center justify-center min-h-[300px]">
              {isLoadingDoc ? (
                <div className="text-center text-gray-500">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1c2c4c] mx-auto mb-3"></div>
                  <p>Cargando documento...</p>
                </div>
              ) : documentImage && documentImage.startsWith('data:image') ? (
                <img src={documentImage} alt="Documento" className="max-w-full h-auto rounded shadow-sm" />
              ) : (
                <div className="text-center p-8 bg-white rounded shadow-sm">
                  <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Documento PDF o no visualizable directamente.</p>
                  {documentImage && (
                    <a href={documentImage} download="documento" className="text-ivad-blue underline mt-2 inline-block">Descargar Archivo</a>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button 
                onClick={() => handleRejectClick(selectedRequest)}
                className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100"
              >
                Rechazar
              </button>
              <button 
                onClick={() => handleApprove(selectedRequest.id)}
                className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
              >
                Aprobar Verificación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para motivo de rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-xl text-[#1c2c4c] mb-2">Motivo del Rechazo</h3>
            <p className="text-sm text-gray-500 mb-4">
              Este mensaje será enviado a {selectedRequest?.employee?.name} para que pueda corregir su solicitud.
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-red-500 h-32 resize-none"
              placeholder="Ej: La imagen está borrosa, no se lee el número de cédula..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            ></textarea>
            <div className="flex gap-3 mt-4 justify-end">
              <button 
                onClick={() => { setShowRejectModal(false); setSelectedRequest(null); }}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmReject}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
              >
                Enviar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para suspender / revocar */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-xl text-red-600 mb-2 flex items-center gap-2">
              <X size={24} /> Suspender / Revocar
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Estás a punto de quitarle la Verificación Azul a <strong>{selectedEmployeeToRevoke?.name}</strong>. Escribe el motivo de la suspensión o revocación según las políticas:
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-red-500 h-32 resize-none"
              placeholder="Ej: Se detectó un cambio no autorizado en la información de identidad, o se ha cometido una falta grave..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
            ></textarea>
            <div className="flex gap-3 mt-4 justify-end">
              <button 
                onClick={() => { setShowRevokeModal(false); setSelectedEmployeeToRevoke(null); }}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmRevoke}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
              >
                Confirmar Revocación
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminVerifications;
