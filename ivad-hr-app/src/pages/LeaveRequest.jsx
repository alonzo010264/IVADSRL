import React, { useState } from 'react';
import { ChevronLeft, Paperclip, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const LeaveRequest = () => {
  const navigate = useNavigate();
  const { currentUser, updateEmployee } = useEmployees();

  const [formData, setFormData] = useState({
    type: 'Personal',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    fileName: '',
    deductFromVacation: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const totalVacationDays = currentUser?.vacation_days ?? 14;
  const currentVacationTaken = currentUser?.vacation_taken ?? 0;
  const remainingVacationDays = Math.max(0, totalVacationDays - currentVacationTaken);

  // Calcular días de permiso
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const daysCount = calculateDays();
  const newVacationBalance = Math.max(0, remainingVacationDays - daysCount);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa el motivo o justificación de tu solicitud.' });
      return;
    }

    if (formData.deductFromVacation && daysCount > remainingVacationDays) {
      setMessage({ 
        type: 'error', 
        text: `No tienes suficientes días de vacaciones disponibles (${remainingVacationDays} días) para descontar este permiso (${daysCount} días).` 
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const newRequest = {
      employee_id: currentUser?.id || 'emp-demo',
      employee_name: currentUser?.name || 'Empleado IVAD',
      type: formData.deductFromVacation ? `${formData.type} (Descontado de Vacaciones)` : formData.type,
      start_date: formData.startDate,
      end_date: formData.endDate,
      total_days: daysCount,
      reason: formData.reason,
      attachment: formData.fileName || null,
      deduct_from_vacation: formData.deductFromVacation,
      status: 'Pendiente',
      created_at: new Date().toISOString()
    };

    // Guardar solicitud en Supabase
    await supabase.from('leave_requests').insert([newRequest]);

    // Si se activó la opción de descontar de vacaciones, actualizar en el contexto y Supabase
    if (formData.deductFromVacation && currentUser?.id) {
      const updatedTaken = currentVacationTaken + daysCount;
      await updateEmployee(currentUser.id, { vacation_taken: updatedTaken });
    }

    setMessage({ 
      type: 'success', 
      text: formData.deductFromVacation
        ? `¡Solicitud enviada! Se han reservado ${daysCount} ${daysCount === 1 ? 'día' : 'días'} a descontar de tus vacaciones (Balance posterior: ${newVacationBalance} días).`
        : '¡Tu solicitud de permiso ha sido registrada exitosamente!' 
    });
    
    setIsSubmitting(false);

    setTimeout(() => {
      navigate('/estatus-solicitudes');
    }, 2000);
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
            <h1 className="text-xl font-bold tracking-tight">Solicitud de Permiso</h1>
            <p className="text-xs text-[#d4af37] font-medium mt-0.5">Gestión de Ausencias IVAD</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Contenedor del Formulario Responsivo */}
      <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-20">
        
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6">
          
          {message.text && (
            <div className={`p-4 rounded-2xl font-medium text-sm flex items-center gap-2 border ${
              message.type === 'error' 
                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                : 'bg-blue-50 text-[#1c2c4c] border-blue-200'
            }`}>
              {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} className="text-[#d4af37]" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Tipo de Permiso */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Tipo de Permiso
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm font-bold text-[#1c2c4c]"
              >
                <option value="Personal">Permiso Personal</option>
                <option value="Médico">Licencia Médica / Salud</option>
                <option value="Vacaciones">Día a cuenta de Vacaciones</option>
                <option value="Maternidad/Paternidad">Licencia Maternidad / Paternidad</option>
                <option value="Luto">Licencia por Luto</option>
                <option value="Capacitación">Capacitación / Formación</option>
              </select>
            </div>

            {/* Selector de Fechas (Grid Responsivo) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Fecha de Inicio
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
                  Fecha de Fin
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

            {/* OPCIÓN: DESCONTAR DE DÍAS DE VACACIONES */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.deductFromVacation}
                  onChange={(e) => setFormData({ ...formData, deductFromVacation: e.target.checked })}
                  className="mt-1 w-5 h-5 text-[#1c2c4c] rounded focus:ring-[#1c2c4c] border-gray-300"
                />
                <div>
                  <span className="text-xs font-bold text-[#1c2c4c] block">Descontar de mis días de vacaciones disponibles</span>
                  <span className="text-[11px] text-gray-500 block">
                    Dispones actualmente de <strong>{remainingVacationDays} días</strong> de vacaciones devengados.
                  </span>
                </div>
              </label>

              {formData.deductFromVacation && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#1c2c4c] font-medium flex items-center justify-between">
                  <span>Días a descontar: <strong>{daysCount} {daysCount === 1 ? 'día' : 'días'}</strong></span>
                  <span>Nuevo balance restante: <strong>{newVacationBalance} días</strong></span>
                </div>
              )}
            </div>

            {/* Motivo de la Solicitud */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Motivo / Justificación
              </label>
              <textarea 
                rows={4}
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Escribe el motivo detallado de tu solicitud..."
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm text-gray-800 resize-none"
              />
            </div>

            {/* Adjuntar Comprobante */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Adjuntar Comprobante (Opcional)
              </label>
              <label className="w-full flex items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-colors text-center">
                <Paperclip size={18} className="text-[#d4af37]" />
                <span className="text-xs font-bold text-[#1c2c4c]">
                  {formData.fileName ? `Archivo: ${formData.fileName}` : 'Adjuntar comprobante o justificación (PDF/Imagen)'}
                </span>
                <input type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
              </label>
            </div>

            {/* Botón de Envío */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1c2c4c] hover:bg-opacity-95 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] border border-[#d4af37]/30 disabled:opacity-50"
              >
                <Send size={18} className="text-[#d4af37]" />
                <span>{isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
