import React, { useEffect, useRef } from 'react';
import { Cpu, Shield, AlertTriangle, Activity } from 'lucide-react';

export default function IotWorkbenchTab({
  iotDevice,
  setIotDevice,
  sosActive,
  triggerSOS
}) {
  const gyroCanvasRef = useRef(null);

  // Canvas: Real-time Gyroscope Plot
  useEffect(() => {
    let animId = null;
    const canvas = gyroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let historyZ = new Array(30).fill(1.0);

    const drawGyro = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Zero baseline
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Impact Threshold Line (4.2g)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.lineTo(canvas.width, 15);
      ctx.stroke();
      ctx.setLineDash([]);

      // Shift and push simulated vector
      historyZ.shift();
      const currentVal = (iotDevice?.gyroZ || 0.98) + (Math.random() - 0.5) * 0.12;
      historyZ.push(currentVal);

      // Plot line waveform
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

  return (
    <div className="lg:col-span-12 flex flex-col gap-4">
      {/* Top Banner Header */}
      <div className="glass-card rounded-2xl p-5 border-l-4 border-purple-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            ESP32 HARDWARE WORKBENCH
          </span>
          <h2 className="text-xl font-bold text-white mt-1">SmartGuard Ring / Band ESP32 Sensor Workbench</h2>
          <p className="text-xs text-slate-400">
            MPU6050 6-Axis Gyroscope/Accelerometer canvas, BLE GATT service telemetry, & fall impact trigger.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Hardware Ring Graphic & Fall Simulator (6 Cols) */}
        <div className="md:col-span-6 glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="w-56 h-56 rounded-full metallic-hardware p-6 border-4 border-slate-700 flex items-center justify-center relative shadow-2xl">
            <div className={`absolute inset-3 rounded-full border-2 transition-all ${sosActive ? 'border-rose-500 animate-ping' : 'border-indigo-400/40'}`}></div>
            <button 
              onClick={() => triggerSOS("IoT Smart Ring Button Press")} 
              className="w-32 h-32 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-slate-600 hover:border-rose-500 shadow-inner flex flex-col items-center justify-center text-slate-200 hover:scale-105 transition-transform"
            >
              <Shield className="w-8 h-8 text-rose-500 mb-1" />
              <span className="text-xs font-extrabold tracking-wider">PANIC PRESS</span>
              <span className="text-[9px] text-slate-400">GPIO4 Interrupt</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 font-bold mt-4">ESP32-WROOM-32D Wearable Ring Module</p>
          <button 
            onClick={() => triggerSOS("IoT MPU6050 Accelerometer Impact (4.85g)")} 
            className="mt-4 px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-4 h-4" /> Simulate Fall Impact (&gt; 4.2g Vector)
          </button>
        </div>

        {/* Gyro Canvas Plot & MQTT Log Stream (6 Cols) */}
        <div className="md:col-span-6 flex flex-col gap-4">
          
          <div className="glass-card p-4 rounded-2xl flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" /> MPU6050 Accelerometer Plot
              </span>
              <span className="text-[10px] font-mono text-slate-400">Impact Threshold: 4.2g</span>
            </div>
            <canvas ref={gyroCanvasRef} width={380} height={110} className="w-full bg-slate-950 rounded-xl border border-slate-800" />
          </div>

          <div className="glass-card p-4 rounded-2xl flex-1 flex flex-col">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              MQTT / BLE GATT Message Stream
            </h3>
            <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[180px] font-mono text-[10.5px]">
              {iotDevice?.mqttLogs?.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`p-2 rounded border ${log.status === 'danger' ? 'bg-rose-950/40 border-rose-800 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-300'}`}
                >
                  <span className="text-slate-500 font-bold">[{log.time}]</span> <span className="text-indigo-400">{log.topic}</span>: {log.event}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
