import React, { useState } from 'react';
import { PersonaConfig } from '../types';
import { Mic, Radio, Zap, X } from 'lucide-react';

interface FloatingOverlayHUDProps {
  persona: PersonaConfig;
  isListening: boolean;
  onTriggerVoice: () => void;
  onDismiss: () => void;
}

export const FloatingOverlayHUD: React.FC<FloatingOverlayHUDProps> = ({
  persona,
  isListening,
  onTriggerVoice,
  onDismiss,
}) => {
  const [position, setPosition] = useState({ x: 24, y: 120 });
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      id="maya-floating-overlay-hud"
      className="fixed z-40 flex flex-col items-end gap-2 transition-all duration-300"
      style={{ right: `${position.x}px`, bottom: `${position.y}px` }}
    >
      {isExpanded && (
        <div className="w-56 p-3 rounded-2xl bg-slate-950/90 border border-cyan-400/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,242,255,0.2)] text-xs text-white space-y-2 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-cyan-300 text-[11px]">
              FLOATING OVERLAY HUD
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-tight">
            "Hey Maya" / "হে মায়া" ওয়েক-ওয়ার্ড মনিটরিং সক্রিয় রয়েছে।
          </p>
          <button
            onClick={() => {
              onTriggerVoice();
              setIsExpanded(false);
            }}
            className="w-full py-1.5 rounded-lg bg-cyan-500 text-black font-bold font-mono text-[11px] flex items-center justify-center gap-1"
          >
            <Mic className="w-3 h-3" />
            <span>ভয়েস ইনপুট শুরু করুন</span>
          </button>
        </div>
      )}

      {/* Floating HUD Bubble */}
      <div className="relative group">
        <button
          onClick={() => {
            onTriggerVoice();
            setIsExpanded(!isExpanded);
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-[0_0_25px_rgba(0,242,255,0.35)] backdrop-blur-md ${
            isListening
              ? 'bg-cyan-500 border-white text-black animate-pulse scale-110'
              : 'bg-slate-950/85 border-cyan-400 text-cyan-300 hover:scale-105'
          }`}
          title="Maya Ultra Floating Screen Overlay"
        >
          <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-ping opacity-25 pointer-events-none" />
          <Mic className="w-6 h-6" />
        </button>

        <button
          onClick={onDismiss}
          className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Hide Overlay"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
