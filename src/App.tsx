/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PersonaConfig, PersonaId, SystemStatus, FeatureItem, ChatMessage } from './types';
import { PERSONAS, ALL_85_FEATURES } from './data/featuresData';
import { speechService } from './services/speechService';
import { geminiService } from './services/geminiService';
import { FeatureRunner } from './services/featureRunner';
import { GlowCore } from './components/GlowCore';
import { VoiceWave } from './components/VoiceWave';
import { HudHeader } from './components/HudHeader';
import { FeatureCatalog } from './components/FeatureCatalog';
import { FeatureModal } from './components/FeatureModal';
import { SettingsModal } from './components/SettingsModal';
import { CodeViewerModal } from './components/CodeViewerModal';
import { FloatingOverlayHUD } from './components/FloatingOverlayHUD';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Sun,
  Flashlight,
  Cpu,
  MessageSquare,
  Eye,
  Shield,
  Volume2,
  VolumeX,
  Radio,
  Clock,
  Terminal,
} from 'lucide-react';

export default function App() {
  // Current Persona State
  const [currentPersona, setCurrentPersona] = useState<PersonaConfig>(PERSONAS.maya);

  // Audio / Speech State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Dialog State
  const [statusText, setStatusText] = useState('মায়া আল্ট্রা প্রস্তুত (Maya 6.0.8 HUD)');
  const [aiResponse, setAiResponse] = useState(
    'নমস্কার! আমি মায়া আল্ট্রা। আপনার অ্যান্ড্রয়েড সিস্টেমের সমস্ত ৮৫টি ফিচার পরিচালনা করতে আমি প্রস্তুত।'
  );
  const [textInput, setTextInput] = useState('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);

  // Hardware / System Status (Features 1-15)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    brightness: 80,
    volume: 75,
    wifi: true,
    bluetooth: true,
    flashlight: false,
    dnd: false,
    hotspot: false,
    batterySaver: false,
    ramUsagePercent: 48,
    cacheSizeMb: 340,
    autoRotate: true,
    screenTimeoutSec: 60,
    batteryLevel: 92,
  });

  // Services & Modals
  const [isServiceActive, setIsServiceActive] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showCodeHub, setShowCodeHub] = useState(false);
  const [activeModal, setActiveModal] = useState<{ type: string; feature: FeatureItem | null } | null>(null);

  // Initial greeting audio trigger
  useEffect(() => {
    // Check if user set a saved persona in localStorage
    const savedPersona = localStorage.getItem('selected_persona') as PersonaId;
    if (savedPersona && PERSONAS[savedPersona]) {
      setCurrentPersona(PERSONAS[savedPersona]);
    }
  }, []);

  const speakText = (text: string) => {
    if (soundMuted) return;
    setIsSpeaking(true);
    speechService.speak(text, currentPersona, () => {
      setIsSpeaking(false);
    });
  };

  const handleProcessQuery = async (query: string) => {
    if (!query.trim()) return;

    setStatusText(`ব্যবহারকারী: "${query}"`);
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatLog((prev) => [...prev.slice(-10), newMsg]);

    // Check if query directly triggers one of the 85 features
    const lower = query.toLowerCase();
    const matchedFeature = ALL_85_FEATURES.find(
      (f) =>
        lower.includes(f.title.toLowerCase()) ||
        lower.includes(f.titleBn.toLowerCase()) ||
        lower.includes(f.sampleVoiceCommandBn.toLowerCase())
    );

    if (matchedFeature) {
      handleExecuteFeature(matchedFeature);
      return;
    }

    // Otherwise pass to Gemini AI Service
    setIsSpeaking(true);
    const response = await geminiService.generateBengaliResponse(query, currentPersona);
    setAiResponse(response);
    setStatusText('মায়া আল্ট্রা উত্তর দিয়েছে:');

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'maya',
      text: response,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatLog((prev) => [...prev.slice(-10), aiMsg]);

    speakText(response);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setStatusText('শোনা বন্ধ হয়েছে');
    } else {
      speechService.stopSpeaking();
      setIsSpeaking(false);
      const started = speechService.startListening(
        (recognized) => {
          setIsListening(false);
          handleProcessQuery(recognized);
        },
        (listeningState) => {
          setIsListening(listeningState);
          if (listeningState) setStatusText('শুনছি... (বাংলায় কথা বলুন)');
        }
      );

      if (!started) {
        setStatusText('মাইক্রোফোন শুরু করা যায়নি। নিচে টাইপ করুন:');
      }
    }
  };

  const handleExecuteFeature = (feature: FeatureItem) => {
    const result = FeatureRunner.execute(
      feature,
      systemStatus,
      setSystemStatus,
      (modalType, feat) => {
        setActiveModal({ type: modalType, feature: feat });
      }
    );

    setAiResponse(result.messageBn);
    setStatusText(`ফিচার #${feature.id} কার্যকর:`);
    speakText(result.messageBn);

    const logMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'system',
      text: `[#${feature.id} ${feature.title}]: ${result.messageBn}`,
      timestamp: new Date().toLocaleTimeString(),
      featureTriggered: feature.id,
      category: feature.category,
    };
    setChatLog((prev) => [...prev.slice(-10), logMsg]);
  };

  return (
    <div
      id="maya-ultra-app"
      className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative overflow-x-hidden hud-grid-pattern selection:bg-cyan-500 selection:text-black font-sans"
    >
      {/* HUD Ambient Radial Aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 transition-colors duration-1000"
          style={{ backgroundColor: currentPersona.primaryColor }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full blur-[160px] opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: currentPersona.secondaryColor }}
        />
      </div>

      {/* Top Glassmorphism HUD Header */}
      <HudHeader
        persona={currentPersona}
        systemStatus={systemStatus}
        isServiceActive={isServiceActive}
        onToggleService={() => {
          setIsServiceActive(!isServiceActive);
          speechService.playBeep(650, 0.1);
        }}
        onOpenSettings={() => setShowSettings(true)}
        onOpenCodeHub={() => setShowCodeHub(true)}
        onOpenSos={() => {
          const sosFeature = ALL_85_FEATURES.find((f) => f.id === 73)!;
          handleExecuteFeature(sosFeature);
        }}
        onOpenPersonaSwitch={() => setShowSettings(true)}
      />

      {/* Main Home Screen HUD Container */}
      <main className="flex-1 flex flex-col items-center justify-start w-full max-w-5xl mx-auto px-4 py-6 z-10 relative space-y-6">
        {/* Glowing Pulse Core Section */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <GlowCore
            isListening={isListening}
            isSpeaking={isSpeaking}
            persona={currentPersona}
            onCoreClick={toggleVoiceInput}
          />

          {/* Voice Wave Dynamic Animation */}
          <VoiceWave
            isListening={isListening}
            isSpeaking={isSpeaking}
            color={currentPersona.primaryColor}
          />
        </div>

        {/* AI Dialog & Transcript Card (Translucent Glassmorphism HUD) */}
        <div
          id="hud-ai-dialog-card"
          className="w-full max-w-2xl rounded-3xl bg-slate-900/60 border border-cyan-500/30 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,242,255,0.1)] relative overflow-hidden transition-all"
        >
          {/* Subtle Cyber Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

          <div className="flex items-center justify-between text-xs font-mono text-cyan-400/90 mb-2">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>{statusText}</span>
            </span>

            <button
              onClick={() => {
                setSoundMuted(!soundMuted);
                speechService.stopSpeaking();
              }}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
              title={soundMuted ? 'Unmute Speech' : 'Mute Speech'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-base sm:text-lg font-medium text-white leading-relaxed font-sans min-h-[56px] flex items-center">
            {aiResponse}
          </p>

          {/* Quick Voice & Text Input Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
            <button
              id="main-voice-mic-btn"
              onClick={toggleVoiceInput}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-red-500/50'
                  : 'bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:opacity-90 shadow-cyan-400/30 hover:scale-105'
              }`}
              title="Click to speak in Bengali (বাংলায় কথা বলুন)"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && textInput.trim()) {
                    handleProcessQuery(textInput);
                    setTextInput('');
                  }
                }}
                placeholder="বাংলায় প্রশ্ন বা নির্দেশ লিখুন (যেমন: ব্রাইটনেস কমাও, গান চালাও)..."
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none backdrop-blur-md transition-all font-sans"
              />
            </div>

            <button
              onClick={() => {
                if (textInput.trim()) {
                  handleProcessQuery(textInput);
                  setTextInput('');
                }
              }}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-slate-700 hover:border-cyan-400 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick-Action HUD Cards (Preview of 6 Core Capabilities) */}
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              QUICK ACTION CARDS
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              TAP OR SPEAK COMMANDS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {[
              { id: 1, label: 'Brightness', labelBn: 'ব্রাইটনেস', icon: Sun, color: 'text-amber-400' },
              { id: 5, label: 'Flashlight', labelBn: 'টর্চলাইট', icon: Flashlight, color: 'text-cyan-400' },
              { id: 9, label: 'Boost RAM', labelBn: 'র‌্যাম বুস্টার', icon: Cpu, color: 'text-purple-400' },
              { id: 16, label: 'WhatsApp', labelBn: 'হোয়াটসঅ্যাপ', icon: MessageSquare, color: 'text-emerald-400' },
              { id: 31, label: 'Vision OCR', labelBn: 'ক্যামেরা স্ক্যান', icon: Eye, color: 'text-sky-400' },
              { id: 67, label: 'Anti-Theft', labelBn: 'অ্যান্টি-থেফট', icon: Shield, color: 'text-red-400' },
            ].map((item) => {
              const Icon = item.icon;
              const featObj = ALL_85_FEATURES.find((f) => f.id === item.id)!;
              return (
                <button
                  key={item.id}
                  id={`quick-action-btn-${item.id}`}
                  onClick={() => handleExecuteFeature(featObj)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-400/50 transition-all duration-200 group backdrop-blur-md shadow-sm hover:shadow-[0_0_15px_rgba(0,242,255,0.15)]"
                >
                  <Icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform mb-1`} />
                  <span className="text-xs font-bold text-slate-200 font-sans">{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-sans">{item.labelBn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 85 Features Catalog Browser */}
        <FeatureCatalog
          onExecuteFeature={handleExecuteFeature}
          onVoiceTrigger={(cmdBn) => {
            setTextInput(cmdBn);
            handleProcessQuery(cmdBn);
          }}
        />
      </main>

      {/* Floating Overlay Widget Simulation (MayaAssistantService) */}
      {isServiceActive && (
        <FloatingOverlayHUD
          persona={currentPersona}
          isListening={isListening}
          onTriggerVoice={toggleVoiceInput}
          onDismiss={() => setIsServiceActive(false)}
        />
      )}

      {/* Modals */}
      {activeModal && (
        <FeatureModal
          modalType={activeModal.type}
          feature={activeModal.feature}
          onClose={() => setActiveModal(null)}
          onSpeakText={speakText}
        />
      )}

      {showSettings && (
        <SettingsModal
          currentPersona={currentPersona}
          onSelectPersona={(p) => {
            setCurrentPersona(p);
            localStorage.setItem('selected_persona', p.id);
          }}
          onClose={() => setShowSettings(false)}
          isServiceActive={isServiceActive}
          onToggleService={() => setIsServiceActive(!isServiceActive)}
        />
      )}

      {showCodeHub && (
        <CodeViewerModal onClose={() => setShowCodeHub(false)} />
      )}
    </div>
  );
}
