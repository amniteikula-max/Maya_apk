import React, { useEffect, useRef } from 'react';
import { PersonaConfig } from '../types';

interface GlowCoreProps {
  isListening: boolean;
  isSpeaking: boolean;
  persona: PersonaConfig;
  onCoreClick?: () => void;
}

export const GlowCore: React.FC<GlowCoreProps> = ({
  isListening,
  isSpeaking,
  persona,
  onCoreClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let pulseScale = 1;
    let pulseDirection = 1;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Pulse rate depends on state
      const pulseSpeed = isListening ? 0.04 : isSpeaking ? 0.03 : 0.012;
      pulseScale += pulseSpeed * pulseDirection;
      if (pulseScale > 1.18) pulseDirection = -1;
      if (pulseScale < 0.88) pulseDirection = 1;

      angle += isListening ? 0.03 : 0.01;

      // 1. Ambient Outer Halo
      const outerRadius = 85 * pulseScale;
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        15,
        centerX,
        centerY,
        outerRadius + 30
      );
      gradient.addColorStop(0, `${persona.primaryColor}88`);
      gradient.addColorStop(0.5, `${persona.secondaryColor}44`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + 30, 0, Math.PI * 2);
      ctx.fill();

      // 2. Rotating Segmented HUD Rings
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.strokeStyle = `${persona.primaryColor}cc`;
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 18, 6, 24]);
      ctx.beginPath();
      ctx.arc(0, 0, 72 * pulseScale, 0, Math.PI * 2);
      ctx.stroke();

      // Counter-rotating Inner Ring
      ctx.rotate(-angle * 2.2);
      ctx.strokeStyle = `${persona.secondaryColor}aa`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, 56 * pulseScale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3. Central Glowing Sphere
      const coreGradient = ctx.createRadialGradient(
        centerX - 8,
        centerY - 8,
        2,
        centerX,
        centerY,
        38 * pulseScale
      );
      coreGradient.addColorStop(0, '#ffffff');
      coreGradient.addColorStop(0.3, persona.primaryColor);
      coreGradient.addColorStop(0.8, persona.secondaryColor);
      coreGradient.addColorStop(1, '#030712');

      ctx.fillStyle = coreGradient;
      ctx.shadowColor = persona.primaryColor;
      ctx.shadowBlur = isListening ? 25 : 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38 * pulseScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. Center AI Iris / Eye Symbol
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, isListening ? 10 : 7, 0, Math.PI * 2);
      ctx.fill();

      // 5. Orbital Particles
      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const particleAngle = angle * (i % 2 === 0 ? 1.5 : -1.2) + (i * (Math.PI * 2)) / particleCount;
        const dist = (65 + Math.sin(angle * 3 + i) * 12) * pulseScale;
        const px = centerX + Math.cos(particleAngle) * dist;
        const py = centerY + Math.sin(particleAngle) * dist;

        ctx.fillStyle = i % 2 === 0 ? persona.primaryColor : '#ffffff';
        ctx.shadowColor = persona.primaryColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, isSpeaking, persona]);

  return (
    <div
      id="maya-pulse-core"
      className="relative flex flex-col items-center justify-center cursor-pointer select-none group"
      onClick={onCoreClick}
      title="Click to interact with Maya Core"
    >
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Backdrop pulse effect */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
            isListening
              ? 'opacity-80 scale-110 bg-[#00F2FF]/30'
              : isSpeaking
              ? 'opacity-70 scale-105 bg-[#8B5CF6]/30'
              : 'opacity-40 scale-95 bg-[#00F2FF]/15'
          }`}
        />

        {/* Canvas Visualizer */}
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          className="relative z-10 w-64 h-64 transition-transform duration-300 group-hover:scale-105"
        />

        {/* HUD Ring Label Ticks */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border border-cyan-400/20 border-dashed animate-[spin_30s_linear_infinite]" />
        </div>
      </div>

      <div className="mt-1 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-cyan-400/30 backdrop-blur-md">
        <span
          className={`w-2 h-2 rounded-full ${
            isListening ? 'bg-cyan-400 animate-ping' : isSpeaking ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'
          }`}
        />
        <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase">
          {isListening ? 'LISTENING (শুনছি)' : isSpeaking ? 'SPEAKING (বলছি)' : 'CORE ACTIVE'}
        </span>
      </div>
    </div>
  );
};
