import React, { useState } from 'react';
import { PersonaConfig, PersonaId } from '../types';
import { PERSONAS } from '../data/featuresData';
import { geminiService } from '../services/geminiService';
import {
  X,
  Key,
  Eye,
  EyeOff,
  Radio,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Volume2,
} from 'lucide-react';
import { speechService } from '../services/speechService';

interface SettingsModalProps {
  currentPersona: PersonaConfig;
  onSelectPersona: (persona: PersonaConfig) => void;
  onClose: () => void;
  isServiceActive: boolean;
  onToggleService: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentPersona,
  onSelectPersona,
  onClose,
  isServiceActive,
  onToggleService,
}) => {
  const [apiKey, setApiKey] = useState(geminiService.getApiKey());
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<PersonaId>(currentPersona.id);

  const handleSave = () => {
    geminiService.setApiKey(apiKey);
    const chosen = PERSONAS[selectedPersonaId];
    if (chosen) {
      onSelectPersona(chosen);
    }
    setSavedSuccess(true);
    speechService.playBeep(880, 0.15);
    speechService.speak(
      `সেটিংস ও ${chosen.nameBn} সফলভাবে সংরক্ষিত হয়েছে।`,
      chosen
    );
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="maya-settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-slate-950/95 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,255,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider">
              SETTINGS ACTIVITY (SETTINGSACTIVITY.KT)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Gemini API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>GOOGLE GEMINI API KEY (ENCRYPTED STORAGE)</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                AES-256 GCM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              আপনার Google AI Studio থেকে প্রাপ্ত Gemini API Key প্রবেশ করান। এটি EncryptedSharedPreferences এ সুরক্ষিত থাকে।
            </p>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white font-mono outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Section 2: AI Persona Selection */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span>SELECT AI PERSONA (MAYAACTIVITY & GEMINIHELPER)</span>
            </label>

            <div className="space-y-2">
              {Object.values(PERSONAS).map((persona) => {
                const isSelected = selectedPersonaId === persona.id;
                return (
                  <div
                    key={persona.id}
                    onClick={() => setSelectedPersonaId(persona.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(0,242,255,0.1)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: persona.primaryColor }}
                        />
                        <span className="text-xs font-bold text-white font-mono">
                          {persona.name} ({persona.nameBn})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {persona.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-sans">
                      {persona.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Android Permissions & Overlays */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>ANDROID PERMISSIONS & SERVICES</span>
            </label>

            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <div className="text-xs font-mono font-semibold text-slate-200">
                  SYSTEM_ALERT_WINDOW (Screen Overlay HUD)
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  স্ক্রিনের উপর ভাসমান মায়া আল্ট্রা উইজেট প্রদর্শন
                </div>
              </div>
              <button
                onClick={onToggleService}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  isServiceActive
                    ? 'bg-cyan-500 text-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isServiceActive ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <div className="text-xs font-mono font-semibold text-slate-200">
                  BIND_ACCESSIBILITY_SERVICE (MayaAssistantService)
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  "Hey Maya" ভয়েস ওয়েক-ওয়ার্ড ও স্ক্রিন অটোমেশন
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/30 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            {savedSuccess ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> সেটিংস সফলভাবে সংরক্ষিত হয়েছে!
              </span>
            ) : (
              <span>* সমস্ত পরিবর্তন এনক্রিপ্ট করে সেভ করা হবে</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
            >
              বাতিল
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,242,255,0.3)]"
            >
              সেভ করুন (SAVE)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
