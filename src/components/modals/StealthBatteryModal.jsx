import React, { useState, useEffect } from 'react';
import { BatteryCharging, ShieldAlert, EyeOff, Lock } from 'lucide-react';

export default function StealthBatteryModal({ isOpen, onClose, triggerSOS }) {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setPinError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pin === '1234') {
      onClose();
    } else if (pin === '9999') {
      triggerSOS("Duress PIN 9999 entered on Stealth Screen");
      onClose();
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-slate-300 flex flex-col items-center justify-center p-6 select-none animate-fade-in">
      {/* Fake Phone Shutdown / Low Battery UI */}
      <div className="text-center space-y-4 max-w-sm w-full">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-950/40 border border-red-800/60 flex items-center justify-center animate-pulse">
          <BatteryCharging className="w-10 h-10 text-red-500" />
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">BATTERY CRITICAL</h2>
          <p className="text-xs text-slate-500 mt-1">Shutting down system components in 3 seconds...</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <EyeOff className="w-4 h-4" /> STEALTH BACKGROUND GPS ACTIVE
          </div>
          <p className="text-[11px] text-slate-400">
            Screen is locked to trick attackers. Background telemetry and mic recording are active in hidden low-power mode.
          </p>
        </div>

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="space-y-3 pt-4 border-t border-slate-900">
          <div className="relative">
            <input 
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinError(false);
              }}
              placeholder="Enter PIN to Unlock"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-indigo-500"
            />
            <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
          </div>

          {pinError && <p className="text-xs text-rose-500 font-bold">Invalid Security PIN!</p>}

          <div className="flex gap-2">
            <button 
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
            >
              Unlock Screen
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
            >
              Dismiss
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
