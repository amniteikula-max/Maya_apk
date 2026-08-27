export type PersonaId = 'maya' | 'friday' | 'venom';

export interface PersonaConfig {
  id: PersonaId;
  name: string;
  nameBn: string;
  title: string;
  avatarGlow: string;
  primaryColor: string;
  secondaryColor: string;
  voicePitch: number;
  voiceRate: number;
  systemPrompt: string;
  greetingBn: string;
  description: string;
}

export type FeatureCategory = 
  | 'system'
  | 'social'
  | 'vision'
  | 'productivity'
  | 'media'
  | 'security'
  | 'advanced';

export interface FeatureItem {
  id: number;
  title: string;
  titleBn: string;
  category: FeatureCategory;
  categoryNameBn: string;
  iconName: string;
  description: string;
  descriptionBn: string;
  sampleVoiceCommand: string;
  sampleVoiceCommandBn: string;
  actionType: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'maya' | 'system';
  text: string;
  timestamp: string;
  category?: FeatureCategory;
  featureTriggered?: number;
  metadata?: Record<string, any>;
}

export interface AndroidCodeFile {
  filename: string;
  path: string;
  description: string;
  category: 'core' | 'service' | 'controller' | 'config';
  code: string;
}

export interface SystemStatus {
  brightness: number;
  volume: number;
  wifi: boolean;
  bluetooth: boolean;
  flashlight: boolean;
  dnd: boolean;
  hotspot: boolean;
  batterySaver: boolean;
  ramUsagePercent: number;
  cacheSizeMb: number;
  autoRotate: boolean;
  screenTimeoutSec: number;
  batteryLevel: number;
}

export interface MemoryEntry {
  id: string;
  timestamp: string;
  key: string;
  value: string;
  mood: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}
