import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';

interface HeaderProps {
  showSearch?: boolean;
  showNewDeliveryButton?: boolean;
}

/**
 * En-tête de l'application
 * Contient la recherche, le bouton de création de livraison, et les informations utilisateur.
 */
const Header = ({ showSearch = true, showNewDeliveryButton = true }: HeaderProps) => {
  const { user, logout, loading } = useUser();
  const { unreadCount } = useNotifications();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-uber-gray bg-uber-black text-white">
      {/* Logo ou titre */}
      <div className="text-lg font-bold">
        <Link to={user?.role === 'vendor' ? '/vendor' : '/courier'}>Tiak-Tiak</Link>
      </div>

      {/* Barre de recherche (si applicable) */}
      {showSearch && (
        <div className="flex-1 max-w-md mx-4">
          <div className="flex h-10 w-full items-center rounded-lg bg-uber-gray focus-within:bg-[#333] transition-colors">
            <div className="px-3 text-gray-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              type="text"
              className="w-full bg-transparent placeholder:text-gray-500 border-none focus:ring-0 text-sm px-0"
              placeholder="Rechercher commande, client..."
            />
          </div>
        </div>
      )}

      {/* Actions et informations utilisateur */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-uber-gray transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 size-4 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Bouton nouvelle livraison (pour les vendeurs) */}
        {user?.role === 'vendor' && showNewDeliveryButton && (
          <Link
            to="/vendor/create-delivery"
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Nouvelle Course</span>
          </Link>
        )}

        {/* Informations utilisateur */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="text-sm text-gray-400">Chargement...</div>
          ) : user ? (
            <>
              <span className="text-sm">Bonjour, {user.name}</span>
              <button
                onClick={logout}
                className="bg-uber-gray hover:bg-red-600 px-3 py-1 rounded-full text-sm transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm hover:underline">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
