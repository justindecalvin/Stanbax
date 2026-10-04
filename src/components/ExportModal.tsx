import React, { useState } from 'react';
import { WorkItem } from '../types/work';
import { X, Download, Copy, Check, Printer, FileJson } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  works: WorkItem[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  works,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadJson = () => {
    const exportData = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      totalWorks: works.length,
      works: works.map(w => ({
        id: w.id,
        title: w.title,
        description: w.description,
        category: w.category,
        tags: w.tags,
        fileName: w.fileName,
        fileType: w.fileType,
        fileSize: w.fileSize,
        clientOrContext: w.clientOrContext,
        externalUrl: w.externalUrl,
        createdAt: w.createdAt,
        aiAnalysis: w.aiAnalysis,
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atelier_vault_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySummaryText = async () => {
    const summaryLines = works.map((w, idx) => 
      `${idx + 1}. ${w.title} (${w.category})
   Context: ${w.clientOrContext || 'Independent Project'}
   Overview: ${w.description}
   Tags: ${w.tags.join(', ')}
   File: ${w.fileName} (${(w.fileSize / 1024).toFixed(1)} KB)`
    ).join('\n\n');

    const fullText = `ATELIER PORTFOLIO INDEX\nTotal Works: ${works.length}\nDate: ${new Date().toLocaleDateString()}\n\n${summaryLines}`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <div>
            <h2 className="text-base font-bold text-zinc-950">Export Portfolio & Archive</h2>
            <p className="text-xs text-zinc-500">Backup your work items or generate a client presentation index</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content options */}
        <div className="p-6 space-y-3">
          {/* JSON Archive */}
          <button
            onClick={handleDownloadJson}
            className="w-full p-4 rounded-xl border border-zinc-200 hover:border-zinc-900 bg-white hover:bg-zinc-50 transition-all text-left flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white flex items-center justify-center text-zinc-800 transition-colors shrink-0">
              <FileJson className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-zinc-900">Download Structured JSON Manifest</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Complete data backup containing project descriptions, tags, dates, and AI analysis records.
              </p>
            </div>
          </button>

          {/* Text Summary */}
          <button
            onClick={handleCopySummaryText}
            className="w-full p-4 rounded-xl border border-zinc-200 hover:border-zinc-900 bg-white hover:bg-zinc-50 transition-all text-left flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white flex items-center justify-center text-zinc-800 transition-colors shrink-0">
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-zinc-900">
                {copied ? 'Copied to Clipboard!' : 'Copy Formatted Text Index'}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Clean text portfolio outline formatted for emails, proposals, or grant submissions.
              </p>
            </div>
          </button>

          {/* Printable Sheet */}
          <button
            onClick={handlePrint}
            className="w-full p-4 rounded-xl border border-zinc-200 hover:border-zinc-900 bg-white hover:bg-zinc-50 transition-all text-left flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white flex items-center justify-center text-zinc-800 transition-colors shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-zinc-900">Print Portfolio Sheet (PDF)</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Generate a clean, printable catalog sheet or save directly as PDF via your browser.
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
