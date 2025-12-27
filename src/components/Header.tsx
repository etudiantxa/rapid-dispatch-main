import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import NotificationPopover from './NotificationPopover';

interface HeaderProps {
  showSearch?: boolean;
  showNewDeliveryButton?: boolean;
}

const Header = ({ showSearch = true, showNewDeliveryButton = true }: HeaderProps) => {
  const { user, logout, loading } = useUser();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-uber-gray bg-uber-black text-white">
      <div className="text-lg font-bold">
        <Link to={user?.role === 'vendor' ? '/vendor' : '/courier'}>Tiak-Tiak</Link>
      </div>

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

      <div className="flex items-center gap-4">
        <NotificationPopover />

        {user?.role === 'vendor' && showNewDeliveryButton && (
          <Link
            to="/vendor/create-delivery"
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Nouvelle Course</span>
          </Link>
        )}

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
