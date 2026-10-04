import React from 'react';
import { WorkItem } from '../types/work';
import { FileText, Code2, Film, Music, Eye, Download, Sparkles, ExternalLink, Trash2 } from 'lucide-react';

interface WorkCardProps {
  work: WorkItem;
  onSelect: (work: WorkItem) => void;
  onAnalyze: (work: WorkItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const WorkCard: React.FC<WorkCardProps> = ({
  work,
  onSelect,
  onAnalyze,
  onDelete,
}) => {
  const isImage = work.fileType.startsWith('image/') || work.fileName.match(/\.(png|jpg|jpeg|webp|svg|gif)$/i);
  const isCode = work.category === 'Code & Engineering' || work.fileType.startsWith('text/') || work.fileContentText;
  const isAudioOrVideo = work.category === 'Media & Audio' || work.fileType.startsWith('audio/') || work.fileType.startsWith('video/');
  const isPDF = work.fileType.includes('pdf') || work.fileName.endsWith('.pdf');

  const formattedSize = work.fileSize > 1024 * 1024
    ? `${(work.fileSize / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(work.fileSize / 1024 || 1)} KB`;

  const formattedDate = new Date(work.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      onClick={() => onSelect(work)}
      className="group relative flex flex-col bg-white rounded-2xl border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Visual / Media Container */}
      <div className="relative w-full aspect-16/10 bg-zinc-950/5 border-b border-zinc-100 overflow-hidden flex items-center justify-center">
        {isImage && work.fileDataUrl ? (
          <img
            src={work.fileDataUrl}
            alt={work.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : isCode && work.fileContentText ? (
          <div className="w-full h-full p-4 bg-zinc-950 text-zinc-300 font-mono text-[11px] leading-relaxed overflow-hidden select-none">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-zinc-500 text-[10px]">
              <span>{work.fileName}</span>
              <span>UTF-8</span>
            </div>
            <pre className="text-zinc-400 opacity-90 line-clamp-6 whitespace-pre font-mono">
              {work.fileContentText.slice(0, 320)}
            </pre>
          </div>
        ) : isPDF ? (
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-zinc-50">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-2 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-zinc-800">{work.fileName}</p>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Portable Document Format</p>
          </div>
        ) : isAudioOrVideo ? (
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-zinc-900 text-white">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-2">
              {work.fileType.startsWith('video') ? <Film className="w-6 h-6 text-zinc-300" /> : <Music className="w-6 h-6 text-zinc-300" />}
            </div>
            <p className="text-xs font-medium text-zinc-200">{work.fileName}</p>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Media Reel</p>
          </div>
        ) : (
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-zinc-50">
            <FileText className="w-8 h-8 text-zinc-400 mb-2" />
            <p className="text-xs font-medium text-zinc-700">{work.fileName}</p>
          </div>
        )}

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-zinc-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(work);
            }}
            className="px-3 py-1.5 text-xs font-medium text-zinc-900 bg-white rounded-lg shadow-sm hover:bg-zinc-50 transition-colors flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            Inspect
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAnalyze(work);
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 rounded-lg shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI Critique
          </button>
        </div>

        {/* Delete Button (quiet in top right) */}
        <button
          type="button"
          onClick={(e) => onDelete(work.id, e)}
          title="Remove from vault"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-white/90 text-zinc-400 hover:text-rose-600 hover:bg-white shadow-xs opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content & Metadata */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Strict Zero-Pill: Clean unboxed metadata with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono tabular-nums mb-2">
            <span className="font-sans font-medium text-zinc-700">{work.category}</span>
            <span aria-hidden="true">·</span>
            <span>{formattedSize}</span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate}</span>
          </div>

          <h3 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-950 transition-colors line-clamp-1">
            {work.title}
          </h3>

          <p className="mt-1.5 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
            {work.description}
          </p>
        </div>

        {/* Tags & Context footer (No pill capsules, subtle text separators) */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 truncate max-w-[75%]">
            {work.clientOrContext && (
              <>
                <span className="text-zinc-700 font-medium truncate">{work.clientOrContext}</span>
                <span aria-hidden="true">/</span>
              </>
            )}
            <span className="truncate">{work.tags.slice(0, 3).join(', ')}</span>
          </div>

          {work.aiAnalysis && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 shrink-0">
              <Sparkles className="w-3 h-3" />
              Reviewed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
