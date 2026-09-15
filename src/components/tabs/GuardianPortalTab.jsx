import React from 'react';
import { Eye, AlertTriangle, PhoneCall, Shield, Activity, MapPin, FileText } from 'lucide-react';
import MapComponent from '../MapComponent';
import { POLICE_STATIONS } from '../../services/policeService';

export default function GuardianPortalTab({
  userProfile,
  currentPos,
  breadcrumbs,
  sosActive,
  triggerSOS,
  batteryLevel,
  userSpeed,
  aiRiskScore,
  isDeviated,
  strayDistanceMeters,
  selectedDestination,
  firComplaints = []
}) {
  return (
    <div className="lg:col-span-12 flex flex-col gap-4">
      {/* Top Banner Header */}
      <div className="glass-card rounded-2xl p-5 border-l-4 border-indigo-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            AUTHORIZED GUARDIAN PORTAL
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Guardian Command & Control Center</h2>
          <p className="text-xs text-slate-400">
            Monitoring live safety session for user: <span className="text-indigo-300 font-bold">{userProfile?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => triggerSOS("Guardian Remote Siren Ping")} 
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" /> Remote Siren Ping
          </button>
          <a 
            href="tel:112" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4" /> Call 112 Helpline
          </a>
        </div>
      </div>

      {/* Live Destination & Police Node HUD Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl glass-card border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Destination</span>
            <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{selectedDestination?.name}</h4>
            <p className="text-[10px] text-emerald-400 font-bold">ETA: {selectedDestination?.eta}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-card border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Nearest Police HQ Node</span>
            <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{POLICE_STATIONS[0].name}</h4>
            <p className="text-[10px] text-blue-400 font-bold">Dispatch Status: CONNECTED</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-card border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Filed E-FIR Reports</span>
            <h4 className="text-xs font-bold text-white">{firComplaints.length} Registered FIRs</h4>
            <p className="text-[10px] text-rose-400 font-bold">Police HQ Synced</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Map Stream + Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Map Stream (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-[500px] shadow-xl">
          <MapComponent 
            currentPos={currentPos}
            breadcrumbs={breadcrumbs}
            sosActive={sosActive}
            mapStyle="dark"
            userProfile={userProfile}
            userSpeed={userSpeed}
            batteryLevel={batteryLevel}
            destinationName={selectedDestination?.name}
          />
        </div>

        {/* Right Remote Diagnostics & Network (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="glass-card p-4 rounded-2xl">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Remote Device Diagnostics
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Battery Level</span>
                <span className="font-bold text-emerald-400">{batteryLevel}%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Movement Velocity</span>
                <span className="font-bold text-slate-200">{userSpeed} km/h</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">AI Safety Score</span>
                <span className="font-bold text-cyan-400">{aiRiskScore} / 100</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Spatial Stray Offset</span>
                <span className={`font-bold ${isDeviated ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isDeviated ? `+${strayDistanceMeters}m Stray` : '0m (On Path)'}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex-1">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Registered Digital E-FIR Complaints
            </h3>
            <div className="space-y-2 text-xs max-h-[160px] overflow-y-auto">
              {firComplaints.length === 0 ? (
                <p className="text-slate-500 italic text-center py-4">No police complaints filed.</p>
              ) : (
                firComplaints.map((fir, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">{fir.firNumber}</span>
                    <h4 className="font-bold text-slate-200 mt-0.5">{fir.category}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{fir.policeStation}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
