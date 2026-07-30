import { BadgeCheck } from 'lucide-react';

export const CustomVerificationBadge = ({ status, className = "w-5 h-5" }) => {
  if (!status) return null;

  const getColor = () => {
    switch (status) {
      case 'verified':
      case true:
        return '#1da1f2'; // Azul verificado oficial (Twitter/Instagram style)
      case 'gold':
      case 'manager':
        return '#d4af37'; // Dorado para administración y gerencia
      case 'supervisor':
        return '#10b981'; // Verde para supervisores
      default:
        return '#1da1f2';
    }
  };

  return (
    <BadgeCheck 
      className={className} 
      fill={getColor()} 
      color="white"
      title={`Cuenta verificada (${status})`}
    />
  );
};

export default CustomVerificationBadge;
