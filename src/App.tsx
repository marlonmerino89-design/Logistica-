import React, { useState } from 'react';
import { 
  initialShipments, 
  initialVehicles, 
  initialDrivers, 
  initialWarehouses, 
  initialIncidents 
} from './data/mockLogisticsData';
import { Shipment, Incident, Vehicle } from './types/logistics';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ShipmentsView } from './components/ShipmentsView';
import { TrackingMapView } from './components/TrackingMapView';
import { FleetView } from './components/FleetView';
import { WarehousesView } from './components/WarehousesView';
import { IncidentsView } from './components/IncidentsView';
import { ReportsView } from './components/ReportsView';
import { ShipmentDetailModal } from './components/ShipmentDetailModal';
import { NewShipmentModal } from './components/NewShipmentModal';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [drivers] = useState(initialDrivers);
  const [warehouses] = useState(initialWarehouses);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  // Search & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false);

  // Advance shipment milestone
  const handleAdvanceStatus = (shipmentId: string) => {
    setShipments(prev => prev.map(shp => {
      if (shp.id !== shipmentId) return shp;

      let nextStatus = shp.status;
      let nextProgress = shp.progressPercentage;
      let nextHistory = [...shp.history];
      let pod = shp.pod;

      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

      if (shp.status === 'creado') {
        nextStatus = 'en_almacen';
        nextProgress = 25;
        nextHistory.push({
          id: `h-${Date.now()}`,
          timestamp: nowStr,
          title: 'Ingreso a Plataforma de Distribución',
          description: 'Carga paletizada y clasificada para ruta troncal.',
          location: shp.senderCity
        });
      } else if (shp.status === 'en_almacen') {
        nextStatus = 'en_transito';
        nextProgress = 60;
        nextHistory.push({
          id: `h-${Date.now()}`,
          timestamp: nowStr,
          title: 'Expedición en Tránsito Activo',
          description: 'Conductor asignado y precinto de seguridad sellado.',
          location: 'Ruta Nacional Corredor'
        });
      } else if (shp.status === 'en_transito') {
        nextStatus = 'en_reparto';
        nextProgress = 85;
        nextHistory.push({
          id: `h-${Date.now()}`,
          timestamp: nowStr,
          title: 'En Reparto Última Milla',
          description: 'Vehículo en distribución local hacia dirección de entrega.',
          location: shp.recipientCity
        });
      } else if (shp.status === 'en_reparto' || shp.status === 'retrasado' || shp.status === 'incidencia') {
        nextStatus = 'entregado';
        nextProgress = 100;
        nextHistory.push({
          id: `h-${Date.now()}`,
          timestamp: nowStr,
          title: 'Entrega Realizada con Éxito',
          description: 'Albarán firmado digitalmente por receptor autorizado.',
          location: shp.recipientAddress
        });
        pod = {
          signedBy: `${shp.recipientName} (Recepción)`,
          deliveredAt: nowStr,
          idDocument: 'DNI / NIF Verificado',
          notes: 'Mercancía conforme en embalaje original.'
        };
      }

      const updated = {
        ...shp,
        status: nextStatus,
        progressPercentage: nextProgress,
        history: nextHistory,
        pod
      };

      if (selectedShipment?.id === shipmentId) {
        setSelectedShipment(updated);
      }

      return updated;
    }));
  };

  // Add new shipment
  const handleCreateShipment = (newShipment: Shipment) => {
    setShipments(prev => [newShipment, ...prev]);
  };

  // Resolve incident
  const handleResolveIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      return {
        ...inc,
        status: 'resuelta',
        resolutionNotes: 'Protocolo de contingencia completado y validado por central operativa.'
      };
    }));
  };

  const inTransitCount = shipments.filter(s => s.status === 'en_transito' || s.status === 'en_reparto').length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'resuelta').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenNewShipment={() => setIsNewShipmentOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectShipment={(shp) => setSelectedShipment(shp)}
        shipments={shipments}
      />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          shipmentCount={shipments.length}
          inTransitCount={inTransitCount}
          incidentCount={activeIncidentsCount}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              shipments={shipments}
              vehicles={vehicles}
              warehouses={warehouses}
              incidents={incidents}
              onTabChange={setActiveTab}
              onSelectShipment={(shp) => setSelectedShipment(shp)}
              onOpenNewShipment={() => setIsNewShipmentOpen(true)}
            />
          )}

          {activeTab === 'shipments' && (
            <ShipmentsView
              shipments={shipments}
              onSelectShipment={(shp) => setSelectedShipment(shp)}
              onOpenNewShipment={() => setIsNewShipmentOpen(true)}
              onAdvanceStatus={handleAdvanceStatus}
            />
          )}

          {activeTab === 'map' && (
            <TrackingMapView
              vehicles={vehicles}
              warehouses={warehouses}
              shipments={shipments}
              drivers={drivers}
              selectedShipmentId={selectedShipment?.id}
              onSelectShipment={(shp) => setSelectedShipment(shp)}
            />
          )}

          {activeTab === 'fleet' && (
            <FleetView
              vehicles={vehicles}
              drivers={drivers}
            />
          )}

          {activeTab === 'warehouses' && (
            <WarehousesView
              warehouses={warehouses}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentsView
              incidents={incidents}
              onResolveIncident={handleResolveIncident}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              shipments={shipments}
              vehicles={vehicles}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedShipment && (
        <ShipmentDetailModal
          shipment={selectedShipment}
          drivers={drivers}
          vehicles={vehicles}
          onClose={() => setSelectedShipment(null)}
          onAdvanceStatus={handleAdvanceStatus}
        />
      )}

      {isNewShipmentOpen && (
        <NewShipmentModal
          warehouses={warehouses}
          drivers={drivers}
          vehicles={vehicles}
          onClose={() => setIsNewShipmentOpen(false)}
          onCreateShipment={handleCreateShipment}
        />
      )}
    </div>
  );
}

export default App;
