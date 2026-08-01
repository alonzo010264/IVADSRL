import { ChevronLeft, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { VerificationBadge } from '../components/VerificationBadge';

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { employees, currentUser } = useEmployees();
  
  // Buscar al empleado por ID
  const employee = employees.find(emp => emp.id === id);

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pb-24">
        <h2 className="text-xl font-bold text-gray-700">Empleado no encontrado</h2>
        <button onClick={() => navigate('/equipo')} className="mt-4 text-ivad-blue underline">Volver al equipo</button>
      </div>
    );
  }

  // Si es el usuario actual, redirigirlo a su perfil privado
  if (currentUser && currentUser.id === employee.id) {
    navigate('/datos-personales', { replace: true });
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-10">
      <div className="w-full max-w-3xl flex flex-col">
        
        {/* Portada y Header Fusionados */}
        <div className="mb-6">
          {/* Fondo curvo */}
          <div className="bg-[#1c2c4c] rounded-b-[2.5rem] shadow-sm h-36 relative z-10">
            <div className="text-white p-4 flex items-center">
              <button onClick={() => navigate(-1)} className="p-1 mr-2 z-10 hover:bg-white/10 rounded-full transition">
                <ChevronLeft size={24} />
              </button>
              <h2 className="font-bold text-lg flex-1 text-center z-10 pr-8">Perfil de {employee.name.split(' ')[0]}</h2>
            </div>
          </div>
          
          {/* Avatar y Textos en Flujo normal con margen negativo */}
          <div className="flex flex-col items-center w-full px-6 -mt-16 relative z-20">
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-md bg-white flex items-center justify-center">
                {employee.avatar ? (
                  <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover scale-[1.35]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-3xl font-bold text-gray-400">{employee.name.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap text-center w-full">
              <h1 className="text-2xl font-bold text-[#1c2c4c] leading-tight">{employee.name}</h1>
              <VerificationBadge emp={employee} size={22} className="shrink-0" />
            </div>
            <p className="text-[#d4af37] font-medium text-sm mt-1.5 text-center">{employee.role}</p>
            <p className="text-gray-500 text-xs mt-0.5 text-center">{employee.department}</p>
          </div>
        </div>

        {/* Tarjetas de Datos Públicos */}
        <div className="px-4 space-y-4">
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1c2c4c] mb-4 text-lg">Información de Contacto</h3>
            
            <div className="space-y-4">
              <a href={`mailto:${employee.email}`} className="flex items-center gap-4 border-b border-gray-50 pb-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#f8f9fc] group-hover:bg-[#1c2c4c] flex items-center justify-center shrink-0 transition-colors">
                  <Mail className="text-[#1c2c4c] group-hover:text-white transition-colors" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Correo Electrónico Corporativo</p>
                  <p className="text-[15px] font-semibold text-gray-800 truncate group-hover:text-[#d4af37] transition-colors">{employee.email}</p>
                </div>
              </a>

              {employee.phone && (
                <a href={`tel:${employee.phone}`} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[#f8f9fc] group-hover:bg-[#1c2c4c] flex items-center justify-center shrink-0 transition-colors">
                    <Phone className="text-[#1c2c4c] group-hover:text-white transition-colors" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Teléfono Móvil</p>
                    <p className="text-[15px] font-semibold text-gray-800 truncate group-hover:text-[#d4af37] transition-colors">{employee.phone}</p>
                  </div>
                </a>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
