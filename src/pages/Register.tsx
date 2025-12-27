import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('vendor');
    const [vehicleType, setVehicleType] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const userData = { name, email, password, phone, role, ...(role === 'courier' && { vehicleType }) };

        try {
            await axios.post('/api/auth/register', userData);
            toast({ title: "Inscription réussie", description: "Vous pouvez maintenant vous connecter." });
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de l'inscription.";
            toast({ title: "Échec de l'inscription", description: errorMessage, variant: "destructive" });
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
                    <h1 className="text-4xl font-bold">Créer un compte</h1>
                    <p className="text-gray-400 mt-2">
                        Déjà inscrit ?{' '}
                        <Link to="/login" className="text-tiak-green hover:underline font-medium">Connectez-vous</Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => setRole('vendor')} className={`px-4 py-3 rounded-lg font-medium transition-colors ${role === 'vendor' ? 'bg-tiak-green text-black' : 'bg-uber-gray'}`}>
                            Je suis un Vendeur
                        </button>
                        <button type="button" onClick={() => setRole('courier')} className={`px-4 py-3 rounded-lg font-medium transition-colors ${role === 'courier' ? 'bg-tiak-green text-black' : 'bg-uber-gray'}`}>
                            Je suis un Livreur
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
                            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Moussa Diop" required className="bg-uber-gray border-uber-gray-medium focus:border-tiak-green"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
                            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+221 77 000 00 00" required className="bg-uber-gray border-uber-gray-medium focus:border-tiak-green"/>
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Adresse e-mail</label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nom@exemple.com" required className="bg-uber-gray border-uber-gray-medium focus:border-tiak-green"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required className="bg-uber-gray border-uber-gray-medium focus:border-tiak-green"/>
                    </div>

                    {role === 'courier' && (
                        <div>
                             <label className="block text-sm font-medium text-gray-300 mb-2">Type de véhicule</label>
                             <Select onValueChange={setVehicleType} required>
                                <SelectTrigger className="bg-uber-gray border-uber-gray-medium focus:border-tiak-green">
                                    <SelectValue placeholder="Sélectionner un véhicule" />
                                </SelectTrigger>
                                <SelectContent className="bg-uber-dark-gray text-white border-uber-gray">
                                    <SelectItem value="Scooter">Scooter</SelectItem>
                                    <SelectItem value="Moto">Moto</SelectItem>
                                    <SelectItem value="Voiture">Voiture</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}


                    <Button type="submit" className="w-full bg-tiak-green hover:bg-tiak-green-hover text-black font-bold" disabled={loading}>
                        {loading ? 'Création du compte...' : 'S\'inscrire'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Register;
