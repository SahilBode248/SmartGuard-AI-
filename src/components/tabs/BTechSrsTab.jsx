import React from 'react';
import { Cpu, Layers } from 'lucide-react';

export default function BTechSrsTab() {
  return (
    <div className="lg:col-span-12 flex flex-col gap-4">
      {/* Top Banner Header */}
      <div className="glass-card rounded-2xl p-5 border-l-4 border-emerald-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            B.TECH CAPSTONE SPECIFICATIONS
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Software Requirements Specification (SRS) & Architecture</h2>
          <p className="text-xs text-slate-400">Hardware pinout table, 3-tier distributed dispatch, and LoRa/biometric specs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3-Tier Architecture (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-5 rounded-2xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" /> 3-Tier System Architecture
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40">
              <span className="font-bold text-purple-300">1. SENSOR & WEARABLE HARDWARE LAYER</span>
              <p className="text-slate-300 mt-1">
                ESP32 Microcontroller, MPU6050 Gyro/Accel, MAX30102 PPG Heart Rate, ESP32-CAM Stealth Snapshots, LoRa SX1276 Mesh Module.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
              <span className="font-bold text-cyan-300">2. MOBILE & EDGE COMPUTING LAYER</span>
              <p className="text-slate-300 mt-1">
                Spatial Haversine Distance Engine, Web Speech API Voice SOS, Shake-to-SOS Gestures, Web Audio 105dB Tactical Siren.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/40">
              <span className="font-bold text-rose-300">3. DISPATCH & GUARDIAN PORTAL LAYER</span>
              <p className="text-slate-300 mt-1">
                Polygon L2 Evidence Vault, Twilio WhatsApp / SMS Gateway, Live Guardian Web Command Portal, Helpline 112 Speed Dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Hardware Pinout Mapping (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-5 rounded-2xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-purple-400" /> ESP32 Hardware Pinout Mapping
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">GPIO21 / GPIO22</span>
              <span className="text-indigo-300 font-bold">MPU6050 & MAX30102 I2C</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">GPIO4 (INPUT)</span>
              <span className="text-rose-400 font-bold">SOS Push Button</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">GPIO16 / GPIO17</span>
              <span className="text-cyan-400 font-bold">SIM800L UART RX/TX</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">GPIO5 / GPIO18 (SPI)</span>
              <span className="text-emerald-400 font-bold">LoRa SX1276 CS / SCK</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">GPIO32 (CAM CLK)</span>
              <span className="text-purple-400 font-bold">ESP32-CAM XVCLK</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
