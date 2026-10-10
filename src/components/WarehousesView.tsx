import React from 'react';
import { Warehouse } from '../types/logistics';
import { Warehouse as WarehouseIcon, MapPin, Phone, UserCheck, Layers, ArrowUpRight } from 'lucide-react';

interface WarehousesViewProps {
  warehouses: Warehouse[];
}

export const WarehousesView: React.FC<WarehousesViewProps> = ({ warehouses }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <WarehouseIcon className="w-5 h-5 text-blue-500" />
          Red de Centros Logísticos y Plataformas Cross-Docking
        </h2>
        <p className="text-xs text-slate-400">
          Supervisión de muelles de carga, stock de palets y capacidad de almacenamiento en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map((wh) => {
          const occupancy = Math.round((wh.occupiedPallets / wh.capacityPallets) * 100);
          const available = wh.capacityPallets - wh.occupiedPallets;

          return (
            <div
              key={wh.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {wh.code}
                  </span>
                  <h3 className="font-bold text-white text-base mt-1.5">{wh.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {wh.address}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {wh.type.replace('_', ' ')}
                </span>
              </div>

              {/* Occupancy bar */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Ocupación Actual</span>
                  <span className="font-mono font-bold text-white">{occupancy}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      occupancy > 85 ? 'bg-amber-500' :
                      occupancy > 95 ? 'bg-rose-500' :
                      'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    style={{ width: `${occupancy}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Ocupados: {wh.occupiedPallets.toLocaleString()}</span>
                  <span>Libres: {available.toLocaleString()} palets</span>
                </div>
              </div>

              {/* Operational details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Envíos Activos</span>
                  <span className="font-mono font-bold text-blue-400 text-sm">{wh.activeShipments}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Capacidad Total</span>
                  <span className="font-mono font-bold text-slate-200 text-sm">{wh.capacityPallets.toLocaleString()}</span>
                </div>
              </div>

              {/* Footer manager contact */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 truncate max-w-[150px]">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" /> {wh.manager}
                </span>
                <a href={`tel:${wh.phone}`} className="flex items-center gap-1 text-slate-300 hover:text-white font-mono text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> {wh.phone}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
