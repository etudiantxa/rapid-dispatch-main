import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Delivery } from '@/types';


const VendorDashboard = () => {
    const { user } = useUser();
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const { data } = await axios.get('/api/deliveries', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDeliveries(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching deliveries:', error);
                setLoading(false);
            }
        };
        fetchDeliveries();
    }, []);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'pending': return 'secondary';
            case 'assigned': return 'warning';
            case 'in_transit': return 'info';
            case 'delivered': return 'success';
            case 'cancelled': return 'destructive';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        const texts: { [key: string]: string } = {
            pending: 'En attente',
            assigned: 'Assignée',
            in_transit: 'En transit',
            delivered: 'Livrée',
            cancelled: 'Annulée'
        };
        return texts[status] || status;
    };

    const totalDeliveries = deliveries.length;
    const completedDeliveries = deliveries.filter(d => d.status === 'delivered').length;
    const pendingDeliveries = totalDeliveries - completedDeliveries;
    const completionRate = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;
    const recentDeliveries = deliveries.slice(-5).reverse();

    return (
        <div className="bg-uber-dark-gray text-white h-screen flex w-full font-sans">
            <Sidebar userType="vendor" />
            <main className="flex-1 flex flex-col min-w-0">
                <Header showSearch={false} />
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">Bienvenue, {user?.name || 'Vendeur'} !</h1>
                            <p className="text-gray-400">Voici un aperçu de vos livraisons.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <Card className="bg-uber-black border-uber-gray">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Total Livraisons</CardTitle>
                                    <span className="material-symbols-outlined text-gray-500">local_shipping</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalDeliveries}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-uber-black border-uber-gray">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Livraisons Terminées</CardTitle>
                                    <span className="material-symbols-outlined text-gray-500">task_alt</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{completedDeliveries}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-uber-black border-uber-gray">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">Taux de Réussite</CardTitle>
                                    <span className="material-symbols-outlined text-gray-500">trending_up</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
                                    <Progress value={completionRate} className="mt-2 h-2" indicatorClassName="bg-tiak-green" />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-uber-black border border-uber-gray rounded-2xl p-6 lg:p-8">
                            <h2 className="text-xl font-bold mb-6">Livraisons Récentes</h2>
                            {loading ? (
                                <div className="text-center text-gray-400">Chargement...</div>
                            ) : recentDeliveries.length > 0 ? (
                                <div className="space-y-4">
                                    {recentDeliveries.map((delivery) => (
                                        <div key={delivery._id} className="grid grid-cols-3 md:grid-cols-5 gap-4 items-center p-4 rounded-lg bg-uber-dark-gray hover:bg-uber-gray transition-colors">
                                            <div><p className="font-mono text-xs text-gray-500">#{delivery._id.substring(0, 6)}</p></div>
                                            <div><p className="font-medium">{delivery.clientName}</p></div>
                                            <div className="hidden md:block"><p className="text-gray-400">{delivery.destination}</p></div>
                                            <div><Badge variant={getStatusVariant(delivery.status)} className="capitalize">{getStatusText(delivery.status)}</Badge></div>
                                            <div className="text-right">
                                                <Link to={`/vendor/tracking/${delivery._id}`} className="p-2 rounded-full hover:bg-uber-gray-medium transition-colors">
                                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-400 mb-4">Vous n'avez pas encore de livraisons.</p>
                                    <Link to="/vendor/create-delivery" className="px-6 py-3 rounded-lg bg-tiak-green hover:bg-tiak-green-hover text-black font-bold transition-colors">
                                        Créer une livraison
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorDashboard;
