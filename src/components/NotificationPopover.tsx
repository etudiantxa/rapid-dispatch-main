import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationPopover = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  return (
    <Popover onOpenChange={(open) => {
      if (open && unreadCount > 0) {
        markAllAsRead();
      }
    }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-uber-black border-uber-gray text-white p-0">
        <div className="p-4 border-b border-uber-gray">
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Aucune notification pour le moment.</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-4 p-4 border-b border-uber-gray last:border-b-0">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full ${!notif.read ? 'bg-tiak-green' : 'bg-gray-600'}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(notif.timestamp, { addSuffix: true, locale: fr })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
            <div className="p-2 border-t border-uber-gray">
                <Button variant="link" size="sm" className="w-full text-center text-tiak-green" onClick={markAllAsRead}>
                    Marquer tout comme lu
                </Button>
            </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
