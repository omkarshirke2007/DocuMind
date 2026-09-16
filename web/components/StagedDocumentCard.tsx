'use client';

import React from 'react';
import {
  FileText,
  Play,
  X,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DocumentPreset } from '@/lib/presets';

interface StagedDocumentCardProps {
  stagedFile: File | null;
  stagedPreset: DocumentPreset | null;
  activeSchema: string;
  isProcessing: boolean;
  onStartScan: () => void;
  onRemove: () => void;
}

export const StagedDocumentCard: React.FC<StagedDocumentCardProps> = ({
  stagedFile,
  stagedPreset,
  activeSchema,
  isProcessing,
  onStartScan,
  onRemove,
}) => {
  const filename = stagedFile?.name || stagedPreset?.filename || 'document.pdf';
  const fileSizeStr = stagedFile
    ? `${(stagedFile.size / 1024).toFixed(1)} KB`
    : stagedPreset
    ? '142.5 KB (Benchmark Sample)'
    : 'Local File';

  const extension = filename.split('.').pop()?.toUpperCase() || 'PDF';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-6 animate-fade-in">
      {/* Top Banner Notice */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-mono">
          <Layers className="w-4 h-4" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Stage 1 of 2: Document Staged &amp; Verified
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Review details below prior to local SLM execution
        </span>
      </div>

      {/* Main Document Inspection Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header: File Meta & Remove Action */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)] shrink-0">
              <FileText className="w-7 h-7" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base md:text-lg font-bold text-white tracking-tight break-all">
                  {filename}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-[10px] font-mono font-semibold">
                  {extension}
                </span>
                {stagedPreset && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-700/60 text-purple-300 text-[10px] font-mono">
                    DEMO PRESET
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span>Size: <strong className="text-slate-200">{fileSizeStr}</strong></span>
                <span>•</span>
                <span>Security: <strong className="text-emerald-400">Local Sandbox</strong></span>
              </div>
            </div>
          </div>

          {/* Remove / Change Document Button */}
          <button
            onClick={onRemove}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 text-xs font-mono transition cursor-pointer shrink-0"
            title="Remove document and return to dropzone"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>

        {/* Extraction Target & Schema Specification (Pre-configured for Phase 2) */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-slate-200">Extraction Target Schema</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              Deterministic Math Validator: Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-slate-200 font-semibold">{activeSchema}</span>
            </div>
            <span className="text-slate-400 text-[11px]">
              8 Core Fields • Bounding Box Mapping • STP Cross-Validation
            </span>
          </div>
        </div>

        {/* Bottom Bar: Action Trigger & Local Guarantee */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-900">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero cloud transfer. Processing executed exclusively on host GPU/CPU.</span>
          </div>

          {/* Primary Call-to-Action: START SCAN */}
          <button
            onClick={onStartScan}
            disabled={isProcessing}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(99,102,241,0.45)] hover:shadow-[0_0_35px_rgba(99,102,241,0.65)] transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Start Local SLM Scan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
