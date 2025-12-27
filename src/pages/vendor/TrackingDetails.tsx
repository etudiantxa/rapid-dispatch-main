import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Delivery } from '@/types';

// A simple mock map component
const MapPlaceholder = () => (
    <div className="w-full h-full bg-uber-gray rounded-lg flex items-center justify-center">
        <span className="material-symbols-outlined text-gray-500 text-6xl">map</span>
        <p className="absolute text-gray-400 font-medium">Aperçu de la carte non disponible</p>
    </div>
);


const TrackingDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDelivery = async () => {
            if (!id) return;
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const { data } = await axios.get(`/api/deliveries/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDelivery(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching delivery details:', error);
                setLoading(false);
            }
        };
        fetchDelivery();
    }, [id, navigate]);

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

    const statusHistory = useMemo(() => {
        if (!delivery) return [];
        const history = [
            { status: 'pending', text: 'Livraison créée', date: delivery.createdAt, icon: 'receipt_long' },
        ];
        if (delivery.assignedAt) {
            history.push({ status: 'assigned', text: `Assignée à ${delivery.courier?.name || 'un livreur'}`, date: delivery.assignedAt, icon: 'person_check' });
        }
        if (delivery.pickedUpAt) {
            history.push({ status: 'in_transit', text: 'Colis récupéré', date: delivery.pickedUpAt, icon: 'inventory_2' });
        }
         if (delivery.deliveredAt) {
            history.push({ status: 'delivered', text: 'Livraison effectuée', date: delivery.deliveredAt, icon: 'task_alt' });
        }
        return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [delivery]);


    if (loading) {
        return <div className="bg-uber-dark-gray text-white h-screen flex items-center justify-center">Chargement...</div>;
    }

    if (!delivery) {
        return <div className="bg-uber-dark-gray text-white h-screen flex items-center justify-center">Impossible de trouver la livraison.</div>;
    }


    return (
        <div className="bg-uber-dark-gray text-white h-screen flex w-full font-sans">
            <Sidebar userType="vendor" />
            <main className="flex-1 flex flex-col min-w-0">
                <Header showNewDeliveryButton={false} showSearch={false} />
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-uber-gray transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold">Détails de la livraison</h1>
                                <p className="text-gray-400 text-sm font-mono">#{delivery._id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="bg-uber-black border-uber-gray h-[400px]">
                                    <CardContent className="p-0 h-full">
                                        <MapPlaceholder />
                                    </CardContent>
                                </Card>
                                <Card className="bg-uber-black border-uber-gray">
                                    <CardHeader><CardTitle>Historique du statut</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {statusHistory.map((item, index) => (
                                                 <div key={index} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="size-9 rounded-full bg-uber-gray flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-tiak-green text-lg">{item.icon}</span>
                                                        </div>
                                                        {index < statusHistory.length -1 && <div className="w-0.5 flex-1 bg-uber-gray my-2"></div>}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{item.text}</p>
                                                        <p className="text-xs text-gray-400">{new Date(item.date).toLocaleString('fr-FR')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="space-y-6">
                                <Card className="bg-uber-black border-uber-gray">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>Informations</span>
                                            <Badge variant={getStatusVariant(delivery.status)} className="capitalize">{getStatusText(delivery.status)}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-400">Client</span><span className="font-medium">{delivery.clientName}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Téléphone</span><span className="font-medium">{delivery.clientPhone}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Adresse</span><span className="font-medium text-right">{delivery.deliveryAddress}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Quartier</span><span className="font-medium">{delivery.destination}</span></div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-uber-black border-uber-gray">
                                    <CardHeader><CardTitle>Détails du colis</CardTitle></CardHeader>
                                     <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-400">Description</span><span className="font-medium text-right">{delivery.packageDescription}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Nb. Articles</span><span className="font-medium">{delivery.itemCount}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">Valeur</span><span className="font-medium">{delivery.estimatedValue} FCFA</span></div>
                                        {delivery.specialInstructions && <div className="flex justify-between"><span className="text-gray-400">Instructions</span><span className="font-medium text-right">{delivery.specialInstructions}</span></div>}
                                    </CardContent>
                                </Card>
                                 {delivery.courier && (
                                     <Card className="bg-uber-black border-uber-gray">
                                        <CardHeader><CardTitle>Informations Livreur</CardTitle></CardHeader>
                                        <CardContent className="space-y-3 text-sm">
                                            <div className="flex justify-between"><span className="text-gray-400">Nom</span><span className="font-medium">{delivery.courier.name}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-400">Téléphone</span><span className="font-medium">{delivery.courier.phone}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-400">Véhicule</span><span className="font-medium">{delivery.courier.vehicleType}</span></div>
                                        </CardContent>
                                    </Card>
                                 )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TrackingDetails;
