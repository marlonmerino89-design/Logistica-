import React from 'react';
import { 
  Shipment, 
  Vehicle, 
  Warehouse, 
  Incident 
} from '../types/logistics';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Warehouse as WarehouseIcon, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  MapPin, 
  ChevronRight,
  ThermometerSnowflake,
  Fuel
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  shipments: Shipment[];
  vehicles: Vehicle[];
  warehouses: Warehouse[];
  incidents: Incident[];
  onTabChange: (tab: ActiveTab) => void;
  onSelectShipment: (s: Shipment) => void;
  onOpenNewShipment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  shipments,
  vehicles,
  warehouses,
  incidents,
  onTabChange,
  onSelectShipment,
  onOpenNewShipment,
}) => {
  const inTransitCount = shipments.filter(s => s.status === 'en_transito' || s.status === 'en_reparto').length;
  const deliveredCount = shipments.filter(s => s.status === 'entregado').length;
  const activeIncidents = incidents.filter(i => i.status !== 'resuelta').length;
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'en_ruta').length;

  const totalCapacity = warehouses.reduce((acc, w) => acc + w.capacityPallets, 0);
  const totalOccupied = warehouses.reduce((acc, w) => acc + w.occupiedPallets, 0);
  const warehouseOccupancyPct = Math.round((totalOccupied / totalCapacity) * 100);

  const urgentShipments = shipments.filter(s => s.priority === 'urgente' || s.status === 'incidencia');

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 p-5 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Operaciones en Tiempo Real
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Centro de Mando Logístico
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Supervisión integral de flota, guías de despacho y almacenes intermodales.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onTabChange('map')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Mapa Satelital</span>
          </button>
          <button
            onClick={onOpenNewShipment}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>Despachar Carga</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Active Shipments */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Guías</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{shipments.length}</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +12% este mes
            </div>
          </div>
        </div>

        {/* Card 2: In Transit */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">En Ruta</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">{inTransitCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Con GPS en vivo
            </div>
          </div>
        </div>

        {/* Card 3: Delivered Today */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Entregados</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{deliveredCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Con firma digital
            </div>
          </div>
        </div>

        {/* Card 4: Incidents */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Incidencias</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-400 font-mono">{activeIncidents}</div>
            <div className="text-[11px] text-rose-400/80 mt-0.5">
              {activeIncidents > 0 ? 'Requiere atención' : 'Sin alertas'}
            </div>
          </div>
        </div>

        {/* Card 5: Fleet Utilization */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Uso Flota</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">
              {Math.round((activeVehicles / totalVehicles) * 100)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {activeVehicles} de {totalVehicles} unidades
            </div>
          </div>
        </div>

        {/* Card 6: Warehouse Capacity */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Ocup. Almacén</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <WarehouseIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{warehouseOccupancyPct}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {totalOccupied.toLocaleString()} palets
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Shipments & Operations Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Active Shipments Spotlight */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Envíos en Tránsito Prioritario</h3>
              <p className="text-xs text-slate-400">Control de entregas urgentes, frío y mercancías peligrosas</p>
            </div>
            <button
              onClick={() => onTabChange('shipments')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas las guías</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {urgentShipments.map((shp) => (
              <div
                key={shp.id}
                onClick={() => onSelectShipment(shp)}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer hover:bg-slate-950"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-blue-400">{shp.trackingNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      shp.priority === 'urgente' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      shp.priority === 'alta' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {shp.priority}
                    </span>
                    {shp.cargoType === 'refrigerado' && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-mono border border-sky-500/20">
                        <ThermometerSnowflake className="w-3 h-3" />
                        {shp.temperatureC}°C
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>ETA: {shp.estimatedDelivery}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Origen:</span>
                    <span className="text-slate-200 font-medium">{shp.senderCity} ({shp.senderName})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Destino:</span>
                    <span className="text-slate-200 font-medium">{shp.recipientCity} ({shp.recipientName})</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate max-w-[280px]">
                      📍 {shp.currentLocationName}
                    </span>
                    <span className="font-mono font-semibold text-blue-400">{shp.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        shp.status === 'incidencia' ? 'bg-rose-500' :
                        shp.status === 'entregado' ? 'bg-emerald-500' :
                        'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}
                      style={{ width: `${shp.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Fleet Status & Quick Incidents */}
        <div className="space-y-6">
          {/* Active Incidents Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Incidencias en Ruta
              </h3>
              <button
                onClick={() => onTabChange('incidents')}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
              >
                Gestionar ({activeIncidents})
              </button>
            </div>

            {incidents.slice(0, 2).map((inc) => (
              <div key={inc.id} className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-rose-300">{inc.trackingNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 uppercase font-semibold">
                    {inc.severity}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-200">{inc.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2">{inc.description}</div>
              </div>
            ))}
          </div>

          {/* Warehouse Occupancy Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <WarehouseIcon className="w-4 h-4 text-blue-400" /> Nivel de Almacenes
              </h3>
              <button
                onClick={() => onTabChange('warehouses')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-2.5">
              {warehouses.slice(0, 3).map((w) => {
                const pct = Math.round((w.occupiedPallets / w.capacityPallets) * 100);
                return (
                  <div key={w.id} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-medium">{w.city} ({w.code})</span>
                      <span className="font-mono text-slate-400">{pct}% ({w.occupiedPallets} p.)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${pct > 85 ? 'bg-amber-500' : 'bg-blue-500'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
