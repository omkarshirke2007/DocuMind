'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  ArrowRight,
  HardDrive,
  Cpu,
} from 'lucide-react';
import { DOCUMENT_PRESETS } from '@/lib/presets';

interface UploadDropzoneProps {
  onSelectFile: (file: File) => void;
  onSelectPreset: (presetId: string) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onSelectFile,
  onSelectPreset,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onSelectFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onSelectFile(file);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 py-6 animate-fade-in">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/png,image/jpeg,image/tiff,image/webp,.docx"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full rounded-2xl border-2 border-dashed p-10 md:p-14 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-950/30 shadow-[0_0_35px_rgba(99,102,241,0.25)] scale-[1.008]'
            : 'border-slate-800 hover:border-indigo-500/70 bg-slate-950/60 hover:bg-slate-900/50 shadow-xl'
        }`}
      >
        {/* Glowing Radar Icon Ring */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-950 to-purple-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
            <UploadCloud className="w-8 h-8 text-indigo-400 animate-bounce" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
        </div>

        {/* Text Instructions */}
        <div className="flex flex-col items-center max-w-lg">
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Drop your document here, or <span className="text-indigo-400 underline decoration-indigo-500/50 underline-offset-4 hover:text-indigo-300">Browse files</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Local 2D spatial layout analysis &amp; 4-bit quantized SLM inference. Files remain in memory and never leave your workstation.
          </p>
        </div>

        {/* Formats & Limit Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {['PDF', 'PNG', 'JPG', 'DOCX', 'TIFF'].map((ext) => (
            <span
              key={ext}
              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
            >
              {ext}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/60 text-[11px] font-mono text-indigo-300">
            Up to 25 MB
          </span>
        </div>

        {/* Local Security Assurance Pill */}
        <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>100% On-Premise Inference • DPDP Act 2023 Compliant • Zero Cloud Egress</span>
        </div>
      </div>

      {/* Demoted Benchmark Samples for Evaluators */}
      <div className="w-full flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono uppercase tracking-wider text-[11px] text-slate-400 font-semibold">
              Try a sample document (Demo Evaluator Mode)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Pre-configured benchmark documents with annotated ground truths
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Sample 1: ACME Corrupted Invoice */}
          <div
            onClick={() => onSelectPreset('preset-acme-corrupted')}
            className="group p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/60 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between gap-3 shadow-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-600/40 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition">
                    GST Tax Anomaly
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {DOCUMENT_PRESETS['preset-acme-corrupted'].filename}
                  </span>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-mono">
                FLAGGED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
              ACME Industries invoice with intentional tax discrepancy to benchmark deterministic math cross-validation.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
              <span>GST Tax Invoice</span>
              <div className="flex items-center gap-1 text-amber-400">
                <span>Stage Sample</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Sample 2: TechFlow Clean Invoice */}
          <div
            onClick={() => onSelectPreset('preset-techflow-clean')}
            className="group p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/60 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between gap-3 shadow-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-600/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition">
                    Clean 100% STP
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {DOCUMENT_PRESETS['preset-techflow-clean'].filename}
                  </span>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-mono">
                PASSED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
              TechFlow Solutions invoice with mathematically sound GST subtotal + CGST/SGST lines for instant straight-through processing.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
              <span>GST Tax Invoice</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <span>Stage Sample</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Sample 3: Apollo Medical Insurance Claim */}
          <div
            onClick={() => onSelectPreset('preset-apollo-medical')}
            className="group p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/60 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between gap-3 shadow-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-600/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition">
                    Healthcare Claim
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {DOCUMENT_PRESETS['preset-apollo-medical'].filename}
                  </span>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800 font-mono">
                MEDICAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
              Apollo Hospitals healthcare reimbursement claim illustrating tabular line-item parsing across complex clinical grids.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
              <span>Medical Insurance</span>
              <div className="flex items-center gap-1 text-indigo-400">
                <span>Stage Sample</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
