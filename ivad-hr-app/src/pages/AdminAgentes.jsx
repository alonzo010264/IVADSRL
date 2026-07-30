import { useState } from 'react';
import { ArrowLeft, UserPlus, Users, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminAgentes = () => {
  const navigate = useNavigate();
  
  // Agentes mockeados por ahora
  const [agentes, setAgentes] = useState([
    { id: 1, name: 'Soporte Luis', email: 'luis.soporte@ivadsrl.com' },
    { id: 2, name: 'Asesor 1', email: 'asesor1@ivadsrl.com' }
  ]);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleCreateAgent = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;
    
    // Aquí iría la lógica para crear el usuario en Supabase con role="agent"
    const newAgent = {
      id: Date.now(),
      name: formData.name,
      email: formData.email
    };
    
    setAgentes([...agentes, newAgent]);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleDelete = (id) => {
    // Lógica para borrar agente
    setAgentes(agentes.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* Header */}
      <div className="bg-[#0b1c3c] text-white pt-12 pb-10 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Gestión de Agentes</h1>
        </div>
        <p className="text-sm text-white/80 font-light">
          Crea perfiles para el equipo de soporte de IVAD Connect.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-4 relative z-20 flex flex-col md:flex-row gap-6">
        
        {/* Formulario de Creación */}
        <div className="flex-1">
          <form onSubmit={handleCreateAgent} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-[#0b1c3c] flex items-center gap-2 mb-2">
              <UserPlus size={20} className="text-[#d4af37]" />
              Crear Nuevo Agente
            </h2>
            
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Nombre Oficial (Fijo)</label>
              <input 
                type="text"
                placeholder="Ej: Soporte Carlos"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-[#d4af37] focus:border-[#d4af37] block p-3 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Correo (Para Login)</label>
              <input 
                type="email"
                placeholder="ejemplo@ivadsrl.com"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-[#d4af37] focus:border-[#d4af37] block p-3 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Contraseña</label>
              <input 
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-[#d4af37] focus:border-[#d4af37] block p-3 outline-none"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-2 bg-[#d4af37] hover:bg-[#c8985c] text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Registrar Agente
            </button>
          </form>
        </div>

        {/* Lista de Agentes */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-[#0b1c3c] flex items-center gap-2 mb-4">
              <Users size={20} className="text-blue-500" />
              Agentes Activos
            </h2>
            
            <div className="space-y-3">
              {agentes.map(agente => (
                <div key={agente.id} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-gray-50">
                  <div>
                    <p className="font-bold text-sm text-gray-800">{agente.name}</p>
                    <p className="text-xs text-gray-500">{agente.email}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(agente.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              {agentes.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No hay agentes registrados.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAgentes;
