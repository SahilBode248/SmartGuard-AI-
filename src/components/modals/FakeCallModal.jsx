import React from 'react';
import { PhoneCall, PhoneOff } from 'lucide-react';

export default function FakeCallModal({
  guardianName,
  fakeCallAnswered,
  fakeCallTimer,
  onAnswer,
  onEnd
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-950 rounded-3xl border border-slate-800 p-6 flex flex-col items-center text-center shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-4xl mb-4 border border-slate-700 animate-pulse">
          👩‍🦰
        </div>
        <h3 className="text-lg font-bold text-white">{guardianName || "Ananya Sharma (Mom)"}</h3>
        <p className="text-xs text-slate-400 mt-1">SmartGuard AI Call Simulator</p>
        
        {fakeCallAnswered ? (
          <div className="my-6">
            <span className="text-2xl font-mono font-bold text-emerald-400">
              00:{fakeCallTimer < 10 ? `0${fakeCallTimer}` : fakeCallTimer}
            </span>
            <p className="text-xs text-slate-400 mt-2">Speech Synthesis Active</p>
          </div>
        ) : (
          <p className="text-xs text-indigo-400 my-6 font-bold animate-bounce">
            Incoming Call...
          </p>
        )}

        <div className="flex items-center gap-6 mt-2">
          {!fakeCallAnswered ? (
            <>
              <button 
                onClick={onEnd} 
                className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                title="Decline Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <button 
                onClick={onAnswer} 
                className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce hover:scale-105 transition-transform"
                title="Answer Call"
              >
                <PhoneCall className="w-6 h-6" />
              </button>
            </>
          ) : (
            <button 
              onClick={onEnd} 
              className="px-8 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"
            >
              <PhoneOff className="w-5 h-5" /> End Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
