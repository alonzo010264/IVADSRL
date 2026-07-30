import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: '¿Cómo solicito mis vacaciones?',
      answer: 'Para solicitar vacaciones, ve a la sección "Calendario" o al menú rápido en Inicio y selecciona "Planeado". Llena el formulario con tus fechas y envíalo para aprobación de tu gerente.'
    },
    {
      question: '¿Cuándo se paga la nómina?',
      answer: 'La nómina se paga los días 15 y último de cada mes. Puedes ver tus volantes de pago en la sección de "Nómina" una vez que hayan sido procesados.'
    },
    {
      question: '¿Qué hago si olvidé marcar mi asistencia?',
      answer: 'Debes comunicarte inmediatamente con Administración Central a través del "Chat Interno" o enviar un "Reporte de Incidencias" explicando el motivo para que lo ajusten manualmente.'
    },
    {
      question: '¿Cómo obtengo la verificación azul (Insignia)?',
      answer: 'Ve a tu Perfil ("Mi Perfil" > "Mis Datos Personales") y busca la opción de "Solicitar Verificación". Sube tu documento de identidad para que Recursos Humanos lo valide.'
    },
    {
      question: '¿Qué significan los colores de las insignias?',
      answer: 'La insignia Azul significa que el perfil del empleado ha sido verificado con su documento oficial. La insignia Dorada es exclusiva para Administración Central y Gerencia de IVAD.'
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* Header */}
      <div className="bg-[#0b1c3c] text-white pt-12 pb-10 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Preguntas Frecuentes</h1>
        </div>
        <p className="text-sm text-white/80 font-light">
          Encuentra respuestas rápidas a las dudas más comunes sobre el uso de la aplicación y políticas.
        </p>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 relative z-20">
        
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 last:border-0">
              <button
                className="w-full text-left p-5 flex items-center justify-between focus:outline-none transition-colors hover:bg-gray-50"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-bold text-gray-800 text-sm pr-4">{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-[#d4af37] shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 pt-0 text-sm text-gray-500 leading-relaxed bg-gray-50/50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FAQ;
