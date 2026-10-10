import React, { useState } from 'react';
import { Shipment, CargoType, PriorityLevel, Warehouse, Driver, Vehicle } from '../types/logistics';
import { X, Package, PlusCircle, Check } from 'lucide-react';

interface NewShipmentModalProps {
  warehouses: Warehouse[];
  drivers: Driver[];
  vehicles: Vehicle[];
  onClose: () => void;
  onCreateShipment: (newShipment: Shipment) => void;
}

export const NewShipmentModal: React.FC<NewShipmentModalProps> = ({
  warehouses,
  drivers,
  vehicles,
  onClose,
  onCreateShipment,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [senderCity, setSenderCity] = useState('Madrid');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientCity, setRecipientCity] = useState('Barcelona');
  const [recipientPhone, setRecipientPhone] = useState('+34 ');
  const [cargoType, setCargoType] = useState<CargoType>('estandar');
  const [weightKg, setWeightKg] = useState<number>(1500);
  const [volumeM3, setVolumeM3] = useState<number>(4.2);
  const [priority, setPriority] = useState<PriorityLevel>('alta');
  const [temperatureC, setTemperatureC] = useState<number>(-18);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `LOG-2026-${randomSuffix}`;

    const newShipment: Shipment = {
      id: `shp-${Date.now()}`,
      trackingNumber,
      senderName: senderName || 'Empresa Logística Asociada',
      senderAddress: senderAddress || 'Polígono Industrial Las Mercedes',
      senderCity,
      recipientName: recipientName || 'Cliente Final Receptor',
      recipientAddress: recipientAddress || 'Av. Diagonal, 400',
      recipientCity,
      recipientPhone: recipientPhone || '+34 600 000 000',
      cargoType,
      weightKg: Number(weightKg) || 1000,
      volumeM3: Number(volumeM3) || 3,
      priority,
      status: 'creado',
      progressPercentage: 5,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      estimatedDelivery: new Date(Date.now() + 24 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 16),
      carrier: 'Logística Pro Express',
      originWarehouseId: warehouses[0]?.id || 'wh-1',
      destWarehouseId: warehouses[1]?.id || 'wh-2',
      currentLocationName: `Almacén Central (${senderCity})`,
      currentLat: 40.428,
      currentLng: -3.535,
      temperatureC: cargoType === 'refrigerado' ? temperatureC : undefined,
      notes: notes || undefined,
      waypoints: [
        { id: `wp-${Date.now()}-1`, name: 'Recepción en Almacén', location: senderCity, lat: 40.428, lng: -3.535, completed: true, timestamp: 'Hoy 12:00' },
        { id: `wp-${Date.now()}-2`, name: 'Salida en Tránsito', location: 'Corredor Autovía', lat: 41.171, lng: -2.433, completed: false, statusText: 'Pendiente' },
        { id: `wp-${Date.now()}-3`, name: 'Entrega en Destino', location: recipientCity, lat: 41.385, lng: 2.173, completed: false, statusText: 'Previsto' }
      ],
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          title: 'Expedición creada en sistema',
          description: 'Documentación y etiqueta de transporte generadas con éxito.',
          location: senderCity
        }
      ]
    };

    onCreateShipment(newShipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Crear Nueva Guía de Transporte</h3>
              <p className="text-xs text-slate-400">Registro de expedición y asignación de ruta</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          {/* Sender */}
          <div className="space-y-2">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
              Datos del Remitente (Origen)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Nombre o Empresa Remitente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Distribuciones Iberia S.L."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Ciudad de Origen</label>
                <select
                  value={senderCity}
                  onChange={(e) => setSenderCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Madrid">Madrid</option>
                  <option value="Barcelona">Barcelona</option>
                  <option value="Valencia">Valencia</option>
                  <option value="Sevilla">Sevilla</option>
                  <option value="Zaragoza">Zaragoza</option>
                  <option value="Bilbao">Bilbao</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-400 block mb-1">Dirección de Recogida</label>
                <input
                  type="text"
                  placeholder="Ej: Polígono Industrial Coslada, Calle Principal 12"
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
              Datos del Destinatario (Entrega)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Nombre o Razón Social</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Hospital Central o Fábrica"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Ciudad de Destino</label>
                <select
                  value={recipientCity}
                  onChange={(e) => setRecipientCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Barcelona">Barcelona</option>
                  <option value="Madrid">Madrid</option>
                  <option value="Valencia">Valencia</option>
                  <option value="Sevilla">Sevilla</option>
                  <option value="Zaragoza">Zaragoza</option>
                  <option value="Málaga">Málaga</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Dirección Completa</label>
                <input
                  type="text"
                  placeholder="Ej: Av. de las Palmeras 44"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Teléfono Contacto</label>
                <input
                  type="text"
                  placeholder="+34 612 345 678"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Cargo Specs */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
              Detalles de la Carga & Prioridad
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Tipo de Carga</label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value as CargoType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer capitalize"
                >
                  <option value="estandar">Estándar</option>
                  <option value="refrigerado">Refrigerado</option>
                  <option value="peligroso">Peligroso (ADR)</option>
                  <option value="fragil">Frágil</option>
                  <option value="granel">Granel</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  min="1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Volumen (m³)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={volumeM3}
                  onChange={(e) => setVolumeM3(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Prioridad</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer uppercase font-semibold text-amber-400"
                >
                  <option value="urgente">Urgente</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>

            {cargoType === 'refrigerado' && (
              <div className="p-3 bg-sky-950/20 border border-sky-900/40 rounded-xl flex items-center justify-between">
                <span className="text-sky-300 font-medium">Temperatura Requerida de Caja (°C):</span>
                <input
                  type="number"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(Number(e.target.value))}
                  className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-center font-mono text-sky-400 font-bold"
                />
              </div>
            )}

            <div>
              <label className="text-slate-400 block mb-1">Observaciones / Instrucciones de Porte</label>
              <textarea
                rows={2}
                placeholder="Instrucciones para trincaje, descarga con transpaleta o restricciones horarias..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Footer submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Generar Guía de Transporte</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
