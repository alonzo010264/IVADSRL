import React from 'react';
import { ChevronRight, FileCheck, ShieldCheck, LogOut, Clock, Calendar, FileText, Scale } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';

const RequestsApprovals = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useEmployees();

  const requestTypes = [
    { id: 'permisos', label: 'Solicitud de Permisos', desc: 'Permisos personales o de corta duración', icon: Calendar, path: '/solicitud-permiso' },
    { id: 'solicitudes_licencias', label: 'Solicitud de Licencias', desc: 'Licencias médicas, maternidad y especiales', icon: FileText, path: '/solicitud-licencia' },
    { id: 'aprobacion_permisos', label: 'Estatus de Mis Solicitudes', desc: 'Consultar aprobación de permisos y licencias', icon: Clock, path: '/estatus-solicitudes' },
    { id: 'varias', label: 'Solicitudes Varias', desc: 'Carta de trabajo, carnet o gestiones', icon: FileCheck, path: '/solicitudes-varias' },
    { id: 'politicas', label: 'Políticas & Reglas de IVAD', desc: 'Normativa interna y reglas del app', icon: Scale, path: '/politicas' },
  ];

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans text-gray-800 flex flex-col items-center">
      
      {/* Header Superior Azul IVAD */}
      <div className="w-full bg-[#1c2c4c] text-white pt-10 pb-16 px-4 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="max-w-xl mx-auto text-center relative">
          <h1 className="text-xl font-bold tracking-tight">Solicitudes & Gestión IVAD</h1>
          <p className="text-xs text-[#d4af37] font-medium mt-0.5">Centro de Servicios y Tramitaciones</p>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="w-full max-w-xl px-4 -mt-10 relative z-20 space-y-4">
        
        {/* Banner Informativo */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1c2c4c]">¿Qué trámite deseas realizar?</h2>
            <p className="text-xs text-gray-500 mt-0.5">Selecciona una de las opciones disponibles</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#1c2c4c] text-[#d4af37] flex items-center justify-center shadow-md shrink-0">
            <FileCheck size={24} />
          </div>
        </div>

        {/* Lista de Servicios */}
        <div className="space-y-3">
          {requestTypes.map((item) => {
            const IconComp = item.icon;
            return (
              <Link 
                key={item.id}
                to={item.path}
                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.99] group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 text-[#1c2c4c] flex items-center justify-center group-hover:bg-[#1c2c4c] group-hover:text-[#d4af37] transition-colors">
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1c2c4c] group-hover:text-[#1c2c4c]">{item.label}</h3>
                    <p className="text-[11px] text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-[#1c2c4c] transition-colors" size={20} />
              </Link>
            );
          })}
        </div>

        {/* Botón Solicitar Verificación Azul */}
        <div className="pt-2">
          <Link 
            to="/solicitar-verificacion"
            className="w-full bg-[#1c2c4c] text-white rounded-2xl p-4 flex justify-between items-center shadow-md hover:bg-opacity-95 transition-all border border-[#d4af37]/30"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} className="text-[#d4af37]" />
              <div>
                <span className="font-bold text-sm block">Solicitar Verificación Azul</span>
                <span className="text-[11px] text-gray-300 block">Obtén la insignia de perfil verificado en IVAD</span>
              </div>
            </div>
            <ChevronRight className="text-[#d4af37]" size={20} />
          </Link>
        </div>

        {/* Botón de Cerrar Sesión */}
        <div className="pt-2">
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full bg-red-50 text-red-600 rounded-2xl p-3.5 flex justify-center items-center gap-2 border border-red-100 hover:bg-red-100 transition-colors font-bold text-xs"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default RequestsApprovals;
