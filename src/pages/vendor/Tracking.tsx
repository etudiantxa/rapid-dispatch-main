import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { Delivery } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DeliveryDetailsCard from '@/components/DeliveryDetailsCard';

const fetchDeliveries = async (): Promise<Delivery[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const { data } = await axios.get('/api/deliveries', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.sort((a: Delivery, b: Delivery) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const Tracking = () => {
    const { data: deliveries = [], isLoading: loading } = useQuery<Delivery[]>({
        queryKey: ['deliveries'],
        queryFn: fetchDeliveries
    });

    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDeliveries = deliveries.filter(d =>
        d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        // Automatically select the first delivery if none is selected
        if (!selectedDelivery && filteredDeliveries.length > 0) {
            setSelectedDelivery(filteredDeliveries[0]);
        }
        // If the selected delivery is no longer in the filtered list, reset selection
        if (selectedDelivery && !filteredDeliveries.some(d => d._id === selectedDelivery._id)) {
             setSelectedDelivery(filteredDeliveries.length > 0 ? filteredDeliveries[0] : null);
        }
    }, [filteredDeliveries, selectedDelivery]);

    const getStatusVariant = (status: string) => ({
        'pending': 'secondary', 'assigned': 'warning', 'in_transit': 'info',
        'delivered': 'success', 'cancelled': 'destructive'
    }[status] || 'default');

     const getStatusText = (status: string) => ({
        'pending': 'En attente', 'assigned': 'Assignée', 'in_transit': 'En transit',
        'delivered': 'Livrée', 'cancelled': 'Annulée'
    }[status] || status);

    return (
        <div className="bg-uber-dark-gray text-white h-screen flex w-full font-sans">
            <Sidebar userType="vendor" />
            <main className="flex-1 flex flex-col min-w-0 h-screen">
                <Header onSearchChange={setSearchTerm} />
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2 p-2 overflow-hidden">

                    {/* Delivery List Column */}
                    <div className="lg:col-span-1 h-full bg-uber-black rounded-lg overflow-y-auto">
                         <div className="p-4 sticky top-0 bg-uber-black z-10">
                            <h1 className="text-xl font-bold">Toutes les courses</h1>
                         </div>
                         <div className="px-4 pb-4">
                             {loading ? (
                                <div className="text-center text-gray-400 py-10">Chargement...</div>
                            ) : filteredDeliveries.length > 0 ? (
                                <div className="space-y-2">
                                    {filteredDeliveries.map((delivery) => (
                                        <button key={delivery._id} onClick={() => setSelectedDelivery(delivery)} className={`w-full text-left transition-all rounded-lg border-2 ${selectedDelivery?._id === delivery._id ? 'bg-uber-gray border-tiak-green' : 'border-transparent hover:bg-uber-gray'}`}>
                                            <CardContent className="p-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="font-semibold">{delivery.clientName}</p>
                                                    <Badge variant={getStatusVariant(delivery.status)}>{getStatusText(delivery.status)}</Badge>
                                                </div>
                                                <p className="text-gray-400 text-sm font-mono">#{delivery._id.substring(0, 8)}</p>
                                            </CardContent>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-400">Aucune livraison trouvée.</p>
                                </div>
                            )}
                         </div>
                    </div>

                    {/* Delivery Details Column */}
                    <div className="lg:col-span-2 h-full hidden lg:block rounded-lg">
                        <DeliveryDetailsCard delivery={selectedDelivery} />
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Tracking;
