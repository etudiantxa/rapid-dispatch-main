import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Définir une interface pour la structure d'une notification
export interface Notification {
  id: number;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Définir le type pour la valeur du contexte
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

// Créer le contexte avec une valeur par défaut `undefined`
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Créer le fournisseur de contexte
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Ajoute une nouvelle notification
  const addNotification = useCallback((message: string) => {
    const newNotification: Notification = {
      id: Date.now(), // Utiliser timestamp comme ID simple
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Marque une notification spécifique comme lue
  const markAsRead = useCallback((id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Marque toutes les notifications comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Calcule le nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Créer un hook personnalisé pour utiliser le contexte
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
