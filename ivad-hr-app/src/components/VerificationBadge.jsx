import React, { useState } from 'react';

/**
 * Componente de Insignia de Verificación Oficial con Fondo Relleno Sólido (Azul o Dorada)
 * Muestra popover flotante explicativo con colores corporativos IVAD sin recortes.
 */
export const VerificationBadge = ({ type, status, emp, size = 16, className = '', position = 'auto' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  let isVerified = false;
  let isGold = false;

  if (emp) {
    isVerified = emp.verification_status === 'verificado' || emp.is_admin || emp.email === 'admin@ivad.com' || emp.isSupportChannel;
    isGold = emp.verification_type === 'dorada' || emp.is_admin || emp.email === 'admin@ivad.com' || emp.isSupportChannel;
  } else if (status) {
    if (typeof status === 'object') {
      isVerified = status.verification_status === 'verificado' || status.is_admin || status.email === 'admin@ivad.com';
      isGold = status.verification_type === 'dorada' || status.is_admin || status.email === 'admin@ivad.com';
    } else if (typeof status === 'string') {
      isVerified = status === 'verificado' || status === 'dorada' || status === 'azul';
      isGold = status === 'dorada';
    }
  } else if (type) {
    isVerified = true;
    isGold = type === 'dorada' || type === 'gold';
  }

  if (!isVerified) return null;

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
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm hover:scale-110 transition-transform shrink-0"
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

      {/* Popover flotante sin recortes con Colores Oficiales IVAD */}
      {showTooltip && (
        <span 
          className={`absolute z-[100] whitespace-nowrap bg-[#1c2c4c] text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-2xl border border-[#d4af37] pointer-events-none transition-all ${
            position === 'bottom' 
              ? 'top-full mt-2.5 left-0' 
              : 'bottom-full mb-2 left-1/2 -translate-x-1/2'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${isGold ? 'bg-[#d4af37]' : 'bg-[#1d9bf0]'}`}></span>
            <span>{label}</span>
          </span>
        </span>
      )}
    </span>
  );
};

export const CustomVerificationBadge = VerificationBadge;
export default VerificationBadge;
