import { FileText, UserCircle, MessageSquare, ChevronRight } from 'lucide-react';
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
      icon: <MessageSquare size={32} className="text-[#d4af37]" strokeWidth={1.5} />,
      label: 'Ir al Chat Corporativo / Soporte',
      path: '/chat'
    }
  ];

  return (
    <div className="bg-white min-h-screen flex justify-center font-sans">
      <div className="w-full max-w-3xl">
        
        {/* Header Azul IVAD */}
        <div className="bg-[#1c2c4c] text-white p-6 flex flex-col items-center justify-center relative">
          <h1 className="text-xl font-bold mt-2">Solicitudes Varias</h1>
          <p className="text-xs text-[#d4af37] mt-1 font-medium">Gestiones Administrativas & Documentos</p>
        </div>

        {/* Opciones */}
        <div className="p-4 space-y-4 mt-4">
          {options.map((opt) => (
            <Link 
              key={opt.id}
              to={opt.path}
              className="bg-[#1c2c4c] rounded-2xl p-5 flex items-center justify-between border border-[#d4af37]/60 shadow-md hover:bg-[#152240] transition-colors"
            >
              <div className="flex items-center gap-4">
                {opt.icon}
                <span className="text-white text-base font-semibold">{opt.label}</span>
              </div>
              <ChevronRight className="text-[#d4af37]" size={22} />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MiscRequests;
