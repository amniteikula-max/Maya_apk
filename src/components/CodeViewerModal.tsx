import React, { useState } from 'react';
import { ANDROID_FILES } from '../data/androidFiles';
import { AndroidCodeFile } from '../types';
import {
  X,
  Code,
  Copy,
  Check,
  Download,
  FileCode,
  FolderTree,
  Search,
  Sparkles,
} from 'lucide-react';

interface CodeViewerModalProps {
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<AndroidCodeFile>(ANDROID_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  const filteredFiles = ANDROID_FILES.filter(
    (f) =>
      f.filename.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      id="maya-code-hub-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-950/95 border border-purple-500/40 rounded-2xl shadow-[0_0_60px_rgba(139,92,246,0.2)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-mono text-purple-300 tracking-wider">
                MAYA ULTRA KOTLIN & COMPOSE SOURCE ARCHITECTURE
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                সম্পূর্ণ মডুলার ১৩টি অ্যান্ড্রয়েড ফাইল (Accessibility, Overlays, Gemini Encrypted Key & 85 Features)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Layout: Sidebar Files + Code Editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-800/80">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                MODULAR KOTLIN FILES ({ANDROID_FILES.length})
              </div>
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.filename === file.filename;
                return (
                  <button
                    key={file.filename}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-purple-950/70 text-purple-200 border border-purple-500/40 shadow-sm font-semibold'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-400' : 'text-slate-600'}`} />
                      <span className="truncate">{file.filename}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                      {file.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* File Info Bar */}
            <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="truncate">
                <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                  <span>{selectedFile.filename}</span>
                  <span className="text-[10px] text-slate-500 font-sans hidden sm:inline">
                    ({selectedFile.path})
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {selectedFile.description}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 text-purple-300 border border-purple-500/40"
                  title="Download Raw File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Text Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-[#030712] selection:bg-purple-900 selection:text-white">
              <pre className="whitespace-pre">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
