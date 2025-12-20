import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { mockDeliveries } from '@/data/mockDeliveries';

/**
 * Page de livraison en cours
 * Timeline verticale des étapes avec carte statique
 */
const DeliveryInProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const delivery = location.state?.delivery || mockDeliveries[0];

  const [currentStep, setCurrentStep] = useState(2); // 0: Prise, 1: En route, 2: Arrivé

  const steps = [
    { id: 0, label: 'Colis récupéré', icon: 'inventory_2', time: '14:30' },
    { id: 1, label: 'En route', icon: 'local_shipping', time: '14:35' },
    { id: 2, label: 'Arrivé chez le client', icon: 'location_on', time: '14:45' },
    { id: 3, label: 'Livraison validée', icon: 'check_circle', time: '-' },
  ];

  const handleValidateDelivery = () => {
    navigate('/courier/otp-validation', { state: { delivery } });
  };

  return (
    <div className="bg-uber-black text-white min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-uber-black/90 backdrop-blur-sm border-b border-uber-gray px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-uber-gray">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg font-bold">Livraison en cours</h1>
              <p className="text-xs text-gray-400">#{delivery.orderId}</p>
            </div>
          </div>
          <a href={`tel:${delivery.clientPhone}`} className="p-2 rounded-full bg-tiak-green">
            <span className="material-symbols-outlined text-black">call</span>
          </a>
        </div>
      </header>

      {/* Map */}
      <div className="h-56 relative">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxfK5aTw7mwtoC0MakE8TGQdAp-_EdU3QUIqK2e_rKBNo2CxoSTOtgvJjk-YgbN1CRjHINFALPEEvfqwYRc70bmSoFuje7fD4yuS4nlouNRKhKO_FSYrtCPUUqUuMHswTTud7l9wpK0ZHlG-Mpu3U8USHnWfJycd37xWh8RNZdUGwb5gyZ3_bfbv5VIvJiy_Vx5fpVJp-TLQiR45EuHY9cQSQB62Yhus9XSk9MLjoL4RwZJWJPeI73S0Z7W8K4q9LUbCXnv9dNykOf"
          alt="Carte trajet"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-uber-black via-transparent to-transparent" />
        
        {/* Route overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 50 180 Q 150 100 250 120 T 350 50"
            fill="none"
            stroke="#06C167"
            strokeWidth="4"
            strokeDasharray="8,8"
            strokeLinecap="round"
          />
          <circle cx="50" cy="180" r="8" fill="#06C167" stroke="white" strokeWidth="2" />
          <circle cx="350" cy="50" r="8" fill="white" stroke="#06C167" strokeWidth="3" />
        </svg>
      </div>

      {/* Client Info Card */}
      <div className="px-4 -mt-12 relative z-10 mb-4">
        <div className="bg-uber-gray rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Client</p>
              <h2 className="font-bold text-lg">{delivery.clientName}</h2>
              <p className="text-sm text-gray-400">{delivery.deliveryAddress}</p>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${delivery.clientPhone}`} className="p-3 rounded-lg bg-uber-dark-gray">
                <span className="material-symbols-outlined text-white">call</span>
              </a>
              <a href={`sms:${delivery.clientPhone}`} className="p-3 rounded-lg bg-uber-dark-gray">
                <span className="material-symbols-outlined text-white">chat</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 pb-32">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">
          Progression
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-uber-gray" />
          
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Icon */}
                <div
                  className={`relative z-10 size-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-tiak-green text-black'
                      : isCurrent
                      ? 'bg-tiak-green text-black ring-4 ring-tiak-green/30'
                      : 'bg-uber-gray text-gray-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isCompleted ? 'check' : step.icon}
                  </span>
                </div>

                {/* Content */}
                <div className={`flex-1 pb-4 ${isPending ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${isCurrent ? 'text-tiak-green' : ''}`}>
                      {step.label}
                    </p>
                    <span className="text-xs text-gray-400">{step.time}</span>
                  </div>
                  {isCurrent && (
                    <p className="text-sm text-gray-400 mt-1">En attente de validation OTP</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-uber-black via-uber-black to-transparent">
        <button
          onClick={handleValidateDelivery}
          className="w-full py-4 rounded-xl bg-tiak-green hover:bg-tiak-green-hover text-black font-bold text-lg flex items-center justify-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined">pin</span>
          <span>Valider avec code OTP</span>
        </button>
      </div>
    </div>
  );
};

export default DeliveryInProgress;
