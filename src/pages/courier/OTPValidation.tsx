import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

/**
 * Page de validation OTP
 * Le livreur saisit le code OTP donné par le client
 */
const OTPValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const delivery = location.state?.delivery;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleValidate = async () => {
    const code = otp.join('');
    if (code.length !== 4) {
      setError('Veuillez entrer le code complet');
      return;
    }

    setIsValidating(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        '/api/courier/validate-otp',
        {
          deliveryId: delivery._id,
          otp: code,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/courier/home');
      }, 2000);
    } catch (err) {
      setError('Code incorrect. Veuillez réessayer.');
      setIsValidating(false);
      setOtp(['', '', '', '']);
      inputRefs[0].current?.focus();
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-uber-black text-white min-h-screen font-sans flex flex-col items-center justify-center p-6">
        <div className="text-center animate-fade-in-up">
          <div className="size-24 mx-auto mb-6 rounded-full bg-tiak-green/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-tiak-green text-5xl">check_circle</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Livraison validée !</h1>
          <p className="text-gray-400 mb-4">Le client a confirmé la réception</p>
          <div className="bg-uber-gray rounded-xl p-4 inline-block">
            <p className="text-sm text-gray-400">Gain de cette livraison</p>
            <p className="text-2xl font-bold text-tiak-green">500 FCFA</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-uber-black text-white min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-uber-black border-b border-uber-gray px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-uber-gray">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold">Validation OTP</h1>
            <p className="text-xs text-gray-400">#{delivery.orderId}</p>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="size-20 mx-auto mb-4 rounded-full bg-uber-gray flex items-center justify-center">
            <span className="material-symbols-outlined text-tiak-green text-4xl">pin</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Entrez le code OTP</h2>
          <p className="text-gray-400 text-sm">
            Demandez le code à 4 chiffres au client<br />
            <span className="text-tiak-green font-medium">{delivery.clientName}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`size-16 text-center text-2xl font-bold rounded-xl border-2 bg-uber-gray transition-all outline-none ${
                error
                  ? 'border-red-500 text-red-500'
                  : digit
                  ? 'border-tiak-green text-white'
                  : 'border-uber-gray-medium text-white focus:border-tiak-green'
              }`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-center gap-2 text-red-500 text-sm mb-6">
            <span className="material-symbols-outlined text-lg">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Info */}
        <div className="bg-uber-gray rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-tiak-green">info</span>
            <div>
              <p className="text-sm font-medium mb-1">Code de validation</p>
              <p className="text-xs text-gray-400">
                Le client a reçu ce code par SMS. Il doit vous le communiquer pour confirmer la réception du colis.
              </p>
            </div>
          </div>
        </div>

        {/* Demo hint */}
        <div className="text-center mb-8">
          <p className="text-xs text-gray-500">
            <span className="text-tiak-green">💡 Démo:</span> Utilisez le code <span className="font-mono font-bold text-white">1234</span>
          </p>
        </div>

        {/* Validate Button */}
        <button
          onClick={handleValidate}
          disabled={isValidating || otp.join('').length !== 4}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isValidating || otp.join('').length !== 4
              ? 'bg-uber-gray text-gray-400'
              : 'bg-tiak-green hover:bg-tiak-green-hover text-black'
          }`}
        >
          {isValidating ? (
            <>
              <div className="size-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>Validation...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">verified</span>
              <span>Valider la livraison</span>
            </>
          )}
        </button>

        {/* Contact Client */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 mb-2">Le client n'a pas reçu le code ?</p>
          <a
            href={`tel:${delivery.clientPhone}`}
            className="inline-flex items-center gap-2 text-tiak-green font-medium hover:underline"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            Appeler le client
          </a>
        </div>
      </div>
    </div>
  );
};

export default OTPValidation;
