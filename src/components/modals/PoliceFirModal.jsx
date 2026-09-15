import React, { useState } from 'react';
import { Shield, FileText, Download, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { generateFirNumber, POLICE_STATIONS } from '../../services/policeService';

export default function PoliceFirModal({
  userProfile,
  currentLocationName = "Metro Station Hub (Lat: 28.6139, Lng: 77.2090)",
  onSubmitFir,
  onClose
}) {
  const [category, setCategory] = useState("Robbery & Theft");
  const [description, setDescription] = useState("");
  const [stolenItems, setStolenItems] = useState("");
  const [selectedStation, setSelectedStation] = useState(POLICE_STATIONS[0].name);
  const [submittedFir, setSubmittedFir] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please provide incident details.");
      return;
    }

    const firRecord = {
      firNumber: generateFirNumber(),
      date: new Date().toLocaleString(),
      category: category,
      complainantName: userProfile?.name || "Sahil Sharma",
      phone: userProfile?.phone || "+91 98765 43210",
      location: currentLocationName,
      description: description.trim(),
      policeStation: selectedStation,
      stolenProperty: stolenItems.trim() || "None specified",
      status: "REGISTERED & BROADCASTED TO POLICE HQ",
      hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
    };

    setSubmittedFir(firRecord);
    onSubmitFir(firRecord);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedFir ? (
          /* FORM VIEW */
          <div>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  Official Police Dispatch Interface
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">File Digital Police Complaint (E-FIR)</h3>
                <p className="text-xs text-slate-400">Direct transmission to Police Station Control Room & Helpline 112.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Complainant Name</label>
                  <input 
                    type="text" 
                    value={userProfile?.name || "Sahil Sharma"} 
                    disabled 
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Incident Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Robbery & Theft">🚨 Robbery & Theft</option>
                    <option value="Harassment & Stalking">⚠️ Harassment & Stalking</option>
                    <option value="Physical Assault Threat">💥 Physical Assault Threat</option>
                    <option value="Suspicious Activity">👁️ Suspicious Activity</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Jurisdiction Police Station Node</label>
                <select 
                  value={selectedStation} 
                  onChange={(e) => setSelectedStation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-bold focus:outline-none focus:border-indigo-500"
                >
                  {POLICE_STATIONS.map((ps) => (
                    <option key={ps.id} value={ps.name}>{ps.name} ({ps.controlRoomPhone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Incident Location GPS Timestamp</label>
                <input 
                  type="text" 
                  value={currentLocationName} 
                  disabled 
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono"
                />
              </div>

              {category === "Robbery & Theft" && (
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Stolen Items / Property Details</label>
                  <input 
                    type="text" 
                    value={stolenItems} 
                    onChange={(e) => setStolenItems(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro, Gold chain, Cash 5000 INR"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Full Statement & Suspect Details</label>
                <textarea 
                  rows={3} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe exact sequence of events, suspect appearance, clothing, vehicle number..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Submit Official E-FIR
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* SUCCESS CERTIFICATE VIEW */
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                E-FIR FILED SUCCESSFULLY
              </span>
              <h2 className="text-2xl font-black text-white mt-2 font-mono">{submittedFir.firNumber}</h2>
              <p className="text-xs text-slate-400 mt-1">Transmitted directly to {submittedFir.policeStation}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Complainant:</span>
                <span className="font-bold text-white">{submittedFir.complainantName} ({submittedFir.phone})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-rose-400">{submittedFir.category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Location:</span>
                <span className="font-bold text-cyan-400">{submittedFir.location}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Stolen Property:</span>
                <span className="font-bold text-amber-400">{submittedFir.stolenProperty}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block mb-0.5">Statement:</span>
                <p className="text-slate-200 bg-slate-900 p-2 rounded-lg italic">{submittedFir.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button 
                onClick={() => window.print()} 
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" /> Download Official FIR Copy
              </button>
              <button 
                onClick={onClose} 
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
