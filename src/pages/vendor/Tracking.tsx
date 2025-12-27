import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Delivery } from '@/types';

const Tracking = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

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
                setDeliveries(data.sort((a: Delivery, b: Delivery) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                setFilteredDeliveries(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching deliveries:', error);
                setLoading(false);
            }
        };
        fetchDeliveries();
    }, []);

    useEffect(() => {
        let result = deliveries;
        if (activeTab !== 'all') {
            result = result.filter(d => d.status === activeTab);
        }
        if (searchTerm) {
            result = result.filter(d =>
                d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.destination.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredDeliveries(result);
    }, [searchTerm, activeTab, deliveries]);


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

    const tabs = [
        { id: 'all', label: 'Toutes' },
        { id: 'pending', label: 'En attente' },
        { id: 'in_transit', label: 'En transit' },
        { id: 'delivered', label: 'Terminées' },
    ];

    return (
        <div className="bg-uber-dark-gray text-white h-screen flex w-full font-sans">
            <Sidebar userType="vendor" />
            <main className="flex-1 flex flex-col min-w-0">
                <Header onSearchChange={setSearchTerm} />
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Suivi des livraisons</h1>
                        </div>

                        <div className="mb-6">
                            <div className="border-b border-uber-gray flex space-x-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-white border-b-2 border-tiak-green' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {tab.label} ({tab.id === 'all' ? deliveries.length : deliveries.filter(d => d.status === tab.id).length})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center text-gray-400 py-10">Chargement des livraisons...</div>
                        ) : filteredDeliveries.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredDeliveries.map((delivery) => (
                                    <Link to={`/vendor/tracking/${delivery._id}`} key={delivery._id}>
                                        <Card className="bg-uber-black border-uber-gray hover:border-tiak-green transition-all h-full flex flex-col">
                                            <CardContent className="p-5 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <p className="font-bold text-lg">{delivery.clientName}</p>
                                                        <Badge variant={getStatusVariant(delivery.status)} className="capitalize">{getStatusText(delivery.status)}</Badge>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-base">pin_drop</span>
                                                        {delivery.destination}
                                                    </p>
                                                     <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-base">receipt_long</span>
                                                        <span className="font-mono text-xs">#{delivery._id.substring(0, 12)}</span>
                                                    </p>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-4 text-right">
                                                   {new Date(delivery.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-uber-black rounded-2xl border border-uber-gray">
                                <p className="text-gray-400 mb-4">Aucune livraison ne correspond à vos critères.</p>
                                {deliveries.length === 0 && (
                                    <Link to="/vendor/create-delivery" className="px-6 py-3 rounded-lg bg-tiak-green hover:bg-tiak-green-hover text-black font-bold transition-colors">
                                        Créer votre première livraison
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Tracking;
