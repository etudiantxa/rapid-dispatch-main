import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login } = useUser();


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            login(data.token, data.user); // Pass both token and user object

            toast({ title: "Connexion réussie", description: `Bienvenue, ${data.user.name}!` });

            if (data.user.role === 'vendor') {
                navigate('/vendor/dashboard');
            } else if (data.user.role === 'courier') {
                navigate('/courier/dashboard');
            } else {
                navigate('/');
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de la connexion.";
            toast({ title: "Échec de la connexion", description: errorMessage, variant: "destructive" });
            setLoading(false);
        }
    };

    return (
        <div className="bg-uber-black text-white min-h-screen flex items-center justify-center font-sans">
            <div className="absolute top-8 left-8">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.svg" alt="Tiak-Tiak Logo" className="h-8 w-auto" />
                    <span className="text-2xl font-bold">Tiak-Tiak</span>
                </Link>
            </div>
            <div className="w-full max-w-md p-8 space-y-8">
                <div>
                    <h1 className="text-4xl font-bold">Connectez-vous</h1>
                    <p className="text-gray-400 mt-2">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-tiak-green hover:underline font-medium">Inscrivez-vous</Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Adresse e-mail</label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nom@exemple.com"
                            required
                            className="bg-uber-gray border-uber-gray-medium focus:border-tiak-green"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label htmlFor="password" className="block text-sm font-medium text-gray-300">Mot de passe</label>
                             <Link to="/forgot-password" className="text-sm text-tiak-green hover:underline">Mot de passe oublié ?</Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                            className="bg-uber-gray border-uber-gray-medium focus:border-tiak-green"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-tiak-green hover:bg-tiak-green-hover text-black font-bold" disabled={loading}>
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
