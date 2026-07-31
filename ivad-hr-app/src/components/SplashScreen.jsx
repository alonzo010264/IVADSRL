import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onFinished }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Iniciar desvanecimiento a los 1.6 segundos
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 1600);

    // Ocultar por completo a los 2.2 segundos
    const timer2 = setTimeout(() => {
      setHidden(true);
      if (onFinished) onFinished();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinished]);

  if (hidden) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b1c3c] text-white transition-opacity duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Fondo con destello sutil */}
      <div className="absolute inset-0 bg-radial from-[#1c2c4c] via-[#0b1c3c] to-[#050e1f] opacity-80 pointer-events-none" />

      {/* Logo Animado */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Logo Transparente Sin Marco Ni Fondo Blanco */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="IVAD Connect" 
              className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(212,175,55,0.4)] transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Título de Marca */}
        <h1 className="text-3xl font-extrabold tracking-widest text-[#d4af37] uppercase drop-shadow-md">
          IVAD<span className="text-white font-light text-xl ml-1">Connect</span>
        </h1>
        <p className="text-xs text-gray-300 font-light tracking-[0.25em] uppercase mt-1">
          Home & Goods
        </p>

        {/* Indicador de Carga Elegante */}
        <div className="mt-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" />
        </div>
      </div>

      {/* Pie de página oficial */}
      <div className="absolute bottom-6 text-center text-[11px] text-gray-400 tracking-wider">
        Portal Oficial de Empleados IVAD SRL
      </div>
    </div>
  );
};

export default SplashScreen;
