'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2 } from 'lucide-react';

interface RawTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawPrompt: string;
}

export const RawTokenModal: React.FC<RawTokenModalProps> = ({ isOpen, onClose, rawPrompt }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-in">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Raw SLM 2D Spatial Token Stream
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-800 font-mono">
                  Llama-3.2-3B GGUF
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Direct spatial prompt injected with [ymin, xmin, ymax, xmax] coordinate tokens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-auto bg-slate-950 font-mono text-xs text-slate-300 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 relative group">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-[11px] transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Tokens'}</span>
            </button>
            <pre className="whitespace-pre-wrap leading-relaxed text-[11px] text-emerald-300">
              {rawPrompt}
            </pre>
          </div>

          {/* Grammar Constraint Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-[11px] text-indigo-200">
            <Code2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Schema-Constrained Grammar:</span>
              <p className="text-slate-300 mt-0.5">
                Token probabilities are masked at generation time via Pydantic v2 grammars, mathematically guaranteeing 0% JSON syntax failures.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
