import React from 'react';
import { PersonaConfig, SystemStatus } from '../types';
import {
  Wifi,
  BatteryCharging,
  Settings,
  Code,
  ShieldAlert,
  Radio,
  Sliders,
  Layers,
} from 'lucide-react';

interface HudHeaderProps {
  persona: PersonaConfig;
  systemStatus: SystemStatus;
  isServiceActive: boolean;
  onToggleService: () => void;
  onOpenSettings: () => void;
  onOpenCodeHub: () => void;
  onOpenSos: () => void;
  onOpenPersonaSwitch: () => void;
}

export const HudHeader: React.FC<HudHeaderProps> = ({
  persona,
  systemStatus,
  isServiceActive,
  onToggleService,
  onOpenSettings,
  onOpenCodeHub,
  onOpenSos,
  onOpenPersonaSwitch,
}) => {
  return (
    <header
      id="maya-hud-header"
      className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 shadow-[0_4px_20px_rgba(0,242,255,0.08)]"
    >
      {/* Brand & Persona Info */}
      <div className="flex items-center gap-3">
        <div
          onClick={onOpenPersonaSwitch}
          className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/30 border border-cyan-400/40 p-0.5 flex items-center justify-center cursor-pointer group hover:border-cyan-300 transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)]"
          title="Click to Switch Persona"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute" />
          <Radio className="w-5 h-5 text-cyan-300 relative z-10 group-hover:scale-110 transition-transform" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300">
              MAYA ULTRA 6.0.8
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/50 text-cyan-300 font-mono font-semibold">
              HUD
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans flex items-center gap-1.5">
            <span>{persona.nameBn}</span>
            <span className="text-slate-600">•</span>
            <span className="text-purple-300 font-mono text-[11px] uppercase">
              {persona.id}
            </span>
          </p>
        </div>
      </div>

      {/* System HUD Matrix Status Indicators */}
      <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-1.5" title="Wi-Fi 5GHz status">
          <Wifi className={`w-3.5 h-3.5 ${systemStatus.wifi ? 'text-cyan-400' : 'text-slate-600'}`} />
          <span>{systemStatus.wifi ? '5G_NET' : 'OFFLINE'}</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-700" />

        <div className="flex items-center gap-1.5" title="RAM Utilization">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>RAM {systemStatus.ramUsagePercent}%</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-700" />

        <div className="flex items-center gap-1.5" title="Battery Status">
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          <span>{systemStatus.batteryLevel}%</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Foreground Service Simulator Switch */}
        <button
          id="toggle-accessibility-service-btn"
          onClick={onToggleService}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all border ${
            isServiceActive
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(0,242,255,0.2)]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
          title="Toggle Background 'Hey Maya' Service & Floating HUD Widget"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">OVERLAY HUD</span>
        </button>

        {/* Emergency SOS */}
        <button
          id="header-sos-btn"
          onClick={onOpenSos}
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/50 flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)]"
          title="Feature 73: Emergency SOS"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="hidden sm:inline">SOS</span>
        </button>

        {/* Android Code Hub & Kotlin Files */}
        <button
          id="open-android-code-btn"
          onClick={onOpenCodeHub}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          title="View & Download Modular Android Kotlin Files (MainActivity.kt, SettingsActivity.kt, etc.)"
        >
          <Code className="w-3.5 h-3.5 text-purple-400" />
          <span>KOTLIN CODE</span>
        </button>

        {/* Settings Button */}
        <button
          id="open-settings-btn"
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-400/50 transition-all"
          title="Open Maya Settings (API Key, Personas, Permissions)"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
