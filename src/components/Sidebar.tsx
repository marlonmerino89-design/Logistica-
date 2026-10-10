import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Truck, 
  Warehouse, 
  AlertOctagon, 
  BarChart3, 
  Layers,
  ShieldCheck,
  Fuel,
  Users
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'shipments' 
  | 'map' 
  | 'fleet' 
  | 'warehouses' 
  | 'incidents' 
  | 'reports';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  shipmentCount: number;
  inTransitCount: number;
  incidentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  shipmentCount,
  inTransitCount,
  incidentCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Panel General',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'shipments' as ActiveTab,
      label: 'Envíos y Guías',
      icon: Package,
      badge: `${shipmentCount}`
    },
    {
      id: 'map' as ActiveTab,
      label: 'Mapa y Telemetría',
      icon: MapPin,
      badge: `${inTransitCount} en ruta`,
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    },
    {
      id: 'fleet' as ActiveTab,
      label: 'Flota y Conductores',
      icon: Truck,
      badge: null
    },
    {
      id: 'warehouses' as ActiveTab,
      label: 'Centros y Almacenes',
      icon: Warehouse,
      badge: '5'
    },
    {
      id: 'incidents' as ActiveTab,
      label: 'Incidencias',
      icon: AlertOctagon,
      badge: incidentCount > 0 ? `${incidentCount}` : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Métricas y Reportes',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div className="p-3 lg:p-4 space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
          Módulos Operativos
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  item.badgeColor || 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fleet telemetry quick indicator footer */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
            Flota Promedio
          </span>
          <span className="text-emerald-400 font-semibold font-mono">76% Diésel/GNC</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-[76%]"></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-400" /> ISO 9001 / ADR
          </span>
          <span className="font-mono text-slate-400">v2.4 Pro</span>
        </div>
      </div>
    </aside>
  );
};
