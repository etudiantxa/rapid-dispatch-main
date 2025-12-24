import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface SidebarProps {
  userType: 'vendor' | 'courier';
}

/**
 * Menu latéral pour la navigation
 * Adapté selon le type d'utilisateur (vendeur ou livreur)
 */
const Sidebar = ({ userType }: SidebarProps) => {
  const { user, logout, loading } = useUser();

  const vendorLinks: Array<{ to: string; icon: string; label: string; filled?: boolean }> = [
    { to: '/vendor/dashboard', icon: 'dashboard', label: 'Tableau de bord' },
    { to: '/vendor/create-delivery', icon: 'add_box', label: 'Nouvelle livraison' },
    { to: '/vendor/tracking', icon: 'map', label: 'Suivi Live', filled: true },
    { to: '/vendor/wallet', icon: 'account_balance_wallet', label: 'Portefeuille' },
  ];

  const courierLinks: Array<{ to: string; icon: string; label: string; filled?: boolean }> = [
    { to: '/courier/home', icon: 'home', label: 'Accueil' },
    { to: '/courier/batches', icon: 'inventory_2', label: 'Mes lots' },
    { to: '/courier/history', icon: 'history', label: 'Historique' },
  ];

  const links = userType === 'vendor' ? vendorLinks : courierLinks;

  return (
    <aside className="w-20 lg:w-64 flex-shrink-0 flex flex-col border-r border-uber-gray bg-uber-black z-20 transition-all duration-300">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-uber-gray">
        <div className="text-white font-bold text-xl tracking-tight">
          TIAK<span className="text-tiak-green">TIAK</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-uber-gray text-white'
                  : 'text-gray-400 hover:bg-uber-gray hover:text-white'
              }`
            }
          >
            <span className={`material-symbols-outlined ${link.filled ? 'filled' : ''}`}>
              {link.icon}
            </span>
            <span className="hidden lg:block text-sm font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile + Logout */}
      <div className="p-4 border-t border-uber-gray">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-full bg-uber-gray flex items-center justify-center">
            {loading ? (
              <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="hidden lg:flex flex-col">
            {loading ? (
              <p className="text-sm text-gray-400">Chargement...</p>
            ) : (
              <>
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </>
            )}
          </div>
        </div>

        {/* Bouton Déconnexion */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span className="hidden lg:block text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
