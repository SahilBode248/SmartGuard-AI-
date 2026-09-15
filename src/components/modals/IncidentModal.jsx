import React, { useState } from 'react';
import { AlertCircle, MapPin } from 'lucide-react';

export default function IncidentModal({
  onSubmitIncident,
  onClose
}) {
  const [incidentText, setIncidentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!incidentText.trim()) return;
    onSubmitIncident(incidentText.trim());
    setIncidentText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" /> Report Unsafe Community Zone
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Flag unlit streets, broken security cameras, or isolated spots to warn community travellers in real-time.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Issue Description & Nearby Landmark
            </label>
            <textarea 
              rows={3} 
              value={incidentText} 
              onChange={(e) => setIncidentText(e.target.value)} 
              placeholder="e.g. Broken streetlight & low cellular signal under the Metro Flyover" 
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500" 
              required 
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" /> Publish Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
