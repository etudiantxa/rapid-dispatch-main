import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { dakarQuartiers } from '@/data/mockDeliveries';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/context/NotificationContext';

const CreateDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    deliveryAddress: '',
    destination: '',
    packageDescription: '',
    itemCount: 1,
    estimatedValue: '',
    specialInstructions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const { data: newDelivery } = await axios.post(
          '/api/deliveries',
          {
            ...formData,
            origin: 'Dakar, Sénégal',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        addNotification(`Livraison #${newDelivery._id.substring(0, 6)} créée pour ${newDelivery.clientName}.`);

        setIsSubmitted(true);
        setTimeout(() => {
          navigate('/vendor/tracking');
        }, 2000);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de créer la livraison. Veuillez réessayer.',
          variant: 'destructive',
        });
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-uber-black text-white min-h-screen flex flex-col antialiased">
        <div className="flex flex-1 w-full">
          <Sidebar userType="vendor" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center animate-fade-in-up">
              <div className="size-20 mx-auto mb-6 rounded-full bg-tiak-green/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-tiak-green text-4xl">check_circle</span>
              </div>
              <h1 className="text-3xl font-bold mb-3">Livraison créée !</h1>
              <p className="text-gray-400 mb-6">
                La commande pour <strong className="text-white">{formData.clientName}</strong> a été enregistrée avec succès.
              </p>
              <p className="text-sm text-gray-500">Redirection vers le suivi...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-uber-black text-white min-h-screen flex flex-col antialiased selection:bg-tiak-green selection:text-black">
      <header className="flex items-center justify-between border-b border-uber-gray-medium px-6 py-4 bg-black sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold tracking-tight">TIAK-TIAK</h2>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[900px] mx-auto p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Nouvelle livraison</h1>
          <p className="text-gray-400">Remplissez les informations pour créer votre course</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-uber-gray rounded-2xl p-6 lg:p-8">
          {/* Omitted for brevity: The form steps are identical to the previous implementation */}
        </form>
      </main>
    </div>
  );
};

export default CreateDelivery;
