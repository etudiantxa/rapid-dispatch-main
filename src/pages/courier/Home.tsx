import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBatchesByQuartier, Batch } from '@/data/mockDeliveries';

/**
 * Page d'accueil livreur (Mobile-first)
 * Affiche les lots disponibles groupés par quartier
 */
const CourierHome = () => {
  const [batches] = useState<Batch[]>(getBatchesByQuartier());
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="bg-uber-black text-white min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-uber-black border-b border-uber-gray px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Bonjour,</p>
            <h1 className="text-xl font-bold">Ibrahima 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full bg-uber-gray">
              <span className="material-symbols-outlined text-white">notifications</span>
              <span className="absolute top-1 right-1 size-2 bg-tiak-green rounded-full" />
            </button>
            <div
              className="size-10 rounded-full bg-cover bg-center border-2 border-tiak-green"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-xEIjAbXRv6JVMyCRFGOcfQjGvhugyfMb4K7df_7txueYTWeeipByhvt6_bfSmtOLiaYNLOdT6D3I48jfkVkCaY7RhBwLNvvx588aMSg96fuBIIIt7zRoWfH-eBqxJyMbD3h4yz0m43nsPZywd0JxvPVAquPkasjP-uNIomV2yVg4mUv0ZF8bfYwJ6cLMC7dzbCvXc2No6yvLEx9UMM9Lmnqy6TW6QJxnuLnebyDddbk__muiF2WJuTisUWUFeDKgp4Ziug6Q8q9y")`,
              }}
            />
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        <div className="bg-uber-gray rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-tiak-green text-sm">local_shipping</span>
            <span className="text-xs text-gray-400">Aujourd'hui</span>
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-gray-400">Livraisons</p>
        </div>
        <div className="bg-uber-gray rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-tiak-green text-sm">payments</span>
            <span className="text-xs text-gray-400">Gains</span>
          </div>
          <p className="text-2xl font-bold">18 500</p>
          <p className="text-xs text-gray-400">FCFA</p>
        </div>
      </div>

      {/* Map Preview */}
      <div className="px-4 mb-4">
        <div className="relative h-40 rounded-xl overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV6EAOK0xlrSlSlBiml-Vv9Vmlg8_ajTCw63K3AfbVz-LzOXqx2Lw5FKOvdbiJJgJClOtBro4eyxk-GVJJWDVahH7nCyVQEC2ICfj3f5LC-BVD-n-uzJI_TvATV896g6R8y1M1kmyzZS2BgsB0kU6yBqlnPil7O5Jms1aBPPWEEcubT69N57j1qcpsLKgmnBL3uv8HWG9qLST3D0QsFh4O6ISJBOPuI-enW0HxCZVbJGbVWHrEIgVxQyyxGw8_6ah-2izS13eqCCJn"
            alt="Carte Dakar"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-uber-black/80 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{batches.length} zones disponibles</p>
              <p className="text-xs text-gray-400">Lots prêts à être récupérés</p>
            </div>
            <span className="material-symbols-outlined text-tiak-green">explore</span>
          </div>
        </div>
      </div>

      {/* Available Batches */}
      <div className="px-4 pb-24">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-tiak-green">inventory_2</span>
          Lots disponibles
        </h2>

        <div className="space-y-3">
          {batches.map((batch) => (
            <Link
              key={batch.id}
              to={`/courier/batch/${batch.id}`}
              className="block bg-uber-gray rounded-xl p-4 hover:bg-uber-gray-medium transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    {batch.quartier}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {batch.totalDeliveries} livraison{batch.totalDeliveries > 1 ? 's' : ''} • {batch.distance}
                  </p>
                </div>
                <span className="bg-tiak-green/10 text-tiak-green px-3 py-1 rounded-full text-xs font-bold">
                  {batch.estimatedTime}
                </span>
              </div>

              {/* Mini delivery list */}
              <div className="flex flex-wrap gap-2">
                {batch.deliveries.slice(0, 3).map((d) => (
                  <span key={d.id} className="bg-uber-dark-gray px-2 py-1 rounded text-xs text-gray-300">
                    #{d.orderId.split('-')[1]}
                  </span>
                ))}
                {batch.deliveries.length > 3 && (
                  <span className="bg-uber-dark-gray px-2 py-1 rounded text-xs text-gray-400">
                    +{batch.deliveries.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-uber-gray-medium">
                <span className="text-sm text-gray-400">Gains estimés</span>
                <span className="font-bold text-tiak-green">{batch.totalDeliveries * 500} FCFA</span>
              </div>
            </Link>
          ))}
        </div>

        {batches.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-gray-600 text-5xl mb-4">inbox</span>
            <p className="text-gray-400">Aucun lot disponible pour le moment</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-uber-black border-t border-uber-gray px-6 py-3">
        <div className="flex items-center justify-around">
          <Link to="/courier/home" className="flex flex-col items-center gap-1 text-tiak-green">
            <span className="material-symbols-outlined filled">home</span>
            <span className="text-[10px] font-medium">Accueil</span>
          </Link>
          <Link to="/courier/batches" className="flex flex-col items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-[10px] font-medium">Mes lots</span>
          </Link>
          <Link to="/courier/history" className="flex flex-col items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined">history</span>
            <span className="text-[10px] font-medium">Historique</span>
          </Link>
          <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-red-400">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-[10px] font-medium">Déconnexion</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default CourierHome;
