import { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Incidencias = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* Header */}
      <div className="bg-[#0b1c3c] text-white pt-12 pb-10 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Reporte de Incidencias</h1>
        </div>
        <p className="text-sm text-white/80 font-light">
          Usa este formulario para reportar formalmente cualquier problema operativo, daño, o accidente.
        </p>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 relative z-20">
        
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#1c2c4c]/10 text-[#1c2c4c] border border-[#d4af37]/40 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-[#d4af37]" />
            </div>
            <h2 className="text-xl font-bold text-[#0b1c3c] mb-2">Reporte Enviado</h2>
            <p className="text-gray-500 text-sm mb-6">
              Tu reporte ha sido registrado exitosamente. Administración Central lo revisará pronto.
            </p>
            <button 
              onClick={() => navigate('/inicio')}
              className="w-full py-3.5 bg-[#0b1c3c] text-white rounded-xl font-bold hover:bg-[#0b1c3c]/90 transition"
            >
              Volver al Inicio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">Tipo de Incidencia</label>
              <select 
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-[#d4af37] focus:border-[#d4af37] block p-3.5 outline-none appearance-none"
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              >
                <option value="" disabled>Selecciona el tipo de problema</option>
                <option value="accidente">Accidente en tienda</option>
                <option value="sistema">Falla en sistema / POS</option>
                <option value="mercancia">Daño en mercancía</option>
                <option value="mantenimiento">Problema de mantenimiento</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">Descripción Detallada</label>
              <textarea 
                required
                rows="4"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-[#d4af37] focus:border-[#d4af37] block p-3.5 outline-none resize-none"
                placeholder="Describe qué pasó, cuándo y dónde..."
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">Evidencia Fotográfica (Opcional)</label>
              <div className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition cursor-pointer">
                <Upload size={28} className="mb-2" />
                <span className="text-xs font-medium">Toca para subir una foto</span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-4 bg-[#d4af37] hover:bg-[#c8985c] text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Enviar Reporte Oficial
            </button>
            
          </form>
        )}

      </div>
    </div>
  );
};

export default Incidencias;
