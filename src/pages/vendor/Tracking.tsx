import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import NotificationToast from '@/components/NotificationToast';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

// Interface pour les livraisons venant du backend
interface ApiDelivery {
  _id: string;
  vendor: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in-progress' | 'delivered';
  otp: string;
}

// Mapper les statuts du backend à ceux du frontend
const statusMapping = {
  pending: 'CREEE',
  'in-progress': 'EN_COURS',
  delivered: 'LIVREE',
};

/**
 * Page de suivi des livraisons en temps réel pour le vendeur
 * Affiche la liste des commandes, la carte statique et les notifications
 */
const Tracking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<ApiDelivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<ApiDelivery | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const { data } = await axios.get('/api/deliveries', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveries(data);
        // Sélectionner la première livraison en cours par défaut
        setSelectedDelivery(data.find(d => d.status === 'in-progress') || data[0] || null);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les livraisons.',
          variant: 'destructive',
        });
      }
    };

    fetchDeliveries();
  }, [navigate, toast]);

  const filters = [
    { id: 'all', label: 'Tout' },
    { id: 'en_cours', label: 'En cours' },
    { id: 'programmees', label: 'Programmées' },
    { id: 'terminees', label: 'Terminées' },
  ];

  const filteredDeliveries = deliveries.filter(d => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'en_cours') return d.status === 'in-progress';
    if (activeFilter === 'programmees') return d.status === 'pending';
    if (activeFilter === 'terminees') return d.status === 'delivered';
    return true;
  });

  return (
    <div className="bg-uber-dark-gray text-white font-sans overflow-hidden h-screen flex w-full">
      {/* Sidebar */}
      <Sidebar userType="vendor" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-uber-dark-gray">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Liste des commandes */}
          <div className="w-full md:w-[400px] flex flex-col border-r border-uber-gray bg-uber-black">
            {/* Filtres */}
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

            {/* Liste */}
            <div className="flex-1 overflow-y-auto">
              {filteredDeliveries.map(delivery => (
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
                        <h4 className="text-white font-bold text-sm">#{delivery._id.substring(0, 6)}</h4>
                        <span className="size-1.5 rounded-full bg-gray-500" />
                        <span className="text-xs text-gray-400">{delivery.destination}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {delivery.origin} → {delivery.destination}
                      </p>
                    </div>
                    <StatusBadge status={statusMapping[delivery.status]} />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 italic">
                        {delivery.status === 'pending' ? 'Recherche livreur...' : 'Livreur non assigné'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white font-medium">
                      <span className="material-symbols-outlined text-[14px] text-gray-400">
                        {delivery.status === 'delivered' ? 'check_circle' : 'schedule'}
                      </span>
                      --:--
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte et détails */}
          <div className="hidden md:flex flex-1 relative bg-uber-dark-gray flex-col">
            {/* Carte statique de Dakar */}
            <div
              className="absolute inset-0 bg-cover bg-center grayscale opacity-70"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxfK5aTw7mwtoC0MakE8TGQdAp-_EdU3QUIqK2e_rKBNo2CxoSTOtgvJjk-YgbN1CRjHINFALPEEvfqwYRc70bmSoFuje7fD4yuS4nlouNRKhKO_FSYrtCPUUqUuMHswTTud7l9wpK0ZHlG-Mpu3U8USHnWfJycd37xWh8RNZdUGwb5gyZ3_bfbv5VIvJiy_Vx5fpVJp-TLQiR45EuHY9cQSQB62Yhus9XSk9MLjoL4RwZJWJPeI73S0Z7W8K4q9LUbCXnv9dNykOf")`
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              {/* SVG Route */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl" style={{ zIndex: 5 }}>
                <path
                  className="animate-pulse"
                  d="M 400 600 Q 500 500 600 400 T 800 300"
                  fill="none"
                  stroke="#06C167"
                  strokeDasharray="10,10"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
                <circle cx="400" cy="600" fill="white" r="8" stroke="black" strokeWidth="3" />
                <circle cx="800" cy="300" fill="#06C167" r="8" stroke="white" strokeWidth="3" />
              </svg>
            </div>

            {/* Contenu flottant */}
            <div className="relative z-10 flex flex-col h-full pointer-events-none p-6 justify-between">
              {/* Notifications */}
              <div className="flex flex-col items-end gap-3 pointer-events-auto">
                <NotificationToast
                  type="success"
                  title="Livraison effectuée"
                  message="Commande #CMD-4825 livrée à Almadies"
                />
                <NotificationToast
                  type="info"
                  title="Livreur en route"
                  message="Ibrahima arrive dans 5 min"
                />
              </div>

              {/* Panneau inférieur */}
              <div className="flex gap-4 items-end pointer-events-auto w-full max-w-5xl mx-auto">
                {/* Timeline de progression */}
                <div className="flex-1 bg-uber-black rounded-2xl p-6 shadow-2xl border border-uber-gray">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        En route vers {selectedDelivery?.destination || 'Plateau'}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Arrivée estimée: <span className="text-tiak-green font-bold">--:--</span>
                      </p>
                    </div>
                    <button className="text-sm text-gray-400 hover:text-white underline">Détails</button>
                  </div>

                  {/* Progress Steps */}
                  <div className="relative flex items-center justify-between w-full px-4">
                    {/* Background line */}
                    <div className="absolute left-4 right-4 top-1/2 h-1 bg-gray-800 -z-0 rounded-full" />
                    {/* Progress line */}
                    <div className="absolute left-4 top-1/2 h-1 bg-tiak-green -z-0 rounded-full transition-all duration-1000" style={{ width: '60%' }} />

                    {/* Steps */}
                    {['Créée', 'Assignée', 'Prise', 'En cours', 'Livrée'].map((step, index) => {
                      const isCompleted = index < 3;
                      const isCurrent = index === 3;
                      const isPending = index > 3;

                      return (
                        <div key={step} className="relative flex flex-col items-center gap-2 group">
                          <div
                            className={`rounded-full border-4 border-uber-black flex items-center justify-center z-10 ${
                              isCompleted
                                ? 'size-6 bg-tiak-green outline outline-2 outline-tiak-green text-black'
                                : isCurrent
                                ? 'size-8 bg-black border-tiak-green text-tiak-green shadow-[0_0_15px_rgba(6,193,103,0.4)]'
                                : 'size-6 bg-gray-800 outline outline-1 outline-gray-600'
                            }`}
                          >
                            {isCompleted && (
                              <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                            )}
                            {isCurrent && (
                              <span className="material-symbols-outlined text-[16px] filled animate-pulse">local_shipping</span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-medium uppercase tracking-wide absolute -bottom-6 ${
                              isCurrent ? 'font-bold text-white' : isPending ? 'text-gray-600' : 'text-gray-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tracking;
