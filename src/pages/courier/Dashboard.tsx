import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Delivery } from '@/types';
import { useToast } from '@/components/ui/use-toast';


const CourierDashboard = () => {
    const { user } = useUser();
    const { toast } = useToast();
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDeliveries = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { setLoading(false); return; }
            const { data } = await axios.get('/api/deliveries/available', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDeliveries(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const handleAcceptDelivery = async (deliveryId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/deliveries/${deliveryId}/assign`, {}, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            toast({ title: 'Succès', description: 'Livraison acceptée !' });
            fetchDeliveries(); // Refresh the list
        } catch (error) {
             toast({ title: 'Erreur', description: 'Impossible d\'accepter la livraison.', variant: 'destructive' });
        }
    };

    const totalDeliveries = deliveries.length;
    const deliveriesByNeighborhood = deliveries.reduce((acc, d) => {
        acc[d.destination] = (acc[d.destination] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="bg-uber-dark-gray text-white h-screen flex w-full font-sans">
            <Sidebar userType="courier" />
            <main className="flex-1 flex flex-col min-w-0">
                <Header showSearch={false} showNewDeliveryButton={false} />
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">Bienvenue, {user?.name || 'Livreur'} !</h1>
                            <p className="text-gray-400">Voici les livraisons disponibles près de vous.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <Card className="bg-uber-black border-uber-gray">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Courses Disponibles</CardTitle>
                                    <span className="material-symbols-outlined text-gray-500">near_me</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalDeliveries}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-uber-black border-uber-gray md:col-span-2">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Répartition par quartier</CardTitle>
                                    <span className="material-symbols-outlined text-gray-500">pie_chart</span>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                                   {Object.keys(deliveriesByNeighborhood).length > 0 ? Object.entries(deliveriesByNeighborhood).map(([quartier, count]) => (
                                       <Badge key={quartier} variant="secondary">{quartier} ({count})</Badge>
                                   )) : <p className="text-sm text-gray-500">Aucune course pour le moment.</p>}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-uber-black border border-uber-gray rounded-2xl p-6 lg:p-8">
                            <h2 className="text-xl font-bold mb-6">Liste des courses</h2>
                             {loading ? (
                                <div className="text-center text-gray-400">Chargement...</div>
                            ) : deliveries.length > 0 ? (
                                <div className="space-y-4">
                                    {deliveries.map((delivery) => (
                                        <div key={delivery._id} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center p-4 rounded-lg bg-uber-dark-gray hover:bg-uber-gray transition-colors">
                                            <div>
                                                <p className="font-medium">{delivery.destination}</p>
                                                <p className="text-xs text-gray-400">À: {delivery.deliveryAddress}</p>
                                            </div>
                                             <div className="hidden md:block">
                                                <p className="font-medium">{delivery.vendor.name}</p>
                                                <p className="text-xs text-gray-400">Vendeur</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-tiak-green">1 500 FCFA</p>
                                                <p className="text-xs text-gray-400">Gain estimé</p>
                                            </div>
                                            <div className="text-right">
                                                <Button size="sm" className="bg-tiak-green hover:bg-tiak-green-hover text-black font-bold" onClick={() => handleAcceptDelivery(delivery._id)}>
                                                    Accepter
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                               <div className="text-center py-10">
                                    <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">snooze</span>
                                    <p className="text-gray-400 mb-2">Aucune livraison disponible pour le moment.</p>
                                    <p className="text-sm text-gray-500">Revenez plus tard ou vérifiez vos notifications.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourierDashboard;
