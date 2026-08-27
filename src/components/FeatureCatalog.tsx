import React, { useState, useMemo } from 'react';
import { FeatureCategory, FeatureItem } from '../types';
import { ALL_85_FEATURES } from '../data/featuresData';
import {
  Search,
  Sparkles,
  Play,
  Mic,
  Cpu,
  MessageSquare,
  Eye,
  FileText,
  Music,
  Shield,
  BrainCircuit,
  Sliders,
  Filter,
} from 'lucide-react';

interface FeatureCatalogProps {
  onExecuteFeature: (feature: FeatureItem) => void;
  onVoiceTrigger: (commandBn: string) => void;
}

const CATEGORY_TABS: { id: FeatureCategory | 'all'; labelEn: string; labelBn: string; icon: any }[] = [
  { id: 'all', labelEn: 'All (85)', labelBn: 'সকল ৮৫ ফিচার', icon: Sliders },
  { id: 'system', labelEn: 'System (1-15)', labelBn: 'সিস্টেম', icon: Cpu },
  { id: 'social', labelEn: 'Social (16-30)', labelBn: 'সোশ্যাল', icon: MessageSquare },
  { id: 'vision', labelEn: 'Vision (31-40)', labelBn: 'ক্যামেরা ভিশন', icon: Eye },
  { id: 'productivity', labelEn: 'Productivity (41-55)', labelBn: 'প্রোডাক্টিভিটি', icon: FileText },
  { id: 'media', labelEn: 'Media (56-65)', labelBn: 'মিডিয়া', icon: Music },
  { id: 'security', labelEn: 'Security (66-75)', labelBn: 'সিকিউরিটি', icon: Shield },
  { id: 'advanced', labelEn: 'Advanced AI (76-85)', labelBn: 'অ্যাডভান্সড এআই', icon: BrainCircuit },
];

export const FeatureCatalog: React.FC<FeatureCatalogProps> = ({
  onExecuteFeature,
  onVoiceTrigger,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFeatures = useMemo(() => {
    return ALL_85_FEATURES.filter((f) => {
      const matchCategory = selectedCategory === 'all' || f.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchText =
        f.title.toLowerCase().includes(q) ||
        f.titleBn.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.descriptionBn.toLowerCase().includes(q) ||
        f.id.toString() === q ||
        `#${f.id}` === q;

      return matchCategory && matchText;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div id="maya-feature-catalog" className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Search & Category Filter Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-bold font-mono tracking-wide text-white">
              HUD FEATURE MATRIX (85 CAPABILITIES)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            সকল ৮৫টি ফিচার সরাসরি টাচ করে অথবা বাংলায় ভয়েস কমান্ড দিয়ে সক্রিয় করুন
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features (নাম, নম্বর বা বিবরণ)..."
            className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none backdrop-blur-md transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin scrollbar-thumb-slate-700">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/30 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(0,242,255,0.15)] font-semibold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.labelEn}</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">({tab.labelBn})</span>
            </button>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredFeatures.map((feat) => (
          <div
            key={feat.id}
            id={`feature-card-${feat.id}`}
            className="group relative rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-cyan-400/40 p-4 transition-all duration-200 backdrop-blur-md flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_24px_rgba(0,242,255,0.1)]"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                    {feat.id}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400">
                    {feat.category}
                  </span>
                </div>

                <button
                  onClick={() => onVoiceTrigger(feat.sampleVoiceCommandBn)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-400 hover:text-cyan-300 border border-transparent hover:border-cyan-400/40 transition-all"
                  title={`Voice Command: "${feat.sampleVoiceCommandBn}"`}
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Bengali Translation */}
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-sans">
                {feat.title}
              </h3>
              <p className="text-xs font-medium text-cyan-400/90 font-sans mt-0.5">
                {feat.titleBn}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {feat.descriptionBn}
              </p>
            </div>

            {/* Bottom Actions & Voice Chip */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => onVoiceTrigger(feat.sampleVoiceCommandBn)}
                className="text-[11px] text-slate-500 hover:text-cyan-300 truncate max-w-[170px] text-left font-mono"
                title={`বলুন: ${feat.sampleVoiceCommandBn}`}
              >
                🎙️ "{feat.sampleVoiceCommandBn}"
              </button>

              <button
                onClick={() => onExecuteFeature(feat)}
                className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-400/30 text-xs font-mono font-bold flex items-center gap-1 transition-all group/btn shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>RUN</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800 mt-4">
          <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400 font-sans">
            "{searchQuery}" এর সাথে সম্পর্কিত কোনো ফিচার পাওয়া যায়নি।
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs text-cyan-400 underline font-mono"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}
    </div>
  );
};
