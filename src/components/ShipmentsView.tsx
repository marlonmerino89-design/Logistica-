import React, { useState } from 'react';
import { 
  Shipment, 
  ShipmentStatus, 
  CargoType, 
  PriorityLevel 
} from '../types/logistics';
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  PlusCircle, 
  ExternalLink, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ThermometerSnowflake, 
  Flame, 
  ShieldAlert, 
  ChevronRight,
  Truck
} from 'lucide-react';

interface ShipmentsViewProps {
  shipments: Shipment[];
  onSelectShipment: (s: Shipment) => void;
  onOpenNewShipment: () => void;
  onAdvanceStatus: (shipmentId: string) => void;
}

export const ShipmentsView: React.FC<ShipmentsViewProps> = ({
  shipments,
  onSelectShipment,
  onOpenNewShipment,
  onAdvanceStatus,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [cargoFilter, setCargoFilter] = useState<string>('todos');
  const [priorityFilter, setPriorityFilter] = useState<string>('todos');

  // Filter logic
  const filteredShipments = shipments.filter((shp) => {
    // Search
    const matchSearch =
      search === '' ||
      shp.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      shp.senderName.toLowerCase().includes(search.toLowerCase()) ||
      shp.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      shp.senderCity.toLowerCase().includes(search.toLowerCase()) ||
      shp.recipientCity.toLowerCase().includes(search.toLowerCase());

    // Status
    const matchStatus = statusFilter === 'todos' || shp.status === statusFilter;

    // Cargo
    const matchCargo = cargoFilter === 'todos' || shp.cargoType === cargoFilter;

    // Priority
    const matchPriority = priorityFilter === 'todos' || shp.priority === priorityFilter;

    return matchSearch && matchStatus && matchCargo && matchPriority;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Guía',
      'Remitente',
      'Ciudad Origen',
      'Destinatario',
      'Ciudad Destino',
      'Tipo Carga',
      'Peso (kg)',
      'Prioridad',
      'Estado',
      'Progreso (%)',
      'Fecha Creación',
      'ETA'
    ];

    const rows = filteredShipments.map(s => [
      s.trackingNumber,
      `"${s.senderName.replace(/"/g, '""')}"`,
      `"${s.senderCity}"`,
      `"${s.recipientName.replace(/"/g, '""')}"`,
      `"${s.recipientCity}"`,
      s.cargoType,
      s.weightKg,
      s.priority,
      s.status,
      s.progressPercentage,
      s.createdAt,
      s.estimatedDelivery
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `despacho_logistica_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'creado':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">Creado</span>;
      case 'en_almacen':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">En Almacén</span>;
      case 'en_transito':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">En Tránsito</span>;
      case 'en_reparto':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">En Reparto</span>;
      case 'entregado':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Entregado</span>;
      case 'incidencia':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25">Incidencia</span>;
      case 'retrasado':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">Retrasado</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            Gestión de Envíos y Guías de Transporte
          </h2>
          <p className="text-xs text-slate-400">
            Control documental, seguimiento de hitos de entrega y trazabilidad física.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onOpenNewShipment}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Envío</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código de rastreo, empresa, remitente o ciudad..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer w-full lg:w-auto"
            >
              <option value="todos">Todos los Estados</option>
              <option value="creado">Creado</option>
              <option value="en_almacen">En Almacén</option>
              <option value="en_transito">En Tránsito</option>
              <option value="en_reparto">En Reparto</option>
              <option value="entregado">Entregado</option>
              <option value="incidencia">Incidencia</option>
            </select>
          </div>

          {/* Cargo filter */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">Carga:</span>
            <select
              value={cargoFilter}
              onChange={(e) => setCargoFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer w-full lg:w-auto"
            >
              <option value="todos">Cualquier Tipo</option>
              <option value="estandar">Estándar</option>
              <option value="refrigerado">Refrigerado (Frío)</option>
              <option value="peligroso">Peligroso (ADR)</option>
              <option value="fragil">Frágil</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">Prioridad:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer w-full lg:w-auto"
            >
              <option value="todos">Todas</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Guía / Tracking</th>
                <th className="py-3 px-4">Ruta (Origen → Destino)</th>
                <th className="py-3 px-4">Destinatario</th>
                <th className="py-3 px-4">Carga / Peso</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Progreso</th>
                <th className="py-3 px-4">ETA Entrega</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shp) => (
                  <tr
                    key={shp.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectShipment(shp)}
                  >
                    {/* Tracking Number */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-blue-400 flex items-center gap-1.5">
                        {shp.trackingNumber}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{shp.carrier}</div>
                    </td>

                    {/* Route */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200 flex items-center gap-1">
                        <span>{shp.senderCity}</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-white font-semibold">{shp.recipientCity}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        {shp.currentLocationName}
                      </div>
                    </td>

                    {/* Recipient */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200 truncate max-w-[180px]">
                        {shp.recipientName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {shp.recipientPhone}
                      </div>
                    </td>

                    {/* Cargo & Weight */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {shp.cargoType === 'refrigerado' && (
                          <span className="p-1 rounded bg-sky-500/10 text-sky-400" title={`Frío: ${shp.temperatureC}°C`}>
                            <ThermometerSnowflake className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {shp.cargoType === 'peligroso' && (
                          <span className="p-1 rounded bg-amber-500/10 text-amber-400" title="Peligroso ADR">
                            <Flame className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span className="capitalize text-slate-300 font-medium">
                          {shp.cargoType}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {shp.weightKg.toLocaleString()} kg ({shp.volumeM3} m³)
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4">
                      {getStatusBadge(shp.status)}
                    </td>

                    {/* Progress Bar */}
                    <td className="py-3 px-4 min-w-[130px]">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>{shp.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            shp.status === 'entregado' ? 'bg-emerald-500' :
                            shp.status === 'incidencia' ? 'bg-rose-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${shp.progressPercentage}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* ETA */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-300 font-mono text-[11px]">{shp.estimatedDelivery}</div>
                      <span className={`inline-block text-[10px] font-semibold uppercase ${
                        shp.priority === 'urgente' ? 'text-rose-400' :
                        shp.priority === 'alta' ? 'text-amber-400' :
                        'text-slate-500'
                      }`}>
                        Prioridad {shp.priority}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {shp.status !== 'entregado' && (
                          <button
                            onClick={() => onAdvanceStatus(shp.id)}
                            title="Avanzar al siguiente hito de transporte"
                            className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-all text-[11px] font-medium border border-blue-500/30"
                          >
                            Avanzar Hito
                          </button>
                        )}
                        <button
                          onClick={() => onSelectShipment(shp)}
                          title="Ver detalle y comprobante"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No se encontraron envíos que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filteredShipments.length} de {shipments.length} guías registradas</span>
          <span>Actualización satelital cada 30 segundos</span>
        </div>
      </div>
    </div>
  );
};
