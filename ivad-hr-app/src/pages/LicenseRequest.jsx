import React, { useState } from 'react';
import { ChevronLeft, FileCheck2, Paperclip, Send, CheckCircle2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const LicenseRequest = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();

  const [formData, setFormData] = useState({
    licenseType: 'Licencia Médica',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    doctorName: '',
    institution: '',
    reason: '',
    fileName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Calcular días de licencia
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
      setMessage({ type: 'error', text: 'Por favor detalla el diagnóstico o motivo oficial de la licencia.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const totalDays = calculateDays();
    const newLicense = {
      employee_id: currentUser?.id || 'emp-demo',
      employee_name: currentUser?.name || 'Empleado IVAD',
      type: `Licencia: ${formData.licenseType}`,
      start_date: formData.startDate,
      end_date: formData.endDate,
      total_days: totalDays,
      reason: `[${formData.licenseType}] Doctor: ${formData.doctorName || 'N/A'} (${formData.institution || 'Clínica/Hospital'}). Motivo: ${formData.reason}`,
      attachment: formData.fileName || null,
      status: 'Pendiente',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('leave_requests')
      .insert([newLicense])
      .select();

    if (error) {
      console.error('Error al guardar licencia:', error);
    }

    setMessage({ type: 'success', text: '¡Tu solicitud de licencia médica/especial ha sido enviada exitosamente!' });
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
            <h1 className="text-xl font-bold tracking-tight">Solicitud de Licencias Médicas & Especiales</h1>
            <p className="text-xs text-[#d4af37] font-medium mt-0.5">Comprobación de Incapacidad y Reposo Oficial</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
            <FileCheck2 size={20} />
          </div>
        </div>
      </div>

      {/* Formulario Responsivo */}
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
            
            {/* Categoría de Licencia */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Tipo de Licencia Oficial
              </label>
              <select
                value={formData.licenseType}
                onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm font-bold text-[#1c2c4c]"
              >
                <option value="Licencia Médica">Licencia Médica por Incapacidad Temporal</option>
                <option value="Maternidad">Licencia de Maternidad (Pre y Post Natal)</option>
                <option value="Paternidad">Licencia de Paternidad</option>
                <option value="Accidente de Trabajo">Licencia por Accidente Laboral</option>
                <option value="Duelo o Luto">Licencia por Duelo / Fallecimiento Familiar</option>
                <option value="Matrimonio">Licencia por Matrimonio</option>
              </select>
            </div>

            {/* Datos Médicos (Grid Responsivo 2 columnas en PC) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Médico / Especialista (Opcional)
                </label>
                <input 
                  type="text"
                  placeholder="Ej. Dr. Roberto Gómez"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Centro Médico / Clínica (Opcional)
                </label>
                <input 
                  type="text"
                  placeholder="Ej. Centro Médico Abel González"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm font-medium"
                />
              </div>
            </div>

            {/* Fechas de Incapacidad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Fecha Inicio de Licencia
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

            {/* Total de Días de Licencia Calculados */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                <Clock size={16} className="text-[#d4af37]" />
                <span>Días de Licencia médica/especial:</span>
              </div>
              <span className="bg-[#1c2c4c] text-[#d4af37] font-bold text-xs px-3 py-1 rounded-full border border-[#d4af37]/40">
                {daysCount} {daysCount === 1 ? 'Día de Licencia' : 'Días de Licencia'}
              </span>
            </div>

            {/* Detalle o Diagnóstico */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Diagnóstico / Motivo de la Licencia
              </label>
              <textarea 
                rows={4}
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Escribe la descripción dada por el médico o el motivo oficial..."
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none text-sm text-gray-800 resize-none"
              />
            </div>

            {/* Adjuntar Certificado Médico Obligatorio/Recomendado */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Adjuntar Certificado o Constancia Médica
              </label>
              <label className="w-full flex items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-colors text-center">
                <Paperclip size={18} className="text-[#d4af37]" />
                <span className="text-xs font-bold text-[#1c2c4c]">
                  {formData.fileName ? `Certificado: ${formData.fileName}` : 'Adjuntar Certificado Médico oficial (PDF / Imagen)'}
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
                <span>{isSubmitting ? 'Enviando Licencia...' : 'Registrar Solicitud de Licencia'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LicenseRequest;
