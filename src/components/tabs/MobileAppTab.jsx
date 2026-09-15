import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, Play, Pause, Square, PhoneCall, Mic, MicOff, Clock, 
  Plus, AlertTriangle, Zap, Volume2, VolumeX, Shield, Activity, MapPin, 
  FileText, ShieldCheck, RefreshCw, Search, ArrowRight, Loader2, Moon, Sun, Globe 
} from 'lucide-react';
import MapComponent from '../MapComponent';
import { DESTINATION_PRESETS, geocodeAddress, generateRouteWaypoints, generateMultiRoutes, calculateHaversineMeters } from '../../services/locationService';

export default function MobileAppTab({
  isJourneyActive,
  isPaused,
  elapsedSeconds,
  currentPos,
  setCurrentPos,
  breadcrumbs,
  setBreadcrumbs,
  isDeviated,
  strayDistanceMeters,
  userSpeed,
  batteryLevel,
  mapStyle,
  setMapStyle,
  routeMode,
  setRouteMode,
  userProfile,
  communityIncidents,
  sosActive,
  triggerSOS,
  cancelSOS,
  startJourney,
  endJourney,
  setIsPaused,
  startFakeCall,
  voiceListening,
  setVoiceListening,
  safeArrivalRemaining,
  setShowPinModal,
  setShowIncidentModal,
  setShowFirModal,
  aiRiskScore,
  isRecordingAudio,
  anomalyLogs,
  selectedDestination,
  setSelectedDestination,
  originName,
  setOriginName,
  originCoords,
  setOriginCoords,
  destCoords,
  setDestCoords,
  dynamicRoute,
  setDynamicRoute,
  fakeCallLang,
  setFakeCallLang,
  activeRouteId,
  setActiveRouteId
}) {
  const gaugeCanvasRef = useRef(null);
  const audioSpectrumCanvasRef = useRef(null);

  // Local state for freeform text inputs
  const [customOrigin, setCustomOrigin] = useState("Dighori, Nagpur, Maharashtra");
  const [customDestination, setCustomDestination] = useState("Suryodaya College of Engineering & Technology, Nagpur");
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Generate 3 AI Multi-Routes dynamically based on current origin & destination coordinates
  const multiRoutes = generateMultiRoutes(originCoords[0], originCoords[1], destCoords[0], destCoords[1]);

  // Check if current local time is Night Risk (8 PM to 6 AM)
  const currentHour = new Date().getHours();
  const isNightRisk = currentHour >= 20 || currentHour < 6;

  // Live OpenStreetMap Geocoding Search Handler
  const handleRouteSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsGeocoding(true);

    try {
      const originResult = await geocodeAddress(customOrigin);
      const destResult = await geocodeAddress(customDestination);

      const newOriginCoords = originResult ? [originResult.lat, originResult.lng] : [21.1090, 79.1350];
      const newDestCoords = destResult ? [destResult.lat, destResult.lng] : [21.0772, 79.1550];

      const waypoints = generateRouteWaypoints(
        newOriginCoords[0], newOriginCoords[1],
        newDestCoords[0], newDestCoords[1]
      );

      const distMeters = calculateHaversineMeters(newOriginCoords[0], newOriginCoords[1], newDestCoords[0], newDestCoords[1]);
      const etaMins = Math.max(2, Math.round((distMeters / 1000) * 3));

      setOriginName(originResult?.displayName || customOrigin);
      setOriginCoords(newOriginCoords);
      setDestCoords(newDestCoords);
      setDynamicRoute(waypoints);
      setCurrentPos(newOriginCoords);
      setBreadcrumbs([newOriginCoords]);

      setSelectedDestination({
        id: `geocoded-${Date.now()}`,
        origin: customOrigin,
        name: destResult?.displayName || customDestination,
        originCoords: newOriginCoords,
        destCoords: newDestCoords,
        eta: `${etaMins} mins`
      });
    } catch (err) {
      console.warn("Route calculation error:", err);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Canvas 1: Animated AI Risk Gauge / Speedometer
  useEffect(() => {
    const canvas = gaugeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height - 20;
    const radius = 80;

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, 2 * Math.PI, false);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#ef4444');
    gradient.addColorStop(0.5, '#f59e0b');
    gradient.addColorStop(1, '#10b981');

    const scorePercent = Math.max(0, Math.min(100, aiRiskScore)) / 100;
    const endAngle = Math.PI + scorePercent * Math.PI;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, endAngle, false);
    ctx.lineWidth = 14;
    ctx.strokeStyle = gradient;
    ctx.stroke();

    const needleAngle = Math.PI + scorePercent * Math.PI;
    const nx = cx + (radius - 15) * Math.cos(needleAngle);
    const ny = cy + (radius - 15) * Math.sin(needleAngle);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#6366f1';
    ctx.fill();
  }, [aiRiskScore]);

  // Canvas 2: Live Audio Waveform Spectrum
  useEffect(() => {
    let animId = null;
    const canvas = audioSpectrumCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawSpectrum = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 24;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = isRecordingAudio || sosActive 
          ? Math.random() * (canvas.height * 0.85) + 5 
          : Math.sin(Date.now() * 0.005 + i) * 8 + 12;

        const x = i * barWidth;
        const y = canvas.height - height;

        ctx.fillStyle = sosActive ? '#ef4444' : '#6366f1';
        ctx.fillRect(x + 2, y, barWidth - 4, height);
      }
      animId = requestAnimationFrame(drawSpectrum);
    };

    drawSpectrum();
    return () => cancelAnimationFrame(animId);
  }, [isRecordingAudio, sosActive]);

  return (
    <>
      {/* Left Column: Interactive Map & Telemetry Controls */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* NIGHT RISK & LIGHTING ASSESSOR HUD BADGE */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            {isNightRisk ? <Moon className="w-4 h-4 text-purple-400 animate-pulse" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="font-extrabold text-slate-200">
              {isNightRisk ? '🌙 NIGHT SURVEILLANCE MODE (High Risk Multiplier Active)' : '☀️ DAYTIME NAVIGATION (Normal Lighting)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-semibold">Fake Call Voice:</span>
            <button 
              type="button" 
              onClick={() => setFakeCallLang(fakeCallLang === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white font-bold text-[11px] shadow-sm"
            >
              {fakeCallLang === 'hi' ? '🇮🇳 Hindi (हिंदी)' : '🇬🇧 English'}
            </button>
          </div>
        </div>

        {/* PROMINENT DYNAMIC ORIGIN & TRAVELLING DESTINATION INPUT BAR */}
        <div className="glass-card rounded-2xl p-4 border border-indigo-500/40 shadow-2xl space-y-3 bg-slate-950/90">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> Live Route Navigation & Travelling Destination Entry
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
              ETA: {selectedDestination.eta}
            </span>
          </div>

          <form onSubmit={handleRouteSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
            {/* Origin Input */}
            <div className="md:col-span-5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                📍 Starting Location (Origin)
              </label>
              <input 
                type="text" 
                value={customOrigin} 
                onChange={(e) => setCustomOrigin(e.target.value)}
                placeholder="e.g. Dighori, Nagpur"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Destination Input */}
            <div className="md:col-span-5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                🏁 Travelling Destination
              </label>
              <input 
                type="text" 
                value={customDestination} 
                onChange={(e) => setCustomDestination(e.target.value)}
                placeholder="e.g. Suryodaya college Nagpur"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Calculate Route Button */}
            <div className="md:col-span-2 flex items-end">
              <button 
                type="submit" 
                disabled={isGeocoding}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1 transition-all"
              >
                {isGeocoding ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Calculate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Preset Selector Pills */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">Preset Routes:</span>
            {DESTINATION_PRESETS.map((dest) => (
              <button 
                key={dest.id} 
                type="button"
                onClick={() => {
                  setCustomOrigin(dest.origin);
                  setCustomDestination(dest.name);
                  setOriginName(dest.origin);
                  setSelectedDestination(dest);
                  if (dest.originCoords && dest.destCoords) {
                    setOriginCoords(dest.originCoords);
                    setDestCoords(dest.destCoords);
                    setCurrentPos(dest.originCoords);
                    setBreadcrumbs([dest.originCoords]);
                    setDynamicRoute(generateRouteWaypoints(
                      dest.originCoords[0], dest.originCoords[1],
                      dest.destCoords[0], dest.destCoords[1]
                    ));
                  }
                }}
                className={`px-2.5 py-1 rounded-lg border font-semibold whitespace-nowrap transition-all ${
                  selectedDestination.id === dest.id 
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md' 
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                🏁 {dest.name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* AI MULTI-ROUTE COMPARISON CARDS (Safest 🟢, Fastest ⚡, Well-Lit 💡) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button 
            type="button"
            onClick={() => {
              setActiveRouteId('safest');
              setDynamicRoute(multiRoutes.safest.waypoints);
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeRouteId === 'safest' 
                ? 'bg-emerald-950/60 border-emerald-400 shadow-lg scale-[1.02]' 
                : 'glass-card border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">RECOMMENDED</span>
              <span className="text-xs font-extrabold text-emerald-400">{multiRoutes.safest.score}% Safe</span>
            </div>
            <h4 className="text-xs font-bold text-white">{multiRoutes.safest.name}</h4>
            <p className="text-[10.5px] text-slate-400 mt-0.5 leading-tight">{multiRoutes.safest.description}</p>
          </button>

          <button 
            type="button"
            onClick={() => {
              setActiveRouteId('fastest');
              setDynamicRoute(multiRoutes.fastest.waypoints);
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeRouteId === 'fastest' 
                ? 'bg-amber-950/60 border-amber-400 shadow-lg scale-[1.02]' 
                : 'glass-card border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">DIRECT</span>
              <span className="text-xs font-extrabold text-amber-400">{multiRoutes.fastest.score}% Safe</span>
            </div>
            <h4 className="text-xs font-bold text-white">{multiRoutes.fastest.name}</h4>
            <p className="text-[10.5px] text-slate-400 mt-0.5 leading-tight">{multiRoutes.fastest.description}</p>
          </button>

          <button 
            type="button"
            onClick={() => {
              setActiveRouteId('wellLit');
              setDynamicRoute(multiRoutes.wellLit.waypoints);
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeRouteId === 'wellLit' 
                ? 'bg-cyan-950/60 border-cyan-400 shadow-lg scale-[1.02]' 
                : 'glass-card border-slate-800 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">WELL-LIT</span>
              <span className="text-xs font-extrabold text-cyan-400">{multiRoutes.wellLit.score}% Safe</span>
            </div>
            <h4 className="text-xs font-bold text-white">{multiRoutes.wellLit.name}</h4>
            <p className="text-[10.5px] text-slate-400 mt-0.5 leading-tight">{multiRoutes.wellLit.description}</p>
          </button>
        </div>

        {/* Leaflet Map Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-[450px] shadow-2xl flex flex-col">
          
          {/* Map Top Floating Overlay controls */}
          <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md text-xs font-bold border border-slate-800 flex items-center gap-1.5 shadow-lg text-slate-100">
                <span className={`w-2 h-2 rounded-full ${activeRouteId === 'safest' ? 'bg-emerald-400' : activeRouteId === 'wellLit' ? 'bg-cyan-400' : 'bg-amber-400 animate-ping'}`}></span>
                {activeRouteId === 'safest' ? '🟢 Safest AI Route Active' : activeRouteId === 'wellLit' ? '💡 Well-Lit Route Active' : '⚡ Direct Route Active'}
              </span>
              {isJourneyActive && (
                <span className="px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md text-xs font-semibold border border-slate-800 text-slate-300">
                  ⏱️ {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
                </span>
              )}
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <div className="bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-[11px]">
                <button 
                  onClick={() => setMapStyle('dark')} 
                  className={`px-2 py-0.5 rounded font-semibold ${mapStyle === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  Cyber
                </button>
                <button 
                  onClick={() => setMapStyle('satellite')} 
                  className={`px-2 py-0.5 rounded font-semibold ${mapStyle === 'satellite' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  Satellite
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Leaflet Map */}
          <div className="w-full h-full z-10">
            <MapComponent 
              currentPos={currentPos}
              breadcrumbs={breadcrumbs}
              sosActive={sosActive}
              mapStyle={mapStyle}
              routeMode={routeMode}
              userProfile={userProfile}
              userSpeed={userSpeed}
              batteryLevel={batteryLevel}
              communityIncidents={communityIncidents}
              destinationName={selectedDestination.name}
              originName={originName}
              originCoords={originCoords}
              destCoords={destCoords}
              dynamicRoute={dynamicRoute}
              multiRoutes={multiRoutes}
              activeRouteId={activeRouteId}
            />
          </div>

          {/* Map Footer Legend - BRIGHT RED CRIME INCIDENTS DISPLAYED CLEARLY */}
          <div className="bg-slate-950 border-t border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
            <div className="flex flex-wrap items-center gap-3 font-semibold">
              <span className="flex items-center gap-1.5 text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 animate-pulse">
                <span className="w-2.5 h-2.5 bg-rose-600 rounded-full border border-white"></span> 🚨 RED: Reported Crime Incident Hotspot
              </span>
              <span className="flex items-center gap-1 text-slate-400"><span className="w-3 h-1 bg-emerald-500 rounded"></span> Safest</span>
              <span className="flex items-center gap-1 text-slate-400"><span className="w-3 h-1 bg-cyan-400 rounded"></span> Well-Lit</span>
              <span className="flex items-center gap-1 text-slate-400"><span className="w-3 h-1 bg-amber-500 rounded"></span> Fastest</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFirModal(true)} 
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 border border-rose-500/30 px-2.5 py-1 rounded-lg bg-rose-500/10"
              >
                <FileText className="w-3.5 h-3.5" /> File Police FIR
              </button>
              <button 
                onClick={() => setShowIncidentModal(true)} 
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 border border-indigo-500/30 px-2.5 py-1 rounded-lg bg-indigo-500/10"
              >
                <Plus className="w-3.5 h-3.5" /> Tag Unsafe Spot
              </button>
            </div>
          </div>
        </div>

        {/* GPS Control Bar */}
        <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-rose-500" /> GPS Navigation Telemetry Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isJourneyActive ? (isPaused ? 'Journey paused.' : `Streaming live GPS coordinates. From: ${originName} → Target: ${selectedDestination.name}`) : 'Press Start Journey to activate live tracking.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isJourneyActive ? (
              <button 
                onClick={startJourney} 
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> Start Journey
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsPaused(!isPaused)} 
                  className="px-4 py-2.5 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />} {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button 
                  onClick={endJourney} 
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Square className="w-3.5 h-3.5 fill-white" /> Finish Journey
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3 Escape & Safety Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button 
            onClick={startFakeCall} 
            className="glass-card glass-card-hover p-3.5 rounded-xl text-left border border-slate-800 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">Escape Tool</span>
            </div>
            <h4 className="text-xs font-bold text-slate-100">Fake Call Simulator</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Triggers incoming call with AI voice to exit scenarios.</p>
          </button>

          <button 
            onClick={() => setVoiceListening(!voiceListening)} 
            className={`glass-card p-3.5 rounded-xl border text-left transition-all group ${voiceListening ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-800'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${voiceListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                {voiceListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${voiceListening ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {voiceListening ? 'LISTENING' : 'Voice Trigger'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-100">Voice Keyword SOS</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Triggers SOS if you say "Help", "Emergency", or "Save Me".</p>
          </button>

          <button 
            onClick={() => setShowPinModal(true)} 
            className="glass-card glass-card-hover p-3.5 rounded-xl text-left border border-slate-800 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {Math.floor(safeArrivalRemaining / 60)}m left
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-100">Safe-Arrival Monitor</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Auto SOS escalation if check-in PIN isn't entered before ETA.</p>
          </button>
        </div>

      </div>

      {/* Right Column: Panic Card, AI Canvas Gauge, Audio Spectrum & Logs */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Emergency SOS Dispatch Card */}
        <div className="glass-card-emergency rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
          <p className="text-[11px] uppercase font-extrabold tracking-widest text-rose-400">Emergency Dispatch Engine</p>
          <button 
            onClick={() => triggerSOS("Primary Workstation Panic Button")} 
            className="w-32 h-32 my-4 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 hover:from-rose-500 text-white font-extrabold text-2xl tracking-wider shadow-2xl border-4 border-rose-300/30 flex flex-col items-center justify-center gap-1 group transition-transform active:scale-95"
          >
            <AlertTriangle className="w-8 h-8 group-hover:animate-bounce" />
            <span>SOS</span>
          </button>
          <p className="text-xs text-slate-200 font-bold">1-Tap Emergency Dispatch</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">Broadcasts live coordinates to {userProfile?.guardianName || 'Guardian'} & Police 112.</p>
        </div>

        {/* AI Safety Risk Gauge Canvas */}
        <div className="glass-card rounded-2xl p-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Safety Risk Score</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Inference &lt; 12ms</span>
          </div>
          <canvas ref={gaugeCanvasRef} width={200} height={110} className="my-1" />
          <div className="text-center mt-[-15px]">
            <span className={`text-2xl font-extrabold ${aiRiskScore > 75 ? 'text-emerald-400' : aiRiskScore > 40 ? 'text-amber-400' : 'text-rose-500'}`}>
              {aiRiskScore} <span className="text-xs text-slate-500">/ 100</span>
            </span>
            <p className="text-[10px] font-bold uppercase mt-0.5 text-slate-400">
              Status: {aiRiskScore > 75 ? '✅ EXCELLENT' : aiRiskScore > 40 ? '⚠️ MODERATE ANOMALY' : '🚨 SEVERE DANGER'}
            </p>
          </div>
        </div>

        {/* Audio Spectrum Equalizer Canvas */}
        <div className="glass-card rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-indigo-400" /> Audio Recording Spectrum
            </span>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
              {isRecordingAudio ? 'REC ONLINE' : 'STANDBY'}
            </span>
          </div>
          <canvas ref={audioSpectrumCanvasRef} width={280} height={50} className="w-full bg-slate-950/80 rounded-xl border border-slate-800" />
        </div>

        {/* System Telemetry Log */}
        <div className="glass-card rounded-2xl p-4 flex-1 flex flex-col max-h-[190px]">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>System Telemetry Feed</span>
            <span className="text-[10px] text-slate-500 font-mono">{anomalyLogs.length} events</span>
          </h3>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[10.5px]">
            {anomalyLogs.length === 0 ? (
              <p className="text-slate-500 italic text-center py-4">No anomalies logged.</p>
            ) : (
              anomalyLogs.map((log, idx) => (
                <div key={idx} className="p-1.5 rounded bg-slate-950 border border-slate-800/80 text-slate-300 leading-tight">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </>
  );
}
