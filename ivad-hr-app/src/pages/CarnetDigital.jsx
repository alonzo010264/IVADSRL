import React, { useState } from 'react';
import { ChevronLeft, QrCode, ShieldCheck, Download, RotateCw, Building2, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';

const CarnetDigital = () => {
  const navigate = useNavigate();
  const { currentUser } = useEmployees();
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'

  const empName = currentUser?.name || 'Empleado IVAD';
  const empRole = currentUser?.role || 'Colaborador';
  const empDept = currentUser?.department || currentUser?.dept || 'Operaciones';
  
  // Código corto para evitar desbordamientos
  const rawId = currentUser?.id ? String(currentUser.id) : '084';
  const empCode = rawId.length > 8 ? `EMP-${rawId.slice(0, 6).toUpperCase()}` : `EMP-${rawId.padStart(4, '0')}`;
  
  const empEmail = currentUser?.email || 'empleado@ivadsrl.com';
  const empPhone = currentUser?.phone || '+1 (809) 555-0199';

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans text-gray-800 flex flex-col items-center">
      
      {/* Header Superior Azul IVAD */}
      <div className="w-full bg-[#1c2c4c] text-white pt-10 pb-16 px-4 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          
          <div className="text-center flex-1 mx-2">
            <h1 className="text-xl font-bold tracking-tight">Carnet Digital IVAD</h1>
            <p className="text-xs text-[#d4af37] font-medium mt-0.5">Identificación Oficial de Empleado</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
            <UserCheck size={20} />
          </div>
        </div>
      </div>

      {/* Contenedor del Carnet Interactivo */}
      <div className="w-full max-w-sm px-4 -mt-10 relative z-20 flex flex-col items-center">
        
        {/* Selector / Botón para Girar Carnet */}
        <div className="mb-4 bg-white p-1 rounded-full shadow-md border border-gray-200 flex gap-1">
          <button
            onClick={() => setActiveSide('front')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeSide === 'front' ? 'bg-[#1c2c4c] text-[#d4af37]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Frente
          </button>
          <button
            onClick={() => setActiveSide('back')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeSide === 'back' ? 'bg-[#1c2c4c] text-[#d4af37]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Reverso
          </button>
          <button
            onClick={() => setActiveSide(activeSide === 'front' ? 'back' : 'front')}
            className="p-1.5 rounded-full bg-gray-100 text-[#1c2c4c] hover:bg-gray-200 transition-colors ml-1"
            title="Girar Carnet"
          >
            <RotateCw size={14} className="text-[#d4af37]" />
          </button>
        </div>

        {/* Tarjeta del Carnet */}
        <div className="w-full aspect-[1/1.58] max-w-[340px] relative">
          
          {/* LADO FRONTAL DEL CARNET */}
          {activeSide === 'front' && (
            <div 
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              className="w-full h-full bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden flex flex-col justify-between p-6 animate-fade-in relative"
            >
              {/* Fondo con marca de agua y trama dorada */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center">
                <img src="/sello-ivad.png" alt="Sello de agua" className="w-[300px] h-[300px] object-contain" />
              </div>

              {/* Banda Superior IVAD */}
              <div className="flex items-center justify-between border-b-2 border-[#1c2c4c] pb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="IVAD Logo" className="h-8 object-contain" />
                  <div>
                    <h2 className="text-xs font-black text-[#1c2c4c] leading-none uppercase tracking-wider">IVAD SRL</h2>
                    <p className="text-[8px] text-[#d4af37] font-bold tracking-widest uppercase mt-0.5">Home & Goods</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block bg-[#1c2c4c] text-[#d4af37] font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                    {empCode}
                  </span>
                </div>
              </div>

              {/* Foto de Perfil con Marco de Oro IVAD */}
              <div className="flex flex-col items-center my-auto relative z-10 py-2">
                <div className="relative mb-3">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#d4af37] bg-[#1c2c4c] p-[3px] shadow-lg">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                      {currentUser?.avatar ? (
                        <img src={currentUser.avatar} alt={empName} className="w-full h-full object-cover scale-[1.35]" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-[#1c2c4c] text-[#d4af37] p-1.5 rounded-full border-2 border-white shadow-md">
                    <ShieldCheck size={16} />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-black text-[#1c2c4c] text-center leading-tight break-words max-w-[260px]">{empName}</h3>
                <p className="text-xs font-bold text-[#d4af37] uppercase tracking-wider text-center mt-0.5">{empRole}</p>
                <p className="text-[11px] text-gray-500 font-medium text-center">{empDept}</p>
              </div>

              {/* Código de Barras / QR en la parte inferior */}
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-2 rounded-xl text-[#1c2c4c]">
                    <QrCode size={28} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">Estatus Empleado</span>
                    <span className="text-[10px] font-bold text-[#d4af37] bg-[#1c2c4c] px-2 py-0.5 rounded border border-[#d4af37]/40 inline-block">
                      ACTIVO / VERIFICADO
                    </span>
                  </div>
                </div>
                <img src="/sello-ivad.png" alt="Sello Oficial" className="w-10 h-10 object-contain opacity-90" />
              </div>

            </div>
          )}

          {/* LADO REVERSO DEL CARNET */}
          {activeSide === 'back' && (
            <div 
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              className="w-full h-full bg-[#1c2c4c] text-white rounded-3xl shadow-2xl border-2 border-[#d4af37]/50 overflow-hidden flex flex-col justify-between p-6 animate-fade-in relative"
            >
              {/* Encabezado Reverso */}
              <div className="border-b border-[#d4af37]/30 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-[#d4af37]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">IVAD Home & Goods SRL</span>
                </div>
                <span className="text-[9px] text-[#d4af37] font-mono shrink-0">RNC: 1-32-45678-9</span>
              </div>

              {/* Información Corporativa */}
              <div className="space-y-3 my-auto text-xs py-2">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-[#d4af37] font-bold uppercase block mb-0.5">Correo Corporativo</span>
                  <span className="font-mono text-white text-xs break-all">{empEmail}</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-[#d4af37] font-bold uppercase block mb-0.5">Teléfono Móvil</span>
                  <span className="font-mono text-white text-xs">{empPhone}</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-[#d4af37] font-bold uppercase block mb-0.5">Seguro Médico (ARS)</span>
                  <span className="font-medium text-white text-xs">ARS Humana / Cotizante Activo</span>
                </div>
              </div>

              {/* Pie con Sello Oficial y Nota Legal */}
              <div className="border-t border-[#d4af37]/30 pt-3 text-center">
                <p className="text-[9px] text-gray-300 leading-tight mb-2">
                  Este carnet digital es propiedad de IVAD SRL y acredita la vinculación laboral del titular.
                </p>
                <div className="flex justify-center items-center gap-2">
                  <img src="/sello-ivad.png" alt="Sello IVAD" className="w-8 h-8 object-contain" />
                  <span className="text-[10px] font-bold text-[#d4af37] tracking-wider uppercase">Documento Oficial Auténtico</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Acciones Adicionales */}
        <div className="w-full mt-6 space-y-2">
          <button 
            onClick={() => window.print()}
            className="w-full bg-[#1c2c4c] text-white font-bold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all border border-[#d4af37]/30"
          >
            <Download size={18} className="text-[#d4af37]" />
            <span>Guardar Carnet en PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CarnetDigital;
