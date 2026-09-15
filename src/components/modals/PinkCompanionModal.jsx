import React, { useState } from 'react';
import { Heart, Star, PhoneCall, ShieldCheck, X } from 'lucide-react';
import { PINK_COMPANION_VOLUNTEERS } from '../../services/locationService';

export default function PinkCompanionModal({ isOpen, onClose }) {
  const [requestedId, setRequestedId] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full rounded-2xl p-6 border border-pink-500/30 shadow-2xl relative animate-scale-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl border border-pink-500/30">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Pink Companion Volunteer Escorts</h2>
            <p className="text-xs text-slate-400">Verified female safety volunteers walking nearby routes.</p>
          </div>
        </div>

        <div className="space-y-3 my-4">
          {PINK_COMPANION_VOLUNTEERS.map(vol => (
            <div key={vol.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  {vol.name}
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                    <ShieldCheck className="w-3 h-3 inline mr-0.5" /> VERIFIED
                  </span>
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-bold"><Star className="w-3 h-3 fill-amber-400" /> {vol.rating}</span>
                  <span>{vol.trips} Escort Trips</span>
                  <span className="text-pink-400 font-bold">{vol.status}</span>
                </div>
              </div>

              <button
                onClick={() => setRequestedId(vol.id)}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                  requestedId === vol.id 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-pink-600 hover:bg-pink-500 text-white'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                {requestedId === vol.id ? 'Requested!' : 'Request Escort'}
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 bg-pink-950/30 border border-pink-900/40 rounded-xl text-[11px] text-pink-200">
          💡 Volunteers are background-checked and linked to local Women Police Cells.
        </div>
      </div>
    </div>
  );
}
