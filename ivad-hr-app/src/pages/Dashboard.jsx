import { useState, useEffect } from 'react';
import { User, Users, Calendar, ClipboardList, DollarSign, Megaphone, ArrowRight, Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../utils/supabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, employees } = useEmployees();
  const [announcements, setAnnouncements] = useState([]);
  
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) {
        setAnnouncements(data);
      }
    };
    
    fetchAnnouncements();
  }, []);
  
  const quickActions = [
    { id: 'perfil', icon: User, label: 'Mi Perfil', path: '/datos-personales' },
    { id: 'equipo', icon: Users, label: 'Equipo', path: '/equipo' },
    { id: 'asistencia', icon: Calendar, label: 'Asistencia', path: '/asistencia' },
    { id: 'tareas', icon: ClipboardList, label: 'Tareas', path: '/tareas' },
    { id: 'nomina', icon: DollarSign, label: 'Nómina', path: '/nomina' },
  ];

  if (currentUser?.is_admin || currentUser?.isAdmin) {
    quickActions.push({ id: 'admin-nomina', icon: DollarSign, label: 'Gestionar Nómina', path: '/admin/nomina' });
    quickActions.push({ id: 'crear-anuncio', icon: Megaphone, label: 'Crear Anuncio', path: '/crear-anuncio' });
  }

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Equipo';

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      
      {/* HEADER AZUL OSCURO */}
      <div className="bg-[#0b1c3c] text-white pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        
        {/* Top Nav (Menu, Logo, Bell) */}
        <div className="flex justify-between items-center mb-10">
          <button className="text-white hover:opacity-80 transition">
            <Menu size={28} strokeWidth={2} />
          </button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl font-light tracking-widest uppercase" style={{ fontFamily: 'sans-serif' }}>
              IVAD<sup className="text-[10px] ml-0.5">®</sup>
            </h1>
            <p className="text-[10px] text-gray-300 font-light tracking-widest mt-0.5">Home & Goods</p>
          </div>
          
          <button className="text-white hover:opacity-80 transition relative">
            <Bell size={28} strokeWidth={2} />
            <span className="absolute -top-1 -right-1 bg-[#d4af37] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0b1c3c]">
              3
            </span>
          </button>
        </div>

        {/* Greeting & Avatar */}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-1">¡Hola, {firstName}!</h2>
            <p className="text-lg text-white/90 font-medium mb-1">Bienvenida a IVAD</p>
            <p className="text-sm text-white/70">Aquí tienes un resumen de lo que sucede hoy.</p>
          </div>
          
          <div className="ml-4 shrink-0">
            {/* Instagram Style Avatar from Mockup */}
            <div className="w-20 h-20 rounded-full border-[2px] border-[#d4af37] bg-[#0b1c3c] p-[3px]">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover scale-[1.35]" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User size={32} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-14 relative z-20">
        
        {/* QUICK ACTIONS CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-lg mb-8 border border-gray-100">
          <div className="flex justify-start gap-4 overflow-x-auto no-scrollbar pb-2">
            {quickActions.map((action) => (
              <div key={action.id} className="flex flex-col items-center min-w-[72px] cursor-pointer" onClick={() => action.path && navigate(action.path)}>
                <div className={`rounded-full w-14 h-14 flex items-center justify-center mb-2 shadow-sm transition-colors ${action.id === 'crear-anuncio' ? 'bg-[#d4af37] text-white' : 'bg-[#0b1c3c] text-white'}`}>
                  <action.icon size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xs text-gray-700 font-medium whitespace-nowrap text-center">{action.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RESUMEN DEL DÍA */}
        <h2 className="text-xl font-bold text-[#0b1c3c] mb-4">Resumen del día</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          
          {/* Card 1: Empleados */}
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-[#0b1c3c] rounded-full w-14 h-14 shrink-0 flex items-center justify-center text-white shadow-sm">
                <Users size={28} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#0b1c3c] leading-none">{employees.length}</h3>
                <p className="text-gray-500 text-sm leading-tight mt-1">Empleados<br/>activos</p>
              </div>
            </div>
            
            <div 
              className="flex items-center justify-between border-t border-gray-100 pt-3 cursor-pointer"
              onClick={() => navigate('/equipo')}
            >
              <span className="text-gray-600 text-xs font-medium">Ver equipo</span>
              <ArrowRight size={16} className="text-[#0b1c3c]" />
            </div>
          </div>

          {/* Card 2: Asistencias */}
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-[#c8985c] rounded-full w-14 h-14 shrink-0 flex items-center justify-center text-white shadow-sm">
                <Calendar size={28} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#0b1c3c] leading-none">18</h3>
                <p className="text-gray-500 text-sm leading-tight mt-1">Asistencias<br/>registradas</p>
              </div>
            </div>
            
            <div 
              className="flex items-center justify-between border-t border-gray-100 pt-3 cursor-pointer"
              onClick={() => navigate('/asistencia')}
            >
              <span className="text-gray-600 text-xs font-medium">Ver asistencia</span>
              <ArrowRight size={16} className="text-[#0b1c3c]" />
            </div>
          </div>

          {/* Card 3: Tareas */}
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-[#0b1c3c] rounded-full w-14 h-14 shrink-0 flex items-center justify-center text-white shadow-sm">
                <ClipboardList size={28} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#0b1c3c] leading-none">5</h3>
                <p className="text-gray-500 text-sm leading-tight mt-1">Tareas<br/>pendientes</p>
              </div>
            </div>
            
            <div 
              className="flex items-center justify-between border-t border-gray-100 pt-3 cursor-pointer"
              onClick={() => navigate('/tareas')}
            >
              <span className="text-gray-600 text-xs font-medium">Ver tareas</span>
              <ArrowRight size={16} className="text-[#0b1c3c]" />
            </div>
          </div>

          {/* Card 4: Solicitudes */}
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-[#c8985c] rounded-full w-14 h-14 shrink-0 flex items-center justify-center text-white shadow-sm">
                <DollarSign size={28} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#0b1c3c] leading-none">2</h3>
                <p className="text-gray-500 text-sm leading-tight mt-1">Solicitudes<br/>pendientes</p>
              </div>
            </div>
            
            <div 
              className="flex items-center justify-between border-t border-gray-100 pt-3 cursor-pointer"
              onClick={() => navigate('/nomina')}
            >
              <span className="text-gray-600 text-xs font-medium">Ver solicitudes</span>
              <ArrowRight size={16} className="text-[#0b1c3c]" />
            </div>
          </div>

        </div>

        {/* ANUNCIOS */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0b1c3c]">Anuncios</h2>
          <span className="text-sm font-medium text-[#0b1c3c] underline cursor-pointer hover:text-opacity-80">Ver todos</span>
        </div>
        
        {announcements.length === 0 ? (
          <div className="bg-[#0b1c3c] rounded-3xl p-6 text-white flex gap-4 shadow-md items-center justify-center">
            <p className="text-white/80">No hay anuncios recientes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-[#0b1c3c] rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex gap-4 items-start">
                {/* Decoration background icon */}
                <div className="absolute top-2 right-2 p-2 opacity-5">
                  <Megaphone size={120} />
                </div>
                
                <div className="bg-white/10 rounded-full p-3 shrink-0 relative z-10 border border-white/20">
                  <Megaphone size={24} className="text-white" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#c8985c]"></div>
                    <h4 className="font-bold text-lg leading-tight">{announcement.title}</h4>
                  </div>
                  <p className="text-white/80 text-sm leading-snug whitespace-pre-wrap mt-2">
                    {announcement.content}
                  </p>
                  <div className="mt-3 text-xs text-white/50">
                    Publicado el: {new Date(announcement.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
