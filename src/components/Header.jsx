import React from 'react';
import { 
  Shield, Smartphone, Eye, Cpu, Zap, Code, FileText, LogOut 
} from 'lucide-react';

export default function Header({ 
  userProfile, 
  activeTab, 
  setActiveTab, 
  onLogout 
}) {
  return (
    <header className="sticky top-2 z-40 max-w-7xl mx-auto px-4 py-1.5 w-full no-print">
      <div className="floating-glass-dock rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand Logo & Capstone Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SmartGuard <span className="bg-gradient-to-r from-rose-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                B.Tech Capstone
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Women Safety & Emergency Ecosystem</p>
          </div>
        </div>

        {/* User Profile Badge & Logout Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xl">{userProfile.avatar || '👩'}</span>
            <div className="hidden sm:block text-left">
              <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                {userProfile.name}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h4>
              <p className="text-[10px] text-slate-400">{userProfile.role} • PIN: ****</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 text-xs font-bold rounded-xl border border-slate-800 flex items-center gap-1.5 transition-all"
            title="Exit Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Exit Session</span>
          </button>
        </div>

        {/* Workstation Tab Switcher */}
        <div className="w-full lg:w-auto flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
          <button 
            onClick={() => setActiveTab('app')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'app' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile App
          </button>
          <button 
            onClick={() => setActiveTab('guardian')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guardian' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Guardian View
          </button>
          <button 
            onClick={() => setActiveTab('iot')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'iot' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> IoT ESP32
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ai' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> AI Risk Matrix
          </button>
          <button 
            onClick={() => setActiveTab('btech')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'btech' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> B.Tech SRS
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'report' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Report
          </button>
        </div>

      </div>
    </header>
  );
}
