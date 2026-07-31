import { useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { UserPlus, Users, ChevronLeft, Mail, ShieldAlert, AlertTriangle, FileSpreadsheet, Lightbulb, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendCredentialsEmail } from '../utils/resendClient';

const AdminDashboard = () => {
  const { employees, addEmployee } = useEmployees();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    dept: '',
    email: '',
    phone: '',
    birthday: '',
    address: '',
    accessLevel: 'Empleado'
  });
  
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const generatedPassword = generateRandomPassword();
      const employeeData = { ...formData, password: generatedPassword };
      
      await addEmployee(employeeData);
      // Enviar correo de credenciales
      await sendCredentialsEmail(employeeData.name, employeeData.email, employeeData.password);
      
      setMessage(`¡Empleado ${employeeData.name} registrado y credenciales enviadas por correo!`);
      setFormData({ name: '', role: '', dept: '', email: '', phone: '', birthday: '', address: '', accessLevel: 'Empleado' });
    } catch (error) {
      console.error(error);
      setMessage(`Error: No se pudo completar el registro o el envío de correo.`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const adminActions = [
    {
      id: 'verificaciones',
      title: 'Verificaciones',
      desc: 'Aprobar o rechazar checks azules',
      icon: ShieldAlert,
      path: '/admin/verificaciones'
    },
    {
      id: 'agentes',
      title: 'Agentes',
      desc: 'Crear asesores para chat',
      icon: Users,
      path: '/admin/agentes'
    },
    {
      id: 'incidencias',
      title: 'Incidencias',
      desc: 'Ver reportes de problemas o daños',
      icon: AlertTriangle,
      path: '/admin/incidencias'
    },
    {
      id: 'permisos',
      title: 'Permisos',
      desc: 'Gestionar vacaciones y licencias',
      icon: FileSpreadsheet,
      path: '/admin/permisos'
    },
    {
      id: 'iniciativas',
      title: 'Iniciativas',
      desc: 'Ver propuestas de colaboradores',
      icon: Lightbulb,
      path: '/admin/iniciativas'
    },
    {
      id: 'politicas',
      title: 'Políticas',
      desc: 'Publicar normativas corporativas',
      icon: Scale,
      path: '/admin/politicas'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <div className="bg-[#1c2c4c] text-white pt-12 pb-6 px-4 rounded-b-[2rem] shadow-md relative">
        <div className="flex items-center">
          <button onClick={() => navigate('/inicio')} className="p-2 absolute left-4 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Panel de Administrador</h1>
            <p className="text-sm text-[#d4af37]">Gestión Central IVAD Connect</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        
        {/* Módulos de Administración IVAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {adminActions.map((action) => (
            <button 
              key={action.id}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-[#1c2c4c]/20 transition-all group cursor-pointer text-left"
            >
              <div className="w-12 h-12 bg-[#1c2c4c] text-[#d4af37] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                <action.icon size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[#1c2c4c] text-base leading-snug">{action.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Formulario de Nuevo Empleado */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-[#1c2c4c]/10 text-[#1c2c4c] rounded-full flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#1c2c4c]">Registrar Nuevo Empleado</h2>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-blue-50 text-[#1c2c4c] rounded-xl font-medium text-sm flex items-center gap-2 border border-blue-100">
               <ShieldAlert size={16} className="text-[#d4af37]" />
               {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="Ej. Juan Pérez" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico (Corporativo)</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="juan.perez@ivadsrl.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Acceso</label>
                <select name="accessLevel" value={formData.accessLevel} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none">
                  <option value="Empleado">Empleado Regular</option>
                  <option value="Gerencia">Gerencia</option>
                  <option value="Administrador">Administrador (RRHH / Finanzas)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Posición</label>
                <input required type="text" name="role" value={formData.role} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="Ej. Ejecutivo de Ventas" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <input required type="text" name="dept" value={formData.dept} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="Ej. Ventas" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Móvil</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" placeholder="Ej. +1 (809) 123-4567" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c2c4c] focus:outline-none" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-6">
              <button disabled={isSubmitting} type="submit" className="w-full bg-[#1c2c4c] text-white font-bold py-4 rounded-xl shadow-md hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                <UserPlus size={20} className="text-[#d4af37]" />
                {isSubmitting ? 'Registrando y enviando correo...' : 'Crear Empleado y Generar Credenciales'}
              </button>
            </div>
          </form>
        </div>

        {/* Resumen de Empleados */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1c2c4c]/10 rounded-full flex items-center justify-center">
                <Users className="text-[#1c2c4c]" size={20} />
              </div>
              <h2 className="text-lg font-bold text-[#1c2c4c]">Empleados Registrados</h2>
            </div>
            <span className="bg-[#1c2c4c] text-[#d4af37] text-xs font-bold px-3 py-1 rounded-full">{employees.length}</span>
          </div>
          
          <div className="space-y-3">
            {employees.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No hay empleados registrados aún.</p>
            ) : (
              employees.map(emp => (
                <div key={emp.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 shrink-0 bg-white flex items-center justify-center">
                    {emp.avatar ? (
                      <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover scale-[1.35]" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1c2c4c] text-sm truncate">{emp.name}</p>
                    <p className="text-xs text-[#d4af37] truncate">{emp.role}</p>
                  </div>
                  <div className="shrink-0 text-xs text-gray-500 flex items-center gap-1">
                     <Mail size={12} /> {emp.email}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
