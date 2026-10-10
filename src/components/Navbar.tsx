import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Search, 
  Bell, 
  PlusCircle, 
  Activity, 
  Radio, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { Shipment } from '../types/logistics';

interface NavbarProps {
  onOpenNewShipment: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectShipment: (s: Shipment) => void;
  shipments: Shipment[];
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewShipment,
  searchQuery,
  onSearchChange,
  onSelectShipment,
  shipments,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredQuickResults = searchQuery.trim() === '' ? [] : shipments.filter(s => 
    s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.recipientCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.senderCity.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Brand & Live status */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              Logística<span className="text-blue-500">PRO</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              GPS Online
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">Centro de Gestión y Control de Flota</p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setSearchResultsOpen(true);
            }}
            onFocus={() => setSearchResultsOpen(true)}
            placeholder="Buscar por guía (LOG-...), destinatario o ciudad..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs lg:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-800 px-1.5 py-0.5 rounded"
            >
              ESC
            </button>
          )}
        </div>

        {/* Quick Search Dropdown */}
        {searchResultsOpen && filteredQuickResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
              Coincidencias encontradas ({filteredQuickResults.length})
            </div>
            {filteredQuickResults.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectShipment(item);
                  setSearchResultsOpen(false);
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-mono font-semibold text-blue-400">{item.trackingNumber}</div>
                  <div className="text-slate-300">{item.senderCity} → {item.recipientCity}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                    item.status === 'entregado' ? 'bg-emerald-500/20 text-emerald-400' :
                    item.status === 'en_transito' ? 'bg-blue-500/20 text-blue-400' :
                    item.status === 'incidencia' ? 'bg-rose-500/20 text-rose-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.recipientName}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Controls & Clock */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{currentTime || '12:00:00'} CET</span>
        </div>

        {/* Notifications button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Notificaciones operativas"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-semibold text-white">Alertas Operativas</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-medium">2 Nuevas</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/50 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-rose-200">Alerta ADR en A-4 (LOG-2026-4011)</div>
                    <div className="text-rose-300/80 text-[11px]">Válvula de seguridad con lectura anormal en Manzanares.</div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-900/50 flex gap-2">
                  <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-200">Retención de tráfico A-2 km 140</div>
                    <div className="text-amber-300/80 text-[11px]">Camión Volvo 4821-MBP recalculando ruta (+35m).</div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-200">Entrega completada (LOG-2026-5120)</div>
                    <div className="text-slate-400 text-[11px]">Firma digital recibida en Boutique Gran Vía.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* New Shipment Button */}
        <button
          onClick={onOpenNewShipment}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs lg:text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo Envío</span>
        </button>
      </div>
    </header>
  );
};
