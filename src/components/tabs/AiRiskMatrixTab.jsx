import React from 'react';
import { Zap, Code } from 'lucide-react';

export default function AiRiskMatrixTab({
  aiRiskScore,
  setAiRiskScore,
  sliderDeviation,
  setSliderDeviation
}) {
  return (
    <div className="lg:col-span-12 flex flex-col gap-4">
      {/* Top Banner Header */}
      <div className="glass-card rounded-2xl p-5 border-l-4 border-cyan-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
            MACHINE LEARNING MATH MODEL
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Multi-Variable AI Risk & Anomaly Matrix</h2>
          <p className="text-xs text-slate-400">
            Mathematical evaluation using weighted spatial & contextual parameters ($D_{`{stray}`}$, $T_{`{night}`}$, $B_{`{battery}`}$).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Formula & Metrics (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Code className="w-4 h-4" /> Mathematical Formula Engine
            </h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 leading-relaxed shadow-inner">
              SafetyScore(t) = 100 - [ (w₁ × D_stray / 500) + (w₂ × T_night) + (w₃ × (100 - Battery)) ]
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Weights: $w_1 = 0.45$ (Spatial Offset), $w_2 = 0.35$ (Lighting & Time), $w_3 = 0.20$ (Device Power Status).
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
              Model Accuracy Evaluation Metrics
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Precision</span>
                <p className="text-lg font-extrabold text-emerald-400 mt-0.5">98.4%</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Recall</span>
                <p className="text-lg font-extrabold text-cyan-400 mt-0.5">97.2%</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">F1-Score</span>
                <p className="text-lg font-extrabold text-indigo-400 mt-0.5">97.8%</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Parameter Simulator (6 Cols) */}
        <div className="lg:col-span-6 glass-card p-5 rounded-2xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            Live Parameter Interactive Simulator
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Stray Spatial Offset ($D_{`{stray}`}$)</span>
                <span className="font-mono font-bold text-amber-400">{sliderDeviation}m</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="450" 
                value={sliderDeviation} 
                onChange={(e) => { 
                  const val = parseInt(e.target.value); 
                  setSliderDeviation(val); 
                  setAiRiskScore(Math.max(15, 100 - Math.round(val * 0.2))); 
                }} 
                className="w-full accent-amber-500 cursor-pointer" 
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200">Computed Output AI Risk Score</span>
                <p className="text-[10px] text-slate-400">Real-time inferencing update</p>
              </div>
              <span className={`text-2xl font-black ${aiRiskScore > 75 ? 'text-emerald-400' : aiRiskScore > 40 ? 'text-amber-400' : 'text-rose-500'}`}>
                {aiRiskScore} <span className="text-xs text-slate-500">/ 100</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
