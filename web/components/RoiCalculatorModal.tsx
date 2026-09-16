'use client';

import React, { useState } from 'react';
import { X, TrendingDown, ShieldCheck, DollarSign, Zap } from 'lucide-react';

interface RoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [monthlyDocs, setMonthlyDocs] = useState<number>(50000);

  if (!isOpen) return null;

  const cloudCostPerDoc = 4.50; // Cloud API rate (GPT-4o Vision)
  const slmCostPerDoc = 0.25;   // DocuMind SLM local amortized compute

  const totalCloudCost = monthlyDocs * cloudCostPerDoc;
  const totalSlmCost = monthlyDocs * slmCostPerDoc;
  const netSavings = totalCloudCost - totalSlmCost;
  const percentSavings = ((netSavings / totalCloudCost) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-in">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Unit Economics & DPDP ROI Calculator
              </h2>
              <p className="text-[11px] text-slate-400">
                On-Premise SLM vs Cloud LLM API Cost Analysis (INR)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 bg-slate-950 text-slate-200">
          {/* Interactive Volume Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Monthly Document Processing Volume:</span>
              <span className="font-bold text-indigo-400 font-mono text-sm">
                {monthlyDocs.toLocaleString('en-IN')} pages / month
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={250000}
              step={5000}
              value={monthlyDocs}
              onChange={(e) => setMonthlyDocs(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5,000 / mo</span>
              <span>100,000 / mo</span>
              <span>250,000 / mo</span>
            </div>
          </div>

          {/* Metrics Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Cloud LLM Card */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400">Cloud LLM API (₹4.50/p)</span>
              <div className="text-base font-bold text-rose-400 font-mono mt-1">
                ₹{totalCloudCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[10px] text-rose-500/80 mt-1">External Egress & Risk</span>
            </div>

            {/* DocuMind SLM Card */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400">DocuMind SLM (₹0.25/p)</span>
              <div className="text-base font-bold text-emerald-400 font-mono mt-1">
                ₹{totalSlmCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[10px] text-emerald-400/80 mt-1">Zero Cloud Token Cost</span>
            </div>

            {/* Net Savings Card */}
            <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-700/80 flex flex-col justify-between shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <span className="text-[11px] text-indigo-200 font-semibold">Net Savings ({percentSavings}%)</span>
              <div className="text-lg font-black text-white font-mono mt-1">
                ₹{netSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[10px] text-indigo-300 font-medium mt-1">Saved every month</span>
            </div>
          </div>

          {/* DPDP Act 2023 Compliance Checklist */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>DPDP Act 2023 Sovereignty Guarantees</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> 100% On-Premise Execution: Zero external bytes transmitted across borders.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Air-gapped Deployment: Operates without internet or external third-party API keys.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Immutable Audit Trail: Every field extraction has a verifiable HITL ledger hash.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
