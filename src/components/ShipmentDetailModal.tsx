import React from 'react';
import { Shipment, Driver, Vehicle } from '../types/logistics';
import { 
  X, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  ThermometerSnowflake, 
  User, 
  Phone, 
  Calendar, 
  FileCheck2, 
  QrCode,
  ArrowRight
} from 'lucide-react';

interface ShipmentDetailModalProps {
  shipment: Shipment | null;
  drivers: Driver[];
  vehicles: Vehicle[];
  onClose: () => void;
  onAdvanceStatus: (shipmentId: string) => void;
}

export const ShipmentDetailModal: React.FC<ShipmentDetailModalProps> = ({
  shipment,
  drivers,
  vehicles,
  onClose,
  onAdvanceStatus,
}) => {
  if (!shipment) return null;

  const driver = drivers.find(d => d.id === shipment.assignedDriverId);
  const vehicle = vehicles.find(v => v.id === shipment.assignedVehicleId);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-blue-400">
                {shipment.trackingNumber}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                shipment.status === 'entregado' ? 'bg-emerald-500/20 text-emerald-400' :
                shipment.status === 'incidencia' ? 'bg-rose-500/20 text-rose-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {shipment.status.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Transportista: {shipment.carrier} • Creado: {shipment.createdAt}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Progress Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Estado de Transporte</span>
              <span className="font-mono font-bold text-blue-400">{shipment.progressPercentage}% completado</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${shipment.progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
              <span>Origen: {shipment.senderCity}</span>
              <span>Ubicación actual: {shipment.currentLocationName}</span>
              <span>Destino: {shipment.recipientCity}</span>
            </div>
          </div>

          {/* Sender & Recipient Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Remitente / Origen
              </span>
              <div className="text-sm font-bold text-white">{shipment.senderName}</div>
              <div className="text-xs text-slate-400">{shipment.senderAddress}</div>
              <div className="text-xs text-blue-400 font-semibold">{shipment.senderCity}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Destinatario / Entrega
              </span>
              <div className="text-sm font-bold text-white">{shipment.recipientName}</div>
              <div className="text-xs text-slate-400">{shipment.recipientAddress}</div>
              <div className="text-xs text-emerald-400 font-semibold">{shipment.recipientCity}</div>
              <div className="text-xs text-slate-400 font-mono">Tel: {shipment.recipientPhone}</div>
            </div>
          </div>

          {/* Cargo & Cold Chain Details */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-semibold text-slate-300">Especificaciones de Carga</span>
              <span className="font-mono text-slate-400">{shipment.weightKg.toLocaleString()} kg | {shipment.volumeM3} m³</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Tipo Carga</span>
                <span className="font-semibold text-white capitalize">{shipment.cargoType}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Prioridad</span>
                <span className="font-semibold text-amber-400 uppercase">{shipment.priority}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">ETA Programada</span>
                <span className="font-semibold text-slate-300 font-mono">{shipment.estimatedDelivery}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Control Térmico</span>
                {shipment.temperatureC !== undefined ? (
                  <span className="font-bold text-sky-400 font-mono flex items-center gap-1">
                    <ThermometerSnowflake className="w-3.5 h-3.5" />
                    {shipment.temperatureC}°C
                  </span>
                ) : (
                  <span className="text-slate-500">N/A</span>
                )}
              </div>
            </div>
            {shipment.notes && (
              <div className="p-2.5 rounded-lg bg-slate-900 text-xs text-slate-400 border border-slate-800">
                <span className="text-slate-300 font-medium">Instrucciones:</span> {shipment.notes}
              </div>
            )}
          </div>

          {/* Waypoints route history */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Hoja de Ruta y Puntos de Control
            </h4>
            <div className="space-y-2 border-l-2 border-slate-800 ml-2 pl-4">
              {shipment.waypoints.map((wp) => (
                <div key={wp.id} className="relative text-xs">
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${
                    wp.completed ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-slate-700'
                  }`}></div>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${wp.completed ? 'text-white' : 'text-slate-400'}`}>
                      {wp.name} ({wp.location})
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {wp.timestamp || wp.statusText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proof of Delivery (POD) if delivered */}
          {shipment.pod && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <FileCheck2 className="w-4 h-4" /> Albarán de Entrega Digital (POD)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div>Firmado por: <strong>{shipment.pod.signedBy}</strong></div>
                <div>Documento: <strong>{shipment.pod.idDocument}</strong></div>
                <div>Fecha de entrega: <strong>{shipment.pod.deliveredAt}</strong></div>
              </div>
              {shipment.pod.notes && (
                <div className="text-[11px] text-slate-400 italic pt-1">{shipment.pod.notes}</div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          {shipment.status !== 'entregado' && (
            <button
              onClick={() => {
                onAdvanceStatus(shipment.id);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Avanzar al Siguiente Hito</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
