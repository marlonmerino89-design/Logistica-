export type ShipmentStatus = 
  | 'creado' 
  | 'en_almacen' 
  | 'en_transito' 
  | 'en_reparto' 
  | 'entregado' 
  | 'retrasado' 
  | 'incidencia';

export type PriorityLevel = 'baja' | 'media' | 'alta' | 'urgente';

export type CargoType = 'estandar' | 'refrigerado' | 'peligroso' | 'fragil' | 'granel';

export interface Waypoint {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  timestamp?: string;
  completed: boolean;
  statusText?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientPhone: string;
  cargoType: CargoType;
  weightKg: number;
  volumeM3: number;
  priority: PriorityLevel;
  status: ShipmentStatus;
  progressPercentage: number;
  createdAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  carrier: string;
  assignedDriverId?: string;
  assignedVehicleId?: string;
  originWarehouseId: string;
  destWarehouseId: string;
  currentLocationName: string;
  currentLat: number;
  currentLng: number;
  temperatureC?: number; // For cold chain
  waypoints: Waypoint[];
  notes?: string;
  history: {
    id: string;
    timestamp: string;
    title: string;
    description: string;
    location: string;
    icon?: string;
  }[];
  pod?: {
    signedBy: string;
    signatureUrl?: string;
    deliveredAt: string;
    idDocument: string;
    notes?: string;
  };
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  type: 'trailer' | 'furgon' | 'camion_rigido' | 'furgoneta' | 'trailer_frigo';
  maxPayloadKg: number;
  status: 'disponible' | 'en_ruta' | 'mantenimiento' | 'inactivo';
  currentDriverId?: string;
  fuelLevelPercent: number;
  mileageKm: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  currentLocation: string;
  lat: number;
  lng: number;
  currentSpeedKmh: number;
  temperatureC?: number;
}

export interface Driver {
  id: string;
  fullName: string;
  dni: string;
  phone: string;
  email: string;
  licenseCategory: string;
  experienceYears: number;
  rating: number; // 1-5
  status: 'en_ruta' | 'disponible' | 'descanso' | 'baja';
  assignedVehicleId?: string;
  completedDeliveries: number;
  avatarUrl: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  capacityPallets: number;
  occupiedPallets: number;
  activeShipments: number;
  lat: number;
  lng: number;
  manager: string;
  phone: string;
  type: 'central' | 'regional' | 'cross_docking' | 'aduanero';
}

export interface Incident {
  id: string;
  shipmentId: string;
  trackingNumber: string;
  type: 'averia_mecanica' | 'atasco_ruta' | 'aduanas' | 'danio_mercancia' | 'destinatario_ausente' | 'clima';
  severity: 'baja' | 'media' | 'alta';
  title: string;
  description: string;
  reportedAt: string;
  status: 'abierta' | 'en_gestion' | 'resuelta';
  assignedTo: string;
  resolutionNotes?: string;
}

export interface SystemMetric {
  totalShipments: number;
  inTransit: number;
  deliveredToday: number;
  incidentsActive: number;
  onTimeDeliveryRate: number;
  fleetUtilizationRate: number;
  warehouseOccupancyRate: number;
}
