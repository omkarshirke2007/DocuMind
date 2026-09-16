'use client';

import React, { useState } from 'react';
import { Shield, ChevronDown, UploadCloud, Terminal, TrendingDown, Check, User, LogOut, AlertTriangle, Zap } from 'lucide-react';

interface TelemetryHeaderProps {
  inferenceLatencyMs?: number;
  vramGb?: string;
  f1Score?: string;
  activeSchema?: string;
  source?: string;
  userEmail?: string | null;
  onSelectSchema?: (schema: string) => void;
  onUploadClick: () => void;
  onOpenTokens: () => void;
  onOpenRoi: () => void;
  onSignOut?: () => void;
  isUploading?: boolean;
}

export const TelemetryHeader: React.FC<TelemetryHeaderProps> = ({
  inferenceLatencyMs = 1420,
  vramGb = '2.1 GB',
  f1Score = '89%',
  activeSchema = 'GST Tax Invoice',
  source = 'mock_fallback',
  userEmail = 'auditor@documind.local',
  onSelectSchema,
  onUploadClick,
  onOpenTokens,
  onOpenRoi,
  onSignOut,
  isUploading = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const schemas = [
    'GST Tax Invoice',
    'Medical Insurance Claim',
    'Form 16 Tax Statement',
  ];

  const isMock = source === 'mock_fallback' || source === 'standalone_slm_engine';

  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-5 py-2.5 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Mode */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-tight">DocuMind SLM</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
              Edge 2.0
            </span>
          </div>
          <span className="text-[9px] font-semibold text-emerald-400 tracking-wider font-mono">
            100% LOCAL • ZERO CLOUD REQUESTS
          </span>
        </div>
      </div>

      {/* Active Schema Selector Dropdown */}
      <div className="relative hidden lg:block">
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer text-xs text-slate-300 select-none"
        >
          <span className="text-slate-400">Active schema:</span>
          <span className="font-semibold text-slate-100">{activeSchema}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs">
            {schemas.map((s) => (
              <div
                key={s}
                onClick={() => {
                  onSelectSchema?.(s);
                  setDropdownOpen(false);
                }}
                className={`px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition cursor-pointer ${
                  s === activeSchema ? 'text-indigo-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                }`}
              >
                <span>{s}</span>
                {s === activeSchema && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Source Indicator Badge */}
      <div className="hidden md:flex items-center">
        {isMock ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-600/80 text-amber-300 text-[10px] font-mono shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />
            <span className="font-semibold">MOCK / SIMULATION MODE</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-600/80 text-emerald-300 text-[10px] font-mono shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold">LOCAL SLM WEIGHTS</span>
          </div>
        )}
      </div>

      {/* Telemetry Pills & Quick Tool Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Inspect Tokens Trigger */}
        <button
          onClick={onOpenTokens}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-white transition cursor-pointer"
          title="Inspect Raw SLM Spatial Tokens"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden xl:inline">SLM Tokens</span>
        </button>

        {/* ROI Calculator Trigger */}
        <button
          onClick={onOpenRoi}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-[11px] text-slate-300 hover:text-white transition cursor-pointer"
          title="Calculate Cost Savings vs OpenAI"
        >
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline">ROI</span>
        </button>

        {/* Latency Metric */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
          <span className="text-slate-200">{(inferenceLatencyMs / 1000).toFixed(2)}s</span>
          <span className="text-slate-400">inference</span>
        </div>

        {/* VRAM Metric */}
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
          <span className="text-cyan-400 font-semibold">{vramGb}</span>
          <span className="text-slate-400">VRAM</span>
        </div>

        {/* F1 Metric */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
          <span className="text-emerald-400 font-semibold">{f1Score}</span>
          <span className="text-slate-400">F1</span>
        </div>

        {/* Upload Button */}
        <button
          onClick={onUploadClick}
          disabled={isUploading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(99,102,241,0.35)] transition cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">{isUploading ? 'Uploading...' : 'Upload PDF'}</span>
        </button>

        {/* Auditor Profile & Sign Out */}
        <div className="flex items-center gap-1.5 pl-1">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
            title={`Authenticated Auditor: ${userEmail}`}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="max-w-[90px] truncate hidden md:inline font-mono">{userEmail?.split('@')[0]}</span>
          </div>

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
