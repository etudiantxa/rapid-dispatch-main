import { Delivery } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

const MapPlaceholder = () => (
    <div className="w-full h-full bg-uber-gray rounded-lg flex items-center justify-center relative overflow-hidden">
        <span className="material-symbols-outlined text-gray-500 text-6xl">map</span>
        <p className="absolute text-gray-400 font-medium">Aperçu de la carte non disponible</p>
    </div>
);

const getStatusVariant = (status: string) => ({
    'pending': 'secondary', 'assigned': 'warning', 'in_transit': 'info',
    'delivered': 'success', 'cancelled': 'destructive'
}[status] || 'default');

const getStatusText = (status: string) => ({
    'pending': 'En attente', 'assigned': 'Assignée', 'in_transit': 'En transit',
    'delivered': 'Livrée', 'cancelled': 'Annulée'
}[status] || status);

interface DeliveryDetailsCardProps {
  delivery: Delivery | null;
}

const DeliveryDetailsCard = ({ delivery }: DeliveryDetailsCardProps) => {

    const statusHistory = useMemo(() => {
        if (!delivery) return [];
        const history = [{ status: 'pending', text: 'Livraison créée', date: delivery.createdAt, icon: 'receipt_long' }];
        if (delivery.assignedAt) history.push({ status: 'assigned', text: `Assignée à ${delivery.courier?.name || 'un livreur'}`, date: delivery.assignedAt, icon: 'person_check' });
        if (delivery.pickedUpAt) history.push({ status: 'in_transit', text: 'Colis récupéré', date: delivery.pickedUpAt, icon: 'inventory_2' });
        if (delivery.deliveredAt) history.push({ status: 'delivered', text: 'Livraison effectuée', date: delivery.deliveredAt, icon: 'task_alt' });
        return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [delivery]);

    if (!delivery) {
        return (
            <div className="h-full flex items-center justify-center bg-uber-black border border-uber-gray rounded-2xl">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">apps</span>
                    <p className="text-gray-400">Sélectionnez une livraison pour voir les détails</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full grid grid-rows-2 gap-4 bg-uber-black border border-uber-gray rounded-2xl p-4 overflow-y-auto">
            <div className="row-span-1"><MapPlaceholder /></div>

            <div className="row-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-uber-dark-gray border-uber-gray">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Informations</span>
                            <Badge variant={getStatusVariant(delivery.status)}>{getStatusText(delivery.status)}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Client</span><span className="font-medium">{delivery.clientName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Adresse</span><span className="font-medium text-right">{delivery.deliveryAddress}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Colis</span><span>{delivery.itemCount} article(s)</span></div>
                         {delivery.courier && <div className="flex justify-between pt-2 border-t border-uber-gray"><span className="text-gray-400">Livreur</span><span className="font-medium">{delivery.courier.name}</span></div>}
                    </CardContent>
                </Card>
                 <Card className="bg-uber-dark-gray border-uber-gray">
                    <CardHeader><CardTitle>Historique</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {statusHistory.map((item, index) => (
                             <div key={index} className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-uber-gray flex items-center justify-center">
                                    <span className="material-symbols-outlined text-tiak-green text-lg">{item.icon}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{item.text}</p>
                                    <p className="text-xs text-gray-400">{new Date(item.date).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DeliveryDetailsCard;
