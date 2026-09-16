'use client';

import React from 'react';
import {
  CheckCircle2,
  Loader2,
  XCircle,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface ScanStep {
  id: number;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'completed';
}

interface ScanningProgressProps {
  filename: string;
  activeStep: number; // 1 to 5
  progressPercent: number; // 0 to 100
  onCancelScan: () => void;
}

export const ScanningProgress: React.FC<ScanningProgressProps> = ({
  filename,
  activeStep,
  progressPercent,
  onCancelScan,
}) => {
  const steps: ScanStep[] = [
    {
      id: 1,
      label: 'Queued',
      description: 'Allocating local host memory buffer & verifying integrity',
      status: activeStep > 1 ? 'completed' : activeStep === 1 ? 'running' : 'pending',
    },
    {
      id: 2,
      label: 'Parsing Layout',
      description: 'PyMuPDF 2D spatial coordinate & bounding-box rasterization',
      status: activeStep > 2 ? 'completed' : activeStep === 2 ? 'running' : 'pending',
    },
    {
      id: 3,
      label: 'Running Inference',
      description: '4-bit quantized Llama-3.2-3B local SLM spatial extraction',
      status: activeStep > 3 ? 'completed' : activeStep === 3 ? 'running' : 'pending',
    },
    {
      id: 4,
      label: 'Validating Math',
      description: 'Deterministic cross-field STP verification (subtotal + GST = total)',
      status: activeStep > 4 ? 'completed' : activeStep === 4 ? 'running' : 'pending',
    },
    {
      id: 5,
      label: 'Audit Completed',
      description: 'DPDP compliant local audit ledger generation with zero egress',
      status: activeStep >= 5 ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 py-8 animate-fade-in">
      {/* Header Info */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs">
        <div className="flex items-center gap-2 text-indigo-300 font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Inference Pipeline In Flight • Document: {filename}
          </span>
        </div>
        <span className="text-[11px] text-indigo-400 font-mono font-bold">
          {progressPercent}%
        </span>
      </div>

      {/* Main Progress Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />

        {/* Top Title & Cancel Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Extracting Document Intelligence</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                100% LOCAL SLM
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Running layout-aware spatial reasoning on host hardware
            </p>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancelScan}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/50 text-rose-300 hover:text-rose-100 text-xs font-mono transition cursor-pointer shrink-0"
            title="Abort active scan"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Cancel Scan</span>
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Nodes List */}
        <div className="flex flex-col gap-3.5 pt-2">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isRunning
                    ? 'bg-indigo-950/30 border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                    : isCompleted
                    ? 'bg-slate-900/40 border-emerald-500/30 opacity-90'
                    : 'bg-slate-950/40 border-slate-900 opacity-40'
                }`}
              >
                {/* Node Status Icon */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  ) : isRunning ? (
                    <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500 flex items-center justify-center text-indigo-400 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500">
                      {step.id}
                    </div>
                  )}
                </div>

                {/* Step Text Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold tracking-tight ${
                        isRunning
                          ? 'text-indigo-300'
                          : isCompleted
                          ? 'text-emerald-300'
                          : 'text-slate-400'
                      }`}
                    >
                      Step {step.id}: {step.label}
                    </span>
                    {isRunning && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-900/80 text-indigo-300 border border-indigo-700 font-mono animate-pulse">
                        PROCESSING
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>DPDP Act 2023 Compliant • Memory sandbox</span>
          </div>
          <span>SLM Engine: Llama-3.2-3B (Q4_K_M)</span>
        </div>
      </div>
    </div>
  );
};
