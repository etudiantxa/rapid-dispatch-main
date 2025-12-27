import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Un email avec les instructions pour réinitialiser votre mot de passe a été envoyé.');
      toast({ title: 'Succès', description: 'Veuillez consulter votre boîte de réception.' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue.';
      toast({ title: 'Erreur', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-uber-black text-white min-h-screen flex items-center justify-center font-sans p-4">
       <div className="absolute top-8 left-8">
            <Link to="/" className="flex items-center gap-2">
                <img src="/logo.svg" alt="Tiak-Tiak Logo" className="h-8 w-auto" />
                <span className="text-2xl font-bold">Tiak-Tiak</span>
            </Link>
        </div>
      <Card className="w-full max-w-md bg-uber-dark-gray border-uber-gray">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
          <CardDescription>Entrez votre email pour recevoir un lien de réinitialisation.</CardDescription>
        </CardHeader>
        <CardContent>
          {message ? (
             <div className="text-center p-4 bg-tiak-green/10 rounded-lg">
                <p className="text-tiak-green">{message}</p>
                <Link to="/login" className="text-sm text-gray-300 hover:underline mt-4 block">Retour à la connexion</Link>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
              <Button type="submit" className="w-full bg-tiak-green hover:bg-tiak-green-hover text-black font-bold" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </Button>
            </form>
          )}
           <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Se souvenir de votre mot de passe ? Connectez-vous.
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
