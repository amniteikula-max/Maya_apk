import React from 'react';

interface VoiceWaveProps {
  isListening: boolean;
  isSpeaking: boolean;
  color?: string;
}

export const VoiceWave: React.FC<VoiceWaveProps> = ({
  isListening,
  isSpeaking,
  color = '#00F2FF',
}) => {
  const barCount = 28;

  return (
    <div id="maya-voice-wave" className="w-full max-w-md h-10 flex items-center justify-center gap-1 px-4">
      {Array.from({ length: barCount }).map((_, index) => {
        const centerDist = Math.abs(index - barCount / 2) / (barCount / 2);
        const baseHeight = (1 - centerDist * 0.6) * 100;
        const animationDelay = `${(index * 0.05).toFixed(2)}s`;
        const active = isListening || isSpeaking;

        return (
          <div
            key={index}
            style={{
              backgroundColor: active ? color : '#334155',
              height: active ? `${Math.max(15, baseHeight * (0.4 + (index % 3) * 0.25))}%` : '4px',
              animationDelay,
              boxShadow: active ? `0 0 8px ${color}88` : 'none',
            }}
            className={`w-1 rounded-full transition-all duration-150 ${
              active ? 'animate-pulse' : ''
            }`}
          />
        );
      })}
    </div>
  );
};
