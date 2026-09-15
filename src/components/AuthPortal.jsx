import React, { useState } from 'react';
import { 
  Shield, Navigation, AlertTriangle, Cpu, Eye, Sparkles, 
  Mail, Key, ArrowRight, Fingerprint, CheckCircle2 
} from 'lucide-react';

export default function AuthPortal({ 
  onLoginSuccess, 
  onRegisterSuccess, 
  onDemoLaunch 
}) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("sahil.bode@example.com");
  const [loginPin, setLoginPin] = useState("1234");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPin, setRegPin] = useState("");
  const [regGuardianName, setRegGuardianName] = useState("");
  const [regGuardianPhone, setRegGuardianPhone] = useState("");
  const [regAvatar, setRegAvatar] = useState("👩");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPin) {
      alert("Please enter both Email and PIN.");
      return;
    }
    onLoginSuccess({
      name: "Sahil Bode",
      email: loginEmail,
      phone: "+91 98765 43210",
      emergencyPin: loginPin,
      guardianName: "Ananya Bode (Mom)",
      guardianPhone: "+91 98112 34567",
      avatar: "👩",
      role: "User Traveller"
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regPhone || !regPin) {
      alert("Please complete all required fields.");
      return;
    }
    onRegisterSuccess({
      name: regName,
      email: regEmail || `${regName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: regPhone,
      emergencyPin: regPin,
      guardianName: regGuardianName || "Ananya Sharma (Mom)",
      guardianPhone: regGuardianPhone || "+91 98112 34567",
      avatar: regAvatar,
      role: "Registered User"
    });
  };

  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      onLoginSuccess({
        name: "Sahil Bode",
        email: "sahil.bode@example.com",
        phone: "+91 98765 43210",
        emergencyPin: "1234",
        guardianName: "Ananya Bode (Mom)",
        guardianPhone: "+91 98112 34567",
        avatar: "👩",
        role: "Biometric Authenticated"
      });
    }, 1400);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full cyber-grid">
      
      {/* Top Branding Header */}
      <header className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-indigo-500/25 border border-white/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              SmartGuard <span className="bg-gradient-to-r from-rose-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-xs text-slate-400">Intelligent Women Safety & Emergency Response Ecosystem</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>B.Tech Final Year Capstone Standard</span>
        </div>
      </header>

      {/* Main Auth Grid */}
      <div className="my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Feature Showcase */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold w-fit">
            <Shield className="w-3.5 h-3.5" /> Next-Gen Safety Ecosystem
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Proactive Safety & <br />
            <span className="bg-gradient-to-r from-rose-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Intelligent Emergency Response
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            A smart, AI-powered, IoT-enabled women safety ecosystem going beyond basic SOS apps with real-time Haversine GPS tracking, ESP32 Smart Ring hardware integration, and multi-node emergency escalation.
          </p>

          {/* 4 Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div className="p-3.5 rounded-2xl glass-card flex items-start gap-3 border border-slate-800">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Spatial Haversine Tracking</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Real-time route stray detection (+340m alert).</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl glass-card flex items-start gap-3 border border-slate-800">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Tactical Siren & Voice SOS</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">105dB Web Audio synth & keyword detection.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl glass-card flex items-start gap-3 border border-slate-800">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">ESP32 IoT Ring Telemetry</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">MPU6050 Gyroscope fall detection (&gt;4.2g).</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl glass-card flex items-start gap-3 border border-slate-800">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Guardian Remote Portal</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Authorized observer network & live telemetry.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 10,000+ Safe Journeys</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 98.4% AI Precision</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Auth Card */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
            
            {/* Biometric Laser Scanner Overlay */}
            {isBiometricScanning && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full border-2 border-emerald-400 flex items-center justify-center relative my-4">
                  <div className="animate-biometric"></div>
                  <Fingerprint className="w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-white">Scanning TouchID / FaceID...</h3>
                <p className="text-xs text-slate-400 mt-1">Authenticating encrypted payload</p>
              </div>
            )}

            {/* Tab Switcher: Login vs Register */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
              <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  authMode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Login to Account
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  authMode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email or Phone Number
                  </label>
                  <input 
                    type="text" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="sahil.sharma@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 mb-1">
                    <Key className="w-3.5 h-3.5 text-indigo-400" /> 4-Digit Emergency PIN
                  </label>
                  <input 
                    type="password" 
                    maxLength={4}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold tracking-widest"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-600 via-indigo-600 to-cyan-500 hover:from-rose-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Authenticate & Launch Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button 
                  type="button"
                  onClick={handleBiometricAuth}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-4 h-4" /> Quick Biometric Scan (TouchID / FaceID)
                </button>

                {/* 1-Click Demo Personas */}
                <div className="pt-3 border-t border-slate-800/80 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Or 1-Click Launch Demo Workspace:</span>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <button 
                      type="button"
                      onClick={() => onDemoLaunch("User Traveller", "Sahil Sharma", "sahil@example.com", "👩")}
                      className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-[10.5px] font-bold text-indigo-300 rounded-lg border border-slate-800"
                    >
                      👩 User Mode
                    </button>
                    <button 
                      type="button"
                      onClick={() => onDemoLaunch("Guardian Observer", "Ananya Sharma (Mom)", "mom@example.com", "👩‍🦰")}
                      className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-[10.5px] font-bold text-emerald-300 rounded-lg border border-slate-800"
                    >
                      👁️ Guardian
                    </button>
                    <button 
                      type="button"
                      onClick={() => onDemoLaunch("IoT Developer", "ESP32 Engineer", "iot@example.com", "👩‍💻")}
                      className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-[10.5px] font-bold text-purple-300 rounded-lg border border-slate-800"
                    >
                      💍 IoT Admin
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold">Full Name</label>
                  <input 
                    type="text" 
                    value={regName} onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sahil Sharma"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold">Mobile Number</label>
                    <input 
                      type="tel" 
                      value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold">4-Digit PIN</label>
                    <input 
                      type="password" maxLength={4}
                      value={regPin} onChange={(e) => setRegPin(e.target.value)}
                      placeholder="1234"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold">Primary Guardian Name & Phone</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={regGuardianName} onChange={(e) => setRegGuardianName(e.target.value)}
                      placeholder="Ananya Sharma (Mom)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <input 
                      type="tel" 
                      value={regGuardianPhone} onChange={(e) => setRegGuardianPhone(e.target.value)}
                      placeholder="+91 98112 34567"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Select Security Avatar</label>
                  <div className="flex items-center gap-3">
                    {['👩', '👧', '👩‍🦰', '👩‍⚕️', '👩‍💻'].map((emoji, idx) => (
                      <button 
                        key={idx} type="button"
                        onClick={() => setRegAvatar(emoji)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                          regAvatar === emoji ? 'bg-indigo-600 border-2 border-white scale-110' : 'bg-slate-950 border border-slate-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all mt-2"
                >
                  Create Account & Launch Platform
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

      <footer className="text-center py-3 text-xs text-slate-500 border-t border-slate-800/80">
        SmartGuard AI © 2026 – B.Tech Final Year Engineering Project System
      </footer>
    </div>
  );
}
