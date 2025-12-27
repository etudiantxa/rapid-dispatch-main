import { useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const { data } = await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(data.message);
      toast({ title: 'Succès', description: 'Votre mot de passe a été réinitialisé.' });
      setTimeout(() => navigate('/login'), 2000);
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
          <CardTitle className="text-2xl font-bold">Réinitialiser le mot de passe</CardTitle>
          <CardDescription>Entrez votre nouveau mot de passe.</CardDescription>
        </CardHeader>
        <CardContent>
          {message ? (
            <div className="text-center p-4 bg-tiak-green/10 rounded-lg">
              <p className="text-tiak-green">{message}</p>
              <Link to="/login" className="text-sm text-gray-300 hover:underline mt-4 block">Aller à la connexion</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nouveau mot de passe</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  className="bg-uber-gray border-uber-gray-medium focus:border-tiak-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirmer le mot de passe</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  required
                  className="bg-uber-gray border-uber-gray-medium focus:border-tiak-green"
                />
              </div>
              <Button type="submit" className="w-full bg-tiak-green hover:bg-tiak-green-hover text-black font-bold" disabled={loading}>
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
