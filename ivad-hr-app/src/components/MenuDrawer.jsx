import React, { useState } from 'react';
import { X, MessageSquare, AlertTriangle, Lightbulb, HelpCircle, Settings, Download, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MenuDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // El APK estará alojado en la carpeta public cuando el usuario lo suba
  const apkUrl = "/ivad-connect.apk";

  return (
    <>
      {/* Backdrop (Fondo oscuro) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#0b1c3c]/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Menú Lateral (Drawer) */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[60] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Azul con Logo */}
        <div className="bg-[#0b1c3c] text-white p-6 rounded-br-[2rem] relative shadow-md">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col gap-1 mt-4">
            <div className="w-28 h-28 flex items-center justify-start -ml-2 -mt-4">
              <img src="/logo.png" alt="IVAD Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="mt-2">
              <h2 className="text-2xl font-bold tracking-tight">IVAD Connect</h2>
              <p className="text-sm text-[#d4af37] font-medium mt-0.5">Portal de Empleados</p>
            </div>
          </div>
        </div>

        {/* Opciones del Menú */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          
          <button 
            onClick={() => { navigate('/chat'); onClose(); }}
            className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="bg-[#0b1c3c]/5 p-3 rounded-xl group-hover:bg-[#0b1c3c]/10 transition-colors text-[#0b1c3c]">
              <MessageSquare size={22} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Chat Interno / Ayuda</h3>
              <p className="text-[10px] text-gray-500 leading-tight">Soporte y mensajería oficial</p>
            </div>
          </button>

          <button 
            onClick={() => { navigate('/incidencias'); onClose(); }}
            className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="bg-[#0b1c3c]/5 p-3 rounded-xl group-hover:bg-[#0b1c3c]/10 transition-colors text-[#0b1c3c]">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Reporte de Incidencias</h3>
              <p className="text-[10px] text-gray-500 leading-tight">Reporta problemas operativos</p>
            </div>
          </button>

          <button 
            onClick={() => { navigate('/iniciativas'); onClose(); }}
            className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="bg-[#0b1c3c]/5 p-3 rounded-xl group-hover:bg-[#0b1c3c]/10 transition-colors text-[#0b1c3c]">
              <Lightbulb size={22} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Proponer Iniciativas</h3>
              <p className="text-[10px] text-gray-500 leading-tight">Servicios para ayudar a IVAD</p>
            </div>
          </button>

          <button 
            onClick={() => { navigate('/faq'); onClose(); }}
            className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="bg-[#0b1c3c]/5 p-3 rounded-xl group-hover:bg-[#0b1c3c]/10 transition-colors text-[#0b1c3c]">
              <HelpCircle size={22} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Preguntas Frecuentes</h3>
              <p className="text-[10px] text-gray-500 leading-tight">Dudas comunes sobre la app</p>
            </div>
          </button>

          <div className="h-px bg-gray-100 my-2 mx-2"></div>

          <button 
            onClick={() => { navigate('/configuracion'); onClose(); }}
            className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-gray-100 transition-colors text-gray-600">
              <Settings size={22} />
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Configuración</h3>
              <p className="text-[10px] text-gray-400 leading-tight">Ajustes de cuenta</p>
            </div>
          </button>

        </div>
      </div>
    </>
  );
};

export default MenuDrawer;
