import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Page de connexion - Style Uber-inspired
 * Split screen avec visuel à gauche et formulaire à droite
 */
const Login = () => {
  const [role, setRole] = useState<'vendeur' | 'livreur'>('vendeur');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigation simulée selon le rôle
    if (role === 'vendeur') {
      navigate('/vendor/tracking');
    } else {
      navigate('/courier/home');
    }
  };

  return (
    <div className="bg-white dark:bg-background-dark font-sans text-black dark:text-white min-h-screen flex flex-col antialiased">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex flex-1 w-full max-w-[1920px] mx-auto">
        {/* Left: Visual Section */}
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
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-tiak-green/20 text-tiak-green">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <span className="font-medium">Livraison ultra-rapide</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-tiak-blue/20 text-tiak-blue">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <span className="font-medium">Paiements sécurisés & OTP</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white/10">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <span className="font-medium">Suivi en temps réel</span>
              </div>
            </div>

            {/* Floating Card */}
            <div className="mt-12 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-tiak-green animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">En cours</span>
                </div>
                <span className="text-xs font-mono text-gray-400">#TRK-8921</span>
              </div>
              <div className="h-32 w-full rounded-lg overflow-hidden relative grayscale opacity-90 hover:grayscale-0 transition-all duration-500">
                <img
                  alt="Carte Dakar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV6EAOK0xlrSlSlBiml-Vv9Vmlg8_ajTCw63K3AfbVz-LzOXqx2Lw5FKOvdbiJJgJClOtBro4eyxk-GVJJWDVahH7nCyVQEC2ICfj3f5LC-BVD-n-uzJI_TvATV896g6R8y1M1kmyzZS2BgsB0kU6yBqlnPil7O5Jms1aBPPWEEcubT69N57j1qcpsLKgmnBL3uv8HWG9qLST3D0QsFh4O6ISJBOPuI-enW0HxCZVbJGbVWHrEIgVxQyyxGw8_6ah-2izS13eqCCJn"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-black text-3xl drop-shadow-lg">location_on</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center text-sm">
                <span className="text-white font-medium">Plateau → Almadies</span>
                <span className="text-gray-400">15 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-20 bg-white dark:bg-background-dark">
          <div className="w-full max-w-[400px] flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Bon retour parmi nous</h2>
              <p className="text-gray-500 text-sm">Saisissez vos identifiants pour accéder à votre espace.</p>
            </div>

            {/* Role Selector */}
            <div className="bg-gray-100 p-1 rounded-lg grid grid-cols-2 gap-1">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="vendeur"
                  checked={role === 'vendeur'}
                  onChange={() => setRole('vendeur')}
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
                  value="livreur"
                  checked={role === 'livreur'}
                  onChange={() => setRole('livreur')}
                  className="peer sr-only"
                />
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium text-gray-500 transition-all peer-checked:bg-white peer-checked:text-black peer-checked:shadow-sm dark:peer-checked:bg-gray-800 dark:peer-checked:text-white">
                  Livreur
                </div>
              </label>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="group">
                <div className="relative">
                  <input
                    type="email"
                    placeholder=" "
                    className="peer block w-full rounded-lg border-2 border-transparent bg-gray-100 px-4 pb-2.5 pt-5 text-sm text-black focus:border-black focus:ring-0 focus:bg-white transition-all dark:bg-gray-800 dark:text-white dark:focus:border-white"
                  />
                  <label className="absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-xs text-gray-500 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75">
                    Adresse e-mail
                  </label>
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder=" "
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

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm font-medium text-gray-500 hover:text-black underline underline-offset-4 decoration-1">
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Se connecter</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">ou</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
            </div>

            {/* Social Login */}
            <div className="flex flex-col gap-3">
              <button className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 hover:bg-gray-200 py-3 transition-colors text-black font-medium">
                <img
                  alt="Google"
                  className="absolute left-4 size-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_cPTCsviBq-m892-Jt3d7vfZpoSz8gqyrrp3_GUcqKmGMRundZD7182E2spWE7Sk11CQGHm56NP5cALybRZgPadRcZag7rGJQxG16lt2kDqVgaHCTCqJcOor4H9MQK8j9MU7Y31ZaqpFCkeUNjQdDiy3IzA28whk_VEz1-t4J5mLUS9Je5j6kP_UtZdUs_QD8TRQc6D_td3t7SARVJOwJT1_DgqHKR8kyheGJm0udn0r5njl1_E9IMbGZLCwum-lShHlqphYDeHoJ"
                />
                <span>Continuer avec Google</span>
              </button>
              <button className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 hover:bg-gray-200 py-3 transition-colors text-black font-medium">
                <img
                  alt="Facebook"
                  className="absolute left-4 size-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPUtKgvXaPHfYVMwVLM2VzFqtUYCFrGr9f4YKrry8pC98vy4nYe7W-QbNCVb6h4oxMdj1AfklCAS1A-UjMTAx4mFSM-0DlT8InBdPDL06hRhg0aR39lgRMbdEO1wlBrXINB3Ag_LdTt81qxyEpix0N0oujBWhks2ocu5TaSDZ0bPfiOQlOjqyPXRnG0xe6Y16uu28KipaSB-ZrM8aHcV7RSpMRVfszQs_YL0tEW34bJvuZcFKAzm2fVZiN-yLBP1emS1i6Nd5-4IRx"
                />
                <span>Continuer avec Facebook</span>
              </button>
            </div>

            {/* Sign up link */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="font-semibold text-black hover:underline">
                Inscrivez-vous
              </Link>
            </div>

            {/* Terms */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                En continuant, vous acceptez nos{' '}
                <a className="underline" href="#">
                  CGU
                </a>{' '}
                et notre{' '}
                <a className="underline" href="#">
                  Politique de confidentialité
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
