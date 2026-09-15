import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Shield, AlertTriangle, Activity, Camera, Heart, Radio, CheckCircle2 } from 'lucide-react';

export default function IotWorkbenchTab({
  iotDevice,
  setIotDevice,
  sosActive,
  triggerSOS
}) {
  const gyroCanvasRef = useRef(null);
  const ppgCanvasRef = useRef(null);

  const [heartRateBpm, setHeartRateBpm] = useState(84);
  const [loraMeshActive, setLoraMeshActive] = useState(true);
  const [camSnapshotActive, setCamSnapshotActive] = useState(false);
  const [lastCamSnapshot, setLastCamSnapshot] = useState(null);

  // Canvas: Real-time Gyroscope Plot
  useEffect(() => {
    let animId = null;
    const canvas = gyroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let historyZ = new Array(30).fill(1.0);

    const drawGyro = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.lineTo(canvas.width, 15);
      ctx.stroke();
      ctx.setLineDash([]);

      historyZ.shift();
      const currentVal = (iotDevice?.gyroZ || 0.98) + (Math.random() - 0.5) * 0.12;
      historyZ.push(currentVal);

      const step = canvas.width / 30;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      historyZ.forEach((val, idx) => {
        const y = canvas.height / 2 - val * 20;
        if (idx === 0) ctx.moveTo(0, y);
        else ctx.lineTo(idx * step, y);
      });
      ctx.stroke();

      animId = requestAnimationFrame(drawGyro);
    };

    drawGyro();
    return () => cancelAnimationFrame(animId);
  }, [iotDevice]);

  // Canvas: MAX30102 PPG Heart Rate Pulse Waveform Plot
  useEffect(() => {
    let animId = null;
    const canvas = ppgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let ppgHistory = new Array(40).fill(0);
    let t = 0;

    const drawPpg = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.15;
      const pulseVal = Math.sin(t) * Math.cos(t * 0.5) * 20 + (Math.random() - 0.5) * 3;
      ppgHistory.shift();
      ppgHistory.push(pulseVal);

      const step = canvas.width / 40;
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ppgHistory.forEach((val, idx) => {
        const y = canvas.height / 2 - val;
        if (idx === 0) ctx.moveTo(0, y);
        else ctx.lineTo(idx * step, y);
      });
      ctx.stroke();

      animId = requestAnimationFrame(drawPpg);
    };

    drawPpg();
    return () => cancelAnimationFrame(animId);
  }, [heartRateBpm]);

  const triggerCamSnapshot = () => {
    setCamSnapshotActive(true);
    setTimeout(() => {
      setLastCamSnapshot(`https://images.unsplash.com/photo-1508873696983-2df515122519?w=400&auto=format&fit=crop&q=60&t=${Date.now()}`);
      setCamSnapshotActive(false);
    }, 600);
  };

  const simulateHighBpmSpike = () => {
    setHeartRateBpm(138);
    triggerSOS("MAX30102 Heart Rate Sensor Alert (138 BPM Stress Spike)");
  };

  return (
    <div className="lg:col-span-12 flex flex-col gap-4 animate-fade-in">
      {/* Top Banner Header */}
      <div className="glass-card rounded-2xl p-5 border-l-4 border-purple-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            ESP32 HARDWARE WORKBENCH
          </span>
          <h2 className="text-xl font-bold text-white mt-1">SmartGuard Ring / Band ESP32 Sensor Workbench</h2>
          <p className="text-xs text-slate-400">
            MPU6050 6-Axis Gyro, MAX30102 PPG Heart Rate, ESP32-CAM Stealth Snapshots & LoRa SX1276 Mesh Radio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Hardware Ring Graphic & Fall Simulator (6 Cols) */}
        <div className="md:col-span-6 glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl space-y-4">
          <div className="w-48 h-48 rounded-full metallic-hardware p-6 border-4 border-slate-700 flex items-center justify-center relative shadow-2xl">
            <div className={`absolute inset-3 rounded-full border-2 transition-all ${sosActive ? 'border-rose-500 animate-ping' : 'border-indigo-400/40'}`}></div>
            <button 
              onClick={() => triggerSOS("IoT Smart Ring Button Press")} 
              className="w-28 h-28 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-slate-600 hover:border-rose-500 shadow-inner flex flex-col items-center justify-center text-slate-200 hover:scale-105 transition-transform"
            >
              <Shield className="w-7 h-7 text-rose-500 mb-1" />
              <span className="text-[11px] font-extrabold tracking-wider">PANIC PRESS</span>
              <span className="text-[9px] text-slate-400">GPIO4 Interrupt</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 font-bold">ESP32-WROOM-32D Wearable Ring Module</p>

          <div className="flex flex-wrap gap-2 justify-center w-full">
            <button 
              onClick={() => triggerSOS("IoT MPU6050 Accelerometer Impact (4.85g)")} 
              className="px-3 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Fall Impact (&gt;4.2g)
            </button>
            <button 
              onClick={simulateHighBpmSpike} 
              className="px-3 py-2 bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/40 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Heart className="w-3.5 h-3.5" /> High BPM Spike (138 BPM)
            </button>
          </div>

          {/* LoRa Mesh Signal Toggle */}
          <div className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Radio className={`w-4 h-4 ${loraMeshActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              LoRa SX1276 Mesh Radio (868MHz)
            </div>
            <button
              onClick={() => setLoraMeshActive(!loraMeshActive)}
              className={`px-3 py-1 rounded-lg font-bold text-[10px] ${loraMeshActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}
            >
              {loraMeshActive ? 'ACTIVE MESH' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Gyro, PPG Canvas Plot & ESP32-CAM Feed (6 Cols) */}
        <div className="md:col-span-6 flex flex-col gap-4">
          
          {/* MPU6050 Gyro Canvas */}
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" /> MPU6050 Accelerometer Plot
              </span>
              <span className="text-[10px] font-mono text-slate-400">Impact Threshold: 4.2g</span>
            </div>
            <canvas ref={gyroCanvasRef} width={380} height={70} className="w-full bg-slate-950 rounded-xl border border-slate-800" />
          </div>

          {/* MAX30102 PPG Canvas */}
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-pink-500" /> MAX30102 PPG Heart Rate Waveform
              </span>
              <span className="text-xs font-mono font-bold text-pink-400">{heartRateBpm} BPM</span>
            </div>
            <canvas ref={ppgCanvasRef} width={380} height={70} className="w-full bg-slate-950 rounded-xl border border-slate-800" />
          </div>

          {/* ESP32-CAM Stealth Snapshots */}
          <div className="glass-card p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-purple-400" /> ESP32-CAM Stealth Snapshot
              </span>
              <button
                onClick={triggerCamSnapshot}
                disabled={camSnapshotActive}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] rounded-lg transition-all"
              >
                {camSnapshotActive ? 'Capturing...' : 'Capture Snapshot'}
              </button>
            </div>

            {lastCamSnapshot ? (
              <div className="relative rounded-xl overflow-hidden border border-purple-500/30 max-h-32">
                <img src={lastCamSnapshot} alt="ESP32-CAM Stealth Capture" className="w-full h-32 object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-purple-300 text-[10px] font-mono rounded">
                  <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-400" /> Stealth Capture Attached to FIR
                </span>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-center text-xs text-slate-500">
                No stealth image captured yet. Click capture or trigger emergency panic.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
