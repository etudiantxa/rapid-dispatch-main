import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Delivery } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const CourierDeliveries = () => {
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      const { data } = await axios.get('/api/deliveries/courier', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeliveries(data.sort((a: Delivery, b: Delivery) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleUpdateStatus = async (deliveryId: string, status: 'picked_up' | 'delivered', otpValue?: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/deliveries/${deliveryId}/status`,
        { status, ...(otpValue && { otp: otpValue }) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: 'Succès', description: `Statut de la livraison mis à jour.` });
      fetchDeliveries(); // Refresh list
      setIsOtpModalOpen(false);
      setIsPickupModalOpen(false);
      setOtp('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue.';
      toast({ title: 'Erreur', description: errorMessage, variant: 'destructive' });
    }
  };


  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'assigned': return 'warning';
      case 'in_transit': return 'info';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      assigned: 'Assignée',
      in_transit: 'En transit',
      delivered: 'Livrée',
    };
    return texts[status] || status;
  };

  const openPickupModal = (deliveryId: string) => {
    setSelectedDeliveryId(deliveryId);
    setIsPickupModalOpen(true);
  };

  const openOtpModal = (deliveryId: string) => {
    setSelectedDeliveryId(deliveryId);
    setIsOtpModalOpen(true);
  };

  const tabs = [
    { id: 'assigned', label: 'Assignées' },
    { id: 'in_transit', label: 'En cours' },
    { id: 'delivered', label: 'Terminées' },
  ];

  const filteredDeliveries = deliveries.filter(d => d.status === activeTab);

  const renderActionForDelivery = (delivery: Delivery) => {
    switch (delivery.status) {
      case 'assigned':
        return <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white font-bold" onClick={() => openPickupModal(delivery._id)}>Récupéré ?</Button>;
      case 'in_transit':
        return <Button size="sm" className="bg-tiak-green hover:bg-tiak-green-hover text-black font-bold" onClick={() => openOtpModal(delivery._id)}>Livré ?</Button>;
      case 'delivered':
        return <p className="text-sm text-gray-400">Terminée</p>;
      default:
        return null;
    }
  };


  return (
    <>
      <div className="bg-uber-dark-gray text-white h-screen flex w-full font-sans">
        <Sidebar userType="courier" />
        <main className="flex-1 flex flex-col min-w-0">
          <Header showSearch={false} showNewDeliveryButton={false} />
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Mes Courses</h1>
              <div className="mb-6">
                <div className="border-b border-uber-gray flex space-x-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-white border-b-2 border-tiak-green' : 'text-gray-400 hover:text-white'}`}
                    >
                      {tab.label} ({deliveries.filter(d => d.status === tab.id).length})
                    </button>
                  ))}
                </div>
              </div>

               {loading ? (
                    <div className="text-center text-gray-400 py-10">Chargement...</div>
                ) : filteredDeliveries.length > 0 ? (
                    <div className="space-y-4">
                        {filteredDeliveries.map((delivery) => (
                           <Card key={delivery._id} className="bg-uber-black border-uber-gray">
                             <CardContent className="p-4">
                               <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                                 <div>
                                     <p className="font-bold">{delivery.destination}</p>
                                     <p className="text-xs text-gray-400">{delivery.deliveryAddress}</p>
                                 </div>
                                  <div>
                                     <p className="font-medium">{delivery.clientName}</p>
                                     <p className="text-xs text-gray-400">{delivery.clientPhone}</p>
                                 </div>
                                  <div className="hidden md:block">
                                     <p className="font-medium">{delivery.vendor.name}</p>
                                     <p className="text-xs text-gray-400">Vendeur</p>
                                 </div>
                                 <div className="hidden md:block">
                                    <Badge variant={getStatusVariant(delivery.status)}>{getStatusText(delivery.status)}</Badge>
                                 </div>
                                 <div className="text-right">
                                    {renderActionForDelivery(delivery)}
                                 </div>
                               </div>
                             </CardContent>
                           </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-uber-black rounded-2xl border border-uber-gray">
                        <p className="text-gray-400">Aucune course dans cette catégorie.</p>
                    </div>
                )}
            </div>
          </div>
        </main>
      </div>

       {/* Pickup Confirmation Modal */}
      <Dialog open={isPickupModalOpen} onOpenChange={setIsPickupModalOpen}>
        <DialogContent className="bg-uber-black text-white border-uber-gray">
          <DialogHeader>
            <DialogTitle>Confirmation de récupération</DialogTitle>
            <DialogDescription>
              Confirmez-vous avoir récupéré le colis chez le vendeur ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsPickupModalOpen(false)}>Annuler</Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => selectedDeliveryId && handleUpdateStatus(selectedDeliveryId, 'picked_up')}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* OTP Modal */}
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="bg-uber-black text-white border-uber-gray">
          <DialogHeader>
            <DialogTitle>Confirmer la livraison</DialogTitle>
            <DialogDescription>
              Veuillez entrer le code OTP reçu par le client pour finaliser la livraison.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="text"
              placeholder="Code OTP à 4 chiffres"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-uber-dark-gray border-uber-gray-medium text-center text-lg tracking-[0.5em]"
              maxLength={4}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOtpModalOpen(false)}>Annuler</Button>
            <Button className="bg-tiak-green hover:bg-tiak-green-hover text-black" onClick={() => selectedDeliveryId && handleUpdateStatus(selectedDeliveryId, 'delivered', otp)}>Valider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourierDeliveries;
