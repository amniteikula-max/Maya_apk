import { PersonaConfig } from '../types';

export class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private audioCtx: AudioContext | null = null;
  private bengaliVoice: SpeechSynthesisVoice | null = null;
  private isListening = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onStateChangeCallback: ((isListening: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
      }

      // Initialize SpeechRecognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'bn-BD'; // Default Bengali (Bangladesh)

        this.recognition.onstart = () => {
          this.isListening = true;
          this.playBeep(880, 0.1);
          if (this.onStateChangeCallback) this.onStateChangeCallback(true);
        };

        this.recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (event.results[0].isFinal) {
            if (this.onResultCallback) this.onResultCallback(transcript);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          this.isListening = false;
          if (this.onStateChangeCallback) this.onStateChangeCallback(false);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.onStateChangeCallback) this.onStateChangeCallback(false);
        };
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize Bengali voices
    const bn = voices.find(v => v.lang.startsWith('bn') || v.name.toLowerCase().includes('bengali') || v.name.toLowerCase().includes('bangla'));
    if (bn) {
      this.bengaliVoice = bn;
    } else {
      // Fallback to Indian English or primary natural voice
      this.bengaliVoice = voices.find(v => v.lang.includes('en-IN')) || voices[0] || null;
    }
  }

  public speak(text: string, persona: PersonaConfig, onEnd?: () => void) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.synth.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.bengaliVoice) {
      utterance.voice = this.bengaliVoice;
    }
    
    // Check if text is mostly Bengali or English to adjust voice lang
    const isBengali = /[\u0980-\u09FF]/.test(text);
    utterance.lang = isBengali ? 'bn-BD' : 'en-US';
    utterance.pitch = persona.voicePitch;
    utterance.rate = persona.voiceRate;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public startListening(onResult: (text: string) => void, onStateChange?: (listening: boolean) => void) {
    this.onResultCallback = onResult;
    this.onStateChangeCallback = onStateChange || null;

    if (!this.recognition) {
      console.warn('Speech Recognition not supported in this browser environment');
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Recognition start failed:', e);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    }
  }

  public playBeep(freq = 600, duration = 0.15, type: OscillatorType = 'sine') {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state !== 'closed') {
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  public playSosSiren() {
    this.playBeep(950, 0.4, 'sawtooth');
    setTimeout(() => this.playBeep(650, 0.4, 'sawtooth'), 450);
  }
}

export const speechService = new SpeechService();
