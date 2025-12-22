import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { dakarQuartiers } from '@/data/mockDeliveries';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

/**
 * Page de création de livraison - Formulaire étape par étape
 * Style sombre Uber-inspired avec formulaire moderne
 */
const CreateDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State for all form fields
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    deliveryAddress: '',
    destination: '', // Quartier
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

        // Générer un OTP simple pour la démo
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        await axios.post(
          '/api/deliveries',
          {
            ...formData,
            origin: 'Dakar, Sénégal', // Origine par défaut
            otp: otp,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
              <p className="text-gray-400 mb-6">Votre commande a été enregistrée avec succès.</p>
              <p className="text-sm text-gray-500">Redirection vers le suivi...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-uber-black text-white min-h-screen flex flex-col antialiased selection:bg-tiak-green selection:text-black">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-uber-gray-medium px-6 py-4 bg-black sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold tracking-tight">TIAK-TIAK</h2>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex gap-6">
            <a className="text-sm font-medium hover:text-white text-gray-400 transition-colors" href="/vendor/tracking">
              Tableau de bord
            </a>
            <a className="text-sm font-medium text-white transition-colors" href="#">
              Livraisons
            </a>
            <a className="text-sm font-medium hover:text-white text-gray-400 transition-colors" href="#">
              Profil
            </a>
          </nav>
          <div className="size-9 rounded-full bg-gray-800 overflow-hidden border border-gray-700">
            <div
              className="bg-center bg-no-repeat w-full h-full bg-cover"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuColNPWZ7PWtOWJrlmVz2cs3_O6BwgyBxM8K44sHDHEZ7wo7llJP2urRdongjckMiECwBdunWVTyqipHw9y6odxWYvDBZyZ2Moj0-_dWsL8AihhJzEtYDEGTEA3hEriwR4PWqCb0UpTukB9A5losQnfjPGZRMkj50yaR5jy6PTVwAkLU5GF3tEh7jAv-bSynvgoxC3oxbhk1Wp3YsJt_qw3rXmj-8ukciPD5fhmGQnKpemvRwb7cCvcK9Ww8DrW00I9RLDWBPdVXOO1")`,
              }}
            />
          </div>
        </div>
        <div className="lg:hidden text-white cursor-pointer">
          <span className="material-symbols-outlined">menu</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[900px] mx-auto p-4 lg:p-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Nouvelle livraison</h1>
          <p className="text-gray-400">Remplissez les informations pour créer votre course</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  s <= step
                    ? 'bg-tiak-green text-black'
                    : 'bg-uber-gray text-gray-400'
                }`}
              >
                {s < step ? (
                  <span className="material-symbols-outlined text-lg">check</span>
                ) : (
                  s
                )}
              </div>
              {s < 3 && (
                <div
                  className={`w-24 lg:w-40 h-1 mx-2 rounded-full transition-all ${
                    s < step ? 'bg-tiak-green' : 'bg-uber-gray'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-uber-gray rounded-2xl p-6 lg:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tiak-green">person</span>
                Informations client
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nom du client</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Ex: Moussa Diop"
                    className="w-full h-12 px-4 rounded-lg border border-uber-gray-medium bg-uber-dark-gray focus:ring-2 focus:ring-tiak-green/30 focus:border-tiak-green text-white placeholder:text-gray-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    placeholder="+221 77 000 00 00"
                    className="w-full h-12 px-4 rounded-lg border border-uber-gray-medium bg-uber-dark-gray focus:ring-2 focus:ring-tiak-green/30 focus:border-tiak-green text-white placeholder:text-gray-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Adresse de livraison</label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Ex: Rue 10, Plateau"
                  className="w-full h-12 px-4 rounded-lg border border-uber-gray-medium bg-uber-dark-gray focus:ring-2 focus:ring-tiak-green/30 focus:border-tiak-green text-white placeholder:text-gray-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quartier</label>
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg border border-uber-gray-medium bg-uber-dark-gray focus:ring-2 focus:ring-tiak-green/30 focus:border-tiak-green text-white transition-all outline-none appearance-none"
                >
                  <option value="">Sélectionner un quartier</option>
                  {dakarQuartiers.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tiak-green">inventory_2</span>
                Informations colis
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description du colis</label>
                <textarea
                  name="packageDescription"
                  value={formData.packageDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Décrivez le contenu du colis..."
                  className="w-full px-4 py-3 rounded-lg border border-uber-gray-medium bg-uber-dark-gray focus:ring-2 focus:ring-tiak-green/30 focus:border-tiak-green text-white placeholder:text-gray-500 transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre d'articles</label>
                  <input
                    type="number"
                    name="itemCount"
                    value={formData.itemCount}
                    onChange={handleChange}
                    min="1"
                    className="w-full h-12 px-4 rounded-lg border border-uber-gray-medium bg-uber-dark-gray focus:ring-2 focus:ring-tiak-green/30 focus:border-tiak-green text-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Valeur estimée (FCFA)</label>
                  <input
                    type="number"
                    name="estimatedValue"
                    value={formData.estimatedValue}
                    onChange={handleChange}
                    placeholder="Ex: 15000"
                    className="w-full h-12 px-4 rounded-lg border border-uber-gray-medium bg-uber-dark-gray focus:ring-2 focus:ring-tiak-green/30 focus:border-tiak-green text-white placeholder:text-gray-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Instructions spéciales</label>
                <input
                  type="text"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  placeholder="Ex: Fragile, appeler avant livraison..."
                  className="w-full h-12 px-4 rounded-lg border border-uber-gray-medium bg-uber-dark-gray focus:ring-2 focus:ring-tiak-green/30 focus:border-tiak-green text-white placeholder:text-gray-500 transition-all outline-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tiak-green">fact_check</span>
                Confirmation
              </h2>

              <div className="bg-uber-dark-gray rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-uber-gray">
                  <span className="text-gray-400">Client</span>
                  <span className="font-medium">{formData.clientName}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-uber-gray">
                  <span className="text-gray-400">Quartier</span>
                  <span className="font-medium">{formData.destination}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-uber-gray">
                  <span className="text-gray-400">Colis</span>
                  <span className="font-medium">{formData.itemCount} article(s)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Frais de livraison</span>
                  <span className="font-bold text-tiak-green text-lg">1 500 FCFA</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-tiak-green/10 rounded-lg border border-tiak-green/20">
                <span className="material-symbols-outlined text-tiak-green">info</span>
                <p className="text-sm text-gray-300">
                  Un code OTP sera envoyé au client pour valider la livraison. Le paiement sera collecté à la livraison.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-uber-gray-medium">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-uber-gray-medium hover:bg-uber-gray text-white font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Retour
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-tiak-green hover:bg-tiak-green-hover text-black font-bold transition-colors"
            >
              {step === 3 ? (
                <>
                  <span>Confirmer</span>
                  <span className="material-symbols-outlined text-lg">check</span>
                </>
              ) : (
                <>
                  <span>Suivant</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateDelivery;
