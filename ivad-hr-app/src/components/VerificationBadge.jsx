import React from 'react';

/**
 * Insignia de Verificación Oficial con Fondo Relleno Sólido (Azul o Dorada) y Cotejo Blanco
 */
export const VerificationBadge = ({ type = 'azul', size = 16, className = '' }) => {
  const isGold = type === 'dorada' || type === 'gold';
  // Azul oficial de verificación (#1d9bf0) o Dorado de alta calidad (#d4af37)
  const badgeColor = isGold ? '#d4af37' : '#1d9bf0';

  return (
    <span 
      className={`inline-flex items-center justify-center shrink-0 ${className}`} 
      title={isGold ? "Verificación Dorada IVAD" : "Verificación Azul IVAD"}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
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
    </span>
  );
};

export const CustomVerificationBadge = VerificationBadge;

export default VerificationBadge;
