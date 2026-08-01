import { ChevronLeft, Camera, User, Mail, Phone, Calendar, MapPin, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { useRef, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { VerificationBadge } from '../components/VerificationBadge';

const PersonalData = () => {
  const navigate = useNavigate();
  const { currentUser, updateEmployee } = useEmployees();
  const fileInputRef = useRef(null);
  
  const userData = currentUser || {
    name: 'Cargando...',
    role: '',
    email: '',
    phone: '',
    birthday: '',
    address: '',
    avatar: null,
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && currentUser) {
      setIsUploading(true);
      // 1. Crear nombre de archivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      try {
        // 2. Subir imagen al Bucket
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 3. Obtener la URL pública
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // 4. Actualizar el empleado en la base de datos con la URL
        await updateEmployee(currentUser.id, { avatar: publicUrlData.publicUrl });
        alert('Foto actualizada correctamente.');
      } catch (error) {
        console.error("Error subiendo imagen:", error);
        alert('Hubo un error al subir la foto. Asegúrate de que el sistema de almacenamiento esté configurado.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-10">
      <div className="w-full max-w-3xl flex flex-col">
        
        {/* Portada y Header Fusionados */}
        <div className="relative mb-32">
          {/* Fondo curvo */}
          <div className="bg-[#1c2c4c] rounded-b-[2.5rem] shadow-sm h-36">
            {/* Header Específico */}
            <div className="text-white p-4 flex items-center">
              <button onClick={() => navigate(-1)} className="p-1 mr-2 z-10">
                <ChevronLeft size={24} />
              </button>
              <h2 className="font-bold text-lg flex-1 text-center z-10">Datos Personales</h2>
              <button className="text-[#d4af37] p-1 z-10">
                <Edit2 size={20} />
              </button>
            </div>
          </div>
          
          {/* Avatar y Textos flotantes */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center w-full">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white relative z-20 flex items-center justify-center">
                {userData.avatar ? (
                  <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover scale-[1.35]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-1 right-1 bg-[#d4af37] text-white p-2 rounded-full shadow-md hover:bg-[#b0902c] transition-colors z-30 disabled:opacity-50"
              >
                {isUploading ? <span className="w-4 h-4 block animate-spin rounded-full border-2 border-white border-t-transparent"></span> : <Camera size={18} />}
              </button>
            </div>
            
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <h1 className="text-2xl font-bold text-[#1c2c4c]">{userData.name}</h1>
              <VerificationBadge emp={userData} size={22} />
            </div>
            <p className="text-[#d4af37] font-medium text-sm">{userData.role}</p>
          </div>
        </div>

        {/* Tarjetas de Datos */}
        <div className="px-4 space-y-4">
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1c2c4c] mb-4 text-lg">Información de Contacto</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                <div className="w-10 h-10 rounded-full bg-[#f8f9fc] flex items-center justify-center shrink-0">
                  <Mail className="text-[#1c2c4c]" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Correo Electrónico (Corporativo)</p>
                  <p className="text-[15px] font-semibold text-gray-800 truncate">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                <div className="w-10 h-10 rounded-full bg-[#f8f9fc] flex items-center justify-center shrink-0">
                  <Phone className="text-[#1c2c4c]" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Teléfono Móvil</p>
                  <p className="text-[15px] font-semibold text-gray-800 truncate">{userData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f8f9fc] flex items-center justify-center shrink-0">
                  <MapPin className="text-[#1c2c4c]" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Dirección Física</p>
                  <p className="text-[15px] font-semibold text-gray-800 leading-tight">{userData.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1c2c4c] mb-4 text-lg">Información Personal</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                <div className="w-10 h-10 rounded-full bg-[#f8f9fc] flex items-center justify-center shrink-0">
                  <User className="text-[#1c2c4c]" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Nombre de Usuario (Sistema)</p>
                  <p className="text-[15px] font-semibold text-gray-800 truncate">
                    {userData.name ? userData.name.toLowerCase().replace(/\s+/g, '_') : 'cargando'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f8f9fc] flex items-center justify-center shrink-0">
                  <Calendar className="text-[#1c2c4c]" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Fecha de Nacimiento</p>
                  <p className="text-[15px] font-semibold text-gray-800 truncate">{userData.birthday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de solicitud de cambios si no están editando */}
          <button className="w-full bg-[#f8f9fc] text-[#1c2c4c] border border-gray-200 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors mt-6 shadow-sm">
            Solicitar actualización de datos
          </button>

        </div>
      </div>
    </div>
  );
};

export default PersonalData;
