import { FileText, UserCircle, HelpCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MiscRequests = () => {
  const options = [
    {
      id: 'certificado',
      icon: <FileText size={32} className="text-[#d4af37]" strokeWidth={1.5} />,
      label: 'Certificado Laboral',
      path: '/certificado'
    },
    {
      id: 'datos',
      icon: <UserCircle size={32} className="text-[#d4af37]" strokeWidth={1.5} />,
      label: 'Cambio de Datos Personales',
      path: '/datos-personales'
    },
    {
      id: 'otros',
      icon: <HelpCircle size={32} className="text-[#d4af37]" strokeWidth={1.5} />,
      label: 'Otros / Chat con RR.HH.',
      path: '/chat-rrhh'
    }
  ];

  return (
    <div className="bg-white min-h-screen flex justify-center">
      <div className="w-full max-w-3xl">
        
        {/* Header Azul */}
        <div className="bg-[#1c2c4c] text-white p-6 flex flex-col items-center justify-center relative">
          <h1 className="text-xl font-bold mt-2">Solicitudes Varias</h1>
        </div>

        {/* Opciones */}
        <div className="p-4 space-y-4 mt-4">
          {options.map((opt) => (
            <Link 
              key={opt.id}
              to={opt.path}
              className="bg-[#1c2c4c] rounded-xl p-6 flex items-center justify-between border-2 border-[#d4af37]/80 shadow-md hover:bg-[#152240] transition-colors"
            >
              <div className="flex items-center gap-4">
                {opt.icon}
                <span className="text-white text-lg font-medium">{opt.label}</span>
              </div>
              <ChevronRight className="text-white" size={24} />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MiscRequests;
