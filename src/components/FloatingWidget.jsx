import React, { useState } from 'react';
import { 
  AlertTriangle, Shield, Battery, Signal, ChevronUp, ChevronDown, PhoneCall 
} from 'lucide-react';

export default function FloatingWidget({ 
  sosActive, 
  onTriggerSOS, 
  onCancelSOS, 
  batteryLevel, 
  isJourneyActive, 
  aiRiskScore,
  guardianName 
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-auto no-print">
      
      {/* Floating Collapsible HUD Panel */}
      {expanded && (
        <div className="floating-widget-panel p-4 rounded-2xl w-72 flex flex-col gap-3 text-slate-100 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Floating Safety HUD
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-bold">
              GPS ACTIVE
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery Telemetry
              </span>
              <span className="font-bold text-emerald-400">{batteryLevel}%</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5 text-indigo-400" /> AI Risk Score
              </span>
              <span className={`font-bold ${aiRiskScore > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {aiRiskScore} / 100
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Guardian</span>
              <span className="font-bold text-slate-200 mt-0.5 block">{guardianName || 'Ananya Sharma'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <a 
              href="tel:112"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call 112
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Pill */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-3 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-full border border-slate-800 shadow-xl backdrop-blur-md flex items-center justify-center"
          title={expanded ? "Collapse HUD" : "Expand Floating HUD"}
        >
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>

        <button 
          onClick={() => {
            if (sosActive) onCancelSOS();
            else onTriggerSOS("Floating Quick Panic Button");
          }}
          className={`px-5 py-3.5 rounded-full font-black text-xs tracking-wider shadow-2xl flex items-center gap-2.5 transition-all border-2 ${
            sosActive 
              ? 'bg-rose-600 hover:bg-rose-500 text-white border-white animate-bounce shadow-rose-600/50' 
              : 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-500 hover:scale-105 text-white border-rose-400/40 shadow-rose-600/40'
          }`}
        >
          <div className="p-1 bg-white/20 rounded-full">
            <AlertTriangle className="w-4 h-4 fill-white" />
          </div>
          <span>{sosActive ? 'CANCEL SOS' : 'QUICK SOS'}</span>
        </button>
      </div>

    </div>
  );
}
