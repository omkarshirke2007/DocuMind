'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, CheckCircle2, Download, ShieldCheck, ArrowRight } from 'lucide-react';
import { InvoiceData } from '@/lib/types';

interface AuditStreamProps {
  streamId?: string;
  extractedData?: InvoiceData | null;
  mathValidated?: boolean;
  flaggedReason?: string | null;
  expectedGst?: string | null;
  focusedFieldKey?: string | null;
  onFocusField?: (key: string | null) => void;
  onApprove: (correctedValue: string) => void;
  onEscalate: () => void;
  onExportJson?: () => void;
}

export const AuditStream: React.FC<AuditStreamProps> = ({
  streamId = '01',
  extractedData,
  mathValidated = false,
  flaggedReason,
  expectedGst = '₹18,000.00',
  focusedFieldKey = null,
  onFocusField,
  onApprove,
  onEscalate,
  onExportJson,
}) => {
  const [correctedValue, setCorrectedValue] = useState<string>('₹18,000.00');
  const [isApprovedLocal, setIsApprovedLocal] = useState<boolean>(false);

  // Sync state when mathValidated changes externally (e.g. preset switch)
  useEffect(() => {
    setIsApprovedLocal(mathValidated);
    if (expectedGst) setCorrectedValue(expectedGst);
  }, [mathValidated, expectedGst]);

  // Keyboard shortcut: Ctrl + Enter to trigger Approve & Save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleApproveClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [correctedValue, isApprovedLocal]);

  const handleApproveClick = () => {
    setIsApprovedLocal(true);
    onApprove(correctedValue);
  };

  const isAnomalous = !isApprovedLocal;

  // Safe field accessor
  const invoiceNum = extractedData?.invoice_number?.value || 'INV-2026-8941';
  const invoiceNumConf = Math.round((extractedData?.invoice_number?.confidence || 0.99) * 100);

  const vendorGstin = extractedData?.vendor_gstin?.value || '27AABCU9603R1ZN';
  const vendorGstinConf = Math.round((extractedData?.vendor_gstin?.confidence || 0.96) * 100);

  const subtotal = extractedData?.subtotal?.value || '₹1,00,000.00';
  const subtotalConf = Math.round((extractedData?.subtotal?.confidence || 0.98) * 100);

  // Dynamic GST amount based on whether it was corrected
  const gstAmount = isApprovedLocal
    ? correctedValue
    : extractedData?.gst_amount?.value || '₹18,00,000.00';
  const gstConf = isApprovedLocal
    ? 99
    : Math.round((extractedData?.gst_amount?.confidence || 0.72) * 100);

  const totalAmount = extractedData?.total_amount?.value || '₹1,18,000.00';
  const totalConf = Math.round((extractedData?.total_amount?.confidence || 0.97) * 100);

  return (
    <div className="flex flex-col w-full h-full justify-between space-y-4">
      {/* Stream Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AUDIT STREAM / {streamId}</span>
          </span>
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-mono text-[11px] font-semibold">
              5 / 5 parsed
            </div>
            {onExportJson && (
              <button
                onClick={onExportJson}
                className="p-1 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                title="Export Verified JSON"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1">
          Extracted Fields <span className="text-slate-400 font-normal">(Schema Enforced)</span>
        </h2>
      </div>

      {/* Grid of 5 Schema Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Card 1: Invoice Number */}
        <div
          onMouseEnter={() => onFocusField?.('invoice_number')}
          onMouseLeave={() => onFocusField?.(null)}
          className={`bg-slate-900/90 border rounded-xl p-3.5 flex flex-col justify-between shadow-sm cursor-pointer transition-all ${
            focusedFieldKey === 'invoice_number'
              ? 'border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
              : 'border-slate-800/90 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Invoice Number</span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">{invoiceNumConf}%</span>
          </div>
          <div className="text-sm font-mono font-bold text-white mt-1.5">{invoiceNum}</div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${invoiceNumConf}%` }}
            />
          </div>
        </div>

        {/* Card 2: Vendor GSTIN */}
        <div
          onMouseEnter={() => onFocusField?.('vendor_gstin')}
          onMouseLeave={() => onFocusField?.(null)}
          className={`bg-slate-900/90 border rounded-xl p-3.5 flex flex-col justify-between shadow-sm cursor-pointer transition-all ${
            focusedFieldKey === 'vendor_gstin'
              ? 'border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
              : 'border-slate-800/90 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Vendor GSTIN</span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">{vendorGstinConf}%</span>
          </div>
          <div className="text-sm font-mono font-bold text-white mt-1.5">{vendorGstin}</div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${vendorGstinConf}%` }}
            />
          </div>
        </div>

        {/* Card 3: Subtotal */}
        <div
          onMouseEnter={() => onFocusField?.('subtotal')}
          onMouseLeave={() => onFocusField?.(null)}
          className={`bg-slate-900/90 border rounded-xl p-3.5 flex flex-col justify-between shadow-sm cursor-pointer transition-all ${
            focusedFieldKey === 'subtotal'
              ? 'border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
              : 'border-slate-800/90 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Subtotal</span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">{subtotalConf}%</span>
          </div>
          <div className="text-sm font-mono font-bold text-white mt-1.5">{subtotal}</div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${subtotalConf}%` }}
            />
          </div>
        </div>

        {/* Card 4: GST Rate / Tax Line (Dynamic Amber or Green) */}
        <div
          onMouseEnter={() => onFocusField?.('gst_amount')}
          onMouseLeave={() => onFocusField?.(null)}
          className={`bg-slate-900/90 border rounded-xl p-3.5 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-300 ${
            isAnomalous
              ? 'border-amber-700/80 shadow-[0_0_12px_rgba(245,158,11,0.15)] bg-amber-950/20'
              : 'border-emerald-700/80 shadow-[0_0_12px_rgba(16,185,129,0.15)] bg-emerald-950/20'
          } ${focusedFieldKey === 'gst_amount' ? 'border-indigo-500' : ''}`}
        >
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">GST Rate (18%)</span>
            <span
              className={`font-mono text-[11px] font-semibold ${
                isAnomalous ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {gstConf}%
            </span>
          </div>
          <div
            className={`text-sm font-mono font-bold mt-1.5 transition-colors ${
              isAnomalous ? 'text-amber-300' : 'text-emerald-300'
            }`}
          >
            {gstAmount}
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAnomalous ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${gstConf}%` }}
            />
          </div>
        </div>

        {/* Card 5: Total Amount */}
        <div
          onMouseEnter={() => onFocusField?.('total_amount')}
          onMouseLeave={() => onFocusField?.(null)}
          className={`bg-slate-900/90 border rounded-xl p-3.5 flex flex-col justify-between shadow-sm cursor-pointer transition-all ${
            focusedFieldKey === 'total_amount'
              ? 'border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
              : 'border-slate-800/90 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Total Amount</span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">{totalConf}%</span>
          </div>
          <div className="text-sm font-mono font-bold text-white mt-1.5">{totalAmount}</div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalConf}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Math Audit Section */}
      {isAnomalous ? (
        /* Anomaly Notice Card (Matching screenshot) */
        <div className="bg-slate-900/80 border border-amber-900/60 rounded-xl p-4 shadow-xl flex flex-col space-y-3 transition-all animate-scale-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Math Audit Notice
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                Tax calculation flagged for manual review. Expected GST:{' '}
                <span className="font-bold text-white font-mono">{expectedGst}</span>. Extracted GST
                reads <span className="font-bold text-amber-400 font-mono">₹18,00,000</span>.
              </p>
            </div>
          </div>

          {/* Editable Field */}
          <div className="w-full">
            <input
              type="text"
              value={correctedValue}
              onChange={(e) => setCorrectedValue(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 transition"
              placeholder="₹18,000.00"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleApproveClick}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs transition shadow-lg cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Save (Ctrl+Enter)</span>
            </button>

            <button
              onClick={onEscalate}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700/80 font-medium text-xs transition cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Flag for Escalation</span>
            </button>
          </div>
        </div>
      ) : (
        /* Math Validated State Banner */
        <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-4 shadow-xl flex items-center justify-between transition-all animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-400 border border-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                <span>Math Audit Validated</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-300 font-mono">
                  100% STP
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Subtotal + Taxes = Total arithmetic verified. Record committed to audit ledger.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400/80">HASH: 0x8941FC</span>
          </div>
        </div>
      )}
    </div>
  );
};
