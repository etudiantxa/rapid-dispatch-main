import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { useUser } from '@/context/UserContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'vendor',
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    try {
      const { data } = await axios.post('/api/auth/register', formData);
      await login(data.token);
      if (formData.role === 'vendor') {
        navigate('/vendor/tracking');
      } else {
        navigate('/courier/home');
      }
    } catch (error) {
      toast({ title: "Erreur d'inscription", description: "Cet utilisateur existe peut-être déjà.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un nouveau compte
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <div className="mt-1">
                <input id="name" name="name" type="text" required onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
              <div className="mt-1">
                <input id="phone" name="phone" type="text" required onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" autoComplete="email" required onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" required onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <div className="mt-1">
                <input id="confirmPassword" name="confirmPassword" type="password" required onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle</label>
              <div className="mt-1">
                <select name="role" onChange={(e) => setFormData({...formData, role: e.target.value})} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="vendor">Vendeur</option>
                  <option value="courier">Livreur</option>
                </select>
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                S'inscrire
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Vous avez déjà un compte ?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/login" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
