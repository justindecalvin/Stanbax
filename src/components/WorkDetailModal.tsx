import React, { useState } from 'react';
import { WorkItem } from '../types/work';
import { X, Download, ExternalLink, Sparkles, Copy, Check, FileText, Code2, Film, Music, ArrowUpRight, Share2, Trash2 } from 'lucide-react';
import { analyzeWorkItem } from '../lib/analyzer';

interface WorkDetailModalProps {
  work: WorkItem | null;
  onClose: () => void;
  onUpdateWork: (updated: WorkItem) => void;
  onDeleteWork: (id: string) => void;
}

export const WorkDetailModal: React.FC<WorkDetailModalProps> = ({
  work,
  onClose,
  onUpdateWork,
  onDeleteWork,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'details' | 'ai'>('details');

  if (!work) return null;

  const isImage = work.fileType.startsWith('image/') || work.fileName.match(/\.(png|jpg|jpeg|webp|svg|gif)$/i);
  const isCode = work.category === 'Code & Engineering' || work.fileContentText;
  const isVideo = work.fileType.startsWith('video/');
  const isAudio = work.fileType.startsWith('audio/');
  const isPDF = work.fileType.includes('pdf') || work.fileName.endsWith('.pdf');

  const formattedSize = work.fileSize > 1024 * 1024
    ? `${(work.fileSize / (1024 * 1024)).toFixed(2)} MB`
    : `${(work.fileSize / 1024).toFixed(1)} KB`;

  const handleDownload = () => {
    if (work.fileDataUrl) {
      const link = document.createElement('a');
      link.href = work.fileDataUrl;
      link.download = work.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (work.fileContentText) {
      const blob = new Blob([work.fileContentText], { type: work.fileType || 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = work.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyCode = async () => {
    if (!work.fileContentText) return;
    await navigator.clipboard.writeText(work.fileContentText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeWorkItem(work);
      const updated = { ...work, aiAnalysis: analysis };
      onUpdateWork(updated);
      setActiveSideTab('ai');
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
      <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden">
        {/* Top Bar Header */}
        <div className="h-14 px-6 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 truncate">
            <h2 className="text-base font-bold text-zinc-950 truncate">{work.title}</h2>
            <span className="hidden sm:inline-block text-xs font-mono text-zinc-400 tabular-nums">
              {work.fileName} · {formattedSize}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Download</span>
            </button>

            <button
              onClick={() => {
                onDeleteWork(work.id);
                onClose();
              }}
              title="Delete work"
              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-zinc-50">
          {/* Left Canvas / Media Viewer (60%) */}
          <div className="flex-1 bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative">
            {isImage && work.fileDataUrl ? (
              <div className="w-full h-full flex items-center justify-center overflow-auto">
                <img
                  src={work.fileDataUrl}
                  alt={work.title}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                />
              </div>
            ) : isCode && work.fileContentText ? (
              <div className="w-full h-full flex flex-col bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="px-4 py-2 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    {work.fileName}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Source'}</span>
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-auto font-mono text-xs text-zinc-200 leading-relaxed">
                  <pre className="whitespace-pre-wrap select-text">
                    {work.fileContentText}
                  </pre>
                </div>
              </div>
            ) : isVideo && work.fileDataUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <video
                  controls
                  className="max-h-full max-w-full rounded-lg shadow-lg"
                  src={work.fileDataUrl}
                />
              </div>
            ) : isAudio && work.fileDataUrl ? (
              <div className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl border border-zinc-800 text-center text-white">
                <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto flex items-center justify-center mb-4">
                  <Music className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-base font-semibold mb-1">{work.fileName}</h3>
                <p className="text-xs text-zinc-400 mb-6 font-mono">{formattedSize}</p>
                <audio controls className="w-full" src={work.fileDataUrl} />
              </div>
            ) : isPDF ? (
              <div className="w-full h-full flex flex-col bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="p-4 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 font-mono">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-400" />
                    PDF Document Reader
                  </span>
                  <button
                    onClick={handleDownload}
                    className="text-white hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                </div>
                {work.fileDataUrl ? (
                  <iframe
                    src={work.fileDataUrl}
                    className="w-full flex-1 bg-white"
                    title={work.title}
                  />
                ) : (
                  <div className="flex-1 p-6 text-zinc-300 font-sans overflow-auto">
                    <p className="text-xs font-mono text-zinc-500 mb-3">Extracted Manuscript Preview:</p>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed max-w-2xl bg-zinc-950 p-6 rounded-lg border border-zinc-800">
                      {work.fileContentText || 'PDF binary stored in local vault. Click Download PDF to inspect full document.'}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-zinc-400 p-8">
                <FileText className="w-12 h-12 mx-auto mb-3 text-zinc-500" />
                <p className="text-sm font-medium text-zinc-200">{work.fileName}</p>
                <p className="text-xs text-zinc-500 mt-1 font-mono">{formattedSize} · {work.fileType}</p>
              </div>
            )}
          </div>

          {/* Right Sidebar: Details & AI Critique (40%) */}
          <div className="w-full md:w-96 bg-white border-l border-zinc-200 flex flex-col shrink-0 overflow-hidden">
            {/* Side Tabs */}
            <div className="flex border-b border-zinc-200 bg-zinc-50/70 px-4 pt-2">
              <button
                onClick={() => setActiveSideTab('details')}
                className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors ${
                  activeSideTab === 'details'
                    ? 'border-zinc-950 text-zinc-950 font-semibold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Project Context
              </button>
              <button
                onClick={() => setActiveSideTab('ai')}
                className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeSideTab === 'ai'
                    ? 'border-zinc-950 text-zinc-950 font-semibold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI Critique & Review
              </button>
            </div>

            {/* Side Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {activeSideTab === 'details' ? (
                <>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                      Work Overview
                    </h3>
                    <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap">
                      {work.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-zinc-100 text-xs">
                    <div className="flex justify-between py-1 border-b border-zinc-100">
                      <span className="text-zinc-500">Discipline</span>
                      <span className="font-medium text-zinc-900">{work.category}</span>
                    </div>

                    {work.clientOrContext && (
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span className="text-zinc-500">Context / Client</span>
                        <span className="font-medium text-zinc-900">{work.clientOrContext}</span>
                      </div>
                    )}

                    <div className="flex justify-between py-1 border-b border-zinc-100 font-mono tabular-nums">
                      <span className="text-zinc-500 font-sans">Uploaded</span>
                      <span className="text-zinc-800">
                        {new Date(work.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-zinc-100 font-mono tabular-nums">
                      <span className="text-zinc-500 font-sans">File Size</span>
                      <span className="text-zinc-800">{formattedSize}</span>
                    </div>

                    {work.externalUrl && (
                      <div className="pt-2">
                        <span className="text-zinc-500 block mb-1">Live Reference</span>
                        <a
                          href={work.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 break-all"
                        >
                          <span>{work.externalUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Clean unboxed tags */}
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                      Tags & Metadata
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {work.tags.join(' · ')}
                    </p>
                  </div>

                  {/* Run AI button shortcut */}
                  <div className="pt-4 border-t border-zinc-100">
                    <button
                      onClick={handleRunAiAnalysis}
                      disabled={isAnalyzing}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{isAnalyzing ? 'Evaluating Work...' : 'Generate Expert AI Critique'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Executive Critique
                    </h3>
                    <button
                      onClick={handleRunAiAnalysis}
                      disabled={isAnalyzing}
                      className="text-xs text-zinc-600 hover:text-zinc-950 font-medium underline"
                    >
                      {isAnalyzing ? 'Re-evaluating...' : 'Regenerate'}
                    </button>
                  </div>

                  {work.aiAnalysis ? (
                    <div className="space-y-5 text-xs text-zinc-700">
                      {/* Executive summary */}
                      <div className="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl">
                        <p className="font-medium text-zinc-900 leading-relaxed">
                          {work.aiAnalysis.summary}
                        </p>
                      </div>

                      {/* Strengths */}
                      <div>
                        <h4 className="font-semibold text-zinc-900 mb-2">Key Strengths</h4>
                        <ul className="space-y-1.5 pl-4 list-disc text-zinc-600 marker:text-zinc-400">
                          {work.aiAnalysis.strengths.map((str, idx) => (
                            <li key={idx} className="leading-relaxed">{str}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Opportunities */}
                      <div>
                        <h4 className="font-semibold text-zinc-900 mb-2">Growth Opportunities</h4>
                        <ul className="space-y-1.5 pl-4 list-disc text-zinc-600 marker:text-zinc-400">
                          {work.aiAnalysis.suggestedImprovements.map((imp, idx) => (
                            <li key={idx} className="leading-relaxed">{imp}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Presentation Tips */}
                      <div>
                        <h4 className="font-semibold text-zinc-900 mb-2">Portfolio Presentation Advice</h4>
                        <ul className="space-y-1.5 pl-4 list-disc text-zinc-600 marker:text-zinc-400">
                          {work.aiAnalysis.presentationTips.map((tip, idx) => (
                            <li key={idx} className="leading-relaxed">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 px-4">
                      <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                      <h4 className="text-sm font-semibold text-zinc-900">No Review Generated Yet</h4>
                      <p className="text-xs text-zinc-500 mt-1 mb-4 leading-relaxed">
                        Let AI analyze this artifact's architecture, aesthetic balance, and portfolio presentation.
                      </p>
                      <button
                        onClick={handleRunAiAnalysis}
                        disabled={isAnalyzing}
                        className="py-2 px-4 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
