import React, { useState } from 'react';
import { ChevronLeft, Calendar, Send, CheckCircle2, XCircle, AlertCircle, Clock, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const VacationRequest = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();

  // Fecha de ingreso del empleado (ej. 2023-11-15)
  const hireDateStr = currentUser?.hire_date || currentUser?.created_at || '2023-11-15';
  const hireDate = new Date(hireDateStr);
  const currentYear = new Date().getFullYear();
  
  // Próxima fecha programada de vacaciones (Aniversario anual)
  const scheduledDate = new Date(currentYear, hireDate.getMonth(), hireDate.getDate());
  if (scheduledDate < new Date()) {
    scheduledDate.setFullYear(currentYear + 1);
  }

  // Rango de fechas permitido: 15 días antes y 30 días después de la fecha programada
  const minAllowedDate = new Date(scheduledDate);
  minAllowedDate.setDate(minAllowedDate.getDate() - 15);

  const maxAllowedDate = new Date(scheduledDate);
  maxAllowedDate.setDate(maxAllowedDate.getDate() + 30);

  const formattedScheduledDate = scheduledDate.toLocaleDateString('es-DO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedMinDate = minAllowedDate.toLocaleDateString('es-DO', { day: 'numeric', month: 'short' });
  const formattedMaxDate = maxAllowedDate.toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' });

  const [formData, setFormData] = useState({
    startDate: scheduledDate.toISOString().split('T')[0],
    endDate: new Date(scheduledDate.getTime() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reason: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null); // { status: 'approved' | 'denied', message: '' }

  // Calcular cantidad de días de vacaciones solicitados
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 14;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const daysCount = calculateDays();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionResult(null);

    const reqStartDate = new Date(formData.startDate);

    // VERIFICACIÓN DE RANGO PROGRAMADO
    // Se verifica si la fecha de inicio cae dentro del ventana permitida
    const isWithinScheduledWindow = reqStartDate >= minAllowedDate && reqStartDate <= maxAllowedDate;

    if (!isWithinScheduledWindow) {
      // DENEGACIÓN AUTOMÁTICA
      setSubmissionResult({
        status: 'denied',
        message: `Solicitud Denegada Automáticamente por el Sistema: La fecha solicitada (${reqStartDate.toLocaleDateString('es-DO')}) no corresponde a tu período anual programado (${formattedScheduledDate}). Esta solicitud NO fue enviada a Recursos Humanos ni a tus supervisores.`
      });
      setIsSubmitting(false);
      return;
    }

    // SI ESTÁ DENTRO DE LAS FECHAS PROGRAMADAS -> ENVIAR A RRHH
    const newVacationReq = {
      employee_id: currentUser?.id || 'emp-demo',
      employee_name: currentUser?.name || 'Empleado IVAD',
      type: 'Vacaciones Anuales Programadas',
      start_date: formData.startDate,
      end_date: formData.endDate,
      total_days: daysCount,
      reason: formData.reason || 'Vacaciones correspondientes al período anual',
      status: 'Pendiente',
      created_at: new Date().toISOString()
    };

    await supabase.from('leave_requests').insert([newVacationReq]);

    setSubmissionResult({
      status: 'approved',
      message: `¡Solicitud Aprobada para Revisión! Tu solicitud de vacaciones por ${daysCount} días (del ${formData.startDate} al ${formData.endDate}) está dentro de tu período programado y ha sido enviada con éxito a Recursos Humanos y tu supervisor.`
    });

    setIsSubmitting(false);

    setTimeout(() => {
      navigate('/estatus-solicitudes');
    }, 2500);
  };

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans text-gray-800">
      
      {/* Header Superior Azul IVAD */}
      <div className="bg-[#1c2c4c] text-white pt-10 pb-16 px-4 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          
          <div className="text-center flex-1 mx-2">
            <h1 className="text-xl font-bold tracking-tight">Solicitar Mis Vacaciones</h1>
            <p className="text-xs text-[#d4af37] font-medium mt-0.5">Programación Anual de Vacaciones IVAD</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-20 space-y-5">
        
        {/* Banner Informativo de Fechas Programadas */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Tu Período Anual Programado</span>
              <h2 className="text-base font-bold text-[#1c2c4c]">{formattedScheduledDate}</h2>
            </div>
            <span className="bg-[#1c2c4c] text-[#d4af37] text-xs font-bold px-3 py-1 rounded-full border border-[#d4af37]/30">
              Ventana Autorizada
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Las solicitudes de vacaciones solo son procesadas por el sistema si la fecha de inicio se encuentra dentro de la ventana programada (<strong>{formattedMinDate} - {formattedMaxDate}</strong>). Solicitudes fuera de este rango serán denegadas automáticamente sin notificar a los supervisores.
          </p>
        </div>

        {/* Notificación de Resultado */}
        {submissionResult && (
          <div className={`p-5 rounded-3xl shadow-lg border space-y-2 ${
            submissionResult.status === 'denied'
              ? 'bg-red-50 text-red-900 border-red-200'
              : 'bg-blue-50 text-[#1c2c4c] border-blue-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {submissionResult.status === 'denied' ? (
                <>
                  <XCircle size={20} className="text-red-600 shrink-0" />
                  <span>Denegación Automática por el Sistema</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} className="text-[#d4af37] shrink-0" />
                  <span>Solicitud Enviada a Recursos Humanos</span>
                </>
              )}
            </div>
            <p className="text-xs font-medium leading-relaxed pl-7">
              {submissionResult.message}
            </p>
          </div>
        )}

        {/* Formulario de Solicitud */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-5">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Fechas de Vacaciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Fecha Inicio de Vacaciones
                </label>
                <input 
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Fecha Reincorporación (Fin)
                </label>
                <input 
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm font-bold text-gray-800"
                />
              </div>
            </div>

            {/* Días Calculados */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Duración total de vacaciones:</span>
              <span className="bg-[#1c2c4c] text-[#d4af37] font-bold text-xs px-3 py-1 rounded-full border border-[#d4af37]/40">
                {daysCount} {daysCount === 1 ? 'Día' : 'Días'}
              </span>
            </div>

            {/* Observaciones Opcionales */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Observaciones o Comentarios (Opcional)
              </label>
              <textarea 
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Escribe algún detalle o nota adicional..."
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm text-gray-800 resize-none"
              />
            </div>

            {/* Botón de Envío con Verificación */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1c2c4c] hover:bg-opacity-95 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] border border-[#d4af37]/30 disabled:opacity-50"
              >
                <Send size={18} className="text-[#d4af37]" />
                <span>{isSubmitting ? 'Verificando con el Sistema...' : 'Enviar Solicitud de Vacaciones'}</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default VacationRequest;
