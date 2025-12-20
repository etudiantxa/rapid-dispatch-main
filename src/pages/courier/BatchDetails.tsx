import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getBatchesByQuartier, Delivery } from '@/data/mockDeliveries';

/**
 * Page détail d'un lot de livraisons
 * Le livreur peut voir les détails et accepter le lot
 */
const BatchDetails = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [isAccepting, setIsAccepting] = useState(false);

  const batches = getBatchesByQuartier();
  const batch = batches.find((b) => b.id === batchId) || batches[0];

  const handleAcceptBatch = () => {
    setIsAccepting(true);
    // Simuler l'acceptation
    setTimeout(() => {
      navigate('/courier/delivery-in-progress', { state: { delivery: batch.deliveries[0] } });
    }, 1500);
  };

  return (
    <div className="bg-uber-black text-white min-h-screen font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-uber-black border-b border-uber-gray px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-uber-gray">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold">Lot {batch.quartier}</h1>
            <p className="text-xs text-gray-400">{batch.totalDeliveries} livraisons</p>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="h-48 relative">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV6EAOK0xlrSlSlBiml-Vv9Vmlg8_ajTCw63K3AfbVz-LzOXqx2Lw5FKOvdbiJJgJClOtBro4eyxk-GVJJWDVahH7nCyVQEC2ICfj3f5LC-BVD-n-uzJI_TvATV896g6R8y1M1kmyzZS2BgsB0kU6yBqlnPil7O5Jms1aBPPWEEcubT69N57j1qcpsLKgmnBL3uv8HWG9qLST3D0QsFh4O6ISJBOPuI-enW0HxCZVbJGbVWHrEIgVxQyyxGw8_6ah-2izS13eqCCJn"
          alt="Carte du quartier"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-uber-black via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 bg-uber-black/80 backdrop-blur-sm rounded-lg p-3">
            <span className="material-symbols-outlined text-tiak-green">route</span>
            <div>
              <p className="text-sm font-medium">{batch.distance} • {batch.estimatedTime}</p>
              <p className="text-xs text-gray-400">Itinéraire optimisé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-uber-gray rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-tiak-green">{batch.totalDeliveries}</p>
            <p className="text-xs text-gray-400">Livraisons</p>
          </div>
          <div className="bg-uber-gray rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{batch.distance}</p>
            <p className="text-xs text-gray-400">Distance</p>
          </div>
          <div className="bg-uber-gray rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-tiak-green">{batch.totalDeliveries * 500}</p>
            <p className="text-xs text-gray-400">FCFA</p>
          </div>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="px-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
          Détail des livraisons
        </h2>

        <div className="space-y-3">
          {batch.deliveries.map((delivery: Delivery, index: number) => (
            <div key={delivery.id} className="bg-uber-gray rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-full bg-uber-dark-gray flex items-center justify-center text-sm font-bold text-tiak-green">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold">{delivery.clientName}</h3>
                    <span className="text-xs text-gray-400">#{delivery.orderId}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{delivery.deliveryAddress}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <span className="material-symbols-outlined text-sm">inventory_2</span>
                      {delivery.packageDescription}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <span className="material-symbols-outlined text-sm">phone</span>
                      {delivery.clientPhone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accept Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-uber-black via-uber-black to-transparent">
        <button
          onClick={handleAcceptBatch}
          disabled={isAccepting}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isAccepting
              ? 'bg-uber-gray text-gray-400'
              : 'bg-tiak-green hover:bg-tiak-green-hover text-black'
          }`}
        >
          {isAccepting ? (
            <>
              <div className="size-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>Acceptation en cours...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">check_circle</span>
              <span>Accepter ce lot</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BatchDetails;
