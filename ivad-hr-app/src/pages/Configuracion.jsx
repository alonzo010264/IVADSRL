import { useState } from 'react';
import { ArrowLeft, Bell, Moon, Lock, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Configuracion = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* Header */}
      <div className="bg-[#0b1c3c] text-white pt-12 pb-10 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Configuración</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-6 relative z-20 space-y-6">
        
        {/* Preferencias */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Preferencias</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 text-blue-500 p-2 rounded-lg">
                  <Bell size={20} />
                </div>
                <span className="font-semibold text-gray-800 text-sm">Notificaciones Push</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 text-gray-600 p-2 rounded-lg">
                  <Moon size={20} />
                </div>
                <span className="font-semibold text-gray-800 text-sm">Modo Oscuro</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b1c3c]"></div>
              </label>
            </div>

          </div>
        </div>

        {/* Seguridad */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Seguridad</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            
            <button className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                  <Lock size={20} />
                </div>
                <span className="font-semibold text-gray-800 text-sm">Cambiar Contraseña</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>

          </div>
        </div>

        {/* Info */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Acerca de</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            
            <button className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-gray-50 text-gray-500 p-2 rounded-lg">
                  <Info size={20} />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-gray-800 text-sm block">Versión de la App</span>
                  <span className="text-xs text-gray-400">v1.2.0 (Build 45)</span>
                </div>
              </div>
            </button>

          </div>
        </div>

        <button className="w-full py-4 text-red-500 font-bold text-sm bg-white rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50 transition-colors mt-8">
          Cerrar Sesión Global
        </button>

      </div>
    </div>
  );
};

export default Configuracion;
