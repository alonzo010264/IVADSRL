import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';
import { ArrowLeft, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

const VerificationRequest = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  
  const [existingRequest, setExistingRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMyRequest = async () => {
      if (!currentUser) return;

      const { data } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('employee_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data[0]) {
        setExistingRequest(data[0]);
      }
      setLoading(false);
    };

    fetchMyRequest();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) {
      alert("Debes aceptar las políticas para continuar.");
      return;
    }
    if (!file) {
      alert("Debes adjuntar un documento de identidad.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convertir archivo a Base64 para almacenar
      const fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      const newReq = {
        employee_id: currentUser.id,
        employee_name: currentUser.name,
        employee_email: currentUser.email || '',
        document_url: fileBase64,
        status: 'Pendiente',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('verification_requests')
        .insert([newReq])
        .select();

      if (error) {
        alert("Error al enviar la solicitud: " + error.message);
      } else if (data) {
        setExistingRequest(data[0]);
        alert("¡Solicitud de verificación enviada a Recursos Humanos exitosamente!");
      }
    } catch (error) {
      console.error("Error leyendo archivo: ", error);
      alert("Hubo un error al procesar el archivo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-xs text-gray-400">Cargando datos...</div>;
  }

  if (existingRequest?.status === 'Pendiente') {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#1c2c4c] rounded-full flex items-center justify-center mx-auto">
             <Clock size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#1c2c4c]">Solicitud en Revisión</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Tu solicitud de verificación fue enviada correctamente y está siendo evaluada por Recursos Humanos. Recibirás una notificación en un plazo de 3 a 4 días laborables.
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#1c2c4c] text-[#d4af37] font-bold py-3 px-8 rounded-2xl w-full hover:bg-opacity-95 transition-all text-xs"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (currentUser?.verification_status === 'verificado' || existingRequest?.status === 'Aprobado') {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
             <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl font-bold text-[#1c2c4c]">¡Cuenta Verificada!</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Tu cuenta posee la insignia oficial de verificación. Tienes acceso a todos los beneficios y acreditaciones de IVAD SRL.
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#1c2c4c] text-[#d4af37] font-bold py-3 px-8 rounded-2xl w-full hover:bg-opacity-95 transition-all text-xs"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16 font-sans text-gray-800">
      
      {/* Header */}
      <div className="bg-[#1c2c4c] text-white p-4 pt-10 sticky top-0 z-40 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center">
          <button onClick={() => navigate(-1)} className="p-1 mr-2 text-white hover:bg-white/10 rounded-full">
            <ArrowLeft size={22} />
          </button>
          <h2 className="font-bold text-base">Solicitar Verificación de Identidad</h2>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 mt-2 space-y-6">
        
        {/* Documento de Políticas */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h1 className="text-xl font-bold text-[#1c2c4c] border-b border-gray-100 pb-3 mb-4">
            Políticas y Requisitos de Verificación IVAD
          </h1>

          <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
            <div>
              <h2 className="font-bold text-[#1c2c4c] text-sm mb-1">Requisitos de Evaluación</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ser empleado activo en la nómina de IVAD SRL.</li>
                <li>Perfil de usuario completado con fotografía legible.</li>
                <li>Proporcionar copia válida de Cédula o Pasaporte.</li>
                <li>La información debe coincidir exactamente con los registros de RR.HH.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-[#1c2c4c] text-sm mb-1">Beneficios e Insignia</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Obtención de la insignia oficial azul o dorada en el chat y perfil.</li>
                <li>Emisión y descarga de Certificados Laborales en formato PDF.</li>
                <li>Prioridad en trámites de solicitudes internas.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Formulario de Solicitud */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-base font-bold text-[#1c2c4c] mb-4 border-b border-gray-100 pb-3">
            {existingRequest?.status === 'Rechazado' ? "Volver a Enviar Solicitud" : "Adjuntar Documentación"}
          </h2>
          
          {existingRequest?.status === 'Rechazado' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-xs">
              <h3 className="font-bold text-red-800 mb-1">Solicitud Previa Rechazada</h3>
              <p className="text-red-700">
                <strong>Motivo:</strong> {existingRequest.comment || "Documento ilegible o incompleto."}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Documento de Identidad (Cédula o Pasaporte)</label>
              <input 
                type="file" 
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border border-gray-200 rounded-xl p-3 text-xs bg-gray-50 text-gray-700 focus:outline-none"
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#1c2c4c] rounded border-gray-300"
                  required
                />
                <span className="text-xs text-gray-700 font-medium leading-normal">
                  Confirmo que la documentación presentada es fidedigna y acepto las políticas de validación de identidad de IVAD SRL.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={!accepted || !file || isSubmitting}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md ${
                accepted && file && !isSubmitting
                  ? 'bg-[#1c2c4c] text-[#d4af37] hover:bg-opacity-95 cursor-pointer' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud a Recursos Humanos'}
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
};

export default VerificationRequest;
