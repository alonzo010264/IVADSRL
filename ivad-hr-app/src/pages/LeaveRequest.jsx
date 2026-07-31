import React, { useState } from 'react';
import { ChevronLeft, Calendar, FileText, Paperclip, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const LeaveRequest = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();

  const [formData, setFormData] = useState({
    type: 'Personal',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    fileName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Calcular cantidad de días hábiles/solicitados
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

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

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const totalDays = calculateDays();
    const newRequest = {
      employee_id: currentUser?.id || 'emp-demo',
      employee_name: currentUser?.name || 'Empleado IVAD',
      type: formData.type,
      start_date: formData.startDate,
      end_date: formData.endDate,
      total_days: totalDays,
      reason: formData.reason,
      attachment: formData.fileName || null,
      status: 'Pendiente',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('leave_requests')
      .insert([newRequest])
      .select();

    if (error) {
      console.error('Error enviando solicitud:', error);
    }

    setMessage({ type: 'success', text: '¡Tu solicitud de permiso ha sido registrada exitosamente!' });
    setIsSubmitting(false);

    setTimeout(() => {
      navigate('/estatus-solicitudes');
    }, 1800);
  };

  const daysCount = calculateDays();

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
            <h1 className="text-xl font-bold tracking-tight">Solicitud de Permiso / Licencia</h1>
            <p className="text-xs text-[#d4af37] font-medium mt-0.5">Gestión de Ausencias & Vacaciones IVAD</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
            <Calendar size={20} />
          </div>
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
                Tipo de Permiso / Licencia
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm font-bold text-[#1c2c4c]"
              >
                <option value="Personal">Permiso Personal</option>
                <option value="Médico">Licencia Médica / Salud</option>
                <option value="Vacaciones">Período de Vacaciones</option>
                <option value="Maternidad/Paternidad">Licencia de Maternidad / Paternidad</option>
                <option value="Luto">Duelo / Licencia por Luto</option>
                <option value="Capacitación">Capacitación / Formación Profesional</option>
              </select>
            </div>

            {/* Selector de Fechas (Grid Responsivo: 1 col celular, 2 cols tablet/PC) */}
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

            {/* Resumen de Días Calculados */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                <Clock size={16} className="text-[#d4af37]" />
                <span>Duración total calculada:</span>
              </div>
              <span className="bg-[#1c2c4c] text-[#d4af37] font-bold text-xs px-3 py-1 rounded-full border border-[#d4af37]/40">
                {daysCount} {daysCount === 1 ? 'Día' : 'Días'}
              </span>
            </div>

            {/* Motivo de la Solicitud */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Motivo / Justificación Detallada
              </label>
              <textarea 
                rows={4}
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Escribe el motivo detallado de tu solicitud para la evaluación de Recursos Humanos..."
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm text-gray-800 resize-none"
              />
            </div>

            {/* Adjuntar Documento o Certificado */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Adjuntar Comprobante (Opcional)
              </label>
              <label className="w-full flex items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-colors text-center">
                <Paperclip size={18} className="text-[#d4af37]" />
                <span className="text-xs font-bold text-[#1c2c4c]">
                  {formData.fileName ? `Archivo: ${formData.fileName}` : 'Adjuntar certificado médico o constancia (PDF/JPG)'}
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
                <span>{isSubmitting ? 'Enviando Solicitud...' : 'Enviar Solicitud a Revisión'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
