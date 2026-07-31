import React from 'react';
import { ChevronRight, FileCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';

const RequestsApprovals = () => {
  const navigate = useNavigate();
  const { logout } = useEmployees();

  const requestTypes = [
    { id: 'mis_vacaciones', label: 'Mis Vacaciones & Programación', path: '/vacaciones' },
    { id: 'varias', label: 'Solicitudes Varias', path: '/solicitudes-varias' },
    { id: 'permisos', label: 'Solicitudes Permisos', path: '/solicitud-permiso' },
    { id: 'aprobacion_permisos', label: 'Aprobación Permisos', path: '/estatus-solicitudes' },
    { id: 'solicitudes_licencias', label: 'Solicitudes Licencias', path: '/solicitud-licencia' },
    { id: 'politicas', label: 'Políticas de la Empresa', path: '/politicas-empresa' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-24 font-sans">
      <div className="p-4 w-full max-w-3xl">
        
        {/* Banner principal */}
        <div className="bg-[#1c2c4c] text-white rounded-2xl p-8 mb-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
          <h1 className="text-2xl font-bold mb-6 relative z-10">Solicitudes y Aprobaciones</h1>
          <div className="bg-white/10 p-4 rounded-2xl relative z-10">
            <FileCheck size={64} className="text-[#d4af37]" strokeWidth={1.5} />
          </div>
          {/* Círculo decorativo */}
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Título de sección */}
        <h2 className="text-xl font-bold text-[#1c2c4c] mb-4 px-1">Tipos de solicitud</h2>

        {/* Lista de solicitudes (Estilo limpio original sin iconos innecesarios) */}
        <div className="space-y-3">
          {requestTypes.map((item) => (
            <Link 
              key={item.id}
              to={item.path}
              className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <span className="text-gray-800 font-medium text-lg">{item.label}</span>
              <ChevronRight className="text-gray-800" size={24} />
            </Link>
          ))}
        </div>

        {/* Solicitar Verificación Azul */}
        <div className="mt-6 mb-4">
          <Link 
            to="/solicitar-verificacion"
            className="w-full bg-[#1c2c4c] text-white rounded-xl p-4 flex justify-between items-center shadow-sm hover:bg-[#0f1b33] transition-colors font-semibold text-lg"
          >
            <span>Solicitar Verificación Azul</span>
            <ChevronRight className="text-white" size={24} />
          </Link>
        </div>

        {/* Botón de Cerrar Sesión */}
        <div className="mt-4">
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full bg-red-50 text-red-600 rounded-xl p-4 flex justify-center items-center shadow-sm border border-red-100 hover:bg-red-100 transition-colors font-semibold text-lg text-center"
          >
            Cerrar Sesión
          </button>
        </div>

      </div>
    </div>
  );
};

export default RequestsApprovals;
