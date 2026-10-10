import React, { useState } from 'react';
import { Vehicle, Driver } from '../types/logistics';
import { 
  Truck, 
  Users, 
  Fuel, 
  Gauge, 
  Calendar, 
  Wrench, 
  CheckCircle, 
  AlertTriangle, 
  Star, 
  Phone, 
  Mail,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface FleetViewProps {
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const FleetView: React.FC<FleetViewProps> = ({ vehicles, drivers }) => {
  const [activeSubTab, setActiveSubTab] = useState<'vehiculos' | 'conductores'>('vehiculos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredVehicles = vehicles.filter(v => {
    if (statusFilter === 'todos') return true;
    return v.status === statusFilter;
  });

  const filteredDrivers = drivers.filter(d => {
    if (statusFilter === 'todos') return true;
    return d.status === statusFilter;
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-500" />
            Parque Móvil y Equipo de Conductores
          </h2>
          <p className="text-xs text-slate-400">
            Control de mantenimiento técnico, tacógrafos, homologaciones ADR y asignación operativa.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => { setActiveSubTab('vehiculos'); setStatusFilter('todos'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'vehiculos' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Vehículos ({vehicles.length})</span>
          </button>
          <button
            onClick={() => { setActiveSubTab('conductores'); setStatusFilter('todos'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'conductores' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Conductores ({drivers.length})</span>
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      {activeSubTab === 'vehiculos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((veh) => {
            const driver = drivers.find(d => d.id === veh.currentDriverId);
            return (
              <div
                key={veh.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between pb-2 border-b border-slate-800">
                    <div>
                      <span className="font-mono font-bold text-base text-white tracking-wide">
                        {veh.plateNumber}
                      </span>
                      <div className="text-xs text-slate-400">{veh.model}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      veh.status === 'en_ruta' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      veh.status === 'disponible' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      veh.status === 'mantenimiento' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {veh.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Telemetry info */}
                  <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs">
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                      <Fuel className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                      <div className="font-mono font-bold text-slate-200">{veh.fuelLevelPercent}%</div>
                      <div className="text-[10px] text-slate-500">Depósito</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                      <Gauge className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                      <div className="font-mono font-bold text-slate-200">{veh.currentSpeedKmh} km/h</div>
                      <div className="text-[10px] text-slate-500">Velocidad</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                      <Wrench className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
                      <div className="font-mono font-bold text-slate-200">{Math.round(veh.mileageKm / 1000)}k</div>
                      <div className="text-[10px] text-slate-500">Km Total</div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-300">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Ubicación Actual:</span>
                      <span className="font-medium truncate max-w-[190px]">{veh.currentLocation}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Capacidad Máx:</span>
                      <span className="font-mono font-medium">{veh.maxPayloadKg.toLocaleString()} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Próx. ITV / Revisión:</span>
                      <span className="font-mono text-slate-400">{veh.nextMaintenanceDate}</span>
                    </div>
                  </div>
                </div>

                {/* Driver footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  {driver ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={driver.avatarUrl}
                        alt={driver.fullName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-slate-300 font-medium text-[11px] truncate max-w-[140px]">
                        {driver.fullName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Sin conductor asignado</span>
                  )}
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {veh.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drivers Grid */}
      {activeSubTab === 'conductores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.map((drv) => (
            <div
              key={drv.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={drv.avatarUrl}
                  alt={drv.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm truncate">{drv.fullName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      drv.status === 'en_ruta' ? 'bg-blue-500/20 text-blue-400' :
                      drv.status === 'disponible' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {drv.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">DNI: {drv.dni}</div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{drv.rating} / 5.0</span>
                    <span className="text-slate-500 text-[10px] ml-1">({drv.completedDeliveries} entregas)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Carnet & Habilitaciones:</span>
                  <span className="font-semibold text-blue-400">{drv.licenseCategory}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Experiencia en ruta:</span>
                  <span className="text-slate-300">{drv.experienceYears} años</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <a
                  href={`tel:${drv.phone}`}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-mono text-[11px]">{drv.phone}</span>
                </a>
                <span className="text-[10px] text-slate-500">Tacógrafo OK</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
