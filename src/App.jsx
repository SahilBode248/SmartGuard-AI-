import React, { useState, useEffect } from 'react';
import { AlertTriangle, Volume2, VolumeX } from 'lucide-react';

// Import modular services
import { startTacticalSiren, stopTacticalSiren } from './services/audioService';
import { speakFakeCallMessage, stopSpeechSynthesis, initVoiceKeywordSOS, stopVoiceKeywordSOS } from './services/speechService';
import { calculateHaversineMeters, DEFAULT_NAGPUR_ORIGIN, DEFAULT_NAGPUR_DESTINATION, generateRouteWaypoints, DESTINATION_PRESETS } from './services/locationService';
import { INITIAL_POLICE_COMPLAINTS } from './services/policeService';

// Import UI Components & Modals
import AuthPortal from './components/AuthPortal';
import Header from './components/Header';
import FloatingWidget from './components/FloatingWidget';
import MobileAppTab from './components/tabs/MobileAppTab';
import GuardianPortalTab from './components/tabs/GuardianPortalTab';
import IotWorkbenchTab from './components/tabs/IotWorkbenchTab';
import AiRiskMatrixTab from './components/tabs/AiRiskMatrixTab';
import BTechSrsTab from './components/tabs/BTechSrsTab';
import ReportTab from './components/tabs/ReportTab';

import FakeCallModal from './components/modals/FakeCallModal';
import SafeArrivalModal from './components/modals/SafeArrivalModal';
import IncidentModal from './components/modals/IncidentModal';
import PoliceFirModal from './components/modals/PoliceFirModal';

export default function App() {
  // --- SLIDE 1: AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Sahil Bode",
    email: "sahil.bode@example.com",
    phone: "+91 98765 43210",
    emergencyPin: "1234",
    guardianName: "Ananya Bode (Mom)",
    guardianPhone: "+91 98112 34567",
    avatar: "👩",
    role: "User Traveller"
  });

  // --- SLIDE 2: WORKSTATION STATE ---
  const [activeTab, setActiveTab] = useState('app');
  const [mapStyle, setMapStyle] = useState('dark');

  // Origin & Destination Lat/Lng State
  const [originName, setOriginName] = useState("Dighori, Nagpur, Maharashtra");
  const [originCoords, setOriginCoords] = useState(DEFAULT_NAGPUR_ORIGIN);
  const [destCoords, setDestCoords] = useState(DEFAULT_NAGPUR_DESTINATION);
  const [selectedDestination, setSelectedDestination] = useState(DESTINATION_PRESETS[0]);
  
  // AI Multi-Route Comparison Selection ('safest', 'fastest', 'wellLit')
  const [activeRouteId, setActiveRouteId] = useState('safest');
  const [dynamicRoute, setDynamicRoute] = useState(
    generateRouteWaypoints(DEFAULT_NAGPUR_ORIGIN[0], DEFAULT_NAGPUR_ORIGIN[1], DEFAULT_NAGPUR_DESTINATION[0], DEFAULT_NAGPUR_DESTINATION[1])
  );

  // Journey State
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [routeMode, setRouteMode] = useState('normal'); // 'normal', 'deviated', 'bypass'
  const [routeIndex, setRouteIndex] = useState(0);
  const [currentPos, setCurrentPos] = useState(DEFAULT_NAGPUR_ORIGIN);
  const [breadcrumbs, setBreadcrumbs] = useState([DEFAULT_NAGPUR_ORIGIN]);
  const [userSpeed, setUserSpeed] = useState(4.2);
  const [batteryLevel, setBatteryLevel] = useState(86);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // AI Safety State
  const [aiRiskScore, setAiRiskScore] = useState(96);
  const [isDeviated, setIsDeviated] = useState(false);
  const [strayDistanceMeters, setStrayDistanceMeters] = useState(0);
  const [anomalyLogs, setAnomalyLogs] = useState([]);

  // Sliders
  const [sliderDeviation, setSliderDeviation] = useState(0);

  // SOS Emergency Suite
  const [sosActive, setSosActive] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);

  // Fake Call State (Language: 'en' vs 'hi')
  const [fakeCallLang, setFakeCallLang] = useState('hi');
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [fakeCallAnswered, setFakeCallAnswered] = useState(false);
  const [fakeCallTimer, setFakeCallTimer] = useState(0);

  // Safe Arrival Monitor State
  const [safeArrivalMinutes, setSafeArrivalMinutes] = useState(15);
  const [safeArrivalRemaining, setSafeArrivalRemaining] = useState(900);
  const [showPinModal, setShowPinModal] = useState(false);

  // Community Incident Tagging State
  const [communityIncidents, setCommunityIncidents] = useState([
    { id: 1, location: "Underpass Alley B", issue: "Broken streetlights & low security", time: "1 hr ago", verified: true }
  ]);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // Digital Police FIR Modal & Complaint State
  const [showFirModal, setShowFirModal] = useState(false);
  const [firComplaints, setFirComplaints] = useState(INITIAL_POLICE_COMPLAINTS);

  // Virtual IoT ESP32 Smart Ring Device State
  const [iotDevice, setIotDevice] = useState({
    name: "SmartGuard ESP32-WROOM Ring",
    connected: true,
    battery: 94,
    bleRssi: -54,
    gyroX: 0.12, gyroY: -0.04, gyroZ: 0.98,
    gForceImpact: 1.02,
    mqttLogs: [
      { time: "17:15:10", event: "MQTT Broker Connected to tcp://mqtt.smartguard.ai:1883", topic: "sys/status", status: "ok" },
      { time: "17:18:15", event: "BLE GATT Characteristic Read: 0x2A19 (Battery 94%)", topic: "ble/telemetry", status: "ok" }
    ]
  });

  // Journey History Logs
  const [journeyHistory, setJourneyHistory] = useState([
    {
      id: "TRIP-SG-9921",
      date: "2026-08-28 17:00",
      origin: "Dighori, Nagpur, Maharashtra",
      destination: "Suryodaya College of Engineering & Technology, Nagpur",
      duration: "12 mins 00s",
      safetyScore: 98,
      deviations: 0,
      sosTriggered: false,
      breadcrumbsCount: 42,
      hash: "0x8f3c2a...e91b"
    }
  ]);

  // --- EMERGENCY HANDLERS ---
  const triggerSOS = (source = "Manual Button") => {
    setSosActive(true);
    const sirenStarted = startTacticalSiren();
    setSirenPlaying(sirenStarted);
    setIsRecordingAudio(true);

    const timeStr = new Date().toLocaleTimeString();
    const logEntry = `[${timeStr}] 🚨 EMERGENCY SOS DISPATCHED via ${source}! Lat: ${currentPos[0].toFixed(4)}, Lng: ${currentPos[1].toFixed(4)}. Broadcast sent to ${userProfile.guardianName} & Central Police HQ (112). From: ${originName} → Target: ${selectedDestination.name}`;
    setAnomalyLogs(prev => [logEntry, ...prev]);

    setIotDevice(prev => ({
      ...prev,
      mqttLogs: [
        { time: timeStr, event: `🚨 EMERGENCY ALERT FIRED VIA ${source.toUpperCase()}`, topic: "smartguard/alerts/sos", status: "danger" },
        ...prev.mqttLogs
      ]
    }));
  };

  const cancelSOS = () => {
    setSosActive(false);
    stopTacticalSiren();
    setSirenPlaying(false);
    setIsRecordingAudio(false);
  };

  const toggleSiren = () => {
    if (sirenPlaying) {
      stopTacticalSiren();
      setSirenPlaying(false);
    } else {
      const ok = startTacticalSiren();
      setSirenPlaying(ok);
    }
  };

  // --- VOICE KEYWORD SOS LISTENER (English & Hindi) ---
  useEffect(() => {
    if (voiceListening) {
      const recognition = initVoiceKeywordSOS((matchedKeyword) => {
        triggerSOS(`Voice Keyword Detection ("${matchedKeyword}")`);
      });
      if (!recognition) setVoiceListening(false);
    } else {
      stopVoiceKeywordSOS();
    }
    return () => stopVoiceKeywordSOS();
  }, [voiceListening]);

  // --- GPS SIMULATION LOOP ---
  useEffect(() => {
    let timer = null;
    if (isJourneyActive && !isPaused && isAuthenticated && dynamicRoute.length > 0) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);

        setSafeArrivalRemaining(prev => {
          if (prev <= 1) {
            triggerSOS("Safe Arrival Countdown Expiration");
            return 0;
          }
          return prev - 1;
        });

        setBatteryLevel(prev => Math.max(8, prev - (Math.random() > 0.75 ? 1 : 0)));

        setRouteIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % dynamicRoute.length;
          const nextPos = dynamicRoute[nextIndex];

          setCurrentPos(nextPos);
          setBreadcrumbs(prev => [...prev, nextPos]);

          const basePoint = dynamicRoute[0];
          const distMeters = calculateHaversineMeters(nextPos[0], nextPos[1], basePoint[0], basePoint[1]);

          if (distMeters > 500 && routeMode === 'deviated') {
            setIsDeviated(true);
            setStrayDistanceMeters(distMeters);
            setAiRiskScore(Math.max(20, 100 - Math.round(distMeters * 0.1)));

            if (!isDeviated) {
              const logMsg = `[${new Date().toLocaleTimeString()}] ⚠️ ROUTE ANOMALY: User strayed ${distMeters}m off planned route.`;
              setAnomalyLogs(prev => [logMsg, ...prev]);
            }
          } else {
            setIsDeviated(false);
            setStrayDistanceMeters(0);
            setAiRiskScore(activeRouteId === 'safest' ? 98 : activeRouteId === 'wellLit' ? 92 : 72);
          }

          return nextIndex;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isJourneyActive, isPaused, routeMode, dynamicRoute, activeRouteId, isAuthenticated]);

  // --- FAKE CALL TIMER ---
  useEffect(() => {
    let interval = null;
    if (fakeCallActive && fakeCallAnswered) {
      interval = setInterval(() => setFakeCallTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [fakeCallActive, fakeCallAnswered]);

  const startJourney = () => {
    setIsJourneyActive(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setRouteIndex(0);
    const startPoint = originCoords;
    setCurrentPos(startPoint);
    setBreadcrumbs([startPoint]);
    setSafeArrivalRemaining(safeArrivalMinutes * 60);
    setAnomalyLogs([`[${new Date().toLocaleTimeString()}] 🚀 Journey started for ${userProfile.name}. From: ${originName} → Target: ${selectedDestination.name}. GPS online.`]);
  };

  const endJourney = () => {
    setIsJourneyActive(false);
    setIsPaused(false);
    stopTacticalSiren();
    setSirenPlaying(false);

    const report = {
      id: `TRIP-SG-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString(),
      origin: originName,
      destination: selectedDestination.name,
      duration: `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`,
      safetyScore: aiRiskScore,
      deviations: routeMode === 'deviated' ? 1 : 0,
      sosTriggered: sosActive,
      breadcrumbsCount: breadcrumbs.length,
      hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
    };

    setJourneyHistory(prev => [report, ...prev]);
    setActiveTab('report');
  };

  const startFakeCall = () => {
    setFakeCallActive(true);
    setFakeCallAnswered(false);
    setFakeCallTimer(0);
  };

  const answerFakeCall = () => {
    setFakeCallAnswered(true);
    speakFakeCallMessage(userProfile.name, fakeCallLang);
  };

  const endFakeCall = () => {
    setFakeCallActive(false);
    setFakeCallAnswered(false);
    stopSpeechSynthesis();
  };

  return (
    <div className={`min-h-screen flex flex-col auth-bg-gradient text-slate-100 selection:bg-rose-500 selection:text-white ${sosActive ? 'sos-strobe-active' : ''}`}>
      
      {!isAuthenticated ? (
        <AuthPortal 
          onLoginSuccess={(profile) => {
            setUserProfile(profile);
            setIsAuthenticated(true);
          }}
          onRegisterSuccess={(profile) => {
            setUserProfile(profile);
            setIsAuthenticated(true);
          }}
          onDemoLaunch={(roleName, name, email, avatar) => {
            setUserProfile({
              name: name,
              email: email,
              phone: "+91 98765 43210",
              emergencyPin: "1234",
              guardianName: "Ananya Sharma (Mom)",
              guardianPhone: "+91 98112 34567",
              avatar: avatar,
              role: roleName
            });
            setIsAuthenticated(true);
          }}
        />
      ) : (
        <>
          {/* Floating Top Header Dock */}
          <Header 
            userProfile={userProfile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={() => {
              setIsAuthenticated(false);
              stopTacticalSiren();
              setSirenPlaying(false);
              setIsJourneyActive(false);
            }}
          />

          {/* ACTIVE SOS EMERGENCY BANNER */}
          {sosActive && (
            <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white px-4 py-3 shadow-2xl border-b border-rose-500 animate-pulse flex flex-wrap items-center justify-between gap-3 z-50 no-print">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full animate-ping">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xs uppercase font-extrabold tracking-wider">🚨 EMERGENCY DISPATCH ENGINE ACTIVE!</h2>
                  <p className="text-[11px] text-rose-100">Live coordinates broadcasted to {userProfile.guardianName} & Central Police HQ (112). From: {originName} → Target: {selectedDestination.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleSiren}
                  className="px-3 py-1.5 bg-black/40 hover:bg-black/60 text-white text-xs font-bold rounded-lg border border-white/20 flex items-center gap-1"
                >
                  {sirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {sirenPlaying ? 'Mute Siren' : 'Play Siren'}
                </button>
                <button 
                  onClick={cancelSOS}
                  className="px-4 py-1.5 bg-white text-rose-700 hover:bg-rose-50 text-xs font-extrabold rounded-lg shadow-lg"
                >
                  CANCEL EMERGENCY (SAFE)
                </button>
              </div>
            </div>
          )}

          {/* MAIN PLATFORM WORKSTATION */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            {activeTab === 'app' && (
              <MobileAppTab 
                isJourneyActive={isJourneyActive}
                isPaused={isPaused}
                elapsedSeconds={elapsedSeconds}
                currentPos={currentPos}
                setCurrentPos={setCurrentPos}
                breadcrumbs={breadcrumbs}
                setBreadcrumbs={setBreadcrumbs}
                isDeviated={isDeviated}
                strayDistanceMeters={strayDistanceMeters}
                userSpeed={userSpeed}
                batteryLevel={batteryLevel}
                mapStyle={mapStyle}
                setMapStyle={setMapStyle}
                routeMode={routeMode}
                setRouteMode={setRouteMode}
                userProfile={userProfile}
                communityIncidents={communityIncidents}
                sosActive={sosActive}
                triggerSOS={triggerSOS}
                cancelSOS={cancelSOS}
                startJourney={startJourney}
                endJourney={endJourney}
                setIsPaused={setIsPaused}
                startFakeCall={startFakeCall}
                voiceListening={voiceListening}
                setVoiceListening={setVoiceListening}
                safeArrivalRemaining={safeArrivalRemaining}
                setShowPinModal={setShowPinModal}
                setShowIncidentModal={setShowIncidentModal}
                setShowFirModal={setShowFirModal}
                aiRiskScore={aiRiskScore}
                isRecordingAudio={isRecordingAudio}
                anomalyLogs={anomalyLogs}
                selectedDestination={selectedDestination}
                setSelectedDestination={setSelectedDestination}
                originName={originName}
                setOriginName={setOriginName}
                originCoords={originCoords}
                setOriginCoords={setOriginCoords}
                destCoords={destCoords}
                setDestCoords={setDestCoords}
                dynamicRoute={dynamicRoute}
                setDynamicRoute={setDynamicRoute}
                fakeCallLang={fakeCallLang}
                setFakeCallLang={setFakeCallLang}
                activeRouteId={activeRouteId}
                setActiveRouteId={setActiveRouteId}
              />
            )}

            {activeTab === 'guardian' && (
              <GuardianPortalTab 
                userProfile={userProfile}
                currentPos={currentPos}
                breadcrumbs={breadcrumbs}
                sosActive={sosActive}
                triggerSOS={triggerSOS}
                batteryLevel={batteryLevel}
                userSpeed={userSpeed}
                aiRiskScore={aiRiskScore}
                isDeviated={isDeviated}
                strayDistanceMeters={strayDistanceMeters}
                selectedDestination={selectedDestination}
                firComplaints={firComplaints}
              />
            )}

            {activeTab === 'iot' && (
              <IotWorkbenchTab 
                iotDevice={iotDevice}
                setIotDevice={setIotDevice}
                sosActive={sosActive}
                triggerSOS={triggerSOS}
              />
            )}

            {activeTab === 'ai' && (
              <AiRiskMatrixTab 
                aiRiskScore={aiRiskScore}
                setAiRiskScore={setAiRiskScore}
                sliderDeviation={sliderDeviation}
                setSliderDeviation={setSliderDeviation}
              />
            )}

            {activeTab === 'btech' && (
              <BTechSrsTab />
            )}

            {activeTab === 'report' && (
              <ReportTab 
                userProfile={userProfile}
                journeyHistory={journeyHistory}
              />
            )}
          </main>

          {/* Persistent Floating Quick-SOS Widget */}
          <FloatingWidget 
            sosActive={sosActive}
            onTriggerSOS={triggerSOS}
            onCancelSOS={cancelSOS}
            batteryLevel={batteryLevel}
            isJourneyActive={isJourneyActive}
            aiRiskScore={aiRiskScore}
            guardianName={userProfile.guardianName}
          />

          {/* MODALS */}
          {fakeCallActive && (
            <FakeCallModal 
              guardianName={userProfile.guardianName}
              fakeCallAnswered={fakeCallAnswered}
              fakeCallTimer={fakeCallTimer}
              onAnswer={answerFakeCall}
              onEnd={endFakeCall}
            />
          )}

          {showPinModal && (
            <SafeArrivalModal 
              userPin={userProfile.emergencyPin}
              onConfirm={() => setShowPinModal(false)}
              onDuressTrigger={() => triggerSOS("Coercion Duress PIN (9999)")}
              onClose={() => setShowPinModal(false)}
            />
          )}

          {showIncidentModal && (
            <IncidentModal 
              onSubmitIncident={(text) => {
                setCommunityIncidents(prev => [
                  { id: Date.now(), location: "User Tagged Spot", issue: text, time: "Just now", verified: true },
                  ...prev
                ]);
              }}
              onClose={() => setShowIncidentModal(false)}
            />
          )}

          {showFirModal && (
            <PoliceFirModal 
              userProfile={userProfile}
              currentLocationName={`Location (${originName} -> ${selectedDestination.name})`}
              onSubmitFir={(firRecord) => {
                setFirComplaints(prev => [firRecord, ...prev]);
                setAnomalyLogs(prev => [`[${new Date().toLocaleTimeString()}] 📜 DIGITAL POLICE E-FIR FILED: ${firRecord.firNumber} (${firRecord.category}) - ${firRecord.policeStation}`, ...prev]);
              }}
              onClose={() => setShowFirModal(false)}
            />
          )}

          <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-3 px-4 text-center text-xs text-slate-500 no-print">
            SmartGuard AI © 2026 – B.Tech Final Year Engineering Project System
          </footer>
        </>
      )}

    </div>
  );
}
