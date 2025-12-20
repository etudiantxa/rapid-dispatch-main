// Types pour les livraisons
export type DeliveryStatus = 
  | 'CREEE' 
  | 'DISPONIBLE' 
  | 'PRISE_EN_CHARGE' 
  | 'EN_COURS' 
  | 'LIVREE';

export interface Delivery {
  id: string;
  orderId: string;
  clientName: string;
  clientPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  quartier: string;
  packageDescription: string;
  packageCount: number;
  status: DeliveryStatus;
  createdAt: string;
  estimatedDelivery: string;
  courier?: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    rating: number;
    totalDeliveries: number;
  };
  otp: string;
}

export interface Batch {
  id: string;
  quartier: string;
  deliveries: Delivery[];
  totalDeliveries: number;
  estimatedTime: string;
  distance: string;
}

// Données simulées des livreurs
export const mockCouriers = [
  {
    id: 'C001',
    name: 'Ibrahima Faye',
    phone: '+221 77 123 45 67',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-xEIjAbXRv6JVMyCRFGOcfQjGvhugyfMb4K7df_7txueYTWeeipByhvt6_bfSmtOLiaYNLOdT6D3I48jfkVkCaY7RhBwLNvvx588aMSg96fuBIIIt7zRoWfH-eBqxJyMbD3h4yz0m43nsPZywd0JxvPVAquPkasjP-uNIomV2yVg4mUv0ZF8bfYwJ6cLMC7dzbCvXc2No6yvLEx9UMM9Lmnqy6TW6QJxnuLnebyDddbk__muiF2WJuTisUWUFeDKgp4Ziug6Q8q9y',
    rating: 4.9,
    totalDeliveries: 1240,
  },
  {
    id: 'C002',
    name: 'Seydou Kane',
    phone: '+221 78 234 56 78',
    avatar: '',
    rating: 4.7,
    totalDeliveries: 856,
  },
];

// Données simulées des livraisons
export const mockDeliveries: Delivery[] = [
  {
    id: 'D001',
    orderId: 'CMD-4829',
    clientName: 'M. Ndiaye',
    clientPhone: '+221 77 111 22 33',
    pickupAddress: 'Rue 10, Plateau',
    deliveryAddress: 'Avenue Cheikh Anta Diop, Plateau',
    quartier: 'Plateau',
    packageDescription: '2 articles',
    packageCount: 2,
    status: 'EN_COURS',
    createdAt: '2024-01-15T14:00:00',
    estimatedDelivery: '14:45',
    courier: mockCouriers[0],
    otp: '1234',
  },
  {
    id: 'D002',
    orderId: 'CMD-4830',
    clientName: 'A. Diallo',
    clientPhone: '+221 78 222 33 44',
    pickupAddress: 'Marché Sandaga',
    deliveryAddress: 'Cité Biagui, Yoff',
    quartier: 'Yoff',
    packageDescription: '1 colis',
    packageCount: 1,
    status: 'PRISE_EN_CHARGE',
    createdAt: '2024-01-15T14:30:00',
    estimatedDelivery: '15:10',
    courier: mockCouriers[1],
    otp: '5678',
  },
  {
    id: 'D003',
    orderId: 'CMD-4832',
    clientName: 'F. Sow',
    clientPhone: '+221 76 333 44 55',
    pickupAddress: 'Centre Ville',
    deliveryAddress: 'Sacré Coeur, Mermoz',
    quartier: 'Mermoz',
    packageDescription: 'Document',
    packageCount: 1,
    status: 'DISPONIBLE',
    createdAt: '2024-01-15T15:00:00',
    estimatedDelivery: '16:00',
    otp: '9012',
  },
  {
    id: 'D004',
    orderId: 'CMD-4825',
    clientName: 'S. Diop',
    clientPhone: '+221 77 444 55 66',
    pickupAddress: 'Zone A',
    deliveryAddress: 'Les Almadies',
    quartier: 'Almadies',
    packageDescription: 'Cadeau',
    packageCount: 1,
    status: 'LIVREE',
    createdAt: '2024-01-15T12:00:00',
    estimatedDelivery: '13:20',
    courier: mockCouriers[0],
    otp: '3456',
  },
  {
    id: 'D005',
    orderId: 'CMD-4835',
    clientName: 'B. Fall',
    clientPhone: '+221 78 555 66 77',
    pickupAddress: 'Restaurant Le Dakarois',
    deliveryAddress: 'Ouakam Plage',
    quartier: 'Ouakam',
    packageDescription: 'Repas',
    packageCount: 1,
    status: 'CREEE',
    createdAt: '2024-01-15T15:30:00',
    estimatedDelivery: '16:30',
    otp: '7890',
  },
  {
    id: 'D006',
    orderId: 'CMD-4836',
    clientName: 'M. Ba',
    clientPhone: '+221 77 666 77 88',
    pickupAddress: 'Boutique Mode',
    deliveryAddress: 'Liberté 6, Yoff',
    quartier: 'Yoff',
    packageDescription: 'Vêtements',
    packageCount: 3,
    status: 'DISPONIBLE',
    createdAt: '2024-01-15T15:45:00',
    estimatedDelivery: '17:00',
    otp: '2345',
  },
  {
    id: 'D007',
    orderId: 'CMD-4837',
    clientName: 'K. Sarr',
    clientPhone: '+221 76 777 88 99',
    pickupAddress: 'Pharmacie Centrale',
    deliveryAddress: 'Nord Foire, Yoff',
    quartier: 'Yoff',
    packageDescription: 'Médicaments',
    packageCount: 1,
    status: 'DISPONIBLE',
    createdAt: '2024-01-15T16:00:00',
    estimatedDelivery: '17:15',
    otp: '6789',
  },
];

// Regroupement des livraisons par quartier (batching)
export const getBatchesByQuartier = (): Batch[] => {
  const quartierMap = new Map<string, Delivery[]>();
  
  mockDeliveries
    .filter(d => d.status === 'DISPONIBLE')
    .forEach(delivery => {
      const existing = quartierMap.get(delivery.quartier) || [];
      quartierMap.set(delivery.quartier, [...existing, delivery]);
    });
  
  return Array.from(quartierMap.entries()).map(([quartier, deliveries], index) => ({
    id: `B00${index + 1}`,
    quartier,
    deliveries,
    totalDeliveries: deliveries.length,
    estimatedTime: `${20 + deliveries.length * 10} min`,
    distance: `${(2 + Math.random() * 5).toFixed(1)} km`,
  }));
};

// Liste des quartiers de Dakar
export const dakarQuartiers = [
  'Plateau',
  'Almadies',
  'Yoff',
  'Ouakam',
  'Mermoz',
  'Sacré Coeur',
  'Liberté',
  'Médina',
  'Grand Dakar',
  'Parcelles Assainies',
  'Guédiawaye',
  'Pikine',
];

// Fonction pour obtenir la couleur du statut
export const getStatusColor = (status: DeliveryStatus): { bg: string; text: string } => {
  switch (status) {
    case 'CREEE':
      return { bg: 'bg-gray-800', text: 'text-gray-300' };
    case 'DISPONIBLE':
      return { bg: 'bg-yellow-500/10', text: 'text-yellow-500' };
    case 'PRISE_EN_CHARGE':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400' };
    case 'EN_COURS':
      return { bg: 'bg-tiak-green/10', text: 'text-tiak-green' };
    case 'LIVREE':
      return { bg: 'bg-gray-700', text: 'text-gray-300' };
    default:
      return { bg: 'bg-gray-700', text: 'text-gray-300' };
  }
};

// Fonction pour obtenir le label du statut
export const getStatusLabel = (status: DeliveryStatus): string => {
  switch (status) {
    case 'CREEE':
      return 'Créée';
    case 'DISPONIBLE':
      return 'Disponible';
    case 'PRISE_EN_CHARGE':
      return 'Prise en charge';
    case 'EN_COURS':
      return 'En cours';
    case 'LIVREE':
      return 'Livrée';
    default:
      return status;
  }
};
