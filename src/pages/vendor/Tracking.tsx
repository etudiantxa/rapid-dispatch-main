import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';

// Interface pour une livraison individuelle
export interface Delivery {
  _id: string;
  orderId: string; // This might need to be generated or derived
  vendor: string;
  clientName: string;
  destination: string;
  packageDescription: string;
  status: 'pending' | 'in_progress' | 'delivered';
  courier?: {
    name: string;
    avatar?: string;
    rating: number;
    totalDeliveries: number;
  };
  estimatedDelivery: string; // Should be a date/time string
  createdAt: string;
}


const Tracking = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveries = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get('/api/deliveries', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Map backend data to frontend Delivery interface
        const formattedData = data.map((d: any) => ({
          ...d,
          id: d._id, // Ensure id is available for keys
          orderId: d._id.substring(d._id.length - 6).toUpperCase(),
          quartier: d.destination,
          // Add dummy courier data for now as backend doesn't provide it
          courier: d.status !== 'pending' ? {
              name: 'Moussa S.',
              avatar: 'https://i.pravatar.cc/150?u=moussa',
              rating: 4.9,
              totalDeliveries: 124,
           } : undefined,
           estimatedDelivery: new Date(new Date(d.createdAt).getTime() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        setDeliveries(formattedData);
        if (formattedData.length > 0) {
            setSelectedDelivery(formattedData.find((d: Delivery) => d.status === 'in_progress') || formattedData[0]);
        }
      } catch (err) {
        setError('Impossible de charger les livraisons.');
      } finally {
        setLoading(false);
      }
    };

    if (user) { // Fetch only when user is loaded
        fetchDeliveries();
    }
  }, [user, navigate]);


  const filters = [
    { id: 'all', label: 'Tout' },
    { id: 'in_progress', label: 'En cours' },
    { id: 'pending', label: 'En attente' },
    { id: 'delivered', label: 'Terminées' },
  ];

  const filteredDeliveries = deliveries.filter(d => {
    if (activeFilter === 'all') return true;
    return d.status === activeFilter;
  });

  return (
    <div className="bg-uber-dark-gray text-white font-sans overflow-hidden h-screen flex w-full">
      <Sidebar userType="vendor" />
      <main className="flex-1 flex flex-col min-w-0 bg-uber-dark-gray">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <div className="w-full md:w-[400px] flex flex-col border-r border-uber-gray bg-uber-black">
            <div className="p-4 border-b border-uber-gray">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-white text-black font-bold'
                        : 'bg-uber-gray text-white hover:bg-[#333]'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && <p className="p-5 text-center text-gray-400">Chargement des courses...</p>}
              {error && <p className="p-5 text-center text-red-400">{error}</p>}
              {!loading && !error && filteredDeliveries.map(delivery => (
                <div
                  key={delivery._id}
                  onClick={() => setSelectedDelivery(delivery)}
                  className={`group flex flex-col gap-3 p-5 border-b border-uber-gray cursor-pointer transition-all ${
                    selectedDelivery?._id === delivery._id
                      ? 'bg-uber-gray/30 border-l-4 border-l-tiak-green'
                      : 'hover:bg-uber-gray/30'
                  } ${delivery.status === 'delivered' ? 'opacity-60 hover:opacity-100' : ''}`}
                >
                   <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-sm">#{delivery.orderId}</h4>
                        <span className="size-1.5 rounded-full bg-gray-500" />
                        <span className="text-xs text-gray-400">{delivery.destination}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {delivery.clientName} • {delivery.packageDescription}
                      </p>
                    </div>
                    <StatusBadge status={delivery.status} />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {delivery.courier ? (
                        <>
                          <div className="size-6 rounded-full bg-gray-700 bg-cover bg-center" style={{ backgroundImage: `url("${delivery.courier.avatar}")` }}/>
                          <span className="text-xs text-gray-300 font-medium">{delivery.courier.name}</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Recherche livreur...</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white font-medium">
                      <span className="material-symbols-outlined text-[14px] text-gray-400">schedule</span>
                      {delivery.estimatedDelivery}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-1 relative bg-uber-dark-gray flex-col">
             {/* Map and details section remains the same, will use selectedDelivery */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tracking;
