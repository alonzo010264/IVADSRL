import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, MessageCircle, Users, MoreHorizontal, Bell, ArrowLeft, Shield } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'inicio', icon: Home, label: 'Inicio', path: '/inicio' },
    { id: 'calendario', icon: Calendar, label: 'Calendario', path: '/calendario' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', path: '/chat', special: true },
    { id: 'equipo', icon: Users, label: 'Equipo', path: '/equipo' },
    { id: 'mas', icon: MoreHorizontal, label: 'Más', path: '/mas' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-center md:justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center w-full max-w-5xl">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center justify-center w-16 h-14 ${
            item.special ? '-mt-6' : ''
          }`}
        >
          {item.special ? (
            <div className="bg-[#1c2c4c] text-white rounded-full p-2.5 shadow-lg mb-1 border-2 border-white">
              <item.icon size={26} strokeWidth={2.2} />
            </div>
          ) : (
            <item.icon 
              size={24} 
              className={`mb-1 ${location.pathname === item.path ? 'text-[#1c2c4c]' : 'text-gray-400'}`} 
            />
          )}
          <span className={`text-[10px] ${location.pathname === item.path ? 'text-[#1c2c4c] font-bold' : 'text-gray-500'}`}>
            {item.label}
          </span>
        </button>
      ))}
      </div>
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const isDashboard = location.pathname === '/inicio';

  return (
    <header className="bg-ivad-blue text-white p-4 sticky top-0 z-40 flex items-center justify-between">
      <div className="flex items-center">
        {!isDashboard && (
          <button onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft size={24} />
          </button>
        )}
        <div className="flex flex-col">
          <span className="text-xl font-light tracking-widest leading-none">IVAD</span>
          <span className="text-[10px] tracking-wide text-gray-300">Home & Goods</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {currentUser?.is_admin && (
          <button onClick={() => navigate('/admin')} className="text-ivad-gold hover:text-white transition-colors" title="Panel de Administrador">
            <Shield size={22} />
          </button>
        )}
        {isDashboard && (
          <button className="relative" onClick={() => navigate('/notificaciones')}>
            <Bell size={24} />
            <span className="absolute -top-1.5 -right-1.5 bg-[#d4af37] text-[#1c2c4c] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        )}
      </div>
    </header>
  );
};

const Layout = () => {
  const location = useLocation();
  const noHeaderRoutes = ['/inicio', '/', '/chat', '/radio', '/incidencias', '/iniciativas', '/faq', '/configuracion'];
  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {showHeader && <Header />}
      
      {/* Contenido principal con padding bottom para no tapar el menú */}
      <main className="flex-1 overflow-y-auto pb-24 bg-gray-50 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;
