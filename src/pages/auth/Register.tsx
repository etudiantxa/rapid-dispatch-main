import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Page d'inscription - Conversion pixel-perfect de la maquette Stitch
 * Split screen avec formulaire à gauche et visuel carte à droite
 */
const Register = () => {
  const [role, setRole] = useState<'vendeur' | 'livreur'>('vendeur');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display antialiased h-screen overflow-hidden flex flex-col">
      {/* Main Layout: Split Screen */}
      <div className="flex flex-1 h-full w-full">
        {/* Left Column: Form Section */}
        <div className="w-full lg:w-1/2 xl:w-5/12 h-full flex flex-col bg-surface-light dark:bg-surface-dark overflow-y-auto relative z-10 shadow-xl">
          {/* Header / Logo */}
          <div className="px-6 py-6 lg:px-12 lg:py-8 flex items-center justify-between">
            <div className="flex items-center gap-3 text-text-main dark:text-white group cursor-pointer">
              <div className="size-8 bg-tiak-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-tiak-primary/30">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">SUNU COLIS</h2>
            </div>
            <a className="text-sm font-medium text-text-muted hover:text-tiak-primary dark:text-gray-400 dark:hover:text-tiak-primary transition-colors" href="#">
              Aide
            </a>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 py-4 max-w-[600px] mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-text-main dark:text-white mb-3 tracking-tight">
                Créer un compte
              </h1>
              <p className="text-text-muted dark:text-gray-400 text-base">
                La logistique simplifiée pour vos ventes en ligne à Dakar.
              </p>
            </div>

            {/* Role Selector */}
            <div className="mb-8">
              <div className="flex p-1 bg-background-light dark:bg-background-dark rounded-xl">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="vendeur"
                    checked={role === 'vendeur'}
                    onChange={() => setRole('vendeur')}
                    className="peer sr-only"
                  />
                  <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-text-muted dark:text-gray-400 peer-checked:bg-white dark:peer-checked:bg-tiak-primary peer-checked:text-text-main dark:peer-checked:text-white peer-checked:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                    <span>Vendeur</span>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="livreur"
                    checked={role === 'livreur'}
                    onChange={() => setRole('livreur')}
                    className="peer sr-only"
                  />
                  <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-text-muted dark:text-gray-400 peer-checked:bg-white dark:peer-checked:bg-tiak-primary peer-checked:text-text-main dark:peer-checked:text-white peer-checked:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
                    <span>Livreur</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: Moussa Diop"
                    className="w-full h-12 px-4 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:ring-2 focus:ring-tiak-primary/20 focus:border-tiak-primary text-base placeholder:text-text-muted/60 dark:text-white transition-all outline-none"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/50">
                    person
                  </span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-2">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="nom@exemple.com"
                    className="w-full h-12 px-4 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:ring-2 focus:ring-tiak-primary/20 focus:border-tiak-primary text-base placeholder:text-text-muted/60 dark:text-white transition-all outline-none"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/50">
                    mail
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-2">
                  Numéro de téléphone
                </label>
                <div className="flex rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark overflow-hidden focus-within:ring-2 focus-within:ring-tiak-primary/20 focus-within:border-tiak-primary transition-all">
                  <div className="flex items-center justify-center px-4 bg-background-light dark:bg-background-dark/50 border-r border-border-light dark:border-border-dark">
                    <span className="text-sm font-semibold text-text-muted flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">flag</span> +221
                    </span>
                  </div>
                  <input
                    type="tel"
                    placeholder="77 000 00 00"
                    className="flex-1 h-12 px-4 border-none bg-transparent focus:ring-0 text-base placeholder:text-text-muted/60 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Password Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full h-12 px-4 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:ring-2 focus:ring-tiak-primary/20 focus:border-tiak-primary text-base placeholder:text-text-muted/60 dark:text-white transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/50 hover:text-text-muted transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-2">
                    Confirmer
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-12 px-4 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:ring-2 focus:ring-tiak-primary/20 focus:border-tiak-primary text-base placeholder:text-text-muted/60 dark:text-white transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 w-full h-12 bg-tiak-primary hover:bg-tiak-primary-dark text-white text-base font-bold rounded-lg shadow-lg shadow-tiak-primary/25 transition-all flex items-center justify-center gap-2 group"
              >
                <span>S'inscrire</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              {/* Divider */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-light dark:border-border-dark" />
                </div>
                <span className="relative z-10 px-4 bg-surface-light dark:bg-surface-dark text-xs font-medium text-text-muted uppercase tracking-wider">
                  ou continuer avec
                </span>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors bg-white dark:bg-background-dark/50"
                >
                  <span
                    className="font-bold text-lg font-display"
                    style={{
                      background: 'linear-gradient(45deg, #4285F4, #DB4437, #F4B400, #0F9D58)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    G
                  </span>
                  <span className="text-sm font-semibold text-text-main dark:text-white">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors bg-white dark:bg-background-dark/50"
                >
                  <span className="font-bold text-lg text-[#1877F2]">f</span>
                  <span className="text-sm font-semibold text-text-main dark:text-white">Facebook</span>
                </button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-sm text-text-muted dark:text-gray-400">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="font-bold text-tiak-primary hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-text-muted/60 dark:text-gray-500 max-w-xs mx-auto leading-relaxed">
                En vous inscrivant, vous acceptez nos{' '}
                <a className="underline hover:text-tiak-primary" href="#">
                  Conditions Générales
                </a>{' '}
                et notre{' '}
                <a className="underline hover:text-tiak-primary" href="#">
                  Politique de Confidentialité
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Map Visual */}
        <div className="hidden lg:block lg:w-1/2 xl:w-7/12 relative bg-gray-100 overflow-hidden">
          {/* Map Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center grayscale contrast-125 opacity-90"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgsFmKR-Ap2WYdbH2kst0aG7sVsVpxaRH46tuPExux7ASReLwLsXL8UPV6WDhnL3NrTivi9fu4jOayNDYOk-8WrtguqeWSoRFMb-5tQ7rRYFQBDCirCgRjfmOlhj0-wJR3idxchnMqMaGrmh7zX5Z-9-G-obCMuFAYwoRiov_rwFGXuNYGARzAapXYJYKhYZ19wM7A0T8gDlNkmPQMYA8hvE0106x_Hzi1Gxl8NcGR1brEj3S-b0-0LC40wq_2nXkfbUzBCwMmsVIc")`,
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-tiak-primary/10 mix-blend-multiply" />

          {/* Floating UI Elements */}
          <div className="absolute top-10 right-10">
            <div className="bg-white dark:bg-surface-dark/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/20 dark:border-white/10 w-64 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase">Statut</p>
                  <p className="text-sm font-bold text-text-main dark:text-white">Livraison effectuée</p>
                </div>
              </div>
              <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-full rounded-full" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-16 left-16 max-w-md">
            <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md">
              Boostez votre business<br />à Dakar.
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-white/90">
                <span className="material-symbols-outlined text-tiak-primary bg-white rounded-full p-1 text-sm">bolt</span>
                <span className="text-lg font-medium">Livraisons ultra-rapides</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <span className="material-symbols-outlined text-tiak-primary bg-white rounded-full p-1 text-sm">map</span>
                <span className="text-lg font-medium">Suivi en temps réel</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <span className="material-symbols-outlined text-tiak-primary bg-white rounded-full p-1 text-sm">savings</span>
                <span className="text-lg font-medium">Tarifs compétitifs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
