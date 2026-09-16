'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Sparkles, FileSpreadsheet } from 'lucide-react';

interface PresetBarProps {
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  isProcessing: boolean;
}

export const PresetBar: React.FC<PresetBarProps> = ({
  activePresetId,
  onSelectPreset,
  isProcessing,
}) => {
  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 text-slate-300 font-medium pl-1">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        <span className="text-slate-400 font-mono uppercase text-[11px] tracking-wider">Demo Presets:</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Preset 1: ACME Corrupted Anomaly */}
        <button
          onClick={() => onSelectPreset('preset-acme-corrupted')}
          disabled={isProcessing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activePresetId === 'preset-acme-corrupted'
              ? 'bg-amber-950/80 border border-amber-600/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo 1: GST Anomaly (ACME)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 border border-amber-800 font-mono">
            Flagged
          </span>
        </button>

        {/* Preset 2: TechFlow Clean 100% STP */}
        <button
          onClick={() => onSelectPreset('preset-techflow-clean')}
          disabled={isProcessing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activePresetId === 'preset-techflow-clean'
              ? 'bg-emerald-950/80 border border-emerald-600/80 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Demo 2: Clean 100% STP (TechFlow)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-800 font-mono">
            Passed
          </span>
        </button>

        {/* Preset 3: Apollo Medical Insurance Claim */}
        <button
          onClick={() => onSelectPreset('preset-apollo-medical')}
          disabled={isProcessing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activePresetId === 'preset-apollo-medical'
              ? 'bg-indigo-950/80 border border-indigo-600/80 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
          <span>Demo 3: Healthcare Claim (Apollo)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-800 font-mono">
            Medical
          </span>
        </button>
      </div>
    </div>
  );
};
