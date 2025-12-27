import { Link } from 'react-router-dom';

interface HeaderProps {
  showSearch?: boolean;
  showNewDeliveryButton?: boolean;
}

/**
 * En-tête de l'application vendeur
 * Contient la recherche et le bouton de création de livraison
 */
const Header = ({ showSearch = true, showNewDeliveryButton = true }: HeaderProps) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-uber-gray bg-uber-black">
      {/* Barre de recherche */}
      {showSearch && (
        <div className="flex-1 max-w-md">
          <div className="flex h-10 w-full items-center rounded-lg bg-uber-gray focus-within:bg-[#333] transition-colors">
            <div className="px-3 text-gray-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              type="text"
              className="w-full bg-transparent text-white placeholder:text-gray-500 border-none focus:ring-0 text-sm px-0"
              placeholder="Rechercher commande, client..."
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-uber-gray text-white transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-tiak-green rounded-full" />
        </button>

        {/* Bouton nouvelle livraison */}
        {showNewDeliveryButton && (
          <Link
            to="/vendor/create-delivery"
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Nouvelle Course</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
