import React, { useState } from 'react';

/**
 * Componente de Insignia de Verificación Oficial con Fondo Relleno Sólido (Azul o Dorada)
 * Muestra tooltip al pasar el cursor y un popover informativo explicativo al hacer clic.
 */
export const VerificationBadge = ({ type = 'azul', size = 16, className = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isGold = type === 'dorada' || type === 'gold';
  
  // Colores oficiales
  const badgeColor = isGold ? '#d4af37' : '#1d9bf0';
  const label = isGold 
    ? "Verificación Oficial de Administración IVAD SRL" 
    : "Cuenta de Colaborador Verificada por Recursos Humanos";

  return (
    <span 
      className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShowTooltip(!showTooltip);
      }}
      title={label}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm hover:scale-110 transition-transform"
      >
        {/* Fondo Sólido de Sello Redondeado (Starburst Verification Seal) */}
        <path 
          d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.475 9.55.6 10.92.6 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4z" 
          fill={badgeColor}
        />
        {/* Cotejo o Checkmark Blanco Sólido en el Centro */}
        <path 
          d="M10.2 16.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z" 
          fill="#ffffff" 
        />
      </svg>

      {/* Popover flotante explicativo */}
      {showTooltip && (
        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-[#1c2c4c] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl border border-[#d4af37]/40 pointer-events-none transition-all">
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isGold ? 'bg-[#d4af37]' : 'bg-[#1d9bf0]'}`}></span>
            {label}
          </span>
        </span>
      )}
    </span>
  );
};

export const CustomVerificationBadge = VerificationBadge;
export default VerificationBadge;
