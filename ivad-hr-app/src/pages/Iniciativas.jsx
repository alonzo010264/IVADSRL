import { useState } from 'react';
import { ArrowLeft, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Iniciativas = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
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
          <h1 className="text-2xl font-bold">Proponer Iniciativa</h1>
        </div>
        <p className="text-sm text-white/80 font-light">
          ¿Tienes una idea para mejorar las ventas, un nuevo servicio o mejorar el ambiente en IVAD? ¡Cuéntanosla!
        </p>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 relative z-20">
        
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 text-[#0b1c3c] rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-[#0b1c3c] mb-2">¡Gracias por tu idea!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Tu propuesta ha sido enviada al equipo directivo. Nos encanta escuchar cómo podemos mejorar juntos.
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
            
            <div className="bg-blue-50 text-[#0b1c3c] p-4 rounded-xl flex gap-3 text-sm mb-2">
              <Lightbulb size={20} className="shrink-0 text-[#d4af37]" />
              <p>Las mejores iniciativas que se implementen pueden recibir un reconocimiento especial.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">Título de tu idea</label>
              <input 
                type="text"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-[#d4af37] focus:border-[#d4af37] block p-3.5 outline-none"
                placeholder="Ej: Nuevo servicio de envoltura de regalos"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">¿Cómo ayudaría esto a IVAD?</label>
              <textarea 
                required
                rows="5"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-[#d4af37] focus:border-[#d4af37] block p-3.5 outline-none resize-none"
                placeholder="Explica en detalle tu plan o servicio y qué beneficios traería a la tienda o al equipo..."
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full mt-4 bg-[#0b1c3c] hover:bg-[#0b1c3c]/90 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Enviar Propuesta
            </button>
            
          </form>
        )}

      </div>
    </div>
  );
};

export default Iniciativas;
