'use client';

import React, { useState } from 'react';
import { FileText, CheckSquare, Square, Eye } from 'lucide-react';
import { InvoiceData } from '@/lib/types';

interface DocumentMetadata {
  vendorName: string;
  vendorAddress: string;
  invoiceTitle: string;
  invoiceNo: string;
  invoiceDate: string;
  billToName: string;
  billToAddress: string;
  billToGstin: string;
  lineItems: Array<{ description: string; qty: string; amount: string }>;
  subtotal: string;
  taxLine: string;
  taxAmount: string;
  totalAmount: string;
  corruptedFieldKey?: string;
}

interface PDFViewerOverlayProps {
  filename?: string;
  pageCount?: number;
  extractedData?: InvoiceData | null;
  documentMeta?: DocumentMetadata;
  mathValidated?: boolean;
  focusedFieldKey?: string | null;
  onHoverField?: (key: string | null) => void;
  fileUrl?: string | null;
}

export const PDFViewerOverlay: React.FC<PDFViewerOverlayProps> = ({
  filename = 'invoice_8941.pdf',
  pageCount = 1,
  extractedData,
  documentMeta,
  mathValidated = false,
  focusedFieldKey = null,
  onHoverField,
  fileUrl = null,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(150, prev + 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(70, prev - 10));

  // Default to ACME benchmark invoice if meta is not provided
  const meta: DocumentMetadata = documentMeta || {
    vendorName: 'ACME INDUSTRIES',
    vendorAddress: 'Industrial Supplies & Components\nMumbai, Maharashtra - India',
    invoiceTitle: 'TAX INVOICE\nOriginal for Recipient',
    invoiceNo: 'INV-2026-8941',
    invoiceDate: '16 Sep 2026',
    billToName: 'Universal Business Corp.',
    billToAddress: 'Bengaluru, Karnataka',
    billToGstin: '27AABCU9603R1ZN',
    lineItems: [
      { description: 'Precision Assembly Kit', qty: '10', amount: '₹1,00,000.00' },
      { description: 'Handling & Logistics', qty: '1', amount: 'Included' },
    ],
    subtotal: '₹1,00,000.00',
    taxLine: 'CGST + SGST (18%)',
    taxAmount: '₹18,00,000.00',
    totalAmount: '₹1,18,000.00',
    corruptedFieldKey: 'gst_amount',
  };

  const isCorrupted = !mathValidated;

  return (
    <div className="flex flex-col w-full h-full bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden relative shadow-xl">
      {/* Document Inspector Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-200">{filename}</span>
          <span className="text-slate-500 font-normal">{pageCount} page</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 font-mono text-[10px] font-semibold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LOCAL_RENDER</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950/90 relative">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 ease-out"
        >
          {/* Document Sheet */}
          <div className="relative w-[500px] h-[660px] bg-white rounded shadow-2xl p-7 text-slate-900 select-none overflow-hidden text-left border border-slate-300">
            {/* If user uploaded real PDF, embed preview; else render high-fidelity document sheet */}
            {fileUrl ? (
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-0 absolute inset-0 pointer-events-none"
                title="Document Preview"
              />
            ) : (
              <div className="w-full h-full flex flex-col justify-between text-[11px] leading-tight">
                <div>
                  {/* Top Header */}
                  <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                    <div
                      className="relative p-0.5 cursor-pointer"
                      onMouseEnter={() => {
                        setActiveTooltip('Vendor Name (98% Conf)');
                        onHoverField?.('vendor_name');
                      }}
                      onMouseLeave={() => {
                        setActiveTooltip(null);
                        onHoverField?.(null);
                      }}
                    >
                      <h1 className="text-base font-black tracking-tight text-slate-950 uppercase">
                        {meta.vendorName}
                      </h1>
                      <p className="text-[9px] text-slate-500 font-medium whitespace-pre-line mt-0.5">
                        {meta.vendorAddress}
                      </p>
                      {showBoxes && focusedFieldKey === 'vendor_name' && (
                        <div className="absolute -inset-1 border-2 border-indigo-500 bg-indigo-500/15 rounded pointer-events-none shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-900 block whitespace-pre-line">
                        {meta.invoiceTitle}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-4 mt-4 text-[10px]">
                    <div className="space-y-2.5">
                      {/* Invoice No. Bounding Box */}
                      <div
                        className="relative p-0.5 cursor-pointer"
                        onMouseEnter={() => {
                          setActiveTooltip('Invoice No: 99% Conf');
                          onHoverField?.('invoice_number');
                        }}
                        onMouseLeave={() => {
                          setActiveTooltip(null);
                          onHoverField?.(null);
                        }}
                      >
                        <span className="text-[9px] text-slate-400 block font-semibold">Invoice No.</span>
                        <span className="font-bold text-slate-900 font-mono text-[10px]">{meta.invoiceNo}</span>
                        {showBoxes && (
                          <div
                            className={`absolute -inset-1 border-2 rounded pointer-events-none transition-all ${
                              focusedFieldKey === 'invoice_number'
                                ? 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                : 'border-emerald-500 bg-emerald-500/10'
                            }`}
                          />
                        )}
                      </div>

                      {/* Invoice Date Bounding Box */}
                      <div
                        className="relative p-0.5 cursor-pointer"
                        onMouseEnter={() => {
                          setActiveTooltip('Invoice Date: 97% Conf');
                          onHoverField?.('invoice_date');
                        }}
                        onMouseLeave={() => {
                          setActiveTooltip(null);
                          onHoverField?.(null);
                        }}
                      >
                        <span className="text-[9px] text-slate-400 block font-semibold">Invoice Date</span>
                        <span className="font-medium text-slate-800">{meta.invoiceDate}</span>
                        {showBoxes && (
                          <div
                            className={`absolute -inset-1 border-2 rounded pointer-events-none transition-all ${
                              focusedFieldKey === 'invoice_date'
                                ? 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                : 'border-emerald-500 bg-emerald-500/10'
                            }`}
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block font-semibold">Bill To</span>
                      <span className="font-semibold text-slate-900 block text-[10px]">{meta.billToName}</span>
                      <span className="text-slate-500 text-[9px] block">{meta.billToAddress}</span>
                      
                      {/* GSTIN Bounding Box */}
                      <div
                        className="relative p-0.5 cursor-pointer mt-1"
                        onMouseEnter={() => {
                          setActiveTooltip('Vendor GSTIN: 96% Conf');
                          onHoverField?.('vendor_gstin');
                        }}
                        onMouseLeave={() => {
                          setActiveTooltip(null);
                          onHoverField?.(null);
                        }}
                      >
                        <span className="text-[9px] text-slate-400 block font-semibold">GSTIN</span>
                        <span className="font-mono text-slate-900 font-bold text-[9px]">{meta.billToGstin}</span>
                        {showBoxes && (
                          <div
                            className={`absolute -inset-1 border-2 rounded pointer-events-none transition-all ${
                              focusedFieldKey === 'vendor_gstin'
                                ? 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                : 'border-emerald-500 bg-emerald-500/10'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="mt-5">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 text-[9px] text-slate-400 uppercase">
                          <th className="py-1 font-bold">Description</th>
                          <th className="py-1 font-bold text-center">Qty</th>
                          <th className="py-1 font-bold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[9px]">
                        {meta.lineItems.map((item, idx) => (
                          <tr key={idx} className="relative">
                            <td className="py-2 font-medium text-slate-800">{item.description}</td>
                            <td className="py-2 text-center font-mono">{item.qty}</td>
                            <td className="py-2 text-right font-mono font-semibold">{item.amount}</td>
                            {showBoxes && idx === 1 && (
                              <td
                                colSpan={3}
                                className="absolute inset-0 border-2 border-emerald-500 bg-emerald-500/10 rounded pointer-events-none"
                              />
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals Section */}
                <div className="border-t border-slate-200 pt-3 flex flex-col items-end space-y-1 text-[10px]">
                  {/* Subtotal */}
                  <div
                    className="relative flex justify-between w-52 text-slate-600 p-0.5 cursor-pointer"
                    onMouseEnter={() => {
                      setActiveTooltip('Subtotal: 98% Conf');
                      onHoverField?.('subtotal');
                    }}
                    onMouseLeave={() => {
                      setActiveTooltip(null);
                      onHoverField?.(null);
                    }}
                  >
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-slate-900">{meta.subtotal}</span>
                    {showBoxes && (
                      <div
                        className={`absolute -inset-0.5 border-2 rounded pointer-events-none transition-all ${
                          focusedFieldKey === 'subtotal'
                            ? 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                            : 'border-emerald-500 bg-emerald-500/10'
                        }`}
                      />
                    )}
                  </div>

                  {/* Tax Row — Dynamic Amber (Warning) or Emerald (Approved) */}
                  <div
                    className="relative flex justify-between w-52 py-1 p-0.5 cursor-pointer"
                    onMouseEnter={() => {
                      setActiveTooltip(
                        isCorrupted ? 'Flagged GST Discrepancy (72% Conf)' : 'Verified GST (99% Conf)'
                      );
                      onHoverField?.('gst_amount');
                    }}
                    onMouseLeave={() => {
                      setActiveTooltip(null);
                      onHoverField?.(null);
                    }}
                  >
                    <span className="text-slate-600">{meta.taxLine}</span>
                    <span
                      className={`font-mono font-bold transition-colors ${
                        isCorrupted ? 'text-amber-600' : 'text-emerald-700'
                      }`}
                    >
                      {meta.taxAmount}
                    </span>
                    {showBoxes && (
                      <div
                        className={`absolute -inset-0.5 border-2 rounded pointer-events-none transition-all duration-300 ${
                          isCorrupted
                            ? 'border-amber-500 bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse'
                            : 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        }`}
                      />
                    )}
                  </div>

                  {/* Grand Total */}
                  <div
                    className="relative flex justify-between w-52 pt-2 border-t border-slate-300 font-bold text-[12px] text-slate-950 p-0.5 cursor-pointer"
                    onMouseEnter={() => {
                      setActiveTooltip('Total Amount: 97% Conf');
                      onHoverField?.('total_amount');
                    }}
                    onMouseLeave={() => {
                      setActiveTooltip(null);
                      onHoverField?.(null);
                    }}
                  >
                    <span>Total</span>
                    <span className="font-mono">{meta.totalAmount}</span>
                    {showBoxes && (
                      <div
                        className={`absolute -inset-0.5 border-2 rounded pointer-events-none transition-all ${
                          focusedFieldKey === 'total_amount'
                            ? 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                            : 'border-emerald-500 bg-emerald-500/10'
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hover Coordinate Tooltip */}
        {activeTooltip && (
          <div className="absolute top-4 left-6 bg-slate-900/95 border border-indigo-500 text-indigo-200 px-3 py-1 rounded-md text-[11px] font-mono shadow-2xl z-20 flex items-center gap-1.5 animate-fade-in">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>{activeTooltip}</span>
          </div>
        )}

        {/* Floating Zoom & Toolbar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/95 backdrop-blur border border-slate-700/80 px-4 py-1.5 rounded-full shadow-2xl z-30 text-xs font-mono text-slate-300">
          <button
            onClick={handleZoomOut}
            className="hover:text-white transition p-1 cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
          <span className="text-slate-200 font-semibold">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className="hover:text-white transition p-1 cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <div className="w-[1px] h-3.5 bg-slate-700" />
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            {showBoxes ? (
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>Boxes on</span>
          </button>
        </div>
      </div>
    </div>
  );
};
