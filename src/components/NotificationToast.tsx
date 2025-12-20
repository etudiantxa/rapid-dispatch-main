interface NotificationToastProps {
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

/**
 * Toast de notification flottant
 * Utilisé pour afficher les mises à jour de statut en temps réel
 */
const NotificationToast = ({ 
  type, 
  title, 
  message, 
  onClose,
  className = '' 
}: NotificationToastProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-white text-black border-gray-200',
          icon: 'bg-green-100 text-green-600',
          iconName: 'check',
        };
      case 'info':
        return {
          container: 'bg-black text-white border-gray-800',
          icon: 'bg-tiak-green text-black',
          iconName: 'sports_motorsports',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          icon: 'bg-yellow-100 text-yellow-600',
          iconName: 'warning',
        };
      default:
        return {
          container: 'bg-white text-black border-gray-200',
          icon: 'bg-gray-100 text-gray-600',
          iconName: 'info',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-lg shadow-2xl border w-80 animate-slide-in ${styles.container} ${className}`}
    >
      <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
        <span className="material-symbols-outlined text-sm font-bold">{styles.iconName}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">{title}</p>
        <p className={`text-xs ${type === 'info' ? 'text-gray-400' : 'text-gray-500'} truncate`}>{message}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className={`${type === 'info' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'} transition-colors`}
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
    </div>
  );
};

export default NotificationToast;
