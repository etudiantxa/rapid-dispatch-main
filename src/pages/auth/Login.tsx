import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast"
import { useUser } from '@/context/UserContext';

const Login = () => {
  const [role, setRole] = useState<'vendor' | 'courier'>('vendor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { email, password, role });
      await login(data.token);

      if (role === 'vendor') {
        navigate('/vendor/tracking');
      } else {
        navigate('/courier/home');
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez vérifier vos identifiants.",
        variant: "destructive",
      })
    }
  };

  return (
    <div className="bg-white dark:bg-background-dark font-sans text-black dark:text-white min-h-screen flex flex-col antialiased">
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap bg-white dark:bg-background-dark px-6 py-4 lg:px-12 border-b border-transparent">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold tracking-tight text-black dark:text-white">SUNU COLIS</div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/register"
            className="hidden sm:flex items-center justify-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-black text-sm font-medium"
          >
            <span className="mr-2 material-symbols-outlined text-lg">person_add</span>
            S'inscrire
          </Link>
        </div>
      </header>

      <div className="flex flex-1 w-full max-w-[1920px] mx-auto">
        <div className="hidden lg:flex flex-1 relative bg-black overflow-hidden items-center justify-center">
          <img
            alt="Livraison urbaine"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1Stcp5nCc9Tk1ovCjW7N0ul_ldULaROcCAWrn8eoBIIXT6lABtkjv8TftAwjN5qyauEwywy9g0h5BSGaKAH7yF5K6VRFBh6nRH4IZA9E8uqSmpRJ2jPNrygw-wvlnCZsoM5YtlolvVe2fECbuomUo8FQrGT5qlEJ9X0_m0pAfjU1ZVwwsOGTPeGRY7pZNJTIt6M6LNxCWkwYicH09ptbubvQNAKesH9Z7X7CDy9UFfg2fU__jwVXiDM2PSS3G8GzpT5kaRB3LapOL"
          />
          <div className="relative z-10 w-full max-w-lg p-12 text-white">
            <h1 className="text-5xl font-bold leading-tight mb-6">Allez plus loin avec TIAK-TIAK.</h1>
            <p className="text-xl font-light mb-8 opacity-90">
              La plateforme tout-en-un pour gérer vos livraisons urbaines en toute simplicité.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-20 bg-white dark:bg-background-dark">
          <div className="w-full max-w-[400px] flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Bon retour parmi nous</h2>
              <p className="text-gray-500 text-sm">Saisissez vos identifiants pour accéder à votre espace.</p>
            </div>

            <div className="bg-gray-100 p-1 rounded-lg grid grid-cols-2 gap-1">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="vendor"
                  checked={role === 'vendor'}
                  onChange={() => setRole('vendor')}
                  className="peer sr-only"
                />
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium text-gray-500 transition-all peer-checked:bg-white peer-checked:text-black peer-checked:shadow-sm dark:peer-checked:bg-gray-800 dark:peer-checked:text-white">
                  Vendeur
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="courier"
                  checked={role === 'courier'}
                  onChange={() => setRole('courier')}
                  className="peer sr-only"
                />
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium text-gray-500 transition-all peer-checked:bg-white peer-checked:text-black peer-checked:shadow-sm dark:peer-checked:bg-gray-800 dark:peer-checked:text-white">
                  Livreur
                </div>
              </label>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="group">
                <div className="relative">
                  <input
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer block w-full rounded-lg border-2 border-transparent bg-gray-100 px-4 pb-2.5 pt-5 text-sm text-black focus:border-black focus:ring-0 focus:bg-white transition-all dark:bg-gray-800 dark:text-white dark:focus:border-white"
                  />
                  <label className="absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-xs text-gray-500 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75">
                    Adresse e-mail
                  </label>
                </div>
              </div>

              <div className="group">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer block w-full rounded-lg border-2 border-transparent bg-gray-100 px-4 pb-2.5 pt-5 text-sm text-black focus:border-black focus:ring-0 focus:bg-white transition-all dark:bg-gray-800 dark:text-white dark:focus:border-white"
                  />
                  <label className="absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-xs text-gray-500 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-black transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a className="text-sm font-medium text-gray-500 hover:text-black underline underline-offset-4 decoration-1" href="#">
                  Mot de passe oublié ?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Se connecter</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
