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
        
        {/* Contenedor circular con doble anillo de oro radiante */}
        <div className="relative mb-6">
          {/* Anillo exterior palpitante */}
          <div className="absolute -inset-3 rounded-full border-2 border-[#d4af37]/40 animate-ping opacity-75" />
          <div className="absolute -inset-1 rounded-full border border-[#d4af37]/60 animate-pulse" />

          {/* Logo Principal con Marco de Oro */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-[#d4af37] bg-[#0b1c3c] p-1.5 shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
            <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center p-2">
              <img 
                src="/logo.png" 
                alt="IVAD Connect" 
                className="w-full h-full object-contain drop-shadow-md animate-fade-in"
              />
            </div>
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
