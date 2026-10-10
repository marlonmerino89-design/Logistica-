import React, { useState, useEffect } from 'react';
import { 
  Vehicle, 
  Warehouse, 
  Shipment, 
  Driver 
} from '../types/logistics';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Thermometer, 
  Fuel, 
  Gauge, 
  Layers, 
  Play, 
  Pause, 
  Compass, 
  ShieldAlert, 
  CheckCircle,
  Maximize2
} from 'lucide-react';

interface TrackingMapViewProps {
  vehicles: Vehicle[];
  warehouses: Warehouse[];
  shipments: Shipment[];
  drivers: Driver[];
  selectedShipmentId?: string;
  onSelectShipment: (s: Shipment) => void;
  onUpdateVehicleCoords?: (vehicleId: string, lat: number, lng: number, speed: number) => void;
}

export const TrackingMapView: React.FC<TrackingMapViewProps> = ({
  vehicles,
  warehouses,
  shipments,
  drivers,
  selectedShipmentId,
  onSelectShipment,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('todos');

  // Convert lat/lng coordinates roughly into SVG 0-100% space for Iberian peninsula
  // Spain bounding box approx: Lat 35.8 to 44.0, Lng -9.5 to 3.5
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 35.5;
    const maxLat = 43.8;
    const minLng = -9.4;
    const maxLng = 3.5;

    // x from minLng to maxLng
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // y from maxLat to minLat (SVG top is max latitude)
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    };
  };

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  const driverForSelected = drivers.find(d => d.id === selectedVehicle?.currentDriverId);
  const shipmentForSelected = shipments.find(s => s.assignedVehicleId === selectedVehicle?.id);

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(v => {
    if (filterType === 'todos') return true;
    if (filterType === 'frigo') return v.type === 'trailer_frigo';
    if (filterType === 'en_ruta') return v.status === 'en_ruta';
    if (filterType === 'alerta') return v.status === 'mantenimiento';
    return true;
  });

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8.5rem)] gap-4">
      {/* Map Canvas Card */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col relative shadow-xl">
        {/* Map Header Toolbar */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white text-sm">Monitoreo Satelital de Flota</span>
              <span className="text-[11px] text-slate-400 block">Red Nacional & Corredores de Carga</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilterType('todos')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === 'todos' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({vehicles.length})
              </button>
              <button
                onClick={() => setFilterType('en_ruta')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === 'en_ruta' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                En Ruta
              </button>
              <button
                onClick={() => setFilterType('frigo')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === 'frigo' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Frigoríficos
              </button>
            </div>

            {/* GPS Simulation Toggle */}
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isSimulating 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? 'Simulación Activa' : 'Pausada'}</span>
            </button>
          </div>
        </div>

        {/* Map Display (Stylized GIS Map) */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden select-none flex items-center justify-center p-2">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          {/* SVG Map of corridors */}
          <svg className="w-full h-full max-w-4xl max-h-[640px]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Background geography silhouette representing Iberian logistics network */}
            <path
              d="M 12 18 Q 20 12, 35 14 Q 55 12, 70 18 Q 85 24, 92 34 Q 90 52, 85 64 Q 78 80, 68 88 Q 50 94, 38 90 Q 22 92, 14 78 Q 10 60, 10 40 Z"
              fill="rgba(15, 23, 42, 0.7)"
              stroke="rgba(51, 65, 85, 0.5)"
              strokeWidth="0.8"
            />

            {/* Major Arterial Highway Lines (A-1, A-2, A-3, A-4, AP-7) */}
            {/* Madrid -> Barcelona */}
            <line x1="45" y1="42" x2="88" y2="30" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.2" strokeDasharray="2,2" />
            {/* Madrid -> Valencia */}
            <line x1="45" y1="42" x2="68" y2="52" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.2" strokeDasharray="2,2" />
            {/* Madrid -> Sevilla */}
            <line x1="45" y1="42" x2="26" y2="76" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.2" strokeDasharray="2,2" />
            {/* Madrid -> Zaragoza */}
            <line x1="45" y1="42" x2="65" y2="28" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.2" strokeDasharray="2,2" />
            {/* Zaragoza -> Barcelona */}
            <line x1="65" y1="28" x2="88" y2="30" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.2" strokeDasharray="2,2" />
            {/* Barcelona -> Valencia (Mediterranean Corridor AP-7) */}
            <path d="M 88 30 Q 82 42, 68 52" fill="none" stroke="rgba(14, 165, 233, 0.5)" strokeWidth="1.4" strokeDasharray="2,2" />

            {/* Warehouse Hub Nodes */}
            {warehouses.map((wh) => {
              const pos = projectCoords(wh.lat, wh.lng);
              return (
                <g key={wh.id} className="cursor-pointer group">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="3.5"
                    fill="rgba(30, 41, 59, 0.8)"
                    stroke="rgba(99, 102, 241, 0.9)"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="1.5"
                    fill="#818cf8"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 4.5}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="2.4"
                    fontWeight="600"
                    className="pointer-events-none select-none"
                  >
                    {wh.city}
                  </text>
                </g>
              );
            })}

            {/* Vehicles on Map */}
            {filteredVehicles.map((veh) => {
              const pos = projectCoords(veh.lat, veh.lng);
              const isSelected = veh.id === selectedVehicleId;
              const isCold = veh.type === 'trailer_frigo';
              const isInIncident = veh.status === 'mantenimiento';

              return (
                <g 
                  key={veh.id} 
                  className="cursor-pointer transition-all duration-700"
                  onClick={() => setSelectedVehicleId(veh.id)}
                >
                  {/* Ping animation if moving */}
                  {veh.status === 'en_ruta' && isSimulating && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="4.5"
                      fill="none"
                      stroke={isCold ? '#38bdf8' : '#3b82f6'}
                      strokeWidth="0.6"
                      className="animate-ping opacity-75 origin-center"
                    />
                  )}

                  {/* Vehicle Body Pin */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 3.6 : 2.8}
                    fill={
                      isInIncident ? '#f43f5e' :
                      isCold ? '#0284c7' :
                      veh.status === 'disponible' ? '#10b981' :
                      '#2563eb'
                    }
                    stroke={isSelected ? '#ffffff' : '#0f172a'}
                    strokeWidth={isSelected ? 1.4 : 0.8}
                  />

                  {/* Indicator Icon / Plate Label */}
                  <text
                    x={pos.x}
                    y={pos.y + 4.5}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize="2.2"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="font-mono pointer-events-none drop-shadow-md"
                  >
                    {veh.plateNumber.split('-')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[11px] space-y-1.5 pointer-events-auto">
            <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> Referencias GIS
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Tráiler Estándar</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>Cámara Frío ADR</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>En Base / Disponible</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Alerta / Taller</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Vehicle Telematics Panel (Right Column) */}
      <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col p-4 shadow-xl overflow-y-auto">
        {selectedVehicle ? (
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                  {selectedVehicle.type.toUpperCase().replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-white mt-1 font-mono">
                  {selectedVehicle.plateNumber}
                </h3>
                <p className="text-xs text-slate-400">{selectedVehicle.model}</p>
              </div>

              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                selectedVehicle.status === 'en_ruta' ? 'bg-blue-500/20 text-blue-400' :
                selectedVehicle.status === 'disponible' ? 'bg-emerald-500/20 text-emerald-400' :
                selectedVehicle.status === 'mantenimiento' ? 'bg-rose-500/20 text-rose-400' :
                'bg-slate-800 text-slate-400'
              }`}>
                {selectedVehicle.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Current Position & Speed */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-400" /> Ubicación GPS
                </span>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Activo
                </span>
              </div>
              <div className="text-xs font-medium text-slate-200">
                {selectedVehicle.currentLocation}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Coords: {selectedVehicle.lat.toFixed(4)}° N, {selectedVehicle.lng.toFixed(4)}° E
              </div>
            </div>

            {/* Gauge Matrix (Speed, Fuel, Temperature) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <Gauge className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-white font-mono">{selectedVehicle.currentSpeedKmh} km/h</div>
                <div className="text-[10px] text-slate-500">Velocidad</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <Fuel className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-white font-mono">{selectedVehicle.fuelLevelPercent}%</div>
                <div className="text-[10px] text-slate-500">Depósito</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <Thermometer className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-white font-mono">
                  {selectedVehicle.temperatureC !== undefined ? `${selectedVehicle.temperatureC}°C` : 'N/A'}
                </div>
                <div className="text-[10px] text-slate-500">Caja Térmica</div>
              </div>
            </div>

            {/* Assigned Driver Profile */}
            {driverForSelected ? (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-400">Conductor Asignado</div>
                <div className="flex items-center gap-3">
                  <img
                    src={driverForSelected.avatarUrl}
                    alt={driverForSelected.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{driverForSelected.fullName}</div>
                    <div className="text-[11px] text-slate-400">Carnet: {driverForSelected.licenseCategory}</div>
                    <div className="text-[10px] text-amber-400 font-semibold">★ {driverForSelected.rating} / 5.0</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500 text-center">
                Sin conductor asignado actualmente
              </div>
            )}

            {/* Linked Shipment Details */}
            {shipmentForSelected ? (
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-300">Carga en Tránsito</span>
                  <span className="font-mono font-bold text-blue-400">{shipmentForSelected.trackingNumber}</span>
                </div>
                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">Ruta:</span> {shipmentForSelected.senderCity} → {shipmentForSelected.recipientCity}
                </div>
                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">Mercancía:</span> {shipmentForSelected.weightKg} kg ({shipmentForSelected.cargoType})
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Progreso de viaje</span>
                    <span className="font-mono text-blue-400">{shipmentForSelected.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${shipmentForSelected.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => onSelectShipment(shipmentForSelected)}
                  className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                >
                  Ver Guía y Hoja de Ruta Completa
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500 text-center">
                Unidad disponible sin carga asignada
              </div>
            )}

            {/* Quick action buttons */}
            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800">
              <span>Tacógrafo: En descanso reglamentario OK</span>
              <span>Km: {selectedVehicle.mileageKm.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-500 text-xs">
            <Truck className="w-8 h-8 mb-2 opacity-50" />
            Selecciona un vehículo en el mapa para ver su telemetría
          </div>
        )}
      </div>
    </div>
  );
};
