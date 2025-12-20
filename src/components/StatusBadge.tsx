import { DeliveryStatus, getStatusColor, getStatusLabel } from '@/data/mockDeliveries';

interface StatusBadgeProps {
  status: DeliveryStatus;
  className?: string;
}

/**
 * Badge coloré pour afficher le statut d'une livraison
 * Les couleurs correspondent à la maquette Stitch
 */
const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const { bg, text } = getStatusColor(status);
  
  return (
    <span 
      className={`${bg} ${text} px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
