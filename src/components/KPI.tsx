interface KPIProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

/**
 * Carte KPI pour le tableau de bord vendeur
 * Affiche une métrique clé avec icône et tendance optionnelle
 */
const KPI = ({ title, value, icon, trend, className = '' }: KPIProps) => {
  return (
    <div className={`bg-uber-gray rounded-xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-400">{title}</span>
        <div className="size-10 rounded-lg bg-uber-dark-gray flex items-center justify-center">
          <span className="material-symbols-outlined text-tiak-green">{icon}</span>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend.positive ? 'text-tiak-green' : 'text-red-400'} mb-1`}>
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
    </div>
  );
};

export default KPI;
