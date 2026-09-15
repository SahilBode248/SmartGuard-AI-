import React from 'react';
import { FileText, Download, CheckCircle2, Shield } from 'lucide-react';

export default function ReportTab({
  userProfile,
  journeyHistory = []
}) {
  return (
    <div className="lg:col-span-12 flex flex-col gap-4">
      {/* Top Banner Header */}
      <div className="glass-card rounded-2xl p-5 border-l-4 border-amber-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            POST-JOURNEY AUDIT CERTIFICATE
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Journey Safety Certificate</h2>
          <p className="text-xs text-slate-400">
            Audit report for traveller: <span className="text-amber-300 font-bold">{userProfile?.name}</span>
          </p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 no-print"
        >
          <Download className="w-4 h-4" /> Download / Print Report (PDF)
        </button>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {journeyHistory.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-xs">
            No completed journey audits yet. Complete a journey in the Mobile App tab to generate an audit certificate.
          </div>
        ) : (
          journeyHistory.map((trip, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col gap-4 shadow-lg">
              
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-400">{trip.id}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {trip.origin} <span className="text-slate-500">→</span> {trip.destination}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {trip.date} • Cryptographic Hash: <span className="font-mono text-cyan-400">{trip.hash}</span>
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Safety Score: {trip.safetyScore} / 100
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{trip.duration}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Breadcrumbs Logged</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{trip.breadcrumbsCount} points</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Route Deviations</span>
                  <span className={`font-bold mt-0.5 block ${trip.deviations > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {trip.deviations > 0 ? `${trip.deviations} Stray Detected` : '0 Stray'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">SOS Status</span>
                  <span className={`font-bold mt-0.5 block ${trip.sosTriggered ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {trip.sosTriggered ? '🚨 SOS Dispatched' : '✅ Normal Arrival'}
                  </span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
