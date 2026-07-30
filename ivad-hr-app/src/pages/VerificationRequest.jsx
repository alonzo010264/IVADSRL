import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';

const VerificationRequest = () => {
  const navigate = useNavigate();
  const { currentUser, verificationRequests, submitVerification } = useEmployees();
  
  // Buscar solicitud existente
  const existingRequest = verificationRequests.find(r => r.employee_id === currentUser?.id);
  const isPending = existingRequest?.status === 'pending';
  const isApproved = existingRequest?.status === 'approved';
  const isRejected = existingRequest?.status === 'rejected';

  const [accepted, setAccepted] = useState(false);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) {
      alert("Debes aceptar los términos para continuar.");
      return;
    }
    if (!file) {
      alert("Debes adjuntar un documento de identidad.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convertir archivo a Base64 para simular subida
      const fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      const result = await submitVerification(currentUser.id, fileBase64);
      if (result && result.error) {
        alert("Hubo un error al enviar la solicitud: " + result.error.message);
      }
    } catch (error) {
      console.error("Error leyendo archivo: ", error);
      alert("Hubo un error al procesar el archivo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="text-3xl">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1c2c4c] mb-4">Solicitud en Revisión</h2>
          <p className="text-gray-600 mb-6">
            Tu solicitud de verificación está siendo evaluada por Recursos Humanos. Recibirás una respuesta en un plazo aproximado de 3 a 4 días laborables.
          </p>
          <button 
            onClick={() => navigate('/mas')}
            className="bg-[#1c2c4c] text-white font-bold py-3 px-8 rounded-lg w-full hover:bg-[#0f1b33] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (isApproved) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1c2c4c] mb-4">¡Felicidades!</h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta ya está verificada. Ya puedes disfrutar de los beneficios exclusivos para empleados verificados de IVAD.
          </p>
          <button 
            onClick={() => navigate('/mas')}
            className="bg-[#1c2c4c] text-white font-bold py-3 px-8 rounded-lg w-full hover:bg-[#0f1b33] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header simple */}
      <div className="bg-[#1c2c4c] text-white p-4 flex items-center sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-2 mr-2">
          &#8592;
        </button>
        <h2 className="font-bold text-lg">Solicitar Verificación Azul</h2>
      </div>

      <div className="max-w-3xl mx-auto p-4 mt-4">
        
        {/* Documento de Políticas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          
          <h1 className="text-2xl font-bold text-[#1c2c4c] border-b pb-4 mb-6">Políticas y Condiciones de la Verificación Azul</h1>

          <div className="space-y-8 text-gray-700">
            
            <section>
              <h2 className="text-lg font-bold text-[#1c2c4c] mb-3">Requisitos</h2>
              <p className="mb-2">Para solicitar la Verificación Azul, el empleado debe cumplir con los siguientes requisitos:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ser un empleado activo de IVAD.</li>
                <li>Tener el perfil completado al 100 %.</li>
                <li>Tener una fotografía de perfil reciente donde el rostro sea claramente visible.</li>
                <li>Proporcionar un documento de identidad válido (cédula, pasaporte u otro documento legal).</li>
                <li>Que la información proporcionada coincida con los registros de Recursos Humanos.</li>
                <li>No tener una suspensión activa en la plataforma.</li>
                <li>No estar bajo investigación por una falta grave.</li>
                <li>No haber presentado información falsa.</li>
                <li>Aceptar los Términos y Condiciones de la Verificación IVAD.</li>
                <li>Enviar la solicitud para revisión por Recursos Humanos.</li>
              </ul>
              <p className="mt-3 text-sm text-gray-500 font-medium italic">
                Nota: La aprobación de la verificación no es automática. Recursos Humanos revisará la solicitud y responderá en un plazo aproximado de 3 a 4 días laborables.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1c2c4c] mb-3">Beneficios</h2>
              <p className="mb-2">Al obtener la Verificación Azul, el empleado podrá:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Obtener la insignia oficial de Empleado Verificado por IVAD.</li>
                <li>Solicitar certificados laborales y descargarlos en formato PDF.</li>
                <li>Acceder y descargar documentos oficiales autorizados.</li>
                <li>Disponer de una identidad verificada dentro de la plataforma.</li>
                <li>Recibir una gestión más ágil en determinados trámites internos.</li>
                <li>Acceder a funciones exclusivas reservadas para empleados verificados.</li>
                <li>Tener mayor confianza al interactuar con otros departamentos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1c2c4c] mb-3">Motivos de rechazo</h2>
              <p className="mb-2">La solicitud podrá ser rechazada si:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>La información no coincide con los registros de Recursos Humanos.</li>
                <li>El documento de identidad es inválido o ilegible.</li>
                <li>La fotografía de perfil no permite identificar al empleado.</li>
                <li>El perfil está incompleto.</li>
                <li>El empleado ya no pertenece a IVAD.</li>
                <li>Existe una falta grave activa o una investigación disciplinaria relacionada con una falta grave.</li>
                <li>Se detecta información falsa o intento de suplantación de identidad.</li>
                <li>No se cumplen las políticas establecidas para la Verificación Azul.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1c2c4c] mb-3">Revocación de la verificación</h2>
              <p className="mb-2">La Verificación Azul podrá suspenderse o revocarse cuando:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>El empleado cambie información que afecte su identidad (por ejemplo, foto de perfil, nombre o documento de identidad), hasta que Recursos Humanos valide nuevamente esos datos.</li>
                <li>El empleado deje de pertenecer a IVAD.</li>
                <li>Se detecte información falsa.</li>
                <li>El empleado cometa una falta grave conforme a las políticas de la empresa.</li>
              </ul>
            </section>

            <section className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h2 className="text-lg font-bold text-[#1c2c4c] mb-2">Política de la Verificación Azul</h2>
              <p className="text-sm">
                La Verificación Azul de IVAD es una acreditación interna otorgada exclusivamente por Recursos Humanos. Su aprobación, rechazo, suspensión o revocación se realizará conforme a las políticas internas de la empresa y tiene como objetivo garantizar la autenticidad de la identidad de los empleados dentro de la plataforma.
              </p>
            </section>

          </div>
        </div>

        {/* Formulario de Solicitud */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-[#1c2c4c] mb-6 border-b pb-4">
            {isRejected ? "Volver a Enviar Solicitud" : "Formulario de Solicitud"}
          </h2>
          
          {isRejected && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-red-800 mb-2">Solicitud Rechazada</h3>
              <p className="text-red-700 text-sm">
                <strong>Motivo:</strong> {existingRequest.comment || "Tu solicitud no cumple con los requisitos necesarios."}
              </p>
              <p className="text-red-600 text-sm mt-2">
                Por favor, corrige el problema y vuelve a enviar tu solicitud.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block font-bold text-gray-700 mb-2">Documento de Identidad (Cédula o Pasaporte)</label>
              <p className="text-sm text-gray-500 mb-3">Sube una imagen clara y legible de tu documento de identidad para validar tus datos.</p>
              <input 
                type="file" 
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:border-[#1c2c4c]"
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 text-[#1c2c4c] rounded border-gray-300"
                  required
                />
                <span className="text-gray-700 font-medium">
                  Acepto que revisen mis datos para la verificación y confirmo haber leído y aceptado todas las políticas y condiciones mencionadas anteriormente.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={!accepted || !file || isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                accepted && file && !isSubmitting
                  ? 'bg-[#1c2c4c] text-white hover:bg-[#0f1b33] cursor-pointer' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
};

export default VerificationRequest;
