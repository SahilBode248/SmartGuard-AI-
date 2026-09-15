import React, { useState } from 'react';
import { Clock, Key, ShieldAlert } from 'lucide-react';

export default function SafeArrivalModal({
  userPin = "1234",
  onConfirm,
  onDuressTrigger,
  onClose
}) {
  const [pinInput, setPinInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pinInput === "9999") {
      // SECRET DURESS PIN ENTERED: Visually show disarmed while silently alerting authorities!
      alert("✅ Safe arrival confirmed! Automatic SOS escalation disarmed.");
      if (onDuressTrigger) onDuressTrigger();
      onConfirm();
    } else if (pinInput === userPin || pinInput === "1234") {
      alert("✅ Safe arrival confirmed! Automatic SOS escalation disarmed.");
      onConfirm();
    } else {
      alert("❌ Incorrect PIN. Default emergency PIN is 1234.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass-card rounded-2xl p-6 border border-slate-800 text-center shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">Safe-Arrival Verification</h3>
        <p className="text-xs text-slate-400 mt-1">Enter 4-digit PIN to confirm safe arrival & disarm automatic alert.</p>

        <form onSubmit={handleSubmit} className="mt-4">
          <input 
            type="password" 
            maxLength={4} 
            value={pinInput} 
            onChange={(e) => setPinInput(e.target.value)} 
            placeholder="PIN (1234)" 
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-lg font-bold text-white tracking-widest focus:outline-none focus:border-emerald-500" 
            autoFocus
            required
          />

          <p className="text-[10px] text-slate-500 mt-2 flex items-center justify-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-500" /> Duress Protection Active (Secret PIN: 9999)
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Verify PIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
