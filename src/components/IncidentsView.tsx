import React, { useState } from 'react';
import { Incident } from '../types/logistics';
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, Wrench, AlertOctagon } from 'lucide-react';

interface IncidentsViewProps {
  incidents: Incident[];
  onResolveIncident: (incidentId: string) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({ incidents, onResolveIncident }) => {
  const [filter, setFilter] = useState<'todas' | 'abierta' | 'en_gestion' | 'resuelta'>('todas');

  const filteredIncidents = incidents.filter(i => {
    if (filter === 'todas') return true;
    return i.status === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            Centro de Gestión de Incidencias y Excepciones
          </h2>
          <p className="text-xs text-slate-400">
            Resolución de averías mecánicas, retenciones viales, aduanas y discrepancias de entrega.
          </p>
        </div>

        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('todas')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'todas' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'}`}
          >
            Todas ({incidents.length})
          </button>
          <button
            onClick={() => setFilter('abierta')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'abierta' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'}`}
          >
            Abiertas
          </button>
          <button
            onClick={() => setFilter('en_gestion')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'en_gestion' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'}`}
          >
            En Gestión
          </button>
          <button
            onClick={() => setFilter('resuelta')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'resuelta' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'}`}
          >
            Resueltas
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className={`p-4 rounded-2xl border transition-all ${
                inc.status === 'resuelta' 
                  ? 'bg-slate-900/60 border-slate-800 opacity-75' 
                  : inc.severity === 'alta'
                  ? 'bg-rose-950/20 border-rose-900/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    inc.severity === 'alta' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    inc.severity === 'media' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    Severidad {inc.severity}
                  </span>
                  <span className="font-mono font-bold text-white text-sm">{inc.trackingNumber}</span>
                  <span className="text-xs text-slate-500">• {inc.type.replace('_', ' ')}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {inc.reportedAt}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    inc.status === 'resuelta' ? 'bg-emerald-500/20 text-emerald-400' :
                    inc.status === 'en_gestion' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {inc.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="my-3 space-y-1.5">
                <h4 className="text-sm font-bold text-slate-200">{inc.title}</h4>
                <p className="text-xs text-slate-400">{inc.description}</p>
                {inc.resolutionNotes && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-medium">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Plan de Acción / Resolución:</span>
                    {inc.resolutionNotes}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500">Asignado a: <strong className="text-slate-300">{inc.assignedTo}</strong></span>
                {inc.status !== 'resuelta' && (
                  <button
                    onClick={() => onResolveIncident(inc.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Marcar como Resuelta</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            No hay incidencias en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
};
