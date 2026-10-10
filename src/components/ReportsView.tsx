import React from 'react';
import { Shipment, Vehicle } from '../types/logistics';
import { BarChart3, TrendingUp, CheckCircle, Clock, ShieldCheck, Download, Award, FileSpreadsheet } from 'lucide-react';

interface ReportsViewProps {
  shipments: Shipment[];
  vehicles: Vehicle[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ shipments, vehicles }) => {
  const deliveredCount = shipments.filter(s => s.status === 'entregado').length;
  const otdRate = 97.6; // On-Time Delivery %
  const totalTonnageKg = shipments.reduce((acc, s) => acc + s.weightKg, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Rendimiento Operativo y Analítica de Despacho
        </h2>
        <p className="text-xs text-slate-400">
          Métricas de cumplimiento contractual (SLA), eficiencia de combustible y toneladas transportadas.
        </p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Cumplimiento SLA (OTD)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{otdRate}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Objetivo anual: 95.0%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Carga Total Movilizada</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {(totalTonnageKg / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-400">Tn</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{shipments.length} expediciones procesadas</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Tiempo Medio de Tránsito</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">18.4 h</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Rutas nacionales peninsulares</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Emisiones Reducidas (Euro 6E)</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">-14.2%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Optimización de cargas cruzadas</div>
        </div>
      </div>

      {/* Corridor Performance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="font-bold text-white text-sm">Rendimiento por Corredor Principal</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                <th className="py-2.5">Corredor</th>
                <th className="py-2.5">Frecuencia</th>
                <th className="py-2.5">Volumen Semanal</th>
                <th className="py-2.5">Puntualidad</th>
                <th className="py-2.5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 font-medium text-white">Madrid ⇄ Barcelona (Corredor A-2 / AP-2)</td>
                <td className="py-2.5 font-mono">14 rutas / día</td>
                <td className="py-2.5 font-mono">180.5 Tn</td>
                <td className="py-2.5 font-mono text-emerald-400">98.2%</td>
                <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">Óptimo</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-white">Madrid ⇄ Sevilla / Cádiz (Corredor A-4)</td>
                <td className="py-2.5 font-mono">8 rutas / día</td>
                <td className="py-2.5 font-mono">112.0 Tn</td>
                <td className="py-2.5 font-mono text-emerald-400">97.0%</td>
                <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">Óptimo</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-white">Valencia ⇄ Zaragoza ⇄ Bilbao (Eje Ebro / A-23)</td>
                <td className="py-2.5 font-mono">6 rutas / día</td>
                <td className="py-2.5 font-mono">94.8 Tn</td>
                <td className="py-2.5 font-mono text-amber-400">94.5%</td>
                <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px]">Obras A-2</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
