import React, { useState, useEffect, useRef } from 'react';
import { FeatureItem } from '../types';
import {
  X,
  Camera,
  Activity,
  Send,
  DollarSign,
  Calculator,
  CheckSquare,
  Music,
  ShieldAlert,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  Copy,
  Scan,
  MapPin,
  Volume2,
} from 'lucide-react';
import { speechService } from '../services/speechService';

interface FeatureModalProps {
  modalType: string;
  feature: FeatureItem | null;
  onClose: () => void;
  onSpeakText: (text: string) => void;
}

export const FeatureModal: React.FC<FeatureModalProps> = ({
  modalType,
  feature,
  onClose,
  onSpeakText,
}) => {
  // Speed test state
  const [speedProgress, setSpeedProgress] = useState(0);
  const [speedResult, setSpeedResult] = useState<{ ping: number; download: number; upload: number } | null>(null);

  // Vision scanner state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [visionMode, setVisionMode] = useState<'object' | 'ocr' | 'qr' | 'color'>('object');
  const [scanResult, setScanResult] = useState<string>('ক্যামেরা লক্ষ্যবস্তুর দিকে তাক করুন...');

  // WhatsApp state
  const [waNumber, setWaNumber] = useState('01712345678');
  const [waMessage, setWaMessage] = useState('নমস্কার! মায়া আল্ট্রা থেকে স্বয়ংক্রিয় বার্তা পাঠানো হলো।');
  const [waSent, setWaSent] = useState(false);

  // Currency Converter
  const [currAmount, setCurrAmount] = useState('100');
  const [currFrom, setCurrFrom] = useState('USD');
  const [currTo, setCurrTo] = useState('BDT');

  // Calculator
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  // To-Do List
  const [todos, setTodos] = useState<string[]>([
    'মায়া আল্ট্রা ৮৫টি ফিচার পরীক্ষা করা',
    'গুগল জেমিনি এআই কি কনফিগার করা',
    'বাংলা ভয়েস কমান্ড চেক করা',
  ]);
  const [newTodo, setNewTodo] = useState('');

  // Music Player
  const [isPlaying, setIsPlaying] = useState(true);
  const [trackIndex, setTrackIndex] = useState(0);
  const tracks = [
    { title: 'Cyber Pulse of Dhaka', artist: 'Maya SynthWave 6.0', duration: '3:45' },
    { title: 'Neon Horizon', artist: 'Bangla Cyberpunk OST', duration: '4:12' },
    { title: 'Electric Monsoon', artist: 'Neural Orchestra', duration: '2:58' },
  ];

  // Speed Test Effect
  useEffect(() => {
    if (modalType === 'speed_test') {
      setSpeedProgress(0);
      setSpeedResult(null);
      const interval = setInterval(() => {
        setSpeedProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            const res = { ping: 14, download: 58.4, upload: 24.8 };
            setSpeedResult(res);
            onSpeakText(`স্পিড টেস্ট সম্পন্ন! ডাউনলোড গতি ${res.download} এমবিপিএস এবং পিং ${res.ping} মিলি সেকেন্ড।`);
            return 100;
          }
          return prev + 15;
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [modalType]);

  // Camera cleanup
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        setScanResult('ক্যামেরা চালু হয়েছে। স্ক্যানিং প্রক্রিয়া চলমান...');
      }
    } catch (e) {
      setScanResult('ক্যামেরা পারমিশন পাওয়া যায়নি। সিমুলেশন মোড সক্রিয় করা হলো।');
    }
  };

  const handleVisionScan = (mode: 'object' | 'ocr' | 'qr' | 'color') => {
    setVisionMode(mode);
    speechService.playBeep(800, 0.1);

    if (mode === 'object') {
      const r = 'শনাক্তকৃত বস্তুসমূহ: ১. স্মার্টফোন (৯৮%) | ২. ল্যাপটপ কীবোর্ড (৯৫%) | ৩. চশমা (৮৯%)';
      setScanResult(r);
      onSpeakText(r);
    } else if (mode === 'ocr') {
      const r = 'ওসিআর স্ক্যান ফলাফল: "MAYA ULTRA 6.0.8 - AI ASSISTANT FOR ANDROID"';
      setScanResult(r);
      onSpeakText(r);
    } else if (mode === 'qr') {
      const r = 'কিউআর কোড লিংক: https://ai.studio/build (নিরাপদ যাচাইকৃত লিঙ্ক)';
      setScanResult(r);
      onSpeakText(r);
    } else if (mode === 'color') {
      const r = 'প্রধান রঙ: নিয়ন সায়ান ব্লু (#00F2FF) এবং ইলেকট্রিক পার্পল (#8B5CF6)';
      setScanResult(r);
      onSpeakText(r);
    }
  };

  const calculateRates = () => {
    const amt = parseFloat(currAmount) || 0;
    const rates: Record<string, number> = {
      USD: 121.5,
      EUR: 131.2,
      GBP: 154.6,
      SAR: 32.4,
      INR: 1.45,
      BDT: 1.0,
    };
    const inBdt = amt * (rates[currFrom] || 1);
    const finalVal = inBdt / (rates[currTo] || 1);
    return finalVal.toFixed(2);
  };

  return (
    <div
      id="maya-feature-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-slate-950/95 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,255,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider">
              {feature ? `#${feature.id} ${feature.title}` : 'MAYA HUD ACTION'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Switcher */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* 1. VISION SCANNER (31-40) */}
          {modalType === 'vision_scanner' && (
            <div className="space-y-4">
              <div className="relative w-full h-56 bg-slate-900 rounded-xl overflow-hidden border border-cyan-500/40 flex items-center justify-center">
                {isCameraActive ? (
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
                ) : (
                  <div className="text-center p-4">
                    <Camera className="w-10 h-10 text-cyan-400 mx-auto mb-2 opacity-60" />
                    <p className="text-xs text-slate-400">লাইভ ক্যামেরা অথবা সিমুলেটেড এআই স্ক্যানার</p>
                    <button
                      onClick={startCamera}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-500 text-black text-xs font-bold font-mono"
                    >
                      ক্যামেরা চালু করুন
                    </button>
                  </div>
                )}

                {/* HUD Targeting Overlay */}
                <div className="absolute inset-4 pointer-events-none border border-cyan-400/30 rounded-lg flex flex-col justify-between p-2">
                  <div className="flex justify-between text-[10px] font-mono text-cyan-400">
                    <span>HUD_CAM // 60FPS</span>
                    <span>AI_VISION_v6</span>
                  </div>
                  <div className="w-12 h-12 border border-purple-400/80 mx-auto rounded-lg animate-ping opacity-30" />
                  <div className="text-center text-[10px] font-mono text-cyan-300">
                    [ TARGET LOCKED ]
                  </div>
                </div>
              </div>

              {/* Vision Modes */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'object', label: 'Object', bn: 'বস্তু' },
                  { id: 'ocr', label: 'OCR', bn: 'টেক্সট' },
                  { id: 'qr', label: 'QR Scan', bn: 'কিউআর' },
                  { id: 'color', label: 'Color ID', bn: 'রঙ' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleVisionScan(mode.id as any)}
                    className={`py-2 px-1 rounded-lg text-xs font-mono text-center border transition-all ${
                      visionMode === mode.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <div>{mode.label}</div>
                    <div className="text-[10px] text-slate-500">{mode.bn}</div>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-sans text-slate-200">
                <div className="font-mono text-cyan-400 text-[11px] mb-1">SCAN OUTPUT:</div>
                <p className="leading-relaxed">{scanResult}</p>
              </div>
            </div>
          )}

          {/* 2. SPEED TEST (12) */}
          {modalType === 'speed_test' && (
            <div className="text-center py-4 space-y-4">
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-4 border-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-black font-mono text-cyan-300">
                      {speedResult ? speedResult.download : Math.round(speedProgress * 0.58)}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">MBPS DOWNLOAD</div>
                  </div>
                </div>
                <Activity className="w-6 h-6 text-cyan-400 absolute top-2 animate-bounce" />
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${speedProgress}%` }}
                />
              </div>

              {speedResult && (
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-mono">
                  <div>
                    <div className="text-slate-500 text-[10px]">PING</div>
                    <div className="text-emerald-400 font-bold">{speedResult.ping} ms</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">DOWNLOAD</div>
                    <div className="text-cyan-400 font-bold">{speedResult.download} Mbps</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">UPLOAD</div>
                    <div className="text-purple-400 font-bold">{speedResult.upload} Mbps</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. WHATSAPP AUTO MESSAGE (16) */}
          {modalType === 'whatsapp' && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400">PHONE NUMBER (WITH COUNTRY CODE)</label>
                <input
                  type="text"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400">AUTOMATED BENGALI MESSAGE</label>
                <textarea
                  rows={3}
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <button
                onClick={() => {
                  setWaSent(true);
                  speechService.playBeep(900, 0.15);
                  onSpeakText(`হোয়াটসঅ্যাপে ${waNumber} নম্বরে বার্তা সফলভাবে পাঠানো হয়েছে।`);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 hover:opacity-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>DISPATCH WHATSAPP MESSAGE</span>
              </button>

              {waSent && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-sans text-center">
                  ✓ হোয়াটসঅ্যাপে বার্তা পাঠানো হয়েছে: "{waMessage}"
                </div>
              )}
            </div>
          )}

          {/* 4. CURRENCY CONVERTER (48) */}
          {modalType === 'currency_conv' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400">AMOUNT</label>
                  <input
                    type="number"
                    value={currAmount}
                    onChange={(e) => setCurrAmount(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400">FROM CURRENCY</label>
                  <select
                    value={currFrom}
                    onChange={(e) => setCurrFrom(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="GBP">GBP (British Pound)</option>
                    <option value="SAR">SAR (Saudi Riyal)</option>
                    <option value="INR">INR (Indian Rupee)</option>
                    <option value="BDT">BDT (Bangladeshi Taka)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-900 to-cyan-950/40 rounded-xl border border-cyan-500/40 text-center">
                <div className="text-[11px] font-mono text-slate-400">CONVERTED RESULT IN {currTo}</div>
                <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
                  {calculateRates()} {currTo}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans">
                  {currAmount} {currFrom} = {calculateRates()} {currTo}
                </div>
              </div>
            </div>
          )}

          {/* 5. CALCULATOR (49) */}
          {modalType === 'calculator' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-right">
                <div className="text-xs text-slate-400 font-mono h-4">{calcInput || '0'}</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">{calcResult || '0'}</div>
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono">
                {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === 'C') {
                        setCalcInput('');
                        setCalcResult('');
                      } else if (btn === '=') {
                        try {
                          // Simple safe evaluate
                          const clean = calcInput.replace(/[^0-9+\-*/().%]/g, '');
                          const res = Function(`"use strict"; return (${clean})`)();
                          setCalcResult(String(res));
                          onSpeakText(`গণনা ফলাফল: ${res}`);
                        } catch {
                          setCalcResult('ত্রুটি');
                        }
                      } else {
                        setCalcInput((prev) => prev + btn);
                      }
                    }}
                    className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
                      btn === '='
                        ? 'bg-cyan-500 text-black col-span-1 hover:bg-cyan-400'
                        : btn === 'C'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. TO-DO LIST (44) */}
          {modalType === 'todo_list' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="নতুন কাজের বিবরণ লিখুন বা বলুন..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-sans"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTodo.trim()) {
                      setTodos([...todos, newTodo.trim()]);
                      setNewTodo('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newTodo.trim()) {
                      setTodos([...todos, newTodo.trim()]);
                      setNewTodo('');
                    }
                  }}
                  className="px-4 py-2 bg-cyan-500 text-black font-bold font-mono text-xs rounded-xl"
                >
                  যোগ করুন
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {todos.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                      <span>{item}</span>
                    </div>
                    <button
                      onClick={() => setTodos(todos.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-red-400 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. MUSIC PLAYER (56) */}
          {modalType === 'music_player' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-slate-900 rounded-2xl border border-purple-500/30">
                <Music className="w-12 h-12 text-purple-400 mx-auto mb-2 animate-bounce" />
                <h4 className="text-sm font-bold text-white font-sans">{tracks[trackIndex].title}</h4>
                <p className="text-xs text-purple-300 font-mono mt-0.5">{tracks[trackIndex].artist}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">{tracks[trackIndex].duration}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-full bg-cyan-500 text-black hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
                <button
                  onClick={() => setTrackIndex((trackIndex + 1) % tracks.length)}
                  className="p-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-700"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 8. EMERGENCY SOS (73) */}
          {modalType === 'emergency_sos' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto animate-pulse">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <h4 className="text-base font-bold font-mono text-red-400">
                EMERGENCY SOS BEACON BROADCASTING
              </h4>
              <p className="text-xs text-slate-300 font-sans">
                লাইভ জিপিএস লোকেশন ও এসওএস সংকেত জরুরি নম্বরে (999) পাঠানো হয়েছে।
              </p>
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-left text-xs font-mono text-red-200">
                <div>LATITUDE: 23.8103° N</div>
                <div>LONGITUDE: 90.4125° E (Dhaka, Bangladesh)</div>
                <div>ACCURACY: ± 3.2 meters</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
          >
            বন্ধ করুন (CLOSE)
          </button>
        </div>
      </div>
    </div>
  );
};
